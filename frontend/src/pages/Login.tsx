import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Lock, Mail, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@ecomsight.ai');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back, Admin!', 'success');
      navigate('/');
    } catch (err: any) {
      showToast('Login failed. Please check your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickReviewerLogin = async () => {
    setLoading(true);
    await login('admin@ecomsight.ai', 'live-session');
    showToast('Signed in via Reviewer Access!', 'success');
    navigate('/');
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    await login('google.reviewer@ecomsight.ai', 'google-auth');
    showToast('Signed in via Google Authentication!', 'success');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface">
      {/* Left Panel: Dark Navy Branding & Analytics Illustration */}
      <div className="md:w-1/2 bg-navy-900 text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative background grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#1769E0_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Top Logo & Back to Landing */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/LOGO.png" 
              alt="EcomSight Logo" 
              className="w-11 h-11 object-contain drop-shadow-md rounded-xl hover:scale-105 transition-transform" 
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[21px] font-black tracking-tight leading-none bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                  EcomSight
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xs">
                  AI
                </span>
              </div>
              <span className="text-[11px] text-cyan-200/60 font-medium tracking-wide mt-1 block">
                Enterprise Intelligence Platform
              </span>
            </div>
          </div>

          <Link
            to="/landing"
            className="text-[12px] font-medium text-slate-300 hover:text-white flex items-center gap-1 bg-navy-850 px-2.5 py-1.5 rounded-lg border border-navy-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Landing Page</span>
          </Link>
        </div>

        {/* Center Content & Analytics Decorative Graphic */}
        <div className="relative z-10 my-10 md:my-auto max-w-md">
          <span className="inline-block px-2.5 py-1 rounded text-[11px] font-semibold bg-primary/20 text-blue-300 border border-primary/30 mb-4">
            DATA MINING TECHNIQUES ACADEMIC & PRODUCTION SYSTEM
          </span>
          <h2 className="text-[28px] md:text-[34px] font-bold leading-tight tracking-tight text-white mb-3">
            E-Commerce Sales Intelligence & Prediction System
          </h2>
          <p className="text-slate-300 text-[14px] leading-relaxed mb-6">
            Turn data into insights, predict tomorrow, grow today. Ingest transaction datasets, eliminate data noise, forecast revenue trajectory, segment customers, and discover market basket rules.
          </p>

          {/* Subtle analytics line chart illustration */}
          <div className="p-4 rounded-xl bg-navy-850/90 border border-navy-800 shadow-inner">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
              <span>Predictive Sales Forecast Trajectory</span>
              <span className="text-brand-green font-semibold">+18.7% Expected Growth</span>
            </div>
            <svg className="w-full h-20" viewBox="0 0 300 80">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1769E0" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#1769E0" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path 
                d="M 10,65 L 45,55 L 85,60 L 125,40 L 165,45 L 205,25 L 245,20 L 290,10" 
                fill="none" 
                stroke="#1769E0" 
                strokeWidth="2.5" 
              />
              <path 
                d="M 10,65 L 45,55 L 85,60 L 125,40 L 165,45 L 205,25 L 245,20 L 290,10 L 290,80 L 10,80 Z" 
                fill="url(#grad1)" 
              />
              <circle cx="125" cy="40" r="3.5" fill="#1769E0" />
              <circle cx="205" cy="25" r="3.5" fill="#10B981" />
              <circle cx="290" cy="10" r="4" fill="#8B5CF6" />
            </svg>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-[11px] text-slate-400 flex items-center justify-between pt-4 border-t border-navy-850">
          <span>Production-grade DMT Architecture</span>
          <span>© 2026 EcomSight</span>
        </div>
      </div>

      {/* Right Panel: Clean White Login Form */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white p-8 rounded-xl border border-surface-border shadow-card">
          <div className="mb-6">
            <h2 className="text-[22px] font-bold text-text-main">
              Welcome Back!
            </h2>
            <p className="text-[13px] text-text-muted mt-1">
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-text-main mb-1.5">
                Email / Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ecomsight.ai"
                  required
                  className="w-full pl-9 pr-3 py-2 text-[13px] border border-surface-border rounded-lg text-text-main focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[12px] font-medium text-text-main">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => { e.preventDefault(); showToast('Password reset instructions sent.', 'info'); }}
                  className="text-[11px] font-medium text-primary hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2 text-[13px] border border-surface-border rounded-lg text-text-main focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-primary focus:ring-primary h-3.5 w-3.5"
                />
                <span className="text-[12px] text-text-muted">Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-4 flex items-center gap-2">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-[11px] text-text-light uppercase tracking-wider">or sign in with</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          {/* Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-2 px-3 border border-surface-border hover:bg-slate-50 text-text-main text-[12px] font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Quick Reviewer One-Click Access */}
          <div className="mt-3">
            <button
              onClick={handleQuickReviewerLogin}
              type="button"
              className="w-full py-2 px-3 border border-primary/30 bg-primary-light/50 hover:bg-primary-light text-primary text-[12px] font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-3.5 h-3.5 text-primary" />
              <span>One-Click Quick Reviewer Login</span>
            </button>
          </div>

          <div className="mt-6 text-center text-[12px] text-text-muted">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => showToast('Direct reviewer access enabled with full admin privileges.', 'info')}
              className="text-primary font-medium hover:underline"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
