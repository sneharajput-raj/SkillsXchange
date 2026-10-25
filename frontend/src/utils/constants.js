// Centralized application constants, enums, and reference data.
// Enum values mirror the Java enums in backend/src/main/java/com/skillswap/entity/.

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'SkillSwap';

// LocalStorage keys (kept consistent with the architecture spec)
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'skillswap_access_token',
  REFRESH_TOKEN: 'skillswap_refresh_token',
  USER: 'skillswap_user',
};

// ---- Enums (must match backend entity enums exactly) ----
export const ROLE = {
  STUDENT: 'ROLE_STUDENT',
  ADMIN: 'ROLE_ADMIN',
};

export const LEARNING_MODE = {
  IN_PERSON: 'IN_PERSON',
  ONLINE: 'ONLINE',
  HYBRID: 'HYBRID',
};

export const PROFICIENCY_LEVEL = {
  BEGINNER: 'BEGINNER',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED',
  EXPERT: 'EXPERT',
};

export const PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
};

export const SWAP_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
};

export const SESSION_STATUS = {
  SCHEDULED: 'SCHEDULED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW',
  DISPUTED: 'DISPUTED',
};

export const TRANSACTION_TYPE = {
  SIGNUP_BONUS: 'SIGNUP_BONUS',
  SESSION_EARNING: 'SESSION_EARNING',
  SESSION_SPEND: 'SESSION_SPEND',
  ESCROW_HOLD: 'ESCROW_HOLD',
  ESCROW_REFUND: 'ESCROW_REFUND',
  ADMIN_ADJUSTMENT: 'ADMIN_ADJUSTMENT',
};

export const REPORT_CATEGORY = {
  NO_SHOW: 'NO_SHOW',
  INAPPROPRIATE_BEHAVIOR: 'INAPPROPRIATE_BEHAVIOR',
  SKILL_MISREPRESENTATION: 'SKILL_MISREPRESENTATION',
  PAYMENT_DISPUTE: 'PAYMENT_DISPUTE',
  HARASSMENT: 'HARASSMENT',
  OTHER: 'OTHER',
};

export const REPORT_STATUS = {
  OPEN: 'OPEN',
  RESOLVED: 'RESOLVED',
  DISMISSED: 'DISMISSED',
};

export const DAYS_OF_WEEK = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];

// ---- Display helpers for enums ----
export const LEARNING_MODE_LABELS = {
  IN_PERSON: 'In Person',
  ONLINE: 'Online',
  HYBRID: 'Hybrid',
};

export const PROFICIENCY_LABELS = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
  EXPERT: 'Expert',
};

export const PRIORITY_LABELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

export const SWAP_STATUS_LABELS = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
  EXPIRED: 'Expired',
};

export const SESSION_STATUS_LABELS = {
  SCHEDULED: 'Scheduled',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'No Show',
  DISPUTED: 'Disputed',
};

export const TRANSACTION_TYPE_LABELS = {
  SIGNUP_BONUS: 'Signup Bonus',
  SESSION_EARNING: 'Session Earning',
  SESSION_SPEND: 'Session Spend',
  ESCROW_HOLD: 'Escrow Hold',
  ESCROW_REFUND: 'Escrow Refund',
  ADMIN_ADJUSTMENT: 'Admin Adjustment',
};

export const REPORT_CATEGORY_LABELS = {
  NO_SHOW: 'No-Show',
  INAPPROPRIATE_BEHAVIOR: 'Inappropriate Behavior',
  SKILL_MISREPRESENTATION: 'Skill Misrepresentation',
  PAYMENT_DISPUTE: 'Payment Dispute',
  HARASSMENT: 'Harassment',
  OTHER: 'Other',
};

export const DAY_LABELS = {
  MONDAY: 'Mon',
  TUESDAY: 'Tue',
  WEDNESDAY: 'Wed',
  THURSDAY: 'Thu',
  FRIDAY: 'Fri',
  SATURDAY: 'Sat',
  SUNDAY: 'Sun',
};

// ---- Reference data ----
// NOTE: The backend has NO /api/v1/departments endpoint. These IDs match the
// seed data in DataInitializer.java (seedDepartments). Documented as a gap.
export const DEPARTMENTS = [
  { id: 1, code: 'CSE', name: 'Computer Science & Engineering' },
  { id: 2, code: 'ECE', name: 'Electronics & Communication Engineering' },
  { id: 3, code: 'MECH', name: 'Mechanical Engineering' },
  { id: 4, code: 'MBA', name: 'School of Management' },
  { id: 5, code: 'DES', name: 'Department of Design & Arts' },
];

// Route paths
export const ROUTES = {
  LANDING: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
  DASHBOARD: '/dashboard',
  DISCOVER: '/discover',
  MATCHES: '/matches',
  PROFILE: '/profile',
  STUDENT_PROFILE: '/students/:userId',
  MY_SKILLS: '/my-skills',
  AVAILABILITY: '/availability',
  SWAPS: '/swaps',
  SESSIONS: '/sessions',
  WALLET: '/wallet',
  MESSAGES: '/messages',
  NOTIFICATIONS: '/notifications',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_AUDIT: '/admin/audit',
};

export const DEFAULT_PAGE_SIZE = 10;
