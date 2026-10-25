import React from 'react';
import { Sparkles, ArrowRight, BookOpen, GraduationCap, Clock } from 'lucide-react';
import RatingStars from '../common/RatingStars';
import { getInitials } from '../../utils/formatters';

export function MatchCard({ match, onProposeSwap, onViewProfile }) {
  const score = match.matchScore ?? 0;

  const scoreBadgeColor =
    score >= 80
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
      : score >= 60
      ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
      : 'bg-amber-100 text-amber-800 border-amber-200';

  const candidateName = match.fullName || match.candidateName || 'Student';
  const theyCanTeach =
    match.theyCanTeach ||
    (Array.isArray(match.teachSkills) ? match.teachSkills.join(', ') : match.teachSkills);
  const youCanTeach =
    match.youCanTeach ||
    (Array.isArray(match.wantsToLearn) ? match.wantsToLearn.join(', ') : match.wantsToLearn);
  const explanation =
    match.explanation ||
    match.breakdown?.mutualSkillMatch?.detail ||
    match.breakdown?.proficiencyCompatibility?.detail ||
    (match.directMutualSwap ? 'Direct Mutual Swap: High topic compatibility!' : null);

  return (
    <div className="card p-5 hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        {/* Header with avatar, name, score */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {match.avatarUrl ? (
              <img
                src={match.avatarUrl}
                alt={candidateName}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-indigo-50"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white shadow-sm">
                {getInitials(candidateName)}
              </div>
            )}
            <div>
              <h4 className="text-sm font-bold text-slate-900 hover:text-indigo-600 cursor-pointer" onClick={onViewProfile}>
                {candidateName}
              </h4>
              <p className="text-xs text-slate-500">
                {match.departmentName || 'Student'} &bull; Year {match.graduationYear ? (match.graduationYear > 2000 ? 2028 - match.graduationYear : match.graduationYear) : 3}
              </p>
            </div>
          </div>

          <div className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold ${scoreBadgeColor}`}>
            <Sparkles className="h-3.5 w-3.5" />
            <span>{score}% Match</span>
          </div>
        </div>

        {/* Rating preview */}
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
          <RatingStars rating={match.averageRating ?? 5.0} size="xs" />
          <span className="font-semibold text-slate-700">{match.averageRating ? Number(match.averageRating).toFixed(1) : '5.0'}</span>
          <span>({match.totalReviews ?? match.totalReviewsCount ?? 0} reviews)</span>
        </div>

        {/* Matching Skills */}
        <div className="mt-4 space-y-2 text-xs">
          {theyCanTeach && (
            <div className="rounded-lg bg-emerald-50/60 p-2.5 border border-emerald-100">
              <span className="font-bold text-emerald-900 block mb-1">They can teach you:</span>
              <span className="inline-block rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 font-medium">
                {theyCanTeach}
              </span>
            </div>
          )}

          {youCanTeach && (
            <div className="rounded-lg bg-indigo-50/60 p-2.5 border border-indigo-100">
              <span className="font-bold text-indigo-900 block mb-1">You can teach them:</span>
              <span className="inline-block rounded bg-indigo-100 text-indigo-800 px-2 py-0.5 font-medium">
                {youCanTeach}
              </span>
            </div>
          )}
        </div>

        {/* Score explanation factors */}
        {explanation && (
          <p className="mt-3 text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
            &ldquo;{explanation}&rdquo;
          </p>
        )}
      </div>

      {/* Action CTA */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onViewProfile}
          className="text-xs font-semibold text-slate-600 hover:text-indigo-600"
        >
          View Profile
        </button>
        <button
          type="button"
          onClick={onProposeSwap}
          className="btn btn-primary btn-sm"
        >
          <span>Propose Swap</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export default MatchCard;
