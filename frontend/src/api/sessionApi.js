import axiosClient from './axiosClient';

/**
 * Session API — maps to SessionController (/api/v1/sessions).
 *
 * POST   /sessions                         -> ScheduleSessionRequest -> SessionSummaryDto
 * GET    /sessions                         -> Page<SessionSummaryDto>
 * POST   /sessions/{sessionId}/complete    -> CompleteSessionRequest -> SessionSummaryDto
 * POST   /sessions/{sessionId}/cancel      -> SessionSummaryDto
 */

export function scheduleSession(payload) {
  // { swapRequestId, scheduledDate, startTime, endTime, mode, venueOrLink }
  return axiosClient.post('/sessions', payload);
}

export function getMySessions(params = {}) {
  return axiosClient.get('/sessions', { params });
}

export function completeSession(sessionId, verificationCode) {
  return axiosClient.post(`/sessions/${sessionId}/complete`, { verificationCode });
}

export function cancelSession(sessionId, reason = null) {
  return axiosClient.post(`/sessions/${sessionId}/cancel`, reason ? { reason } : {});
}

export default {
  scheduleSession,
  getMySessions,
  completeSession,
  cancelSession,
};