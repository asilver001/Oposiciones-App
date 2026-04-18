import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false); // User using app without account
  const [userRole, setUserRole] = useState(null); // { isAdmin, isReviewer, role, name }
  const [roleLoading, setRoleLoading] = useState(false); // Explicit loading state for role check

  // Check if user has admin/reviewer role
  // Uses a ref to cancel stale responses (e.g. if user signs out mid-fetch)
  const roleFetchTokenRef = useRef(0);
  const ROLE_CHECK_TIMEOUT_MS = 5000;

  const checkUserRole = async (email) => {
    if (!email) {
      setUserRole(null);
      setRoleLoading(false);
      return null;
    }

    const token = ++roleFetchTokenRef.current;
    setRoleLoading(true);

    try {
      // Race RPC vs timeout to avoid infinite pending state
      const result = await Promise.race([
        supabase.rpc('check_user_role', { p_email: email }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('role_check_timeout')), ROLE_CHECK_TIMEOUT_MS)
        ),
      ]);

      // Discard response if a newer fetch started or user signed out
      if (token !== roleFetchTokenRef.current) return null;

      const { data, error } = result;
      if (error) {
        console.error('Error checking user role:', error);
        setUserRole({ isAdmin: false, isReviewer: false, role: null, name: null, error: error.message });
        return null;
      }
      setUserRole(data);
      return data;
    } catch (err) {
      if (token !== roleFetchTokenRef.current) return null;
      console.error('Error checking user role:', err);
      setUserRole({ isAdmin: false, isReviewer: false, role: null, name: null, error: err.message });
      return null;
    } finally {
      if (token === roleFetchTokenRef.current) setRoleLoading(false);
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
            consent_accepted_at: new Date().toISOString(),
            consent_version: '1.0',
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

  // Sign in / sign up with magic link (passwordless)
  const signInWithMagicLink = async (email) => {
    setError(null);
    const redirectTo = window.location.origin + (import.meta.env.BASE_URL || '/');
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo, shouldCreateUser: true }
    });
    if (error) {
      setError(error.message);
      return { data: null, error };
    }
    return { data, error: null };
  };

  // Sign in with Google OAuth — popup mode
  const signInWithGoogle = async () => {
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          skipBrowserRedirect: true,
          redirectTo: window.location.origin,
          queryParams: {
            prompt: 'select_account',
          },
        },
      });
      if (error) {
        setError(error.message);
        return { data: null, error };
      }
      if (data?.url) {
        const w = 500, h = 600;
        const left = window.screenX + (window.outerWidth - w) / 2;
        const top = window.screenY + (window.outerHeight - h) / 2;
        window.open(
          data.url,
          'google-auth',
          `width=${w},height=${h},left=${left},top=${top},menubar=no,toolbar=no,location=yes`
        );
      }
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    }
  };

  // Sign out
  const signOut = async () => {
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Invalidate any in-flight role check before clearing state
      roleFetchTokenRef.current++;
      setUser(null);
      setSession(null);
      setUserRole(null);
      setRoleLoading(false);

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

  // Export all user data (GDPR portability)
  const exportUserData = async () => {
    if (!user) return { data: null, error: new Error('No user logged in') };

    try {
      const { data, error } = await supabase.rpc('export_user_data');
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };

  // Delete account and all user data (GDPR compliance)
  const deleteAccount = async () => {
    if (!user) return { error: new Error('No user logged in') };

    setError(null);
    setLoading(true);

    try {
      const { error: rpcError } = await supabase.rpc('delete_own_account');

      if (rpcError) throw rpcError;

      // Clear local state
      setUser(null);
      setSession(null);
      setUserRole(null);

      // Sign out from Supabase client
      await supabase.auth.signOut();

      return { error: null };
    } catch (err) {
      setError(err.message);
      return { error: err };
    } finally {
      setLoading(false);
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
    signInWithGoogle,
    signInWithMagicLink,
    signOut,
    deleteAccount,
    exportUserData,
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
    roleLoading,
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

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
