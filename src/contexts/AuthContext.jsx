import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false); // User using app without account
  const [userRole, setUserRole] = useState(null); // { isAdmin, isReviewer, role, name }

  // Check if user has admin/reviewer role
  const checkUserRole = async (email) => {
    if (!email) {
      setUserRole(null);
      return null;
    }
    try {
      const { data, error } = await supabase.rpc('check_user_role', { p_email: email });
      if (error) {
        console.error('Error checking user role:', error);
        setUserRole(null);
        return null;
      }
      setUserRole(data);
      return data;
    } catch (err) {
      console.error('Error checking user role:', err);
      setUserRole(null);
      return null;
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      // Check role for existing session (don't block on this)
      if (session?.user?.email) {
        checkUserRole(session.user.email).catch(console.error);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event);
        setSession(session);
        setUser(session?.user ?? null);

        // IMPORTANT: Set loading false IMMEDIATELY, don't wait for async operations
        setLoading(false);

        // Check role when user signs in (don't block UI on this)
        if (session?.user?.email) {
          checkUserRole(session.user.email).catch(console.error);
        } else {
          setUserRole(null);
        }

        // Create profile when user signs up (background, don't block)
        if (event === 'SIGNED_IN' && session?.user) {
          ensureUserProfile(session.user).catch(console.error);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Ensure user has a profile in user_profiles table
  const ensureUserProfile = async (user) => {
    try {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      // If no profile, create one (trigger should handle this, but just in case)
      if (!existingProfile) {
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            email: user.email,
            display_name: user.user_metadata?.display_name || user.email?.split('@')[0],
          });

        if (insertError && insertError.code !== '23505') {
          // 23505 = duplicate key (profile already exists)
          console.error('Error creating profile:', insertError);
        }
      }
    } catch (err) {
      console.error('Error ensuring user profile:', err);
    }
  };

  // Sign up with email and password
  const signUp = async (email, password, metadata = {}) => {
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata, // { display_name: 'Juan' }
        },
      });

      if (error) throw error;

      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setSession(null);

      return { error: null };
    } catch (err) {
      setError(err.message);
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  // Reset password (sends email)
  const resetPassword = async (email) => {
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Update password (after reset)
  const updatePassword = async (newPassword) => {
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Get user profile from user_profiles table
  const getUserProfile = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      return data;
    } catch (err) {
      console.error('Error fetching profile:', err);
      return null;
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    if (!user) return { data: null, error: new Error('No user logged in') };

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };

  // Continue as anonymous (without account)
  const continueAsAnonymous = () => {
    setIsAnonymous(true);
    // Save to localStorage to persist anonymous mode
    localStorage.setItem('oposita-anonymous-mode', 'true');
  };

  // Exit anonymous mode (when user decides to create account)
  const exitAnonymousMode = () => {
    setIsAnonymous(false);
    localStorage.removeItem('oposita-anonymous-mode');
  };

  // Check for anonymous mode on mount
  useEffect(() => {
    const anonymousMode = localStorage.getItem('oposita-anonymous-mode');
    if (anonymousMode === 'true' && !user) {
      setIsAnonymous(true);
    }
  }, [user]);

  // Clear anonymous mode when user signs in
  useEffect(() => {
    if (user) {
      setIsAnonymous(false);
      localStorage.removeItem('oposita-anonymous-mode');
    }
  }, [user]);

  const value = {
    user,
    session,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    getUserProfile,
    updateProfile,
    isAuthenticated: !!user,
    isAnonymous,
    continueAsAnonymous,
    exitAnonymousMode,
    // Role-based access
    userRole,
    isAdmin: userRole?.isAdmin ?? false,
    isReviewer: userRole?.isReviewer ?? false,
    checkUserRole,
  };

  return (
    <AuthContext.Provider value={value}>
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

export default AuthContext;
