import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const StatsContext = createContext();

const STORAGE_KEY = 'pup_picks_stats';

const ACHIEVEMENTS = [
  { id: 'first_swipe', name: 'First Swipe', description: 'Swipe your first toy', icon: '🐾', requirement: { type: 'swipes', value: 1 } },
  { id: 'getting_started', name: 'Getting Started', description: 'Swipe 10 toys', icon: '🎯', requirement: { type: 'swipes', value: 10 } },
  { id: 'toy_explorer', name: 'Toy Explorer', description: 'Swipe 50 toys', icon: '🔍', requirement: { type: 'swipes', value: 50 } },
  { id: 'toy_master', name: 'Toy Master', description: 'Swipe 100 toys', icon: '🏆', requirement: { type: 'swipes', value: 100 } },
  { id: 'streak_starter', name: 'Streak Starter', description: '3-day streak', icon: '🔥', requirement: { type: 'streak', value: 3 } },
  { id: 'week_warrior', name: 'Week Warrior', description: '7-day streak', icon: '⭐', requirement: { type: 'streak', value: 7 } },
  { id: 'month_master', name: 'Month Master', description: '30-day streak', icon: '👑', requirement: { type: 'streak', value: 30 } },
  { id: 'first_purchase', name: 'First Purchase', description: 'Buy your first toy', icon: '🛒', requirement: { type: 'purchases', value: 1 } },
  { id: 'big_spender', name: 'Big Spender', description: 'Spend $100+', icon: '💎', requirement: { type: 'spent', value: 100 } }
];

const DEFAULT_STATS = {
  currentStreak: 0,
  longestStreak: 0,
  lastSwipeDate: null,
  totalSwipes: 0,
  totalLikes: 0,
  totalSkips: 0,
  points: 0,
  totalPurchases: 0,
  totalSpent: 0,
  achievements: [],
  dailyLoginClaimed: null
};

function getDateString(date = new Date()) {
  return date.toISOString().split('T')[0];
}

function isYesterday(dateString) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return getDateString(yesterday) === dateString;
}

function isToday(dateString) {
  return getDateString() === dateString;
}

export function StatsProvider({ children }) {
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_STATS, ...parsed };
      }
    } catch (e) {
      console.error('Failed to load stats:', e);
    }
    return DEFAULT_STATS;
  });

  const [newAchievement, setNewAchievement] = useState(null);

  // Save stats to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  // Check for new achievements
  const checkAchievements = useCallback((currentStats) => {
    const newUnlocked = [];

    ACHIEVEMENTS.forEach(achievement => {
      if (currentStats.achievements.includes(achievement.id)) return;

      let unlocked = false;
      const req = achievement.requirement;

      switch (req.type) {
        case 'swipes':
          unlocked = currentStats.totalSwipes >= req.value;
          break;
        case 'streak':
          unlocked = currentStats.currentStreak >= req.value || currentStats.longestStreak >= req.value;
          break;
        case 'purchases':
          unlocked = currentStats.totalPurchases >= req.value;
          break;
        case 'spent':
          unlocked = currentStats.totalSpent >= req.value;
          break;
      }

      if (unlocked) {
        newUnlocked.push(achievement.id);
      }
    });

    return newUnlocked;
  }, []);

  // Record a swipe
  const recordSwipe = useCallback((isLike) => {
    setStats(prev => {
      const today = getDateString();
      let newStreak = prev.currentStreak;
      let newLongestStreak = prev.longestStreak;

      // Update streak logic
      if (prev.lastSwipeDate) {
        if (isToday(prev.lastSwipeDate)) {
          // Already swiped today, streak stays same
        } else if (isYesterday(prev.lastSwipeDate)) {
          // Consecutive day, increment streak
          newStreak = prev.currentStreak + 1;
        } else {
          // Streak broken, start fresh
          newStreak = 1;
        }
      } else {
        // First ever swipe
        newStreak = 1;
      }

      newLongestStreak = Math.max(newLongestStreak, newStreak);

      const newStats = {
        ...prev,
        totalSwipes: prev.totalSwipes + 1,
        totalLikes: isLike ? prev.totalLikes + 1 : prev.totalLikes,
        totalSkips: !isLike ? prev.totalSkips + 1 : prev.totalSkips,
        points: prev.points + 1, // +1 point per swipe
        lastSwipeDate: today,
        currentStreak: newStreak,
        longestStreak: newLongestStreak
      };

      // Check for new achievements
      const newlyUnlocked = checkAchievements(newStats);
      if (newlyUnlocked.length > 0) {
        newStats.achievements = [...prev.achievements, ...newlyUnlocked];
        // Show the first new achievement
        const achievement = ACHIEVEMENTS.find(a => a.id === newlyUnlocked[0]);
        setNewAchievement(achievement);
        // Add bonus points for achievements
        newStats.points += newlyUnlocked.length * 10;
      }

      return newStats;
    });
  }, [checkAchievements]);

  // Record a purchase
  const recordPurchase = useCallback((amount) => {
    setStats(prev => {
      const newStats = {
        ...prev,
        totalPurchases: prev.totalPurchases + 1,
        totalSpent: prev.totalSpent + amount,
        points: prev.points + 50 // +50 points per purchase
      };

      const newlyUnlocked = checkAchievements(newStats);
      if (newlyUnlocked.length > 0) {
        newStats.achievements = [...prev.achievements, ...newlyUnlocked];
        const achievement = ACHIEVEMENTS.find(a => a.id === newlyUnlocked[0]);
        setNewAchievement(achievement);
        newStats.points += newlyUnlocked.length * 10;
      }

      return newStats;
    });
  }, [checkAchievements]);

  // Record add to cart
  const recordAddToCart = useCallback(() => {
    setStats(prev => ({
      ...prev,
      points: prev.points + 10 // +10 points for adding to cart
    }));
  }, []);

  // Claim daily login bonus
  const claimDailyLogin = useCallback(() => {
    const today = getDateString();
    if (stats.dailyLoginClaimed === today) return false;

    setStats(prev => ({
      ...prev,
      points: prev.points + 5,
      dailyLoginClaimed: today
    }));
    return true;
  }, [stats.dailyLoginClaimed]);

  // Clear the new achievement notification
  const clearNewAchievement = useCallback(() => {
    setNewAchievement(null);
  }, []);

  // Check if streak bonus is available
  const getStreakBonus = useCallback(() => {
    if (stats.currentStreak === 7 && !stats.achievements.includes('streak_7_bonus')) {
      return { days: 7, points: 25 };
    }
    if (stats.currentStreak === 30 && !stats.achievements.includes('streak_30_bonus')) {
      return { days: 30, points: 100 };
    }
    return null;
  }, [stats]);

  const value = {
    stats,
    achievements: ACHIEVEMENTS,
    newAchievement,
    recordSwipe,
    recordPurchase,
    recordAddToCart,
    claimDailyLogin,
    clearNewAchievement,
    getStreakBonus
  };

  return (
    <StatsContext.Provider value={value}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
}
