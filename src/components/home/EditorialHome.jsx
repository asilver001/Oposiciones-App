/**
 * EditorialHome — "Calma Editorial" redesign of the daily home.
 *
 * Faithful implementation of Claude Design handoff (2026-04-18):
 *   /tmp/claude-design/oposita-smart/project/screens/home.jsx
 *
 * Renders HomeMobile (< 1024px) or HomeDesktop (>= 1024px).
 * The design file's MobileTabBar/DesktopSideNav are NOT rendered here;
 * the app's MainLayout provides navigation.
 */

import React from 'react';
import {
  Masthead, Eyebrow, Headline, PullQuote, EditorialButton, EditorialStat,
  StudyModeRow, UnfurlBar, useReveal, useCountUp, useMediaQuery, OS,
} from '../editorial/EditorialPrimitives';

// ========== SHARED DATA ==========

const STUDY_MODES = [
  { id: 'test-rapido',    num: '01', title: 'Test rápido',          meta: '10 preguntas · 5 min' },
  { id: 'practica-tema',  num: '02', title: 'Práctica de tema',     meta: '20 preguntas · 15 min' },
  { id: 'repaso-errores', num: '03', title: 'Repaso de errores',    meta: '20 preguntas · 15 min' },
  { id: 'flashcards',     num: '04', title: 'Flashcards',           meta: '20 tarjetas · 10 min' },
  { id: 'simulacro',      num: '05', title: 'Simulacro completo',   meta: '100 preguntas · 60 min' },
  { id: 'lectura',        num: '06', title: 'Lectura guiada',       meta: 'Libre' },
];

const DAYS_SHORT_MOBILE = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const DAYS_SHORT_DESKTOP = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

function formatTodayLabelMobile() {
  const d = new Date();
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${days[d.getDay()]} · ${d.getDate()} ${months[d.getMonth()]}`;
}

function formatTodayLabelDesktop() {
  const d = new Date();
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  return `${days[d.getDay()]} · ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 20) return 'Buenas tardes';
  return 'Buenas noches';
}

function useHomeData({
  totalStats = {},
  streakData = {},
  fortalezaData = [],
  studyPlan = {},
  weeklyImprovement = 0,
  weeklyData = [0, 0, 0, 0, 0, 0, 0],
}) {
  const primaryActivity = studyPlan?.activities?.[0] || null;
  const questionCount = primaryActivity?.config?.totalQuestions || 20;
  const reviewCount = primaryActivity?.config?.reviewCount || 0;
  const estimatedMinutes = Math.max(5, Math.round(questionCount * 0.75));
  const topicLabel =
    primaryActivity?.topicName ||
    primaryActivity?.config?.topic?.name ||
    fortalezaData?.[0]?.name ||
    'Práctica general';
  const currentStreak = streakData?.current || 0;
  const examDays = studyPlan?.examCountdown?.daysUntilExam ?? 142;
  const examLabel = studyPlan?.examCountdown?.oposicion || 'Auxiliar Administrativo AGE';
  const accuracy = Math.round(totalStats?.accuracyRate || 0);
  const accuracyDelta = Math.round(weeklyImprovement || 0);
  const maxWeekly = Math.max(1, ...(weeklyData || []));
  const weeklyNormalized = (weeklyData || [0, 0, 0, 0, 0, 0, 0]).map((v) => v / maxWeekly);

  return {
    primaryActivity,
    questionCount,
    reviewCount,
    estimatedMinutes,
    topicLabel,
    currentStreak,
    examDays,
    examLabel,
    accuracy,
    accuracyDelta,
    weeklyNormalized,
  };
}

// ========== MOBILE ==========

