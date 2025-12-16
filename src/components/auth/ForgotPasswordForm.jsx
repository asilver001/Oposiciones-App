import React, { useState } from 'react';
import { ArrowLeft, Mail, AlertCircle, CheckCircle } from 'lucide-react';

export default function ForgotPasswordForm({
  onResetPassword,
  onGoToLogin,
  onBack,
  loading = false,
  error = null
}) {
  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    setLocalError('');

    if (!email.trim()) {
      setLocalError('El email es obligatorio');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLocalError('El email no es válido');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await onResetPassword(email);

    if (result && !result.error) {
      setSuccess(true);
    } else if (result?.error) {
      setLocalError(result.error.message || 'Error al enviar el email');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">¡Email enviado!</h2>
          <p className="text-gray-600 mb-6">
            Hemos enviado un enlace de recuperación a <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Revisa tu bandeja de entrada (y la carpeta de spam) y sigue las instrucciones para restablecer tu contraseña.
          </p>
          <button
            onClick={onGoToLogin}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-2xl transition-all"
          >
            Volver a iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full">
        {onBack && (
          <button onClick={onBack} className="mb-4 text-gray-600 flex items-center gap-2 hover:text-gray-800">
            <ArrowLeft className="w-5 h-5" /> Volver
          </button>
        )}

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Recuperar contraseña</h2>
          <p className="text-gray-500">Te enviaremos un enlace para restablecer tu contraseña</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Error message */}
          {(localError || error) && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{localError || error}</p>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-2xl transition-all disabled:cursor-not-allowed"
          >
            {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6">
          <p className="text-center text-gray-600">
            ¿Recordaste tu contraseña?{' '}
            <button onClick={onGoToLogin} className="text-purple-600 font-semibold hover:underline">
              Iniciar sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
