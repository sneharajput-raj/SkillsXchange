import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as swapApi from '../../api/swapApi';
import * as chatApi from '../../api/chatApi';
import { useToast } from '../../context/ToastContext';
import { formatDate, getInitials } from '../../utils/formatters';
import {
  SWAP_STATUS,
  SWAP_STATUS_LABELS,
  LEARNING_MODE_LABELS,
  ROUTES,
} from '../../utils/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ScheduleSessionModal from '../../components/domain/ScheduleSessionModal';
import {
  ArrowLeftRight,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Calendar,
  Coins,
  Send,
  Inbox,
} from 'lucide-react';

export function SwapsPage() {
  const toast = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' | 'outgoing'
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);

  // Schedule modal
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedSwapForSchedule, setSelectedSwapForSchedule] = useState(null);

  useEffect(() => {
    loadSwaps();
  }, []);

  async function loadSwaps() {
    setLoading(true);
    try {
      const [incRes, outRes] = await Promise.all([
        swapApi.getIncomingSwaps(),
        swapApi.getOutgoingSwaps(),
      ]);
      setIncoming(incRes?.data?.content || []);
      setOutgoing(outRes?.data?.content || []);
    } catch (err) {
      toast.error('Failed to load swap proposals');
    } finally {
      setLoading(false);
    }
  }

  async function handleAccept(swapId) {
    try {
      await swapApi.acceptSwap(swapId);
      toast.success('Swap request accepted! You can now book tutoring sessions.');
      loadSwaps();
    } catch (err) {
      toast.error(err.message || 'Failed to accept swap');
    }
  }

  async function handleReject(swapId) {
    const reason = window.prompt('Please provide a brief reason for declining (optional):');
    if (reason === null) return; // user cancelled prompt

    try {
      await swapApi.rejectSwap(swapId, reason || null);
      toast.info('Swap request declined');
      loadSwaps();
    } catch (err) {
      toast.error(err.message || 'Failed to decline swap');
    }
  }

  async function handleCancel(swapId) {
    if (!window.confirm('Cancel this pending swap request?')) return;
    try {
      await swapApi.cancelSwap(swapId);
      toast.info('Swap request cancelled');
      loadSwaps();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel swap');
    }
  }

  async function handleStartChat(partnerId, swapId) {
    try {
      const res = await chatApi.getOrCreateConversation(partnerId, swapId);
      navigate(`${ROUTES.MESSAGES}?conversationId=${res?.data?.id}`);
    } catch (err) {
      toast.error('Failed to open message conversation');
    }
  }

  const statusBadges = {
    [SWAP_STATUS.PENDING]: 'badge-amber',
    [SWAP_STATUS.ACCEPTED]: 'badge-green',
    [SWAP_STATUS.REJECTED]: 'badge-slate',
    [SWAP_STATUS.CANCELLED]: 'badge-slate',
  };

  const currentList = activeTab === 'incoming' ? incoming : outgoing;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Skill Swap Requests</h1>
        <p className="mt-1 text-xs text-slate-500">
          Manage incoming and outgoing skill exchange agreements and proposals.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('incoming')}
          className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition-colors ${
            activeTab === 'incoming'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Inbox className="h-4 w-4" />
          <span>Incoming Requests ({incoming.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('outgoing')}
          className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition-colors ${
            activeTab === 'outgoing'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Send className="h-4 w-4" />
          <span>Outgoing Proposals ({outgoing.length})</span>
        </button>
      </div>

      {/* List */}
      {loading ? (
        <LoadingSpinner size="lg" message="Loading swap requests..." className="min-h-[40vh]" />
      ) : currentList.length === 0 ? (
        <EmptyState
          title={activeTab === 'incoming' ? 'No incoming swap proposals' : 'No outgoing swap proposals'}
          description={
            activeTab === 'incoming'
              ? 'When peers find your teaching skills compatible, proposals will appear here.'
              : 'Browse students in the Discover directory to propose your first swap!'
          }
          action={
            activeTab === 'outgoing' && (
              <button
                type="button"
                onClick={() => navigate(ROUTES.DISCOVER)}
                className="btn btn-primary btn-sm"
              >
                Discover Peers
              </button>
            )
          }
        />
      ) : (
        <div className="space-y-4">
          {currentList.map((swap) => {
            const isPending = swap.status === SWAP_STATUS.PENDING;
            const isAccepted = swap.status === SWAP_STATUS.ACCEPTED;

            const partnerName = activeTab === 'incoming' ? swap.senderName : swap.receiverName;
            const partnerAvatar = activeTab === 'incoming' ? swap.senderAvatarUrl : swap.receiverAvatarUrl;
            const partnerId = activeTab === 'incoming' ? swap.senderId : swap.receiverId;

            return (
              <div key={swap.id} className="card p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Left: Partner & Skill Details */}
                  <div className="flex items-start gap-3.5">
                    {partnerAvatar ? (
                      <img
                        src={partnerAvatar}
                        alt={partnerName}
                        className="h-11 w-11 rounded-full object-cover ring-2 ring-slate-100"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                        {getInitials(partnerName)}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{partnerName}</span>
                        <span className={`badge ${statusBadges[swap.status] || 'badge-slate'} text-[10px]`}>
                          {SWAP_STATUS_LABELS[swap.status] || swap.status}
                        </span>
                      </div>

                      <div className="mt-1 text-xs text-slate-600">
                        {activeTab === 'incoming' ? (
                          <p>
                            Wants to learn <strong>{swap.requestedSkillName}</strong> from you
                          </p>
                        ) : (
                          <p>
                            You asked to learn <strong>{swap.requestedSkillName}</strong>
                          </p>
                        )}

                        {swap.offeredSkillName ? (
                          <p className="text-emerald-700 font-medium mt-0.5">
                            Offered in return: <strong>{swap.offeredSkillName}</strong>
                          </p>
                        ) : (
                          <p className="text-amber-700 font-medium mt-0.5 flex items-center gap-1">
                            <Coins className="h-3.5 w-3.5" />
                            <span>Paid with 1 Skill Credit (Credit-backed)</span>
                          </p>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-400 mt-1">
                        Mode: {LEARNING_MODE_LABELS[swap.proposedMode] || swap.proposedMode} &bull; Requested on {formatDate(swap.createdAt)}
                      </p>

                      {swap.message && (
                        <p className="mt-2.5 text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 max-w-xl">
                          &ldquo;{swap.message}&rdquo;
                        </p>
                      )}

                      {swap.rejectionReason && (
                        <p className="mt-2 text-xs text-red-600 italic">
                          Decline Reason: {swap.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-wrap items-center gap-2 sm:self-center">
                    {/* Chat */}
                    <button
                      type="button"
                      onClick={() => handleStartChat(partnerId, swap.id)}
                      className="btn btn-secondary btn-sm"
                      title="Send message"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Chat</span>
                    </button>

                    {/* Incoming Pending Actions */}
                    {activeTab === 'incoming' && isPending && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleReject(swap.id)}
                          className="btn btn-secondary btn-sm text-red-600 hover:bg-red-50"
                        >
                          Decline
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAccept(swap.id)}
                          className="btn btn-primary btn-sm"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Accept</span>
                        </button>
                      </>
                    )}

                    {/* Outgoing Pending Actions */}
                    {activeTab === 'outgoing' && isPending && (
                      <button
                        type="button"
                        onClick={() => handleCancel(swap.id)}
                        className="btn btn-secondary btn-sm text-slate-500 hover:text-red-600"
                      >
                        Cancel Request
                      </button>
                    )}

                    {/* Accepted Actions -> Schedule Session */}
                    {isAccepted && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSwapForSchedule(swap);
                          setScheduleModalOpen(true);
                        }}
                        className="btn btn-primary btn-sm shadow-sm"
                      >
                        <Calendar className="h-4 w-4" />
                        <span>Schedule Session</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Schedule Session Modal */}
      {scheduleModalOpen && selectedSwapForSchedule && (
        <ScheduleSessionModal
          isOpen={scheduleModalOpen}
          onClose={() => setScheduleModalOpen(false)}
          swap={selectedSwapForSchedule}
          onSuccess={() => {
            loadSwaps();
            navigate(ROUTES.SESSIONS);
          }}
        />
      )}
    </div>
  );
}

export default SwapsPage;
