import axiosClient from './axiosClient';

/**
 * Report API — maps to ReportController (/api/v1/reports).
 *
 * POST /reports -> CreateReportRequest -> Report
 *
 * NOTE: The backend has NO AdminController. AdminService methods for listing,
 * resolving reports, moderating users, analytics, and audit logs exist in Java
 * but are NOT exposed over HTTP. The frontend therefore only supports creating
 * a report. See docs/FRONTEND_API_GAPS.md.
 */

export function createReport(payload) {
  // { reportedUserId, relatedSessionId?, category, description }
  return axiosClient.post('/reports', payload);
}

export default {
  createReport,
};