import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { DEPARTMENTS, ROUTES } from '../../utils/constants';
import { isCollegeEmail, isStrongPassword } from '../../utils/validators';
import { Sparkles, Mail, Lock, User, GraduationCap, Building2, ArrowRight } from 'lucide-react';

export function RegisterPage() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [departmentId, setDepartmentId] = useState(DEPARTMENTS[0].id);
  const [graduationYear, setGraduationYear] = useState(2026);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    if (!isCollegeEmail(email)) {
      toast.error('Please enter a valid email address (Gmail, Outlook, Yahoo, work, or institutional)');
      return;
    }

    if (!isStrongPassword(password)) {
      toast.error('Password must be at least 8 characters and include at least one letter and one number');
      return;
    }

    setSubmitting(true);
    try {
      const res = await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        departmentId: Number(departmentId),
        graduationYear: Number(graduationYear),
      });

      const mockCode = res?.data?.mockVerificationCode;
      toast.success('Registration successful! Please verify your email OTP.');
      navigate(ROUTES.VERIFY_EMAIL, {
        state: {
          email: email.trim(),
          mockVerificationCode: mockCode,
        },
      });
    } catch (err) {
      toast.error(err.message || 'Registration failed. This email may already be registered.');
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
          Create your account
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Start exchanging skills with peers. Earn welcome Skill Credits upon registration.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priyanshu Verma"
                  required
                  className="input pl-9"
                  autoFocus
                />
              </div>
            </div>

            {/* College Email */}
            <div>
              <label className="label">Email Address</label>
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
              <p className="mt-1 text-[11px] text-slate-400">
                Must end with @college.edu, @university.ac.in, or @skillswap.edu
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  required
                  className="input pl-9"
                />
              </div>
            </div>

            {/* Department & Graduation Year */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Department</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Building2 className="h-4 w-4 text-slate-400" />
                  </div>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="input pl-9"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Grad Year</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <GraduationCap className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="number"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    min={2024}
                    max={2030}
                    className="input pl-9"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={submitting}
            >
              <span>{submitting ? 'Creating Account...' : 'Create Account'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already registered?{' '}
            <Link to={ROUTES.LOGIN} className="font-bold text-indigo-600 hover:text-indigo-700">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
