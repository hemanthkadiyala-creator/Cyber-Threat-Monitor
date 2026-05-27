import { useState, useEffect, useMemo } from 'react';
import { Shield, AlertTriangle, Eye, Clock, Activity, Filter, Search, ChevronDown, ChevronUp } from 'lucide-react';
import AnimatedSection from '../ui/AnimatedSection';
import { SectionHeader, SeverityBadge, StatusBadge, LoadingSpinner } from '../ui/SeverityBadge';
import { SOC_INCIDENTS_DATA } from '../../lib/data';
import type { SocIncident } from '../../types';

export default function SocDashboardPage() {
  const [incidents, setIncidents] = useState<SocIncident[]>(SOC_INCIDENTS_DATA);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedIncident, setExpandedIncident] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIncidents((prev) =>
        prev.map((inc) => {
          if (inc.status === 'new' && Math.random() > 0.7) {
            return { ...inc, status: 'investigating' };
          }
          if (inc.status === 'investigating' && Math.random() > 0.85) {
            return { ...inc, status: 'resolved' };
          }
          return inc;
        })
      );
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const filtered = useMemo(() => {
    return incidents.filter((inc) => {
      const matchesSearch = !search ||
        inc.title.toLowerCase().includes(search.toLowerCase()) ||
        inc.description.toLowerCase().includes(search.toLowerCase()) ||
        inc.source_ip.toLowerCase().includes(search.toLowerCase());
      const matchesSeverity = severityFilter === 'all' || inc.severity === severityFilter;
      const matchesStatus = statusFilter === 'all' || inc.status === statusFilter;
      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [incidents, search, severityFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: incidents.length,
    critical: incidents.filter((i) => i.severity === 'critical').length,
    newIncidents: incidents.filter((i) => i.status === 'new').length,
    investigating: incidents.filter((i) => i.status === 'investigating').length,
    resolved: incidents.filter((i) => i.status === 'resolved').length,
  }), [incidents]);

  const attackTypeDistribution = useMemo(() => {
    const dist: Record<string, number> = {};
    incidents.forEach((i) => {
      dist[i.attack_type] = (dist[i.attack_type] || 0) + 1;
    });
    return Object.entries(dist).sort((a, b) => b[1] - a[1]);
  }, [incidents]);

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="pt-20 pb-16">
      <section className="py-16">
        <div className="section-container">
          <AnimatedSection>
            <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
              <SectionHeader
                title="SOC Analyst Dashboard"
                subtitle="Real-time security monitoring, incident alerts, and threat severity tracking."
              />
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="cyber-btn text-xs flex items-center gap-2"
              >
                {refreshing ? (
                  <div className="w-4 h-4 border-2 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin" />
                ) : (
                  <Activity className="w-4 h-4" />
                )}
                Refresh
              </button>
            </div>
          </AnimatedSection>

          {/* Stats */}
          <AnimatedSection delay={100}>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
              <div className="cyber-card p-4 text-center border-l-2 border-l-neon-blue">
                <div className="text-white font-bold text-xl font-mono">{stats.total}</div>
                <div className="text-dark-400 text-xs">Total Incidents</div>
              </div>
              <div className="cyber-card p-4 text-center border-l-2 border-l-neon-red">
                <AlertTriangle className="w-5 h-5 text-neon-red mx-auto mb-1 animate-pulse" />
                <div className="text-neon-red font-bold font-mono">{stats.critical}</div>
                <div className="text-dark-400 text-xs">Critical</div>
              </div>
              <div className="cyber-card p-4 text-center border-l-2 border-l-neon-blue">
                <Eye className="w-5 h-5 text-neon-blue mx-auto mb-1" />
                <div className="text-neon-blue font-bold font-mono">{stats.newIncidents}</div>
                <div className="text-dark-400 text-xs">New</div>
              </div>
              <div className="cyber-card p-4 text-center border-l-2 border-l-neon-yellow">
                <Clock className="w-5 h-5 text-neon-yellow mx-auto mb-1" />
                <div className="text-neon-yellow font-bold font-mono">{stats.investigating}</div>
                <div className="text-dark-400 text-xs">Investigating</div>
              </div>
              <div className="cyber-card p-4 text-center border-l-2 border-l-neon-green">
                <Shield className="w-5 h-5 text-neon-green mx-auto mb-1" />
                <div className="text-neon-green font-bold font-mono">{stats.resolved}</div>
                <div className="text-dark-400 text-xs">Resolved</div>
              </div>
            </div>
          </AnimatedSection>

          {/* Attack Type Distribution */}
          <AnimatedSection delay={150}>
            <div className="cyber-card p-6 mb-8">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-neon-blue" />
                Attack Type Distribution
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {attackTypeDistribution.map(([type, count]) => {
                  const pct = Math.round((count / incidents.length) * 100);
                  return (
                    <div key={type} className="p-3 rounded-lg bg-dark-800/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-dark-300 text-xs capitalize">{type.replace('_', ' ')}</span>
                        <span className="text-white text-xs font-mono">{count}</span>
                      </div>
                      <div className="w-full h-1.5 bg-dark-700 rounded-full overflow-hidden">
                        <div className="h-full bg-neon-blue rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </AnimatedSection>

          {/* Filters */}
          <AnimatedSection delay={200}>
            <div className="cyber-card p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-dark-400" />
                <span className="text-dark-300 text-sm font-medium">Filter Incidents</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                  <input
                    type="text"
                    placeholder="Search incidents..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="cyber-input pl-11"
                  />
                </div>
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
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="cyber-input w-auto text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="investigating">Investigating</option>
                  <option value="resolved">Resolved</option>
                  <option value="false_positive">False Positive</option>
                </select>
              </div>
            </div>
          </AnimatedSection>

          {/* Incident List */}
          {refreshing ? (
            <div className="py-20"><LoadingSpinner /></div>
          ) : (
            <div className="space-y-3">
              {filtered.map((incident, i) => (
                <AnimatedSection key={incident.id} delay={Math.min(i * 50, 300)}>
                  <div className={`cyber-card transition-all ${
                    incident.severity === 'critical' ? 'border-neon-red/20' :
                    incident.severity === 'high' ? 'border-neon-orange/20' : ''
                  }`}>
                    <button
                      onClick={() => setExpandedIncident(
                        expandedIncident === incident.id ? null : incident.id
                      )}
                      className="w-full p-5 text-left flex items-center gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="text-white font-semibold text-sm">{incident.title}</span>
                          <SeverityBadge severity={incident.severity} size="sm" />
                          <StatusBadge status={incident.status} />
                        </div>
                        <p className="text-dark-400 text-xs truncate">{incident.description}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-dark-500 text-xs font-mono">{formatTimeAgo(incident.created_at)}</span>
                        {expandedIncident === incident.id ? (
                          <ChevronUp className="w-4 h-4 text-dark-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-dark-400" />
                        )}
                      </div>
                    </button>

                    {expandedIncident === incident.id && (
                      <div className="px-5 pb-5 border-t border-dark-700/30 pt-4">
                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-3">
                            <div>
                              <span className="text-dark-500 text-xs font-mono block mb-1">SOURCE IP</span>
                              <span className="text-neon-blue font-mono text-sm">{incident.source_ip}</span>
                            </div>
                            <div>
                              <span className="text-dark-500 text-xs font-mono block mb-1">TARGET IP</span>
                              <span className="text-neon-purple font-mono text-sm">{incident.target_ip}</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <span className="text-dark-500 text-xs font-mono block mb-1">ATTACK TYPE</span>
                              <span className="text-white text-sm capitalize">{incident.attack_type.replace('_', ' ')}</span>
                            </div>
                            <div>
                              <span className="text-dark-500 text-xs font-mono block mb-1">DETECTED</span>
                              <span className="text-dark-300 text-xs">{new Date(incident.created_at).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-dark-300 text-sm">{incident.description}</p>
                      </div>
                    )}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}

          {filtered.length === 0 && !refreshing && (
            <div className="text-center py-12 text-dark-400">No incidents match your filters.</div>
          )}
        </div>
      </section>
    </div>
  );
}
