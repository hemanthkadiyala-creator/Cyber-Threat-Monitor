import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function getSupabaseClient(req: Request) {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "") ?? "";
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  return supabase;
}

function getSupabaseAdmin() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  return createClient(supabaseUrl, serviceKey);
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
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function errorResponse(message: string, status = 400) {
  return jsonResponse({ error: message }, status);
}

// Route handler
async function handleRequest(req: Request) {
  const url = new URL(req.url);
  const path = url.pathname.replace("/api", "");
  const method = req.method;

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
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("projects")
      .insert(body)
      .select()
      .single();
    if (error) return errorResponse(error.message);
    return jsonResponse(data, 201);
  }

  // PUT /projects/:id (admin only)
  const projectMatch = path.match(/^\/projects\/([a-f0-9-]+)$/);
  if (projectMatch && method === "PUT") {
    const admin = await verifyAdmin(req);
    if (!admin) return errorResponse("Unauthorized", 401);
    const body = await req.json();
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("projects")
      .update(body)
      .eq("id", projectMatch[1])
      .select()
      .single();
    if (error) return errorResponse(error.message);
    return jsonResponse(data);
  }

  // DELETE /projects/:id (admin only)
  if (projectMatch && method === "DELETE") {
    const admin = await verifyAdmin(req);
    if (!admin) return errorResponse("Unauthorized", 401);
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectMatch[1]);
    if (error) return errorResponse(error.message);
    return jsonResponse({ success: true });
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

  // POST /certifications (admin only)
  if (path === "/certifications" && method === "POST") {
    const admin = await verifyAdmin(req);
    if (!admin) return errorResponse("Unauthorized", 401);
    const body = await req.json();
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("certifications")
      .insert(body)
      .select()
      .single();
    if (error) return errorResponse(error.message);
    return jsonResponse(data, 201);
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
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
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
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("blog_posts")
      .insert({ ...body, author_id: admin.id })
      .select()
      .single();
    if (error) return errorResponse(error.message);
    return jsonResponse(data, 201);
  }

  // PUT /blog/:id (admin)
  const blogIdMatch = path.match(/^\/blog\/id\/([a-f0-9-]+)$/);
  if (blogIdMatch && method === "PUT") {
    const admin = await verifyAdmin(req);
    if (!admin) return errorResponse("Unauthorized", 401);
    const body = await req.json();
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("blog_posts")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", blogIdMatch[1])
      .select()
      .single();
    if (error) return errorResponse(error.message);
    return jsonResponse(data);
  }

  // DELETE /blog/:id (admin)
  if (blogIdMatch && method === "DELETE") {
    const admin = await verifyAdmin(req);
    if (!admin) return errorResponse("Unauthorized", 401);
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", blogIdMatch[1]);
    if (error) return errorResponse(error.message);
    return jsonResponse({ success: true });
  }

  // POST /contact
  if (path === "/contact" && method === "POST") {
    const body = await req.json();
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("contact_messages")
      .insert(body)
      .select()
      .single();
    if (error) return errorResponse(error.message);
    return jsonResponse(data, 201);
  }

  // GET /contact (admin)
  if (path === "/contact" && method === "GET") {
    const admin = await verifyAdmin(req);
    if (!admin) return errorResponse("Unauthorized", 401);
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
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
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("soc_incidents")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", incidentMatch[1])
      .select()
      .single();
    if (error) return errorResponse(error.message);
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

  // POST /scan
  if (path === "/scan" && method === "POST") {
    const admin = await verifyAdmin(req);
    if (!admin) return errorResponse("Unauthorized", 401);
    const body = await req.json();
    const supabase = getSupabaseAdmin();

    // Simulate vulnerability scan
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

    const { data, error } = await supabase
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

  // GET /stats
  if (path === "/stats" && method === "GET") {
    const supabase = getSupabaseClient(req);
    const { count } = await supabase
      .from("visitors")
      .select("*", { count: "exact", head: true });
    return jsonResponse({ visitors: count ?? 0 });
  }

  // POST /visit
  if (path === "/visit" && method === "POST") {
    const body = await req.json();
    const supabase = getSupabaseAdmin();
    await supabase.from("visitors").insert({
      page: body.page || "/",
      referrer: body.referrer || "",
      user_agent: body.userAgent || "",
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

function getPortService(port: number): string {
  const services: Record<number, string> = {
    21: "FTP", 22: "SSH", 23: "Telnet", 25: "SMTP", 53: "DNS",
    80: "HTTP", 110: "POP3", 143: "IMAP", 443: "HTTPS", 445: "SMB",
    993: "IMAPS", 995: "POP3S", 3306: "MySQL", 3389: "RDP",
    5432: "PostgreSQL", 5900: "VNC", 8080: "HTTP-Alt", 8443: "HTTPS-Alt",
  };
  return services[port] || "Unknown";
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
