/**
 * EditorialOnboardingShell — reusable wrapper for the 3 onboarding steps.
 *
 * Mobile-first layout (same for desktop since onboarding is designed as
 * a single-column wizard). Shows step indicator + progress bar at top.
 *
 * Faithful to Claude Design handoff onboarding.jsx.
 */

import React from 'react';
import {
  Eyebrow, Headline, EditorialButton, useReveal, OS,
} from '../editorial/EditorialPrimitives';

export default function EditorialOnboardingShell({
  stepNumber,
  totalSteps = 3,
  stepLabel,
  eyebrow,
  headline,
  headlineAccent,
  helperText,
  children,
  primaryLabel = 'Continuar',
  primaryDisabled = false,
  onPrimary,
  backLabel = '← Atrás',
  onBack,
  footer = null,
}) {
  const rev0 = useReveal(0);
  const rev1 = useReveal(180);
  const progressPct = (stepNumber / totalSteps) * 100;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: OS.paper,
        padding: '44px 24px 32px',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: OS.sans,
        color: OS.text,
      }}
    >
      <div style={{ maxWidth: 560, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Step header */}
        <div style={rev0}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{
              fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
              color: OS.muted, fontWeight: 500,
            }}>
              Paso {stepNumber} de {totalSteps}
            </div>
            {stepLabel && (
              <div style={{
                fontSize: 10, color: OS.muted,
                letterSpacing: 1.5, textTransform: 'uppercase',
              }}>{stepLabel}</div>
            )}
          </div>
          <div style={{
            height: 2, background: OS.ruleSoft,
            marginTop: 10, borderRadius: 2, overflow: 'hidden',
          }}>
            <div style={{
              width: `${progressPct}%`, height: '100%', background: OS.ink,
              transition: 'width 0.6s cubic-bezier(0.22,1,0.36,1)',
            }} />
          </div>
        </div>

        {/* Headline */}
        <div style={{ ...rev1, marginTop: 44 }}>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <Headline size={36} italic as="h1">
            {headline}
            {headlineAccent && (
              <> <span style={{ color: OS.inkSoft, fontStyle: 'normal' }}>{headlineAccent}</span></>
            )}
          </Headline>
          {helperText && (
            <div style={{
              fontSize: 13, color: OS.textMuted,
              marginTop: 14, lineHeight: 1.55,
            }}>
              {helperText}
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ marginTop: 36, flex: 1 }}>
          {children}
        </div>

        {/* Footer (e.g. plan recap) */}
        {footer && (
          <div style={{ padding: '20px 0', borderTop: `1px solid ${OS.rule}`, marginBottom: 20 }}>
            {footer}
          </div>
        )}

        {/* Actions */}
        <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
          {onBack && (
            <div style={{ flex: 1 }}>
              <EditorialButton variant="secondary" onClick={onBack}>
                {backLabel}
              </EditorialButton>
            </div>
          )}
          <div style={{ flex: onBack ? 2 : 1 }}>
            <EditorialButton
              variant="primary"
              icon="→"
              onClick={onPrimary}
              disabled={primaryDisabled}
            >
              {primaryLabel}
            </EditorialButton>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Radio-style option row used across the 3 steps.
 */
export function OnboardingOption({
  active = true,
  selected = false,
  title,
  meta,
  onClick,
  firstInGroup = false,
}) {
  return (
    <button
      onClick={active ? onClick : undefined}
      disabled={!active}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: '18px 4px',
        background: 'none',
        borderTop: firstInGroup ? `1px solid ${OS.rule}` : 'none',
        borderBottom: `1px solid ${selected ? OS.ink : OS.rule}`,
        borderLeft: 'none',
        borderRight: 'none',
        cursor: active ? 'pointer' : 'not-allowed',
        textAlign: 'left',
        opacity: active ? 1 : 0.5,
        fontFamily: OS.sans,
        transition: 'border-color 0.3s',
      }}
    >
      <div>
        <div style={{
          fontFamily: OS.serif, fontSize: 19, color: OS.ink,
          letterSpacing: -0.25,
        }}>{title}</div>
        {meta && (
          <div style={{ fontSize: 11, color: OS.muted, marginTop: 3 }}>{meta}</div>
        )}
      </div>
      <div style={{
        width: 18, height: 18, borderRadius: '50%',
        border: `1.5px solid ${selected ? OS.ink : OS.rule}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {selected && (
          <div style={{
            width: 8, height: 8, borderRadius: '50%', background: OS.ink,
          }} />
        )}
      </div>
    </button>
  );
}
