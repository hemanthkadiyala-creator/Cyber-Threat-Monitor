import { useState, useEffect, useMemo } from 'react';
import { AlertTriangle, Bug, Globe, User, Server, Search, Zap, Shield, ExternalLink } from 'lucide-react';
import AnimatedSection from '../ui/AnimatedSection';
import { SectionHeader, SeverityBadge } from '../ui/SeverityBadge';
import { THREAT_FEED_DATA } from '../../lib/data';
import type { ThreatIndicator } from '../../types';

const typeIcons: Record<string, typeof Shield> = {
  cve: Bug,
  malware: AlertTriangle,
  ip: Server,
  domain: Globe,
  threat_actor: User,
};

const typeColors: Record<string, string> = {
  cve: 'text-neon-orange bg-neon-orange/10 border-neon-orange/20',
  malware: 'text-neon-red bg-neon-red/10 border-neon-red/20',
  ip: 'text-neon-blue bg-neon-blue/10 border-neon-blue/20',
  domain: 'text-neon-purple bg-neon-purple/10 border-neon-purple/20',
  threat_actor: 'text-neon-yellow bg-neon-yellow/10 border-neon-yellow/20',
};

const typeLabels: Record<string, string> = {
  cve: 'CVE',
  malware: 'Malware',
  ip: 'IP Address',
  domain: 'Domain',
  threat_actor: 'Threat Actor',
};

export default function ThreatsPage() {
  const [threats, setThreats] = useState<ThreatIndicator[]>(THREAT_FEED_DATA);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [liveAlert, setLiveAlert] = useState<ThreatIndicator | null>(null);

  // Simulate live alerts
  useEffect(() => {
    const interval = setInterval(() => {
      const randomThreat = THREAT_FEED_DATA[Math.floor(Math.random() * THREAT_FEED_DATA.length)];
      const newThreat: ThreatIndicator = {
        ...randomThreat,
        id: `${Date.now()}`,
        created_at: new Date().toISOString(),
      };
      setLiveAlert(newThreat);
      setThreats((prev) => [newThreat, ...prev.slice(0, 30)]);
      setTimeout(() => setLiveAlert(null), 4000);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(() => {
    return threats.filter((t) => {
      const matchesSearch = !search ||
        t.value.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || t.type === typeFilter;
      const matchesSeverity = severityFilter === 'all' || t.severity === severityFilter;
      return matchesSearch && matchesType && matchesSeverity;
    });
  }, [threats, search, typeFilter, severityFilter]);

  const stats = useMemo(() => ({
    total: threats.length,
    critical: threats.filter((t) => t.severity === 'critical').length,
    high: threats.filter((t) => t.severity === 'high').length,
    types: {
      cve: threats.filter((t) => t.type === 'cve').length,
      malware: threats.filter((t) => t.type === 'malware').length,
      ip: threats.filter((t) => t.type === 'ip').length,
      domain: threats.filter((t) => t.type === 'domain').length,
      threat_actor: threats.filter((t) => t.type === 'threat_actor').length,
    },
  }), [threats]);

  return (
    <div className="pt-20 pb-16">
      {/* Live Alert Banner */}
      {liveAlert && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-neon-red/10 border-b border-neon-red/30 backdrop-blur-xl">
          <div className="section-container py-2 flex items-center gap-3">
            <Zap className="w-4 h-4 text-neon-red animate-pulse flex-shrink-0" />
            <span className="text-neon-red text-xs font-mono">NEW ALERT:</span>
            <span className="text-white text-xs truncate">
              {typeLabels[liveAlert.type]} - {liveAlert.value}: {liveAlert.description}
            </span>
          </div>
        </div>
      )}

      <section className="py-16">
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              title="Threat Intelligence Feed"
              subtitle="Real-time cyber threat indicators including CVEs, malware, suspicious IPs, and threat actor activity."
            />
          </AnimatedSection>

          {/* Stats */}
          <AnimatedSection delay={100}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="cyber-card p-4 text-center">
                <Shield className="w-6 h-6 text-neon-blue mx-auto mb-2" />
                <div className="text-white font-bold font-mono">{stats.total}</div>
                <div className="text-dark-400 text-xs">Total IOCs</div>
              </div>
              <div className="cyber-card p-4 text-center border-neon-red/20">
                <AlertTriangle className="w-6 h-6 text-neon-red mx-auto mb-2" />
                <div className="text-neon-red font-bold font-mono">{stats.critical}</div>
                <div className="text-dark-400 text-xs">Critical</div>
              </div>
              <div className="cyber-card p-4 text-center border-neon-orange/20">
                <Zap className="w-6 h-6 text-neon-orange mx-auto mb-2" />
                <div className="text-neon-orange font-bold font-mono">{stats.high}</div>
                <div className="text-dark-400 text-xs">High</div>
              </div>
              <div className="cyber-card p-4 text-center border-neon-green/20">
                <Globe className="w-6 h-6 text-neon-green mx-auto mb-2" />
                <div className="text-white font-bold font-mono">{Object.values(stats.types).reduce((a, b) => a + b, 0)}</div>
                <div className="text-dark-400 text-xs">Categories</div>
              </div>
            </div>
          </AnimatedSection>

          {/* Search & Filters */}
          <AnimatedSection delay={150}>
            <div className="cyber-card p-6 mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                  <input
                    type="text"
                    placeholder="Search indicators..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="cyber-input pl-11"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="cyber-input w-auto text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="cve">CVE</option>
                    <option value="malware">Malware</option>
                    <option value="ip">IP Address</option>
                    <option value="domain">Domain</option>
                    <option value="threat_actor">Threat Actor</option>
                  </select>
                  <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    className="cyber-input w-auto text-sm"
                  >
                    <option value="all">All Severities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Threat Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((threat, i) => {
              const Icon = typeIcons[threat.type] || Shield;
              const colorClass = typeColors[threat.type] || 'text-neon-blue bg-neon-blue/10 border-neon-blue/20';

              return (
                <AnimatedSection key={threat.id || i} delay={Math.min(i * 50, 500)}>
                  <div className="cyber-card p-5 group h-full flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`flex items-center gap-2 px-2 py-1 rounded-lg border text-xs font-mono ${colorClass}`}>
                        <Icon className="w-3 h-3" />
                        {typeLabels[threat.type]}
                      </div>
                      <SeverityBadge severity={threat.severity} size="sm" />
                    </div>

                    <div className="font-mono text-white font-semibold text-sm mb-2 break-all">
                      {threat.value}
                    </div>

                    <p className="text-dark-400 text-sm flex-1 mb-3">{threat.description}</p>

                    <div className="flex items-center justify-between pt-3 border-t border-dark-700/30">
                      <span className="text-dark-500 text-xs font-mono">{threat.source}</span>
                      {threat.type === 'cve' && (
                        <a
                          href={`https://nvd.nist.gov/vuln/detail/${threat.value}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neon-blue text-xs flex items-center gap-1 hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" /> NVD
                        </a>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-dark-400">No threat indicators match your filters.</div>
          )}
        </div>
      </section>
    </div>
  );
}
