import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { toyCategories } from '../data/toys';
import styles from './FilterPanel.module.css';

const DURABILITY_OPTIONS = [
  { id: 'gentle', label: 'Gentle', color: '#00B894' },
  { id: 'moderate', label: 'Moderate', color: '#FDCB6E' },
  { id: 'aggressive', label: 'Aggressive', color: '#E17055' },
  { id: 'destroyer', label: 'Destroyer', color: '#D63031' }
];

const PLAY_STYLE_OPTIONS = [
  { id: 'fetch', label: 'Fetch' },
  { id: 'tug', label: 'Tug' },
  { id: 'cuddle', label: 'Cuddle' },
  { id: 'puzzle', label: 'Puzzle' }
];

const SIZE_OPTIONS = [
  { id: 'small', label: 'S' },
  { id: 'medium', label: 'M' },
  { id: 'large', label: 'L' },
  { id: 'giant', label: 'XL' }
];

const RATING_OPTIONS = [
  { value: 0, label: 'Any' },
  { value: 3, label: '3+' },
  { value: 4, label: '4+' },
  { value: 4.5, label: '4.5+' }
];

export function FilterPanel({ isOpen, onClose, filters, onFilterChange, onClearFilters, activeFilterCount }) {
  const handleCategoryToggle = (categoryId) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(c => c !== categoryId)
      : [...filters.categories, categoryId];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handlePlayStyleToggle = (styleId) => {
    const newStyles = filters.playStyles.includes(styleId)
      ? filters.playStyles.filter(s => s !== styleId)
      : [...filters.playStyles, styleId];
    onFilterChange({ ...filters, playStyles: newStyles });
  };

  const handleSizeToggle = (sizeId) => {
    const newSizes = filters.sizes.includes(sizeId)
      ? filters.sizes.filter(s => s !== sizeId)
      : [...filters.sizes, sizeId];
    onFilterChange({ ...filters, sizes: newSizes });
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        className={styles.toggleBtn}
        onClick={() => onClose()}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ left: isOpen ? '280px' : '20px' }}
      >
        <SlidersHorizontal size={20} />
        {activeFilterCount > 0 && (
          <span className={styles.filterBadge}>{activeFilterCount}</span>
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
                <h3>Filters</h3>
                <button className={styles.closeBtn} onClick={onClose}>
                  <X size={20} />
                </button>
              </div>

              <div className={styles.content}>
                {/* Category */}
                <div className={styles.section}>
                  <label className={styles.sectionLabel}>Category</label>
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

                {/* Price Range */}
                <div className={styles.section}>
                  <label className={styles.sectionLabel}>
                    Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  </label>
                  <div className={styles.rangeContainer}>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={filters.priceRange[0]}
                      onChange={(e) => onFilterChange({
                        ...filters,
                        priceRange: [parseInt(e.target.value), filters.priceRange[1]]
                      })}
                      className={styles.rangeInput}
                    />
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={filters.priceRange[1]}
                      onChange={(e) => onFilterChange({
                        ...filters,
                        priceRange: [filters.priceRange[0], parseInt(e.target.value)]
                      })}
                      className={styles.rangeInput}
                    />
                  </div>
                </div>

                {/* Durability */}
                <div className={styles.section}>
                  <label className={styles.sectionLabel}>Durability</label>
                  <div className={styles.radioGroup}>
                    <label className={styles.radioOption}>
                      <input
                        type="radio"
                        name="durability"
                        checked={!filters.durability}
                        onChange={() => onFilterChange({ ...filters, durability: null })}
                      />
                      <span>Any</span>
                    </label>
                    {DURABILITY_OPTIONS.map(opt => (
                      <label key={opt.id} className={styles.radioOption}>
                        <input
                          type="radio"
                          name="durability"
                          checked={filters.durability === opt.id}
                          onChange={() => onFilterChange({ ...filters, durability: opt.id })}
                        />
                        <span className={styles.durabilityDot} style={{ background: opt.color }} />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Play Style */}
                <div className={styles.section}>
                  <label className={styles.sectionLabel}>Play Style</label>
                  <div className={styles.checkboxGrid}>
                    {PLAY_STYLE_OPTIONS.map(opt => (
                      <label key={opt.id} className={styles.checkboxOption}>
                        <input
                          type="checkbox"
                          checked={filters.playStyles.includes(opt.id)}
                          onChange={() => handlePlayStyleToggle(opt.id)}
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Dog Size */}
                <div className={styles.section}>
                  <label className={styles.sectionLabel}>Dog Size</label>
                  <div className={styles.sizeGrid}>
                    {SIZE_OPTIONS.map(opt => (
                      <button
                        key={opt.id}
                        className={`${styles.sizeBtn} ${filters.sizes.includes(opt.id) ? styles.sizeBtnActive : ''}`}
                        onClick={() => handleSizeToggle(opt.id)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div className={styles.section}>
                  <label className={styles.sectionLabel}>Minimum Rating</label>
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
              </div>

              <div className={styles.footer}>
                <button className={styles.clearBtn} onClick={onClearFilters}>
                  <RotateCcw size={16} />
                  Clear All
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export const DEFAULT_FILTERS = {
  categories: [],
  priceRange: [0, 50],
  durability: null,
  playStyles: [],
  sizes: [],
  minRating: 0
};

export function applyFilters(toys, filters) {
  return toys.filter(toy => {
    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(toy.category)) {
      return false;
    }

    // Price filter
    if (toy.price < filters.priceRange[0] || toy.price > filters.priceRange[1]) {
      return false;
    }

    // Durability filter
    if (filters.durability && toy.durability !== filters.durability) {
      return false;
    }

    // Play style filter
    if (filters.playStyles.length > 0) {
      const hasMatchingStyle = filters.playStyles.some(style => toy.playStyles?.includes(style));
      if (!hasMatchingStyle) return false;
    }

    // Size filter
    if (filters.sizes.length > 0) {
      const hasMatchingSize = filters.sizes.some(size => toy.sizes?.includes(size));
      if (!hasMatchingSize) return false;
    }

    // Rating filter
    if (filters.minRating > 0 && toy.rating < filters.minRating) {
      return false;
    }

    return true;
  });
}

export function countActiveFilters(filters) {
  let count = 0;
  if (filters.categories.length > 0) count++;
  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 50) count++;
  if (filters.durability) count++;
  if (filters.playStyles.length > 0) count++;
  if (filters.sizes.length > 0) count++;
  if (filters.minRating > 0) count++;
  return count;
}
