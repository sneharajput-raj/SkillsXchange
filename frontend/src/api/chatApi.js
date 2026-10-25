import axiosClient from './axiosClient';

/**
 * Chat API — maps to ChatController (/api/v1/chat).
 *
 * GET  /chat/conversations                              -> List<ConversationDto>
 * POST /chat/conversations                              -> { partnerId, swapRequestId? } -> ConversationDto
 * GET  /chat/conversations/{conversationId}/messages    -> Page<MessageDto>
 * POST /chat/conversations/{conversationId}/messages    -> SendMessageRequest -> MessageDto
 */

export function getConversations() {
  return axiosClient.get('/chat/conversations');
}

export function getOrCreateConversation(partnerId, swapRequestId = null) {
  const body = { partnerId };
  if (swapRequestId != null) body.swapRequestId = swapRequestId;
  return axiosClient.post('/chat/conversations', body);
}

export function getMessages(conversationId, params = {}) {
  return axiosClient.get(`/chat/conversations/${conversationId}/messages`, { params });
}

export function sendMessage(conversationId, content) {
  return axiosClient.post(`/chat/conversations/${conversationId}/messages`, { content });
}

export default {
  getConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage,
};