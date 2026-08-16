import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  signInWithPopup,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../firebase/config';
import { 
  INITIAL_USER, 
  INITIAL_HABITS, 
  INITIAL_LOGS, 
  INITIAL_RECOVERY_PLANS, 
  INITIAL_INSIGHTS 
} from '../data/demoSeedData';
import { saveUserProfile } from '../firebase/services';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('habit_rescue_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [isDemoUser, setIsDemoUser] = useState(() => {
    return localStorage.getItem('habit_rescue_is_demo') === 'true';
  });

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0],
            photoURL: user.photoURL,
            resilienceScore: 100,
            successfulRecoveries: 0,
            totalRecoveryAttempts: 0,
            createdAt: user.metadata?.creationTime || new Date().toISOString()
          };
          setCurrentUser(userData);
          setIsDemoUser(false);
          localStorage.setItem('habit_rescue_user', JSON.stringify(userData));
          localStorage.setItem('habit_rescue_is_demo', 'false');
          
          try {
            await saveUserProfile(userData);
          } catch (e) {}
        } else {
          const isDemo = localStorage.getItem('habit_rescue_is_demo') === 'true';
          if (!isDemo) {
            setCurrentUser(null);
            localStorage.removeItem('habit_rescue_user');
          }
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      setLoading(false);
    }
  }, []);

  const loginWithDemo = () => {
    setCurrentUser(INITIAL_USER);
    setIsDemoUser(true);
    localStorage.setItem('habit_rescue_user', JSON.stringify(INITIAL_USER));
    localStorage.setItem('habit_rescue_is_demo', 'true');
    localStorage.setItem('habit_rescue_habits', JSON.stringify(INITIAL_HABITS));
    localStorage.setItem('habit_rescue_logs', JSON.stringify(INITIAL_LOGS));
    localStorage.setItem('habit_rescue_plans', JSON.stringify(INITIAL_RECOVERY_PLANS));
    localStorage.setItem('habit_rescue_insights', JSON.stringify(INITIAL_INSIGHTS));
    window.dispatchEvent(new Event('storage'));
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Clear demo data on real user login
      localStorage.removeItem('habit_rescue_habits');
      localStorage.removeItem('habit_rescue_logs');
      localStorage.removeItem('habit_rescue_plans');
      localStorage.removeItem('habit_rescue_insights');
      localStorage.setItem('habit_rescue_is_demo', 'false');
      setIsDemoUser(false);

      if (isFirebaseConfigured && auth) {
        const res = await signInWithEmailAndPassword(auth, email, password);
        return res.user;
      } else {
        const user = {
          uid: `user-${Date.now()}`,
          email,
          displayName: email.split('@')[0],
          resilienceScore: 100,
          successfulRecoveries: 0,
          totalRecoveryAttempts: 0,
          createdAt: new Date().toISOString()
        };
        setCurrentUser(user);
        localStorage.setItem('habit_rescue_user', JSON.stringify(user));
        window.dispatchEvent(new Event('storage'));
        return user;
      }
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, displayName) => {
    setLoading(true);
    try {
      // WIPE ALL DEMO DATA completely for new user signup!
      localStorage.removeItem('habit_rescue_habits');
      localStorage.removeItem('habit_rescue_logs');
      localStorage.removeItem('habit_rescue_plans');
      localStorage.removeItem('habit_rescue_insights');
      localStorage.setItem('habit_rescue_is_demo', 'false');
      setIsDemoUser(false);

      if (isFirebaseConfigured && auth) {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        return res.user;
      } else {
        const newUser = {
          uid: `user-${Date.now()}`,
          email,
          displayName: displayName || email.split('@')[0],
          photoURL: null,
          resilienceScore: 100,
          successfulRecoveries: 0,
          totalRecoveryAttempts: 0,
          createdAt: new Date().toISOString()
        };
        setCurrentUser(newUser);
        localStorage.setItem('habit_rescue_user', JSON.stringify(newUser));
        window.dispatchEvent(new Event('storage'));
        return newUser;
      }
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    if (isFirebaseConfigured && auth) {
      try { await signOut(auth); } catch (e) {}
    }
    setCurrentUser(null);
    setIsDemoUser(false);
    localStorage.removeItem('habit_rescue_user');
    localStorage.removeItem('habit_rescue_is_demo');
    localStorage.removeItem('habit_rescue_habits');
    localStorage.removeItem('habit_rescue_logs');
    localStorage.removeItem('habit_rescue_plans');
    localStorage.removeItem('habit_rescue_insights');
    window.dispatchEvent(new Event('storage'));
  };

  const resetPassword = async (email) => {
    if (isFirebaseConfigured && auth) {
      await sendPasswordResetEmail(auth, email);
    }
    return true;
  };

  const loginWithGoogle = async () => {
    if (isFirebaseConfigured && auth && googleProvider) {
      return await signInWithPopup(auth, googleProvider);
    } else {
      return loginWithDemo();
    }
  };

  const value = {
    currentUser,
    isDemoUser,
    loading,
    login,
    signup,
    logoutUser,
    resetPassword,
    loginWithGoogle,
    loginWithDemo
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
