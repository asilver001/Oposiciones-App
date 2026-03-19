import React, { useState } from 'react';
import { ArrowLeft, Mail, AlertCircle, CheckCircle } from 'lucide-react';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.706 17.64 9.2z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
    <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

export default function SignUpForm({
  onSignUp,
  onGoogleLogin,
  onMagicLink,
  onGoToLogin,
  onSkip,
  onBack,
  onShowPrivacy,
  loading = false,
  error = null
}) {
  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLocalError('');
    setGoogleLoading(true);
    const result = await onGoogleLogin?.();
    if (result?.error) setLocalError('No se pudo conectar con Google. Inténtalo de nuevo.');
    setGoogleLoading(false);
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLocalError('Introduce un email válido');
      return;
    }
    setMagicLoading(true);
    const result = await onMagicLink?.(email);
    if (result?.error) {
      setLocalError(result.error.message || 'Error al enviar el enlace');
    } else {
      setMagicLinkSent(true);
    }
    setMagicLoading(false);
  };

  if (magicLinkSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#F3F3F0' }}>
        <div className="bg-white rounded-[24px] p-8 max-w-md w-full text-center" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(45,106,79,0.10)' }}>
            <CheckCircle className="w-8 h-8" style={{ color: '#2D6A4F' }} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">¡Revisa tu correo!</h2>
          <p className="text-gray-500 text-sm mb-1">Hemos enviado un enlace de acceso a</p>
          <p className="font-semibold text-gray-800 mb-6">{email}</p>
          <p className="text-xs text-gray-400 mb-6">Haz clic en el enlace para activar tu cuenta. No necesitas contraseña.</p>
          <button
            onClick={() => setMagicLinkSent(false)}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Cambiar email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#F3F3F0' }}>
      <div className="bg-white rounded-[24px] p-8 max-w-md w-full" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        {onBack && (
          <button onClick={onBack} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm">
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
        )}

        <div className="mb-7">
          <div className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-4" style={{ background: 'linear-gradient(145deg, #1B4332 0%, #2D6A4F 60%, #3A7D5C 100%)' }}>
            <span className="text-2xl">🎓</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Crear cuenta</h2>
          <p className="text-gray-500 text-sm mt-1">Guarda tu progreso y accede desde cualquier dispositivo</p>
        </div>

        {/* Google button */}
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 py-3.5 border-2 border-gray-200 rounded-2xl font-semibold text-gray-800 hover:bg-gray-50 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          <GoogleIcon />
          {googleLoading ? 'Conectando...' : 'Continuar con Google'}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">O continuar con email</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Magic link form */}
        <form onSubmit={handleMagicLink} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none transition text-sm"
              />
            </div>
          </div>

          {(localError || error) && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p className="text-sm">{localError || error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={magicLoading || loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(145deg, #1B4332 0%, #2D6A4F 60%, #3A7D5C 100%)' }}
          >
            <Mail className="w-4 h-4" />
            {magicLoading ? 'Enviando...' : 'Enviar enlace mágico'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 space-y-2 text-center">
          <p className="text-sm text-gray-500">
            ¿Ya tienes cuenta?{' '}
            <button onClick={onGoToLogin} className="font-semibold text-gray-800 hover:underline">
              Inicia sesión
            </button>
          </p>
          {onSkip && (
            <button onClick={onSkip} className="text-xs text-gray-400 hover:text-gray-600 transition">
              Continuar sin cuenta
            </button>
          )}
        </div>

        <p className="text-xs text-gray-400 text-center mt-5">
          Al continuar aceptas nuestros{' '}
          <button type="button" onClick={() => onShowPrivacy?.('terms')} className="underline">Términos</button> y{' '}
          <button type="button" onClick={() => onShowPrivacy?.('privacy')} className="underline">Política de privacidad</button>
        </p>
      </div>
    </div>
  );
}
