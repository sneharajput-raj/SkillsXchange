import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWallet } from '../../context/WalletContext';
import * as notificationApi from '../../api/notificationApi';
import { ROUTES } from '../../utils/constants';
import { ThemeToggle } from './ThemeToggle';
import { getInitials } from '../../utils/formatters';
import {
  Bell,
  Coins,
  LogOut,
  User,
  ShieldAlert,
  ChevronDown,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

export function Navbar({ onToggleSidebar }) {
  const { user, logout, isAdmin } = useAuth();
  const { availableCredits, escrowCredits, refreshBalance } = useWallet();
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    refreshBalance();
    loadUnread();
    const interval = setInterval(loadUnread, 15000);
    return () => clearInterval(interval);
  }, []);

  async function loadUnread() {
    try {
      const res = await notificationApi.getUnreadCount();
      setUnreadCount(res?.data?.unreadCount || 0);
    } catch {
      // Ignore background poll errors
    }
  }

  function handleLogout() {
    logout();
    navigate(ROUTES.LOGIN);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile sidebar toggle + Brand logo */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
              aria-label="Toggle navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <ThemeToggle />

          <Link to={ROUTES.DASHBOARD} className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#14b8a6]/10 text-[#0d9488] shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-[#0d9488] transition-colors">
                SkillSwap
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Wallet Badge + Notifications + User Menu */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Skill Credit Wallet Badge */}
          <Link
            to={ROUTES.WALLET}
            className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50/80 px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100 transition-colors shadow-sm"
            title="Skill Credit Balance"
          >
            <Coins className="h-4 w-4 text-amber-600" />
            <span>{availableCredits ?? 0} Credits</span>
            {escrowCredits > 0 && (
              <span className="hidden sm:inline-block text-[10px] text-amber-700 bg-amber-200/60 px-1.5 py-0.2 rounded-full">
                ({escrowCredits} escrow)
              </span>
            )}
          </Link>

          {/* Notifications Icon */}
          <Link
            to={ROUTES.NOTIFICATIONS}
            className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-full p-1 text-slate-700 hover:bg-slate-100 focus:outline-none transition-colors"
              aria-expanded={dropdownOpen}
            >
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName || 'User'}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-[#ccfbf1]/50"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#14b8a6]/10 text-[#0d9488] text-xs font-bold shadow-sm">
                  {getInitials(user?.fullName || 'User')}
                </div>
              )}
              <span className="hidden md:inline-block text-xs font-medium text-slate-700 max-w-[120px] truncate">
                {user?.fullName || 'Member'}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="border-b border-slate-100 px-4 py-2.5">
                    <p className="text-xs font-bold text-slate-900 truncate">{user?.fullName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    {isAdmin && (
                      <span className="mt-1 inline-block rounded bg-[#f0fdfa] px-1.5 py-0.5 text-[10px] font-semibold text-[#0f766e]">
                        Admin
                      </span>
                    )}
                  </div>

                  <Link
                    to={ROUTES.PROFILE}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <User className="h-4 w-4 text-slate-400" />
                    My Profile
                  </Link>

                  {isAdmin && (
                    <Link
                      to={ROUTES.ADMIN_DASHBOARD}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#0d9488] hover:bg-[#f0fdfa] transition-colors"
                  >
                    <ShieldAlert className="h-4 w-4 text-[#0d9488]" />
                    Admin Console
                    </Link>
                  )}

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4 text-red-500" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
