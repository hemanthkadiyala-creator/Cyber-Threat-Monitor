export const SKILLS_DATA = [
  { id: '1', name: 'Networking', category: 'infrastructure', proficiency: 85, icon: 'network' },
  { id: '2', name: 'Linux', category: 'infrastructure', proficiency: 80, icon: 'terminal' },
  { id: '3', name: 'SIEM', category: 'security', proficiency: 75, icon: 'monitor' },
  { id: '4', name: 'Web Security', category: 'security', proficiency: 82, icon: 'shield' },
  { id: '5', name: 'Python', category: 'development', proficiency: 78, icon: 'code' },
  { id: '6', name: 'Wireshark', category: 'tools', proficiency: 70, icon: 'activity' },
  { id: '7', name: 'Nmap', category: 'tools', proficiency: 85, icon: 'radar' },
  { id: '8', name: 'Burp Suite', category: 'tools', proficiency: 72, icon: 'bug' },
  { id: '9', name: 'Fortinet', category: 'infrastructure', proficiency: 68, icon: 'lock' },
  { id: '10', name: 'SOC Operations', category: 'security', proficiency: 75, icon: 'eye' },
  { id: '11', name: 'Threat Analysis', category: 'security', proficiency: 70, icon: 'search' },
  { id: '12', name: 'MERN Stack', category: 'development', proficiency: 73, icon: 'layers' },
];

export const PROJECTS_DATA = [
  {
    id: '1',
    title: 'Vulnerability Scanner',
    description: 'An automated vulnerability scanning tool that identifies security weaknesses in web applications and network infrastructure. Features include port scanning, service detection, and CVE correlation.',
    image_url: 'https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=600',
    technologies: ['Python', 'Nmap', 'Scapy', 'SQLite'],
    github_url: 'https://github.com',
    live_url: '',
    category: 'web_security',
    featured: true,
  },
  {
    id: '2',
    title: 'SIEM Dashboard',
    description: 'A Security Information and Event Management dashboard that aggregates and correlates security logs from multiple sources for real-time threat monitoring and alerting.',
    image_url: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=600',
    technologies: ['React', 'Node.js', 'Elasticsearch', 'Kibana'],
    github_url: 'https://github.com',
    live_url: '',
    category: 'monitoring',
    featured: true,
  },
  {
    id: '3',
    title: 'Cybersecurity Blog',
    description: 'A full-stack cybersecurity blog platform with markdown support, category filtering, and search functionality. Features admin panel for content management.',
    image_url: 'https://images.pexels.com/photos/1089440/pexels-photo-1089440.jpeg?auto=compress&cs=tinysrgb&w=600',
    technologies: ['React', 'Node.js', 'MongoDB', 'TailwindCSS'],
    github_url: 'https://github.com',
    live_url: '',
    category: 'web_security',
    featured: false,
  },
  {
    id: '4',
    title: 'Port Scanner Tool',
    description: 'A multi-threaded port scanner with service version detection, OS fingerprinting, and scriptable interaction with target services.',
    image_url: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=600',
    technologies: ['Python', 'Socket', 'Threading', 'Nmap'],
    github_url: 'https://github.com',
    live_url: '',
    category: 'network',
    featured: true,
  },
  {
    id: '5',
    title: 'Network Monitoring Dashboard',
    description: 'Real-time network traffic analysis dashboard with anomaly detection, bandwidth monitoring, and protocol distribution visualization.',
    image_url: 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=600',
    technologies: ['React', 'D3.js', 'Python', 'Wireshark'],
    github_url: 'https://github.com',
    live_url: '',
    category: 'monitoring',
    featured: false,
  },
  {
    id: '6',
    title: 'Threat Intelligence Platform',
    description: 'A threat intelligence aggregation platform that collects, processes, and visualizes IOCs from multiple public feeds and APIs.',
    image_url: 'https://images.pexels.com/photos/8775010/pexels-photo-8775010.jpeg?auto=compress&cs=tinysrgb&w=600',
    technologies: ['MERN Stack', 'MITRE ATT&CK', 'MISP', 'STIX'],
    github_url: 'https://github.com',
    live_url: '',
    category: 'threat_intel',
    featured: true,
  },
];

