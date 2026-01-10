import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingCart } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import { getReviewsForToy, addReview, getUserReviewForToy } from '../utils/storage';
import styles from './ToyDetails.module.css';

function StarRating({ rating, onRate, interactive = false, size = 'medium' }) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClass = size === 'small' ? styles.starSmall : size === 'large' ? styles.starLarge : styles.starMedium;

  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const filled = interactive ? (hoverRating || rating) >= i : rating >= i;
    const halfFilled = !filled && rating >= i - 0.5;

    stars.push(
      <Star
        key={i}
        className={`${sizeClass} ${filled || halfFilled ? styles.starFilled : styles.star} ${interactive ? styles.starInteractive : ''}`}
        fill={filled || halfFilled ? 'currentColor' : 'none'}
        onClick={() => interactive && onRate && onRate(i)}
        onMouseEnter={() => interactive && setHoverRating(i)}
        onMouseLeave={() => interactive && setHoverRating(0)}
      />
    );
  }

  return <span className={styles.stars}>{stars}</span>;
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
    <AnimatePresence>
      {toy && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              className={styles.closeButton}
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X size={20} />
            </motion.button>

            <div className={styles.image} style={{ backgroundImage: `url(${toy.image})` }} />

            <div className={styles.content}>
              <div className={styles.header}>
                <h2>{toy.name}</h2>
                <p className={styles.price}>${toy.price.toFixed(2)}</p>
              </div>

              <div className={styles.rating}>
                <StarRating rating={averageRating} />
                <span className={styles.ratingText}>
                  {averageRating.toFixed(1)} ({totalReviews} reviews)
                </span>
              </div>

              <p className={styles.description}>{toy.fullDescription || toy.description}</p>

              <motion.button
                className={styles.addToCartBtn}
                onClick={handleAddToCart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ShoppingCart size={20} />
                Add to Cart
              </motion.button>

              <div className={styles.reviewsSection}>
                <div className={styles.reviewsHeader}>
                  <h3>Reviews</h3>
                  {isLoggedIn && !userReview && !showReviewForm && (
                    <motion.button
                      className={styles.writeReviewBtn}
                      onClick={() => setShowReviewForm(true)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Write a Review
                    </motion.button>
                  )}
                </div>

                {!isLoggedIn && (
                  <p className={styles.loginPrompt}>Sign in to leave a review</p>
                )}

                <AnimatePresence mode="wait">
                  {showReviewForm && (
                    <motion.div
                      className={styles.reviewForm}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className={styles.formField}>
                        <label>Your Rating</label>
                        <StarRating
                          rating={newRating}
                          onRate={setNewRating}
                          interactive={true}
                          size="large"
                        />
                      </div>
                      <div className={styles.formField}>
                        <label>Your Review (optional)</label>
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Tell others what you think about this toy..."
                          rows={3}
                        />
                      </div>
                      <div className={styles.formActions}>
                        <motion.button
                          className={styles.submitReviewBtn}
                          onClick={handleSubmitReview}
                          disabled={isSubmitting || !newRating}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </motion.button>
                        <button
                          className={styles.cancelReviewBtn}
                          onClick={() => {
                            setShowReviewForm(false);
                            setNewRating(0);
                            setNewComment('');
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {userReview && (
                  <motion.div
                    className={`${styles.reviewItem} ${styles.userReview}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className={styles.reviewItemHeader}>
                      <span className={styles.reviewerName}>{userReview.username} (You)</span>
                      <StarRating rating={userReview.rating} size="small" />
                    </div>
                    {userReview.comment && <p className={styles.reviewComment}>{userReview.comment}</p>}
                    <span className={styles.reviewDate}>
                      {new Date(userReview.createdAt).toLocaleDateString()}
                    </span>
                  </motion.div>
                )}

                <div className={styles.reviewsList}>
                  {reviews
                    .filter(r => r.username !== user?.username)
                    .slice(0, 5)
                    .map((review, index) => (
                      <motion.div
                        key={review.id}
                        className={styles.reviewItem}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className={styles.reviewItemHeader}>
                          <span className={styles.reviewerName}>{review.username}</span>
                          <StarRating rating={review.rating} size="small" />
                        </div>
                        {review.comment && <p className={styles.reviewComment}>{review.comment}</p>}
                        <span className={styles.reviewDate}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </motion.div>
                    ))}

                  {reviews.length === 0 && !userReview && (
                    <p className={styles.noReviews}>No reviews yet. Be the first to review!</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
