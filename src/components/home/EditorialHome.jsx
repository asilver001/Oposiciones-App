/**
 * EditorialHome — "Calma Editorial" redesign of the daily home.
 *
 * Opens like a newspaper: date masthead, leading story (today's session),
 * then study modes as rubric entries, streak as a discrete number,
 * and exam countdown as a pull-quote.
 *
 * Props map 1:1 to the original SoftFortHome to make it swappable.
 */

import React from 'react';
import {
  Masthead, Eyebrow, Headline, PullQuote, EditorialButton,
  StudyModeRow, useReveal, useCountUp, OS,
} from '../editorial/EditorialPrimitives';

const STUDY_MODES = [
  { id: 'test-rapido', num: '01', title: 'Test rápido', meta: '10 preguntas · ~5 min' },
  { id: 'practica-tema', num: '02', title: 'Práctica de tema', meta: '20 preguntas · ~15 min' },
  { id: 'repaso-errores', num: '03', title: 'Repaso de errores', meta: 'Pendientes · ~15 min' },
  { id: 'flashcards', num: '04', title: 'Flashcards', meta: '20 tarjetas · ~10 min' },
  { id: 'simulacro', num: '05', title: 'Simulacro completo', meta: '100 preguntas · 60 min' },
  { id: 'lectura', num: '06', title: 'Lectura guiada', meta: 'Libre' },
];

const DAYS_SHORT = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

