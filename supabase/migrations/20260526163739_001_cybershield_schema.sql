/*
  # CyberShield Platform - Core Schema

  1. New Tables
    - `profiles` - User profiles extending auth.users
      - `id` (uuid, PK, references auth.users)
      - `full_name` (text)
      - `role` (text: 'admin' or 'analyst')
      - `bio` (text)
      - `avatar_url` (text)
      - `created_at` (timestamptz)
    - `projects` - Portfolio projects
      - `id` (uuid, PK)
      - `title` (text)
      - `description` (text)
      - `image_url` (text)
      - `technologies` (text array)
      - `github_url` (text)
      - `live_url` (text)
      - `category` (text)
      - `featured` (boolean)
      - `created_at` (timestamptz)
    - `certifications` - Professional certifications
      - `id` (uuid, PK)
      - `title` (text)
      - `issuer` (text)
      - `issue_date` (date)
      - `credential_id` (text)
      - `credential_url` (text)
      - `image_url` (text)
      - `created_at` (timestamptz)
    - `blog_posts` - Blog articles
      - `id` (uuid, PK)
      - `title` (text)
      - `slug` (text, unique)
      - `content` (text - markdown)
      - `excerpt` (text)
      - `category` (text)
      - `tags` (text array)
      - `published` (boolean)
      - `author_id` (uuid, references profiles)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    - `contact_messages` - Contact form submissions
      - `id` (uuid, PK)
      - `name` (text)
      - `email` (text)
      - `subject` (text)
      - `message` (text)
      - `read` (boolean)
      - `created_at` (timestamptz)
    - `experience` - Learning journey timeline
      - `id` (uuid, PK)
      - `title` (text)
      - `organization` (text)
      - `description` (text)
      - `type` (text: 'course', 'lab', 'internship', 'certification')
      - `start_date` (date)
      - `end_date` (date)
      - `created_at` (timestamptz)
    - `skills` - Technical skills
      - `id` (uuid, PK)
      - `name` (text)
      - `category` (text)
      - `proficiency` (integer 1-100)
      - `icon` (text)
      - `created_at` (timestamptz)
    - `soc_incidents` - SOC dashboard incidents
      - `id` (uuid, PK)
      - `title` (text)
      - `description` (text)
      - `severity` (text: 'critical', 'high', 'medium', 'low')
      - `status` (text: 'new', 'investigating', 'resolved', 'false_positive')
      - `source_ip` (text)
      - `target_ip` (text)
      - `attack_type` (text)
      - `assigned_to` (uuid, references profiles)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    - `threat_indicators` - Threat intelligence data
      - `id` (uuid, PK)
      - `type` (text: 'cve', 'malware', 'ip', 'domain', 'threat_actor')
      - `value` (text)
      - `severity` (text)
      - `description` (text)
      - `source` (text)
      - `metadata` (jsonb)
      - `created_at` (timestamptz)
    - `scan_results` - Vulnerability scanner results
      - `id` (uuid, PK)
      - `target` (text)
      - `ports` (jsonb)
      - `vulnerabilities` (jsonb)
      - `scan_type` (text)
      - `status` (text)
      - `started_at` (timestamptz)
      - `completed_at` (timestamptz)
      - `created_by` (uuid, references profiles)
    - `visitors` - Visitor tracking
      - `id` (uuid, PK)
      - `page` (text)
      - `referrer` (text)
      - `user_agent` (text)
      - `visited_at` (timestamptz)

  2. Security
    - RLS enabled on all tables
    - Admin-only write access for projects, certifications, blog_posts, experience, skills, soc_incidents
    - Public read access for portfolio content
    - Authenticated users can create contact_messages and scan_results
    - Admin-only access to contact_messages read and threat_indicators
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text DEFAULT '',
  role text DEFAULT 'analyst' CHECK (role IN ('admin', 'analyst')),
  bio text DEFAULT '',
  avatar_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  technologies text[] DEFAULT '{}',
  github_url text DEFAULT '',
  live_url text DEFAULT '',
  category text DEFAULT 'web_security',
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  issuer text NOT NULL,
  issue_date date,
  credential_id text DEFAULT '',
  credential_url text DEFAULT '',
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text DEFAULT '',
  excerpt text DEFAULT '',
  category text DEFAULT 'general',
  tags text[] DEFAULT '{}',
  published boolean DEFAULT false,
  author_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text DEFAULT '',
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Experience / Learning journey table
CREATE TABLE IF NOT EXISTS experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  organization text DEFAULT '',
  description text DEFAULT '',
  type text DEFAULT 'course' CHECK (type IN ('course', 'lab', 'internship', 'certification')),
  start_date date,
  end_date date,
  created_at timestamptz DEFAULT now()
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text DEFAULT 'general',
  proficiency integer DEFAULT 50 CHECK (proficiency >= 0 AND proficiency <= 100),
  icon text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- SOC Incidents table
CREATE TABLE IF NOT EXISTS soc_incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  severity text DEFAULT 'low' CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  status text DEFAULT 'new' CHECK (status IN ('new', 'investigating', 'resolved', 'false_positive')),
  source_ip text DEFAULT '',
  target_ip text DEFAULT '',
  attack_type text DEFAULT '',
  assigned_to uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Threat indicators table
CREATE TABLE IF NOT EXISTS threat_indicators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text DEFAULT 'cve' CHECK (type IN ('cve', 'malware', 'ip', 'domain', 'threat_actor')),
  value text NOT NULL,
  severity text DEFAULT 'medium',
  description text DEFAULT '',
  source text DEFAULT '',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Scan results table
CREATE TABLE IF NOT EXISTS scan_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target text NOT NULL,
  ports jsonb DEFAULT '[]',
  vulnerabilities jsonb DEFAULT '[]',
  scan_type text DEFAULT 'quick',
  status text DEFAULT 'pending',
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  created_by uuid REFERENCES profiles(id)
);

-- Visitors table
CREATE TABLE IF NOT EXISTS visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text DEFAULT '',
  referrer text DEFAULT '',
  user_agent text DEFAULT '',
  visited_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE soc_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE threat_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Projects policies (public read, admin write)
CREATE POLICY "Public can view published projects"
  ON projects FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage projects"
  ON projects FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Certifications policies (public read, admin write)
CREATE POLICY "Public can view certifications"
  ON certifications FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage certifications"
  ON certifications FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Blog posts policies
CREATE POLICY "Public can view published posts"
  ON blog_posts FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "Admins can manage blog posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Contact messages policies
CREATE POLICY "Authenticated users can submit messages"
  ON contact_messages FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update messages"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow anonymous contact messages too
CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages FOR INSERT
  TO anon
  WITH CHECK (true);

-- Experience policies (public read, admin write)
CREATE POLICY "Public can view experience"
  ON experience FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage experience"
  ON experience FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Skills policies (public read, admin write)
CREATE POLICY "Public can view skills"
  ON skills FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage skills"
  ON skills FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- SOC Incidents policies
CREATE POLICY "Analysts can view incidents"
  ON soc_incidents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage incidents"
  ON soc_incidents FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins and analysts can update incidents"
  ON soc_incidents FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Threat indicators policies
CREATE POLICY "Authenticated users can view indicators"
  ON threat_indicators FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public can view threat indicators"
  ON threat_indicators FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage indicators"
  ON threat_indicators FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Scan results policies
CREATE POLICY "Users can view own scans"
  ON scan_results FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Admins can view all scans"
  ON scan_results FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Authenticated users can create scans"
  ON scan_results FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

-- Visitors policies
CREATE POLICY "Anyone can insert visitor records"
  ON visitors FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can insert visitor records auth"
  ON visitors FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view visitor stats"
  ON visitors FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_soc_incidents_severity ON soc_incidents(severity);
CREATE INDEX IF NOT EXISTS idx_soc_incidents_status ON soc_incidents(status);
CREATE INDEX IF NOT EXISTS idx_threat_indicators_type ON threat_indicators(type);
CREATE INDEX IF NOT EXISTS idx_scan_results_created_by ON scan_results(created_by);
CREATE INDEX IF NOT EXISTS idx_visitors_visited_at ON visitors(visited_at);
