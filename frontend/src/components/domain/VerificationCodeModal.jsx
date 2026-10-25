import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useToast } from '../../context/ToastContext';
import { useWallet } from '../../context/WalletContext';
import * as sessionApi from '../../api/sessionApi';
import { KeyRound, Coins, CheckCircle2 } from 'lucide-react';

export function VerificationCodeModal({ isOpen, onClose, session, onSuccess }) {
  const toast = useToast();
  const { refreshBalance } = useWallet();
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const cleanCode = code.trim();
    if (cleanCode.length !== 6) {
      toast.error('Verification code must be exactly 6 digits');
      return;
    }

    setSubmitting(true);
    try {
      await sessionApi.completeSession(session.id, cleanCode);
      await refreshBalance();
      toast.success('Session verified and completed! +1 Credit added to your wallet 🎉');
      setCode('');
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.message || 'Incorrect verification code. Please confirm with your learner.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Verify Session Completion"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 text-xs text-indigo-900">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Coins className="h-4 w-4 text-amber-500" />
            <span>Earn 1 Skill Credit</span>
          </div>
          <p className="mt-1 text-slate-600">
            Ask <strong>{session?.learnerName}</strong> for the 6-digit mutual completion code shown on their session card.
            Submitting it confirms that you taught <strong>{session?.skillName}</strong>.
          </p>
        </div>

        <div>
          <label className="label">
            6-Digit Verification Code <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <KeyRound className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="e.g. 482910"
              className="input pl-9 text-center text-xl font-mono tracking-widest"
              required
              maxLength={6}
              autoFocus
            />
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Must be exactly 6 numeric digits provided by your peer learner.
          </p>
        </div>

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
            disabled={submitting || code.length !== 6}
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{submitting ? 'Verifying...' : 'Verify & Claim Credit'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default VerificationCodeModal;
