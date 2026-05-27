/*
  # CyberShield Platform - Sample Data

  Seeds the database with example portfolio content:
  - 6 projects (Vulnerability Scanner, SIEM Dashboard, etc.)
  - 4 certifications (CompTIA Security+, CEH, etc.)
  - 12 skills across categories
  - 6 experience entries
  - 4 blog posts
  - 10 SOC incidents
  - 15 threat indicators
*/

-- Sample projects
INSERT INTO projects (title, description, image_url, technologies, github_url, live_url, category, featured) VALUES
('Vulnerability Scanner', 'An automated vulnerability scanning tool that identifies security weaknesses in web applications and network infrastructure. Features include port scanning, service detection, and CVE correlation.', 'https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg', ARRAY['Python', 'Nmap', 'Scapy', 'SQLite'], 'https://github.com/cybershield/vuln-scanner', '', 'web_security', true),
('SIEM Dashboard', 'A Security Information and Event Management dashboard that aggregates and correlates security logs from multiple sources for real-time threat monitoring and alerting.', 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg', ARRAY['React', 'Node.js', 'Elasticsearch', 'Kibana'], 'https://github.com/cybershield/siem-dashboard', '', 'monitoring', true),
('Cybersecurity Blog', 'A full-stack cybersecurity blog platform with markdown support, category filtering, and search functionality. Features admin panel for content management.', 'https://images.pexels.com/photos/1089440/pexels-photo-1089440.jpeg', ARRAY['React', 'Node.js', 'MongoDB', 'TailwindCSS'], 'https://github.com/cybershield/cyber-blog', '', 'web_security', false),
('Port Scanner Tool', 'A multi-threaded port scanner with service version detection, OS fingerprinting, and scriptable interaction with target services.', 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg', ARRAY['Python', 'Socket', 'Threading', 'Nmap'], 'https://github.com/cybershield/port-scanner', '', 'network', true),
('Network Monitoring Dashboard', 'Real-time network traffic analysis dashboard with anomaly detection, bandwidth monitoring, and protocol distribution visualization.', 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg', ARRAY['React', 'D3.js', 'Python', 'Wireshark'], 'https://github.com/cybershield/net-monitor', '', 'monitoring', false),
('Threat Intelligence Platform', 'A threat intelligence aggregation platform that collects, processes, and visualizes IOCs from multiple public feeds and APIs.', 'https://images.pexels.com/photos/8775010/pexels-photo-8775010.jpeg', ARRAY['MERN Stack', 'MITRE ATT&CK', 'MISP', 'STIX'], 'https://github.com/cybershield/threat-intel', '', 'threat_intel', true);

-- Sample certifications
INSERT INTO certifications (title, issuer, issue_date, credential_id, credential_url, image_url) VALUES
('CompTIA Security+', 'CompTIA', '2025-03-15', 'SEC-2025-001', 'https://www.credly.com/badges/verify', ''),
('Certified Ethical Hacker (CEH)', 'EC-Council', '2025-06-20', 'CEH-2025-042', 'https://aspen.eccouncil.org/verify', ''),
('Cisco CCNA', 'Cisco Systems', '2024-11-10', 'CSCO-2024-789', 'https://www.credly.com/badges/verify', ''),
('Fortinet NSE 2', 'Fortinet', '2025-01-05', 'NSE2-2025-123', 'https://training.fortinet.com/verify', '');

-- Sample skills
INSERT INTO skills (name, category, proficiency, icon) VALUES
('Networking', 'infrastructure', 85, 'network'),
('Linux', 'infrastructure', 80, 'terminal'),
('SIEM', 'security', 75, 'monitor'),
('Web Security', 'security', 82, 'shield'),
('Python', 'development', 78, 'code'),
('Wireshark', 'tools', 70, 'activity'),
('Nmap', 'tools', 85, 'radar'),
('Burp Suite', 'tools', 72, 'bug'),
('Fortinet', 'infrastructure', 68, 'lock'),
('SOC Operations', 'security', 75, 'eye'),
('Threat Analysis', 'security', 70, 'search'),
('MERN Stack', 'development', 73, 'layers');

-- Sample experience
INSERT INTO experience (title, organization, description, type, start_date, end_date) VALUES
('Cybersecurity Fundamentals', 'Coursera - IBM', 'Completed comprehensive cybersecurity fundamentals course covering network security, cryptography, and risk management.', 'course', '2024-01-01', '2024-03-15'),
('Penetration Testing Lab', 'TryHackMe', 'Hands-on penetration testing labs including OWASP Top 10, privilege escalation, and web application security testing.', 'lab', '2024-04-01', '2024-08-30'),
('Network Security Lab', 'HackTheBox', 'Advanced network exploitation and defense labs covering Active Directory attacks, lateral movement, and detection evasion.', 'lab', '2024-06-01', '2025-01-15'),
('CompTIA Security+ Preparation', 'Self-Study', 'Intensive preparation for CompTIA Security+ certification covering threats, architecture, operations, and governance.', 'certification', '2025-01-01', '2025-03-15'),
('SOC Analyst Internship Prep', 'CyberShield Academy', 'Structured preparation program for SOC analyst role including SIEM operation, incident response, and threat hunting.', 'internship', '2025-04-01', NULL),
('CEH Certification Course', 'EC-Council', 'Comprehensive ethical hacking course covering footprinting, scanning, exploitation, and social engineering.', 'course', '2025-05-01', '2025-06-20');

-- Sample blog posts
INSERT INTO blog_posts (title, slug, content, excerpt, category, tags, published, created_at, updated_at) VALUES
('Understanding Zero-Day Exploits: A Deep Dive', 'zero-day-exploits-deep-dive', '# Zero-Day Exploits\n\nZero-day exploits are one of the most dangerous threats in cybersecurity. These vulnerabilities are unknown to the vendor and have no available patch.\n\n## What Makes Zero-Days Special\n\n- **No patch available** - The vendor is unaware\n- **High value** - Attackers pay premium prices\n- **Stealthy** - Hard to detect with traditional methods\n\n## Detection Strategies\n\n1. Behavioral analysis\n2. Anomaly detection\n3. Threat intelligence feeds\n4. Sandbox analysis\n\n## Prevention\n\nWhile you cannot patch what you dont know exists, you can:\n- Implement defense-in-depth\n- Use application whitelisting\n- Monitor for abnormal behavior\n- Keep incident response plans updated', 'An in-depth analysis of zero-day exploits, their impact, and strategies for detection and prevention.', 'threat-analysis', ARRAY['zero-day', 'exploits', 'vulnerability'], true, now() - interval '7 days', now()),
('Building a Home Lab for Cybersecurity Practice', 'home-lab-cybersecurity', '# Building a Cybersecurity Home Lab\n\nSetting up a home lab is essential for hands-on cybersecurity practice. Here is a comprehensive guide.\n\n## Essential Components\n\n1. **Virtualization** - VMware/VirtualBox\n2. **Network Simulation** - GNS3/EVE-NG\n3. **Target Machines** - Metasploitable, DVWA\n4. **Attacking Machines** - Kali Linux\n5. **SIEM** - Splunk/ELK Stack\n\n## Network Architecture\n\n```\n[Internet] -> [Firewall] -> [DMZ] -> [Internal Network]\n```\n\n## Getting Started\n\nStart small with two VMs and gradually expand your lab as you learn more.', 'A comprehensive guide to setting up a cybersecurity home lab for hands-on practice and skill development.', 'tutorials', ARRAY['home-lab', 'practice', 'beginner'], true, now() - interval '14 days', now()),
('The Role of AI in Modern SOC Operations', 'ai-in-soc-operations', '# AI in SOC Operations\n\nArtificial Intelligence is transforming Security Operations Centers worldwide. This article explores how AI enhances threat detection and response.\n\n## Current Applications\n\n- **Automated triage** - Prioritizing alerts\n- **Threat hunting** - Proactive threat discovery\n- **Incident response** - Automated remediation\n- **Log analysis** - Pattern recognition\n\n## Challenges\n\n1. False positives\n2. Adversarial AI attacks\n3. Skill gap in AI/ML for security\n4. Integration complexity\n\n## The Future\n\nAI will not replace SOC analysts but will augment their capabilities, allowing them to focus on complex threats while AI handles routine analysis.', 'Exploring how artificial intelligence is revolutionizing Security Operations Center workflows and threat detection.', 'soc-operations', ARRAY['AI', 'SOC', 'automation'], true, now() - interval '21 days', now()),
('Network Segmentation Best Practices', 'network-segmentation-best-practices', '# Network Segmentation\n\nNetwork segmentation is a critical security control that limits the blast radius of breaches and contains lateral movement.\n\n## Why Segment?\n\n- Reduce attack surface\n- Contain breaches\n- Improve performance\n- Regulatory compliance\n\n## Implementation Strategies\n\n1. **VLAN-based segmentation**\n2. **Firewall zones**\n3. **Micro-segmentation**\n4. **Zero Trust Architecture**\n\n## Common Mistakes\n\n- Over-segmentation leading to complexity\n- Ignoring east-west traffic\n- Poor documentation\n- No monitoring between segments', 'Best practices for implementing effective network segmentation to improve security posture and contain threats.', 'network-security', ARRAY['network', 'segmentation', 'architecture'], true, now() - interval '30 days', now());

-- Sample SOC incidents
INSERT INTO soc_incidents (title, description, severity, status, source_ip, target_ip, attack_type, created_at) VALUES
('Brute Force SSH Attack Detected', 'Multiple failed SSH login attempts detected from external IP targeting production servers.', 'high', 'investigating', '185.234.72.11', '10.0.1.15', 'brute_force', now() - interval '2 hours'),
('Suspicious PowerShell Execution', 'Encoded PowerShell command execution detected on workstation in Finance department.', 'critical', 'new', '10.0.2.45', '10.0.2.45', 'malware', now() - interval '1 hour'),
('DDoS Attack on Web Server', 'Volumetric DDoS attack targeting public-facing web servers with SYN flood.', 'high', 'investigating', 'Multiple', '203.0.113.50', 'ddos', now() - interval '30 minutes'),
('Phishing Email Campaign', 'Targeted phishing campaign detected with malicious attachments targeting HR department.', 'medium', 'new', 'Spam Filter', 'Exchange Server', 'phishing', now() - interval '4 hours'),
('Unauthorized Data Exfiltration', 'Large volume of data transferred to external server from database server.', 'critical', 'investigating', '10.0.1.20', '45.33.32.156', 'data_exfiltration', now() - interval '15 minutes'),
('Malware Detected on Endpoint', 'Trojan malware detected by endpoint protection on developer workstation.', 'high', 'new', '10.0.3.22', '10.0.3.22', 'malware', now() - interval '3 hours'),
('SQL Injection Attempt', 'SQL injection attack detected on customer-facing web application.', 'medium', 'resolved', '192.168.1.100', '10.0.1.80', 'sql_injection', now() - interval '6 hours'),
('Suspicious Login from Foreign IP', 'User account accessed from foreign IP address outside normal working hours.', 'medium', 'investigating', '91.234.12.45', 'Auth Server', 'unauthorized_access', now() - interval '5 hours'),
('Ransomware Activity Detected', 'File encryption activity detected on file server. Possible ransomware outbreak.', 'critical', 'new', '10.0.1.55', '10.0.1.30', 'ransomware', now() - interval '45 minutes'),
('Port Scan from Internal Host', 'Internal host performing port scan across multiple subnets.', 'low', 'resolved', '10.0.2.100', '10.0.0.0/16', 'reconnaissance', now() - interval '8 hours');

-- Sample threat indicators
INSERT INTO threat_indicators (type, value, severity, description, source, metadata) VALUES
('cve', 'CVE-2025-1234', 'critical', 'Critical RCE vulnerability in Apache Struts allowing remote code execution via crafted OGNL expression.', 'NVD', '{"cvss": 9.8, "affected": "Apache Struts 2.0-2.5", "patch": "Upgrade to Struts 6.0"}'),
('cve', 'CVE-2025-5678', 'high', 'SQL injection vulnerability in WordPress plugin allowing authenticated users to extract database contents.', 'WPScan', '{"cvss": 7.5, "affected": "WP Plugin v3.2", "patch": "Update to v3.3"}'),
('cve', 'CVE-2025-9012', 'medium', 'Cross-site scripting vulnerability in popular JavaScript library affecting DOM manipulation.', 'GitHub Advisory', '{"cvss": 5.4, "affected": "lib.js < 2.1", "patch": "Update to 2.1"}'),
('malware', 'Emotet', 'high', 'Banking trojan turned botnet malware distributed via phishing campaigns. Known for lateral movement and credential theft.', 'US-CERT', '{"family": "Trojan", "platform": "Windows", "mitre": "T1566"}'),
('malware', 'Conti', 'critical', 'Ransomware-as-a-service operation targeting critical infrastructure. Known for double extortion tactics.', 'FBI Advisory', '{"family": "Ransomware", "platform": "Windows", "mitre": "T1486"}'),
('ip', '185.234.72.11', 'high', 'Known command and control server associated with APT28 group. Active in targeted phishing campaigns.', 'VirusTotal', '{"country": "Russia", "asn": "AS12345", "first_seen": "2024-12-01"}'),
('ip', '45.33.32.156', 'critical', 'Active threat actor IP performing brute force attacks against SSH services globally.', 'AbuseIPDB', '{"country": "Unknown", "asn": "AS67890", "reports": 1520}'),
('domain', 'malware-c2.evil.com', 'high', 'Known malware command and control domain used by Emotet botnet for payload delivery.', 'URLhaus', '{"registered": "2024-11-15", "registrar": "Unknown", "status": "Active"}'),
('threat_actor', 'APT28 (Fancy Bear)', 'critical', 'Russian state-sponsored threat group targeting government and military organizations. Known for zero-day exploitation.', 'MITRE ATT&CK', '{"country": "Russia", "motivation": "Espionage", "techniques": ["T1566", "T1059", "T1078"]}'),
('threat_actor', 'Lazarus Group', 'high', 'North Korean state-sponsored group focused on financial theft and espionage. Known for supply chain attacks.', 'CISA', '{"country": "DPRK", "motivation": "Financial", "techniques": ["T1195", "T1055", "T1562"]}'),
('cve', 'CVE-2025-3456', 'critical', 'Remote code execution in OpenSSL allowing attackers to execute arbitrary code via crafted certificate.', 'OpenSSL Advisory', '{"cvss": 9.1, "affected": "OpenSSL 3.0-3.1", "patch": "Upgrade to 3.2"}'),
('malware', 'TrickBot', 'high', 'Modular banking trojan with worm capabilities. Often deployed as precursor to ransomware attacks.', 'MITRE', '{"family": "Trojan", "platform": "Windows", "mitre": "T1059"}'),
('ip', '91.234.12.45', 'medium', 'Suspicious IP performing credential stuffing attacks against multiple organizations.', 'Shodan', '{"country": "Unknown", "asn": "AS54321", "reports": 230}'),
('cve', 'CVE-2025-7890', 'medium', 'Local privilege escalation vulnerability in Linux kernel via use-after-free in BPF subsystem.', 'Linux Kernel', '{"cvss": 6.7, "affected": "Kernel 5.15-6.1", "patch": "Apply kernel update"}'),
('domain', 'phishing-login.secure-update.net', 'high', 'Phishing domain mimicking corporate login portal. Active credential harvesting campaign.', 'PhishTank', '{"registered": "2025-04-20", "target": "Office 365", "status": "Active"}');
