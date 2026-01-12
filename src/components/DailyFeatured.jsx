import { motion } from 'framer-motion';
import { Sparkles, ShoppingBag, Star } from 'lucide-react';
import styles from './DailyFeatured.module.css';

/**
 * Get the featured toy for today based on the date
 * Uses a simple hash to rotate through toys daily
 */
function getDailyToyIndex(toys) {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );
  return dayOfYear % toys.length;
}

export function DailyFeatured({ toys, onAddToCart, dogName }) {
  const featuredIndex = getDailyToyIndex(toys);
  const featuredToy = toys[featuredIndex];

  if (!featuredToy) return null;

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className={styles.header}>
        <div className={styles.badge}>
          <Sparkles size={14} />
          <span>Today's Pick</span>
        </div>
        <p className={styles.subtitle}>
          {dogName ? `Picked for ${dogName}` : 'Special deal just for you'}
        </p>
      </div>

      <div className={styles.card}>
        <div className={styles.imageWrapper}>
          <img src={featuredToy.image} alt={featuredToy.name} />
          <div className={styles.discount}>10% OFF</div>
        </div>

        <div className={styles.content}>
          <h3 className={styles.name}>{featuredToy.name}</h3>
          <div className={styles.rating}>
            <Star size={14} fill="#F59E0B" color="#F59E0B" />
            <span>{featuredToy.rating}</span>
            <span className={styles.reviewCount}>({featuredToy.reviewCount})</span>
          </div>
          <div className={styles.priceRow}>
            <span className={styles.price}>${(featuredToy.price * 0.9).toFixed(2)}</span>
            <span className={styles.originalPrice}>${featuredToy.price.toFixed(2)}</span>
          </div>
        </div>

        <motion.button
          className={styles.addBtn}
          onClick={() => onAddToCart(featuredToy)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ShoppingBag size={16} />
          <span>Quick Add</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
