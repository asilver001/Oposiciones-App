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
    if (result && !result.error) setSuccess(true);
    else if (result?.error) setLocalError(result.error.message || 'Error al enviar el email');
  };

  const paper = '#F3F3F0';
  const ink = '#1B4332';
  const inkSoft = '#2D6A4F';
  const rule = 'rgba(27,67,50,0.12)';
  const muted = '#8A8783';
  const serif = '"Instrument Serif", Georgia, serif';

  // Shared page shell
  const Shell = ({ children }) => (
    <div style={{
      minHeight: '100vh',
      padding: '44px 24px 32px',
      background: paper,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, sans-serif',
      color: '#2A2A28',
    }}>
      <div style={{
        maxWidth: 520,
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
      }}>
        {children}
      </div>
    </div>
  );

  if (success) {
    return (
      <Shell>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: muted, fontWeight: 500 }}>
            Recuperación enviada
          </div>
        </div>
        <div style={{ height: 1, background: ink, marginTop: 10, opacity: 0.85 }} />

        <div style={{ marginTop: 56 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'rgba(45,106,79,0.10)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 24,
          }}>
            <CheckCircle style={{ width: 22, height: 22, color: inkSoft }} />
          </div>
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: muted, marginBottom: 12, fontWeight: 500 }}>
            ¡Email enviado!
          </div>
          <div style={{
            fontFamily: serif, fontSize: 36, fontStyle: 'italic',
            color: ink, letterSpacing: -0.9, lineHeight: 1.1,
          }}>
            Revisa tu <span style={{ color: inkSoft, fontStyle: 'normal' }}>buzón</span>.
          </div>
          <div style={{ fontSize: 14, color: '#4B5563', marginTop: 16, lineHeight: 1.55 }}>
            Hemos enviado un enlace de recuperación a <b style={{ color: ink }}>{email}</b>.
            Si no lo ves en unos minutos, revisa la carpeta de spam.
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ marginTop: 28 }}>
          <button
            onClick={onGoToLogin}
            style={{
              width: '100%', background: ink, color: paper,
              border: 'none', padding: '16px 18px',
              fontSize: 13, fontWeight: 500, letterSpacing: 0.3,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}
          >
            <span>Volver a iniciar sesión</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      {onBack && (
        <button
          onClick={onBack}
          style={{
            background: 'none', border: 'none', color: muted,
            fontSize: 12, letterSpacing: 0.3, cursor: 'pointer',
            marginBottom: 16, padding: 0, display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <ArrowLeft style={{ width: 14, height: 14 }} /> Volver
        </button>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: muted, fontWeight: 500 }}>
          Recuperar contraseña
        </div>
      </div>
      <div style={{ height: 1, background: ink, marginTop: 10, opacity: 0.85 }} />

      <div style={{ marginTop: 44 }}>
        <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: muted, marginBottom: 12, fontWeight: 500 }}>
          Restablecer
        </div>
        <div style={{
          fontFamily: serif, fontSize: 36, fontStyle: 'italic',
          color: ink, letterSpacing: -0.9, lineHeight: 1.1,
        }}>
          ¿Olvidaste tu <span style={{ color: inkSoft, fontStyle: 'normal' }}>contraseña</span>?
        </div>
        <div style={{ fontSize: 13, color: '#4B5563', marginTop: 14, lineHeight: 1.55 }}>
          Ponnos tu email y te enviaremos un enlace para crear una nueva.
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: 36 }}>
        <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: muted, marginBottom: 10, fontWeight: 500 }}>
          Email
        </div>
        <div style={{ position: 'relative' }}>
          <Mail style={{
            position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
            width: 16, height: 16, color: muted,
          }} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            autoFocus
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              borderBottom: `1px solid ${rule}`,
              padding: '12px 0 12px 26px',
              fontSize: 16,
              color: ink,
              outline: 'none',
              fontFamily: 'Inter, sans-serif',
            }}
            onFocus={(e) => { e.target.style.borderBottomColor = ink; }}
            onBlur={(e) => { e.target.style.borderBottomColor = rule; }}
          />
        </div>

        {(localError || error) && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            color: '#C67D5E', marginTop: 16, fontSize: 12,
          }}>
            <AlertCircle style={{ width: 14, height: 14, flexShrink: 0 }} />
            <span>{localError || error}</span>
          </div>
        )}

        <div style={{ marginTop: 28 }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? muted : ink,
              color: paper,
              border: 'none', padding: '16px 18px',
              fontSize: 13, fontWeight: 500, letterSpacing: 0.3,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Inter, sans-serif',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}
          >
            <span>{loading ? 'Enviando...' : 'Enviar enlace de recuperación'}</span>
            {!loading && <span aria-hidden="true">→</span>}
          </button>
        </div>
      </form>

      <div style={{ flex: 1 }} />

      <div style={{ marginTop: 28, textAlign: 'center', fontSize: 13, color: '#4B5563' }}>
        ¿Te acuerdas ya?{' '}
        <button
          onClick={onGoToLogin}
          style={{
            background: 'none', border: 'none', color: ink,
            fontWeight: 500, cursor: 'pointer', padding: 0,
            textDecoration: 'underline', textUnderlineOffset: 3,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Iniciar sesión
        </button>
      </div>
    </Shell>
  );
}
