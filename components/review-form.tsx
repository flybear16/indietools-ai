'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ReviewFormProps {
  toolId: string;
}

export function ReviewForm({ toolId }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [useCase, setUseCase] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId, rating, name, reviewText, useCase, wouldRecommend }),
      });
      if (res.ok) {
        setSubmitted(true);
        router.refresh();
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <p className="font-medium text-green-700">Thanks for your review!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border p-6 space-y-4">
      <h3 className="font-semibold">Write a Review</h3>

      {/* Star Rating */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Rating *</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              className="p-1 hover:scale-110 transition-transform"
            >
              <Star
                className={`h-6 w-6 ${n <= (hover || rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted'}`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Your name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      {/* Use Case */}
      <div className="space-y-1">
        <label className="text-sm font-medium">What did you use it for?</label>
        <input
          type="text"
          value={useCase}
          onChange={(e) => setUseCase(e.target.value)}
          placeholder="e.g. Building my SaaS landing page"
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      {/* Review Text */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Your review</label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={3}
          placeholder="Share your experience..."
          className="w-full rounded-md border px-3 py-2 text-sm resize-none"
        />
      </div>

      {/* Would Recommend */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Would you recommend it?</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              name="recommend"
              checked={wouldRecommend === true}
              onChange={() => setWouldRecommend(true)}
              className="accent-primary"
            />
            Yes
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              name="recommend"
              checked={wouldRecommend === false}
              onChange={() => setWouldRecommend(false)}
              className="accent-primary"
            />
            No
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={rating === 0 || submitting}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
