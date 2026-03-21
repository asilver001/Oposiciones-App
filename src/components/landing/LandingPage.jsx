import LandingNav from './LandingNav';
import LandingHero from './LandingHero';
import InsightBanner from './InsightBanner';
import SocialStrip from './SocialStrip';
import ConvocatoriasDashboard from './ConvocatoriasDashboard';
import AcademyCompare from './AcademyCompare';
import FeaturesGrid from './FeaturesGrid';
import HowItWorks from './HowItWorks';
import ReadinessRadar from './ReadinessRadar';
import ResourceDownload from './ResourceDownload';
import FinalCTA from './FinalCTA';

export default function LandingPage({ onStart, onLogin }) {
  return (
    <div
      style={{
        fontFamily: "'Instrument Sans', sans-serif",
        background: '#F5F1EB',
        color: '#1a1a1a',
      }}
    >
      {/* Mobile sticky bar — hidden on desktop via scoped style */}
      <style>{`
        .landing-mobile-sticky {
          display: none;
        }
        @media (max-width: 767px) {
          .landing-mobile-sticky {
            display: flex !important;
          }
        }
      `}</style>

      <LandingNav onStart={onStart} onLogin={onLogin} />
      <LandingHero onStart={onStart} />
      <InsightBanner />
      <SocialStrip />
      <ConvocatoriasDashboard />
      <AcademyCompare />
      <FeaturesGrid />
      <HowItWorks onStart={onStart} />
      <ReadinessRadar onStart={onStart} />
      <ResourceDownload />
      <FinalCTA onStart={onStart} />

      {/* Mobile Sticky CTA Bar */}
      <div
        className="landing-mobile-sticky"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          flexDirection: 'column',
          alignItems: 'stretch',
          background: 'linear-gradient(to top, #F5F1EB 70%, rgba(245,241,235,0))',
          padding: '20px 20px calc(16px + env(safe-area-inset-bottom, 0px))',
          pointerEvents: 'none',
        }}
      >
        <button
          onClick={onStart}
          style={{
            pointerEvents: 'all',
            background: '#1B4332',
            color: '#ffffff',
            border: 'none',
            borderRadius: 14,
            padding: '16px 24px',
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '-0.01em',
            boxShadow: '0 4px 20px rgba(27,67,50,0.35)',
            width: '100%',
            transition: 'background 0.15s, transform 0.1s',
          }}
          onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.98)'; }}
          onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
          onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          Ver mi nivel ahora — es gratis
        </button>
      </div>
    </div>
  );
}
