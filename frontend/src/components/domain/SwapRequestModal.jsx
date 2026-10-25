import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useToast } from '../../context/ToastContext';
import { useWallet } from '../../context/WalletContext';
import * as swapApi from '../../api/swapApi';
import * as profileApi from '../../api/profileApi';
import { LEARNING_MODE, LEARNING_MODE_LABELS } from '../../utils/constants';
import { ArrowLeftRight, Coins, AlertCircle } from 'lucide-react';

export function SwapRequestModal({ isOpen, onClose, targetStudent, onSuccess }) {
  const toast = useToast();
  const { availableCredits } = useWallet();

  const [myTeachSkills, setMyTeachSkills] = useState([]);
  const [targetTeachSkills, setTargetTeachSkills] = useState([]);
  const [requestedSkillId, setRequestedSkillId] = useState('');
  const [offeredSkillId, setOfferedSkillId] = useState(''); // empty string means credit-backed
  const [proposedMode, setProposedMode] = useState(LEARNING_MODE.ONLINE);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(false);

  useEffect(() => {
    if (isOpen && targetStudent) {
      loadSkills();
    }
  }, [isOpen, targetStudent]);

  async function loadSkills() {
    setLoadingSkills(true);
    try {
      // 1. Load my profile to see what I can teach
      const myRes = await profileApi.getMyProfile();
      setMyTeachSkills(myRes?.data?.teachSkills || []);

      // 2. Load target student profile to see what they can teach
      const targetUserId = targetStudent.userId || targetStudent.id;
      const targetRes = await profileApi.getStudentProfile(targetUserId);
      const theirTeaches = targetRes?.data?.teachSkills || [];
      setTargetTeachSkills(theirTeaches);

      if (theirTeaches.length > 0) {
        setRequestedSkillId(theirTeaches[0].skillId || theirTeaches[0].id);
      }
    } catch (err) {
      toast.error('Failed to load student skills for swap proposal');
    } finally {
      setLoadingSkills(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!requestedSkillId) {
      toast.error('Please choose a skill you want to learn');
      return;
    }

    const isCreditBacked = !offeredSkillId;
    if (isCreditBacked && (availableCredits == null || availableCredits < 1)) {
      toast.error('You need at least 1 Skill Credit to propose a credit-backed swap!');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        receiverId: targetStudent.userId || targetStudent.id,
        requestedSkillId: Number(requestedSkillId),
        offeredSkillId: offeredSkillId ? Number(offeredSkillId) : null,
        proposedMode,
        message: message.trim() || 'Hi! Would love to swap knowledge and learn with you.',
      };

      await swapApi.createSwap(payload);
      toast.success('Swap proposal sent successfully!');
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.message || 'Failed to send swap proposal');
    } finally {
      setSubmitting(false);
    }
  }

  const isCreditBacked = !offeredSkillId;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Propose Skill Swap with ${targetStudent?.fullName || targetStudent?.candidateName || 'Peer'}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Requested Skill */}
        <div>
          <label className="label">
            Skill you want to learn <span className="text-red-500">*</span>
          </label>
          <select
            value={requestedSkillId}
            onChange={(e) => setRequestedSkillId(e.target.value)}
            className="input"
            required
            disabled={loadingSkills}
          >
            {targetTeachSkills.map((ts) => (
              <option key={ts.skillId || ts.id} value={ts.skillId || ts.id}>
                {ts.skillName || ts.name} ({ts.proficiencyLevel || 'Proficient'})
              </option>
            ))}
            {targetTeachSkills.length === 0 && (
              <option value="">No taught skills listed by peer</option>
            )}
          </select>
        </div>

        {/* Offered Skill or Pure Credit */}
        <div>
          <label className="label">
            Skill you offer in exchange <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <select
            value={offeredSkillId}
            onChange={(e) => setOfferedSkillId(e.target.value)}
            className="input"
            disabled={loadingSkills}
          >
            <option value="">Pay with 1 Skill Credit (No reciprocal skill)</option>
            {myTeachSkills.map((ts) => (
              <option key={ts.skillId || ts.id} value={ts.skillId || ts.id}>
                Teach {ts.skillName || ts.name} (Direct Skill Exchange)
              </option>
            ))}
          </select>
        </div>

        {/* Credit warning indicator if credit-backed */}
        {isCreditBacked && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 flex items-start gap-2.5 text-xs text-amber-800">
            <Coins className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="font-bold">Credit-Backed Swap</p>
              <p className="mt-0.5">
                When a session is scheduled, 1 credit will be held in escrow and settled to your peer upon completion.
                Available balance: <strong>{availableCredits ?? 0} Credits</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Learning Mode */}
        <div>
          <label className="label">Preferred Learning Mode</label>
          <select
            value={proposedMode}
            onChange={(e) => setProposedMode(e.target.value)}
            className="input"
          >
            {Object.entries(LEARNING_MODE).map(([key, value]) => (
              <option key={key} value={value}>
                {LEARNING_MODE_LABELS[key] || value}
              </option>
            ))}
          </select>
        </div>

        {/* Personal Message */}
        <div>
          <label className="label">Introductory Note</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="input"
            placeholder="Introduce yourself, mention what topics you'd like to cover..."
            maxLength={500}
          />
        </div>

        {/* Actions */}
        <div className="pt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={submitting || loadingSkills}
          >
            <ArrowLeftRight className="h-4 w-4" />
            <span>{submitting ? 'Sending...' : 'Send Swap Request'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default SwapRequestModal;
