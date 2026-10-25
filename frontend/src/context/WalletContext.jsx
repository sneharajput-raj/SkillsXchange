import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import * as walletApi from '../api/walletApi';

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshBalance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await walletApi.getWalletSummary();
      setSummary(res?.data || null);
      return res?.data;
    } catch (err) {
      setError(err?.message || 'Failed to load wallet');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      summary,
      loading,
      error,
      refreshBalance,
      availableCredits: summary?.balance ?? null,
      escrowCredits: summary?.escrowBalance ?? null,
    }),
    [summary, loading, error, refreshBalance]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within a WalletProvider');
  return ctx;
}

export default WalletContext;