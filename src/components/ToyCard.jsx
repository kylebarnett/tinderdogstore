import { useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Heart, X, Star, Circle, Bone, Target, Puzzle, Hand } from 'lucide-react';
import styles from './ToyCard.module.css';

const DURABILITY_COLORS = {
  gentle: '#00B894',
  moderate: '#FDCB6E',
  aggressive: '#E17055',
  destroyer: '#D63031'
};

const PLAY_STYLE_ICONS = {
  fetch: Target,
  tug: Hand,
  cuddle: Heart,
  puzzle: Puzzle
};

function StarRating({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const filled = rating >= i;
    const halfFilled = !filled && rating >= i - 0.5;
    stars.push(
      <Star
        key={i}
        size={16}
        className={filled || halfFilled ? styles.starFilled : styles.star}
        fill={filled || halfFilled ? 'currentColor' : 'none'}
      />
    );
  }
  return <span className={styles.stars}>{stars}</span>;
}

export function ToyCard({ toy, matchBadge, onSwipeLeft, onSwipeRight, onViewDetails }) {
  const hasDragged = useRef(false);
  const isAnimating = useRef(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-18, 18]);
  const cardOpacity = useTransform(x, [-300, -150, 0, 150, 300], [0.5, 1, 1, 1, 0.5]);

  // Indicator opacities
  const likeOpacity = useTransform(x, [0, 80], [0, 1]);
  const nopeOpacity = useTransform(x, [-80, 0], [1, 0]);

  const handleDragStart = () => {
    hasDragged.current = false;
  };

  const handleDrag = () => {
    hasDragged.current = true;
  };

  const handleDragEnd = (event, info) => {
    if (isAnimating.current) return;

    const swipeThreshold = 100;
    const velocityThreshold = 500;
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    const shouldSwipeRight = offset > swipeThreshold || velocity > velocityThreshold;
    const shouldSwipeLeft = offset < -swipeThreshold || velocity < -velocityThreshold;

    if (shouldSwipeRight) {
      isAnimating.current = true;
      animate(x, 400, { type: 'spring', stiffness: 300, damping: 20 });
      setTimeout(() => onSwipeRight(toy), 200);
    } else if (shouldSwipeLeft) {
      isAnimating.current = true;
      animate(x, -400, { type: 'spring', stiffness: 300, damping: 20 });
      setTimeout(() => onSwipeLeft(toy), 200); // Now passes toy for undo tracking
    } else {
      animate(x, 0, { type: 'spring', stiffness: 500, damping: 30 });
    }
  };

  const handleTap = () => {
    if (!hasDragged.current && onViewDetails) {
      onViewDetails(toy);
    }
  };

  const handleButtonSwipe = (direction) => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const targetX = direction === 'right' ? 400 : -400;
    animate(x, targetX, { type: 'spring', stiffness: 300, damping: 20 });

    setTimeout(() => {
      if (direction === 'right') {
        onSwipeRight(toy);
      } else {
        onSwipeLeft(toy); // Now passes toy for undo tracking
      }
    }, 200);
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.card}
        style={{ x, rotate, opacity: cardOpacity }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.9}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onTap={handleTap}
        whileTap={{ scale: 0.98 }}
      >
        {/* Swipe Indicators */}
        <motion.div className={styles.likeIndicator} style={{ opacity: likeOpacity }}>
          <Heart size={20} />
          <span>Add to Cart</span>
        </motion.div>
        <motion.div className={styles.nopeIndicator} style={{ opacity: nopeOpacity }}>
          <X size={20} />
          <span>Skip</span>
        </motion.div>

        <div className={styles.imageContainer}>
          <img src={toy.image} alt={toy.name} className={styles.image} />
          {matchBadge && (
            <div className={`${styles.matchBadge} ${styles[matchBadge.type]}`}>
              {matchBadge.label}
            </div>
          )}
          <div className={styles.tapHint}>Tap for details</div>
        </div>

        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.name}>{toy.name}</h2>
            <p className={styles.price}>${toy.price.toFixed(2)}</p>
          </div>
          <div className={styles.rating}>
            <StarRating rating={toy.rating} />
            <span className={styles.reviewCount}>({toy.reviewCount})</span>
          </div>
          <p className={styles.description}>{toy.description}</p>

          {/* Indicator Badges */}
          <div className={styles.indicators}>
            {/* Durability */}
            {toy.durability && (
              <div
                className={styles.indicator}
                style={{ '--indicator-color': DURABILITY_COLORS[toy.durability] }}
                title={`Durability: ${toy.durability}`}
              >
                <span
                  className={styles.durabilityDot}
                  style={{ background: DURABILITY_COLORS[toy.durability] }}
                />
                <span className={styles.indicatorLabel}>
                  {toy.durability.charAt(0).toUpperCase() + toy.durability.slice(1)}
                </span>
              </div>
            )}

            {/* Play Styles */}
            {toy.playStyles?.map(style => {
              const Icon = PLAY_STYLE_ICONS[style];
              return Icon ? (
                <div key={style} className={styles.indicator} title={`Play style: ${style}`}>
                  <Icon size={14} />
                  <span className={styles.indicatorLabel}>{style}</span>
                </div>
              ) : null;
            })}

            {/* Sizes */}
            {toy.sizes && (
              <div className={styles.sizeIndicator} title="Compatible sizes">
                {['small', 'medium', 'large', 'giant'].map(size => (
                  <span
                    key={size}
                    className={`${styles.sizeDot} ${toy.sizes.includes(size) ? styles.sizeActive : ''}`}
                  >
                    {size[0].toUpperCase()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <div className={styles.actions}>
        <motion.button
          className={`${styles.actionButton} ${styles.skipButton}`}
          onClick={() => handleButtonSwipe('left')}
          disabled={isAnimating.current}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          <X size={28} />
        </motion.button>
        <motion.button
          className={`${styles.actionButton} ${styles.likeButton}`}
          onClick={() => handleButtonSwipe('right')}
          disabled={isAnimating.current}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          <Heart size={28} />
        </motion.button>
      </div>
    </div>
  );
}
