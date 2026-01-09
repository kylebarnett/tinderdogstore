import { useState } from 'react';
import { ToyCard } from './components/ToyCard';
import { ToyDetails } from './components/ToyDetails';
import { Cart } from './components/Cart';
import { AuthModal } from './components/Auth/AuthModal';
import { ProfilePage } from './components/Profile/ProfilePage';
import { useCart } from './context/CartContext';
import { useUser } from './context/UserContext';
import { toys } from './data/toys';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-5 pt-10">
      <Cart />

      <nav className="fixed top-5 left-5 z-[100]">
        {isLoggedIn ? (
          <button
            className="w-12 h-12 border-none rounded-full bg-white cursor-pointer shadow-lg transition-all overflow-hidden p-0 flex items-center justify-center hover:scale-110 hover:shadow-xl"
            onClick={() => setShowProfile(true)}
          >
            {dogProfile?.photo ? (
              <img src={dogProfile.photo} alt={dogProfile.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-purple-600">
                {user.username.charAt(0).toUpperCase()}
              </span>
            )}
          </button>
        ) : (
          <button
            className="py-2.5 px-5 border-none rounded-full bg-white text-purple-600 font-semibold cursor-pointer shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            onClick={() => setShowAuth(true)}
          >
            Sign In
          </button>
        )}
      </nav>

      <header className="text-center mb-8">
        <h1 className="m-0 text-4xl font-extrabold text-purple-600 tracking-tight">
          Pup Picks
        </h1>
        {isLoggedIn && dogProfile ? (
          <p className="mt-2 text-gray-500">Finding toys for {dogProfile.name}!</p>
        ) : (
          <p className="mt-2 text-gray-500">Swipe right to add toys to your cart</p>
        )}
      </header>

      <main className="flex-1 flex flex-col items-center w-full max-w-md">
        {isFinished ? (
          <div className="text-center py-16 px-5">
            <h2 className="m-0 mb-3 text-gray-800 text-2xl font-bold">That's all the toys!</h2>
            <p className="m-0 mb-6 text-gray-500">Check your cart or browse again</p>
            <button
              className="py-3.5 px-8 border-none rounded-full bg-purple-600 text-white text-base font-semibold cursor-pointer transition-all hover:bg-purple-700 hover:scale-105"
              onClick={handleReset}
            >
              Browse Again
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 py-2 px-4 bg-gray-100 rounded-full text-gray-500 text-sm">
              {currentIndex + 1} / {toys.length}
            </div>
            <ToyCard
              key={currentToy.id}
              toy={currentToy}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              onViewDetails={handleViewDetails}
            />
          </>
        )}
      </main>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      {showProfile && <ProfilePage onClose={() => setShowProfile(false)} />}
      {selectedToy && <ToyDetails toy={selectedToy} onClose={() => setSelectedToy(null)} />}
    </div>
  );
}

export default App;
