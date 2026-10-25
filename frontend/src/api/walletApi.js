import axiosClient from './axiosClient';

/**
 * Wallet API — maps to WalletController (/api/v1/wallet).
 *
 * GET /wallet              -> WalletSummaryDto
 * GET /wallet/transactions -> Page<TransactionDto>
 */

export function getWalletSummary() {
  return axiosClient.get('/wallet');
}

export function getTransactions(params = {}) {
  return axiosClient.get('/wallet/transactions', { params });
}

export default {
  getWalletSummary,
  getTransactions,
};