/**
 * EditorialResultsStep — final onboarding screen before entering the app.
 * Shows the personalized plan as an editorial summary.
 */

import React from 'react';
import {
  Masthead, Eyebrow, Headline, EditorialButton, EditorialStat, PullQuote,
  useReveal, OS,
} from '../editorial/EditorialPrimitives';

function daysUntil(isoDate) {
  if (!isoDate) return null;
  const target = new Date(isoDate);
  target.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((target - today) / (1000 * 60 * 60 * 24)));
}

function formatDateSpanish(isoDate) {
  if (!isoDate) return null;
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const d = new Date(isoDate);
  return `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
}

export default function EditorialResultsStep({ userData, onStart }) {
  const dailyMinutes = userData?.dailyStudyTime || 15;
  const examDate = userData?.examDate || null;
  const days = daysUntil(examDate);
  const dateLabel = formatDateSpanish(examDate);

  const rev0 = useReveal(0);
  const rev1 = useReveal(180);
  const rev2 = useReveal(360);

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '44px 24px 32px',
        background: OS.paper,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: OS.sans,
        color: OS.text,
      }}
    >
      <div style={{
        maxWidth: 560, width: '100%', margin: '0 auto',
        display: 'flex', flexDirection: 'column', flex: 1,
      }}>
        <div style={rev0}>
          <Masthead label="Listo · tu plan" meta={`Paso 4 de 4`} />
        </div>

        <div style={{ ...rev1, marginTop: 40 }}>
          <Eyebrow>Tu plan personalizado</Eyebrow>
          <Headline size={40} italic as="h1">
            Todo{' '}
            <span style={{ color: OS.inkSoft, fontStyle: 'normal' }}>listo</span>.
          </Headline>
          <div style={{ fontSize: 14, color: OS.textMuted, marginTop: 14, lineHeight: 1.55 }}>
            Lo has configurado tú, no nosotros. Puedes cambiarlo cuando quieras desde Ajustes.
          </div>
        </div>

        <div style={{
          ...rev2,
          marginTop: 40,
          padding: '24px 0',
          borderTop: `1px solid ${OS.rule}`,
          borderBottom: `1px solid ${OS.rule}`,
          display: 'grid',
          gridTemplateColumns: days !== null ? '1fr 1fr' : '1fr',
          gap: 24,
        }}>
          <EditorialStat
            value={dailyMinutes}
            suffix="m"
            label="al día"
            size={56}
            delay={400}
          />
          {days !== null && (
            <EditorialStat
              value={days}
              label="días hasta el examen"
              size={56}
              delay={500}
              color={OS.inkSoft}
            />
          )}
        </div>

        <div style={{ marginTop: 36 }}>
          <PullQuote
            label="Primera sesión"
            title="Empezamos por lo básico."
            body={`Vas a tener ${dailyMinutes} minutos de preguntas sobre el Tema 1 (Constitución). Si acertamos, la próxima vez iremos al Tema 2. Si fallas, volveremos.`}
          />
        </div>

        {dateLabel && (
          <div style={{
            marginTop: 28, fontSize: 12, color: OS.muted,
            fontStyle: 'italic', fontFamily: OS.serif, lineHeight: 1.5,
          }}>
            Convocatoria estimada: {dateLabel}.
          </div>
        )}

        <div style={{ flex: 1 }} />

        <div style={{ marginTop: 28 }}>
          <EditorialButton variant="primary" icon="→" size="lg" onClick={onStart}>
            Comenzar ahora
          </EditorialButton>
        </div>
      </div>
    </div>
  );
}
