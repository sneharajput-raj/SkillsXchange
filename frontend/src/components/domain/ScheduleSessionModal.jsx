import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useToast } from '../../context/ToastContext';
import { useWallet } from '../../context/WalletContext';
import * as sessionApi from '../../api/sessionApi';
import { LEARNING_MODE, LEARNING_MODE_LABELS } from '../../utils/constants';
import { Calendar, Clock, MapPin, Link as LinkIcon, Coins } from 'lucide-react';

export function ScheduleSessionModal({ isOpen, onClose, swap, onSuccess }) {
  const toast = useToast();
  const { refreshBalance } = useWallet();

  const [scheduledDate, setScheduledDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState('17:00');
  const [endTime, setEndTime] = useState('18:00');
  const [mode, setMode] = useState(swap?.proposedMode || LEARNING_MODE.ONLINE);
  const [venueOrLink, setVenueOrLink] = useState('https://meet.google.com/new');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!scheduledDate || !startTime) {
      toast.error('Please pick a date and start time');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        swapRequestId: swap.id,
        scheduledDate,
        startTime: startTime.length === 5 ? `${startTime}:00` : startTime,
        endTime: endTime ? (endTime.length === 5 ? `${endTime}:00` : endTime) : null,
        mode,
        venueOrLink: venueOrLink.trim() || 'Online Link TBD',
      };

      await sessionApi.scheduleSession(payload);
      await refreshBalance();
      toast.success('Tutoring session booked! 1 Credit held in escrow.');
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.message || 'Failed to schedule session');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Schedule Session for ${swap?.requestedSkillName || 'Skill Exchange'}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-3 text-xs text-indigo-900">
          <div className="flex items-center gap-1.5 font-bold">
            <Coins className="h-4 w-4 text-amber-500" />
            <span>Escrow Protection</span>
          </div>
          <p className="mt-0.5 text-slate-600">
            Scheduling locks 1 Skill Credit in secure escrow until the session is completed via mutual verification code.
          </p>
        </div>

        {/* Date */}
        <div>
          <label className="label">
            Session Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Calendar className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="input pl-9"
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        {/* Start & End Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">
              Start Time <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Clock className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="input pl-9"
                required
              />
            </div>
          </div>
          <div>
            <label className="label">End Time</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Clock className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="input pl-9"
              />
            </div>
          </div>
        </div>

        {/* Mode */}
        <div>
          <label className="label">Delivery Mode</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="input"
          >
            {Object.entries(LEARNING_MODE).map(([key, value]) => (
              <option key={key} value={value}>
                {LEARNING_MODE_LABELS[key] || value}
              </option>
            ))}
          </select>
        </div>

        {/* Venue or Link */}
        <div>
          <label className="label">
            {mode === LEARNING_MODE.IN_PERSON ? 'Campus Venue' : 'Meeting URL or Venue'}
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              {mode === LEARNING_MODE.IN_PERSON ? (
                <MapPin className="h-4 w-4 text-slate-400" />
              ) : (
                <LinkIcon className="h-4 w-4 text-slate-400" />
              )}
            </div>
            <input
              type="text"
              value={venueOrLink}
              onChange={(e) => setVenueOrLink(e.target.value)}
              placeholder={mode === LEARNING_MODE.IN_PERSON ? 'e.g. Central Library 2nd Floor' : 'e.g. https://meet.google.com/xyz'}
              className="input pl-9"
              required
            />
          </div>
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
            disabled={submitting}
          >
            <span>{submitting ? 'Booking...' : 'Confirm & Book Session'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default ScheduleSessionModal;
