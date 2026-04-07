import { Lock, Crown } from 'lucide-react';
import { usePremium } from '../../hooks/usePremium';

/**
 * FreeLock — overlay for premium-locked features.
 * Shows a lock message + faded preview when user is on free tier.
 *
 * Usage:
 *   <FreeLock feature="simulacro" message="Disponible en Premium">
 *     <SimulacroContent />
 *   </FreeLock>
 *
 * If feature is not specified, locks based on isPremium directly.
 * Only blocks content when the DevPanel has toggled to Free mode.
 */
export default function FreeLock({
  children,
  feature = null,
  message = 'Esta función está disponible en el plan Premium',
  showPreview = true
}) {
  const { isPremium, isFeatureLocked } = usePremium();

  const locked = feature ? isFeatureLocked(feature) : !isPremium;

  if (!locked) return children;

  return (
    <div>
      <div style={{ textAlign: 'center', padding: '40px 24px', marginBottom: 16 }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: 'linear-gradient(145deg, #F59E0B, #D97706)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <Crown style={{ width: 24, height: 24, color: '#fff' }} />
        </div>
        <p style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a', marginBottom: 4 }}>
          {message}
        </p>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
          Cambia a Premium desde el panel de desarrollo para desbloquear.
        </p>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '8px 16px', borderRadius: 8,
          background: 'rgba(245,158,11,0.1)', color: '#92400E',
          fontSize: 12, fontWeight: 600
        }}>
          <Lock style={{ width: 14, height: 14 }} />
          Premium
        </div>
      </div>

      {showPreview && (
        <div style={{ opacity: 0.15, pointerEvents: 'none', userSelect: 'none', maxHeight: 300, overflow: 'hidden' }} aria-hidden="true">
          {children}
        </div>
      )}
    </div>
  );
}
