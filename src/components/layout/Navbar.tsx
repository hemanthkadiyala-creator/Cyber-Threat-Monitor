import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, Sun, Moon } from 'lucide-react';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/projects', label: 'Projects' },
  { path: '/blog', label: 'Blog' },
  { path: '/scanner', label: 'Scanner' },
  { path: '/attack-map', label: 'Attack Map' },
  { path: '/cve', label: 'CVE' },
  { path: '/threats', label: 'Threats' },
  { path: '/soc', label: 'SOC' },
  { path: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-dark-950/90 backdrop-blur-xl border-b border-neon-blue/10 shadow-lg shadow-neon-blue/5'
          : 'bg-transparent'
      }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <Shield className="w-8 h-8 text-neon-blue group-hover:animate-pulse-slow transition-all" />
            <span className="text-xl font-bold font-mono">
              <span className="text-neon-blue">Cyber</span>
              <span className="text-white">Shield</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  location.pathname === link.path
                    ? 'text-neon-blue bg-neon-blue/10 border border-neon-blue/20'
                    : 'text-dark-300 hover:text-neon-blue hover:bg-dark-800/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-dark-400 hover:text-neon-blue hover:bg-dark-800/50 transition-all"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link
              to="/login"
              className="hidden lg:block cyber-btn text-xs"
            >
              Admin Login
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-dark-400 hover:text-neon-blue transition-all"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-dark-950/95 backdrop-blur-xl border-t border-dark-700/30 px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                location.pathname === link.path
                  ? 'text-neon-blue bg-neon-blue/10'
                  : 'text-dark-300 hover:text-neon-blue hover:bg-dark-800/50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/login"
            className="block px-4 py-2.5 text-sm font-medium text-neon-blue border border-neon-blue/30 rounded-lg mt-2"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
