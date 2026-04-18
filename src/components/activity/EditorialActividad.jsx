/**
 * EditorialActividad — calendar heatmap + summary + session log
 *
 * Faithful to Claude Design:
 *   /tmp/claude-design/oposita-smart/project/screens/actividad.jsx
 *
 * Mobile (<1024px): 12-week heatmap + 3-stat strip + recent sessions list
 * Desktop (>=1024px): 26-week heatmap + 4-stat strip + 1.3fr/1fr grid
 *                     (sessions log + per-topic rail with observation)
 */

import React, { useMemo } from 'react';
import {
  Masthead, Eyebrow, Headline, PullQuote, EditorialStat, UnfurlBar,
  useReveal, useMediaQuery, OS,
} from '../editorial/EditorialPrimitives';

// ------ Helpers ------

function buildHeatmap(sessionHistory, weeksBack) {
  // Output: array of `weeksBack` weeks, each with 7 intensity levels 0..3
  // Intensity based on total questions that day vs daily max
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const byDate = new Map();
  (sessionHistory || []).forEach((s) => {
    const d = new Date(s.startedAt || s.started_at || s.date || s.completedAt || Date.now());
    d.setHours(0, 0, 0, 0);
    const key = d.toISOString().slice(0, 10);
    byDate.set(key, (byDate.get(key) || 0) + (s.totalQuestions || s.total_questions || 1));
  });

  const maxQ = Math.max(1, ...Array.from(byDate.values()));

  const weeks = [];
  // Find current week's Monday
  const monday = new Date(today);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  for (let w = weeksBack - 1; w >= 0; w--) {
    const weekStart = new Date(monday);
    weekStart.setDate(weekStart.getDate() - w * 7);
    const days = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + d);
      if (day > today) {
        days.push(-1); // future
      } else {
        const key = day.toISOString().slice(0, 10);
        const q = byDate.get(key) || 0;
        if (q === 0) days.push(0);
        else if (q / maxQ < 0.33) days.push(1);
        else if (q / maxQ < 0.66) days.push(2);
        else days.push(3);
      }
    }
    weeks.push(days);
  }
  return weeks;
}

function heatColor(v) {
  if (v === -1) return 'transparent';
  return [OS.ruleSoft, 'rgba(45,106,79,0.35)', 'rgba(45,106,79,0.7)', OS.ink][v] || OS.ruleSoft;
}

