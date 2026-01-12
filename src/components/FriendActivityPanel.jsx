import { motion, AnimatePresence } from 'framer-motion';
import { X, Users } from 'lucide-react';
import { FriendActivity } from './FriendActivity';
import styles from './FriendActivityPanel.module.css';

export function FriendActivityPanel({ isOpen, onClose }) {
  return (
    <>
      {/* Toggle Button */}
      <motion.button
        className={styles.toggleBtn}
        onClick={onClose}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ left: isOpen ? '280px' : '20px' }}
      >
        <Users size={20} />
      </motion.button>

      {/* Panel */}
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
              className={styles.panel}
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className={styles.header}>
                <h3>Friends</h3>
                <button className={styles.closeBtn} onClick={onClose}>
                  <X size={20} />
                </button>
              </div>

              <div className={styles.content}>
                <FriendActivity />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
