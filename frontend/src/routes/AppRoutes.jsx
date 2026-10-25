import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import AppLayout from '../components/layout/AppLayout';

// Public pages
import LandingPage from '../pages/public/LandingPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';
import VerifyEmailPage from '../pages/public/VerifyEmailPage';

// Student pages
import DashboardPage from '../pages/student/DashboardPage';
import DiscoverPage from '../pages/student/DiscoverPage';
import MatchesPage from '../pages/student/MatchesPage';
import StudentProfilePage from '../pages/student/StudentProfilePage';
import MySkillsPage from '../pages/student/MySkillsPage';
import AvailabilityPage from '../pages/student/AvailabilityPage';
import SwapsPage from '../pages/student/SwapsPage';
import SessionsPage from '../pages/student/SessionsPage';
import WalletPage from '../pages/student/WalletPage';
import MessagesPage from '../pages/student/MessagesPage';
import NotificationsPage from '../pages/student/NotificationsPage';
import ProfilePage from '../pages/student/ProfilePage';

// Admin pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminReportsPage from '../pages/admin/AdminReportsPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />

      {/* Protected Student Routes within AppLayout */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/students/:userId" element={<StudentProfilePage />} />
        <Route path="/my-skills" element={<MySkillsPage />} />
        <Route path="/availability" element={<AvailabilityPage />} />
        <Route path="/swaps" element={<SwapsPage />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Protected Admin Routes within AppLayout */}
      <Route
        element={
          <AdminRoute>
            <AppLayout />
          </AdminRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/reports" element={<AdminReportsPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
