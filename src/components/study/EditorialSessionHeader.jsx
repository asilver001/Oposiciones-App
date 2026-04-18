/**
 * EditorialSessionHeader — calma editorial header for active study sessions.
 *
 * Faithful to Claude Design handoff (session.jsx mobile top strip):
 *   eyebrow row (modo + "Pregunta N / M"), horizontal rule,
 *   segmented progress (20 thin cells), stats row (aciertos/errores + tiempo).
 */

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { OS } from '../editorial/EditorialPrimitives';

function useElapsed(startTime) {
  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (!startTime) return '00:00';
  const seconds = Math.max(0, Math.floor((now - startTime) / 1000));
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export default function EditorialSessionHeader({
  currentIndex = 0,
  total = 20,
  progress: _progress,
  isReview = false,
  onExitClick,
  modeLabel = 'Práctica',
  topicLabel = null,
  correctCount = 0,
  wrongCount = 0,
  startTime = null,
}) {
  const elapsed = useElapsed(startTime);
  const cells = Array.from({ length: total });

  const metaLeft = topicLabel
    ? `${modeLabel} · ${topicLabel}`
    : modeLabel;

  return (
    <div
      style={{
        padding: '14px 22px 16px',
        background: OS.paper,
        borderBottom: `1px solid ${OS.rule}`,
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Top row: back + eyebrow */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {onExitClick && (
          <button
            onClick={onExitClick}
            aria-label="Salir de la sesión"
            style={{
              background: 'none', border: 'none', padding: 0,
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              color: OS.muted, marginLeft: -4,
            }}
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 10,
            color: OS.muted,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          <span>{isReview ? 'Repaso · ' : ''}{metaLeft}</span>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>
            Pregunta {currentIndex + 1} / {total}
          </span>
        </div>
      </div>

      {/* Segmented progress */}
      <div style={{ display: 'flex', gap: 3, marginTop: 14 }}>
        {cells.map((_, i) => {
          let bg = OS.ruleSoft;
          if (i < currentIndex) bg = OS.ink;
          else if (i === currentIndex) bg = OS.inkLight;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 1,
                background: bg,
                transition: 'background 0.3s',
              }}
            />
          );
        })}
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 14,
          fontSize: 11,
          color: OS.muted,
        }}
      >
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>
          {correctCount} {correctCount === 1 ? 'acierto' : 'aciertos'}
          {wrongCount > 0 && ` · ${wrongCount} ${wrongCount === 1 ? 'error' : 'errores'}`}
        </span>
        <span style={{ fontVariantNumeric: 'tabular-nums', color: OS.ink }}>
          ⏱ {elapsed}
        </span>
      </div>
    </div>
  );
}
