import { useState } from 'react';
import { Search, Shield, AlertTriangle, CheckCircle, XCircle, Radar, Terminal } from 'lucide-react';
import AnimatedSection from '../ui/AnimatedSection';
import { SectionHeader, SeverityBadge } from '../ui/SeverityBadge';

interface ScanPort {
  port: number;
  state: string;
  service: string;
}

interface ScanVuln {
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  recommendation: string;
}

interface ScanResult {
  target: string;
  ports: ScanPort[];
  vulnerabilities: ScanVuln[];
  scanType: string;
  status: string;
  startTime: string;
  endTime: string;
}

const COMMON_PORTS = [
  { port: 21, service: 'FTP' }, { port: 22, service: 'SSH' }, { port: 23, service: 'Telnet' },
  { port: 25, service: 'SMTP' }, { port: 53, service: 'DNS' }, { port: 80, service: 'HTTP' },
  { port: 110, service: 'POP3' }, { port: 143, service: 'IMAP' }, { port: 443, service: 'HTTPS' },
  { port: 445, service: 'SMB' }, { port: 993, service: 'IMAPS' }, { port: 995, service: 'POP3S' },
  { port: 3306, service: 'MySQL' }, { port: 3389, service: 'RDP' }, { port: 5432, service: 'PostgreSQL' },
  { port: 5900, service: 'VNC' }, { port: 8080, service: 'HTTP-Alt' }, { port: 8443, service: 'HTTPS-Alt' },
];

const VULN_TEMPLATES: Omit<ScanVuln, 'severity'>[] = [
  { title: 'Outdated Software Version', description: 'Service running outdated version with known vulnerabilities.', recommendation: 'Update to the latest stable version immediately.' },
  { title: 'Weak Authentication', description: 'Service allows weak authentication mechanisms.', recommendation: 'Enforce strong password policies and enable multi-factor authentication.' },
  { title: 'Information Disclosure', description: 'Service reveals version and configuration information in banners.', recommendation: 'Configure service to suppress version information.' },
  { title: 'Default Credentials', description: 'Service may be using default or factory credentials.', recommendation: 'Change all default credentials immediately and enforce password complexity.' },
  { title: 'Unencrypted Communication', description: 'Service transmits data without encryption.', recommendation: 'Enable TLS/SSL for all communications.' },
  { title: 'Missing Security Headers', description: 'Web service missing critical security headers (CSP, X-Frame-Options, etc.).', recommendation: 'Implement all recommended security headers.' },
];

function simulateScan(target: string, scanType: string): Promise<ScanResult> {
  return new Promise((resolve) => {
    const openPorts = COMMON_PORTS.filter(() => Math.random() > 0.65).map((p) => ({
      port: p.port,
      state: 'open',
      service: p.service,
    }));

    const closedPorts = COMMON_PORTS.filter((p) => !openPorts.find((o) => o.port === p.port))
      .slice(0, 4)
      .map((p) => ({ port: p.port, state: 'closed', service: p.service }));

    const filteredPorts = COMMON_PORTS.filter(
      (p) => !openPorts.find((o) => o.port === p.port) && !closedPorts.find((c) => c.port === p.port)
    ).slice(0, 2).map((p) => ({ port: p.port, state: 'filtered', service: p.service }));

    const vulnerabilities = openPorts.map(() => {
      const template = VULN_TEMPLATES[Math.floor(Math.random() * VULN_TEMPLATES.length)];
      const severities: ScanVuln['severity'][] = ['critical', 'high', 'medium', 'low'];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      return { ...template, severity };
    });

    const delay = scanType === 'full' ? 5000 : scanType === 'stealth' ? 3000 : 2000;

    setTimeout(() => {
      resolve({
        target,
        ports: [...openPorts, ...closedPorts, ...filteredPorts].sort((a, b) => a.port - b.port),
        vulnerabilities,
        scanType,
        status: 'completed',
        startTime: new Date(Date.now() - delay).toISOString(),
        endTime: new Date().toISOString(),
      });
    }, delay);
  });
}

