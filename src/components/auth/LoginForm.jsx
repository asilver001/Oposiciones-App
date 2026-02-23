import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';

export default function LoginForm({
  onLogin,
  onGoToSignUp,
  onForgotPassword,
  onSkip,
  onBack,
  loading = false,
  error = null
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

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

    if (!password) {
      setLocalError('La contraseña es obligatoria');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await onLogin(email, password);

    if (result?.error) {
      // Map Supabase errors to Spanish
      const errorMessage = result.error.message || result.error;
      if (errorMessage.includes('Invalid login credentials')) {
        setLocalError('Email o contraseña incorrectos');
      } else if (errorMessage.includes('Email not confirmed')) {
        setLocalError('Debes confirmar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.');
      } else {
        setLocalError(errorMessage);
      }
    }
  };

  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full">
        {onBack && (
          <button onClick={onBack} className="mb-4 text-gray-600 flex items-center gap-2 hover:text-gray-800">
            <ArrowLeft className="w-5 h-5" /> Volver
          </button>
        )}

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎓</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Iniciar sesión</h2>
          <p className="text-gray-500">Accede a tu cuenta y continúa donde lo dejaste</p>
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
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                required
                className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-500 focus:outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Forgot password link */}
          <div className="text-right">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-brand-600 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
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
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-2xl transition-all disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 space-y-3">
          <p className="text-center text-gray-600">
            ¿No tienes cuenta?{' '}
            <button onClick={onGoToSignUp} className="text-brand-600 font-semibold hover:underline">
              Crear cuenta
            </button>
          </p>

          {onSkip && (
            <button
              onClick={onSkip}
              className="w-full text-gray-500 text-sm py-2 hover:text-gray-700 transition"
            >
              Continuar sin cuenta
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
