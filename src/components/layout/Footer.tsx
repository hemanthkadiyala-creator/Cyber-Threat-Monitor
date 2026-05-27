import { Shield, Github, Linkedin, Mail, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-950 border-t border-dark-800/50">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-neon-blue" />
              <span className="text-lg font-bold font-mono">
                <span className="text-neon-blue">Cyber</span>
                <span className="text-white">Shield</span>
              </span>
            </div>
            <p className="text-dark-400 text-sm leading-relaxed">
              Cybersecurity portfolio and threat intelligence platform. Built by a BTech cybersecurity student and aspiring SOC Analyst.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About' },
                { to: '/projects', label: 'Projects' },
                { to: '/blog', label: 'Blog' },
                { to: '/scanner', label: 'Scanner' },
                { to: '/soc', label: 'SOC' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-dark-400 hover:text-neon-blue text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Connect</h3>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-dark-800/50 border border-dark-700/30 text-dark-400 hover:text-neon-blue hover:border-neon-blue/30 transition-all"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-dark-800/50 border border-dark-700/30 text-dark-400 hover:text-neon-blue hover:border-neon-blue/30 transition-all"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@cybershield.dev"
                className="p-2.5 rounded-lg bg-dark-800/50 border border-dark-700/30 text-dark-400 hover:text-neon-blue hover:border-neon-blue/30 transition-all"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-dark-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-dark-500 text-sm">
            &copy; {currentYear} CyberShield. All rights reserved.
          </p>
          <p className="text-dark-500 text-sm flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-neon-red" /> for cybersecurity
          </p>
        </div>
      </div>
    </footer>
  );
}
