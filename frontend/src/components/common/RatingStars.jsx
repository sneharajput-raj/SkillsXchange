import React from 'react';
import { Star } from 'lucide-react';

export function RatingStars({ rating = 0, max = 5, size = 'sm', interactive = false, onChange = null }) {
  const sizeClasses = {
    xs: 'h-3.5 w-3.5',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }[size] || 'h-4 w-4';

  const stars = [];
  const roundedRating = Math.round(Number(rating) * 2) / 2;

  for (let i = 1; i <= max; i++) {
    const isFilled = i <= roundedRating;
    const isHalf = i - 0.5 === roundedRating;

    stars.push(
      <button
        key={i}
        type={interactive ? 'button' : undefined}
        disabled={!interactive}
        onClick={interactive && onChange ? () => onChange(i) : undefined}
        className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} p-0.5 focus:outline-none`}
        aria-label={`${i} stars`}
      >
        <Star
          className={`${sizeClasses} ${
            isFilled
              ? 'fill-amber-400 text-amber-400'
              : isHalf
              ? 'fill-amber-200 text-amber-400'
              : 'text-slate-300'
          }`}
        />
      </button>
    );
  }

  return <div className="inline-flex items-center gap-0.5">{stars}</div>;
}

export default RatingStars;