function EditorialHomeMobile({ userName, data, handlers }) {
  const {
    questionCount, reviewCount, estimatedMinutes, topicLabel,
    currentStreak, examDays, examLabel, weeklyNormalized,
  } = data;

  const rev0 = useReveal(0);
  const rev1 = useReveal(120);
  const rev2 = useReveal(240);
  const rev3 = useReveal(360);
  const rev4 = useReveal(480);
  const streakAnimated = useCountUp(currentStreak, 1400, 100);

  return (
    <div style={{
      minHeight: '100vh',
      background: OS.paper,
      padding: '20px 22px 110px',
      fontFamily: OS.sans,
      color: OS.text,
    }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        {/* Masthead */}
        <div style={rev0}>
          <Masthead label="OpositaSmart · Edición diaria" meta={formatTodayLabelMobile()} />
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
            {reviewCount > 0 && <>, con <span style={{ color: OS.ink, fontWeight: 500 }}>{reviewCount} repasos</span></>}.
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
            onClick={handlers.startPrimary}
            ariaLabel="Empezar la sesión de hoy"
          >
            Empezar sesión del día
          </EditorialButton>
        </div>

        {/* Streak line */}
        <div style={{ ...rev2, marginTop: 22, display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{
            fontFamily: OS.serif, fontSize: 42, color: OS.ink,
            letterSpacing: -1, lineHeight: 1, fontVariantNumeric: 'tabular-nums',
          }}>{streakAnimated}</span>
          <span style={{ fontSize: 11, color: OS.muted, letterSpacing: 1.2, textTransform: 'uppercase' }}>
            {currentStreak === 1 ? 'día seguido' : 'días seguidos'}
          </span>
          <span style={{
            marginLeft: 'auto', fontSize: 11, color: OS.inkSoft,
            fontStyle: 'italic', fontFamily: OS.serif,
          }}>"a tu ritmo"</span>
        </div>

        {/* Weekly dots */}
        <div style={{ ...rev2, marginTop: 14, display: 'flex', gap: 6 }} aria-label="Actividad de esta semana">
          {weeklyNormalized.map((v, i) => (
            <div key={i} style={{
              flex: 1, height: 36, borderRadius: 2,
              background: v === 0 ? OS.ruleSoft : OS.ink,
              opacity: v === 0 ? 1 : Math.max(0.25, v),
            }} />
          ))}
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          marginTop: 6, fontSize: 9, color: OS.muted, letterSpacing: 1,
        }}>
          {DAYS_SHORT_MOBILE.map(d => <span key={d}>{d}</span>)}
        </div>

        {/* Other study modes */}
        <section style={{ ...rev3, marginTop: 38 }}>
          <Masthead label="Otros modos" />
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 0 }}>
            {STUDY_MODES.map((m) => (
              <StudyModeRow
                key={m.id} num={m.num} title={m.title} meta={m.meta}
                highlight={data.primaryActivity?.config?.mode === m.id}
                onClick={() => handlers.selectMode(m)}
              />
            ))}
          </div>
        </section>

        {/* Exam countdown */}
        {examDays !== null && examDays !== undefined && (
          <div style={{ ...rev4, marginTop: 40 }}>
            <PullQuote
              label="Convocatoria"
              title={examDays > 0 ? `Faltan ${examDays} días para el examen.` : 'Tu examen ya está aquí.'}
              body={`${examLabel} · Convocatoria 2026`}
            />
          </div>
        )}

        <div style={{
          ...rev4, marginTop: 28, fontSize: 11, color: OS.muted,
          textAlign: 'center', fontStyle: 'italic', fontFamily: OS.serif,
        }}>Sin agobios. Vuelve mañana.</div>
      </div>
    </div>
  );
}

// ========== DESKTOP ==========

