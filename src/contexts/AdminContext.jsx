import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const { user, userRole } = useAuth();
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync admin state from AuthContext's userRole
  useEffect(() => {
    if (user && userRole?.isAdmin) {
      setAdminUser({
        id: userRole.id,
        email: user.email,
        role: userRole.role,
        name: userRole.name,
      });
    } else if (user && userRole?.isReviewer) {
      setAdminUser({
        id: userRole.id,
        email: user.email,
        role: userRole.role,
        name: userRole.name,
      });
    } else {
      setAdminUser(null);
    }
  }, [user, userRole]);

  // Login admin - verifies that the currently authenticated user has admin/reviewer role
  const loginAdmin = async () => {
    if (!user) {
      const msg = 'Debes iniciar sesion primero';
      setError(msg);
      return { success: false, error: msg };
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: rpcError } = await supabase.rpc('check_user_role', {
        p_email: user.email,
      });

      if (rpcError) throw new Error(rpcError.message);

      const roleData = Array.isArray(data) ? data[0] : data;

      if (!roleData || (!roleData.isAdmin && !roleData.isReviewer)) {
        throw new Error('Tu cuenta no tiene permisos de administrador');
      }

      const admin = {
        id: roleData.id,
        email: user.email,
        role: roleData.role,
        name: roleData.name,
      };

      setAdminUser(admin);
      return { success: true, role: roleData.role };
    } catch (err) {
      const message = err.message || 'Error al verificar permisos';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Logout admin (just clear admin state, don't sign out from Supabase)
  const logoutAdmin = () => {
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
      const { error: rpcError } = await supabase
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
      const { error: rpcError } = await supabase
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

// eslint-disable-next-line react-refresh/only-export-components
export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

export default AdminContext;
