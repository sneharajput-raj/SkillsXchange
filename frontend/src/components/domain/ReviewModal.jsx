import React, { useState } from 'react';
import Modal from '../common/Modal';
import RatingStars from '../common/RatingStars';
import { useToast } from '../../context/ToastContext';
import * as reviewApi from '../../api/reviewApi';
import { Star } from 'lucide-react';

const BADGE_OPTIONS = [
  'Patient Mentor',
  'Clear Explanations',
  'Great Communicator',
  'Punctual & Prepared',
  'Helpful Code Examples',
  'Highly Recommended',
];

export function ReviewModal({ isOpen, onClose, session, onSuccess }) {
  const toast = useToast();
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [selectedBadges, setSelectedBadges] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  function toggleBadge(badge) {
    setSelectedBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      toast.error('Please select a rating between 1 and 5 stars');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        rating,
        feedback: feedback.trim(),
        endorsementTags: selectedBadges.join(','),
      };

      await reviewApi.submitReview(session.id, payload);
      toast.success('Thank you! Your review has been recorded.');
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Review Tutoring Session: ${session?.skillName || 'Skill'}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Stars Input */}
        <div className="text-center py-2">
          <label className="label mb-2">Rate your peer mentor experience</label>
          <div className="flex justify-center">
            <RatingStars
              rating={rating}
              interactive={true}
              size="lg"
              onChange={(val) => setRating(val)}
            />
          </div>
          <p className="mt-1 text-xs font-semibold text-amber-600">
            {rating === 5 ? 'Exceptional!' : rating === 4 ? 'Very Good' : rating === 3 ? 'Good' : 'Needs Improvement'}
          </p>
        </div>

        {/* Written Feedback */}
        <div>
          <label className="label">Written Feedback</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
            placeholder="Share what went well and what you learned..."
            className="input"
            maxLength={1000}
          />
        </div>

        {/* Endorsement Badges */}
        <div>
          <label className="label">Endorsement Badges</label>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {BADGE_OPTIONS.map((badge) => {
              const isSelected = selectedBadges.includes(badge);
              return (
                <button
                  key={badge}
                  type="button"
                  onClick={() => toggleBadge(badge)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium border transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {badge}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={submitting}
          >
            <span>{submitting ? 'Submitting...' : 'Submit Review'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default ReviewModal;