function EditorialHomeDesktop({ userName, data, handlers }) {
  const {
    questionCount, reviewCount, estimatedMinutes, topicLabel,
    currentStreak, examDays, examLabel, weeklyNormalized,
    accuracy, accuracyDelta,
  } = data;

  const rev0 = useReveal(0);
  const rev1 = useReveal(120);
  const rev2 = useReveal(220);
  const rev3 = useReveal(340);

  return (
    <div style={{
      minHeight: '100vh',
      background: OS.paper,
      fontFamily: OS.sans,
      color: OS.text,
      display: 'flex',
      justifyContent: 'center',
    }}>
      {/* Content area (no left sidebar — MainLayout handles nav) */}
      <div style={{ flex: 1, maxWidth: 1200, padding: '40px 56px 56px' }}>
        {/* Masthead */}
        <div style={rev0}>
          <Masthead label="OpositaSmart · Edición del día" meta={formatTodayLabelDesktop()} />
        </div>

        {/* Hero grid: 1.4fr lede + 1fr rail */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: 56,
          marginTop: 36,
        }}>
          {/* LEFT COLUMN */}
          <div>
            <div style={rev1}>
              <Eyebrow>La sesión del día</Eyebrow>
              <Headline size={68} italic as="h1">
                {getGreeting()}, {userName}. Hoy te tocan{' '}
                <span style={{ color: OS.inkSoft, fontStyle: 'normal' }}>{questionCount}</span>{' '}
                preguntas.
              </Headline>
              <div style={{ fontSize: 15, color: OS.textMuted, marginTop: 20, lineHeight: 1.6, maxWidth: 480 }}>
                Preparada sobre el{' '}
                <span style={{ color: OS.ink, fontWeight: 500 }}>{topicLabel}</span>
                {reviewCount > 0 && (
                  <>, con <span style={{ color: OS.ink, fontWeight: 500 }}>{reviewCount} repasos</span> pendientes</>
                )}.
                {' '}En torno a {estimatedMinutes} minutos.
              </div>
              <div style={{ marginTop: 30, display: 'flex', gap: 14, maxWidth: 520 }}>
                <div style={{ flex: 1.5 }}>
                  <EditorialButton
                    variant="primary"
                    size="lg"
                    icon="→"
                    subtitle={`${estimatedMinutes} min · ${questionCount} preguntas`}
                    onClick={handlers.startPrimary}
                  >
                    Empezar sesión
                  </EditorialButton>
                </div>
                <div style={{ flex: 1 }}>
                  <EditorialButton
                    variant="secondary"
                    size="lg"
                    onClick={handlers.changePlan}
                  >
                    Cambiar plan
                  </EditorialButton>
                </div>
              </div>
            </div>

            {/* Other modes as 2-col grid */}
            <div style={{ ...rev3, marginTop: 64 }}>
              <Masthead label="Otros modos" />
              <div style={{
                marginTop: 20,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                columnGap: 48,
                rowGap: 4,
              }}>
                {STUDY_MODES.map((m) => (
                  <StudyModeRow
                    key={m.id} num={m.num} title={m.title} meta={m.meta}
                    highlight={data.primaryActivity?.config?.mode === m.id}
                    onClick={() => handlers.selectMode(m)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT RAIL */}
          <div style={{ ...rev2, paddingLeft: 40, borderLeft: `1px solid ${OS.rule}` }}>
            {/* Streak */}
            <div>
              <Eyebrow>Racha</Eyebrow>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                <EditorialStat value={currentStreak} label="días seguidos" delay={200} size={84} />
              </div>
              <div style={{ marginTop: 20, display: 'flex', gap: 4 }}>
                {weeklyNormalized.map((v, i) => (
                  <div key={i} style={{
                    flex: 1, height: 44, borderRadius: 2,
                    background: v === 0 ? OS.ruleSoft : OS.ink,
                    opacity: v === 0 ? 1 : Math.max(0.15, v),
                  }} />
                ))}
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                marginTop: 6, fontSize: 10, color: OS.muted, letterSpacing: 1.5,
              }}>
                {DAYS_SHORT_DESKTOP.map(d => <span key={d}>{d}</span>)}
              </div>
            </div>

            {/* Accuracy */}
            <div style={{ marginTop: 44 }}>
              <Eyebrow>Precisión · últimas sesiones</Eyebrow>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                <EditorialStat value={accuracy} suffix="%" label="aciertos" delay={400} size={56} />
                {accuracyDelta !== 0 && (
                  <div style={{
                    fontSize: 11,
                    color: accuracyDelta > 0 ? OS.inkSoft : OS.warm,
                    fontStyle: 'italic',
                    fontFamily: OS.serif,
                  }}>
                    {accuracyDelta > 0 ? '+' : ''}{accuracyDelta} vs. semana pasada
                  </div>
                )}
              </div>
              <div style={{ marginTop: 16 }}>
                <UnfurlBar value={accuracy} delay={500} color={OS.inkSoft} height={4} />
              </div>
            </div>

            {/* Exam countdown */}
            {examDays !== null && examDays !== undefined && (
              <div style={{
                marginTop: 44,
                padding: '20px 0',
                borderTop: `1px solid ${OS.rule}`,
                borderBottom: `1px solid ${OS.rule}`,
              }}>
                <Eyebrow>Próxima convocatoria</Eyebrow>
                <div style={{
                  fontFamily: OS.serif, fontSize: 28, color: OS.ink,
                  letterSpacing: -0.5, lineHeight: 1.15,
                }}>
                  {examDays > 0
                    ? `Faltan ${examDays} días para el examen.`
                    : 'Tu examen ya está aquí.'}
                </div>
                <div style={{ fontSize: 12, color: OS.muted, marginTop: 10, lineHeight: 1.55 }}>
                  {examLabel} · Turno libre · Convocatoria 2026
                </div>
              </div>
            )}

            {/* Radar BOE teaser */}
            <div style={{ marginTop: 40 }}>
              <Eyebrow>Radar BOE</Eyebrow>
              <div style={{
                fontFamily: OS.serif, fontSize: 15, color: OS.ink,
                lineHeight: 1.45, letterSpacing: -0.1,
              }}>
                Consulta las convocatorias activas y organismos del Estado.
              </div>
              <div style={{ marginTop: 14 }}>
                <EditorialButton
                  variant="ghost"
                  size="sm"
                  icon="→"
                  onClick={handlers.openRadar}
                >
                  Ver radar completo
                </EditorialButton>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 60,
          textAlign: 'center',
          fontSize: 11,
          color: OS.muted,
          fontStyle: 'italic',
          fontFamily: OS.serif,
        }}>
          Sin agobios · Vuelve mañana
        </div>
      </div>
    </div>
  );
}

// ========== DISPATCHER ==========

export default function EditorialHome(props) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const data = useHomeData(props);

  const handlers = {
    startPrimary: () => {
      if (data.primaryActivity && props.onStartActivity) {
        props.onStartActivity(data.primaryActivity);
      } else if (props.onStartSession) {
        props.onStartSession();
      }
    },
    selectMode: (mode) => {
      if (props.onStartActivity) {
        props.onStartActivity({ config: { mode: mode.id, autoStart: false } });
      } else if (props.onStartSession) {
        props.onStartSession({ mode: mode.id });
      }
    },
    changePlan: () => {
      props.onViewAllTopics?.();
    },
    openRadar: () => {
      props.onNavigate?.('radar');
    },
  };

  const userName = props.userName || 'bienvenido/a';

  return isDesktop
    ? <EditorialHomeDesktop userName={userName} data={data} handlers={handlers} />
    : <EditorialHomeMobile userName={userName} data={data} handlers={handlers} />;
}
