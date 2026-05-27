import { Shield, Target, Eye, Code, GraduationCap, FlaskConical, Briefcase, Award } from 'lucide-react';
import AnimatedSection from '../ui/AnimatedSection';
import { SectionHeader } from '../ui/SeverityBadge';
import { SKILLS_DATA, EXPERIENCE_DATA } from '../../lib/data';

const SKILL_ICONS: Record<string, typeof Shield> = {
  network: Shield, terminal: Code, monitor: Eye, shield: Shield,
  code: Code, activity: Target, radar: Target, bug: Target,
  lock: Shield, eye: Eye, search: Target, layers: Code,
};

const categoryLabels: Record<string, string> = {
  infrastructure: 'Infrastructure',
  security: 'Security',
  tools: 'Tools',
  development: 'Development',
};

const categoryColors: Record<string, string> = {
  infrastructure: 'border-neon-blue/30 hover:border-neon-blue',
  security: 'border-neon-red/30 hover:border-neon-red',
  tools: 'border-neon-green/30 hover:border-neon-green',
  development: 'border-neon-purple/30 hover:border-neon-purple',
};

const typeConfig: Record<string, { icon: typeof Shield; color: string; label: string }> = {
  course: { icon: GraduationCap, color: 'text-neon-blue border-neon-blue/30', label: 'Course' },
  lab: { icon: FlaskConical, color: 'text-neon-green border-neon-green/30', label: 'Lab' },
  internship: { icon: Briefcase, color: 'text-neon-yellow border-neon-yellow/30', label: 'Internship' },
  certification: { icon: Award, color: 'text-neon-purple border-neon-purple/30', label: 'Certification' },
};

