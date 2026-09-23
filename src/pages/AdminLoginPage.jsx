import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Key, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { signInAdmin, getAdminSession } from '../lib/wishesService';
import { isSupabaseConfigured } from '../lib/supabase';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getAdminSession().then((session) => {
      if (session) {
        navigate('/admin', { replace: true });
      }
    });
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInAdmin(email.trim(), password, 'admin');
      navigate('/admin', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to authenticate.');
    } finally {
      setLoading(false);
    }
  };

  const isLive = isSupabaseConfigured();

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F1EA] flex flex-col justify-between px-4 py-8 selection:bg-[#B76E79]/30 selection:text-white">
      <div className="max-w-md mx-auto w-full my-auto">
        <div className="bg-[#121212]/90 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20 bg-white/10 text-amber-400 shadow-inner">
              <ShieldCheck className="w-7 h-7 text-amber-400" />
            </div>

            <h1 className="text-2xl font-serif text-[#F5F1EA]">
              Admin Authorization
            </h1>
            <p className="text-xs text-[#F5F1EA]/60 mt-1 font-light">
              Authenticate to access full site moderation & wish controls
            </p>
          </div>

          {!isLive && (
            <div className="mb-6 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs leading-relaxed">
              💡 <strong>Dev Mode Credentials:</strong>
              <div className="mt-1 font-mono text-[11px] text-amber-200/90">
                Email: <code className="bg-black/40 px-1.5 py-0.5 rounded text-white">admin@miyaaaaww.com</code> | Password: <code className="bg-black/40 px-1.5 py-0.5 rounded text-white">admin123</code>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#F5F1EA]/70 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#F5F1EA]/40" />
                <input
                  type="email"
                  required
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[#F5F1EA] placeholder:text-[#F5F1EA]/30 focus:outline-none focus:border-[#B76E79] text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#F5F1EA]/70 mb-2">
                Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3.5 top-3.5 text-[#F5F1EA]/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-[#F5F1EA] placeholder:text-[#F5F1EA]/30 focus:outline-none focus:border-[#B76E79] text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-[#F5F1EA]/40 hover:text-[#F5F1EA] transition-colors focus:outline-none"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-[#B76E79]" />
                  ) : (
                    <Eye className="w-4 h-4 text-[#F5F1EA]/50" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-medium text-sm transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 mt-2 bg-[#B76E79] hover:bg-[#A35D68] text-white shadow-[#B76E79]/30"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>LOG IN TO ADMIN PANEL 🛡️</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <footer className="text-center text-xs text-[#F5F1EA]/40 font-mono">
        Protected Authorization Access
      </footer>
    </div>
  );
}
