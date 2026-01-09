import { useState } from 'react';
import { ToyCard } from './components/ToyCard';
import { Cart } from './components/Cart';
import { AuthModal } from './components/Auth/AuthModal';
import { ProfilePage } from './components/Profile/ProfilePage';
import { useCart } from './context/CartContext';
import { useUser } from './context/UserContext';
import { toys } from './data/toys';
import './App.css';

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

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

  if (isLoading) {
    return (
      <div className="app loading">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="app">
      <Cart />

      <nav className="app-nav">
        {isLoggedIn ? (
          <button className="profile-btn" onClick={() => setShowProfile(true)}>
            {dogProfile?.photo ? (
              <img src={dogProfile.photo} alt={dogProfile.name} className="nav-dog-photo" />
            ) : (
              <span className="nav-avatar">{user.username.charAt(0).toUpperCase()}</span>
            )}
          </button>
        ) : (
          <button className="sign-in-btn" onClick={() => setShowAuth(true)}>
            Sign In
          </button>
        )}
      </nav>

      <header className="app-header">
        <h1>Pup Picks</h1>
        {isLoggedIn && dogProfile ? (
          <p>Finding toys for {dogProfile.name}!</p>
        ) : (
          <p>Swipe right to add toys to your cart</p>
        )}
      </header>

      <main className="app-main">
        {isFinished ? (
          <div className="finished-message">
            <h2>That's all the toys!</h2>
            <p>Check your cart or browse again</p>
            <button className="reset-button" onClick={handleReset}>
              Browse Again
            </button>
          </div>
        ) : (
          <>
            <div className="progress">
              {currentIndex + 1} / {toys.length}
            </div>
            <ToyCard
              key={currentToy.id}
              toy={currentToy}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
            />
          </>
        )}
      </main>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      {showProfile && <ProfilePage onClose={() => setShowProfile(false)} />}
    </div>
  );
}

export default App;