export default function AboutPage() {
  const categories = [...new Set(SKILLS_DATA.map((s) => s.category))];

  return (
    <div className="pt-20 pb-16">
      {/* About Hero */}
      <section className="py-16">
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              title="About Me"
              subtitle="BTech Cybersecurity student with a passion for protecting digital infrastructure and hunting threats."
            />
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-12 items-start mt-8">
            <AnimatedSection>
              <div className="cyber-card p-8">
                <h3 className="text-xl font-semibold text-white mb-4">Who I Am</h3>
                <div className="space-y-4 text-dark-300 text-sm leading-relaxed">
                  <p>
                    I am a BTech Cybersecurity student dedicated to understanding and mitigating digital threats.
                    My journey in cybersecurity began with a fascination for how systems can be exploited and defended,
                    leading me to pursue hands-on experience in network security, ethical hacking, and SOC operations.
                  </p>
                  <p>
                    Currently focused on building practical skills through CTF competitions, lab environments,
                    and real-world security tools. My goal is to become a SOC Analyst and eventually a Network Security Engineer.
                  </p>
                  <p>
                    I believe in continuous learning and staying ahead of emerging threats. From studying the latest CVEs
                    to practicing incident response procedures, I am committed to developing the expertise needed
                    to protect organizations from cyber threats.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  {[
                    { icon: Shield, label: 'Network Security', desc: 'Firewalls, IDS/IPS, VPNs' },
                    { icon: Eye, label: 'SOC Operations', desc: 'Monitoring & Incident Response' },
                    { icon: Target, label: 'Threat Hunting', desc: 'IOC Analysis & TTPs' },
                    { icon: Code, label: 'Security Tools', desc: 'Python, Nmap, Burp Suite' },
                  ].map((item) => (
                    <div key={item.label} className="p-3 rounded-lg bg-dark-800/50 border border-dark-700/30">
                      <item.icon className="w-5 h-5 text-neon-blue mb-2" />
                      <div className="text-white text-sm font-medium">{item.label}</div>
                      <div className="text-dark-500 text-xs">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="cyber-card p-8">
                <h3 className="text-xl font-semibold text-white mb-4">Career Goals</h3>
                <div className="space-y-4">
                  {[
                    { title: 'Short Term', items: ['CompTIA Security+ Certified', 'CEH Certification', 'SOC Analyst Position'] },
                    { title: 'Mid Term', items: ['CISSP Certification', 'Network Security Engineer', 'Threat Intelligence Lead'] },
                    { title: 'Long Term', items: ['CISO / Security Director', 'Security Architecture', 'Mentoring Future Analysts'] },
                  ].map((goal) => (
                    <div key={goal.title} className="p-4 rounded-lg bg-dark-800/30 border border-dark-700/30">
                      <h4 className="text-neon-blue font-semibold text-sm mb-2">{goal.title}</h4>
                      <ul className="space-y-1">
                        {goal.items.map((item) => (
                          <li key={item} className="text-dark-300 text-sm flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-neon-blue" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 bg-dark-950/50">
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              title="Technical Skills"
              subtitle="Proficiency across cybersecurity domains, tools, and technologies."
            />
          </AnimatedSection>

          <div className="space-y-10">
            {categories.map((category) => (
              <AnimatedSection key={category}>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neon-blue" />
                  {categoryLabels[category] || category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {SKILLS_DATA.filter((s) => s.category === category).map((skill) => {
                    const Icon = SKILL_ICONS[skill.icon] || Shield;
                    return (
                      <div
                        key={skill.id || skill.name}
                        className={`cyber-card p-5 border ${categoryColors[skill.category] || ''} transition-all duration-300`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 rounded-lg bg-dark-800/50">
                            <Icon className="w-5 h-5 text-neon-blue" />
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-medium text-sm">{skill.name}</div>
                          </div>
                          <span className="text-neon-blue font-mono text-xs">{skill.proficiency}%</span>
                        </div>
                        <div className="w-full h-2 bg-dark-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000 ease-out"
                            style={{
                              width: `${skill.proficiency}%`,
                              background: `linear-gradient(90deg, #00d4ff ${
                                skill.proficiency > 75 ? ', #22c55e' : skill.proficiency > 50 ? ', #a855f7' : ', #eab308'
                              })`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="py-16">
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              title="Learning Journey"
              subtitle="Courses, labs, certifications, and internship preparation milestones."
            />
          </AnimatedSection>

          <div className="relative max-w-3xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-dark-700/50 md:-translate-x-px" />

            {EXPERIENCE_DATA.map((exp, i) => {
              const config = typeConfig[exp.type] || typeConfig.course;
              const Icon = config.icon;
              const isLeft = i % 2 === 0;

              return (
                <AnimatedSection key={exp.id || i} delay={i * 100}>
                  <div className={`relative flex items-start gap-6 mb-8 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}>
                    {/* Timeline dot */}
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-dark-900 border-2 flex items-center justify-center z-10"
                      style={{ borderColor: config.color.includes('blue') ? '#00d4ff' : config.color.includes('green') ? '#22c55e' : config.color.includes('yellow') ? '#eab308' : '#a855f7' }}
                    >
                      <Icon className="w-4 h-4 text-neon-blue" />
                    </div>

                    {/* Content */}
                    <div className={`ml-14 md:ml-0 md:w-1/2 ${isLeft ? 'md:pr-10 md:text-right' : 'md:pl-10'}`}>
                      <div className="cyber-card p-5">
                        <div className={`flex items-center gap-2 mb-2 ${isLeft ? 'md:justify-end' : ''}`}>
                          <span className={`px-2 py-0.5 text-[10px] font-mono rounded-full border ${config.color}`}>
                            {config.label}
                          </span>
                          <span className="text-dark-500 text-xs font-mono">
                            {exp.start_date} - {exp.end_date || 'Present'}
                          </span>
                        </div>
                        <h3 className="text-white font-semibold text-sm mb-1">{exp.title}</h3>
                        <p className="text-neon-blue text-xs mb-2">{exp.organization}</p>
                        <p className="text-dark-400 text-xs leading-relaxed">{exp.description}</p>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
