import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as adminApi from '../../api/adminApi';
import { useToast } from '../../context/ToastContext';
import { ROUTES } from '../../utils/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  ShieldAlert,
  Users,
  CheckCircle2,
  ArrowLeftRight,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  BookOpen,
} from 'lucide-react';

export function AdminDashboardPage() {
  const toast = useToast();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    setLoading(true);
    try {
      const res = await adminApi.getAnalytics();
      setAnalytics(res?.data);
    } catch (err) {
      toast.error('Failed to load admin analytics');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading platform analytics..." className="min-h-[50vh]" />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700 mb-1">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Staff Moderation & Governance</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Campus Administration Console
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Platform metrics, skill supply/demand analytics, and dispute moderation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to={ROUTES.ADMIN_REPORTS} className="btn btn-secondary btn-sm">
            <span>Disputes Queue</span>
          </Link>
          <Link to={ROUTES.ADMIN_USERS} className="btn btn-secondary btn-sm">
            <span>Manage Users</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="card p-5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Students</span>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{analytics?.totalStudents ?? 0}</div>
          <p className="mt-1 text-[11px] text-slate-400">Enrolled campus peers</p>
        </div>

        <div className="card p-5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sessions Completed</span>
          <div className="mt-2 text-2xl font-extrabold text-emerald-600">{analytics?.totalSessionsCompleted ?? 0}</div>
          <p className="mt-1 text-[11px] text-slate-400">Total learning hours</p>
        </div>

        <div className="card p-5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Swaps</span>
          <div className="mt-2 text-2xl font-extrabold text-indigo-600">{analytics?.totalActiveSwaps ?? 0}</div>
          <p className="mt-1 text-[11px] text-slate-400">Pending or in progress</p>
        </div>

        <div className="card p-5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Open Disputes</span>
          <div className="mt-2 text-2xl font-extrabold text-red-600">{analytics?.openDisputesCount ?? 0}</div>
          <p className="mt-1 text-[11px] text-slate-400">Awaiting moderation</p>
        </div>

        <div className="card p-5 col-span-2 lg:col-span-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completion Rate</span>
          <div className="mt-2 text-2xl font-extrabold text-purple-600">
            {analytics?.sessionCompletionRate ?? 100}%
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Session fulfillment</p>
        </div>
      </div>

      {/* Demand & Supply Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Demanded Skills */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Highest In-Demand Skills</h3>
          </div>

          <div className="space-y-3">
            {analytics?.topDemandedSkills?.length === 0 ? (
              <p className="text-xs text-slate-400">No skill demand data yet.</p>
            ) : (
              analytics?.topDemandedSkills?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-slate-800">{item.skillName}</span>
                    <span className="text-[11px] text-slate-500 block">
                      Supply: {item.supplyCount} mentors available
                    </span>
                  </div>
                  <span className="badge badge-indigo text-xs">
                    {item.demandCount} Learners Want
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Skill Deficits (High demand, low supply) */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900">Campus Skill Deficits</h3>
          </div>

          <div className="space-y-3">
            {analytics?.deficitSkills?.length === 0 ? (
              <p className="text-xs text-slate-400">No skill deficits detected.</p>
            ) : (
              analytics?.deficitSkills?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-slate-800">{item.skillName}</span>
                    <span className="text-[11px] text-slate-500 block">
                      Demand: {item.demandCount} &bull; Supply: {item.supplyCount}
                    </span>
                  </div>
                  <span className={`badge ${item.deficit > 0 ? 'badge-amber' : 'badge-green'} text-xs`}>
                    Deficit: {item.deficit > 0 ? `+${item.deficit}` : item.deficit}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
