import { useState } from 'react';
import { Shield, AlertTriangle, Terminal, Bug, Lock, Code, Eye, CheckCircle, XCircle, Zap, Database, Key, FolderOpen } from 'lucide-react';
import AnimatedSection from '../ui/AnimatedSection';

type SimulationType = 'xss' | 'sqli' | 'csrf' | 'auth_bypass' | 'jwt_tamper' | 'path_traversal';

interface SimulationResult {
  type: SimulationType;
  payload: string;
  blocked: boolean;
  mitigation: string;
  explanation: string;
  timestamp: Date;
}

const SIMULATIONS: { type: SimulationType; name: string; icon: typeof Shield | typeof Database | typeof Key | typeof FolderOpen | typeof Lock | typeof Code; description: string }[] = [
  { type: 'xss', name: 'Cross-Site Scripting (XSS)', icon: Code, description: 'Test reflected and stored XSS payloads' },
  { type: 'sqli', name: 'SQL Injection', icon: Database, description: 'Attempt SQL injection attacks' },
  { type: 'csrf', name: 'CSRF Attack', icon: Shield, description: 'Cross-Site Request Forgery simulation' },
  { type: 'auth_bypass', name: 'Authentication Bypass', icon: Lock, description: 'Test authentication weaknesses' },
  { type: 'jwt_tamper', name: 'JWT Tampering', icon: Key, description: 'Manipulate JWT tokens' },
  { type: 'path_traversal', name: 'Path Traversal', icon: FolderOpen, description: 'Directory traversal attempts' },
];

const XSS_PAYLOADS = [
  { payload: '<script>alert(1)</script>', blocked: true, mitigation: 'DOMPurify sanitization + CSP headers' },
  { payload: '<img src=x onerror=alert(1)>', blocked: true, mitigation: 'HTML entity encoding + input validation' },
  { payload: 'javascript:alert(document.cookie)', blocked: true, mitigation: 'Protocol validation + CSP' },
  { payload: '<svg/onload=alert(1)>', blocked: true, mitigation: 'SVG sanitization + CSP' },
  { payload: '${alert(1)}', blocked: true, mitigation: 'Template literal protection' },
];

const SQLI_PAYLOADS = [
  { payload: "' OR '1'='1", blocked: true, mitigation: 'Parameterized queries + input validation' },
  { payload: "'; DROP TABLE users;--", blocked: true, mitigation: 'Prepared statements + least privilege' },
  { payload: "' UNION SELECT * FROM users--", blocked: true, mitigation: 'Query parameterization + ORM' },
  { payload: "1; EXEC xp_cmdshell('dir')", blocked: true, mitigation: 'Stored procedures + input sanitization' },
  { payload: "admin'--", blocked: true, mitigation: 'Input validation + prepared statements' },
];

const AUTH_BYPASS_PAYLOADS = [
  { payload: "admin' OR '1'='1'--", blocked: true, mitigation: 'Parameterized queries + rate limiting' },
  { payload: 'admin@example.com\npassword', blocked: true, mitigation: 'Input sanitization + CRLF protection' },
  { payload: '{"email":"admin@test.com","password":""}', blocked: true, mitigation: 'Server-side validation + schema enforcement' },
];

const JWT_PAYLOADS = [
  { payload: 'Change algorithm to "none"', blocked: true, mitigation: 'Algorithm whitelist + signature verification' },
  { payload: 'Modify payload claims', blocked: true, mitigation: 'Signature verification + claim validation' },
  { payload: 'Use weak secret key', blocked: true, mitigation: 'Strong secret keys (256-bit+)' },
  { payload: 'Expired token reuse', blocked: true, mitigation: 'Token expiration + refresh mechanism' },
];

const PATH_TRAVERSAL_PAYLOADS = [
  { payload: '../../../etc/passwd', blocked: true, mitigation: 'Path canonicalization + whitelist' },
  { payload: '....//....//etc/passwd', blocked: true, mitigation: 'Input sanitization + path validation' },
  { payload: '%2e%2e%2f%2e%2e%2fetc/passwd', blocked: true, mitigation: 'URL decoding validation + sandbox' },
];

const CSRF_SCENARIOS = [
  { payload: '<form action="bank.com/transfer" method="POST">', blocked: true, mitigation: 'CSRF tokens + SameSite cookies' },
  { payload: ' fetch("api/delete", {credentials: "include"})', blocked: true, mitigation: 'Origin validation + CSRF tokens' },
  { payload: '<img src="api/change-password?new=pwned">', blocked: true, mitigation: 'POST-only endpoints + CSRF tokens' },
];

