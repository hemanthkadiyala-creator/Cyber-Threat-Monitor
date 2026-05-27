/*
  # Security Logging & Audit Infrastructure

  This migration adds comprehensive security logging capabilities:
  - Authentication logs (successful/failed logins)
  - Device/IP tracking
  - Suspicious activity detection
  - Admin audit trail
  - Rate limiting tracking
  - Security events for SIEM dashboard

  ## New Tables:
  1. `auth_logs` - All authentication attempts with device fingerprinting
  2. `security_events` - SIEM-style security event log
  3. `admin_audit_log` - Admin action tracking
  4. `rate_limits` - Rate limiting tracking
  5. `suspicious_activities` - Flagged suspicious behavior

  ## Security Features:
  - IP geolocation tracking (future)
  - Device fingerprinting
  - Failed login tracking for brute-force detection
  - Session tracking
  - Admin action accountability
*/

-- Authentication logs table
CREATE TABLE IF NOT EXISTS auth_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  email text NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('login_success', 'login_failed', 'logout', 'password_reset', 'mfa_challenge', 'mfa_success', 'mfa_failed', 'session_expired')),
  ip_address text NOT NULL,
  user_agent text DEFAULT '',
  device_fingerprint text DEFAULT '',
  location_country text DEFAULT '',
  location_city text DEFAULT '',
  success boolean DEFAULT false,
  failure_reason text DEFAULT '',
  session_id text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Security events table (SIEM-style)
CREATE TABLE IF NOT EXISTS security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('info', 'low', 'medium', 'high', 'critical')),
  source text NOT NULL,
  description text NOT NULL,
  ip_address text DEFAULT '',
  user_id uuid REFERENCES auth.users(id),
  metadata jsonb DEFAULT '{}',
  resolved boolean DEFAULT false,
  resolved_by uuid REFERENCES auth.users(id),
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Admin audit log
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users(id) NOT NULL,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text DEFAULT '',
  details jsonb DEFAULT '{}',
  ip_address text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Rate limiting table
CREATE TABLE IF NOT EXISTS rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL,
  action_type text NOT NULL,
  attempt_count integer DEFAULT 1,
  first_attempt timestamptz DEFAULT now(),
  last_attempt timestamptz DEFAULT now(),
  blocked boolean DEFAULT false,
  blocked_until timestamptz
);

-- Suspicious activities table
CREATE TABLE IF NOT EXISTS suspicious_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  activity_type text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description text NOT NULL,
  ip_address text DEFAULT '',
  user_agent text DEFAULT '',
  evidence jsonb DEFAULT '{}',
  status text DEFAULT 'flagged' CHECK (status IN ('flagged', 'investigating', 'resolved', 'false_positive')),
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE auth_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE suspicious_activities ENABLE ROW LEVEL SECURITY;

-- Auth logs policies
CREATE POLICY "Admins can view all auth logs"
  ON auth_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can view own auth logs"
  ON auth_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Service role can insert auth logs"
  ON auth_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anon can insert auth logs (for login tracking)"
  ON auth_logs FOR INSERT
  TO anon
  WITH CHECK (true);

-- Security events policies
CREATE POLICY "Admins can view all security events"
  ON security_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update security events"
  ON security_events FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Service can insert security events"
  ON security_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anon can insert security events"
  ON security_events FOR INSERT
  TO anon
  WITH CHECK (true);

-- Admin audit log policies
CREATE POLICY "Admins can view audit log"
  ON admin_audit_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can insert audit log"
  ON admin_audit_log FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Rate limits policies
CREATE POLICY "Service can manage rate limits"
  ON rate_limits FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon can manage rate limits"
  ON rate_limits FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Suspicious activities policies
CREATE POLICY "Admins can view suspicious activities"
  ON suspicious_activities FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update suspicious activities"
  ON suspicious_activities FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Service can insert suspicious activities"
  ON suspicious_activities FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_auth_logs_user_id ON auth_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_logs_ip_address ON auth_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_auth_logs_created_at ON auth_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_admin_id ON admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON rate_limits(identifier);
CREATE INDEX IF NOT EXISTS idx_suspicious_activities_status ON suspicious_activities(status);
