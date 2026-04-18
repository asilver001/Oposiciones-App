/**
 * Editorial Calma — Design System Primitives
 *
 * Extracted from Claude Design handoff (2026-04-18).
 * Used to build newspaper-style screens: serif headlines, paper background,
 * thin rules instead of rounded cards.
 *
 * Import any piece directly:
 *   import { Masthead, Headline, Eyebrow, PullQuote, EditorialStat,
 *            UnfurlBar, EditorialButton, Rule, useReveal, useCountUp,
 *            tokens as OS } from './EditorialPrimitives';
 */

import React, { useEffect, useState } from 'react';

export const tokens = {
  paper: '#F3F3F0',
  cream: '#FAF8F3',
  white: '#FFFFFF',
  ink: '#1B4332',
  inkSoft: '#2D6A4F',
  inkLight: '#52B788',
  inkHover: '#40916C',
  text: '#2A2A28',
  textMuted: '#4B5563',
  muted: '#8A8783',
  mutedSoft: '#B5B3AF',
  warm: '#C67D5E',
  warmSoft: '#E8956F',
  gold: '#C9A94F',
  rule: 'rgba(27,67,50,0.12)',
  ruleSoft: 'rgba(27,67,50,0.06)',
  serif: '"Instrument Serif", Georgia, serif',
  sans: 'Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  shadowCard: '0 1px 3px rgba(27,67,50,0.04), 0 8px 24px rgba(27,67,50,0.06)',
  shadowHover: '0 4px 12px rgba(27,67,50,0.08), 0 12px 32px rgba(27,67,50,0.1)',
};
export const OS = tokens;

// ---------- Hooks ----------

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    mql.addEventListener?.('change', onChange);
    // Fallback for older Safari
    if (!mql.addEventListener) mql.addListener(onChange);
    setMatches(mql.matches);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', onChange);
      else mql.removeListener(onChange);
    };
  }, [query]);

  return matches;
}

export function useReveal(delay = 0) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShown(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return {
    opacity: shown ? 1 : 0,
    transform: shown ? 'translateY(0)' : 'translateY(12px)',
    filter: shown ? 'blur(0)' : 'blur(4px)',
    transition:
      'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1), filter 0.8s cubic-bezier(0.16,1,0.3,1)',
  };
}

export function useCountUp(target, duration = 1200, delay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf;
    const startAt = performance.now() + delay;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      if (now < startAt) { raf = requestAnimationFrame(tick); return; }
      const t = Math.min(1, (now - startAt) / duration);
      setValue(Math.round(ease(t) * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, delay]);
  return value;
}

// ---------- Typography ----------

export function Masthead({ label, meta }) {
  return (
    <div style={useReveal(0)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: OS.muted, fontWeight: 500 }}>
          {label}
        </div>
        {meta && <div style={{ fontSize: 11, color: OS.muted, fontVariantNumeric: 'tabular-nums' }}>{meta}</div>}
      </div>
      <div style={{ height: 1, background: OS.ink, marginTop: 10, opacity: 0.85 }} />
    </div>
  );
}

export function Headline({ children, size = 44, italic = false, color = OS.ink, as: Tag = 'div' }) {
  return (
    <Tag style={{
      fontFamily: OS.serif,
      fontSize: size,
      lineHeight: 1.05,
      color,
      letterSpacing: -size * 0.025,
      fontWeight: 400,
      fontStyle: italic ? 'italic' : 'normal',
      margin: 0,
    }}>{children}</Tag>
  );
}

export function Eyebrow({ children, color = OS.muted }) {
  return (
    <div style={{
      fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
      color, fontWeight: 500, marginBottom: 12,
    }}>{children}</div>
  );
}

export function PullQuote({ label, title, body }) {
  return (
    <div style={{ borderLeft: `2px solid ${OS.ink}`, paddingLeft: 18, paddingTop: 4, paddingBottom: 4 }}>
      {label && <Eyebrow>{label}</Eyebrow>}
      <div style={{ fontFamily: OS.serif, fontSize: 22, lineHeight: 1.25, color: OS.ink, letterSpacing: -0.3 }}>
        {title}
      </div>
      {body && <div style={{ fontSize: 13, lineHeight: 1.55, color: OS.text, marginTop: 10 }}>{body}</div>}
    </div>
  );
}

export function EditorialStat({ value, suffix = '', label, delay = 0, size = 72, color = OS.ink, animate = true }) {
  const n = useCountUp(animate ? value : value, 1400, delay);
  const finalValue = animate ? n : value;
  const reveal = useReveal(delay);
  return (
    <div style={reveal}>
      <div style={{
        fontFamily: OS.serif, fontSize: size, lineHeight: 0.95,
        color, fontWeight: 400, letterSpacing: -1, fontVariantNumeric: 'tabular-nums',
      }}>
        {finalValue}{suffix && <span style={{ fontSize: size * 0.45, color: OS.muted }}>{suffix}</span>}
      </div>
      <div style={{
        fontSize: 10, color: OS.muted, marginTop: 8,
        letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 500,
      }}>{label}</div>
    </div>
  );
}

