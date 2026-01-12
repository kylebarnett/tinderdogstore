import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Gift, Sparkles } from 'lucide-react';
import { useChallenges } from '../../context/ChallengesContext';
import styles from './SpinWheel.module.css';

const WHEEL_COLORS = [
  '#8B5CF6', '#EC4899', '#F59E0B', '#10B981',
  '#6366F1', '#EF4444', '#06B6D4', '#84CC16'
];

function getRandomRotation() {
  // Random rotation between 1800 and 2520 degrees (5-7 full spins)
  return 1800 + Math.random() * 720;
}

export function SpinWheel({ isOpen, onClose }) {
  const { availableSpins, spin, prizeTiers, lastPrize, setLastPrize } = useChallenges();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showPrize, setShowPrize] = useState(false);

  const handleSpin = useCallback(() => {
    if (isSpinning || availableSpins <= 0) return;

    setIsSpinning(true);
    setShowPrize(false);

    // Spin the wheel
    const newRotation = rotation + getRandomRotation();
    setRotation(newRotation);

    // After spin animation, reveal prize
    setTimeout(() => {
      const prize = spin();
      if (prize) {
        setShowPrize(true);
      }
      setIsSpinning(false);
    }, 4000);
  }, [isSpinning, availableSpins, rotation, spin]);

  const handleContinue = () => {
    setShowPrize(false);
    setLastPrize(null);
    if (availableSpins === 0) {
      onClose();
    }
  };

  const segmentAngle = 360 / prizeTiers.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.modal}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <button className={styles.closeBtn} onClick={onClose}>
              <X size={20} />
            </button>

            <div className={styles.header}>
              <Gift size={24} />
              <h2>Spin to Win!</h2>
            </div>

            <div className={styles.spinsLeft}>
              <Star size={16} fill="#F59E0B" color="#F59E0B" />
              {availableSpins} spin{availableSpins !== 1 ? 's' : ''} available
            </div>

            {/* Wheel Container */}
            <div className={styles.wheelContainer}>
              <div className={styles.pointer} />
              <motion.div
                className={styles.wheel}
                animate={{ rotate: rotation }}
                transition={{
                  duration: 4,
                  ease: [0.2, 0.8, 0.2, 1]
                }}
              >
                {prizeTiers.map((prize, index) => (
                  <div
                    key={index}
                    className={styles.segment}
                    style={{
                      transform: `rotate(${index * segmentAngle}deg)`,
                      background: WHEEL_COLORS[index % WHEEL_COLORS.length]
                    }}
                  >
                    <span
                      className={styles.segmentLabel}
                      style={{
                        transform: `rotate(${segmentAngle / 2}deg)`
                      }}
                    >
                      {prize.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Spin Button */}
            <motion.button
              className={styles.spinBtn}
              onClick={handleSpin}
              disabled={isSpinning || availableSpins <= 0}
              whileHover={!isSpinning && availableSpins > 0 ? { scale: 1.05 } : {}}
              whileTap={!isSpinning && availableSpins > 0 ? { scale: 0.95 } : {}}
            >
              {isSpinning ? 'Spinning...' : 'SPIN!'}
            </motion.button>

            {/* Prize Reveal */}
            <AnimatePresence>
              {showPrize && lastPrize && (
                <motion.div
                  className={styles.prizeOverlay}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className={`${styles.prizeCard} ${styles[lastPrize.rarity]}`}
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <div className={styles.prizeGlow} />
                    <Sparkles className={styles.sparkles} size={32} />
                    <span className={styles.prizeRarity}>{lastPrize.rarity}</span>
                    <span className={styles.prizeValue}>{lastPrize.label}</span>
                    <span className={styles.prizeDesc}>
                      {lastPrize.type === 'points' && 'Added to your points!'}
                      {lastPrize.type === 'discount' && 'Use at checkout!'}
                      {lastPrize.type === 'shipping' && 'Applied to next order!'}
                    </span>
                    <motion.button
                      className={styles.continueBtn}
                      onClick={handleContinue}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {availableSpins > 0 ? 'Spin Again!' : 'Awesome!'}
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
