import { useState } from 'react';
import { ExternalLink, Github, ChevronRight } from 'lucide-react';
import AnimatedSection from '../ui/AnimatedSection';
import { SectionHeader } from '../ui/SeverityBadge';
import { PROJECTS_DATA, CERTIFICATIONS_DATA } from '../../lib/data';

const categories = [
  { key: 'all', label: 'All' },
  { key: 'web_security', label: 'Web Security' },
  { key: 'network', label: 'Network' },
  { key: 'monitoring', label: 'Monitoring' },
  { key: 'threat_intel', label: 'Threat Intel' },
];

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all'
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter((p) => p.category === activeCategory);

  return (
    <div className="pt-20 pb-16">
      {/* Projects */}
      <section className="py-16">
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              title="Projects"
              subtitle="Cybersecurity projects demonstrating practical skills in vulnerability assessment, network monitoring, and threat intelligence."
            />
          </AnimatedSection>

          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 text-sm rounded-lg transition-all font-medium ${
                  activeCategory === cat.key
                    ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30'
                    : 'bg-dark-800/50 text-dark-400 border border-dark-700/30 hover:text-white hover:border-dark-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, i) => (
              <AnimatedSection key={project.id} delay={i * 100}>
                <div className="cyber-card overflow-hidden group h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/30 to-transparent" />
                    {project.featured && (
                      <span className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-mono bg-neon-blue/20 text-neon-blue rounded border border-neon-blue/30">
                        FEATURED
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-neon-blue transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-dark-400 text-sm mb-4 flex-1">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="px-2 py-0.5 text-[10px] font-mono bg-dark-800/50 text-neon-blue rounded border border-neon-blue/20">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 pt-3 border-t border-dark-700/30">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-dark-400 hover:text-neon-blue text-sm transition-colors"
                        >
                          <Github className="w-4 h-4" /> Code
                        </a>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-dark-400 hover:text-neon-green text-sm transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" /> Live
                        </a>
                      )}
                      <span className="ml-auto text-neon-blue text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Details <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-dark-950/50">
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              title="Certifications"
              subtitle="Professional certifications validating expertise in cybersecurity domains."
            />
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CERTIFICATIONS_DATA.map((cert, i) => (
              <AnimatedSection key={cert.id} delay={i * 100}>
                <div className="cyber-card p-6 text-center h-full flex flex-col">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 border border-neon-blue/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-neon-blue font-mono">
                      {cert.issuer.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">{cert.title}</h3>
                  <p className="text-neon-blue text-xs mb-2">{cert.issuer}</p>
                  <p className="text-dark-500 text-xs font-mono mb-4">
                    Issued: {cert.issue_date}
                  </p>
                  <div className="mt-auto">
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-neon-blue text-xs hover:text-neon-green transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" /> Verify
                    </a>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
