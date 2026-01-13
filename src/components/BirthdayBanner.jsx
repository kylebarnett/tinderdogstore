import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X, PartyPopper } from 'lucide-react';
import { useState } from 'react';
import { useUser } from '../context/UserContext';
import styles from './BirthdayBanner.module.css';

export function BirthdayBanner() {
  const { dogProfile } = useUser();
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if today is the dog's birthday
  const isBirthday = () => {
    if (!dogProfile?.birthday) return false;

    const today = new Date();
    const birthday = new Date(dogProfile.birthday + 'T00:00:00');

    return (
      today.getMonth() === birthday.getMonth() &&
      today.getDate() === birthday.getDate()
    );
  };

  if (!isBirthday() || isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.banner}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
      >
        <div className={styles.confetti}>
          <PartyPopper size={24} />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>
            Happy Birthday, {dogProfile.name}! 🎂
          </h3>
          <p className={styles.message}>
            Celebrate with a special birthday treat! Use code <strong>BIRTHDAY25</strong> for 25% off any toy!
          </p>
          <motion.button
            className={styles.claimBtn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              navigator.clipboard.writeText('BIRTHDAY25');
              alert('Code copied! BIRTHDAY25');
            }}
          >
            <Gift size={16} />
            Copy Code
          </motion.button>
        </div>
        <button
          className={styles.closeBtn}
          onClick={() => setIsDismissed(true)}
        >
          <X size={18} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
