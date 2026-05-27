import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Activity, Users, Clock, Globe, Lock, Eye, Server, RefreshCw } from 'lucide-react';
import AnimatedSection from '../ui/AnimatedSection';
import { SeverityBadge, StatusBadge, LoadingSpinner } from '../ui/SeverityBadge';
import { apiFetch } from '../../lib/supabase';

interface AuthLog {
  id: string;
  email: string;
  event_type: string;
  ip_address: string;
  user_agent: string;
  success: boolean;
  failure_reason: string;
  created_at: string;
}

interface SecurityEvent {
  id: string;
  event_type: string;
  severity: string;
  source: string;
  description: string;
  ip_address: string;
  resolved: boolean;
  created_at: string;
}

interface SuspiciousActivity {
  id: string;
  activity_type: string;
  severity: string;
  description: string;
  ip_address: string;
  status: string;
  created_at: string;
}

// Sample data for demonstration
const SAMPLE_AUTH_LOGS: AuthLog[] = [
  { id: '1', email: 'admin@cybershield.dev', event_type: 'login_success', ip_address: '192.168.1.100', user_agent: 'Chrome/120.0', success: true, failure_reason: '', created_at: new Date(Date.now() - 1000000).toISOString() },
  { id: '2', email: 'admin@cybershield.dev', event_type: 'login_failed', ip_address: '185.234.72.11', user_agent: 'python-requests/2.28', success: false, failure_reason: 'Invalid credentials', created_at: new Date(Date.now() - 900000).toISOString() },
  { id: '3', email: 'admin@cybershield.dev', event_type: 'login_failed', ip_address: '185.234.72.11', user_agent: 'python-requests/2.28', success: false, failure_reason: 'Invalid credentials', created_at: new Date(Date.now() - 850000).toISOString() },
  { id: '4', email: 'admin@cybershield.dev', event_type: 'login_failed', ip_address: '185.234.72.11', user_agent: 'python-requests/2.28', success: false, failure_reason: 'Rate limit exceeded', created_at: new Date(Date.now() - 800000).toISOString() },
  { id: '5', email: 'analyst@cybershield.dev', event_type: 'login_success', ip_address: '10.0.2.45', user_agent: 'Firefox/121.0', success: true, failure_reason: '', created_at: new Date(Date.now() - 600000).toISOString() },
  { id: '6', email: 'unknown@test.com', event_type: 'login_failed', ip_address: '91.234.12.45', user_agent: 'curl/7.88', success: false, failure_reason: 'User not found', created_at: new Date(Date.now() - 300000).toISOString() },
  { id: '7', email: 'analyst@cybershield.dev', event_type: 'logout', ip_address: '10.0.2.45', user_agent: 'Firefox/121.0', success: true, failure_reason: '', created_at: new Date(Date.now() - 200000).toISOString() },
];

const SAMPLE_SECURITY_EVENTS: SecurityEvent[] = [
  { id: '1', event_type: 'brute_force_detected', severity: 'high', source: 'intrusion_detection', description: 'Potential brute force attack from 185.234.72.11 - 15 failed attempts', ip_address: '185.234.72.11', resolved: false, created_at: new Date(Date.now() - 700000).toISOString() },
  { id: '2', event_type: 'rate_limit_exceeded', severity: 'medium', source: 'rate_limiter', description: 'Contact form rate limit exceeded', ip_address: '192.168.1.50', resolved: true, created_at: new Date(Date.now() - 1500000).toISOString() },
  { id: '3', event_type: 'suspicious_user_agent', severity: 'low', source: 'waf', description: 'Automated tool detected in user agent: sqlmap', ip_address: '45.33.32.156', resolved: false, created_at: new Date(Date.now() - 2000000).toISOString() },
  { id: '4', event_type: 'xss_attempt', severity: 'high', source: 'waf', description: 'XSS payload detected in form submission', ip_address: '10.0.1.20', resolved: true, created_at: new Date(Date.now() - 3000000).toISOString() },
];