export default function ScannerPage() {
  const [target, setTarget] = useState('');
  const [scanType, setScanType] = useState('quick');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return;

    setScanning(true);
    setResult(null);
    setProgress(0);
    setLogs([]);

    const logMessages = [
      `Initiating ${scanType} scan on target: ${target}`,
      'Resolving hostname...',
      'Host resolved successfully',
      'Sending probe packets...',
      'Analyzing response headers...',
      'Detecting open ports...',
      'Running service version detection...',
      'Checking for known vulnerabilities...',
      'Generating security recommendations...',
      'Scan complete!',
    ];

    for (let i = 0; i < logMessages.length; i++) {
      await new Promise((r) => setTimeout(r, (scanType === 'full' ? 500 : 300)));
      setLogs((prev) => [...prev, logMessages[i]]);
      setProgress(((i + 1) / logMessages.length) * 100);
    }

    const scanResult = await simulateScan(target, scanType);
    setResult(scanResult);
    setScanning(false);
  };

  const portStateIcon = (state: string) => {
    if (state === 'open') return <CheckCircle className="w-4 h-4 text-neon-green" />;
    if (state === 'filtered') return <AlertTriangle className="w-4 h-4 text-neon-yellow" />;
    return <XCircle className="w-4 h-4 text-neon-red" />;
  };

  return (
    <div className="pt-20 pb-16">
      <section className="py-16">
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              title="Vulnerability Scanner"
              subtitle="Simulated vulnerability assessment tool for detecting open ports and security weaknesses."
            />
          </AnimatedSection>

          {/* Scan Input */}
          <AnimatedSection>
            <div className="cyber-card p-8 max-w-3xl mx-auto mb-8">
              <form onSubmit={handleScan} className="space-y-4">
                <div>
                  <label className="block text-dark-300 text-sm mb-1.5">Target Host</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                    <input
                      type="text"
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      className="cyber-input pl-11 font-mono"
                      placeholder="e.g., 192.168.1.1 or example.com"
                      disabled={scanning}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-dark-300 text-sm mb-2">Scan Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: 'quick', label: 'Quick Scan', desc: 'Common ports only' },
                      { key: 'full', label: 'Full Scan', desc: 'All 65535 ports' },
                      { key: 'stealth', label: 'Stealth Scan', desc: 'SYN scan mode' },
                    ].map((type) => (
                      <button
                        key={type.key}
                        type="button"
                        onClick={() => setScanType(type.key)}
                        disabled={scanning}
                        className={`p-3 rounded-lg text-left transition-all border ${
                          scanType === type.key
                            ? 'bg-neon-blue/10 border-neon-blue/30 text-neon-blue'
                            : 'bg-dark-800/30 border-dark-700/30 text-dark-400 hover:border-dark-600'
                        } disabled:opacity-50`}
                      >
                        <div className="text-sm font-medium">{type.label}</div>
                        <div className="text-[10px] mt-0.5">{type.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={scanning || !target}
                  className="cyber-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {scanning ? (
                    <>
                      <Radar className="w-4 h-4 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      Start Scan
                    </>
                  )}
                </button>
              </form>

              {/* Progress Bar */}
              {scanning && (
                <div className="mt-6">
                  <div className="flex justify-between text-xs text-dark-400 mb-1">
                    <span>Scanning progress</span>
                    <span className="font-mono">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full h-2 bg-dark-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-neon-blue to-neon-green rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </AnimatedSection>

          {/* Scan Logs */}
          {logs.length > 0 && (
            <AnimatedSection>
              <div className="cyber-card p-6 max-w-3xl mx-auto mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Terminal className="w-5 h-5 text-neon-green" />
                  <h3 className="text-white font-semibold text-sm">Scan Output</h3>
                </div>
                <div className="bg-dark-950 rounded-lg p-4 max-h-48 overflow-y-auto font-mono text-xs space-y-1">
                  {logs.map((log, i) => (
                    <div key={i} className={log.includes('complete') ? 'text-neon-green font-semibold' : log.includes('Initiating') ? 'text-neon-blue' : 'text-dark-300'}>
                      <span className="text-dark-500">[{new Date().toLocaleTimeString()}]</span> {log}
                    </div>
                  ))}
                  {scanning && <span className="inline-block w-2 h-3 bg-neon-green animate-pulse" />}
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* Results */}
          {result && (
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Summary */}
              <AnimatedSection>
                <div className="cyber-card p-6">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-neon-blue" />
                    Scan Summary - {result.target}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3 rounded-lg bg-dark-800/50 text-center">
                      <div className="text-neon-green text-xl font-bold font-mono">
                        {result.ports.filter((p) => p.state === 'open').length}
                      </div>
                      <div className="text-dark-400 text-xs">Open Ports</div>
                    </div>
                    <div className="p-3 rounded-lg bg-dark-800/50 text-center">
                      <div className="text-neon-red text-xl font-bold font-mono">
                        {result.vulnerabilities.filter((v) => v.severity === 'critical' || v.severity === 'high').length}
                      </div>
                      <div className="text-dark-400 text-xs">High/Critical</div>
                    </div>
                    <div className="p-3 rounded-lg bg-dark-800/50 text-center">
                      <div className="text-neon-yellow text-xl font-bold font-mono">{result.vulnerabilities.length}</div>
                      <div className="text-dark-400 text-xs">Total Vulns</div>
                    </div>
                    <div className="p-3 rounded-lg bg-dark-800/50 text-center">
                      <div className="text-neon-blue text-xl font-bold font-mono">{result.scanType.toUpperCase()}</div>
                      <div className="text-dark-400 text-xs">Scan Type</div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Port Table */}
              <AnimatedSection delay={100}>
                <div className="cyber-card p-6">
                  <h3 className="text-white font-semibold mb-4">Port Scan Results</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-dark-700/30">
                          <th className="text-left text-dark-400 font-medium pb-3 px-3">State</th>
                          <th className="text-left text-dark-400 font-medium pb-3 px-3">Port</th>
                          <th className="text-left text-dark-400 font-medium pb-3 px-3">Service</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.ports.map((port) => (
                          <tr key={port.port} className="border-b border-dark-800/30 hover:bg-dark-800/20">
                            <td className="py-2.5 px-3">{portStateIcon(port.state)}</td>
                            <td className="py-2.5 px-3 font-mono text-white">{port.port}</td>
                            <td className="py-2.5 px-3 text-dark-300">{port.service}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </AnimatedSection>

              {/* Vulnerabilities */}
              <AnimatedSection delay={200}>
                <div className="cyber-card p-6">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-neon-red" />
                    Detected Vulnerabilities
                  </h3>
                  <div className="space-y-4">
                    {result.vulnerabilities.map((vuln, i) => (
                      <div key={i} className="p-4 rounded-lg bg-dark-800/30 border border-dark-700/30">
                        <div className="flex items-center gap-3 mb-2">
                          <SeverityBadge severity={vuln.severity} size="sm" />
                          <span className="text-white font-medium text-sm">{vuln.title}</span>
                        </div>
                        <p className="text-dark-400 text-sm mb-3">{vuln.description}</p>
                        <div className="p-3 rounded bg-dark-900/50 border border-neon-green/10">
                          <div className="text-neon-green text-xs font-mono mb-1">RECOMMENDATION:</div>
                          <div className="text-dark-300 text-sm">{vuln.recommendation}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
