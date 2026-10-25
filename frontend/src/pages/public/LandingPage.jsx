import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../utils/constants';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Coins,
  BookOpen,
  Users,
  GraduationCap,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

export function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-[#14b8a6] selection:text-white">
      {/* Header */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#14b8a6]/10 text-white shadow-md shadow-emerald-200">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              SkillSwap
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to={ROUTES.DASHBOARD} className="btn btn-primary btn-sm">
                <span>Go to Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link to={ROUTES.LOGIN} className="btn btn-ghost btn-sm">
                  Log In
                </Link>
                <Link to={ROUTES.REGISTER} className="btn btn-primary btn-sm">
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-700 shadow-sm mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Skill Exchange Community</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
            Learn. Teach. Exchange.{' '}
            <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
              Zero Money Involved.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Exchange skills directly with anyone. Teach what you know, earn Skill Credits,
            and learn whatever you want without paying a single rupee.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to={ROUTES.REGISTER} className="btn btn-primary btn-lg shadow-lg shadow-emerald-200">
              <span>Start Exchanging Skills</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to={ROUTES.LOGIN} className="btn btn-secondary btn-lg">
              Sign In
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Verified College Emails Only
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Escrow Credit Protection
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Smart Multi-Factor Matching
            </span>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">How SkillSwap Works</h2>
            <p className="mt-2 text-sm text-slate-500">
              A fair, double-entry credit ledger designed specifically for university students.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6 border-slate-200 hover:border-indigo-300 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 font-bold text-lg mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">List Your Skills</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Add skills you can teach (e.g., Java, React, Figma) and skills you want to learn (e.g., Machine Learning, Guitar).
              </p>
            </div>

            <div className="card p-6 border-slate-200 hover:border-indigo-300 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 font-bold text-lg mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">Match & Propose Swap</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Our 100-point compatibility engine scores mutual matches across skills, availability, and feedback ratings.
              </p>
            </div>

            <div className="card p-6 border-slate-200 hover:border-indigo-300 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 font-bold text-lg mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">Complete & Earn Credits</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Book 1-hour sessions with escrow hold. Verify session completion with mutual 6-digit OTPs and build your reputation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Credit Economics section */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-tr from-emerald-900 to-slate-900 text-white p-8 sm:p-12 shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-amber-300 mb-4">
                <Coins className="h-4 w-4" />
                <span>Fair Skill Credit System</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                No money. Ever. Just knowledge currency.
              </h2>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Every newly registered member receives <strong>3 Skill Credits</strong> upon signup.
                1 credit books a 1-hour session. When you teach a session, you earn that 1 credit.
                This creates a thriving circular economy of knowledge exchange.
              </p>
              <div className="mt-6 flex gap-4">
                <Link to={ROUTES.REGISTER} className="btn btn-primary btn-sm bg-white text-indigo-900 hover:bg-slate-100">
                  Register with College Email
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} SkillSwap &bull; Learn. Teach. Exchange.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
