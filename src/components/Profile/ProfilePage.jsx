import { motion, AnimatePresence } from 'framer-motion';
import { X, Dog, Share2, LogOut } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { DogProfile } from './DogProfile';
import { ShareInvite } from '../ShareInvite';
import styles from './ProfilePage.module.css';

export function ProfilePage({ onClose }) {
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={styles.page}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
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

          <div className={styles.header}>
            <div className={styles.avatar}>
              {user.username.charAt(0).toUpperCase()}
            </div>
            <h2>{user.username}</h2>
            <p className={styles.memberSince}>
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className={styles.sections}>
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <Dog size={14} />
                My Dog
              </h3>
              <DogProfile />
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <Share2 size={14} />
                Invite Friends
              </h3>
              <ShareInvite />
            </section>
          </div>

          <div className={styles.footer}>
            <motion.button
              className={styles.logoutBtn}
              onClick={handleLogout}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <LogOut size={16} style={{ marginRight: '8px' }} />
              Sign Out
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
