import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToyCard } from './components/ToyCard';
import { ToyDetails } from './components/ToyDetails';
import { Cart } from './components/Cart';
import { AuthModal } from './components/Auth/AuthModal';
import { ProfilePage } from './components/Profile/ProfilePage';
import { useCart } from './context/CartContext';
import { useUser } from './context/UserContext';
import { toys } from './data/toys';
import styles from './App.module.css';

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedToy, setSelectedToy] = useState(null);

  const { addToCart } = useCart();
  const { user, isLoggedIn, isLoading, dogProfile } = useUser();

  const currentToy = toys[currentIndex];
  const isFinished = currentIndex >= toys.length;

  const handleSwipeLeft = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSwipeRight = (toy) => {
    addToCart(toy);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleReset = () => {
    setCurrentIndex(0);
  };

  const handleViewDetails = (toy) => {
    setSelectedToy(toy);
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign In
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

      <main className={styles.main}>
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
              <div className={styles.progress}>
                {currentIndex + 1} / {toys.length}
              </div>
              <ToyCard
                toy={currentToy}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                onViewDetails={handleViewDetails}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      {showProfile && <ProfilePage onClose={() => setShowProfile(false)} />}
      {selectedToy && <ToyDetails toy={selectedToy} onClose={() => setSelectedToy(null)} />}
    </div>
  );
}

export default App;
