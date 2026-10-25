import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as profileApi from '../../api/profileApi';
import * as reviewApi from '../../api/reviewApi';
import * as chatApi from '../../api/chatApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getInitials, formatDate, formatTime } from '../../utils/formatters';
import {
  PROFICIENCY_LABELS,
  PRIORITY_LABELS,
  DAY_LABELS,
  ROUTES,
} from '../../utils/constants';
import RatingStars from '../../components/common/RatingStars';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import SwapRequestModal from '../../components/domain/SwapRequestModal';
import {
  BookOpen,
  GraduationCap,
  Calendar,
  Star,
  MessageSquare,
  ArrowLeftRight,
  ExternalLink,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';

export function StudentProfilePage() {
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Swap modal
  const [swapModalOpen, setSwapModalOpen] = useState(false);

  const isOwnProfile = Number(userId) === user?.userId;

  useEffect(() => {
    loadProfileAndReviews();
  }, [userId]);

  async function loadProfileAndReviews() {
    setLoading(true);
    try {
      const [profRes, revRes] = await Promise.allSettled([
        profileApi.getStudentProfile(userId),
        reviewApi.getUserReviews(userId),
      ]);

      if (profRes.status === 'fulfilled') setProfile(profRes.value?.data);
      if (revRes.status === 'fulfilled') setReviews(revRes.value?.data?.content || []);
    } catch (err) {
      toast.error('Failed to load student profile');
    } finally {
      setLoading(false);
    }
  }

  async function handleStartChat() {
    try {
      const res = await chatApi.getOrCreateConversation(Number(userId));
      navigate(`${ROUTES.MESSAGES}?conversationId=${res?.data?.id}`);
    } catch (err) {
      toast.error('Failed to open chat conversation');
    }
  }

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading student profile..." className="min-h-[50vh]" />;
  }

  if (!profile) {
    return (
      <div className="py-12 text-center text-slate-500">
        <p className="text-base font-bold text-slate-800">Student Profile Not Found</p>
        <button onClick={() => navigate(ROUTES.DISCOVER)} className="btn btn-secondary btn-sm mt-4">
          Back to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Profile Header Card */}
      <div className="card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="h-20 w-20 rounded-2xl object-cover ring-4 ring-indigo-50 shadow-md"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-bold text-white shadow-md">
                {getInitials(profile.fullName)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900">{profile.fullName}</h1>
                {isOwnProfile && (
                  <span className="badge badge-indigo text-[10px]">You</span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {profile.department?.name || 'Department'} &bull; Year {profile.graduationYear ? 2028 - profile.graduationYear : 3} (Class of {profile.graduationYear || 2026})
              </p>

              {/* Rating */}
              <div className="mt-2 flex items-center gap-2 text-xs">
                <RatingStars rating={profile.averageRating ?? 5.0} size="sm" />
                <span className="font-bold text-slate-800">
                  {profile.averageRating ? profile.averageRating.toFixed(1) : '5.0'}
                </span>
                <span className="text-slate-400">
                  ({profile.totalReviewsCount ?? 0} reviews &bull; {profile.totalSessionsCompleted ?? 0} sessions completed)
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          {!isOwnProfile && (
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleStartChat}
                className="btn btn-secondary btn-sm flex-1 sm:flex-none"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Message</span>
              </button>
              <button
                type="button"
                onClick={() => setSwapModalOpen(true)}
                className="btn btn-primary btn-sm flex-1 sm:flex-none shadow-sm"
              >
                <ArrowLeftRight className="h-4 w-4" />
                <span>Propose Swap</span>
              </button>
            </div>
          )}
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="mt-6 pt-5 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">About</h4>
            <p className="mt-1.5 text-sm text-slate-700 leading-relaxed">{profile.bio}</p>
          </div>
        )}

        {/* Portfolio Link */}
        {profile.portfolioUrl && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-indigo-600">
            <ExternalLink className="h-3.5 w-3.5" />
            <a href={profile.portfolioUrl} target="_blank" rel="noreferrer" className="underline font-medium hover:text-indigo-800">
              {profile.portfolioUrl}
            </a>
          </div>
        )}
      </div>

      {/* Skills Grid: Taught vs Learning */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills Taught */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <BookOpen className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Skills They Teach</h3>
          </div>

          {profile.teachSkills?.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No taught skills listed yet.</p>
          ) : (
            <div className="space-y-3">
              {profile.teachSkills.map((ts) => (
                <div key={ts.id} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-sm">{ts.skillName}</span>
                    <span className="badge badge-green text-[10px]">
                      {PROFICIENCY_LABELS[ts.proficiencyLevel] || ts.proficiencyLevel}
                    </span>
                  </div>
                  {ts.experienceMonths > 0 && (
                    <p className="mt-1 text-xs text-slate-500">
                      {ts.experienceMonths} months experience
                    </p>
                  )}
                  {ts.proofDescription && (
                    <p className="mt-1.5 text-xs text-slate-600 italic bg-white p-2 rounded-lg border border-slate-100">
                      &ldquo;{ts.proofDescription}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Skills Wants to Learn */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Learning Goals</h3>
          </div>

          {profile.learnSkills?.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No learning goals listed yet.</p>
          ) : (
            <div className="space-y-3">
              {profile.learnSkills.map((ls) => (
                <div key={ls.id} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-sm">{ls.skillName}</span>
                    <span className="badge badge-indigo text-[10px]">
                      {PRIORITY_LABELS[ls.priority] || ls.priority} Priority
                    </span>
                  </div>
                  {ls.learningGoalNotes && (
                    <p className="mt-1.5 text-xs text-slate-600 italic bg-white p-2 rounded-lg border border-slate-100">
                      &ldquo;{ls.learningGoalNotes}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Weekly Availability Schedule */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">Weekly Tutoring Availability</h3>
        </div>

        {profile.availabilities?.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No weekly slots published.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {profile.availabilities.map((av, idx) => (
              <div key={idx} className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-2.5 text-xs text-center">
                <span className="font-bold text-indigo-900 block mb-0.5">
                  {DAY_LABELS[av.dayOfWeek] || av.dayOfWeek}
                </span>
                <span className="text-slate-600 font-mono text-[11px]">
                  {formatTime(av.startTime)} - {formatTime(av.endTime)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Peer Reviews */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900">Peer Reviews ({reviews.length})</h3>
          </div>
        </div>

        {reviews.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No reviews received yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{rev.reviewerName}</span>
                    <RatingStars rating={rev.rating} size="xs" />
                  </div>
                  <span className="text-[11px] text-slate-400">{formatDate(rev.createdAt)}</span>
                </div>
                {rev.feedback && (
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{rev.feedback}</p>
                )}
                {rev.endorsementTags && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {rev.endorsementTags.split(',').map((tag, idx) => (
                      <span key={idx} className="badge badge-amber text-[10px]">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Swap Modal */}
      {swapModalOpen && (
        <SwapRequestModal
          isOpen={swapModalOpen}
          onClose={() => setSwapModalOpen(false)}
          targetStudent={{
            userId: Number(userId),
            fullName: profile.fullName,
          }}
          onSuccess={() => toast.success('Swap request submitted!')}
        />
      )}
    </div>
  );
}

export default StudentProfilePage;
