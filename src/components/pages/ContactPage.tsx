import { useState } from 'react';
import { Mail, Send, Github, Linkedin, Download, CheckCircle, AlertCircle } from 'lucide-react';
import AnimatedSection from '../ui/AnimatedSection';
import { SectionHeader } from '../ui/SeverityBadge';
import { supabase } from '../../lib/supabase';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      });

      if (error) throw error;
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="pt-20 pb-16">
      <section className="py-16">
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              title="Contact Me"
              subtitle="Get in touch for collaboration, opportunities, or cybersecurity discussions."
            />
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Form */}
            <AnimatedSection>
              <div className="cyber-card p-8">
                <h3 className="text-lg font-semibold text-white mb-6">Send a Message</h3>

                {status === 'success' && (
                  <div className="mb-6 p-4 rounded-lg bg-neon-green/10 border border-neon-green/30 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0" />
                    <span className="text-neon-green text-sm">Message sent successfully!</span>
                  </div>
                )}

                {status === 'error' && (
                  <div className="mb-6 p-4 rounded-lg bg-neon-red/10 border border-neon-red/30 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-neon-red flex-shrink-0" />
                    <span className="text-neon-red text-sm">Failed to send message. Please try again.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-dark-300 text-sm mb-1.5">Name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="cyber-input"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-dark-300 text-sm mb-1.5">Email</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="cyber-input"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-dark-300 text-sm mb-1.5">Subject</label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="cyber-input"
                      placeholder="Message subject"
                    />
                  </div>

                  <div>
                    <label className="block text-dark-300 text-sm mb-1.5">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="cyber-input resize-none"
                      placeholder="Your message..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="cyber-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {status === 'sending' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </AnimatedSection>

            {/* Contact Info */}
            <AnimatedSection delay={200}>
              <div className="space-y-6">
                <div className="cyber-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Mail className="w-6 h-6 text-neon-blue" />
                    <h3 className="text-white font-semibold">Email</h3>
                  </div>
                  <a href="mailto:contact@cybershield.dev" className="text-dark-300 hover:text-neon-blue transition-colors text-sm">
                    contact@cybershield.dev
                  </a>
                </div>

                <div className="cyber-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Github className="w-6 h-6 text-neon-blue" />
                    <h3 className="text-white font-semibold">GitHub</h3>
                  </div>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark-300 hover:text-neon-blue transition-colors text-sm"
                  >
                    github.com/cybershield
                  </a>
                </div>

                <div className="cyber-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Linkedin className="w-6 h-6 text-neon-blue" />
                    <h3 className="text-white font-semibold">LinkedIn</h3>
                  </div>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark-300 hover:text-neon-blue transition-colors text-sm"
                  >
                    linkedin.com/in/cybershield
                  </a>
                </div>

                <div className="cyber-card-purple p-6 border border-neon-purple/20">
                  <div className="flex items-center gap-3 mb-3">
                    <Download className="w-6 h-6 text-neon-purple" />
                    <h3 className="text-white font-semibold">Resume</h3>
                  </div>
                  <p className="text-dark-400 text-sm mb-4">
                    Download my resume for a comprehensive overview of my skills and experience.
                  </p>
                  <a href="#" className="cyber-btn text-xs border-neon-purple/30 text-neon-purple hover:bg-neon-purple/10 hover:border-neon-purple">
                    <Download className="w-4 h-4" /> Download Resume
                  </a>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
