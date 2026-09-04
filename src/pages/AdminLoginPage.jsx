import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Key, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { signInAdmin, getAdminSession } from '../lib/wishesService';
import { isSupabaseConfigured } from '../lib/supabase';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to /admin
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
      await signInAdmin(email.trim(), password);
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
    <div className="min-h-screen bg-[#080808] text-[#F5F1EA] flex flex-col justify-between px-4 py-8">
      {/* Navigation */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between">
        <Link
          to="/#birthday-wishes-section"
          className="inline-flex items-center gap-2 text-sm text-[#F5F1EA]/60 hover:text-[#B76E79] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Story</span>
        </Link>
      </div>

      <div className="max-w-md mx-auto w-full">
        <div className="bg-[#121212]/90 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#B76E79]/20 text-[#B76E79] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#B76E79]/30 shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-serif text-[#F5F1EA]">Admin Authorization</h1>
            <p className="text-xs text-[#F5F1EA]/60 mt-1">
              Authenticate to access Sowmiya's wish moderation panel
            </p>
          </div>

          {!isLive && (
            <div className="mb-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs leading-relaxed">
              💡 <strong>Dev Mode Notice:</strong> Supabase env vars not detected. You can log in using dev credentials: <code className="bg-black/40 px-1 py-0.5 rounded font-mono">admin@miyaaaaww.com</code> / <code className="bg-black/40 px-1 py-0.5 rounded font-mono">admin123</code>.
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
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[#F5F1EA] placeholder:text-[#F5F1EA]/30 focus:outline-none focus:border-[#B76E79] text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#B76E79] hover:bg-[#A35D68] text-white font-medium text-sm transition-all shadow-lg hover:shadow-[#B76E79]/30 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>LOG IN TO ADMIN PANEL</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <footer className="text-center text-xs text-[#F5F1EA]/40">
        Protected Admin Access
      </footer>
    </div>
  );
}
