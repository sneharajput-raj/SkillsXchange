import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as matchApi from '../../api/matchApi';
import { useToast } from '../../context/ToastContext';
import MatchCard from '../../components/domain/MatchCard';
import SwapRequestModal from '../../components/domain/SwapRequestModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { Sparkles, SlidersHorizontal, BookOpen, ArrowRight } from 'lucide-react';
import { ROUTES } from '../../utils/constants';

export function MatchesPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [matches, setMatches] = useState([]);
  const [minScore, setMinScore] = useState(0);
  const [loading, setLoading] = useState(true);

  // Swap modal
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(null);

  useEffect(() => {
    loadMatches();
  }, []);

  async function loadMatches() {
    setLoading(true);
    try {
      const res = await matchApi.getMatches();
      setMatches(res?.data || []);
    } catch (err) {
      toast.error('Failed to calculate compatibility matches');
    } finally {
      setLoading(false);
    }
  }

  const filteredMatches = matches.filter((m) => (m.matchScore ?? 0) >= minScore);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Deterministic 100-Point Algorithm</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Intelligent Skill Matches
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Peers whose teaching skills match your learning goals, and vice versa.
          </p>
        </div>

        {/* Filter by score */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-slate-400" />
          <select
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="input w-auto text-xs py-1.5"
          >
            <option value={0}>All Compatibility (30%+)</option>
            <option value={60}>Moderate & High (60%+)</option>
            <option value={80}>Top Matches (80%+)</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <LoadingSpinner size="lg" message="Computing reciprocal match scores..." className="min-h-[40vh]" />
      ) : filteredMatches.length === 0 ? (
        <EmptyState
          title="No compatible peers found"
          description="Try listing more skills in your profile or setting your weekly availability to unlock more matches."
          action={
            <button
              type="button"
              onClick={() => navigate(ROUTES.MY_SKILLS)}
              className="btn btn-primary btn-sm"
            >
              <BookOpen className="h-4 w-4" />
              <span>Update My Skills</span>
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMatches.map((match) => {
            const targetId = match.userId || match.candidateUserId;
            const targetName = match.fullName || match.candidateName;
            return (
              <MatchCard
                key={targetId}
                match={match}
                onViewProfile={() => navigate(`/students/${targetId}`)}
                onProposeSwap={() => {
                  setSelectedTarget({
                    userId: targetId,
                    fullName: targetName,
                  });
                  setSwapModalOpen(true);
                }}
              />
            );
          })}
        </div>
      )}

      {/* Swap modal */}
      {swapModalOpen && selectedTarget && (
        <SwapRequestModal
          isOpen={swapModalOpen}
          onClose={() => setSwapModalOpen(false)}
          targetStudent={selectedTarget}
          onSuccess={() => toast.success('Swap request submitted!')}
        />
      )}
    </div>
  );
}

export default MatchesPage;
