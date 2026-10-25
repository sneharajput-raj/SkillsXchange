import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { formatDate, formatTime, getInitials } from '../../utils/formatters';
import {
  SESSION_STATUS,
  SESSION_STATUS_LABELS,
  LEARNING_MODE_LABELS,
} from '../../utils/constants';
import VerificationCodeModal from './VerificationCodeModal';
import ReviewModal from './ReviewModal';
import ReportModal from './ReportModal';
import {
  Calendar,
  Clock,
  MapPin,
  Link as LinkIcon,
  CheckCircle2,
  XCircle,
  KeyRound,
  Star,
  AlertTriangle,
  User,
} from 'lucide-react';

export function SessionCard({ session, onRefresh, onCancel }) {
  const { user } = useAuth();
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const isLearner = user?.userId === session.learnerId;
  const isTeacher = user?.userId === session.teacherId;

  const isScheduled = session.status === SESSION_STATUS.SCHEDULED;
  const isCompleted = session.status === SESSION_STATUS.COMPLETED;
  const isCancelled = session.status === SESSION_STATUS.CANCELLED;

  const statusBadges = {
    [SESSION_STATUS.SCHEDULED]: 'badge-blue',
    [SESSION_STATUS.COMPLETED]: 'badge-green',
    [SESSION_STATUS.CANCELLED]: 'badge-slate',
    [SESSION_STATUS.DISPUTED]: 'badge-red',
    [SESSION_STATUS.NO_SHOW]: 'badge-amber',
  };

  const hasReviewed = isLearner
    ? session.reviewSubmittedByLearner
    : session.reviewSubmittedByTeacher;

  return (
    <div className="card p-5 hover:shadow-md transition-shadow">
      {/* Top Header: Skill Name & Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            {LEARNING_MODE_LABELS[session.mode] || session.mode}
          </span>
          <h4 className="text-base font-bold text-slate-900">{session.skillName}</h4>
        </div>
        <span className={`badge ${statusBadges[session.status] || 'badge-slate'}`}>
          {SESSION_STATUS_LABELS[session.status] || session.status}
        </span>
      </div>

      {/* Participants */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50/70 rounded-xl p-3 border border-slate-100">
        <div className="flex items-center gap-2.5">
          {session.teacherAvatarUrl ? (
            <img
              src={session.teacherAvatarUrl}
              alt={session.teacherName}
              className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
              {getInitials(session.teacherName)}
            </div>
          )}
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Mentor / Teacher</span>
            <span className="font-semibold text-slate-800">{session.teacherName} {isTeacher && '(You)'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {session.learnerAvatarUrl ? (
            <img
              src={session.learnerAvatarUrl}
              alt={session.learnerName}
              className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
              {getInitials(session.learnerName)}
            </div>
          )}
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Learner</span>
            <span className="font-semibold text-slate-800">{session.learnerName} {isLearner && '(You)'}</span>
          </div>
        </div>
      </div>

      {/* Date, Time & Location Details */}
      <div className="mt-4 space-y-1.5 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
          <span>{formatDate(session.scheduledDate)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-400 shrink-0" />
          <span>
            {formatTime(session.startTime)} &ndash; {formatTime(session.endTime)} ({session.durationMinutes || 60} mins)
          </span>
        </div>
        <div className="flex items-center gap-2">
          {session.venueOrLink?.startsWith('http') ? (
            <>
              <LinkIcon className="h-4 w-4 text-indigo-500 shrink-0" />
              <a
                href={session.venueOrLink}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 underline font-medium truncate hover:text-indigo-800"
              >
                {session.venueOrLink}
              </a>
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="truncate">{session.venueOrLink || 'To be coordinated'}</span>
            </>
          )}
        </div>
      </div>

      {/* Completion OTP Display for Learner */}
      {isScheduled && isLearner && session.plainVerificationCode && (
        <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-indigo-900">
            <KeyRound className="h-3.5 w-3.5 text-indigo-600" />
            <span>Mutual Completion OTP</span>
          </div>
          <div className="mt-1 text-2xl font-mono font-bold tracking-widest text-indigo-700">
            {session.plainVerificationCode}
          </div>
          <p className="mt-1 text-[11px] text-indigo-600">
            Share this code with <strong>{session.teacherName}</strong> when the session concludes to release their credit.
          </p>
        </div>
      )}

      {/* Cancellation reason if cancelled */}
      {isCancelled && session.cancellationReason && (
        <p className="mt-3 text-xs text-red-600 italic bg-red-50 p-2 rounded-lg border border-red-100">
          Cancellation Reason: {session.cancellationReason}
        </p>
      )}

      {/* Action Footer */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        {/* Left side actions: Cancel or Report */}
        <div>
          {isScheduled && onCancel && (
            <button
              type="button"
              onClick={() => onCancel(session)}
              className="text-xs font-semibold text-red-600 hover:text-red-700"
            >
              Cancel Session
            </button>
          )}

          {isCompleted && (
            <button
              type="button"
              onClick={() => setReportModalOpen(true)}
              className="text-xs font-medium text-slate-400 hover:text-red-600 flex items-center gap-1"
            >
              <AlertTriangle className="h-3 w-3" />
              <span>Report Issue</span>
            </button>
          )}
        </div>

        {/* Right side actions: Verify completion or Leave Review */}
        <div className="flex items-center gap-2">
          {isScheduled && isTeacher && (
            <button
              type="button"
              onClick={() => setVerifyModalOpen(true)}
              className="btn btn-primary btn-sm"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Verify & Complete (+1 Credit)</span>
            </button>
          )}

          {isCompleted && !hasReviewed && (
            <button
              type="button"
              onClick={() => setReviewModalOpen(true)}
              className="btn btn-secondary btn-sm"
            >
              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              <span>Leave Review</span>
            </button>
          )}

          {isCompleted && hasReviewed && (
            <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Reviewed
            </span>
          )}
        </div>
      </div>

      {/* Modals */}
      {verifyModalOpen && (
        <VerificationCodeModal
          isOpen={verifyModalOpen}
          onClose={() => setVerifyModalOpen(false)}
          session={session}
          onSuccess={onRefresh}
        />
      )}

      {reviewModalOpen && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          session={session}
          onSuccess={onRefresh}
        />
      )}

      {reportModalOpen && (
        <ReportModal
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          reportedUser={{
            id: isLearner ? session.teacherId : session.learnerId,
            fullName: isLearner ? session.teacherName : session.learnerName,
          }}
          relatedSessionId={session.id}
          onSuccess={onRefresh}
        />
      )}
    </div>
  );
}

export default SessionCard;
