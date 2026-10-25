import React, { useState, useEffect } from 'react';
import * as sessionApi from '../../api/sessionApi';
import { useToast } from '../../context/ToastContext';
import { useWallet } from '../../context/WalletContext';
import SessionCard from '../../components/domain/SessionCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { SESSION_STATUS } from '../../utils/constants';
import { Clock, CheckCircle2, XCircle, Calendar } from 'lucide-react';

export function SessionsPage() {
  const toast = useToast();
  const { refreshBalance } = useWallet();

  const [activeTab, setActiveTab] = useState('SCHEDULED');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    setLoading(true);
    try {
      const res = await sessionApi.getMySessions();
      setSessions(res?.data?.content || []);
      refreshBalance();
    } catch (err) {
      toast.error('Failed to load tutoring sessions');
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelSession(session) {
    const reason = window.prompt('Please enter a cancellation reason:');
    if (reason === null) return;

    try {
      await sessionApi.cancelSession(session.id, reason || 'Cancelled by user');
      toast.info('Session cancelled. 1 Credit refunded to learner wallet.');
      loadSessions();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel session');
    }
  }

  const filteredSessions = sessions.filter((s) => {
    if (activeTab === 'SCHEDULED') return s.status === SESSION_STATUS.SCHEDULED;
    if (activeTab === 'COMPLETED') return s.status === SESSION_STATUS.COMPLETED;
    return s.status === SESSION_STATUS.CANCELLED || s.status === SESSION_STATUS.DISPUTED;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tutoring Sessions</h1>
        <p className="mt-1 text-xs text-slate-500">
          Track scheduled meetings, exchange completion OTP codes, and rate peer mentor sessions.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('SCHEDULED')}
          className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition-colors ${
            activeTab === 'SCHEDULED'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Scheduled ({sessions.filter((s) => s.status === 'SCHEDULED').length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('COMPLETED')}
          className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition-colors ${
            activeTab === 'COMPLETED'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>Completed ({sessions.filter((s) => s.status === 'COMPLETED').length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('CANCELLED')}
          className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition-colors ${
            activeTab === 'CANCELLED'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <XCircle className="h-4 w-4" />
          <span>Past & Cancelled ({sessions.filter((s) => s.status === 'CANCELLED' || s.status === 'DISPUTED').length})</span>
        </button>
      </div>

      {/* Session Cards Grid */}
      {loading ? (
        <LoadingSpinner size="lg" message="Loading sessions..." className="min-h-[40vh]" />
      ) : filteredSessions.length === 0 ? (
        <EmptyState
          title={
            activeTab === 'SCHEDULED'
              ? 'No upcoming sessions scheduled'
              : activeTab === 'COMPLETED'
              ? 'No completed sessions yet'
              : 'No cancelled sessions'
          }
          description={
            activeTab === 'SCHEDULED'
              ? 'Accept swap proposals in your Swaps tab to book your next study session!'
              : 'Finished tutoring sessions will appear here with reviews and ratings.'
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onRefresh={loadSessions}
              onCancel={handleCancelSession}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SessionsPage;
