import { createContext, useContext, useState, useEffect } from 'react';
import {
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
  saveUser,
  validateUser,
  getDogProfile,
  saveDogProfile as saveProfile,
  getReferralFromUrl,
  saveReferral
} from '../utils/storage';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [dogProfile, setDogProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [referredBy, setReferredBy] = useState(null);

  useEffect(() => {
    // Check for referral code in URL
    const refCode = getReferralFromUrl();
    if (refCode) {
      saveReferral(refCode);
      setReferredBy(refCode);
    }

    // Load current user from storage
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      const profile = getDogProfile(currentUser.username);
      if (profile) {
        setDogProfile(profile);
      }
    }
    setIsLoading(false);
  }, []);

  const signup = (username, password) => {
    const newUser = saveUser(username, password);
    setCurrentUser(username);
    setUser(newUser);
    return newUser;
  };

  const login = (username, password) => {
    const validUser = validateUser(username, password);
    setCurrentUser(username);
    setUser(validUser);
    const profile = getDogProfile(username);
    if (profile) {
      setDogProfile(profile);
    }
    return validUser;
  };

  const logout = () => {
    clearCurrentUser();
    setUser(null);
    setDogProfile(null);
  };

  const saveDogProfile = (profile) => {
    if (!user) return null;
    const saved = saveProfile(user.username, profile);
    setDogProfile(saved);
    return saved;
  };

  const isLoggedIn = !!user;

  return (
    <UserContext.Provider
      value={{
        user,
        dogProfile,
        isLoggedIn,
        isLoading,
        referredBy,
        signup,
        login,
        logout,
        saveDogProfile
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
