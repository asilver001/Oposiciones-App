/**
 * EditorialTiempoStep — Step 2 of editorial onboarding.
 * Pick daily minutes (5-60) with giant serif counter and range slider.
 */

import React, { useState } from 'react';
import EditorialOnboardingShell from './EditorialOnboardingShell';
import { OS } from '../editorial/EditorialPrimitives';

function toneForMinutes(min) {
  if (min <= 10) return 'Un buen paseo diario.';
  if (min <= 20) return 'El ritmo recomendado.';
  if (min <= 40) return 'Ritmo alto, cuida los descansos.';
  return 'Ritmo intenso. Descansa un día a la semana.';
}

export default function EditorialTiempoStep({
  initialMinutes = 15,
  onSelect,
  onBack,
}) {
  const [value, setValue] = useState(initialMinutes);

  return (
    <EditorialOnboardingShell
      stepNumber={2}
      stepLabel="Tiempo"
      eyebrow="Tu ritmo"
      headline="¿Cuántos minutos al"
      headlineAccent="día?"
      helperText="Sin agobios. Lo pequeño y constante gana a lo grande y esporádico."
      onBack={onBack}
      primaryLabel="Continuar"
      onPrimary={() => onSelect?.(value)}
    >
      <div
        style={{
          marginTop: 20,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: 280,
        }}
      >
        <div
          style={{
            fontFamily: OS.serif,
            fontSize: 120,
            color: OS.ink,
            lineHeight: 1,
            letterSpacing: -4,
            fontVariantNumeric: 'tabular-nums',
          }}
          aria-live="polite"
        >
          {value}
        </div>
        <div
          style={{
            fontSize: 11,
            color: OS.muted,
            letterSpacing: 2,
            textTransform: 'uppercase',
            marginTop: 4,
            fontWeight: 500,
          }}
        >
          minutos al día
        </div>

        <div style={{ marginTop: 42, padding: '0 8px' }}>
          <input
            type="range"
            min="5"
            max="60"
            step="5"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            aria-label="Minutos al día"
            style={{ width: '100%', accentColor: OS.ink }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 8,
              fontSize: 10,
              color: OS.muted,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            <span>5 min</span>
            <span>30 min</span>
            <span>60 min</span>
          </div>
        </div>

        <div
          style={{
            marginTop: 36,
            fontSize: 12,
            color: OS.inkSoft,
            fontStyle: 'italic',
            fontFamily: OS.serif,
          }}
        >
          {toneForMinutes(value)}
        </div>
      </div>
    </EditorialOnboardingShell>
  );
}
