import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as profileApi from '../../api/profileApi';
import * as skillApi from '../../api/skillApi';
import { useDebounce } from '../../hooks/useDebounce';
import { useToast } from '../../context/ToastContext';
import { getInitials } from '../../utils/formatters';
import RatingStars from '../../components/common/RatingStars';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import SwapRequestModal from '../../components/domain/SwapRequestModal';
import { Search, Filter, BookOpen, GraduationCap, ArrowRight, Sparkles, User } from 'lucide-react';

export function DiscoverPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [students, setStudents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  // Swap modal
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const debouncedSearch = useDebounce(search, 350);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    searchDirectory();
  }, [debouncedSearch, selectedCategory]);

  async function loadCategories() {
    try {
      const res = await skillApi.getCategories();
      setCategories(res?.data || []);
    } catch {
      // Non-blocking
    }
  }

  async function searchDirectory() {
    setLoading(true);
    try {
      const params = {};
      if (debouncedSearch.trim()) params.query = debouncedSearch.trim();
      if (selectedCategory) params.categoryId = Number(selectedCategory);

      const res = await profileApi.searchStudents(params);
      setStudents(res?.data?.content || []);
    } catch (err) {
      setStudents([]);
      toast.error('Failed to search student directory');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Discover Peers</h1>
        <p className="mt-1 text-xs text-slate-500">
          Search peers by name, skill, or subject to find compatible mentors and study partners.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="card p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name or skills (e.g. Java, Python, UI/UX)..."
            className="input pl-9"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input"
          >
            <option value="">All Skill Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Directory Grid */}
      {loading ? (
        <LoadingSpinner size="lg" message="Searching campus directory..." className="min-h-[40vh]" />
      ) : students.length === 0 ? (
        <EmptyState
          title="No students matched your search"
          description="Try broadening your keyword query or resetting category filters."
          action={
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedCategory('');
              }}
              className="btn btn-secondary btn-sm"
            >
              Reset Filters
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {students.map((student) => (
            <div key={student.userId || student.id} className="card p-5 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {student.avatarUrl ? (
                      <img
                        src={student.avatarUrl}
                        alt={student.fullName}
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-indigo-50"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white shadow-sm">
                        {getInitials(student.fullName)}
                      </div>
                    )}
                    <div>
                      <h4
                        className="text-sm font-bold text-slate-900 hover:text-indigo-600 cursor-pointer"
                        onClick={() => navigate(`/students/${student.userId}`)}
                      >
                        {student.fullName}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {student.departmentName || 'Student'} &bull; Year {student.graduationYear ? 2028 - student.graduationYear : 3}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                  <RatingStars rating={student.averageRating ?? 5.0} size="xs" />
                  <span className="font-semibold text-slate-700">
                    {student.averageRating ? student.averageRating.toFixed(1) : '5.0'}
                  </span>
                  <span>({student.totalReviewsCount ?? 0} reviews &bull; {student.totalSessionsCompleted ?? 0} sessions)</span>
                </div>

                {/* Skills Teaches */}
                <div className="mt-4">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Can Teach:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {student.teachSkills && student.teachSkills.length > 0 ? (
                      student.teachSkills.map((s, idx) => (
                        <span key={idx} className="badge badge-green text-[11px]">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">None listed</span>
                    )}
                  </div>
                </div>

                {/* Skills Wants to Learn */}
                <div className="mt-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Wants to Learn:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {student.learnSkills && student.learnSkills.length > 0 ? (
                      student.learnSkills.map((s, idx) => (
                        <span key={idx} className="badge badge-indigo text-[11px]">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">None listed</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/students/${student.userId}`)}
                  className="text-xs font-semibold text-slate-600 hover:text-indigo-600"
                >
                  View Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStudent(student);
                    setSwapModalOpen(true);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  <span>Propose Swap</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Propose Swap Modal */}
      {swapModalOpen && selectedStudent && (
        <SwapRequestModal
          isOpen={swapModalOpen}
          onClose={() => setSwapModalOpen(false)}
          targetStudent={selectedStudent}
          onSuccess={() => toast.success('Swap request submitted!')}
        />
      )}
    </div>
  );
}

export default DiscoverPage;
