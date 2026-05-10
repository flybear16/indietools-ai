'use client';

import { Star } from 'lucide-react';
import { Review } from '@/lib/db/schema';

interface ReviewCardProps {
  review: Review & { user: { name: string | null; avatarUrl: string | null } };
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-4 w-4 ${n <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted'}`}
        />
      ))}
    </div>
  );
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
            {review.user.name?.charAt(0).toUpperCase() ?? '?'}
          </div>
          <div>
            <p className="font-medium text-sm">{review.user.name ?? 'Anonymous'}</p>
            {review.useCase && (
              <p className="text-xs text-muted-foreground">{review.useCase}</p>
            )}
          </div>
        </div>
        <StarRating rating={review.rating} />
      </div>
      {review.reviewText && (
        <p className="text-sm text-muted-foreground">{review.reviewText}</p>
      )}
      {review.wouldRecommend !== null && review.wouldRecommend !== undefined && (
        <p className="text-xs text-muted-foreground">
          {review.wouldRecommend ? '✓ Would recommend' : '✗ Would not recommend'}
        </p>
      )}
    </div>
  );
}

interface ReviewSummaryProps {
  average: number;
  count: number;
}

export function ReviewSummary({ average, count }: ReviewSummaryProps) {
  if (count === 0) return null;
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        <span className="font-bold text-lg">{average.toFixed(1)}</span>
      </div>
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <StarRating rating={Math.round(average)} />
        <span>({count} {count === 1 ? 'review' : 'reviews'})</span>
      </div>
    </div>
  );
}
