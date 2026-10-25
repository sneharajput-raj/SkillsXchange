import axiosClient from './axiosClient';

/**
 * Swap API — maps to SwapRequestController (/api/v1/swaps).
 *
 * POST   /swaps                    -> CreateSwapProposalRequest -> SwapRequestDto
 * GET    /swaps/incoming           -> Page<SwapRequestDto>
 * GET    /swaps/outgoing           -> Page<SwapRequestDto>
 * POST   /swaps/{swapId}/accept    -> SwapRequestDto
 * POST   /swaps/{swapId}/reject    -> SwapRequestDto
 * POST   /swaps/{swapId}/cancel    -> SwapRequestDto
 */

export function createSwap(payload) {
  // { receiverId, offeredSkillId, requestedSkillId, proposedMode, message }
  return axiosClient.post('/swaps', payload);
}

export function getIncomingSwaps(params = {}) {
  // params: { page, size, sort }
  return axiosClient.get('/swaps/incoming', { params });
}

export function getOutgoingSwaps(params = {}) {
  return axiosClient.get('/swaps/outgoing', { params });
}

export function acceptSwap(swapId) {
  return axiosClient.post(`/swaps/${swapId}/accept`);
}

export function rejectSwap(swapId, reason = null) {
  return axiosClient.post(`/swaps/${swapId}/reject`, reason ? { reason } : {});
}

export function cancelSwap(swapId) {
  return axiosClient.post(`/swaps/${swapId}/cancel`);
}

export default {
  createSwap,
  getIncomingSwaps,
  getOutgoingSwaps,
  acceptSwap,
  rejectSwap,
  cancelSwap,
};