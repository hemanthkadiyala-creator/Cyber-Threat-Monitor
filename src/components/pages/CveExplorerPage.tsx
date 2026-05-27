import { useState, useMemo } from 'react';
import { Search, Filter, Shield, ExternalLink } from 'lucide-react';
import AnimatedSection from '../ui/AnimatedSection';
import { SectionHeader, SeverityBadge } from '../ui/SeverityBadge';
import { CVE_DATA } from '../../lib/data';

const severityFilters = ['all', 'critical', 'high', 'medium', 'low'];

export default function CveExplorerPage() {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [selectedCve, setSelectedCve] = useState<typeof CVE_DATA[number] | null>(null);

  const filtered = useMemo(() => {
    return CVE_DATA.filter((cve) => {
      const matchesSearch = !search ||
        cve.id.toLowerCase().includes(search.toLowerCase()) ||
        cve.description.toLowerCase().includes(search.toLowerCase()) ||
        cve.affected.toLowerCase().includes(search.toLowerCase());
      const matchesSeverity = severityFilter === 'all' || cve.severity === severityFilter;
      return matchesSearch && matchesSeverity;
    });
  }, [search, severityFilter]);

  const scoreColor = (score: number) => {
    if (score >= 9) return 'text-neon-red';
    if (score >= 7) return 'text-neon-orange';
    if (score >= 4) return 'text-neon-yellow';
    return 'text-neon-green';
  };

  const scoreBg = (score: number) => {
    if (score >= 9) return 'bg-neon-red/10 border-neon-red/30';
    if (score >= 7) return 'bg-neon-orange/10 border-neon-orange/30';
    if (score >= 4) return 'bg-neon-yellow/10 border-neon-yellow/30';
    return 'bg-neon-green/10 border-neon-green/30';
  };

  return (
    <div className="pt-20 pb-16">
      <section className="py-16">
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              title="CVE Explorer"
              subtitle="Search and explore Common Vulnerabilities and Exposures with severity scores and patch information."
            />
          </AnimatedSection>

          {/* Search & Filter */}
          <AnimatedSection>
            <div className="max-w-3xl mx-auto mb-8 space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input
                  type="text"
                  placeholder="Search CVE ID, description, or affected software..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="cyber-input pl-11"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-dark-400" />
                {severityFilters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSeverityFilter(filter)}
                    className={`px-3 py-1.5 text-xs rounded-lg transition-all font-medium capitalize ${
                      severityFilter === filter
                        ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30'
                        : 'bg-dark-800/50 text-dark-400 border border-dark-700/30 hover:text-white'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* CVE Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* CVE List */}
            <div className="lg:col-span-2">
              <div className="space-y-3">
                {filtered.map((cve, i) => (
                  <AnimatedSection key={cve.id} delay={i * 50}>
                    <button
                      onClick={() => setSelectedCve(selectedCve?.id === cve.id ? null : cve)}
                      className={`w-full text-left cyber-card p-5 transition-all ${
                        selectedCve?.id === cve.id ? 'border-neon-blue/50 shadow-lg shadow-neon-blue/10' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-white font-semibold text-sm">{cve.id}</span>
                          <SeverityBadge severity={cve.severity} size="sm" />
                        </div>
                        <div className={`px-3 py-1 rounded-lg border font-mono font-bold text-sm ${scoreBg(cve.score)}`}>
                          <span className={scoreColor(cve.score)}>{cve.score}</span>
                        </div>
                      </div>
                      <p className="text-dark-300 text-sm mb-2">{cve.description}</p>
                      <div className="text-dark-500 text-xs font-mono">
                        Affected: {cve.affected}
                      </div>
                    </button>
                  </AnimatedSection>
                ))}
                {filtered.length === 0 && (
                  <div className="text-center py-12 text-dark-400">No CVEs found matching your search.</div>
                )}
              </div>
            </div>

            {/* Detail Panel */}
            <div className="lg:sticky lg:top-20 lg:self-start">
              <AnimatedSection delay={200}>
                {selectedCve ? (
                  <div className="cyber-card p-6 border-neon-blue/20">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="w-5 h-5 text-neon-blue" />
                      <span className="font-mono text-white font-bold">{selectedCve.id}</span>
                    </div>

                    <div className="mb-4">
                      <SeverityBadge severity={selectedCve.severity} />
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="text-dark-500 text-xs font-mono mb-1">CVSS SCORE</div>
                        <div className={`text-3xl font-bold font-mono ${scoreColor(selectedCve.score)}`}>
                          {selectedCve.score}
                        </div>
                      </div>

                      <div>
                        <div className="text-dark-500 text-xs font-mono mb-1">DESCRIPTION</div>
                        <p className="text-dark-300 text-sm leading-relaxed">{selectedCve.description}</p>
                      </div>

                      <div>
                        <div className="text-dark-500 text-xs font-mono mb-1">AFFECTED SOFTWARE</div>
                        <p className="text-dark-300 text-sm">{selectedCve.affected}</p>
                      </div>

                      <div className="p-3 rounded-lg bg-neon-green/5 border border-neon-green/20">
                        <div className="text-neon-green text-xs font-mono mb-1">PATCH / REMEDIATION</div>
                        <p className="text-dark-300 text-sm">{selectedCve.patch}</p>
                      </div>

                      <a
                        href={`https://nvd.nist.gov/vuln/detail/${selectedCve.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cyber-btn text-xs flex items-center gap-2 justify-center"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View on NVD
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="cyber-card p-8 text-center">
                    <Shield className="w-12 h-12 text-dark-600 mx-auto mb-3" />
                    <h3 className="text-dark-400 font-medium mb-2">Select a CVE</h3>
                    <p className="text-dark-500 text-sm">Click on any vulnerability to view detailed information and remediation steps.</p>
                  </div>
                )}
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
