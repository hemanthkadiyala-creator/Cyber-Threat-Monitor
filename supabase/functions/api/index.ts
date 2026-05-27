import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Security Headers for all responses
const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
};

const RATE_LIMITS: Record<string, { maxAttempts: number; windowMs: number }> = {
  login: { maxAttempts: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 min
  contact: { maxAttempts: 3, windowMs: 60 * 60 * 1000 }, // 3 per hour
  scan: { maxAttempts: 10, windowMs: 60 * 60 * 1000 }, // 10 per hour
};

function getClientIP(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

function getUserAgent(req: Request): string {
  return req.headers.get("user-agent") || "unknown";
}

function getSupabaseClient(req: Request) {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "") ?? "";
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  return createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}

function getSupabaseAdmin() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  return createClient(supabaseUrl, serviceKey);
}

async function logAuthEvent(
  adminClient: ReturnType<typeof getSupabaseAdmin>,
  data: {
    email: string;
    event_type: string;
    ip_address: string;
    user_agent: string;
    success: boolean;
    failure_reason?: string;
    user_id?: string;
    session_id?: string;
  }
) {
  await adminClient.from("auth_logs").insert({
    email: data.email,
    event_type: data.event_type,
    ip_address: data.ip_address,
    user_agent: data.user_agent,
    success: data.success,
    failure_reason: data.failure_reason || "",
    user_id: data.user_id || null,
    session_id: data.session_id || "",
  });
}

async function logSecurityEvent(
  adminClient: ReturnType<typeof getSupabaseAdmin>,
  data: {
    event_type: string;
    severity: string;
    source: string;
    description: string;
    ip_address: string;
    user_id?: string;
    metadata?: Record<string, unknown>;
  }
) {
  await adminClient.from("security_events").insert({
    event_type: data.event_type,
    severity: data.severity,
    source: data.source,
    description: data.description,
    ip_address: data.ip_address,
    user_id: data.user_id || null,
    metadata: data.metadata || {},
  });
}

async function checkRateLimit(
  adminClient: ReturnType<typeof getSupabaseAdmin>,
  identifier: string,
  actionType: string
): Promise<{ allowed: boolean; remaining: number; blocked: boolean }> {
  const limit = RATE_LIMITS[actionType];
  if (!limit) return { allowed: true, remaining: 999, blocked: false };

  const now = new Date();
  const windowStart = new Date(now.getTime() - limit.windowMs);

  const { data: existing } = await adminClient
    .from("rate_limits")
    .select("*")
    .eq("identifier", identifier)
    .eq("action_type", actionType)
    .maybeSingle();

  if (!existing) {
    await adminClient.from("rate_limits").insert({
      identifier,
      action_type: actionType,
      attempt_count: 1,
      first_attempt: now.toISOString(),
      last_attempt: now.toISOString(),
    });
    return { allowed: true, remaining: limit.maxAttempts - 1, blocked: false };
  }

  // Check if blocked
  if (existing.blocked && existing.blocked_until && new Date(existing.blocked_until) > now) {
    return { allowed: false, remaining: 0, blocked: true };
  }

  // Check if window expired - reset counter
  if (new Date(existing.first_attempt) < windowStart) {
    await adminClient
      .from("rate_limits")
      .update({
        attempt_count: 1,
        first_attempt: now.toISOString(),
        last_attempt: now.toISOString(),
        blocked: false,
        blocked_until: null,
      })
      .eq("id", existing.id);
    return { allowed: true, remaining: limit.maxAttempts - 1, blocked: false };
  }

  const newCount = existing.attempt_count + 1;

  if (newCount >= limit.maxAttempts) {
    await adminClient
      .from("rate_limits")
      .update({
        attempt_count: newCount,
        last_attempt: now.toISOString(),
        blocked: true,
        blocked_until: new Date(now.getTime() + limit.windowMs).toISOString(),
      })
      .eq("id", existing.id);

    await logSecurityEvent(adminClient, {
      event_type: "rate_limit_exceeded",
      severity: "medium",
      source: "rate_limiter",
      description: `Rate limit exceeded for ${actionType}`,
      ip_address: identifier.includes(".") ? identifier : "",
      metadata: { action_type: actionType, attempts: newCount },
    });

    return { allowed: false, remaining: 0, blocked: true };
  }

  await adminClient
    .from("rate_limits")
    .update({
      attempt_count: newCount,
      last_attempt: now.toISOString(),
    })
    .eq("id", existing.id);

  return { allowed: true, remaining: limit.maxAttempts - newCount, blocked: false };
}

