import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ROUTES } from '../../utils/constants';
import { Sparkles, KeyRound, Mail, ArrowRight, Coins } from 'lucide-react';

export function VerifyEmailPage() {
  const { verifyOtp } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || '');
  const [otpCode, setOtpCode] = useState(location.state?.mockVerificationCode || '');
  const [submitting, setSubmitting] = useState(false);

  const mockCode = location.state?.mockVerificationCode;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || otpCode.trim().length !== 6) {
      toast.error('Please enter your email and 6-digit OTP code');
      return;
    }

    setSubmitting(true);
    try {
      await verifyOtp(email.trim(), otpCode.trim());
      toast.success('Email verified successfully! +3 Welcome Credits have been added to your wallet! 🎉');
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      toast.error(err.message || 'Invalid or expired OTP code. Please try again.');
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
          Verify your account
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Enter the 6-digit activation code sent to your email.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card p-6 sm:p-8">
          {mockCode && (
            <div className="mb-4 rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-xs text-indigo-900">
              <span className="font-bold block">Demo Mode:</span>
              Your activation OTP code is <strong className="font-mono text-sm tracking-widest text-indigo-700">{mockCode}</strong>.
            </div>
          )}

          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50/80 p-3 flex items-center gap-2 text-xs font-semibold text-amber-900">
            <Coins className="h-4 w-4 text-amber-600 shrink-0" />
            <span>Unlocks +3 Welcome Skill Credits upon activation!</span>
          </div>

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
                />
              </div>
            </div>

            <div>
              <label className="label">6-Digit Activation Code</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <KeyRound className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="e.g. 123456"
                  required
                  maxLength={6}
                  className="input pl-9 text-center font-mono text-xl tracking-widest"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={submitting || otpCode.length !== 6}
            >
              <span>{submitting ? 'Verifying...' : 'Verify Email & Claim Credits'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Need to change email or re-register?{' '}
            <Link to={ROUTES.REGISTER} className="font-bold text-indigo-600 hover:text-indigo-700">
              Back to registration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailPage;
