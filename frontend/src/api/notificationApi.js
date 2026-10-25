import axiosClient from './axiosClient';

/**
 * Notification API — maps to NotificationController (/api/v1/notifications).
 *
 * GET   /notifications              -> Page<NotificationDto>
 * GET   /notifications/unread-count -> { unreadCount }
 * PATCH /notifications/{id}/read
 * POST  /notifications/mark-all-read
 */

export function getNotifications(params = {}) {
  return axiosClient.get('/notifications', { params });
}

export function getUnreadCount() {
  return axiosClient.get('/notifications/unread-count');
}

export function markAsRead(id) {
  return axiosClient.patch(`/notifications/${id}/read`);
}

export function markAllAsRead() {
  return axiosClient.post('/notifications/mark-all-read');
}

export default {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};