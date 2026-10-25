import React, { useState, useEffect } from 'react';
import * as adminApi from '../../api/adminApi';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatters';
import { REPORT_STATUS, REPORT_CATEGORY_LABELS } from '../../utils/constants';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { ShieldAlert, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export function AdminReportsPage() {
  const toast = useToast();
  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState('OPEN');
  const [loading, setLoading] = useState(true);

  // Resolve Modal
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [resolutionAction, setResolutionAction] = useState('REFUND_LEARNER');
  const [adminNotes, setAdminNotes] = useState('');
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    loadReports();
  }, [statusFilter]);

  async function loadReports() {
    setLoading(true);
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const res = await adminApi.getReports(params);
      setReports(res?.data?.content || []);
    } catch (err) {
      toast.error('Failed to load dispute reports');
    } finally {
      setLoading(false);
    }
  }

  async function handleResolveSubmit(e) {
    e.preventDefault();
    if (!selectedReport) return;

    setResolving(true);
    try {
      await adminApi.resolveReport(selectedReport.id, {
        resolutionAction,
        adminNotes: adminNotes.trim(),
      });
      toast.success('Dispute resolved and logged in campus audit records');
      setResolveModalOpen(false);
      loadReports();
    } catch (err) {
      toast.error(err.message || 'Failed to resolve dispute');
    } finally {
      setResolving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dispute Moderation Queue</h1>
          <p className="mt-1 text-xs text-slate-500">
            Review reported peer issues, investigate escrow disputes, and issue resolutions.
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input w-auto text-xs py-1.5"
        >
          <option value="">All Statuses</option>
          <option value="OPEN">Open Only</option>
          <option value="RESOLVED">Resolved</option>
          <option value="DISMISSED">Dismissed</option>
        </select>
      </div>

      {/* Reports Table/Cards */}
      {loading ? (
        <LoadingSpinner size="lg" message="Loading moderation queue..." className="min-h-[40vh]" />
      ) : reports.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="All clear! No disputes in queue"
          description="There are currently no reports matching the selected status filter."
        />
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="card p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="badge badge-red text-[10px]">
                      {REPORT_CATEGORY_LABELS[report.category] || report.category}
                    </span>
                    <span className="text-xs text-slate-400">Report #{report.id}</span>
                    <span className="text-xs text-slate-400">&bull; {formatDate(report.createdAt)}</span>
                  </div>

                  <div className="mt-2 text-xs text-slate-700">
                    <p>
                      <strong>Reporter:</strong> {report.reporter?.fullName} ({report.reporter?.email})
                    </p>
                    <p className="mt-0.5">
                      <strong>Reported User:</strong> {report.reportedUser?.fullName} ({report.reportedUser?.email})
                    </p>
                    {report.relatedSessionId && (
                      <p className="mt-0.5 text-indigo-600 font-semibold">
                        Related Session #{report.relatedSessionId}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-800 leading-relaxed max-w-2xl">
                    &ldquo;{report.description}&rdquo;
                  </div>

                  {report.adminNotes && (
                    <p className="mt-2 text-xs text-purple-700 italic">
                      Admin Notes: {report.adminNotes}
                    </p>
                  )}
                </div>

                {report.status === 'OPEN' && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedReport(report);
                      setAdminNotes('');
                      setResolveModalOpen(true);
                    }}
                    className="btn btn-primary btn-sm shrink-0 self-start"
                  >
                    Resolve Dispute
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resolve Modal */}
      {resolveModalOpen && selectedReport && (
        <Modal
          isOpen={resolveModalOpen}
          onClose={() => setResolveModalOpen(false)}
          title={`Resolve Report #${selectedReport.id}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleResolveSubmit} className="space-y-4">
            <div>
              <label className="label">Resolution Action</label>
              <select
                value={resolutionAction}
                onChange={(e) => setResolutionAction(e.target.value)}
                className="input"
              >
                <option value="REFUND_LEARNER">Refund Escrow to Learner & Cancel Session</option>
                <option value="PAY_TEACHER">Release Escrow Credit to Mentor</option>
                <option value="DISMISS">Dismiss Dispute (No Credit Action)</option>
              </select>
            </div>

            <div>
              <label className="label">Admin Notes / Decision Reason</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                placeholder="Reasoning recorded in audit log..."
                className="input"
                required
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setResolveModalOpen(false)}
                className="btn btn-secondary btn-sm"
                disabled={resolving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={resolving}
              >
                <span>{resolving ? 'Submitting...' : 'Confirm Resolution'}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default AdminReportsPage;
