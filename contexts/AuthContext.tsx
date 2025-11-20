import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  uid: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = '@student_atlas_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const userId = `user_${Date.now()}`;
    const newUser = { uid: userId, email: trimmedEmail };
    
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    await AsyncStorage.setItem(`@password_${trimmedEmail}`, password);
    setUser(newUser);
  };

  const signUp = async (email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const existingPassword = await AsyncStorage.getItem(`@password_${trimmedEmail}`);
    
    if (existingPassword) {
      throw new Error('An account with this email already exists');
    }
    
    const userId = `user_${Date.now()}`;
    const newUser = { uid: userId, email: trimmedEmail };
    
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    await AsyncStorage.setItem(`@password_${trimmedEmail}`, password);
    setUser(newUser);
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Failed to sign out:', error);
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      if (user) {
        await AsyncStorage.removeItem(`@password_${user.email}`);
        await AsyncStorage.removeItem(`@semesters_${user.uid}`);
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to delete account:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
