import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Dog, Share2, LogOut, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { DogProfile } from './DogProfile';
import { ShareInvite } from '../ShareInvite';
import { toyCategories } from '../../data/toys';
import { DEFAULT_FILTERS } from '../FilterPanel';
import styles from './ProfilePage.module.css';

const RATING_OPTIONS = [
  { value: 0, label: 'Any' },
  { value: 3, label: '3+' },
  { value: 4, label: '4+' },
  { value: 4.5, label: '4.5+' }
];

export function ProfilePage({ onClose, filters, onFilterChange }) {
  const { user, logout } = useUser();
  const [isEditingDog, setIsEditingDog] = useState(false);

  const handleCategoryToggle = (categoryId) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(c => c !== categoryId)
      : [...filters.categories, categoryId];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handleClearFilters = () => {
    onFilterChange(DEFAULT_FILTERS);
  };

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
              <DogProfile onEditingChange={setIsEditingDog} />
            </section>

            {!isEditingDog && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <SlidersHorizontal size={14} />
                Toy Preferences
              </h3>
              <div className={styles.filterContent}>
                <div className={styles.filterSection}>
                  <label className={styles.filterLabel}>Category</label>
                  <div className={styles.chipGrid}>
                    {toyCategories.map(cat => (
                      <button
                        key={cat.id}
                        className={`${styles.chip} ${filters.categories.includes(cat.id) ? styles.chipActive : ''}`}
                        onClick={() => handleCategoryToggle(cat.id)}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.filterSection}>
                  <label className={styles.filterLabel}>
                    Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  </label>
                  <div className={styles.dualRangeContainer}>
                    <div className={styles.dualRangeTrack}>
                      <div
                        className={styles.dualRangeFill}
                        style={{
                          left: `${(filters.priceRange[0] / 50) * 100}%`,
                          right: `${100 - (filters.priceRange[1] / 50) * 100}%`
                        }}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={filters.priceRange[0]}
                      onChange={(e) => {
                        const value = Math.min(parseInt(e.target.value), filters.priceRange[1] - 1);
                        onFilterChange({
                          ...filters,
                          priceRange: [value, filters.priceRange[1]]
                        });
                      }}
                      className={styles.dualRangeInput}
                    />
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={filters.priceRange[1]}
                      onChange={(e) => {
                        const value = Math.max(parseInt(e.target.value), filters.priceRange[0] + 1);
                        onFilterChange({
                          ...filters,
                          priceRange: [filters.priceRange[0], value]
                        });
                      }}
                      className={styles.dualRangeInput}
                    />
                  </div>
                </div>

                <div className={styles.filterSection}>
                  <label className={styles.filterLabel}>Minimum Rating</label>
                  <div className={styles.ratingGrid}>
                    {RATING_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        className={`${styles.ratingBtn} ${filters.minRating === opt.value ? styles.ratingBtnActive : ''}`}
                        onClick={() => onFilterChange({ ...filters, minRating: opt.value })}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button className={styles.clearFiltersBtn} onClick={handleClearFilters}>
                  <RotateCcw size={14} />
                  Reset All Filters
                </button>
              </div>
            </section>
            )}

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