export const CERTIFICATIONS_DATA = [
  { id: '1', title: 'CompTIA Security+', issuer: 'CompTIA', issue_date: '2025-03-15', credential_id: 'SEC-2025-001', credential_url: '#', image_url: '' },
  { id: '2', title: 'Certified Ethical Hacker (CEH)', issuer: 'EC-Council', issue_date: '2025-06-20', credential_id: 'CEH-2025-042', credential_url: '#', image_url: '' },
  { id: '3', title: 'Cisco CCNA', issuer: 'Cisco Systems', issue_date: '2024-11-10', credential_id: 'CSCO-2024-789', credential_url: '#', image_url: '' },
  { id: '4', title: 'Fortinet NSE 2', issuer: 'Fortinet', issue_date: '2025-01-05', credential_id: 'NSE2-2025-123', credential_url: '#', image_url: '' },
];

export const EXPERIENCE_DATA = [
  { id: '1', title: 'Cybersecurity Fundamentals', organization: 'Coursera - IBM', description: 'Completed comprehensive cybersecurity fundamentals course covering network security, cryptography, and risk management.', type: 'course' as const, start_date: '2024-01-01', end_date: '2024-03-15' },
  { id: '2', title: 'Penetration Testing Lab', organization: 'TryHackMe', description: 'Hands-on penetration testing labs including OWASP Top 10, privilege escalation, and web application security testing.', type: 'lab' as const, start_date: '2024-04-01', end_date: '2024-08-30' },
  { id: '3', title: 'Network Security Lab', organization: 'HackTheBox', description: 'Advanced network exploitation and defense labs covering Active Directory attacks, lateral movement, and detection evasion.', type: 'lab' as const, start_date: '2024-06-01', end_date: '2025-01-15' },
  { id: '4', title: 'CompTIA Security+ Preparation', organization: 'Self-Study', description: 'Intensive preparation for CompTIA Security+ certification covering threats, architecture, operations, and governance.', type: 'certification' as const, start_date: '2025-01-01', end_date: '2025-03-15' },
  { id: '5', title: 'SOC Analyst Internship Prep', organization: 'CyberShield Academy', description: 'Structured preparation program for SOC analyst role including SIEM operation, incident response, and threat hunting.', type: 'internship' as const, start_date: '2025-04-01', end_date: '' },
  { id: '6', title: 'CEH Certification Course', organization: 'EC-Council', description: 'Comprehensive ethical hacking course covering footprinting, scanning, exploitation, and social engineering.', type: 'course' as const, start_date: '2025-05-01', end_date: '2025-06-20' },
];

