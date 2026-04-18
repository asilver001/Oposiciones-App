/**
 * EditorialIntroStep — post-wizard welcome (step 4 of 4).
 *
 * Asks for the user's name and shows a short "cómo funciona" summary
 * in Calma Editorial style.
 */

import React, { useState } from 'react';
import EditorialOnboardingShell from './EditorialOnboardingShell';
import { Eyebrow, OS } from '../editorial/EditorialPrimitives';

export default function EditorialIntroStep({ onStart, onSkip, onBack }) {
  const [nombre, setNombre] = useState('');

  return (
    <EditorialOnboardingShell
      stepNumber={4}
      totalSteps={4}
      stepLabel="Presentación"
      eyebrow="Un último detalle"
      headline="¿Cómo te"
      headlineAccent="llamas?"
      helperText="Opcional. Solo lo usamos para saludarte al entrar. Puedes dejarlo en blanco si prefieres."
      onBack={onBack}
      primaryLabel="Empezar a estudiar"
      onPrimary={() => onStart?.(nombre.trim() || null)}
    >
      <div style={{ marginTop: 8 }}>
        <Eyebrow>Tu nombre</Eyebrow>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Alberto, María, Juan…"
          aria-label="Tu nombre"
          autoFocus
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            borderBottom: `1px solid ${OS.rule}`,
            padding: '12px 0',
            fontSize: 22,
            fontFamily: OS.serif,
            color: OS.ink,
            letterSpacing: -0.3,
            outline: 'none',
          }}
          onFocus={(e) => {
            e.target.style.borderBottomColor = OS.ink;
          }}
          onBlur={(e) => {
            e.target.style.borderBottomColor = OS.rule;
          }}
        />

        <div
          style={{
            marginTop: 40,
            padding: '24px 0',
            borderTop: `1px solid ${OS.rule}`,
            borderBottom: `1px solid ${OS.rule}`,
          }}
        >
          <Eyebrow>Cómo funcionan las sesiones</Eyebrow>
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {[
              'Abres la app, respondes unas preguntas, cierras.',
              'Si fallas, volveremos a verlas en unos días.',
              'Si aciertas, las espaciamos más en el tiempo.',
            ].map((t, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  gap: 12,
                  fontSize: 14,
                  color: OS.text,
                  lineHeight: 1.5,
                  fontFamily: OS.sans,
                }}
              >
                <span style={{
                  fontFamily: OS.serif, fontStyle: 'italic',
                  color: OS.muted, fontSize: 13,
                  fontVariantNumeric: 'tabular-nums', minWidth: 16,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            style={{
              marginTop: 20,
              background: 'none',
              border: 'none',
              color: OS.muted,
              fontSize: 12,
              letterSpacing: 0.3,
              cursor: 'pointer',
              fontFamily: OS.sans,
              padding: 0,
            }}
          >
            Saltar y entrar directamente →
          </button>
        )}
      </div>
    </EditorialOnboardingShell>
  );
}
