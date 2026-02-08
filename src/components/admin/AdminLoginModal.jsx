import { useState } from 'react';
import { X, Shield, Loader2, AlertCircle, LogIn } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLoginModal({ isOpen, onClose, onSuccess }) {
  const { loginAdmin, loading, error, clearError } = useAdmin();
  const { isAuthenticated } = useAuth();
  const [localError, setLocalError] = useState('');

  if (!isOpen) return null;

  const handleVerify = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!isAuthenticated) {
      setLocalError('Debes iniciar sesion primero');
      return;
    }

    const result = await loginAdmin();

    if (result.success) {
      onSuccess?.(result.role);
      onClose();
    }
  };

  const handleClose = () => {
    setLocalError('');
    clearError();
    onClose();
  };

  const displayError = localError || error;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-brand-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Acceso Admin</h2>
              <p className="text-brand-200 text-xs">Panel de administracion</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Error message */}
          {displayError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{displayError}</span>
            </div>
          )}

          {!isAuthenticated ? (
            <div className="text-center py-4">
              <LogIn className="w-10 h-10 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-600 text-sm">
                Debes iniciar sesion con tu cuenta para acceder al panel de administracion.
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 text-sm text-center">
                Se verificara que tu cuenta tiene permisos de administrador o revisor.
              </p>

              {/* Verify button */}
              <button
                onClick={handleVerify}
                disabled={loading}
                className="w-full py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Verificar acceso
                  </>
                )}
              </button>
            </>
          )}

          {/* Info text */}
          <p className="text-xs text-gray-500 text-center">
            Solo para administradores y revisores autorizados
          </p>
        </div>
      </div>
    </div>
  );
}
