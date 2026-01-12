import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Flame, Star, TrendingUp } from 'lucide-react';
import { useStats } from '../context/StatsContext';
import styles from './StatsPanel.module.css';

export function StatsPanel({ isOpen, onClose }) {
  const { stats, achievements } = useStats();

  const likeRate = stats.totalSwipes > 0
    ? Math.round((stats.totalLikes / stats.totalSwipes) * 100)
    : 0;

  const unlockedCount = stats.achievements.length;
  const totalAchievements = achievements.length;

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
        <Trophy size={20} />
        {stats.currentStreak > 0 && (
          <span className={styles.streakBadge}>
            <Flame size={12} />
            {stats.currentStreak}
          </span>
        )}
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
                <h3>Your Stats</h3>
                <button className={styles.closeBtn} onClick={onClose}>
                  <X size={20} />
                </button>
              </div>

              <div className={styles.content}>
                {/* Streak Section */}
                <div className={styles.streakCard}>
                  <div className={styles.streakIcon}>
                    <Flame size={32} />
                  </div>
                  <div className={styles.streakInfo}>
                    <span className={styles.streakNumber}>{stats.currentStreak}</span>
                    <span className={styles.streakLabel}>Day Streak</span>
                  </div>
                  <div className={styles.streakBest}>
                    Best: {stats.longestStreak} days
                  </div>
                </div>

                {/* Points Section */}
                <div className={styles.pointsCard}>
                  <div className={styles.pointsHeader}>
                    <Star size={20} fill="#F59E0B" color="#F59E0B" />
                    <span className={styles.pointsNumber}>{stats.points.toLocaleString()}</span>
                    <span className={styles.pointsLabel}>Points</span>
                  </div>
                  <div className={styles.pointsHint}>
                    Earn points by swiping and shopping!
                  </div>
                </div>

                {/* Swipe Stats */}
                <div className={styles.section}>
                  <h4 className={styles.sectionTitle}>
                    <TrendingUp size={16} />
                    Swipe Stats
                  </h4>
                  <div className={styles.statGrid}>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>{stats.totalSwipes}</span>
                      <span className={styles.statLabel}>Total</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statValue} style={{ color: 'var(--color-success)' }}>
                        {stats.totalLikes}
                      </span>
                      <span className={styles.statLabel}>Liked</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statValue} style={{ color: 'var(--color-danger)' }}>
                        {stats.totalSkips}
                      </span>
                      <span className={styles.statLabel}>Skipped</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>{likeRate}%</span>
                      <span className={styles.statLabel}>Like Rate</span>
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                <div className={styles.section}>
                  <h4 className={styles.sectionTitle}>
                    <Trophy size={16} />
                    Achievements ({unlockedCount}/{totalAchievements})
                  </h4>
                  <div className={styles.achievementGrid}>
                    {achievements.map(achievement => {
                      const isUnlocked = stats.achievements.includes(achievement.id);
                      return (
                        <div
                          key={achievement.id}
                          className={`${styles.achievementItem} ${isUnlocked ? styles.unlocked : ''}`}
                          title={`${achievement.name}: ${achievement.description}`}
                        >
                          <span className={styles.achievementIcon}>
                            {achievement.icon}
                          </span>
                          {isUnlocked && (
                            <span className={styles.achievementCheck}>✓</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className={styles.achievementLegend}>
                    {achievements.map(achievement => {
                      const isUnlocked = stats.achievements.includes(achievement.id);
                      return (
                        <div
                          key={achievement.id}
                          className={`${styles.legendItem} ${isUnlocked ? styles.legendUnlocked : ''}`}
                        >
                          <span>{achievement.icon}</span>
                          <span className={styles.legendName}>{achievement.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Achievement toast notification
export function AchievementToast({ achievement, onClose }) {
  if (!achievement) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.achievementToast}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        onClick={onClose}
      >
        <span className={styles.toastIcon}>{achievement.icon}</span>
        <div className={styles.toastContent}>
          <span className={styles.toastTitle}>Achievement Unlocked!</span>
          <span className={styles.toastName}>{achievement.name}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