export default function AttackLabPage() {
  const [activeSim, setActiveSim] = useState<SimulationType>('xss');
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [running, setRunning] = useState(false);

  const runSimulation = async () => {
    setRunning(true);
    const newResults: SimulationResult[] = [];

    let payloads: { payload: string; blocked: boolean; mitigation: string }[] = [];

    switch (activeSim) {
      case 'xss': payloads = XSS_PAYLOADS; break;
      case 'sqli': payloads = SQLI_PAYLOADS; break;
      case 'csrf': payloads = CSRF_SCENARIOS; break;
      case 'auth_bypass': payloads = AUTH_BYPASS_PAYLOADS; break;
      case 'jwt_tamper': payloads = JWT_PAYLOADS; break;
      case 'path_traversal': payloads = PATH_TRAVERSAL_PAYLOADS; break;
    }

    for (let i = 0; i < payloads.length; i++) {
      await new Promise((r) => setTimeout(r, 400 + Math.random() * 200));
      const p = payloads[i];
      newResults.push({
        type: activeSim,
        payload: p.payload,
        blocked: p.blocked,
        mitigation: p.mitigation,
        explanation: getExplanation(activeSim, p.payload),
        timestamp: new Date(),
      });
      setResults([...newResults]);
    }

    setRunning(false);
  };

  const getExplanation = (type: SimulationType, payload: string): string => {
    const explanations: Record<SimulationType, string> = {
      xss: `XSS payload "${payload.slice(0, 30)}..." was sanitized before rendering. DOMPurify removes dangerous HTML, and CSP headers prevent inline script execution.`,
      sqli: `SQL injection attempt detected. The application uses parameterized queries, ensuring user input is treated as data, not executable code.`,
      csrf: `CSRF attack blocked. The application requires valid CSRF tokens for state-changing operations, and uses SameSite=Strict cookie attribute.`,
      auth_bypass: `Authentication bypass attempted. Multi-layer validation including input sanitization, rate limiting, and parameterized queries prevent this attack.`,
      jwt_tamper: `JWT manipulation detected. The server verifies signatures using secure algorithms and validates all claims including expiration.`,
      path_traversal: `Path traversal attempt blocked. User inputs are canonicalized and validated against a whitelist of allowed paths.`,
    };
    return explanations[type];
  };

  const activeSimData = SIMULATIONS.find((s) => s.type === activeSim)!;

  return (
    <div className="pt-20 pb-16">
      <section className="py-16">
        <div className="section-container">
          <AnimatedSection>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Terminal className="w-10 h-10 text-neon-red" />
                <h1 className="text-3xl sm:text-4xl font-bold">
                  <span className="text-gradient-cyber">Attack Simulation Lab</span>
                </h1>
              </div>
              <p className="text-dark-400 max-w-2xl mx-auto">
                Safely test common web vulnerabilities against this application. All attacks are simulated and blocked by security controls.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-neon-yellow text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Educational purposes only - All payloads are safely demonstrated</span>
              </div>
            </div>
          </AnimatedSection>

          {/* Simulation Type Selector */}
          <AnimatedSection delay={100}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {SIMULATIONS.map((sim) => (
                <button
                  key={sim.type}
                  onClick={() => {
                    setActiveSim(sim.type);
                    setResults([]);
                  }}
                  disabled={running}
                  className={`cyber-card p-5 text-left transition-all ${
                    activeSim === sim.type
                      ? 'border-neon-red/50 shadow-lg shadow-neon-red/10'
                      : 'hover:border-dark-600'
                  } disabled:opacity-50`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <sim.icon className={`w-5 h-5 ${activeSim === sim.type ? 'text-neon-red' : 'text-dark-400'}`} />
                    <span className={`text-sm font-medium ${activeSim === sim.type ? 'text-white' : 'text-dark-300'}`}>
                      {sim.name}
                    </span>
                  </div>
                  <p className="text-dark-500 text-xs">{sim.description}</p>
                </button>
              ))}
            </div>
          </AnimatedSection>

          {/* Active Simulation Panel */}
          <AnimatedSection delay={200}>
            <div className="cyber-card p-6 border-neon-red/20 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <activeSimData.icon className="w-6 h-6 text-neon-red" />
                  <div>
                    <h2 className="text-white font-semibold">{activeSimData.name}</h2>
                    <p className="text-dark-400 text-xs">Simulated attack demonstration</p>
                  </div>
                </div>
                <button
                  onClick={runSimulation}
                  disabled={running}
                  className="cyber-btn-danger flex items-center gap-2"
                >
                  {running ? (
                    <>
                      <div className="w-4 h-4 border-2 border-neon-red/30 border-t-neon-red rounded-full animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Run Simulation
                    </>
                  )}
                </button>
              </div>

              {/* OWASP Reference */}
              <div className="p-4 rounded-lg bg-neon-blue/5 border border-neon-blue/20 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Bug className="w-4 h-4 text-neon-blue" />
                  <span className="text-neon-blue text-sm font-mono">OWASP Reference</span>
                </div>
                <p className="text-dark-300 text-sm">
                  {activeSim === 'xss' && 'A03:2021 – Injection. XSS is a type of injection attack where malicious scripts are injected into web pages.'}
                  {activeSim === 'sqli' && 'A03:2021 – Injection. SQL injection allows attackers to interfere with database queries.'}
                  {activeSim === 'csrf' && 'A01:2021 – Broken Access Control. CSRF forces users to execute unwanted actions.'}
                  {activeSim === 'auth_bypass' && 'A07:2021 – Identification and Authentication Failures. Weak authentication allows unauthorized access.'}
                  {activeSim === 'jwt_tamper' && 'A07:2021 – Identification and Authentication Failures. Improper JWT validation leads to session hijacking.'}
                  {activeSim === 'path_traversal' && 'A01:2021 – Broken Access Control. Path traversal accesses files outside web root.'}
                </p>
              </div>

              {/* Results */}
              {results.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-dark-400">
                    <Eye className="w-4 h-4" />
                    Execution Log
                  </div>
                  {results.map((result, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-lg border ${
                        result.blocked
                          ? 'bg-neon-green/5 border-neon-green/20'
                          : 'bg-neon-red/5 border-neon-red/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {result.blocked ? (
                            <CheckCircle className="w-5 h-5 text-neon-green" />
                          ) : (
                            <XCircle className="w-5 h-5 text-neon-red" />
                          )}
                          <span className={`text-sm font-mono ${result.blocked ? 'text-neon-green' : 'text-neon-red'}`}>
                            {result.blocked ? 'BLOCKED' : 'DETECTED'}
                          </span>
                        </div>
                        <span className="text-dark-500 text-xs font-mono">
                          {result.timestamp.toLocaleTimeString()}
                        </span>
                      </div>

                      <div className="mb-3">
                        <span className="text-dark-500 text-xs font-mono">PAYLOAD:</span>
                        <div className="mt-1 p-2 bg-dark-900 rounded font-mono text-xs text-neon-blue break-all">
                          {result.payload}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <span className="text-dark-500 text-xs font-mono">MITIGATION:</span>
                          <p className="mt-1 text-neon-green text-sm">{result.mitigation}</p>
                        </div>
                        <div>
                          <span className="text-dark-500 text-xs font-mono">EXPLANATION:</span>
                          <p className="mt-1 text-dark-300 text-sm">{result.explanation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {results.length === 0 && !running && (
                <div className="text-center py-12 text-dark-400">
                  <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Click "Run Simulation" to test attack payloads</p>
                </div>
              )}
            </div>
          </AnimatedSection>

          {/* Security Controls Implemented */}
          <AnimatedSection delay={300}>
            <div className="cyber-card p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-neon-green" />
                Security Controls Implemented
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Content Security Policy', status: 'Active', desc: 'Prevents XSS attacks' },
                  { name: 'Parameterized Queries', status: 'Active', desc: 'Prevents SQL injection' },
                  { name: 'CSRF Tokens', status: 'Active', desc: 'Prevents CSRF attacks' },
                  { name: 'Input Sanitization', status: 'Active', desc: 'DOMPurify + validation' },
                  { name: 'Rate Limiting', status: 'Active', desc: 'Brute-force protection' },
                  { name: 'Security Headers', status: 'Active', desc: 'HSTS, X-Frame-Options' },
                  { name: 'JWT Validation', status: 'Active', desc: 'Signature + claim checks' },
                  { name: 'Output Encoding', status: 'Active', desc: 'HTML entity encoding' },
                  { name: 'Path Whitelisting', status: 'Active', desc: 'Prevents path traversal' },
                ].map((control) => (
                  <div key={control.name} className="p-3 rounded-lg bg-dark-800/30 border border-dark-700/30">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-neon-green" />
                      <span className="text-white text-sm">{control.name}</span>
                    </div>
                    <p className="text-dark-500 text-xs">{control.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
