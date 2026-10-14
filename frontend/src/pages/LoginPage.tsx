import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { apiClient } from '../services/api';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiClient.login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('ruthi@example.com');
    setPassword('password123');
    setLoading(true);
    try {
      await apiClient.login('ruthi@example.com', 'password123');
      navigate('/dashboard');
    } catch {
      // Local fallback
      localStorage.setItem('user', JSON.stringify({ id: '1', email: 'ruthi@example.com', name: 'Ruthi' }));
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-brand-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent-500/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[420px] relative z-10 animate-scale-in">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-white tracking-tight">Career Copilot</span>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <h1 className="text-xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-[14px] text-surface-300 mb-6">Sign in to your account</p>

          {error && (
            <div className="p-3 mb-4 rounded-xl bg-danger-500/10 border border-danger-500/30 flex items-center gap-2.5 text-danger-300 text-xs animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-[13px] font-medium text-surface-200 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-800/50 border border-white/8 
                    text-white text-[14px] placeholder:text-surface-400
                    focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20
                    transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[13px] font-medium text-surface-200 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-surface-800/50 border border-white/8 
                    text-white text-[14px] placeholder:text-surface-400
                    focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20
                    transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-[14px] font-semibold text-white 
                bg-brand-600 hover:bg-brand-500 disabled:opacity-50 transition-all 
                shadow-lg shadow-brand-500/20 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="mt-4 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2 rounded-xl text-xs font-medium text-brand-300 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Quick Demo Sign In (Ruthi)
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-[13px] text-surface-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
