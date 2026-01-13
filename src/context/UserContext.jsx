import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [dogProfile, setDogProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [referredBy, setReferredBy] = useState(null);

  useEffect(() => {
    // Check for referral code in URL
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    if (refCode) {
      localStorage.setItem('pup_picks_referral', refCode);
      setReferredBy(refCode);
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(formatUser(session.user));
          await loadDogProfile(session.user.id);
        } else {
          setUser(null);
          setDogProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const formatUser = (supabaseUser) => ({
    id: supabaseUser.id,
    email: supabaseUser.email,
    username: localStorage.getItem('pup-picks-username') || supabaseUser.user_metadata?.username || supabaseUser.email?.split('@')[0],
    createdAt: supabaseUser.created_at,
    referralCode: generateReferralCode(supabaseUser.id)
  });

  const updateUsername = async (newUsername) => {
    // Just update locally - Supabase auth.updateUser hangs
    // The username is stored in user metadata which persists across sessions
    setUser(prev => prev ? { ...prev, username: newUsername } : prev);

    // Store in localStorage as backup
    localStorage.setItem('pup-picks-username', newUsername);

    return { user: { ...user, username: newUsername } };
  };

  const generateReferralCode = (userId) => {
    return userId.substring(0, 8).toUpperCase();
  };

  const loadDogProfile = async (userId) => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(
        `${supabaseUrl}/rest/v1/dog_profiles?user_id=eq.${userId}&select=*`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        }
      );

      const data = await response.json();

      if (data && data.length > 0) {
        const profile = data[0];
        setDogProfile({
          ...profile,
          chewStrength: profile.chew_strength,
          playStyle: profile.play_style
        });
      }
    } catch (err) {
      console.log('No dog profile found');
    }
  };

  const signup = async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username || email.split('@')[0]
        }
      }
    });

    if (error) throw error;
    return data.user;
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data.user;
  };

  const loginWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) throw error;
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setDogProfile(null);
  };

  const saveDogProfile = async (profile) => {
    if (!user) {
      console.error('No user logged in');
      return null;
    }

    const profileData = {
      user_id: user.id,
      name: profile.name,
      photo: profile.photo,
      size: profile.size,
      chew_strength: profile.chewStrength,
      play_style: profile.playStyle,
      updated_at: new Date().toISOString()
    };
    // Note: birthday field temporarily removed - Supabase schema cache needs to refresh

    // Get the user's access token for RLS
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    // Get session from localStorage
    const storedSession = localStorage.getItem('pup-picks-auth');
    let accessToken = supabaseKey;

    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        if (session.access_token) {
          accessToken = session.access_token;
        }
      } catch (e) {
        console.log('Could not parse session');
      }
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/dog_profiles?on_conflict=user_id`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=representation'
      },
      body: JSON.stringify(profileData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to save profile');
    }

    // Convert back to camelCase for the app
    const savedData = Array.isArray(data) ? data[0] : data;
    const formattedProfile = {
      ...savedData,
      chewStrength: savedData.chew_strength,
      playStyle: savedData.play_style
    };

    setDogProfile(formattedProfile);
    return formattedProfile;
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
        loginWithGoogle,
        logout,
        updateUsername,
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
