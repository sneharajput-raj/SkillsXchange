import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as notificationApi from '../../api/notificationApi';
import { useToast } from '../../context/ToastContext';
import { timeAgo } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import {
  Bell,
  CheckCheck,
  ArrowRight,
  Clock,
  Sparkles,
  ArrowLeftRight,
  Coins,
  MessageSquare,
} from 'lucide-react';

export function NotificationsPage() {
  const toast = useToast();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    setLoading(true);
    try {
      const res = await notificationApi.getNotifications({ page: 0, size: 30 });
      setNotifications(res?.data?.content || []);
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAllAsRead() {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  }

  async function handleClickNotification(notif) {
    if (!notif.read) {
      try {
        await notificationApi.markAsRead(notif.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
        );
      } catch {
        // non-blocking
      }
    }

    if (notif.actionUrl) {
      navigate(notif.actionUrl);
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Notifications</h1>
          <p className="mt-1 text-xs text-slate-500">
            Real-time activity alerts on swap requests, sessions, and credit settlements.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            className="btn btn-secondary btn-sm"
          >
            <CheckCheck className="h-4 w-4" />
            <span>Mark All Read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      {loading ? (
        <LoadingSpinner size="lg" message="Loading notifications..." className="min-h-[40vh]" />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications yet"
          description="When other students send swap proposals or schedule sessions, alerts will appear here."
        />
      ) : (
        <div className="card divide-y divide-slate-100 overflow-hidden">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleClickNotification(notif)}
              className={`p-4 flex items-start gap-3.5 cursor-pointer transition-colors ${
                notif.read ? 'bg-white hover:bg-slate-50' : 'bg-indigo-50/50 hover:bg-indigo-50/80'
              }`}
            >
              <div className="mt-0.5">
                {!notif.read ? (
                  <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-600 ring-4 ring-indigo-100" />
                ) : (
                  <span className="flex h-2 w-2 rounded-full bg-slate-300" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-xs ${notif.read ? 'font-medium text-slate-800' : 'font-bold text-slate-900'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {timeAgo(notif.createdAt)}
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  {notif.message}
                </p>
              </div>

              {notif.actionUrl && (
                <ArrowRight className="h-4 w-4 text-slate-400 shrink-0 self-center" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;