const SAMPLE_SUSPICIOUS: SuspiciousActivity[] = [
  { id: '1', activity_type: 'brute_force_attempt', severity: 'high', description: 'Multiple failed login attempts detected', ip_address: '185.234.72.11', status: 'investigating', created_at: new Date(Date.now() - 800000).toISOString() },
  { id: '2', activity_type: 'unusual_location', severity: 'medium', description: 'Login from new geographic location: Russia', ip_address: '91.234.12.45', status: 'flagged', created_at: new Date(Date.now() - 1200000).toISOString() },
  { id: '3', activity_type: 'credential_stuffing', severity: 'high', description: 'Possible credential stuffing attack pattern', ip_address: '45.33.32.156', status: 'flagged', created_at: new Date(Date.now() - 1800000).toISOString() },
];

export default function SecurityDashboardPage() {
  const [authLogs, setAuthLogs] = useState<AuthLog[]>(SAMPLE_AUTH_LOGS);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>(SAMPLE_SECURITY_EVENTS);
  const [suspicious, setSuspicious] = useState<SuspiciousActivity[]>(SAMPLE_SUSPICIOUS);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'auth' | 'events' | 'suspicious'>('auth');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      // Try to fetch from API, fall back to sample data
      const logs = await apiFetch('/security/logs?type=auth');
      if (logs && logs.length > 0) setAuthLogs(logs);

      const events = await apiFetch('/security/logs?type=security');
      if (events && events.length > 0) setSecurityEvents(events);

      const sus = await apiFetch('/security/logs?type=suspicious');
      if (sus && sus.length > 0) setSuspicious(sus);
    } catch {
      // Use sample data if API fails
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalLogins: authLogs.filter((l) => l.event_type === 'login_success').length,
    failedLogins: authLogs.filter((l) => l.event_type === 'login_failed').length,
    securityEvents: securityEvents.length,
    unresolvedEvents: securityEvents.filter((e) => !e.resolved).length,
    flaggedActivities: suspicious.filter((s) => s.status === 'flagged').length,
  };

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const eventSeverity = (event: SecurityEvent): 'critical' | 'high' | 'medium' | 'low' => {
    return event.severity as 'critical' | 'high' | 'medium' | 'low';
  };

  return (
    <div className="pt-20 pb-16">
      <section className="py-16">
        <div className="section-container">
          <AnimatedSection>
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-8 h-8 text-neon-blue" />
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">Security Dashboard</h1>
                </div>
                <p className="text-dark-400 text-sm">Real-time security monitoring and SIEM-style log analysis</p>
              </div>
              <button onClick={loadLogs} disabled={loading} className="cyber-btn text-xs flex items-center gap-2">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </AnimatedSection>

          {/* Stats Grid */}
          <AnimatedSection delay={100}>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
              <div className="cyber-card p-4 text-center border-l-2 border-l-neon-green">
                <Users className="w-5 h-5 text-neon-green mx-auto mb-2" />
                <div className="text-neon-green font-bold font-mono text-lg">{stats.totalLogins}</div>
                <div className="text-dark-400 text-xs">Successful Logins</div>
              </div>
              <div className="cyber-card p-4 text-center border-l-2 border-l-neon-red">
                <Lock className="w-5 h-5 text-neon-red mx-auto mb-2" />
                <div className="text-neon-red font-bold font-mono text-lg">{stats.failedLogins}</div>
                <div className="text-dark-400 text-xs">Failed Attempts</div>
              </div>
              <div className="cyber-card p-4 text-center border-l-2 border-l-neon-yellow">
                <AlertTriangle className="w-5 h-5 text-neon-yellow mx-auto mb-2" />
                <div className="text-neon-yellow font-bold font-mono text-lg">{stats.securityEvents}</div>
                <div className="text-dark-400 text-xs">Security Events</div>
              </div>
              <div className="cyber-card p-4 text-center border-l-2 border-l-neon-orange">
                <Activity className="w-5 h-5 text-neon-orange mx-auto mb-2" />
                <div className="text-neon-orange font-bold font-mono text-lg">{stats.unresolvedEvents}</div>
                <div className="text-dark-400 text-xs">Unresolved</div>
              </div>
              <div className="cyber-card p-4 text-center border-l-2 border-l-neon-purple">
                <Eye className="w-5 h-5 text-neon-purple mx-auto mb-2" />
                <div className="text-neon-purple font-bold font-mono text-lg">{stats.flaggedActivities}</div>
                <div className="text-dark-400 text-xs">Flagged IPs</div>
              </div>
            </div>
          </AnimatedSection>

          {/* Tabs */}
          <AnimatedSection delay={150}>
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {[
                { key: 'auth' as const, label: 'Auth Logs', icon: Lock },
                { key: 'events' as const, label: 'Security Events', icon: AlertTriangle },
                { key: 'suspicious' as const, label: 'Suspicious Activity', icon: Eye },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/30'
                      : 'text-dark-400 hover:text-white hover:bg-dark-800/50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </AnimatedSection>

          {/* Content */}
          <AnimatedSection delay={200}>
            {loading ? (
              <div className="py-20"><LoadingSpinner /></div>
            ) : activeTab === 'auth' ? (
              <div className="cyber-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-dark-900/50">
                      <tr className="border-b border-dark-700/30">
                        <th className="text-left py-3 px-4 text-dark-400 font-medium">Event</th>
                        <th className="text-left py-3 px-4 text-dark-400 font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-dark-400 font-medium">IP Address</th>
                        <th className="text-left py-3 px-4 text-dark-400 font-medium">User Agent</th>
                        <th className="text-left py-3 px-4 text-dark-400 font-medium">Status</th>
                        <th className="text-left py-3 px-4 text-dark-400 font-medium">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {authLogs.map((log) => (
                        <tr key={log.id} className="border-b border-dark-800/30 hover:bg-dark-800/20">
                          <td className="py-3 px-4">
                            <span className={`font-mono text-xs ${log.success ? 'text-neon-green' : 'text-neon-red'}`}>
                              {log.event_type.replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-dark-300 font-mono text-xs">{log.email}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              <Globe className="w-3 h-3 text-dark-500" />
                              <span className="text-neon-blue font-mono text-xs">{log.ip_address}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-dark-400 text-xs truncate max-w-[200px]">{log.user_agent}</td>
                          <td className="py-3 px-4">
                            {log.success ? (
                              <span className="inline-flex items-center gap-1 text-neon-green text-xs">
                                <Server className="w-3 h-3" /> Success
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-neon-red text-xs">
                                <Lock className="w-3 h-3" /> Failed
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-dark-500 text-xs font-mono">{formatTime(log.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : activeTab === 'events' ? (
              <div className="space-y-3">
                {securityEvents.map((event) => (
                  <div key={event.id} className={`cyber-card p-4 ${event.resolved ? 'opacity-60' : ''}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <SeverityBadge severity={eventSeverity(event)} size="sm" />
                        <span className="text-white font-medium text-sm">{event.event_type.replace('_', ' ')}</span>
                      </div>
                      <StatusBadge status={event.resolved ? 'resolved' : 'completed'} />
                    </div>
                    <p className="text-dark-300 text-sm mb-2">{event.description}</p>
                    <div className="flex items-center gap-4 text-xs text-dark-500">
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3" /> {event.ip_address}
                      </span>
                      <span className="flex items-center gap-1">
                        <Server className="w-3 h-3" /> {event.source}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formatTime(event.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {suspicious.map((item) => (
                  <div key={item.id} className="cyber-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <SeverityBadge severity={item.severity as 'critical' | 'high' | 'medium' | 'low'} size="sm" />
                        <span className="text-white font-medium text-sm">{item.activity_type.replace('_', ' ')}</span>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="text-dark-300 text-sm mb-2">{item.description}</p>
                    <div className="flex items-center gap-4 text-xs text-dark-500">
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3" /> {item.ip_address}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formatTime(item.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
