import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Key, ShieldCheck, Heart, AlertCircle, ArrowLeft, Sparkles, Eye, EyeOff } from 'lucide-react';
import { signInAdmin, getAdminSession } from '../lib/wishesService';
import { isSupabaseConfigured } from '../lib/supabase';

export default function AdminLoginPage() {
  const [role, setRole] = useState('sowmiya'); // 'sowmiya' | 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  const handleRoleSwitch = (selectedRole) => {
    setRole(selectedRole);
    setError(null);
    setEmail('');
    setPassword(''); // Also clear password when switching roles
  };

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
        {/* Role Selection Switcher */}
        <div className="flex bg-[#161616] p-1.5 rounded-2xl border border-white/10 mb-5 shadow-lg">
          <button
            type="button"
            onClick={() => handleRoleSwitch('sowmiya')}
            className={`flex-1 py-3 rounded-xl text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all ${
              role === 'sowmiya'
                ? 'bg-gradient-to-r from-[#B76E79] to-[#D4A373] text-white shadow-md'
                : 'text-[#F5F1EA]/50 hover:text-[#F5F1EA]'
            }`}
          >
            <Heart className={`w-4 h-4 ${role === 'sowmiya' ? 'fill-white' : ''}`} />
            <span>Sowmiya's Inbox</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSwitch('admin')}
            className={`flex-1 py-3 rounded-xl text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all ${
              role === 'admin'
                ? 'bg-white/15 text-white shadow-md border border-white/20'
                : 'text-[#F5F1EA]/50 hover:text-[#F5F1EA]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>System Admin</span>
          </button>
        </div>

        <div className="bg-[#121212]/90 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          <div className="text-center mb-8">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border shadow-inner transition-all ${
                role === 'sowmiya'
                  ? 'bg-[#B76E79]/20 text-[#B76E79] border-[#B76E79]/40'
                  : 'bg-white/10 text-amber-400 border-white/20'
              }`}
            >
              {role === 'sowmiya' ? (
                <Sparkles className="w-7 h-7 text-[#B76E79]" />
              ) : (
                <ShieldCheck className="w-7 h-7 text-amber-400" />
              )}
            </div>

            <h1 className="text-2xl font-serif text-[#F5F1EA]">
              {role === 'sowmiya' ? "Sowmiya's Private Inbox ❤️" : 'Admin Authorization'}
            </h1>
            <p className="text-xs text-[#F5F1EA]/60 mt-1">
              {role === 'sowmiya'
                ? 'Welcome Birthday Girl! Log in to view wishes & reply thank you.'
                : 'Authenticate to access full site moderation & wish controls'}
            </p>
          </div>

          {!isLive && (
            <div className="mb-6 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs leading-relaxed">
              💡 <strong>Dev Mode Credentials:</strong>
              <div className="mt-1 font-mono text-[11px] text-amber-200/90">
                {role === 'sowmiya' ? (
                  <>
                    Email: <code className="bg-black/40 px-1.5 py-0.5 rounded text-white">sowmiya@miyaaaaww.com</code> | Password: <code className="bg-black/40 px-1.5 py-0.5 rounded text-white">sowmiya123</code>
                  </>
                ) : (
                  <>
                    Email: <code className="bg-black/40 px-1.5 py-0.5 rounded text-white">admin@miyaaaaww.com</code> | Password: <code className="bg-black/40 px-1.5 py-0.5 rounded text-white">admin123</code>
                  </>
                )}
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
                {role === 'sowmiya' ? 'Sowmiya Email' : 'Admin Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#F5F1EA]/40" />
                <input
                  type="email"
                  required
                  placeholder={role === 'sowmiya' ? 'Enter your email address...' : 'admin@example.com'}
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
              className={`w-full py-3.5 rounded-xl font-medium text-sm transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 mt-2 ${
                role === 'sowmiya'
                  ? 'bg-gradient-to-r from-[#B76E79] to-[#D4A373] hover:opacity-95 text-white shadow-[#B76E79]/30'
                  : 'bg-[#B76E79] hover:bg-[#A35D68] text-white shadow-[#B76E79]/30'
              }`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>
                    {role === 'sowmiya' ? 'OPEN SOWMIYA INBOX ❤️' : 'LOG IN TO ADMIN PANEL 🛡️'}
                  </span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <footer className="text-center text-xs text-[#F5F1EA]/40">
        Protected Authorization Access
      </footer>
    </div>
  );
}
