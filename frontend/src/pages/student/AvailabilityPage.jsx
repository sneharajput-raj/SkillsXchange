import React, { useState, useEffect } from 'react';
import * as profileApi from '../../api/profileApi';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { DAYS_OF_WEEK, DAY_LABELS } from '../../utils/constants';
import { formatTime } from '../../utils/formatters';
import { Calendar, Plus, Trash2, Clock, CheckCircle2 } from 'lucide-react';

export function AvailabilityPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slots, setSlots] = useState([]);

  // New slot form
  const [newDay, setNewDay] = useState(DAYS_OF_WEEK[0]);
  const [newStartTime, setNewStartTime] = useState('17:00');
  const [newEndTime, setNewEndTime] = useState('19:00');

  useEffect(() => {
    loadAvailability();
  }, []);

  async function loadAvailability() {
    setLoading(true);
    try {
      const res = await profileApi.getMyProfile();
      const currentAvail = res?.data?.availability || res?.data?.availabilities || [];
      setSlots(
        currentAvail.map((a) => ({
          dayOfWeek: a.dayOfWeek,
          startTime: a.startTime?.slice(0, 5) || '17:00',
          endTime: a.endTime?.slice(0, 5) || '19:00',
        }))
      );
    } catch (err) {
      toast.error('Failed to load availability slots');
    } finally {
      setLoading(false);
    }
  }

  function handleAddSlot(e) {
    e.preventDefault();
    if (newStartTime >= newEndTime) {
      toast.error('Start time must be earlier than end time');
      return;
    }

    setSlots((prev) => [
      ...prev,
      { dayOfWeek: newDay, startTime: newStartTime, endTime: newEndTime },
    ]);
    toast.success('Slot added to preview. Click "Save Schedule" to publish.');
  }

  function handleRemoveSlot(index) {
    setSlots((prev) => prev.filter((_, idx) => idx !== index));
  }

  async function handleSaveSchedule() {
    setSaving(true);
    try {
      // Backend expects: slots: [{ dayOfWeek, startTime: "HH:mm:ss", endTime: "HH:mm:ss" }]
      const formattedSlots = slots.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime.length === 5 ? `${s.startTime}:00` : s.startTime,
        endTime: s.endTime.length === 5 ? `${s.endTime}:00` : s.endTime,
      }));

      await profileApi.setAvailability(formattedSlots);
      toast.success('Weekly availability schedule published successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to save availability');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading weekly schedule..." className="min-h-[50vh]" />;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Weekly Tutoring Availability</h1>
          <p className="mt-1 text-xs text-slate-500">
            Publish times when you are free to conduct tutoring sessions. Boosts your match algorithm score by +25 points.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveSchedule}
          disabled={saving}
          className="btn btn-primary btn-sm"
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>{saving ? 'Saving...' : 'Save Schedule'}</span>
        </button>
      </div>

      {/* Add Slot Card */}
      <div className="card p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4 text-indigo-600" />
          <span>Add Availability Window</span>
        </h3>

        <form onSubmit={handleAddSlot} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div>
            <label className="label">Day of Week</label>
            <select
              value={newDay}
              onChange={(e) => setNewDay(e.target.value)}
              className="input"
            >
              {DAYS_OF_WEEK.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Start Time</label>
            <input
              type="time"
              value={newStartTime}
              onChange={(e) => setNewStartTime(e.target.value)}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">End Time</label>
            <input
              type="time"
              value={newEndTime}
              onChange={(e) => setNewEndTime(e.target.value)}
              className="input"
              required
            />
          </div>

          <div>
            <button type="submit" className="btn btn-secondary w-full">
              <Plus className="h-4 w-4" />
              <span>Add Slot</span>
            </button>
          </div>
        </form>
      </div>

      {/* Weekly Slots Display Grouped By Day */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-700">Current Schedule ({slots.length} slots)</h3>

        {slots.length === 0 ? (
          <div className="card p-8 text-center text-xs text-slate-400">
            No availability slots added yet. Use the form above to add your weekly study windows!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {slots.map((slot, index) => (
              <div
                key={index}
                className="card p-4 flex items-center justify-between border-slate-200 bg-white"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs">
                    {DAY_LABELS[slot.dayOfWeek] || slot.dayOfWeek.slice(0, 3)}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">{slot.dayOfWeek}</span>
                    <span className="text-slate-500 text-xs font-mono">
                      {formatTime(slot.startTime)} &ndash; {formatTime(slot.endTime)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveSlot(index)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                  title="Remove slot"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AvailabilityPage;
