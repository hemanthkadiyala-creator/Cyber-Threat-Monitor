import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, User, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 pb-16 min-h-screen flex items-center justify-center">
      <div className="section-container max-w-md mx-auto w-full">
        <div className="cyber-card p-8">
          <div className="text-center mb-8">
            <Shield className="w-12 h-12 text-neon-blue mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-dark-400 text-sm">Access the cybersecurity dashboard</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-neon-red/10 border border-neon-red/30 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-neon-red flex-shrink-0" />
              <span className="text-neon-red text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-dark-300 text-sm mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="cyber-input pl-11"
                  placeholder="admin@cybershield.dev"
                />
              </div>
            </div>

            <div>
              <label className="block text-dark-300 text-sm mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="cyber-input pl-11"
                  placeholder="Enter password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="cyber-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Secure Login
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <Link to="/signup" className="text-neon-blue text-sm hover:underline">
              Create an account
            </Link>
            <br />
            <Link to="/forgot-password" className="text-dark-400 text-xs hover:text-neon-blue transition-colors">
              Forgot password?
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-dark-700/30 text-center">
            <Link to="/" className="text-dark-400 text-sm flex items-center justify-center gap-1 hover:text-neon-blue transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });
      if (error) throw error;

      // Create profile
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').upsert({
          id: user.id,
          full_name: fullName,
          role: 'analyst',
        });
      }

      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 pb-16 min-h-screen flex items-center justify-center">
      <div className="section-container max-w-md mx-auto w-full">
        <div className="cyber-card p-8">
          <div className="text-center mb-8">
            <Shield className="w-12 h-12 text-neon-green mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-dark-400 text-sm">Join the cybersecurity platform</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-neon-red/10 border border-neon-red/30 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-neon-red flex-shrink-0" />
              <span className="text-neon-red text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-lg bg-neon-green/10 border border-neon-green/30 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0" />
              <span className="text-neon-green text-sm">Account created! Redirecting to login...</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-dark-300 text-sm mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="cyber-input pl-11"
                  placeholder="Your name"
                />
              </div>
            </div>

            <div>
              <label className="block text-dark-300 text-sm mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="cyber-input pl-11"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-dark-300 text-sm mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="cyber-input pl-11"
                  placeholder="Min. 6 characters"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="cyber-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-dark-700/30 text-center space-y-2">
            <Link to="/login" className="text-neon-blue text-sm hover:underline">
              Already have an account? Login
            </Link>
            <br />
            <Link to="/" className="text-dark-400 text-xs flex items-center justify-center gap-1 hover:text-neon-blue transition-colors">
              <ArrowLeft className="w-3 h-3" /> Back to site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 pb-16 min-h-screen flex items-center justify-center">
      <div className="section-container max-w-md mx-auto w-full">
        <div className="cyber-card p-8">
          <div className="text-center mb-8">
            <Lock className="w-12 h-12 text-neon-yellow mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-dark-400 text-sm">Enter your email to receive a reset link</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-neon-red/10 border border-neon-red/30 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-neon-red flex-shrink-0" />
              <span className="text-neon-red text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-lg bg-neon-green/10 border border-neon-green/30 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0" />
              <span className="text-neon-green text-sm">Reset link sent! Check your email.</span>
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-dark-300 text-sm mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="cyber-input pl-11"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="cyber-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-dark-700/30 text-center">
            <Link to="/login" className="text-neon-blue text-sm flex items-center justify-center gap-1 hover:underline">
              <ArrowLeft className="w-4 h-4" /> Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