function formatTodayLabel() {
  const d = new Date();
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${days[d.getDay()]} · ${d.getDate()} ${months[d.getMonth()]}`;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 20) return 'Buenas tardes';
  return 'Buenas noches';
}

export default function EditorialHome({
  userName = 'bienvenido/a',
  totalStats = {},
  streakData = {},
  fortalezaData = [],
  studyPlan = {},
  weeklyData = [0, 0, 0, 0, 0, 0, 0],
  onStartSession,
  onStartActivity,
  onTopicSelect,
  onNavigate,
}) {
  // Primary activity = first from study plan, fallback to practice-tema
  const primaryActivity = studyPlan?.activities?.[0] || null;
  const questionCount = primaryActivity?.config?.totalQuestions || 20;
  const reviewCount = primaryActivity?.config?.reviewCount || 0;
  const estimatedMinutes = Math.max(5, Math.round(questionCount * 0.75));

  // Topic label for the lede paragraph
  const topicLabel =
    primaryActivity?.topicName ||
    primaryActivity?.config?.topic?.name ||
    (fortalezaData?.[0]?.name) ||
    'Práctica general';

  // Streak
  const currentStreak = streakData?.current || 0;
  const streakAnimated = useCountUp(currentStreak, 1400, 100);

  // Exam countdown
  const examDays = studyPlan?.examCountdown?.daysUntilExam;
  const examLabel = studyPlan?.examCountdown?.oposicion || 'Auxiliar Administrativo AGE';

  const rev0 = useReveal(0);
  const rev1 = useReveal(120);
  const rev2 = useReveal(240);
  const rev3 = useReveal(360);
  const rev4 = useReveal(480);

  // Weekly bar normalization
  const maxWeekly = Math.max(1, ...(weeklyData || []));
  const weeklyNormalized = (weeklyData || [0,0,0,0,0,0,0]).map((v) => v / maxWeekly);

  const handleStartPrimary = () => {
    if (primaryActivity && onStartActivity) {
      onStartActivity(primaryActivity);
    } else if (onStartSession) {
      onStartSession();
    }
  };

  const handleModeClick = (mode) => {
    if (onStartActivity) {
      onStartActivity({ config: { mode: mode.id, autoStart: false } });
    } else if (onStartSession) {
      onStartSession({ mode: mode.id });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: OS.paper,
      padding: '20px 22px 110px',
      fontFamily: OS.sans,
      color: OS.text,
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        {/* Masthead */}
        <div style={rev0}>
          <Masthead label="OpositaSmart · Edición diaria" meta={formatTodayLabel()} />
        </div>

        {/* Greeting + lede */}
        <section style={{ ...rev1, marginTop: 22 }}>
          <Eyebrow>{getGreeting()}, {userName}</Eyebrow>
          <Headline size={40} italic as="h1">
            Hoy te tocan{' '}
            <span style={{ color: OS.inkSoft, fontStyle: 'normal' }}>{questionCount}</span>{' '}
            preguntas.
          </Headline>
          <div style={{ fontSize: 13, color: OS.textMuted, marginTop: 14, lineHeight: 1.55 }}>
            Sesión preparada sobre{' '}
            <span style={{ color: OS.ink, fontWeight: 500 }}>{topicLabel}</span>
            {reviewCount > 0 && (
              <>, con <span style={{ color: OS.ink, fontWeight: 500 }}>{reviewCount} repasos</span></>
            )}.
            {' '}Unos {estimatedMinutes} minutos.
          </div>
        </section>

        {/* Hero CTA */}
        <div style={{ ...rev2, marginTop: 26 }}>
          <EditorialButton
            variant="primary"
            size="lg"
            icon="→"
            subtitle={`${estimatedMinutes} min · ${questionCount} preguntas${reviewCount ? ` · ${reviewCount} repasos` : ''}`}
            onClick={handleStartPrimary}
            ariaLabel="Empezar la sesión de hoy"
          >
            Empezar sesión del día
          </EditorialButton>
        </div>

        {/* Streak line */}
        <div style={{
          ...rev2,
          marginTop: 22,
          display: 'flex',
          alignItems: 'baseline',
          gap: 12,
        }}>
          <span style={{
            fontFamily: OS.serif,
            fontSize: 42,
            color: OS.ink,
            letterSpacing: -1,
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}>{streakAnimated}</span>
          <span style={{
            fontSize: 11,
            color: OS.muted,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
          }}>
            {currentStreak === 1 ? 'día seguido' : 'días seguidos'}
          </span>
          <span style={{
            marginLeft: 'auto',
            fontSize: 11,
            color: OS.inkSoft,
            fontStyle: 'italic',
            fontFamily: OS.serif,
          }}>
            "a tu ritmo"
          </span>
        </div>

        {/* Weekly dots */}
        <div style={{ ...rev2, marginTop: 14, display: 'flex', gap: 6 }} aria-label="Actividad de esta semana">
          {weeklyNormalized.map((v, i) => (
            <div key={i} style={{
              flex: 1,
              height: 36,
              borderRadius: 2,
              background: v === 0 ? OS.ruleSoft : OS.ink,
              opacity: v === 0 ? 1 : Math.max(0.25, v),
            }} />
          ))}
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 6,
          fontSize: 9,
          color: OS.muted,
          letterSpacing: 1,
        }}>
          {DAYS_SHORT.map(d => <span key={d}>{d}</span>)}
        </div>

        {/* Other study modes */}
        <section style={{ ...rev3, marginTop: 38 }}>
          <Masthead label="Otros modos" />
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 0 }}>
            {STUDY_MODES.map((m) => (
              <StudyModeRow
                key={m.id}
                num={m.num}
                title={m.title}
                meta={m.meta}
                highlight={primaryActivity?.config?.mode === m.id}
                onClick={() => handleModeClick(m)}
              />
            ))}
          </div>
        </section>

        {/* Exam countdown pullquote */}
        {examDays !== null && examDays !== undefined && (
          <div style={{ ...rev4, marginTop: 40 }}>
            <PullQuote
              label="Convocatoria"
              title={examDays > 0
                ? `Faltan ${examDays} días para el examen.`
                : 'Tu examen ya está aquí.'}
              body={`${examLabel} · Convocatoria 2026`}
            />
          </div>
        )}

        {/* Footer note */}
        <div style={{
          ...rev4,
          marginTop: 28,
          fontSize: 11,
          color: OS.muted,
          textAlign: 'center',
          fontStyle: 'italic',
          fontFamily: OS.serif,
        }}>
          Sin agobios. Vuelve mañana.
        </div>
      </div>
    </div>
  );
}
