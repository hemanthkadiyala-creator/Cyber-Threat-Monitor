import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ChevronRight, Download, Mail, Terminal, Eye, Globe, Bug } from 'lucide-react';
import TerminalAnimation from '../ui/TerminalAnimation';
import AnimatedSection from '../ui/AnimatedSection';
import { SKILLS_DATA, PROJECTS_DATA, CERTIFICATIONS_DATA } from '../../lib/data';
import { SeverityBadge } from '../ui/SeverityBadge';

const TITLES = [
  'Cybersecurity Student',
  'Network Security Enthusiast',
  'SOC Analyst Aspirant',
  'Ethical Hacker',
  'Threat Hunter',
];

function TypingEffect() {
  const [currentTitle, setCurrentTitle] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const title = TITLES[currentTitle];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(title.slice(0, displayText.length + 1));
        if (displayText.length === title.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayText(title.slice(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setCurrentTitle((prev) => (prev + 1) % TITLES.length);
        }
      }
    }, isDeleting ? 30 : 80);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentTitle]);

  return (
    <span className="text-neon-blue">
      {displayText}
      <span className="inline-block w-0.5 h-8 bg-neon-blue ml-1 animate-pulse align-middle" />
    </span>
  );
}

function StatsCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= 12847) { clearInterval(interval); return prev; }
        return prev + Math.floor(Math.random() * 50) + 10;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return <span className="font-mono text-neon-blue">{count.toLocaleString()}</span>;
}

export default function HomePage() {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-cyber-grid bg-grid opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950/50 via-transparent to-dark-950" />

        {/* Animated scan line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-blue/40 to-transparent animate-scan" />
        </div>

        <div className="section-container relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                <span className="text-neon-green font-mono text-sm">SYSTEM ONLINE</span>
              </div>

              <h1
                className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight ${
                  glitchActive ? 'animate-pulse' : ''
                }`}
              >
                <span className="text-white">Hi, I'm </span>
                <span className="text-gradient-cyber">CyberShield</span>
              </h1>

              <div className="text-xl sm:text-2xl mb-6 h-10 font-mono">
                <TypingEffect />
              </div>

              <p className="text-dark-300 text-base sm:text-lg mb-8 leading-relaxed max-w-xl">
                BTech Cybersecurity student passionate about protecting digital assets.
                Specializing in network security, threat analysis, and SOC operations.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link to="/projects" className="cyber-btn-primary flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  View Projects
                </Link>
                <a href="#" className="cyber-btn flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Resume
                </a>
                <Link to="/contact" className="cyber-btn flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contact Me
                </Link>
              </div>

              <div className="flex items-center gap-6 mt-8 text-sm">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-neon-blue" />
                  <span className="text-dark-400">Threats Tracked: </span>
                  <StatsCounter />
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <TerminalAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 border-y border-dark-800/30 bg-dark-950/50">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, label: 'Projects', value: PROJECTS_DATA.length, color: 'text-neon-blue' },
              { icon: Terminal, label: 'Skills', value: SKILLS_DATA.length, color: 'text-neon-purple' },
              { icon: Bug, label: 'CVEs Tracked', value: 128, color: 'text-neon-red' },
              { icon: Eye, label: 'Certifications', value: CERTIFICATIONS_DATA.length, color: 'text-neon-green' },
            ].map((stat) => (
              <AnimatedSection key={stat.label}>
                <div className="cyber-card p-6 text-center">
                  <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-dark-400 text-sm">{stat.label}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Preview */}
      <section className="py-20">
        <div className="section-container">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                <span className="text-gradient-cyber">Featured Projects</span>
              </h2>
              <p className="text-dark-400 max-w-2xl mx-auto">
                Key cybersecurity projects showcasing practical skills in vulnerability assessment, monitoring, and threat intelligence.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS_DATA.filter((p) => p.featured).slice(0, 3).map((project, i) => (
              <AnimatedSection key={project.id} delay={i * 100}>
                <div className="cyber-card overflow-hidden group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent" />
                    <div className="absolute top-3 right-3">
                      <SeverityBadge
                        severity={project.category === 'threat_intel' ? 'critical' : project.category === 'monitoring' ? 'high' : 'medium'}
                        size="sm"
                      />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-neon-blue transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-dark-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span key={tech} className="px-2 py-0.5 text-[10px] font-mono bg-neon-blue/10 text-neon-blue rounded border border-neon-blue/20">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <Link
                      to="/projects"
                      className="text-neon-blue text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      View Details <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/projects" className="cyber-btn">
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Skills Preview */}
      <section className="py-20 bg-dark-950/50">
        <div className="section-container">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                <span className="text-gradient-cyber">Core Skills</span>
              </h2>
              <p className="text-dark-400 max-w-2xl mx-auto">
                Technical competencies spanning network security, ethical hacking, and security operations.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {SKILLS_DATA.slice(0, 8).map((skill, i) => (
              <AnimatedSection key={skill.name} delay={i * 50}>
                <div className="cyber-card p-4 group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-medium text-sm">{skill.name}</span>
                    <span className="text-neon-blue font-mono text-xs">{skill.proficiency}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-dark-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-neon-blue to-neon-purple rounded-full transition-all duration-1000"
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/about" className="cyber-btn">
              View All Skills
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-950/50 via-dark-950 to-cyber-950/50" />
        <div className="section-container relative z-10">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto">
              <div className="cyber-card p-8 sm:p-12 border-neon-blue/20">
                <Shield className="w-12 h-12 text-neon-blue mx-auto mb-4" />
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Ready to Explore Cyber Threats?
                </h2>
                <p className="text-dark-300 mb-8">
                  Access real-time threat intelligence, vulnerability scanning, and SOC monitoring tools.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link to="/scanner" className="cyber-btn-primary">Vulnerability Scanner</Link>
                  <Link to="/attack-map" className="cyber-btn">Attack Map</Link>
                  <Link to="/soc" className="cyber-btn">SOC Dashboard</Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
