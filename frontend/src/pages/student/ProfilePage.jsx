import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import * as profileApi from '../../api/profileApi';
import { LEARNING_MODE, LEARNING_MODE_LABELS } from '../../utils/constants';
import { getInitials } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { User, Mail, GraduationCap, Building2, Globe, Sparkles, CheckCircle2 } from 'lucide-react';

export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [graduationYear, setGraduationYear] = useState(2026);
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [preferredLearningMode, setPreferredLearningMode] = useState(LEARNING_MODE.HYBRID);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    try {
      const res = await profileApi.getMyProfile();
      const p = res?.data;
      if (p) {
        setFullName(p.fullName || user?.fullName || '');
        setEmail(p.email || user?.email || '');
        setDepartmentName(p.department?.name || 'General');
        setGraduationYear(p.graduationYear || 2026);
        setBio(p.bio || '');
        setAvatarUrl(p.avatarUrl || '');
        setPortfolioUrl(p.portfolioUrl || '');
        setPreferredLearningMode(p.preferredLearningMode || LEARNING_MODE.HYBRID);
      }
    } catch (err) {
      toast.error('Failed to load profile details');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        bio: bio.trim(),
        avatarUrl: avatarUrl.trim() || null,
        portfolioUrl: portfolioUrl.trim() || null,
        preferredLearningMode,
        graduationYear: Number(graduationYear),
      };

      const res = await profileApi.updateMyProfile(payload);
      updateUser({
        avatarUrl: avatarUrl.trim() || null,
      });
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading your profile..." className="min-h-[50vh]" />;
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Student Profile & Settings</h1>
        <p className="mt-1 text-xs text-slate-500">
          Update your public profile, portfolio links, and preferred exchange mode.
        </p>
      </div>

      <div className="card p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Preview */}
          <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={fullName}
                className="h-16 w-16 rounded-2xl object-cover ring-2 ring-indigo-100 shadow"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white shadow">
                {getInitials(fullName)}
              </div>
            )}
            <div className="flex-1">
              <label className="label">Avatar Image URL</label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="input"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Direct image URL (e.g. Unsplash or GitHub profile avatar)
              </p>
            </div>
          </div>

          {/* Academic Info (Read-only verified) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  disabled
                  className="input pl-9 bg-slate-50 cursor-not-allowed text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="label">Verified College Email</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="input pl-9 bg-slate-50 cursor-not-allowed text-slate-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Department</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Building2 className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={departmentName}
                  disabled
                  className="input pl-9 bg-slate-50 cursor-not-allowed text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="label">Graduation Year</label>
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
                  required
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="label">About Me (Bio)</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Tell campus peers about your technical passions, areas of expertise, and study goals..."
              className="input"
              maxLength={1000}
            />
          </div>

          {/* Preferred Learning Mode */}
          <div>
            <label className="label">Preferred Learning Mode</label>
            <select
              value={preferredLearningMode}
              onChange={(e) => setPreferredLearningMode(e.target.value)}
              className="input"
            >
              {Object.entries(LEARNING_MODE).map(([k, v]) => (
                <option key={k} value={v}>
                  {LEARNING_MODE_LABELS[k] || v}
                </option>
              ))}
            </select>
          </div>

          {/* Portfolio Link */}
          <div>
            <label className="label">Portfolio or GitHub URL</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Globe className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://github.com/yourhandle"
                className="input pl-9"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
