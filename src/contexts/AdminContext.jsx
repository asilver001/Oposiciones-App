import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check for existing admin session on mount
  useEffect(() => {
    const savedAdmin = localStorage.getItem('adminSession');
    if (savedAdmin) {
      try {
        const parsed = JSON.parse(savedAdmin);
        // Session expires after 24 hours
        if (parsed.expiresAt && new Date(parsed.expiresAt) > new Date()) {
          setAdminUser(parsed);
        } else {
          localStorage.removeItem('adminSession');
        }
      } catch (e) {
        localStorage.removeItem('adminSession');
      }
    }
  }, []);

  // Login with email and PIN
  const loginAdmin = async (email, pin) => {
    setLoading(true);
    setError(null);

    const normalizedEmail = email.toLowerCase().trim();
    let rateLimitCheck = null;

    try {
      // STEP 1: Check rate limiting BEFORE attempting login
      const { data: rateLimitData, error: rateLimitError } = await supabase
        .rpc('check_admin_rate_limit', {
          p_email: normalizedEmail,
          p_ip_address: null, // Could add IP detection via external service
          p_window_minutes: 15,
          p_max_attempts: 5
        });

      if (rateLimitError) {
        console.error('Rate limit check error:', rateLimitError);
        // Continue anyway - don't block login if rate limit check fails
      } else if (rateLimitData && rateLimitData.length > 0) {
        rateLimitCheck = rateLimitData[0];

        // If rate limited, reject immediately
        if (rateLimitCheck.is_rate_limited) {
          const minutes = Math.ceil(rateLimitCheck.retry_after_seconds / 60);
          throw new Error(
            `Demasiados intentos fallidos. Inténtalo de nuevo en ${minutes} minuto${minutes !== 1 ? 's' : ''}.`
          );
        }
      }

      // STEP 2: Attempt login
      const { data, error: rpcError } = await supabase
        .rpc('verify_admin_login', {
          p_email: normalizedEmail,
          p_pin: pin
        });

      if (rpcError) {
        throw new Error(rpcError.message);
      }

      if (!data || data.length === 0) {
        // Record failed attempt
        await supabase.rpc('record_admin_login_attempt', {
          p_email: normalizedEmail,
          p_ip_address: null,
          p_user_agent: navigator?.userAgent || null,
          p_was_successful: false,
          p_failure_reason: 'invalid_credentials'
        });

        throw new Error('Credenciales incorrectas');
      }

      const admin = data[0];

      // STEP 3: Record successful login
      await supabase.rpc('record_admin_login_attempt', {
        p_email: normalizedEmail,
        p_ip_address: null,
        p_user_agent: navigator?.userAgent || null,
        p_was_successful: true,
        p_failure_reason: null
      });

      // Create session with 24h expiry
      const session = {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        name: admin.name,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };

      // Save to localStorage
      localStorage.setItem('adminSession', JSON.stringify(session));
      setAdminUser(session);

      return { success: true, role: admin.role };
    } catch (err) {
      const message = err.message || 'Error al iniciar sesión';
      setError(message);

      // Record failed attempt if not already rate limited
      if (!message.includes('Demasiados intentos')) {
        try {
          await supabase.rpc('record_admin_login_attempt', {
            p_email: normalizedEmail,
            p_ip_address: null,
            p_user_agent: navigator?.userAgent || null,
            p_was_successful: false,
            p_failure_reason: 'error'
          });
        } catch (recordError) {
          console.error('Failed to record login attempt:', recordError);
        }
      }

      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logoutAdmin = () => {
    localStorage.removeItem('adminSession');
    setAdminUser(null);
    setError(null);
  };

  // Check if user is admin
  const isAdmin = adminUser?.role === 'admin';

  // Check if user is reviewer (or admin, since admin can do everything)
  const isReviewer = adminUser?.role === 'reviewer' || isAdmin;

  // Review a question (approve/reject)
  const reviewQuestion = async (questionId, status, comment = null) => {
    if (!adminUser) {
      return { success: false, error: 'No autenticado' };
    }

    try {
      const { data, error: rpcError } = await supabase
        .rpc('review_question', {
          p_question_id: questionId,
          p_admin_id: adminUser.id,
          p_status: status,
          p_comment: comment
        });

      if (rpcError) throw new Error(rpcError.message);

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Mark question for refresh
  const markForRefresh = async (questionId, reason) => {
    if (!adminUser) {
      return { success: false, error: 'No autenticado' };
    }

    try {
      const { data, error: rpcError } = await supabase
        .rpc('mark_question_for_refresh', {
          p_question_id: questionId,
          p_reason: reason,
          p_admin_id: adminUser.id
        });

      if (rpcError) throw new Error(rpcError.message);

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Create new version of question (admin only)
  const createQuestionVersion = async (questionId, newText, newOptions, newExplanation = null) => {
    if (!isAdmin) {
      return { success: false, error: 'Solo admins pueden crear versiones' };
    }

    try {
      const { data, error: rpcError } = await supabase
        .rpc('create_question_version', {
          p_question_id: questionId,
          p_new_text: newText,
          p_new_options: newOptions,
          p_new_explanation: newExplanation,
          p_reformulated_by: 'admin',
          p_admin_id: adminUser.id
        });

      if (rpcError) throw new Error(rpcError.message);

      return { success: true, newQuestionId: data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const value = {
    adminUser,
    loading,
    error,
    isAdmin,
    isReviewer,
    isLoggedIn: !!adminUser,
    loginAdmin,
    logoutAdmin,
    reviewQuestion,
    markForRefresh,
    createQuestionVersion,
    clearError: () => setError(null)
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

export default AdminContext;
