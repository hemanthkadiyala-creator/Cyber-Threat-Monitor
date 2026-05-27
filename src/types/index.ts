export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  technologies: string[];
  github_url: string;
  live_url: string;
  category: string;
  featured: boolean;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  credential_id: string;
  credential_url: string;
  image_url: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon: string;
}

export interface Experience {
  id: string;
  title: string;
  organization: string;
  description: string;
  type: 'course' | 'lab' | 'internship' | 'certification';
  start_date: string;
  end_date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  published: boolean;
  author_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface SocIncident {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'new' | 'investigating' | 'resolved' | 'false_positive';
  source_ip: string;
  target_ip: string;
  attack_type: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

export interface ThreatIndicator {
  id: string;
  type: 'cve' | 'malware' | 'ip' | 'domain' | 'threat_actor';
  value: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  source: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface ScanResult {
  id: string;
  target: string;
  ports: { port: number; state: string; service: string }[];
  vulnerabilities: { title: string; severity: string; description: string; recommendation: string }[];
  scan_type: string;
  status: string;
  started_at: string;
  completed_at: string;
}

export interface CveEntry {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  score: number;
  description: string;
  affected: string;
  patch: string;
}

export interface AttackLine {
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
  type: string;
  severity: string;
}

export interface Location {
  name: string;
  lat: number;
  lng: number;
  attacks: number;
}

export interface UserProfile {
  id: string;
  full_name: string;
  role: 'admin' | 'analyst';
  bio: string;
  avatar_url: string;
}
