/**
 * EditorialSessionComplete — "Calma Editorial" results screen.
 *
 * Faithful port of Claude Design handoff:
 *   /tmp/claude-design/oposita-smart/project/screens/results.jsx
 *
 * Mobile (<1024px): vertical flow with stats strip, answer bars, pull-quote.
 * Desktop (>=1024px): 1.3fr/1fr grid with right rail listing failed questions.
 */

import React, { useState } from 'react';
import {
  Masthead, Eyebrow, Headline, PullQuote, EditorialButton,
  EditorialStat, useReveal, useMediaQuery, OS,
} from '../editorial/EditorialPrimitives';
import CorrectionView from './CorrectionView';

// ------- Helpers -------

function buildBarData(answersHistory = []) {
  if (!answersHistory.length) return [];
  const times = answersHistory.map((a) => a.timeSeconds || a.time_spent_seconds || 30);
  const maxTime = Math.max(...times, 1);
  return answersHistory.map((a, i) => ({
    heightPercent: Math.max(20, Math.round(((times[i] || 30) / maxTime) * 100)),
    wrong: !a.isCorrect,
    idx: i,
  }));
}

function getFailedQuestions(answersHistory = []) {
  return answersHistory
    .map((a, idx) => ({ ...a, idx: idx + 1 }))
    .filter((a) => !a.isCorrect)
    .slice(0, 5);
}

function formatSessionMeta(sessionStats, answersHistory) {
  const d = new Date();
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  return `${d.getDate()} ${months[d.getMonth()]} · ${hours}:${mins}`;
}

// ------- MOBILE -------

