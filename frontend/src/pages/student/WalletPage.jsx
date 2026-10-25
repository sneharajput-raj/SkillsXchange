import React, { useState, useEffect } from 'react';
import * as walletApi from '../../api/walletApi';
import { useWallet } from '../../context/WalletContext';
import { useToast } from '../../context/ToastContext';
import { formatDate, formatDateTime } from '../../utils/formatters';
import {
  TRANSACTION_TYPE,
  TRANSACTION_TYPE_LABELS,
} from '../../utils/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Coins,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export function WalletPage() {
  const { summary, refreshBalance } = useWallet();
  const toast = useToast();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWalletData();
  }, []);

  async function loadWalletData() {
    setLoading(true);
    try {
      await refreshBalance();
      const res = await walletApi.getTransactions({ page: 0, size: 20 });
      setTransactions(res?.data?.content || []);
    } catch (err) {
      toast.error('Failed to load wallet ledger');
    } finally {
      setLoading(false);
    }
  }

  const transactionTypeBadges = {
    [TRANSACTION_TYPE.SIGNUP_BONUS]: 'badge-green',
    [TRANSACTION_TYPE.SESSION_EARNING]: 'badge-green',
    [TRANSACTION_TYPE.SESSION_SPEND]: 'badge-slate',
    [TRANSACTION_TYPE.ESCROW_HOLD]: 'badge-blue',
    [TRANSACTION_TYPE.ESCROW_REFUND]: 'badge-amber',
    [TRANSACTION_TYPE.ADMIN_ADJUSTMENT]: 'badge-purple',
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Skill Credit Wallet</h1>
        <p className="mt-1 text-xs text-slate-500">
          Double-entry ledger currency powering peer tutoring sessions across campus.
        </p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Balance */}
        <div className="card p-5 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white border-amber-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Available Balance</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm shadow-amber-200">
              <Coins className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-900">{summary?.balance ?? 0}</span>
            <span className="text-xs font-semibold text-amber-700">Credits</span>
          </div>
          <p className="mt-1 text-[11px] text-amber-600">Ready to book study sessions</p>
        </div>

        {/* Escrow Balance */}
        <div className="card p-5 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-white border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Locked in Escrow</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500 text-white shadow-sm shadow-blue-200">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-900">{summary?.escrowBalance ?? 0}</span>
            <span className="text-xs font-semibold text-blue-700">Credits</span>
          </div>
          <p className="mt-1 text-[11px] text-blue-600">Held for scheduled sessions</p>
        </div>

        {/* Lifetime Earned */}
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lifetime Earned</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <ArrowDownLeft className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{summary?.lifetimeEarned ?? 0}</span>
            <span className="text-xs font-semibold text-slate-400">Credits</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Earned from mentoring peers</p>
        </div>

        {/* Lifetime Spent */}
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lifetime Spent</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{summary?.lifetimeSpent ?? 0}</span>
            <span className="text-xs font-semibold text-slate-400">Credits</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Invested in learning sessions</p>
        </div>
      </div>

      {/* Credit Economics Explainer */}
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shrink-0 mt-0.5">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-indigo-950">How the Skill Credit System Works</h3>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-indigo-900">
              <div>
                <strong className="block text-indigo-950 mb-0.5">1. Welcome Grant (+3)</strong>
                Every verified student starts with 3 credits to explore and learn immediately without teaching first.
              </div>
              <div>
                <strong className="block text-indigo-950 mb-0.5">2. Secure Escrow Hold</strong>
                Booking a session locks 1 credit in escrow. If the mentor cancels, your credit is immediately refunded.
              </div>
              <div>
                <strong className="block text-indigo-950 mb-0.5">3. Verification Release</strong>
                Completing a tutoring session via mutual OTP transfers the 1 escrow credit directly to the mentor.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History Ledger */}
      <div className="card p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4">Transaction Ledger History</h3>

        {loading ? (
          <LoadingSpinner size="md" message="Loading transaction logs..." />
        ) : transactions.length === 0 ? (
          <p className="py-8 text-center text-xs text-slate-400">
            No transactions recorded yet in your wallet ledger.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((txn) => {
                  const isPositive = txn.amount > 0;
                  return (
                    <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {formatDateTime(txn.createdAt)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`badge ${transactionTypeBadges[txn.type] || 'badge-slate'} text-[10px]`}>
                          {TRANSACTION_TYPE_LABELS[txn.type] || txn.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {txn.description}
                      </td>
                      <td className="py-3 px-4 text-right font-bold whitespace-nowrap">
                        <span className={isPositive ? 'text-emerald-600' : 'text-slate-600'}>
                          {isPositive ? `+${txn.amount}` : txn.amount} Credits
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-500 font-mono whitespace-nowrap">
                        {txn.balanceAfter}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default WalletPage;
