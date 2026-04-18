/**
 * GuestProgressStrip — editorial banner shown on the home when the visitor
 * is a guest with at least one completed session. Serves two purposes:
 *   (a) surface the mini-progress they've built so they feel some momentum
 *   (b) nudge them to create an account to preserve it before TTL kicks in
 *
 * Stats come from getGuestStats(); the "guarda tu progreso" banner appears
 * after 2+ sessions and is dismissable for the session.
 */

import React, { useState } from 'react';
import { X } from 'lucide-react';
import {
  getGuestStats,
  isSignupPromptDismissed,
  dismissSignupPrompt,
} from '../guestStorage';

const ink = '#1B4332';
const inkSoft = '#2D6A4F';
const paper = '#F3F3F0';
const muted = '#8A8783';
const rule = 'rgba(27,67,50,0.12)';
const serif = '"Instrument Serif", Georgia, serif';

export default function GuestProgressStrip({ onSignup, onStartSession }) {
  const stats = getGuestStats();
  const [dismissed, setDismissed] = useState(isSignupPromptDismissed());

  if (!stats || stats.totalSessions === 0) return null;

  const showPrompt = !dismissed && stats.totalSessions >= 2;

  const handleDismiss = () => {
    dismissSignupPrompt();
    setDismissed(true);
  };

  return (
    <div style={{ marginTop: 24 }}>
      {/* Mini progress strip */}
      <div
        style={{
          padding: '18px 0',
          borderTop: `1px solid ${rule}`,
          borderBottom: `1px solid ${rule}`,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 18,
        }}
      >
        {[
          ['sesiones', stats.totalSessions],
          ['preguntas', stats.totalAnswered],
          ['precisión', `${stats.accuracy}%`],
        ].map(([label, value]) => (
          <div key={label}>
            <div
              style={{
                fontFamily: serif,
                fontSize: 36,
                color: ink,
                lineHeight: 1,
                letterSpacing: -1,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {value}
            </div>
            <div
              style={{
                fontSize: 10,
                color: muted,
                marginTop: 8,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Eyebrow: sessions left */}
      <div
        style={{
          marginTop: 14,
          fontSize: 11,
          color: stats.sessionsLeft > 0 ? muted : inkSoft,
          fontFamily: serif,
          fontStyle: 'italic',
          letterSpacing: -0.1,
        }}
      >
        {stats.sessionsLeft > 0
          ? `Te quedan ${stats.sessionsLeft} ${stats.sessionsLeft === 1 ? 'sesión gratuita' : 'sesiones gratuitas'}.`
          : 'Has completado las 5 sesiones gratuitas.'}
      </div>

      {/* Sign-up prompt after 2+ sessions */}
      {showPrompt && (
        <div
          style={{
            marginTop: 20,
            padding: '18px 20px',
            background: 'rgba(45,106,79,0.06)',
            borderLeft: `2px solid ${ink}`,
            display: 'flex',
            gap: 16,
            alignItems: 'flex-start',
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 10,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: muted,
                fontWeight: 500,
                marginBottom: 6,
              }}
            >
              Guarda tu progreso
            </div>
            <div
              style={{
                fontFamily: serif,
                fontSize: 18,
                color: ink,
                letterSpacing: -0.2,
                lineHeight: 1.25,
                marginBottom: 8,
              }}
            >
              Tus datos viven solo en este navegador.
            </div>
            <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.5, margin: 0 }}>
              Si borras cookies o cambias de dispositivo, se perderán. Crea una
              cuenta (gratis, en 30 segundos) y los moveremos contigo.
            </p>
            <div style={{ marginTop: 14, display: 'flex', gap: 16, alignItems: 'center' }}>
              <button
                onClick={onSignup}
                style={{
                  background: ink,
                  color: paper,
                  border: 'none',
                  padding: '10px 18px',
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: 0.3,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Crear cuenta →
              </button>
              {stats.sessionsLeft > 0 && onStartSession && (
                <button
                  onClick={onStartSession}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: ink,
                    fontSize: 12,
                    fontWeight: 500,
                    letterSpacing: 0.3,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    textUnderlineOffset: 3,
                    fontFamily: 'Inter, sans-serif',
                    padding: 0,
                  }}
                >
                  Seguir probando
                </button>
              )}
            </div>
          </div>
          <button
            onClick={handleDismiss}
            aria-label="Cerrar aviso"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              color: muted,
              flexShrink: 0,
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
