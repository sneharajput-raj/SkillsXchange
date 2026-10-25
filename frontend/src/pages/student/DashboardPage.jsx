import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWallet } from '../../context/WalletContext';
import { useToast } from '../../context/ToastContext';
import * as profileApi from '../../api/profileApi';
import * as matchApi from '../../api/matchApi';
import * as swapApi from '../../api/swapApi';
import * as sessionApi from '../../api/sessionApi';
import { ROUTES } from '../../utils/constants';
import MatchCard from '../../components/domain/MatchCard';
import SessionCard from '../../components/domain/SessionCard';
import SwapRequestModal from '../../components/domain/SwapRequestModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import {
  Coins,
  Sparkles,
  ArrowRight,
  Clock,
  ArrowLeftRight,
  CheckCircle2,
  Star,
  BookOpen,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export function DashboardPage() {
  const { user } = useAuth();
  const { availableCredits, escrowCredits, refreshBalance } = useWallet();
  const toast = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [incomingSwaps, setIncomingSwaps] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);

  // Swap modal state
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    try {
      refreshBalance();

      // Parallel API loading
      const [profRes, matchRes, swapsRes, sessRes] = await Promise.allSettled([
        profileApi.getMyProfile(),
        matchApi.getMatches(),
        swapApi.getIncomingSwaps({ page: 0, size: 3 }),
        sessionApi.getMySessions({ page: 0, size: 3 }),
      ]);

      if (profRes.status === 'fulfilled') setProfile(profRes.value?.data);
      if (matchRes.status === 'fulfilled') setMatches(matchRes.value?.data || []);
      if (swapsRes.status === 'fulfilled') setIncomingSwaps(swapsRes.value?.data?.content || []);
      if (sessRes.status === 'fulfilled') {
        const allSess = sessRes.value?.data?.content || [];
        setUpcomingSessions(allSess.filter((s) => s.status === 'SCHEDULED'));
      }
    } catch (err) {
      toast.error('Failed to load dashboard overview');
    } finally {
      setLoading(false);
    }
  }

  async function handleAcceptSwap(swapId) {
    try {
      await swapApi.acceptSwap(swapId);
      toast.success('Swap proposal accepted! You can now schedule a session.');
      loadDashboardData();
    } catch (err) {
      toast.error(err.message || 'Failed to accept swap');
    }
  }

  async function handleRejectSwap(swapId) {
    try {
      await swapApi.rejectSwap(swapId);
      toast.info('Swap proposal declined');
      loadDashboardData();
    } catch (err) {
      toast.error(err.message || 'Failed to decline swap');
    }
  }

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading your dashboard..." className="min-h-[50vh]" />;
  }

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-200 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Peer Exchange</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hello, {user?.fullName || 'there'}! 👋
            </h1>
            <p className="mt-1 text-sm text-indigo-200 max-w-xl">
              Ready to swap skills and learn together today?
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to={ROUTES.MATCHES} className="btn btn-primary btn-sm bg-white text-indigo-900 hover:bg-slate-100 shadow">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span>Find Matches</span>
            </Link>
            <Link to={ROUTES.MY_SKILLS} className="btn btn-secondary btn-sm bg-indigo-900/40 text-white border-white/20 hover:bg-indigo-900/70">
              <BookOpen className="h-4 w-4" />
              <span>Manage Skills</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Credits */}
        <Link to={ROUTES.WALLET} className="card p-5 hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available Credits</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Coins className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{availableCredits ?? 0}</span>
            <span className="text-xs font-medium text-slate-400">Credits</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">1 credit = 1 hour session</p>
        </Link>

        {/* Escrow Credits */}
        <Link to={ROUTES.WALLET} className="card p-5 hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Locked in Escrow</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{escrowCredits ?? 0}</span>
            <span className="text-xs font-medium text-slate-400">Credits</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Safeguarded for active sessions</p>
        </Link>

        {/* Completed Sessions */}
        <Link to={ROUTES.SESSIONS} className="card p-5 hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sessions Done</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {profile?.totalSessionsCompleted ?? 0}
            </span>
            <span className="text-xs font-medium text-slate-400">Hours</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Taught & learned knowledge</p>
        </Link>

        {/* Peer Rating */}
        <Link to={ROUTES.PROFILE} className="card p-5 hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Peer Rating</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
              <Star className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {profile?.averageRating ? profile.averageRating.toFixed(1) : '5.0'}
            </span>
            <span className="text-xs font-medium text-slate-400">/ 5.0</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Based on {profile?.totalReviewsCount ?? 0} peer reviews</p>
        </Link>
      </div>

      {/* Main Grid: Pending Swaps & Upcoming Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incoming Swap Requests */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">Incoming Swap Requests</h3>
            </div>
            <Link to={ROUTES.SWAPS} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
              View All ({incomingSwaps.length})
            </Link>
          </div>

          {incomingSwaps.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No pending swap requests right now. Discover peers to send proposals!
            </div>
          ) : (
            <div className="space-y-3">
              {incomingSwaps.map((swap) => (
                <div key={swap.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {swap.senderName} wants to learn{' '}
                        <span className="text-indigo-600 font-extrabold">{swap.requestedSkillName}</span>
                      </p>
                      {swap.offeredSkillName && (
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Offering in exchange: <strong>{swap.offeredSkillName}</strong>
                        </p>
                      )}
                      {swap.message && (
                        <p className="mt-2 text-xs text-slate-600 italic bg-white p-2 rounded-lg border border-slate-100">
                          &ldquo;{swap.message}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  {swap.status === 'PENDING' && (
                    <div className="mt-3 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleRejectSwap(swap.id)}
                        className="btn btn-secondary btn-sm"
                      >
                        Decline
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAcceptSwap(swap.id)}
                        className="btn btn-primary btn-sm"
                      >
                        Accept Swap
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Tutoring Sessions */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">Upcoming Sessions</h3>
            </div>
            <Link to={ROUTES.SESSIONS} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
              View All ({upcomingSessions.length})
            </Link>
          </div>

          {upcomingSessions.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No sessions scheduled for this week.
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingSessions.slice(0, 2).map((sess) => (
                <SessionCard
                  key={sess.id}
                  session={sess}
                  onRefresh={loadDashboardData}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recommended Matches Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recommended Peer Matches</h3>
            <p className="text-xs text-slate-500">
              Computed deterministically from your taught skills and learning goals.
            </p>
          </div>
          <Link to={ROUTES.MATCHES} className="btn btn-secondary btn-sm">
            <span>View All Matches</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {matches.length === 0 ? (
          <EmptyState
            title="No high-compatibility matches found yet"
            description="Add more skills to your teaching inventory and learning goals to help our matching engine pair you with peers!"
            action={
              <Link to={ROUTES.MY_SKILLS} className="btn btn-primary btn-sm">
                Add Skills Now
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {matches.slice(0, 3).map((match) => {
              const targetId = match.userId || match.candidateUserId;
              const targetName = match.fullName || match.candidateName;
              return (
                <MatchCard
                  key={targetId}
                  match={match}
                  onViewProfile={() => navigate(`/students/${targetId}`)}
                  onProposeSwap={() => {
                    setSelectedTarget({
                      userId: targetId,
                      fullName: targetName,
                    });
                    setSwapModalOpen(true);
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Propose Swap Modal */}
      {swapModalOpen && selectedTarget && (
        <SwapRequestModal
          isOpen={swapModalOpen}
          onClose={() => setSwapModalOpen(false)}
          targetStudent={selectedTarget}
          onSuccess={loadDashboardData}
        />
      )}
    </div>
  );
}

export default DashboardPage;
