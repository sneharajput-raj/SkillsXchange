import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

/**
 * Centralized Axios client for the SkillSwap backend.
 *
 * - Base URL configured via VITE_API_BASE_URL env var.
 * - Request interceptor injects the Bearer JWT from localStorage.
 * - Response interceptor unwraps ApiResponse envelope on success and
 *   transparently refreshes the access token once on HTTP 401.
 *
 * Backend response envelope (ApiResponse<T>):
 *   { success: boolean, message: string, data: T, timestamp: string }
 */
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ---- Request interceptor: attach Bearer token ----
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---- Token refresh plumbing ----
let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

// ---- Response interceptor: unwrap envelope + handle 401 refresh ----
axiosClient.interceptors.response.use(
  (response) => {
    // Unwrap the ApiResponse envelope: callers receive `data` directly.
    const payload = response.data;
    if (payload && typeof payload === 'object' && 'success' in payload) {
      return payload; // { success, message, data, timestamp }
    }
    return payload;
  },
  async (error) => {
    const originalRequest = error.config;

    // Avoid intercepting the refresh-token call itself to prevent loops.
    const isRefreshCall = originalRequest?.url?.includes('/auth/refresh-token');

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshCall &&
      localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
    ) {
      if (isRefreshing) {
        // Queue subsequent requests until the refresh completes.
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        const res = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });
        const envelope = res.data;
        const newAccessToken = envelope?.data?.accessToken;
        const newRefreshToken = envelope?.data?.refreshToken;

        if (!newAccessToken) throw new Error('No access token in refresh response');

        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
        }
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return axiosClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        // Clear auth state and force redirect to login.
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?sessionExpired=true';
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    // Normalize the error payload into the ApiResponse error shape when possible.
    const errData = error.response?.data;
    const normalized = {
      success: false,
      status: error.response?.status || 0,
      message:
        errData?.message ||
        error.message ||
        'Something went wrong. Please try again.',
      data: errData?.data || null,
      fieldErrors: errData?.fieldErrors || errData?.errors || null,
    };
    return Promise.reject(normalized);
  }
);

export default axiosClient;
