/**
 * EditorialFechaStep — Step 3 of editorial onboarding.
 * Pick exam date (preset or manual) with plan recap at the bottom.
 */

import React, { useMemo, useState } from 'react';
import EditorialOnboardingShell, { OnboardingOption } from './EditorialOnboardingShell';
import { Eyebrow, OS } from '../editorial/EditorialPrimitives';

function formatDateSpanish(date) {
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const d = new Date(date);
  return `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
}

function daysUntil(date) {
  if (!date) return null;
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((target - today) / (1000 * 60 * 60 * 24)));
}

function estimatedExamDate() {
  // Next mid-April (common civil service date)
  const today = new Date();
  const target = new Date(today.getFullYear(), 3, 15); // April is month 3 (0-indexed)
  if (target < today) target.setFullYear(target.getFullYear() + 1);
  return target;
}

export default function EditorialFechaStep({
  onSelect,
  onBack,
  dailyMinutes = 15,
}) {
  const [choice, setChoice] = useState('estimated'); // 'estimated' | 'none' | 'custom'
  const [customDate, setCustomDate] = useState('');

  const estimated = useMemo(() => estimatedExamDate(), []);
  const resolvedDate =
    choice === 'estimated'
      ? estimated
      : choice === 'custom' && customDate
        ? new Date(customDate)
        : null;
  const days = daysUntil(resolvedDate);

  const planText = resolvedDate
    ? `${dailyMinutes} minutos al día durante ${days} días, hasta el examen del ${formatDateSpanish(resolvedDate)}.`
    : `${dailyMinutes} minutos al día. Fijaremos horizonte cuando haya convocatoria.`;

  return (
    <EditorialOnboardingShell
      stepNumber={3}
      stepLabel="Fecha"
      eyebrow="El horizonte"
      headline="¿Cuándo es el"
      headlineAccent="examen?"
      helperText="Si aún no hay convocatoria, pon una fecha orientativa. El Radar BOE te avisará cuando se publique."
      onBack={onBack}
      primaryLabel="Empezar"
      onPrimary={() => onSelect?.(resolvedDate ? resolvedDate.toISOString() : null)}
      footer={
        <>
          <Eyebrow>Tu plan</Eyebrow>
          <div
            style={{
              fontFamily: OS.serif,
              fontSize: 17,
              color: OS.ink,
              lineHeight: 1.3,
              letterSpacing: -0.2,
            }}
          >
            <span style={{ fontStyle: 'italic' }}>{dailyMinutes} minutos al día</span>
            {resolvedDate && <> durante <span style={{ fontStyle: 'italic' }}>{days} días</span>, hasta el examen del {formatDateSpanish(resolvedDate)}.</>}
            {!resolvedDate && <>. Fijaremos horizonte cuando haya convocatoria.</>}
          </div>
        </>
      }
    >
      <div style={{ marginTop: 8 }}>
        <Eyebrow>Convocatorias estimadas</Eyebrow>
        <OnboardingOption
          firstInGroup
          title={formatDateSpanish(estimated)}
          meta="Estimado · turno libre"
          selected={choice === 'estimated'}
          onClick={() => setChoice('estimated')}
        />
        <OnboardingOption
          title="Sin fecha definida"
          meta="Decidir más tarde"
          selected={choice === 'none'}
          onClick={() => setChoice('none')}
        />

        {/* Manual date */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 4px',
            borderBottom: `1px solid ${choice === 'custom' ? OS.ink : OS.rule}`,
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: OS.serif, fontSize: 19, color: OS.ink, letterSpacing: -0.25 }}>
              Otra fecha
            </div>
            <input
              type="date"
              value={customDate}
              onChange={(e) => {
                setCustomDate(e.target.value);
                setChoice('custom');
              }}
              aria-label="Fecha del examen"
              style={{
                marginTop: 6,
                background: 'transparent',
                border: 'none',
                fontSize: 13,
                color: OS.muted,
                fontFamily: OS.sans,
                padding: 0,
              }}
            />
          </div>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              border: `1.5px solid ${choice === 'custom' ? OS.ink : OS.rule}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {choice === 'custom' && (
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: OS.ink }} />
            )}
          </div>
        </div>
      </div>
    </EditorialOnboardingShell>
  );
}
