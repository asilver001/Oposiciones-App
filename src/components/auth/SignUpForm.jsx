import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, CheckCircle, AlertCircle } from 'lucide-react';

export default function SignUpForm({
  onSignUp,
  onGoToLogin,
  onSkip,
  onBack,
  onShowPrivacy,
  loading = false,
  error = null
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
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

    if (password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (password !== confirmPassword) {
      setLocalError('Las contraseñas no coinciden');
      return false;
    }

    if (!acceptTerms) {
      setLocalError('Debes aceptar los términos y condiciones');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await onSignUp(email, password, { display_name: name });

    if (result && !result.error) {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">¡Revisa tu correo!</h2>
          <p className="text-gray-600 mb-6">
            Te hemos enviado un email a <strong>{email}</strong> para confirmar tu cuenta.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Haz clic en el enlace del email para activar tu cuenta y empezar a guardar tu progreso.
          </p>
          <button
            onClick={onGoToLogin}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-2xl transition-all"
          >
            Ir a iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-8 border border-gray-100 max-w-md w-full">
        {onBack && (
          <button onClick={onBack} className="mb-4 text-gray-600 flex items-center gap-2 hover:text-gray-800">
            <ArrowLeft className="w-5 h-5" /> Volver
          </button>
        )}

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎓</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Crear cuenta</h2>
          <p className="text-gray-500">Guarda tu progreso y accede desde cualquier dispositivo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre (opcional)</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Email field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition"
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

          {/* Confirm Password field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña *</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite tu contraseña"
                required
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1 w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              Acepto los{' '}
              <button
                type="button"
                onClick={() => onShowPrivacy?.('terms')}
                className="text-gray-600 underline hover:text-gray-800"
              >
                términos y condiciones
              </button>
              {' '}y la{' '}
              <button
                type="button"
                onClick={() => onShowPrivacy?.('privacy')}
                className="text-gray-600 underline hover:text-gray-800"
              >
                política de privacidad
              </button>
            </label>
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
            className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold py-4 rounded-2xl transition-all disabled:cursor-not-allowed"
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 space-y-3">
          <p className="text-center text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <button onClick={onGoToLogin} className="text-gray-600 font-semibold hover:underline">
              Inicia sesión
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
