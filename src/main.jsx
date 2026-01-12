import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import { StatsProvider } from './context/StatsContext';
import { ChallengesProvider } from './context/ChallengesContext';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <CartProvider>
        <StatsProvider>
          <ChallengesProvider>
            <App />
          </ChallengesProvider>
        </StatsProvider>
      </CartProvider>
    </UserProvider>
  </StrictMode>
);
