'use client';

'use client';

import { useState, useEffect } from 'react';

const mockReviews = [
  {
    id: 1,
    client_name: 'Sarah M.',
    rating: 5,
    comment:
      "Amazing hair transformation! The team at InStyle really knows what they're doing. My highlights look perfect!",
    service: 'Highlights',
    date: '2024-01-15',
    automated: true,
  },
  {
    id: 2,
    client_name: 'Lisa K.',
    rating: 5,
    comment:
      "Best hair treatment I've ever had. My hair feels so soft and healthy now. Definitely booking again!",
    service: 'Hair Treatment',
    date: '2024-01-10',
    automated: true,
  },
  {
    id: 3,
    client_name: 'Michelle R.',
    rating: 5,
    comment:
      'The bridal hair styling was absolutely perfect for my wedding day. Thank you InStyle team! ✨',
    service: 'Bridal Hair',
    date: '2024-01-08',
    automated: true,
  },
];

export default function AutomatedReviews() {
  const [reviews, setReviews] = useState([]);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    setReviews(mockReviews);

    if (typeof window !== 'undefined') {
      // Simulate automated review prompt after service
      const timer = setTimeout(() => {
        setShowReviewPrompt(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const StarRating = ({ rating, onRatingChange, readonly = false }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onRatingChange && onRatingChange(star)}
            className={`text-2xl ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            } ${!readonly && 'hover:text-yellow-400 cursor-pointer'}`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  const handleSubmitReview = async () => {
    if (rating === 0) return;

    const newReview = {
      id: reviews.length + 1,
      client_name: 'Recent Client',
      rating,
      comment: reviewText,
      service: 'Recent Service',
      date: new Date().toISOString().split('T')[0],
      automated: true,
    };

    setReviews([newReview, ...reviews]);
    setShowReviewPrompt(false);
    setRating(0);
    setReviewText('');

    // Simulate automated follow-up
    if (typeof window !== 'undefined') {
      if (rating >= 4) {
        // High rating - encourage to post on Google/Facebook
        setTimeout(() => {
          alert(
            'Thank you for the great review! Would you mind sharing your experience on Google or Facebook to help other clients find us?',
          );
        }, 1000);
      } else if (rating <= 2) {
        // Low rating - direct to management
        setTimeout(() => {
          alert(
            "We're sorry your experience wasn't perfect. Our manager will contact you within 24 hours to make this right.",
          );
        }, 1000);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Automated Review Prompt */}
      {showReviewPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              How was your experience?
            </h3>
            <p className="text-gray-600 mb-4">
              We'd love to hear about your visit to InStyle Hair Boutique!
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating
              </label>
              <StarRating rating={rating} onRatingChange={setRating} />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tell us more (optional)
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Share your experience with us..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowReviewPrompt(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Skip
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={rating === 0}
                className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Display */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Client Reviews
        </h2>

        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-200 pb-4 last:border-b-0"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {review.client_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {review.service} • {review.date}
                  </p>
                </div>
                <StarRating rating={review.rating} readonly />
              </div>
              <p className="text-gray-700">{review.comment}</p>
              {review.automated && (
                <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Automated Collection
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">
            Automated Review Management
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Automatic SMS follow-up 2 hours after service</li>
            <li>• High ratings (4-5 stars) encouraged to post publicly</li>
            <li>
              • Low ratings (1-2 stars) directed to management for resolution
            </li>
            <li>• Review reminders sent if no response within 48 hours</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