// ---------- Layout primitives ----------

export function Rule({ opacity = 1 }) {
  return <div style={{ height: 1, background: OS.rule, opacity, width: '100%' }} />;
}

export function UnfurlBar({ value, delay = 0, color = OS.inkSoft, height = 3 }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return (
    <div style={{ width: '100%', height, background: OS.ruleSoft, borderRadius: 999, overflow: 'hidden' }}>
      <div style={{
        width: `${w}%`, height: '100%', background: color, borderRadius: 999,
        transition: 'width 1.4s cubic-bezier(0.22,1,0.36,1)',
      }} />
    </div>
  );
}

export function EditorialButton({ children, variant = 'primary', onClick, size = 'md', icon, subtitle, disabled = false, type = 'button', ariaLabel }) {
  const [hover, setHover] = useState(false);
  const styles = {
    primary: {
      bg: hover && !disabled ? OS.inkSoft : OS.ink,
      color: OS.paper,
      border: 'none',
    },
    secondary: {
      bg: hover && !disabled ? OS.ruleSoft : 'transparent',
      color: OS.ink,
      border: `1px solid ${OS.rule}`,
    },
    ghost: {
      bg: 'transparent',
      color: OS.muted,
      border: 'none',
    },
  };
  const s = styles[variant];
  const padding = size === 'lg' ? '18px 22px' : size === 'sm' ? '8px 14px' : '14px 18px';
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%',
        background: s.bg,
        color: s.color,
        border: s.border,
        padding,
        fontSize: size === 'sm' ? 11 : 13,
        fontWeight: 500,
        letterSpacing: 0.2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: OS.sans,
        transition: 'background 0.25s ease, transform 0.2s ease',
        textAlign: 'left',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <span style={{ flex: 1 }}>
        {subtitle ? (
          <>
            <div style={{ fontFamily: OS.serif, fontSize: size === 'lg' ? 20 : 16, letterSpacing: -0.3 }}>{children}</div>
            <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2, letterSpacing: 0.5, fontFamily: OS.sans }}>{subtitle}</div>
          </>
        ) : children}
      </span>
      {icon && <span style={{ fontSize: size === 'lg' ? 20 : 14 }} aria-hidden="true">{icon}</span>}
    </button>
  );
}

export function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 20, borderBottom: `1px solid ${OS.rule}` }}>
      {tabs.map(t => (
        <button key={t.key} onClick={() => onChange(t.key)} style={{
          background: 'none', border: 'none', padding: '10px 0',
          fontSize: 11, letterSpacing: 1.8, textTransform: 'uppercase', fontWeight: 500,
          color: active === t.key ? OS.ink : OS.muted, cursor: 'pointer',
          borderBottom: active === t.key ? `2px solid ${OS.ink}` : '2px solid transparent',
          marginBottom: -1, fontFamily: OS.sans,
        }}>{t.label}</button>
      ))}
    </div>
  );
}

// ---------- Study mode row (used in Home and Actividad) ----------

export function StudyModeRow({ num, title, meta, highlight = false, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%',
        display: 'flex', alignItems: 'baseline', gap: 16,
        padding: '14px 4px', borderBottom: `1px solid ${OS.rule}`,
        cursor: 'pointer', transition: 'transform 0.25s, padding 0.25s',
        transform: hover ? 'translateX(4px)' : 'translateX(0)',
        background: 'none', border: 'none', borderBottomStyle: 'solid',
        textAlign: 'left', fontFamily: OS.sans,
      }}
    >
      <div style={{
        fontFamily: OS.serif, fontSize: 11, color: OS.muted, fontStyle: 'italic',
        width: 20, fontVariantNumeric: 'tabular-nums',
      }}>{num}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: OS.serif, fontSize: 20, color: OS.ink, letterSpacing: -0.3, lineHeight: 1.1 }}>
          {title}
          {highlight && (
            <span style={{
              fontSize: 10, marginLeft: 10, color: OS.warm, letterSpacing: 1.5,
              textTransform: 'uppercase', fontFamily: OS.sans, fontStyle: 'normal',
            }}>recomendado</span>
          )}
        </div>
        <div style={{ fontSize: 11, color: OS.muted, marginTop: 4, letterSpacing: 0.3 }}>{meta}</div>
      </div>
      <div style={{
        fontSize: 16,
        transition: 'transform 0.25s, color 0.25s',
        transform: hover ? 'translateX(2px)' : 'translateX(0)',
        color: hover ? OS.ink : OS.muted,
      }} aria-hidden="true">→</div>
    </button>
  );
}
