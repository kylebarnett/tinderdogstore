import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import styles from './MatchCelebration.module.css';

// Generate confetti particles
const generateConfetti = (count = 50) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.3,
    duration: 1 + Math.random() * 1,
    color: ['#E17055', '#00B894', '#F59E0B', '#3B82F6', '#EC4899'][Math.floor(Math.random() * 5)]
  }));
};

export function MatchCelebration({ toy, dogName, onComplete }) {
  useEffect(() => {
    if (toy) {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [toy, onComplete]);

  return (
    <AnimatePresence>
      {toy && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onComplete}
        >
          {/* Confetti */}
          <div className={styles.confettiContainer}>
            {generateConfetti().map((particle) => (
              <motion.div
                key={particle.id}
                className={styles.confetti}
                style={{
                  left: `${particle.x}%`,
                  backgroundColor: particle.color
                }}
                initial={{ y: -20, opacity: 1, scale: 1, rotate: 0 }}
                animate={{
                  y: '100vh',
                  opacity: [1, 1, 0],
                  rotate: Math.random() > 0.5 ? 360 : -360,
                  scale: [1, 1.2, 0.8]
                }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  ease: 'easeOut'
                }}
              />
            ))}
          </div>

          {/* Main celebration content */}
          <motion.div
            className={styles.content}
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -50 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          >
            {/* Pulsing hearts */}
            <motion.div
              className={styles.heartBurst}
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.4 }}
            >
              <Heart size={60} fill="#E17055" color="#E17055" />
            </motion.div>

            <motion.h2
              className={styles.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              It's a Match!
            </motion.h2>

            <motion.div
              className={styles.toyInfo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className={styles.toyImage}>
                <img src={toy.image} alt={toy.name} />
              </div>
              <p className={styles.toyName}>{toy.name}</p>
              <p className={styles.message}>
                {dogName ? (
                  <>{dogName} is going to love this!</>
                ) : (
                  <>Added to your cart!</>
                )}
              </p>
            </motion.div>

            <motion.div
              className={styles.cartBadge}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <ShoppingBag size={16} />
              <span>Added to Cart</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
