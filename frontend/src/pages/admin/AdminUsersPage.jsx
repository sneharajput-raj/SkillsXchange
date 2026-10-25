import React, { useState, useEffect } from 'react';
import * as profileApi from '../../api/profileApi';
import * as adminApi from '../../api/adminApi';
import { useToast } from '../../context/ToastContext';
import { getInitials } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Users, ShieldCheck, ShieldAlert, Search } from 'lucide-react';

export function AdminUsersPage() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, [search]);

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await profileApi.searchStudents({ query: search || undefined, size: 50 });
      setUsers(res?.data?.content || []);
    } catch (err) {
      toast.error('Failed to load user directory');
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleStatus(user, currentActive) {
    const action = currentActive ? 'suspend' : 'activate';
    const reason = window.prompt(`Please enter reason to ${action} ${user.fullName}:`);
    if (reason === null) return;

    try {
      await adminApi.updateUserStatus(user.userId, {
        active: !currentActive,
        reason: reason || `Admin action: ${action}`,
      });
      toast.success(`User successfully ${action}d`);
      loadUsers();
    } catch (err) {
      toast.error(err.message || `Failed to ${action} user`);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Student Account Moderation</h1>
        <p className="mt-1 text-xs text-slate-500">
          Manage campus student accounts, review compliance, and handle suspension actions.
        </p>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students by name or department..."
            className="input pl-9"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="card p-6">
        {loading ? (
          <LoadingSpinner size="md" message="Loading users..." />
        ) : users.length === 0 ? (
          <p className="py-8 text-center text-xs text-slate-400">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Completed Sessions</th>
                  <th className="py-3 px-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((student) => (
                  <tr key={student.userId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {student.avatarUrl ? (
                          <img
                            src={student.avatarUrl}
                            alt={student.fullName}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                            {getInitials(student.fullName)}
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-slate-900 block">{student.fullName}</span>
                          <span className="text-[11px] text-slate-500">{student.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {student.departmentName || 'General'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">
                        {student.averageRating ? student.averageRating.toFixed(1) : '5.0'} ★
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {student.totalSessionsCompleted || 0} sessions
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(student, true)}
                        className="btn btn-secondary btn-sm text-red-600 hover:bg-red-50"
                      >
                        Suspend User
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsersPage;
