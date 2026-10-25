import axiosClient from './axiosClient';

/**
 * Auth API — maps to AuthController (/api/v1/auth).
 *
 * POST /auth/register         -> RegisterRequest -> { email, message, mockVerificationCode }
 * POST /auth/verify-email     -> VerifyEmailRequest -> AuthResponse
 * POST /auth/login            -> LoginRequest -> AuthResponse
 * POST /auth/refresh-token    -> RefreshTokenRequest -> AuthResponse
 * GET  /auth/me               -> { id, email, fullName, role, verified, active }
 */

export function register(payload) {
  // payload: { fullName, email, password, departmentId, graduationYear }
  return axiosClient.post('/auth/register', payload);
}

export function verifyEmail(payload) {
  // payload: { email, otpCode }
  return axiosClient.post('/auth/verify-email', payload);
}

export function login(payload) {
  // payload: { email, password }
  return axiosClient.post('/auth/login', payload);
}

export function refreshToken(token) {
  return axiosClient.post('/auth/refresh-token', { refreshToken: token });
}

export function getCurrentUser() {
  return axiosClient.get('/auth/me');
}

export default {
  register,
  verifyEmail,
  login,
  refreshToken,
  getCurrentUser,
};
