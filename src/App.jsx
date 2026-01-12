import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, User } from 'lucide-react';
import { ToyCard } from './components/ToyCard';
import { ToyDetails } from './components/ToyDetails';
import { Cart } from './components/Cart';
import { AuthModal } from './components/Auth/AuthModal';
import { ProfilePage } from './components/Profile/ProfilePage';
import { MatchCelebration } from './components/MatchCelebration';
import { DailyFeatured } from './components/DailyFeatured';
import { DEFAULT_FILTERS, applyFilters } from './components/FilterPanel';
import { FriendActivityPanel } from './components/FriendActivityPanel';
import { useCart } from './context/CartContext';
import { useUser } from './context/UserContext';
import { toys } from './data/toys';
import { sortToysByMatch, getMatchBadge } from './utils/toyRecommendations';
import styles from './App.module.css';

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedToy, setSelectedToy] = useState(null);
  const [swipeHistory, setSwipeHistory] = useState([]);
  const [matchedToy, setMatchedToy] = useState(null);
  const [showFriendsPanel, setShowFriendsPanel] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const { addToCart, removeFromCart } = useCart();
  const { user, isLoggedIn, isLoading, dogProfile } = useUser();

  // Sort and filter toys
  const processedToys = useMemo(() => {
    const sorted = sortToysByMatch(toys, dogProfile);
    return applyFilters(sorted, filters);
  }, [dogProfile, filters]);

  const currentToy = processedToys[currentIndex];
  const isFinished = currentIndex >= processedToys.length;
  const matchBadge = currentToy ? getMatchBadge(currentToy, dogProfile) : null;
  const canUndo = swipeHistory.length > 0;

  const handleSwipeLeft = (toy) => {
    setSwipeHistory((prev) => [...prev.slice(-2), { toy, direction: 'left' }]);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSwipeRight = (toy) => {
    addToCart(toy);
    setSwipeHistory((prev) => [...prev.slice(-2), { toy, direction: 'right' }]);
    setCurrentIndex((prev) => prev + 1);
    setMatchedToy(toy);
  };

  const handleUndo = () => {
    if (swipeHistory.length === 0) return;

    const lastSwipe = swipeHistory[swipeHistory.length - 1];
    setSwipeHistory((prev) => prev.slice(0, -1));
    setCurrentIndex((prev) => prev - 1);

    if (lastSwipe.direction === 'right') {
      removeFromCart(lastSwipe.toy.id);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSwipeHistory([]);
  };

  const handleViewDetails = (toy) => {
    setSelectedToy(toy);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentIndex(0);
  };

  if (isLoading) {
    return (
      <div className={`${styles.app} ${styles.loading}`}>
        <div className={styles.spinner} />
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <Cart />

      <nav className={styles.nav}>
        {isLoggedIn ? (
          <motion.button
            className={styles.profileBtn}
            onClick={() => setShowProfile(true)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            {dogProfile?.photo ? (
              <img src={dogProfile.photo} alt={dogProfile.name} className={styles.navDogPhoto} />
            ) : (
              <span className={styles.navAvatar}>{user.username.charAt(0).toUpperCase()}</span>
            )}
          </motion.button>
        ) : (
          <motion.button
            className={styles.signInBtn}
            onClick={() => setShowAuth(true)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            <User size={24} />
          </motion.button>
        )}
      </nav>

      <header className={styles.header}>
        <h1>Pup Picks</h1>
        {isLoggedIn && dogProfile ? (
          <p>Finding toys for {dogProfile.name}!</p>
        ) : (
          <p>Swipe right to add toys to your cart</p>
        )}
      </header>

      {/* Friends Panel */}
      <FriendActivityPanel
        isOpen={showFriendsPanel}
        onClose={() => setShowFriendsPanel(!showFriendsPanel)}
      />

      <main className={styles.main}>
        {!isFinished && (
          <DailyFeatured
            toys={processedToys}
            dogName={dogProfile?.name}
            onAddToCart={(toy) => {
              addToCart(toy);
              setMatchedToy(toy);
            }}
          />
        )}

        <AnimatePresence mode="wait">
          {isFinished ? (
            <motion.div
              className={styles.finished}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2>That's all the toys!</h2>
              <p>Check your cart or browse again</p>
              <motion.button
                className={styles.resetBtn}
                onClick={handleReset}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Browse Again
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key={currentToy.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <div className={styles.progressRow}>
                <div className={styles.progress}>
                  {currentIndex + 1} / {processedToys.length}
                </div>
                <AnimatePresence>
                  {canUndo && (
                    <motion.button
                      className={styles.undoBtn}
                      onClick={handleUndo}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <RotateCcw size={16} />
                      Undo
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
              <ToyCard
                toy={currentToy}
                matchBadge={matchBadge}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                onViewDetails={handleViewDetails}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      {showProfile && (
        <ProfilePage
          onClose={() => setShowProfile(false)}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      )}
      {selectedToy && <ToyDetails toy={selectedToy} onClose={() => setSelectedToy(null)} />}

      <MatchCelebration
        toy={matchedToy}
        dogName={dogProfile?.name}
        onComplete={() => setMatchedToy(null)}
      />
    </div>
  );
}

export default App;
