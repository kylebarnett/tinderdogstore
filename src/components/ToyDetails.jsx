import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import { getReviewsForToy, addReview, getUserReviewForToy } from '../utils/storage';

function StarRating({ rating, onRate, interactive = false, size = 'medium' }) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    small: 'text-base',
    medium: 'text-xl',
    large: 'text-2xl'
  };

  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const filled = interactive ? (hoverRating || rating) >= i : rating >= i;
    const halfFilled = !filled && rating >= i - 0.5;

    stars.push(
      <span
        key={i}
        className={`${sizeClasses[size]} transition-all ${
          filled || halfFilled ? 'text-amber-400' : 'text-gray-300'
        } ${interactive ? 'cursor-pointer hover:scale-125' : ''}`}
        onClick={() => interactive && onRate && onRate(i)}
        onMouseEnter={() => interactive && setHoverRating(i)}
        onMouseLeave={() => interactive && setHoverRating(0)}
      >
        {filled || halfFilled ? '★' : '☆'}
      </span>
    );
  }

  return <span className="inline-flex gap-0.5">{stars}</span>;
}

export function ToyDetails({ toy, onClose }) {
  const { user, isLoggedIn } = useUser();
  const { addToCart } = useCart();
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const toyReviews = getReviewsForToy(toy.id);
    setReviews(toyReviews);

    if (isLoggedIn && user) {
      const existingReview = getUserReviewForToy(toy.id, user.username);
      setUserReview(existingReview);
    }
  }, [toy.id, isLoggedIn, user]);

  const handleSubmitReview = () => {
    if (!newRating) {
      alert('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    const review = addReview(toy.id, user.username, newRating, newComment);
    setReviews([review, ...reviews]);
    setUserReview(review);
    setShowReviewForm(false);
    setNewRating(0);
    setNewComment('');
    setIsSubmitting(false);
  };

  const handleAddToCart = () => {
    addToCart(toy);
    onClose();
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : toy.rating;

  const totalReviews = reviews.length + toy.reviewCount;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[400] p-5 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 w-9 h-9 border-none bg-white/90 rounded-full text-2xl cursor-pointer flex items-center justify-center text-gray-500 transition-colors z-10 shadow-md hover:bg-white"
          onClick={onClose}
        >
          ×
        </button>

        <div
          className="w-full h-64 bg-cover bg-center bg-gray-100 rounded-t-2xl"
          style={{ backgroundImage: `url(${toy.image})` }}
        />

        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h2 className="m-0 text-gray-800 text-2xl font-bold">{toy.name}</h2>
            <p className="m-0 text-2xl font-bold text-purple-600">${toy.price.toFixed(2)}</p>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <StarRating rating={averageRating} />
            <span className="text-gray-500 text-sm">
              {averageRating.toFixed(1)} ({totalReviews} reviews)
            </span>
          </div>

          <p className="text-gray-600 leading-relaxed mb-5">
            {toy.fullDescription || toy.description}
          </p>

          <button
            className="w-full py-3.5 border-none rounded-xl bg-green-500 text-white text-base font-semibold cursor-pointer transition-colors mb-6 hover:bg-green-600"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>

          <div className="border-t border-gray-200 pt-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="m-0 text-gray-800 text-lg font-bold">Reviews</h3>
              {isLoggedIn && !userReview && !showReviewForm && (
                <button
                  className="py-2 px-4 border-2 border-purple-600 rounded-lg bg-transparent text-purple-600 font-semibold text-sm cursor-pointer transition-all hover:bg-purple-600 hover:text-white"
                  onClick={() => setShowReviewForm(true)}
                >
                  Write a Review
                </button>
              )}
            </div>

            {!isLoggedIn && (
              <p className="text-gray-500 italic text-center py-5">
                Sign in to leave a review
              </p>
            )}

            {showReviewForm && (
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="mb-3">
                  <label className="block mb-1.5 text-gray-700 font-medium text-sm">Your Rating</label>
                  <StarRating
                    rating={newRating}
                    onRate={setNewRating}
                    interactive={true}
                    size="large"
                  />
                </div>
                <div className="mb-3">
                  <label className="block mb-1.5 text-gray-700 font-medium text-sm">Your Review (optional)</label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Tell others what you think about this toy..."
                    rows={3}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg text-base font-inherit resize-none transition-colors focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    className="flex-1 py-2.5 border-none rounded-lg bg-purple-600 text-white font-semibold cursor-pointer transition-colors hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={handleSubmitReview}
                    disabled={isSubmitting || !newRating}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                  <button
                    className="py-2.5 px-4 border-none rounded-lg bg-gray-200 text-gray-600 font-semibold cursor-pointer transition-colors hover:bg-gray-300"
                    onClick={() => {
                      setShowReviewForm(false);
                      setNewRating(0);
                      setNewComment('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {userReview && (
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl mb-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-semibold text-gray-800 text-sm">{userReview.username} (You)</span>
                  <StarRating rating={userReview.rating} size="small" />
                </div>
                {userReview.comment && (
                  <p className="m-0 mb-1.5 text-gray-600 text-sm leading-relaxed">{userReview.comment}</p>
                )}
                <span className="text-gray-400 text-xs">
                  {new Date(userReview.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {reviews
                .filter(r => r.username !== user?.username)
                .slice(0, 5)
                .map((review) => (
                  <div key={review.id} className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-semibold text-gray-800 text-sm">{review.username}</span>
                      <StarRating rating={review.rating} size="small" />
                    </div>
                    {review.comment && (
                      <p className="m-0 mb-1.5 text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                    )}
                    <span className="text-gray-400 text-xs">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}

              {reviews.length === 0 && !userReview && (
                <p className="text-gray-500 text-center py-5 italic">
                  No reviews yet. Be the first to review!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
