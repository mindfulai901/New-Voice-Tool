

import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../../services/supabaseClient';
import type { AuthError, Session, User } from '@supabase/supabase-js';
import type { Profile } from '../../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profile: Profile | null;
  isPasswordRecovery: boolean;
  signOut: () => Promise<{ error: AuthError | null }>;
  clearPasswordRecoveryFlag: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  useEffect(() => {
    if (!supabase) {
        setLoading(false);
        return;
    };
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
            setIsPasswordRecovery(true);
        }
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user && supabase) {
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // Ignore "no rows found" error
          console.error('Error fetching profile:', error);
        } else {
          setProfile(data as Profile);
        }
      };
      fetchProfile();
    } else {
      setProfile(null); // Clear profile on logout
    }
  }, [user]);

  const value = {
    session,
    user,
    loading,
    profile,
    isPasswordRecovery,
    signOut: () => supabase!.auth.signOut(),
    clearPasswordRecoveryFlag: () => setIsPasswordRecovery(false),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};