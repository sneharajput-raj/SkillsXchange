import axiosClient from './axiosClient';

/**
 * Admin API — maps to AdminController (/api/v1/admin).
 *
 * GET   /admin/analytics            -> AdminAnalyticsDto
 * GET   /admin/reports              -> Page<Report>
 * POST  /admin/reports/{id}/resolve -> ResolveReportRequest -> Report
 * PATCH /admin/users/{id}/status    -> UserStatusUpdateRequest -> User
 * GET   /admin/audit-logs           -> Page<AdminAuditLog>
 */

export function getAnalytics() {
  return axiosClient.get('/admin/analytics');
}

export function getReports(params = {}) {
  // params: { status, page, size }
  return axiosClient.get('/admin/reports', { params });
}

export function resolveReport(reportId, payload) {
  // { resolutionAction: 'REFUND_LEARNER' | 'DISMISS' | 'WARN', adminNotes }
  return axiosClient.post(`/admin/reports/${reportId}/resolve`, payload);
}

export function updateUserStatus(userId, payload) {
  // { active: boolean, reason: string }
  return axiosClient.patch(`/admin/users/${userId}/status`, payload);
}

export function getAuditLogs(params = {}) {
  return axiosClient.get('/admin/audit-logs', { params });
}

export default {
  getAnalytics,
  getReports,
  resolveReport,
  updateUserStatus,
  getAuditLogs,
};