async function detectSuspiciousActivity(
  adminClient: ReturnType<typeof getSupabaseAdmin>,
  identifier: string,
  eventType: string
): Promise<boolean> {
  // Check for brute force - 10+ failed logins in 1 hour
  if (eventType === "login_failed") {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const { count } = await adminClient
      .from("auth_logs")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", identifier)
      .eq("event_type", "login_failed")
      .gte("created_at", oneHourAgo.toISOString());

    if (count && count >= 10) {
      await adminClient.from("suspicious_activities").insert({
        activity_type: "brute_force_attempt",
        severity: "high",
        description: `10+ failed login attempts from IP ${identifier}`,
        ip_address: identifier,
        evidence: { failed_attempts: count, time_window: "1h" },
      });

      await logSecurityEvent(adminClient, {
        event_type: "brute_force_detected",
        severity: "high",
        source: "intrusion_detection",
        description: `Potential brute force attack from ${identifier}`,
        ip_address: identifier,
        metadata: { failed_attempts: count },
      });

      return true;
    }
  }

  return false;
}

async function verifyAdmin(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "");
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const adminClient = createClient(supabaseUrl, serviceKey);
  const { data: { user }, error } = await adminClient.auth.getUser(token);
  if (error || !user) return null;
  const { data: profile } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  return profile?.role === "admin" ? user : null;
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, ...securityHeaders, "Content-Type": "application/json" },
  });
}

function errorResponse(message: string, status = 400) {
  return jsonResponse({ error: message }, status);
}