export const BLOG_POSTS_DATA = [
  {
    id: '1', title: 'Understanding Zero-Day Exploits: A Deep Dive', slug: 'zero-day-exploits-deep-dive',
    content: '## Zero-Day Exploits\n\nZero-day exploits are one of the most dangerous threats in cybersecurity. These vulnerabilities are unknown to the vendor and have no available patch.\n\n### What Makes Zero-Days Special\n\n- **No patch available** - The vendor is unaware\n- **High value** - Attackers pay premium prices\n- **Stealthy** - Hard to detect with traditional methods\n\n### Detection Strategies\n\n1. Behavioral analysis\n2. Anomaly detection\n3. Threat intelligence feeds\n4. Sandbox analysis',
    excerpt: 'An in-depth analysis of zero-day exploits, their impact, and strategies for detection and prevention.',
    category: 'threat-analysis', tags: ['zero-day', 'exploits', 'vulnerability'], published: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '2', title: 'Building a Home Lab for Cybersecurity Practice', slug: 'home-lab-cybersecurity',
    content: '## Building a Cybersecurity Home Lab\n\nSetting up a home lab is essential for hands-on cybersecurity practice.\n\n### Essential Components\n\n1. **Virtualization** - VMware/VirtualBox\n2. **Network Simulation** - GNS3/EVE-NG\n3. **Target Machines** - Metasploitable, DVWA\n4. **Attacking Machines** - Kali Linux\n5. **SIEM** - Splunk/ELK Stack',
    excerpt: 'A comprehensive guide to setting up a cybersecurity home lab for hands-on practice and skill development.',
    category: 'tutorials', tags: ['home-lab', 'practice', 'beginner'], published: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '3', title: 'The Role of AI in Modern SOC Operations', slug: 'ai-in-soc-operations',
    content: '## AI in SOC Operations\n\nArtificial Intelligence is transforming Security Operations Centers worldwide.\n\n### Current Applications\n\n- **Automated triage** - Prioritizing alerts\n- **Threat hunting** - Proactive threat discovery\n- **Incident response** - Automated remediation\n- **Log analysis** - Pattern recognition',
    excerpt: 'Exploring how artificial intelligence is revolutionizing Security Operations Center workflows and threat detection.',
    category: 'soc-operations', tags: ['AI', 'SOC', 'automation'], published: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '4', title: 'Network Segmentation Best Practices', slug: 'network-segmentation-best-practices',
    content: '## Network Segmentation\n\nNetwork segmentation is a critical security control that limits the blast radius of breaches.\n\n### Why Segment?\n\n- Reduce attack surface\n- Contain breaches\n- Improve performance\n- Regulatory compliance',
    excerpt: 'Best practices for implementing effective network segmentation to improve security posture and contain threats.',
    category: 'network-security', tags: ['network', 'segmentation', 'architecture'], published: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
];

export const ATTACK_MAP_DATA = [
  { from: { lat: 39.9, lng: 116.4 }, to: { lat: 37.8, lng: -122.4 }, type: 'ddos', severity: 'high' },
  { from: { lat: 55.8, lng: 37.6 }, to: { lat: 51.5, lng: -0.1 }, type: 'phishing', severity: 'medium' },
  { from: { lat: 48.9, lng: 2.3 }, to: { lat: 35.7, lng: 139.7 }, type: 'malware', severity: 'critical' },
  { from: { lat: -23.5, lng: -46.6 }, to: { lat: 40.7, lng: -74.0 }, type: 'brute_force', severity: 'high' },
  { from: { lat: 28.6, lng: 77.2 }, to: { lat: 52.5, lng: 13.4 }, type: 'ransomware', severity: 'critical' },
  { from: { lat: 1.3, lng: 103.8 }, to: { lat: -33.9, lng: 151.2 }, type: 'sql_injection', severity: 'medium' },
  { from: { lat: 25.2, lng: 55.3 }, to: { lat: 34.1, lng: -118.2 }, type: 'xss', severity: 'low' },
  { from: { lat: 50.1, lng: 14.4 }, to: { lat: 43.7, lng: -79.4 }, type: 'brute_force', severity: 'medium' },
  { from: { lat: -34.6, lng: -58.4 }, to: { lat: 41.9, lng: 12.5 }, type: 'phishing', severity: 'high' },
  { from: { lat: 22.3, lng: 114.2 }, to: { lat: 59.3, lng: 18.1 }, type: 'ddos', severity: 'high' },
];

export const LOCATIONS = [
  { name: 'San Francisco', lat: 37.8, lng: -122.4, attacks: 45 },
  { name: 'New York', lat: 40.7, lng: -74.0, attacks: 62 },
  { name: 'London', lat: 51.5, lng: -0.1, attacks: 38 },
  { name: 'Tokyo', lat: 35.7, lng: 139.7, attacks: 29 },
  { name: 'Berlin', lat: 52.5, lng: 13.4, attacks: 21 },
  { name: 'Sydney', lat: -33.9, lng: 151.2, attacks: 15 },
  { name: 'Mumbai', lat: 28.6, lng: 77.2, attacks: 33 },
  { name: 'São Paulo', lat: -23.5, lng: -46.6, attacks: 27 },
  { name: 'Singapore', lat: 1.3, lng: 103.8, attacks: 19 },
  { name: 'Toronto', lat: 43.7, lng: -79.4, attacks: 22 },
];

export const CVE_DATA: { id: string; severity: 'critical' | 'high' | 'medium' | 'low'; score: number; description: string; affected: string; patch: string }[] = [
  { id: 'CVE-2025-1234', severity: 'critical', score: 9.8, description: 'Critical RCE vulnerability in Apache Struts allowing remote code execution via crafted OGNL expression.', affected: 'Apache Struts 2.0-2.5', patch: 'Upgrade to Struts 6.0' },
  { id: 'CVE-2025-5678', severity: 'high', score: 7.5, description: 'SQL injection vulnerability in WordPress plugin allowing authenticated users to extract database contents.', affected: 'WP Plugin v3.2', patch: 'Update to v3.3' },
  { id: 'CVE-2025-9012', severity: 'medium', score: 5.4, description: 'Cross-site scripting vulnerability in popular JavaScript library affecting DOM manipulation.', affected: 'lib.js < 2.1', patch: 'Update to 2.1' },
  { id: 'CVE-2025-3456', severity: 'critical', score: 9.1, description: 'Remote code execution in OpenSSL allowing attackers to execute arbitrary code via crafted certificate.', affected: 'OpenSSL 3.0-3.1', patch: 'Upgrade to 3.2' },
  { id: 'CVE-2025-7890', severity: 'medium', score: 6.7, description: 'Local privilege escalation vulnerability in Linux kernel via use-after-free in BPF subsystem.', affected: 'Kernel 5.15-6.1', patch: 'Apply kernel update' },
  { id: 'CVE-2025-2345', severity: 'high', score: 8.1, description: 'Buffer overflow in Nginx allowing remote attackers to cause denial of service or execute arbitrary code.', affected: 'Nginx < 1.25.4', patch: 'Update to 1.25.4' },
  { id: 'CVE-2025-6789', severity: 'low', score: 3.2, description: 'Information disclosure in Apache HTTP Server via mod_status when status page is publicly accessible.', affected: 'Apache 2.4.x', patch: 'Restrict access to mod_status' },
  { id: 'CVE-2025-4567', severity: 'high', score: 7.8, description: 'Authentication bypass in Cisco ASA firewall allowing unauthorized remote access via crafted SSH packets.', affected: 'Cisco ASA 9.x', patch: 'Apply Cisco patch' },
  { id: 'CVE-2025-8901', severity: 'critical', score: 9.6, description: 'Arbitrary file write in Spring Framework allowing attackers to overwrite critical files via path traversal.', affected: 'Spring Framework 5.3-6.0', patch: 'Upgrade to 6.1' },
  { id: 'CVE-2025-1230', severity: 'medium', score: 5.9, description: 'Server-side request forgery in Node.js HTTP library allowing internal network scanning.', affected: 'Node.js < 20.11', patch: 'Update to 20.11' },
];

export const THREAT_FEED_DATA: { id: string; type: 'cve' | 'malware' | 'ip' | 'domain' | 'threat_actor'; value: string; severity: 'critical' | 'high' | 'medium' | 'low'; description: string; source: string; created_at: string }[] = [
  { id: '1', type: 'cve', value: 'CVE-2025-1234', severity: 'critical', description: 'Critical RCE in Apache Struts', source: 'NVD', created_at: new Date().toISOString() },
  { id: '2', type: 'malware', value: 'Emotet', severity: 'high', description: 'Banking trojan distributed via phishing', source: 'US-CERT', created_at: new Date().toISOString() },
  { id: '3', type: 'ip', value: '185.234.72.11', severity: 'high', description: 'C2 server for APT28 group', source: 'VirusTotal', created_at: new Date().toISOString() },
  { id: '4', type: 'cve', value: 'CVE-2025-3456', severity: 'critical', description: 'RCE in OpenSSL via crafted certificate', source: 'OpenSSL Advisory', created_at: new Date().toISOString() },
  { id: '5', type: 'threat_actor', value: 'APT28 (Fancy Bear)', severity: 'critical', description: 'Russian state-sponsored targeting govt orgs', source: 'MITRE ATT&CK', created_at: new Date().toISOString() },
  { id: '6', type: 'malware', value: 'Conti', severity: 'critical', description: 'Ransomware-as-a-service targeting infrastructure', source: 'FBI Advisory', created_at: new Date().toISOString() },
  { id: '7', type: 'domain', value: 'malware-c2.evil.com', severity: 'high', description: 'C2 domain for Emotet botnet', source: 'URLhaus', created_at: new Date().toISOString() },
  { id: '8', type: 'ip', value: '45.33.32.156', severity: 'critical', description: 'Active brute force SSH attacks globally', source: 'AbuseIPDB', created_at: new Date().toISOString() },
  { id: '9', type: 'cve', value: 'CVE-2025-5678', severity: 'high', description: 'SQL injection in WordPress plugin', source: 'WPScan', created_at: new Date().toISOString() },
  { id: '10', type: 'malware', value: 'TrickBot', severity: 'high', description: 'Modular banking trojan with worm capabilities', source: 'MITRE', created_at: new Date().toISOString() },
  { id: '11', type: 'threat_actor', value: 'Lazarus Group', severity: 'high', description: 'DPRK group focused on financial theft', source: 'CISA', created_at: new Date().toISOString() },
  { id: '12', type: 'ip', value: '91.234.12.45', severity: 'medium', description: 'Credential stuffing attacks', source: 'Shodan', created_at: new Date().toISOString() },
  { id: '13', type: 'domain', value: 'phishing-login.secure-update.net', severity: 'high', description: 'Phishing domain mimicking corporate portal', source: 'PhishTank', created_at: new Date().toISOString() },
  { id: '14', type: 'cve', value: 'CVE-2025-7890', severity: 'medium', description: 'Privilege escalation in Linux kernel BPF', source: 'Linux Kernel', created_at: new Date().toISOString() },
  { id: '15', type: 'cve', value: 'CVE-2025-9012', severity: 'medium', description: 'XSS in JavaScript DOM library', source: 'GitHub Advisory', created_at: new Date().toISOString() },
];

export const SOC_INCIDENTS_DATA: { id: string; title: string; description: string; severity: 'critical' | 'high' | 'medium' | 'low'; status: 'new' | 'investigating' | 'resolved' | 'false_positive'; source_ip: string; target_ip: string; attack_type: string; created_at: string; updated_at: string }[] = [
  { id: '1', title: 'Brute Force SSH Attack', description: 'Multiple failed SSH login attempts from external IP targeting production servers.', severity: 'high', status: 'investigating', source_ip: '185.234.72.11', target_ip: '10.0.1.15', attack_type: 'brute_force', created_at: new Date(Date.now() - 2 * 3600000).toISOString(), updated_at: new Date().toISOString() },
  { id: '2', title: 'Suspicious PowerShell', description: 'Encoded PowerShell command execution detected on Finance workstation.', severity: 'critical', status: 'new', source_ip: '10.0.2.45', target_ip: '10.0.2.45', attack_type: 'malware', created_at: new Date(Date.now() - 3600000).toISOString(), updated_at: new Date().toISOString() },
  { id: '3', title: 'DDoS Attack on Web Server', description: 'Volumetric DDoS attack targeting public-facing web servers with SYN flood.', severity: 'high', status: 'investigating', source_ip: 'Multiple', target_ip: '203.0.113.50', attack_type: 'ddos', created_at: new Date(Date.now() - 1800000).toISOString(), updated_at: new Date().toISOString() },
  { id: '4', title: 'Phishing Campaign', description: 'Targeted phishing campaign with malicious attachments targeting HR department.', severity: 'medium', status: 'new', source_ip: 'Spam Filter', target_ip: 'Exchange Server', attack_type: 'phishing', created_at: new Date(Date.now() - 4 * 3600000).toISOString(), updated_at: new Date().toISOString() },
  { id: '5', title: 'Data Exfiltration', description: 'Large volume of data transferred to external server from database.', severity: 'critical', status: 'investigating', source_ip: '10.0.1.20', target_ip: '45.33.32.156', attack_type: 'data_exfiltration', created_at: new Date(Date.now() - 900000).toISOString(), updated_at: new Date().toISOString() },
  { id: '6', title: 'Malware on Endpoint', description: 'Trojan malware detected by endpoint protection on developer workstation.', severity: 'high', status: 'new', source_ip: '10.0.3.22', target_ip: '10.0.3.22', attack_type: 'malware', created_at: new Date(Date.now() - 3 * 3600000).toISOString(), updated_at: new Date().toISOString() },
  { id: '7', title: 'SQL Injection Attempt', description: 'SQL injection attack detected on customer-facing web application.', severity: 'medium', status: 'resolved', source_ip: '192.168.1.100', target_ip: '10.0.1.80', attack_type: 'sql_injection', created_at: new Date(Date.now() - 6 * 3600000).toISOString(), updated_at: new Date().toISOString() },
  { id: '8', title: 'Foreign IP Login', description: 'User account accessed from foreign IP outside normal working hours.', severity: 'medium', status: 'investigating', source_ip: '91.234.12.45', target_ip: 'Auth Server', attack_type: 'unauthorized_access', created_at: new Date(Date.now() - 5 * 3600000).toISOString(), updated_at: new Date().toISOString() },
  { id: '9', title: 'Ransomware Detected', description: 'File encryption activity detected on file server. Possible ransomware.', severity: 'critical', status: 'new', source_ip: '10.0.1.55', target_ip: '10.0.1.30', attack_type: 'ransomware', created_at: new Date(Date.now() - 2700000).toISOString(), updated_at: new Date().toISOString() },
  { id: '10', title: 'Internal Port Scan', description: 'Internal host performing port scan across multiple subnets.', severity: 'low', status: 'resolved', source_ip: '10.0.2.100', target_ip: '10.0.0.0/16', attack_type: 'reconnaissance', created_at: new Date(Date.now() - 8 * 3600000).toISOString(), updated_at: new Date().toISOString() },
];
