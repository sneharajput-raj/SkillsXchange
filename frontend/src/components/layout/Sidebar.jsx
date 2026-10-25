import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../utils/constants';
import {
  LayoutDashboard,
  Compass,
  Sparkles,
  BookOpen,
  Calendar,
  ArrowLeftRight,
  Clock,
  MessageSquare,
  Coins,
  ShieldAlert,
  User,
  X,
} from 'lucide-react';

export function Sidebar({ isOpen, onClose }) {
  const { isAdmin } = useAuth();

  const links = [
    { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { to: ROUTES.DISCOVER, label: 'Discover Peers', icon: Compass },
    { to: ROUTES.MATCHES, label: 'Skill Matches', icon: Sparkles, badge: 'Smart' },
    { to: ROUTES.MY_SKILLS, label: 'My Skills', icon: BookOpen },
    { to: ROUTES.AVAILABILITY, label: 'Weekly Schedule', icon: Calendar },
    { to: ROUTES.SWAPS, label: 'Swap Requests', icon: ArrowLeftRight },
    { to: ROUTES.SESSIONS, label: 'Sessions', icon: Clock },
    { to: ROUTES.MESSAGES, label: 'Messages', icon: MessageSquare },
    { to: ROUTES.WALLET, label: 'Credit Wallet', icon: Coins },
    { to: ROUTES.PROFILE, label: 'My Profile', icon: User },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between p-4 lg:hidden border-b border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Navigation</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Student Exchange
          </div>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 font-semibold text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="rounded-full bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          {isAdmin && (
            <div className="pt-4 mt-4 border-t border-slate-100">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-purple-500">
                Administration
              </div>
              <NavLink
                to={ROUTES.ADMIN_DASHBOARD}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-purple-50 font-semibold text-purple-700'
                      : 'text-purple-600 hover:bg-purple-50/60'
                  }`
                }
              >
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>Admin Console</span>
              </NavLink>
            </div>
          )}
        </nav>

        {/* Bottom widget */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-violet-50/70 p-3 text-center">
            <p className="text-xs font-bold text-indigo-900">Need Credits?</p>
            <p className="mt-0.5 text-[11px] text-indigo-700">
              Teach a skill to a peer student to earn +1 credit per hour!
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
