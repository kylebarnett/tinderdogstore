import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ChallengesContext = createContext();

const CHALLENGE_DEFINITIONS = [
  {
    id: 'swipe_5',
    title: 'Swipe Scout',
    description: 'Swipe through 5 toys',
    icon: '👆',
    target: 5,
    reward: 1,
    trackEvent: 'swipe'
  },
  {
    id: 'like_3',
    title: 'Like Lover',
    description: 'Like 3 toys',
    icon: '❤️',
    target: 3,
    reward: 1,
    trackEvent: 'like'
  },
  {
    id: 'cart_2',
    title: 'Cart Builder',
    description: 'Add 2 toys to cart',
    icon: '🛒',
    target: 2,
    reward: 2,
    trackEvent: 'addToCart'
  },
  {
    id: 'view_details_3',
    title: 'Detail Detective',
    description: 'View details on 3 toys',
    icon: '🔍',
    target: 3,
    reward: 1,
    trackEvent: 'viewDetails'
  },
  {
    id: 'swipe_10',
    title: 'Swipe Master',
    description: 'Swipe through 10 toys',
    icon: '🎯',
    target: 10,
    reward: 2,
    trackEvent: 'swipe'
  },
  {
    id: 'like_5',
    title: 'Toy Enthusiast',
    description: 'Like 5 toys',
    icon: '💖',
    target: 5,
    reward: 2,
    trackEvent: 'like'
  }
];

const PRIZE_TIERS = [
  { type: 'points', value: 5, label: '+5 Points', chance: 30, rarity: 'common' },
  { type: 'points', value: 15, label: '+15 Points', chance: 25, rarity: 'common' },
  { type: 'points', value: 25, label: '+25 Points', chance: 20, rarity: 'uncommon' },
  { type: 'discount', value: 1, label: '$1 Off', chance: 12, rarity: 'rare' },
  { type: 'discount', value: 2, label: '$2 Off', chance: 8, rarity: 'rare' },
  { type: 'shipping', value: 0, label: 'Free Shipping', chance: 4, rarity: 'epic' },
  { type: 'discount', value: 50, label: '50% Off Item', chance: 1, rarity: 'legendary' }
];

function getRandomChallenges(count = 3) {
  const shuffled = [...CHALLENGE_DEFINITIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(challenge => ({
    ...challenge,
    progress: 0,
    completed: false
  }));
}

function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

function spinForPrize() {
  const random = Math.random() * 100;
  let cumulative = 0;

  for (const prize of PRIZE_TIERS) {
    cumulative += prize.chance;
    if (random <= cumulative) {
      return prize;
    }
  }

  return PRIZE_TIERS[0]; // Fallback to first prize
}

const STORAGE_KEY = 'pup_picks_challenges';

function loadChallengesState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      const today = getTodayKey();

      // Check if challenges need to be refreshed (new day)
      if (data.lastRefresh !== today) {
        return {
          dailyChallenges: getRandomChallenges(3),
          availableSpins: data.availableSpins || 0,
          totalPoints: data.totalPoints || 0,
          rewards: data.rewards || [],
          lastRefresh: today
        };
      }

      return data;
    }
  } catch (e) {
    console.error('Error loading challenges state:', e);
  }

  // Default state
  return {
    dailyChallenges: getRandomChallenges(3),
    availableSpins: 0,
    totalPoints: 0,
    rewards: [],
    lastRefresh: getTodayKey()
  };
}

export function ChallengesProvider({ children }) {
  const [state, setState] = useState(loadChallengesState);
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [lastPrize, setLastPrize] = useState(null);

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Track an event and update challenge progress
  const trackEvent = useCallback((eventType) => {
    setState(prev => {
      const updatedChallenges = prev.dailyChallenges.map(challenge => {
        if (challenge.trackEvent !== eventType || challenge.completed) {
          return challenge;
        }

        const newProgress = challenge.progress + 1;
        const isNowComplete = newProgress >= challenge.target;

        return {
          ...challenge,
          progress: newProgress,
          completed: isNowComplete
        };
      });

      // Calculate newly earned spins
      const previouslyCompleted = prev.dailyChallenges.filter(c => c.completed).length;
      const nowCompleted = updatedChallenges.filter(c => c.completed).length;
      const newlyCompleted = updatedChallenges.filter((c, i) =>
        c.completed && !prev.dailyChallenges[i].completed
      );

      const earnedSpins = newlyCompleted.reduce((sum, c) => sum + c.reward, 0);

      return {
        ...prev,
        dailyChallenges: updatedChallenges,
        availableSpins: prev.availableSpins + earnedSpins
      };
    });
  }, []);

  // Specific tracking methods
  const trackSwipe = useCallback(() => trackEvent('swipe'), [trackEvent]);
  const trackLike = useCallback(() => trackEvent('like'), [trackEvent]);
  const trackAddToCart = useCallback(() => {
    trackEvent('addToCart');
    trackEvent('like'); // Adding to cart also counts as a like
  }, [trackEvent]);
  const trackViewDetails = useCallback(() => trackEvent('viewDetails'), [trackEvent]);

  // Spin the wheel
  const spin = useCallback(() => {
    if (state.availableSpins <= 0) return null;

    const prize = spinForPrize();

    setState(prev => ({
      ...prev,
      availableSpins: prev.availableSpins - 1,
      totalPoints: prize.type === 'points'
        ? prev.totalPoints + prize.value
        : prev.totalPoints,
      rewards: prize.type !== 'points'
        ? [...prev.rewards, { ...prize, id: Date.now(), used: false }]
        : prev.rewards
    }));

    setLastPrize(prize);
    return prize;
  }, [state.availableSpins]);

  // Use a reward
  const useReward = useCallback((rewardId) => {
    setState(prev => ({
      ...prev,
      rewards: prev.rewards.map(r =>
        r.id === rewardId ? { ...r, used: true } : r
      )
    }));
  }, []);

  // Get incomplete challenge count (for badge)
  const incompleteChallengeCount = state.dailyChallenges.filter(c => !c.completed).length;

  const value = {
    ...state,
    trackSwipe,
    trackLike,
    trackAddToCart,
    trackViewDetails,
    spin,
    useReward,
    showSpinWheel,
    setShowSpinWheel,
    lastPrize,
    setLastPrize,
    incompleteChallengeCount,
    prizeTiers: PRIZE_TIERS
  };

  return (
    <ChallengesContext.Provider value={value}>
      {children}
    </ChallengesContext.Provider>
  );
}

export function useChallenges() {
  const context = useContext(ChallengesContext);
  if (!context) {
    throw new Error('useChallenges must be used within a ChallengesProvider');
  }
  return context;
}
