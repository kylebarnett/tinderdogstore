import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Gift, Star } from 'lucide-react';
import { useChallenges } from '../../context/ChallengesContext';
import styles from './ChallengeDrawer.module.css';

function ChallengeCard({ challenge }) {
  const progress = Math.min(challenge.progress, challenge.target);
  const percentage = (progress / challenge.target) * 100;

  return (
    <motion.div
      className={`${styles.challengeCard} ${challenge.completed ? styles.completed : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      <div className={styles.challengeIcon}>
        {challenge.icon}
      </div>
      <div className={styles.challengeInfo}>
        <div className={styles.challengeHeader}>
          <span className={styles.challengeTitle}>{challenge.title}</span>
          <span className={styles.challengeReward}>
            <Gift size={14} />
            {challenge.reward} spin{challenge.reward > 1 ? 's' : ''}
          </span>
        </div>
        <span className={styles.challengeDesc}>{challenge.description}</span>
        <div className={styles.progressBar}>
          <motion.div
            className={styles.progressFill}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <span className={styles.progressText}>
          {progress} / {challenge.target}
        </span>
      </div>
      {challenge.completed && (
        <div className={styles.checkmark}>
          <Star size={16} fill="currentColor" />
        </div>
      )}
    </motion.div>
  );
}

export function ChallengeDrawer({ isOpen, onClose, onOpenSpinWheel }) {
  const { dailyChallenges, availableSpins, totalPoints } = useChallenges();

  const completedCount = dailyChallenges.filter(c => c.completed).length;

  // Calculate time until challenges reset (midnight)
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const hoursLeft = Math.floor((midnight - now) / (1000 * 60 * 60));
  const minutesLeft = Math.floor(((midnight - now) % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={styles.drawer}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className={styles.handle} />

            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <Target size={20} />
                <h3>Daily Challenges</h3>
              </div>
              <button className={styles.closeBtn} onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.timer}>
              Resets in {hoursLeft}h {minutesLeft}m
            </div>

            {/* Points Display */}
            <div className={styles.pointsCard}>
              <div className={styles.pointsInfo}>
                <Star size={20} fill="#F59E0B" color="#F59E0B" />
                <span className={styles.pointsValue}>{totalPoints.toLocaleString()}</span>
                <span className={styles.pointsLabel}>points</span>
              </div>
            </div>

            {/* Challenges List */}
            <div className={styles.challengeList}>
              <div className={styles.progressSummary}>
                {completedCount} / {dailyChallenges.length} completed
              </div>
              {dailyChallenges.map(challenge => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>

            {/* Spin Button */}
            <motion.button
              className={styles.spinBtn}
              onClick={onOpenSpinWheel}
              disabled={availableSpins === 0}
              whileHover={availableSpins > 0 ? { scale: 1.02 } : {}}
              whileTap={availableSpins > 0 ? { scale: 0.98 } : {}}
            >
              <Gift size={20} />
              <span>
                {availableSpins > 0
                  ? `Spin the Wheel! (${availableSpins} available)`
                  : 'Complete challenges to earn spins'
                }
              </span>
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
