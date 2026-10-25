import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ROUTES } from '../../utils/constants';
import { Sparkles, Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';

export function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error('Please enter your college email and password');
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      toast.success('Welcome back to SkillSwap!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Invalid credentials. Please verify and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDemoLogin(demoEmail) {
    setEmail(demoEmail);
    setPassword('Password@123');
    setSubmitting(true);
    try {
      await login(demoEmail.trim(), 'Password@123');
      toast.success('Welcome back to SkillSwap!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Demo login failed. Please try manual login.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to={ROUTES.LANDING} className="inline-flex items-center gap-2 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
            <Sparkles className="h-6 w-6" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900">SkillSwap</span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Sign in to your SkillSwap account
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Enter your credentials to access your swaps and sessions.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">College Email Address</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@example.com"
                  required
                  className="input pl-9"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="label">Password</label>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input pl-9"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={submitting}
            >
              <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* One-Click Demo Login (Seeded Accounts) */}
          <div className="mt-6 border-t border-slate-100 pt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-2.5">
              Quick Test Accounts (Seeded)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('rohan@example.com')}
                className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-center text-[10px] hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitting}
              >
                <span className="font-bold block truncate">Rohan</span>
                <span className="text-[9px] text-slate-400 block">CSE Student</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('ananya@example.com')}
                className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-center text-[10px] hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitting}
              >
                <span className="font-bold block truncate">Ananya</span>
                <span className="text-[9px] text-slate-400 block">Design Student</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin@example.com')}
                className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-center text-[10px] hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitting}
              >
                <span className="font-bold block truncate">Admin</span>
                <span className="text-[9px] text-slate-400 block">Staff Console</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('vikram@example.com')}
                className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-center text-[10px] hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitting}
              >
                <span className="font-bold block truncate">Vikram</span>
                <span className="text-[9px] text-slate-400 block">ML Researcher</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to={ROUTES.REGISTER} className="font-bold text-indigo-600 hover:text-indigo-700">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
