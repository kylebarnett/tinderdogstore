import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [dogProfile, setDogProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [referredBy, setReferredBy] = useState(null);

  useEffect(() => {
    // Check for referral code in URL
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    if (refCode) {
      localStorage.setItem('pup_picks_referral', refCode);
      setReferredBy(refCode);
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(formatUser(session.user));
        loadDogProfile(session.user.id);
      }
      setIsLoading(false);
    });

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
    username: supabaseUser.user_metadata?.username || supabaseUser.email?.split('@')[0],
    createdAt: supabaseUser.created_at,
    referralCode: generateReferralCode(supabaseUser.id)
  });

  const generateReferralCode = (userId) => {
    return userId.substring(0, 8).toUpperCase();
  };

  const loadDogProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('dog_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data && !error) {
        setDogProfile(data);
      }
    } catch (err) {
      // No profile exists yet, that's okay
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
    if (!user) return null;

    const profileData = {
      user_id: user.id,
      name: profile.name,
      photo: profile.photo,
      size: profile.size,
      chew_strength: profile.chewStrength,
      play_style: profile.playStyle,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('dog_profiles')
      .upsert(profileData, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;

    // Convert back to camelCase for the app
    const formattedProfile = {
      ...data,
      chewStrength: data.chew_strength,
      playStyle: data.play_style
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