function formatDateShort(d) {
  if (!d) return '';
  const date = new Date(d);
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${date.getDate()} ${months[date.getMonth()]}`;
}

function buildRecentSessions(sessionHistory) {
  const modeLabels = {
    'practica-tema': 'Práctica por tema',
    'repaso-errores': 'Repaso de errores',
    'test-rapido': 'Test rápido',
    simulacro: 'Simulacro completo',
    flashcards: 'Flashcards',
    lectura: 'Lectura guiada',
  };
  return (sessionHistory || []).slice(0, 8).map((s) => {
    const total = s.totalQuestions || s.total_questions || 0;
    const correct = s.correctAnswers || s.correct_answers || 0;
    const modeLabel = modeLabels[s.sessionType || s.session_type] || 'Sesión';
    const tema = s.temaFilter || s.tema_filter;
    const temaTxt = Array.isArray(tema) && tema.length === 1 ? ` · Tema ${tema[0]}` : '';
    const acc = total > 0 ? Math.round((correct / total) * 100) : null;
    const mins = Math.max(1, Math.round((s.timeSpentSeconds || s.time_spent_seconds || 60) / 60));
    return {
      date: formatDateShort(s.startedAt || s.started_at || s.completedAt || s.date || Date.now()),
      label: modeLabel + temaTxt,
      fraction: total > 0 ? `${correct} / ${total}` : '—',
      accuracy: acc === null ? '—' : `${acc}%`,
      duration: `${mins} min`,
    };
  });
}

function useMonthLabels(weeks) {
  return useMemo(() => {
    if (!weeks.length) return [];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const labels = [];
    const today = new Date();
    const seen = new Set();
    for (let i = 0; i < weeks.length; i++) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - ((weeks.length - 1 - i) * 7));
      const m = months[weekStart.getMonth()];
      if (!seen.has(m)) {
        seen.add(m);
        labels.push(m);
      }
    }
    return labels;
  }, [weeks]);
}

// ------ MOBILE ------

function ActividadMobile({ stats, recentSessions, heatmap, monthLabels }) {
  const rev0 = useReveal(0);
  const rev1 = useReveal(200);

  return (
    <div style={{
      minHeight: '100vh', padding: '20px 22px 40px',
      background: OS.paper, fontFamily: OS.sans,
    }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <Masthead label={`Actividad · últimos ${heatmap.length * 7} días`} />

        <div style={{ ...rev0, marginTop: 22 }}>
          <Headline size={36} italic as="h1">
            Tu <span style={{ color: OS.inkSoft, fontStyle: 'normal' }}>constancia</span>.
          </Headline>
        </div>

        <div style={{
          marginTop: 26, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          gap: 16, padding: '18px 0',
          borderTop: `1px solid ${OS.rule}`, borderBottom: `1px solid ${OS.rule}`,
        }}>
          <EditorialStat value={stats.streak} label="racha" size={38} delay={200} />
          <EditorialStat value={stats.daysActive} label="días activos" size={38} delay={300} color={OS.inkSoft} />
          <EditorialStat value={stats.totalQuestions} label="preguntas" size={38} delay={400} color={OS.muted} />
        </div>

        <div style={{ ...rev1, marginTop: 28 }}>
          <Eyebrow>Mapa de {heatmap.length} semanas</Eyebrow>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${heatmap.length}, 1fr)`,
            gap: 3,
          }}>
            {heatmap.map((wk, wi) => (
              <div key={wi} style={{ display: 'grid', gridTemplateRows: 'repeat(7, 1fr)', gap: 3 }}>
                {wk.map((v, di) => (
                  <div key={di} style={{
                    aspectRatio: '1', borderRadius: 2,
                    background: heatColor(v),
                  }} />
                ))}
              </div>
            ))}
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            marginTop: 8, fontSize: 9, color: OS.muted, letterSpacing: 1,
          }}>
            {monthLabels.map((m, i) => <span key={i}>{m}</span>)}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            marginTop: 12, fontSize: 10, color: OS.muted,
          }}>
            <span>Menos</span>
            {[0, 1, 2, 3].map((v) => (
              <div key={v} style={{
                width: 10, height: 10, borderRadius: 2, background: heatColor(v),
              }} />
            ))}
            <span>Más</span>
          </div>
        </div>

        <div style={{ marginTop: 36 }}>
          <Masthead label="Últimas sesiones" />
          {recentSessions.length === 0 ? (
            <div style={{
              marginTop: 14, padding: '24px 0', fontSize: 13, color: OS.muted,
              fontStyle: 'italic', fontFamily: OS.serif,
            }}>
              Aún no hay sesiones. Empieza una desde Inicio.
            </div>
          ) : (
            <div style={{ marginTop: 14 }}>
              {recentSessions.map((s, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '56px 1fr 48px 52px',
                  gap: 10, padding: '12px 0', borderBottom: `1px solid ${OS.rule}`,
                  alignItems: 'baseline',
                }}>
                  <div style={{ fontFamily: OS.serif, fontSize: 11, fontStyle: 'italic', color: OS.muted }}>{s.date}</div>
                  <div style={{ fontFamily: OS.serif, fontSize: 15, color: OS.ink, letterSpacing: -0.2 }}>{s.label}</div>
                  <div style={{
                    fontSize: 12, color: s.accuracy === '—' ? OS.muted : OS.ink,
                    textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 500,
                  }}>{s.accuracy}</div>
                  <div style={{
                    fontSize: 11, color: OS.muted,
                    textAlign: 'right', fontVariantNumeric: 'tabular-nums',
                  }}>{s.duration}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ------ DESKTOP ------

function ActividadDesktop({ stats, recentSessions, heatmap, monthLabels, topicBars, observation }) {
  const rev0 = useReveal(0);

  return (
    <div style={{
      minHeight: '100vh', padding: '40px 56px',
      background: OS.paper, fontFamily: OS.sans,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={rev0}>
          <Masthead label={`Actividad · últimos ${Math.round(heatmap.length / 4)} meses`} />
          <div style={{
            marginTop: 32, display: 'grid',
            gridTemplateColumns: '1.2fr 1fr', gap: 60, alignItems: 'end',
          }}>
            <Headline size={60} italic as="h1">
              Tu <span style={{ color: OS.inkSoft, fontStyle: 'normal' }}>constancia</span>, en un vistazo.
            </Headline>
            <div style={{ paddingBottom: 8, fontSize: 14, color: OS.textMuted, lineHeight: 1.6 }}>
              {stats.totalQuestions} preguntas respondidas en {stats.daysActive} días activos.
              {stats.streak > 0 && <> La racha actual es de {stats.streak} {stats.streak === 1 ? 'día' : 'días'}.</>}
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 40, padding: '24px 0',
          borderTop: `1px solid ${OS.rule}`, borderBottom: `1px solid ${OS.rule}`,
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40,
        }}>
          <EditorialStat value={stats.streak} label="racha actual" size={58} delay={200} />
          <EditorialStat value={stats.daysActive} suffix={`/${stats.periodDays}`} label="días activos" size={58} delay={300} color={OS.inkSoft} />
          <EditorialStat value={stats.totalQuestions} label="preguntas" size={58} delay={400} color={OS.muted} />
          <EditorialStat value={stats.accuracy} suffix="%" label="precisión media" size={58} delay={500} color={OS.gold} />
        </div>

        <div style={{ marginTop: 44 }}>
          <Eyebrow>Mapa de estudio · una celda por día</Eyebrow>
          <div style={{ display: 'flex', gap: 4, marginTop: 18 }}>
            {heatmap.map((wk, wi) => (
              <div key={wi} style={{
                display: 'grid', gridTemplateRows: 'repeat(7, 20px)', gap: 4,
              }}>
                {wk.map((v, di) => (
                  <div key={di} style={{
                    width: 20, borderRadius: 3, background: heatColor(v),
                  }} />
                ))}
              </div>
            ))}
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            marginTop: 12, fontSize: 11, color: OS.muted,
            letterSpacing: 1, textTransform: 'uppercase', fontWeight: 500,
          }}>
            {monthLabels.map((m, i) => <span key={i}>{m}</span>)}
          </div>
        </div>

        <div style={{
          marginTop: 52, display: 'grid',
          gridTemplateColumns: '1.3fr 1fr', gap: 72,
        }}>
          <div>
            <Masthead label="Últimas sesiones" />
            {recentSessions.length === 0 ? (
              <div style={{
                marginTop: 20, padding: '24px 0', fontSize: 14, color: OS.muted,
                fontStyle: 'italic', fontFamily: OS.serif,
              }}>
                Aún no hay sesiones registradas.
              </div>
            ) : (
              <div style={{ marginTop: 20 }}>
                {recentSessions.map((s, i) => (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '72px 1fr 80px 52px 52px',
                    gap: 16, padding: '14px 0', borderBottom: `1px solid ${OS.rule}`,
                    alignItems: 'baseline',
                  }}>
                    <div style={{ fontFamily: OS.serif, fontSize: 12, fontStyle: 'italic', color: OS.muted }}>{s.date}</div>
                    <div style={{ fontFamily: OS.serif, fontSize: 17, color: OS.ink, letterSpacing: -0.2 }}>{s.label}</div>
                    <div style={{ fontSize: 12, color: OS.muted, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{s.fraction}</div>
                    <div style={{
                      fontSize: 13, color: s.accuracy === '—' ? OS.muted : OS.ink,
                      textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 500,
                    }}>{s.accuracy}</div>
                    <div style={{
                      fontSize: 11, color: OS.muted,
                      textAlign: 'right', fontVariantNumeric: 'tabular-nums',
                    }}>{s.duration}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ paddingLeft: 40, borderLeft: `1px solid ${OS.rule}` }}>
            <Eyebrow>Preguntas por tema · últimas 4 semanas</Eyebrow>
            {topicBars.length > 0 ? (
              <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {topicBars.map(([label, q, p]) => (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ fontFamily: OS.serif, fontSize: 14, color: OS.ink, letterSpacing: -0.1 }}>
                        {label}
                      </div>
                      <div style={{ fontSize: 11, color: OS.muted, fontVariantNumeric: 'tabular-nums' }}>
                        {q} preguntas
                      </div>
                    </div>
                    <UnfurlBar value={p} delay={600} color={OS.inkSoft} height={3} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                marginTop: 20, fontSize: 13, color: OS.muted,
                fontStyle: 'italic', fontFamily: OS.serif,
              }}>
                Sin datos por tema todavía.
              </div>
            )}

            {observation && (
              <div style={{
                marginTop: 40, padding: '22px 0', borderTop: `1px solid ${OS.rule}`,
              }}>
                <PullQuote
                  label="Observación"
                  title={observation.title}
                  body={observation.body}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ------ DISPATCHER ------

export default function EditorialActividad({
  sessionHistory = [],
  totalStats = {},
  streak = {},
  fsrsStats: _fsrsStats = null,
  simulacroAvg: _simulacroAvg = 0,
  weeklyData: _weeklyData = [],
}) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const weeksBack = isDesktop ? 26 : 12;

  const heatmap = useMemo(() => buildHeatmap(sessionHistory, weeksBack), [sessionHistory, weeksBack]);
  const monthLabels = useMonthLabels(heatmap);
  const recentSessions = useMemo(() => buildRecentSessions(sessionHistory), [sessionHistory]);

  const stats = useMemo(() => {
    const daysActive = new Set(
      (sessionHistory || []).map((s) => {
        const d = new Date(s.startedAt || s.started_at || s.date || s.completedAt || Date.now());
        d.setHours(0, 0, 0, 0);
        return d.toISOString().slice(0, 10);
      })
    ).size;
    return {
      streak: streak?.current || 0,
      daysActive,
      totalQuestions: totalStats?.questionsAnswered ||
        (sessionHistory || []).reduce((sum, s) => sum + (s.totalQuestions || 0), 0),
      accuracy: Math.round(totalStats?.accuracyRate || 0),
      periodDays: weeksBack * 7,
    };
  }, [sessionHistory, totalStats, streak, weeksBack]);

  const topicBars = useMemo(() => {
    // Aggregate questions per tema over last 4 weeks
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
    const byTema = new Map();
    (sessionHistory || []).forEach((s) => {
      const date = new Date(s.startedAt || s.started_at || s.date || s.completedAt || Date.now());
      if (date < fourWeeksAgo) return;
      const temaArr = s.temaFilter || s.tema_filter || [];
      const total = s.totalQuestions || s.total_questions || 0;
      const correct = s.correctAnswers || s.correct_answers || 0;
      if (!Array.isArray(temaArr) || temaArr.length !== 1) return;
      const key = `Tema ${temaArr[0]}`;
      const prev = byTema.get(key) || { q: 0, c: 0 };
      byTema.set(key, { q: prev.q + total, c: prev.c + correct });
    });
    return Array.from(byTema.entries())
      .sort(([, a], [, b]) => b.q - a.q)
      .slice(0, 5)
      .map(([label, { q, c }]) => [label, q, q > 0 ? Math.round((c / q) * 100) : 0]);
  }, [sessionHistory]);

  const observation = null; // TODO: generate from real data once we have day-of-week stats

  const props = { stats, recentSessions, heatmap, monthLabels, topicBars, observation };

  return isDesktop ? <ActividadDesktop {...props} /> : <ActividadMobile {...props} />;
}
