import axiosClient from './axiosClient';

/**
 * Review API — maps to ReviewController (/api/v1).
 *
 * POST /sessions/{sessionId}/reviews -> SubmitReviewRequest -> ReviewDto
 * GET  /users/{userId}/reviews       -> Page<ReviewDto>
 */

export function submitReview(sessionId, payload) {
  // { rating, feedback, endorsementTags }
  return axiosClient.post(`/sessions/${sessionId}/reviews`, payload);
}

export function getUserReviews(userId, params = {}) {
  return axiosClient.get(`/users/${userId}/reviews`, { params });
}

export default {
  submitReview,
  getUserReviews,
};