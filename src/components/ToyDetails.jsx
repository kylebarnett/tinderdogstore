import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import { getReviewsForToy, addReview, getUserReviewForToy } from '../utils/storage';
import './ToyDetails.css';

function StarRating({ rating, onRate, interactive = false, size = 'medium' }) {
  const [hoverRating, setHoverRating] = useState(0);

  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const filled = interactive ? (hoverRating || rating) >= i : rating >= i;
    const halfFilled = !filled && rating >= i - 0.5;

    stars.push(
      <span
        key={i}
        className={`star ${size} ${filled ? 'filled' : ''} ${halfFilled ? 'half' : ''} ${interactive ? 'interactive' : ''}`}
        onClick={() => interactive && onRate && onRate(i)}
        onMouseEnter={() => interactive && setHoverRating(i)}
        onMouseLeave={() => interactive && setHoverRating(0)}
      >
        {filled || halfFilled ? '★' : '☆'}
      </span>
    );
  }

  return <span className="star-rating">{stars}</span>;
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
    <div className="toy-details-overlay" onClick={onClose}>
      <div className="toy-details-modal" onClick={(e) => e.stopPropagation()}>
        <button className="details-close" onClick={onClose}>
          &times;
        </button>

        <div className="details-image" style={{ backgroundImage: `url(${toy.image})` }} />

        <div className="details-content">
          <div className="details-header">
            <h2>{toy.name}</h2>
            <p className="details-price">${toy.price.toFixed(2)}</p>
          </div>

          <div className="details-rating">
            <StarRating rating={averageRating} />
            <span className="rating-text">
              {averageRating.toFixed(1)} ({totalReviews} reviews)
            </span>
          </div>

          <p className="details-description">{toy.fullDescription || toy.description}</p>

          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>

          <div className="reviews-section">
            <div className="reviews-header">
              <h3>Reviews</h3>
              {isLoggedIn && !userReview && !showReviewForm && (
                <button className="write-review-btn" onClick={() => setShowReviewForm(true)}>
                  Write a Review
                </button>
              )}
            </div>

            {!isLoggedIn && (
              <p className="login-prompt">Sign in to leave a review</p>
            )}

            {showReviewForm && (
              <div className="review-form">
                <div className="form-field">
                  <label>Your Rating</label>
                  <StarRating
                    rating={newRating}
                    onRate={setNewRating}
                    interactive={true}
                    size="large"
                  />
                </div>
                <div className="form-field">
                  <label>Your Review (optional)</label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Tell others what you think about this toy..."
                    rows={3}
                  />
                </div>
                <div className="form-actions">
                  <button
                    className="submit-review-btn"
                    onClick={handleSubmitReview}
                    disabled={isSubmitting || !newRating}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                  <button
                    className="cancel-review-btn"
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
              <div className="review-item user-review">
                <div className="review-header">
                  <span className="reviewer-name">{userReview.username} (You)</span>
                  <StarRating rating={userReview.rating} size="small" />
                </div>
                {userReview.comment && <p className="review-comment">{userReview.comment}</p>}
                <span className="review-date">
                  {new Date(userReview.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}

            <div className="reviews-list">
              {reviews
                .filter(r => r.username !== user?.username)
                .slice(0, 5)
                .map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <span className="reviewer-name">{review.username}</span>
                      <StarRating rating={review.rating} size="small" />
                    </div>
                    {review.comment && <p className="review-comment">{review.comment}</p>}
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}

              {reviews.length === 0 && !userReview && (
                <p className="no-reviews">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