// Main request handler
async function handleRequest(req: Request) {
  const url = new URL(req.url);
  const path = url.pathname.replace("/api", "");
  const method = req.method;
  const clientIP = getClientIP(req);
  const userAgent = getUserAgent(req);
  const adminClient = getSupabaseAdmin();

  // GET /security/logs
  if (path === "/security/logs" && method === "GET") {
    const admin = await verifyAdmin(req);
    if (!admin) return errorResponse("Unauthorized", 401);

    const type = url.searchParams.get("type") || "auth";
    const limit = parseInt(url.searchParams.get("limit") || "100");

    if (type === "auth") {
      const { data, error } = await adminClient
        .from("auth_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) return errorResponse(error.message);
      return jsonResponse(data);
    }

    if (type === "security") {
      const { data, error } = await adminClient
        .from("security_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) return errorResponse(error.message);
      return jsonResponse(data);
    }

    if (type === "suspicious") {
      const { data, error } = await adminClient
        .from("suspicious_activities")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) return errorResponse(error.message);
      return jsonResponse(data);
    }
  }

  // GET /security/stats
  if (path === "/security/stats" && method === "GET") {
    const admin = await verifyAdmin(req);
    if (!admin) return errorResponse("Unauthorized", 401);

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [loginsResult, failedResult, eventsResult, suspiciousResult] = await Promise.all([
      adminClient.from("auth_logs").select("*", { count: "exact", head: true }).eq("event_type", "login_success").gte("created_at", oneDayAgo.toISOString()),
      adminClient.from("auth_logs").select("*", { count: "exact", head: true }).eq("event_type", "login_failed").gte("created_at", oneDayAgo.toISOString()),
      adminClient.from("security_events").select("*", { count: "exact", head: true }).gte("created_at", oneDayAgo.toISOString()),
      adminClient.from("suspicious_activities").select("*", { count: "exact", head: true }).eq("status", "flagged").gte("created_at", oneDayAgo.toISOString()),
    ]);

    return jsonResponse({
      logins_24h: loginsResult.count || 0,
      failed_logins_24h: failedResult.count || 0,
      security_events_24h: eventsResult.count || 0,
      flagged_activities: suspiciousResult.count || 0,
    });
  }

  // POST /security/log/auth - Log auth events
  if (path === "/security/log/auth" && method === "POST") {
    const body = await req.json();
    await logAuthEvent(adminClient, {
      email: body.email || "",
      event_type: body.event_type || "login_failed",
      ip_address: clientIP,
      user_agent: userAgent,
      success: body.success || false,
      failure_reason: body.failure_reason || "",
      user_id: body.user_id,
    });

    // Check for suspicious activity
    if (body.event_type === "login_failed") {
      await detectSuspiciousActivity(adminClient, clientIP, "login_failed");
    }

    return jsonResponse({ logged: true });
  }

  // POST /auth/login with rate limiting
  if (path === "/auth/login" && method === "POST") {
    const { email, password } = await req.json();

    // Check rate limit
    const rateCheck = await checkRateLimit(adminClient, clientIP, "login");
    if (!rateCheck.allowed) {
      await logAuthEvent(adminClient, {
        email: email || "unknown",
        event_type: "login_failed",
        ip_address: clientIP,
        user_agent: userAgent,
        success: false,
        failure_reason: "Rate limit exceeded",
      });

      return errorResponse("Too many login attempts. Please try again later.", 429);
    }

    const supabase = getSupabaseClient(req);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        await logAuthEvent(adminClient, {
          email,
          event_type: "login_failed",
          ip_address: clientIP,
          user_agent: userAgent,
          success: false,
          failure_reason: error.message,
        });

        await detectSuspiciousActivity(adminClient, clientIP, "login_failed");

        return errorResponse("Invalid credentials", 401);
      }

      await logAuthEvent(adminClient, {
        email,
        event_type: "login_success",
        ip_address: clientIP,
        user_agent: userAgent,
        success: true,
        user_id: data.user?.id,
        session_id: data.session?.access_token?.slice(0, 16) || "",
      });

      return jsonResponse({
        user: data.user,
        session: data.session,
        rate_limit: { remaining: rateCheck.remaining },
      });
    } catch (err: any) {
      await logAuthEvent(adminClient, {
        email,
        event_type: "login_failed",
        ip_address: clientIP,
        user_agent: userAgent,
        success: false,
        failure_reason: err.message || "Unknown error",
      });

      return errorResponse("Authentication failed", 500);
    }
  }

  // GET /projects
  if (path === "/projects" && method === "GET") {
    const supabase = getSupabaseClient(req);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return errorResponse(error.message);
    return jsonResponse(data);
  }

  // POST /projects (admin only)
  if (path === "/projects" && method === "POST") {
    const admin = await verifyAdmin(req);
    if (!admin) return errorResponse("Unauthorized", 401);

    const body = await req.json();
    const { data, error } = await adminClient
      .from("projects")
      .insert(body)
      .select()
      .single();

    if (error) return errorResponse(error.message);

    // Log admin action
    await adminClient.from("admin_audit_log").insert({
      admin_id: admin.id,
      action: "create",
      resource_type: "project",
      resource_id: data.id,
      ip_address: clientIP,
    });

    return jsonResponse(data, 201);
  }

  // GET /certifications
  if (path === "/certifications" && method === "GET") {
    const supabase = getSupabaseClient(req);
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .order("issue_date", { ascending: false });
    if (error) return errorResponse(error.message);
    return jsonResponse(data);
  }

  // GET /skills
  if (path === "/skills" && method === "GET") {
    const supabase = getSupabaseClient(req);
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("category", { ascending: true });
    if (error) return errorResponse(error.message);
    return jsonResponse(data);
  }

  // GET /experience
  if (path === "/experience" && method === "GET") {
    const supabase = getSupabaseClient(req);
    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .order("start_date", { ascending: false });
    if (error) return errorResponse(error.message);
    return jsonResponse(data);
  }

  // GET /blog
  if (path === "/blog" && method === "GET") {
    const supabase = getSupabaseClient(req);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (error) return errorResponse(error.message);
    return jsonResponse(data);
  }

  // GET /blog/all (admin)
  if (path === "/blog/all" && method === "GET") {
    const admin = await verifyAdmin(req);
    if (!admin) return errorResponse("Unauthorized", 401);
    const { data, error } = await adminClient
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return errorResponse(error.message);
    return jsonResponse(data);
  }

  // GET /blog/:slug
  const blogMatch = path.match(/^\/blog\/([a-z0-9-]+)$/);
  if (blogMatch && method === "GET") {
    const supabase = getSupabaseClient(req);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", blogMatch[1])
      .eq("published", true)
      .maybeSingle();
    if (error) return errorResponse(error.message);
    if (!data) return errorResponse("Post not found", 404);
    return jsonResponse(data);
  }

  // POST /blog (admin)
  if (path === "/blog" && method === "POST") {
    const admin = await verifyAdmin(req);
    if (!admin) return errorResponse("Unauthorized", 401);
    const body = await req.json();
    const { data, error } = await adminClient
      .from("blog_posts")
      .insert({ ...body, author_id: admin.id })
      .select()
      .single();
    if (error) return errorResponse(error.message);

    await adminClient.from("admin_audit_log").insert({
      admin_id: admin.id,
      action: "create",
      resource_type: "blog_post",
      resource_id: data.id,
      ip_address: clientIP,
    });

    return jsonResponse(data, 201);
  }

  // PUT /blog/:id (admin)
  const blogIdMatch = path.match(/^\/blog\/id\/([a-f0-9-]+)$/);
  if (blogIdMatch && method === "PUT") {
    const admin = await verifyAdmin(req);
    if (!admin) return errorResponse("Unauthorized", 401);
    const body = await req.json();
    const { data, error } = await adminClient
      .from("blog_posts")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", blogIdMatch[1])
      .select()
      .single();
    if (error) return errorResponse(error.message);

    await adminClient.from("admin_audit_log").insert({
      admin_id: admin.id,
      action: "update",
      resource_type: "blog_post",
      resource_id: blogIdMatch[1],
      ip_address: clientIP,
    });

    return jsonResponse(data);
  }

  // DELETE /blog/:id (admin)
  if (blogIdMatch && method === "DELETE") {
    const admin = await verifyAdmin(req);
    if (!admin) return errorResponse("Unauthorized", 401);
    const { error } = await adminClient
      .from("blog_posts")
      .delete()
      .eq("id", blogIdMatch[1]);
    if (error) return errorResponse(error.message);

    await adminClient.from("admin_audit_log").insert({
      admin_id: admin.id,
      action: "delete",
      resource_type: "blog_post",
      resource_id: blogIdMatch[1],
      ip_address: clientIP,
    });

    return jsonResponse({ success: true });
  }

  // POST /contact with rate limiting
  if (path === "/contact" && method === "POST") {
    const body = await req.json();

    // Rate limit contact form
    const rateCheck = await checkRateLimit(adminClient, clientIP, "contact");
    if (!rateCheck.allowed) {
      await logSecurityEvent(adminClient, {
        event_type: "rate_limit_exceeded",
        severity: "medium",
        source: "contact_form",
        description: "Contact form rate limit exceeded",
        ip_address: clientIP,
      });
      return errorResponse("Too many messages. Please wait before submitting again.", 429);
    }

    const { data, error } = await adminClient
      .from("contact_messages")
      .insert(body)
      .select()
      .single();
    if (error) return errorResponse(error.message);

    await logSecurityEvent(adminClient, {
      event_type: "contact_form_submission",
      severity: "info",
      source: "contact_form",
      description: `New contact message from ${body.email}`,
      ip_address: clientIP,
      metadata: { name: body.name, subject: body.subject },
    });

    return jsonResponse(data, 201);
  }

  // GET /contact (admin)
  if (path === "/contact" && method === "GET") {
    const admin = await verifyAdmin(req);
    if (!admin) return errorResponse("Unauthorized", 401);
    const { data, error } = await adminClient
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return errorResponse(error.message);
    return jsonResponse(data);
  }

  // GET /soc/incidents
  if (path === "/soc/incidents" && method === "GET") {
    const supabase = getSupabaseClient(req);
    const severity = url.searchParams.get("severity");
    const status = url.searchParams.get("status");
    let query = supabase.from("soc_incidents").select("*");
    if (severity) query = query.eq("severity", severity);
    if (status) query = query.eq("status", status);
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) return errorResponse(error.message);
    return jsonResponse(data);
  }

  // PUT /soc/incidents/:id
  const incidentMatch = path.match(/^\/soc\/incidents\/([a-f0-9-]+)$/);
  if (incidentMatch && method === "PUT") {
    const admin = await verifyAdmin(req);
    if (!admin) return errorResponse("Unauthorized", 401);
    const body = await req.json();
    const { data, error } = await adminClient
      .from("soc_incidents")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", incidentMatch[1])
      .select()
      .single();
    if (error) return errorResponse(error.message);

    await adminClient.from("admin_audit_log").insert({
      admin_id: admin.id,
      action: "update_incident",
      resource_type: "soc_incident",
      resource_id: incidentMatch[1],
      ip_address: clientIP,
      details: body,
    });

    return jsonResponse(data);
  }

  // GET /threats
  if (path === "/threats" && method === "GET") {
    const supabase = getSupabaseClient(req);
    const type = url.searchParams.get("type");
    const severity = url.searchParams.get("severity");
    let query = supabase.from("threat_indicators").select("*");
    if (type) query = query.eq("type", type);
    if (severity) query = query.eq("severity", severity);
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) return errorResponse(error.message);
    return jsonResponse(data);
  }

  // POST /scan with rate limiting
  if (path === "/scan" && method === "POST") {
    const admin = await verifyAdmin(req);
    if (!admin) return errorResponse("Unauthorized", 401);

    const rateCheck = await checkRateLimit(adminClient, clientIP, "scan");
    if (!rateCheck.allowed) {
      return errorResponse("Scan rate limit exceeded", 429);
    }

    const body = await req.json();
    const target = body.target || "192.168.1.1";
    const commonPorts = [21, 22, 23, 25, 53, 80, 110, 143, 443, 445, 993, 995, 3306, 3389, 5432, 5900, 8080, 8443];
    const openPorts = commonPorts.filter(() => Math.random() > 0.7);
    const vulnerabilities = openPorts.map((port) => {
      const vulns = [
        { title: "Outdated Software Version", severity: "high", description: `Service on port ${port} is running an outdated version with known vulnerabilities.`, recommendation: "Update to the latest stable version." },
        { title: "Weak Authentication", severity: "medium", description: `Service on port ${port} allows weak authentication mechanisms.`, recommendation: "Enforce strong password policies and enable MFA." },
        { title: "Information Disclosure", severity: "low", description: `Service on port ${port} reveals version information in banners.`, recommendation: "Configure service to hide version information." },
        { title: "Default Credentials", severity: "critical", description: `Service on port ${port} may be using default credentials.`, recommendation: "Change default credentials immediately." },
      ];
      return vulns[Math.floor(Math.random() * vulns.length)];
    });

    const getPortService = (port: number): string => {
      const services: Record<number, string> = {
        21: "FTP", 22: "SSH", 23: "Telnet", 25: "SMTP", 53: "DNS",
        80: "HTTP", 110: "POP3", 143: "IMAP", 443: "HTTPS", 445: "SMB",
        993: "IMAPS", 995: "POP3S", 3306: "MySQL", 3389: "RDP",
        5432: "PostgreSQL", 5900: "VNC", 8080: "HTTP-Alt", 8443: "HTTPS-Alt",
      };
      return services[port] || "Unknown";
    };

    const { data, error } = await adminClient
      .from("scan_results")
      .insert({
        target,
        ports: openPorts.map((p) => ({ port: p, state: "open", service: getPortService(p) })),
        vulnerabilities,
        scan_type: body.scan_type || "quick",
        status: "completed",
        completed_at: new Date().toISOString(),
        created_by: admin.id,
      })
      .select()
      .single();
    if (error) return errorResponse(error.message);

    await adminClient.from("admin_audit_log").insert({
      admin_id: admin.id,
      action: "vulnerability_scan",
      resource_type: "scan_result",
      resource_id: data.id,
      ip_address: clientIP,
      details: { target, scan_type: body.scan_type },
    });

    return jsonResponse(data, 201);
  }

  // GET /scans
  if (path === "/scans" && method === "GET") {
    const supabase = getSupabaseClient(req);
    const { data, error } = await supabase
      .from("scan_results")
      .select("*")
      .order("started_at", { ascending: false });
    if (error) return errorResponse(error.message);
    return jsonResponse(data);
  }

  // POST /visit
  if (path === "/visit" && method === "POST") {
    const body = await req.json();
    await adminClient.from("visitors").insert({
      page: body.page || "/",
      referrer: body.referrer || "",
      user_agent: userAgent,
    });
    return jsonResponse({ success: true });
  }

  // GET /visitor-count
  if (path === "/visitor-count" && method === "GET") {
    const supabase = getSupabaseClient(req);
    const { count } = await supabase
      .from("visitors")
      .select("*", { count: "exact", head: true });
    return jsonResponse({ count: count ?? 0 });
  }

  return errorResponse("Not found", 404);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    return await handleRequest(req);
  } catch (err) {
    console.error("API Error:", err);
    return errorResponse("Internal server error", 500);
  }
});