function ResultsMobile({ sessionStats, answersHistory, accuracy, durationMinutes, avgSeconds, failed, handlers }) {
  const rev0 = useReveal(0);
  const rev1 = useReveal(200);
  const rev2 = useReveal(400);
  const rev3 = useReveal(600);
  const bars = buildBarData(answersHistory);

  return (
    <div style={{ minHeight: '100vh', padding: '20px 22px 40px', background: OS.paper, fontFamily: OS.sans }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <div style={rev0}>
          <Masthead label="Sesión completada" meta={formatSessionMeta(sessionStats)} />
        </div>

        <div style={{ ...rev1, marginTop: 28 }}>
          <Eyebrow>Resultado</Eyebrow>
          <Headline size={40} italic as="h1">
            <span style={{ color: OS.inkSoft, fontStyle: 'normal' }}>{sessionStats.correct}</span>
            {' '}de {sessionStats.answered} correctas.
          </Headline>
          <div style={{ fontSize: 13, color: OS.textMuted, marginTop: 14, lineHeight: 1.55 }}>
            Precisión del <b style={{ color: OS.ink }}>{accuracy}%</b>.
            {' '}Has tardado {durationMinutes} {durationMinutes === 1 ? 'minuto' : 'minutos'}.
          </div>
        </div>

        <div style={{
          ...rev2, marginTop: 32,
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          gap: 18, padding: '20px 0',
          borderTop: `1px solid ${OS.rule}`, borderBottom: `1px solid ${OS.rule}`,
        }}>
          <EditorialStat value={accuracy} suffix="%" label="precisión" size={42} delay={400} />
          <EditorialStat value={durationMinutes} suffix="m" label="duración" size={42} delay={500} color={OS.inkSoft} />
          <EditorialStat value={avgSeconds} suffix="s" label="media" size={42} delay={600} color={OS.muted} />
        </div>

        {bars.length > 0 && (
          <div style={{ ...rev3, marginTop: 36 }}>
            <Masthead label="Respuestas, una a una" />
            <div style={{ display: 'flex', gap: 4, marginTop: 18, alignItems: 'flex-end', height: 60 }}>
              {bars.map((b) => (
                <div key={b.idx} style={{
                  flex: 1, height: `${b.heightPercent}%`, borderRadius: 1,
                  background: b.wrong ? OS.warm : OS.ink,
                  opacity: b.wrong ? 1 : 0.85,
                  transition: `height 0.8s ${b.idx * 30}ms ease-out`,
                }} />
              ))}
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginTop: 8, fontSize: 10, color: OS.muted, fontVariantNumeric: 'tabular-nums',
            }}>
              <span>P1</span>
              <span>altura = tiempo</span>
              <span>P{bars.length}</span>
            </div>
          </div>
        )}

        {failed.length > 0 && (
          <div style={{ ...rev3, marginTop: 32 }}>
            <PullQuote
              label="Falladas · programadas para repaso"
              title={failed.length === 1
                ? 'Volverás a verla el viernes.'
                : `Volverás a verlas el viernes.`}
              body="El sistema FSRS las reprogramará según tu rendimiento."
            />
          </div>
        )}

        <div style={{ ...rev3, marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {failed.length > 0 && (
            <EditorialButton variant="primary" icon="→" onClick={handlers.review}>
              Revisar {failed.length === 1 ? 'la fallada' : `las ${failed.length} falladas`}
            </EditorialButton>
          )}
          {handlers.nextActivity && (
            <EditorialButton variant="primary" icon="→" onClick={handlers.nextActivity}>
              Siguiente actividad
            </EditorialButton>
          )}
          <EditorialButton variant="secondary" onClick={handlers.close}>
            Volver al inicio
          </EditorialButton>
        </div>
      </div>
    </div>
  );
}

// ------- DESKTOP -------

function ResultsDesktop({ sessionStats, answersHistory, accuracy, durationMinutes, avgSeconds, delta, failed, topicLabel, handlers }) {
  const rev0 = useReveal(0);
  const rev1 = useReveal(160);
  const rev2 = useReveal(320);
  const bars = buildBarData(answersHistory);

  return (
    <div style={{ minHeight: '100vh', padding: '40px 72px 56px', background: OS.paper, fontFamily: OS.sans }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={rev0}>
          <Masthead
            label={`Sesión completada${topicLabel ? ` · ${topicLabel}` : ''}`}
            meta={formatSessionMeta(sessionStats)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 72, marginTop: 40 }}>
          {/* LEFT */}
          <div style={rev1}>
            <Eyebrow>Resultado</Eyebrow>
            <Headline size={80} italic as="h1">
              <span style={{ color: OS.inkSoft, fontStyle: 'normal' }}>{sessionStats.correct}</span>
              {' '}de {sessionStats.answered}.
            </Headline>
            <div style={{ fontSize: 16, color: OS.textMuted, marginTop: 22, lineHeight: 1.6, maxWidth: 520 }}>
              Precisión del{' '}
              <span style={{ color: OS.ink, fontWeight: 500 }}>{accuracy}%</span>
              {delta !== 0 && (
                <>, <span style={{ color: delta > 0 ? OS.inkSoft : OS.warm, fontWeight: 500 }}>
                  {delta > 0 ? '+' : ''}{delta} puntos</span> respecto a tu media
                </>
              )}.
              {' '}Tardaste {durationMinutes} {durationMinutes === 1 ? 'minuto' : 'minutos'},
              con una media de {avgSeconds} segundos por pregunta.
            </div>

            <div style={{
              marginTop: 48, display: 'flex', gap: 56,
              paddingTop: 24, paddingBottom: 24,
              borderTop: `1px solid ${OS.rule}`, borderBottom: `1px solid ${OS.rule}`,
            }}>
              <EditorialStat value={accuracy} suffix="%" label="precisión" size={72} delay={400} />
              <EditorialStat value={durationMinutes} suffix="m" label="duración" size={72} delay={500} color={OS.inkSoft} />
              {delta !== 0 && (
                <EditorialStat
                  value={Math.abs(delta)}
                  suffix={delta > 0 ? '↑' : '↓'}
                  label="vs. media"
                  size={72}
                  delay={600}
                  color={delta > 0 ? OS.gold : OS.warm}
                />
              )}
            </div>

            {bars.length > 0 && (
              <div style={{ marginTop: 44 }}>
                <Masthead label="Respuestas, una a una" />
                <div style={{ display: 'flex', gap: 5, marginTop: 22, alignItems: 'flex-end', height: 96 }}>
                  {bars.map((b) => (
                    <div key={b.idx} style={{
                      flex: 1, height: `${b.heightPercent}%`, borderRadius: 1,
                      background: b.wrong ? OS.warm : OS.ink,
                      opacity: b.wrong ? 1 : 0.85,
                    }} />
                  ))}
                </div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  marginTop: 10, fontSize: 10, color: OS.muted, fontVariantNumeric: 'tabular-nums',
                }}>
                  <span>P1</span>
                  <span>altura = tiempo de respuesta · rojo = fallo</span>
                  <span>P{bars.length}</span>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT RAIL */}
          <div style={{ ...rev2, paddingLeft: 40, borderLeft: `1px solid ${OS.rule}` }}>
            {failed.length > 0 ? (
              <>
                <Eyebrow>
                  {failed.length === 1 ? 'Una pregunta fallada' : `${failed.length} preguntas falladas`}
                </Eyebrow>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 18 }}>
                  {failed.map((f) => (
                    <div key={f.idx} style={{ paddingBottom: 18, borderBottom: `1px solid ${OS.rule}` }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                        <span style={{ fontFamily: OS.serif, fontSize: 12, fontStyle: 'italic', color: OS.warm }}>
                          {String(f.idx).padStart(2, '0')}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontFamily: OS.serif, fontSize: 17, color: OS.ink,
                            letterSpacing: -0.2, lineHeight: 1.25,
                          }}>
                            {f.questionText ? truncate(f.questionText, 80) : 'Pregunta'}
                          </div>
                          {f.legalReference && (
                            <div style={{ fontSize: 11, color: OS.muted, marginTop: 4 }}>
                              {f.legalReference}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 28 }}>
                  <PullQuote
                    label="Repaso programado"
                    title="Volverás a verlas el viernes."
                    body="El sistema FSRS las reprogramará en función de tu respuesta en la próxima sesión."
                  />
                </div>
              </>
            ) : (
              <div style={{ padding: '20px 0' }}>
                <Eyebrow>Sin errores</Eyebrow>
                <div style={{
                  fontFamily: OS.serif, fontSize: 28, color: OS.ink,
                  letterSpacing: -0.5, lineHeight: 1.2, marginTop: 8,
                }}>
                  Una sesión impecable.
                </div>
                <div style={{ fontSize: 13, color: OS.textMuted, marginTop: 10, lineHeight: 1.55 }}>
                  Ninguna pregunta para revisar. El sistema espaciará estas preguntas más en el tiempo.
                </div>
              </div>
            )}

            <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {failed.length > 0 && (
                <EditorialButton variant="primary" icon="→" onClick={handlers.review}>
                  Revisar {failed.length === 1 ? 'la fallada' : `las ${failed.length} falladas`}
                </EditorialButton>
              )}
              {handlers.nextActivity && (
                <EditorialButton variant="primary" icon="→" onClick={handlers.nextActivity}>
                  Siguiente actividad
                </EditorialButton>
              )}
              <EditorialButton variant="secondary" onClick={handlers.close}>
                Volver al inicio
              </EditorialButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function truncate(s, n) {
  if (!s) return '';
  return s.length <= n ? s : s.substring(0, n - 1) + '…';
}

// ------- DISPATCHER -------

export default function EditorialSessionComplete({
  sessionStats = {},
  answersHistory = [],
  triggeredInsights: _unusedInsights = [],
  insightsLoading: _unusedLoading = false,
  nextActivity = null,
  onNextActivity,
  onNewSession: _onNewSession,
  onClose,
  topicLabel = null,
}) {
  const [showCorrection, setShowCorrection] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  if (showCorrection) {
    return (
      <CorrectionView
        answersHistory={answersHistory}
        onBack={() => setShowCorrection(false)}
      />
    );
  }

  const answered = sessionStats.answered || answersHistory.length || 0;
  const correct = sessionStats.correct ?? answersHistory.filter((a) => a.isCorrect).length;
  const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;
  const totalSeconds = answersHistory.reduce(
    (sum, a) => sum + (a.timeSeconds || a.time_spent_seconds || 0),
    0
  );
  const durationMinutes = Math.max(1, Math.round(totalSeconds / 60)) || 1;
  const avgSeconds = answered > 0 ? Math.round(totalSeconds / answered) || 42 : 42;
  const delta = sessionStats.deltaVsMean ?? 0; // optional field
  const failed = getFailedQuestions(answersHistory);

  const handlers = {
    review: () => setShowCorrection(true),
    nextActivity: nextActivity && onNextActivity ? () => onNextActivity(nextActivity) : null,
    close: onClose || (() => {}),
  };

  const props = { sessionStats: { ...sessionStats, answered, correct }, answersHistory, accuracy, durationMinutes, avgSeconds, delta, failed, topicLabel, handlers };

  return isDesktop
    ? <ResultsDesktop {...props} />
    : <ResultsMobile {...props} />;
}
