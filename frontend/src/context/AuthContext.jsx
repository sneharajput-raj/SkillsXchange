import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/authApi';
import { ROLE, STORAGE_KEYS } from '../utils/constants';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistSession(authData) {
  if (!authData) return;
  if (authData.accessToken) {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, authData.accessToken);
  }
  if (authData.refreshToken) {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, authData.refreshToken);
  }
  const user = {
    userId: authData.userId,
    email: authData.email,
    fullName: authData.fullName,
    role: authData.role,
    avatarUrl: authData.avatarUrl || null,
  };
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  return user;
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());
  const [loading, setLoading] = useState(true);

  const isAuthenticated = Boolean(user && localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN));
  const isAdmin = user?.role === ROLE.ADMIN;
  const isStudent = user?.role === ROLE.STUDENT;

  // Hydrate current user from /auth/me on startup if a token exists.
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    authApi
      .getCurrentUser()
      .then((res) => {
        if (cancelled) return;
        const data = res?.data;
        if (data) {
          const merged = {
            ...(readStoredUser() || {}),
            userId: data.id,
            email: data.email,
            fullName: data.fullName,
            role: data.role,
            verified: data.verified,
            active: data.active,
          };
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(merged));
          setUser(merged);
        }
      })
      .catch(() => {
        // Token invalid and refresh already failed inside the interceptor.
        if (!cancelled) {
          clearSession();
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authApi.login({ email, password });
    const userData = persistSession(res?.data);
    setUser(userData);
    return res;
  }, []);

  const register = useCallback(async (payload) => {
    // Registration does not log the user in; it returns an OTP to verify.
    return authApi.register(payload);
  }, []);

  const verifyOtp = useCallback(async (email, otpCode) => {
    const res = await authApi.verifyEmail({ email, otpCode });
    const userData = persistSession(res?.data);
    setUser(userData);
    return res;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const updateUser = useCallback((patch) => {
    setUser((prev) => {
      const next = { ...(prev || {}), ...patch };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated,
      isAdmin,
      isStudent,
      login,
      register,
      verifyOtp,
      logout,
      updateUser,
    }),
    [user, loading, isAuthenticated, isAdmin, isStudent, login, register, verifyOtp, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

export default AuthContext;