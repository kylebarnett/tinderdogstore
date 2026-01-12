import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { useChallenges } from '../../context/ChallengesContext';
import styles from './ChallengeFAB.module.css';

export function ChallengeFAB({ onClick }) {
  const { incompleteChallengeCount, availableSpins } = useChallenges();

  const showBadge = incompleteChallengeCount > 0 || availableSpins > 0;
  const badgeContent = availableSpins > 0 ? availableSpins : incompleteChallengeCount;

  return (
    <motion.button
      className={`${styles.fab} ${incompleteChallengeCount > 0 ? styles.pulse : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Target size={24} />
      {showBadge && (
        <motion.span
          className={`${styles.badge} ${availableSpins > 0 ? styles.spinBadge : ''}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        >
          {badgeContent}
        </motion.span>
      )}
    </motion.button>
  );
}
