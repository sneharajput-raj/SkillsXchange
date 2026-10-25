import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useToast } from '../../context/ToastContext';
import * as reportApi from '../../api/reportApi';
import { REPORT_CATEGORY, REPORT_CATEGORY_LABELS } from '../../utils/constants';
import { AlertTriangle } from 'lucide-react';

export function ReportModal({ isOpen, onClose, reportedUser, relatedSessionId = null, onSuccess }) {
  const toast = useToast();
  const [category, setCategory] = useState(REPORT_CATEGORY.NO_SHOW);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!description.trim()) {
      toast.error('Please describe what happened');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        reportedUserId: reportedUser.userId || reportedUser.id,
        relatedSessionId,
        category,
        description: description.trim(),
      };

      await reportApi.createReport(payload);
      toast.success('Dispute submitted. Campus administrators will review it shortly.');
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.message || 'Failed to submit dispute');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="File a Dispute or Report"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-xl border border-red-100 bg-red-50/70 p-3 text-xs text-red-900 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
          <p>
            Reports are securely investigated by campus administrators. False reports may affect your reputation score.
          </p>
        </div>

        <div>
          <label className="label">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input"
          >
            {Object.entries(REPORT_CATEGORY).map(([key, val]) => (
              <option key={key} value={val}>
                {REPORT_CATEGORY_LABELS[key] || val}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Please detail what occurred during the session or exchange..."
            className="input"
            required
            maxLength={1000}
          />
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
            className="btn btn-danger btn-sm"
            disabled={submitting}
          >
            <span>{submitting ? 'Submitting...' : 'File Report'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default ReportModal;
