import React, { useState, useEffect } from 'react';
import { allQuestions, topicsList, getRandomQuestions } from '../data/questions/index.js';

// Constants
const FREE_TESTS_LIMIT = 3;
const FREE_FAVORITES_LIMIT = 10;
const IS_DEV = true;
const BADGES = [
  { id: 1, name: 'Constancia', days: 3, icon: '🔥', color: '#F97316' },
  { id: 2, name: 'Compromiso', days: 7, icon: '💪', color: '#EF4444' },
  { id: 3, name: 'Dedicación', days: 14, icon: '⭐', color: '#EAB308' },
  { id: 4, name: 'Imparable', days: 30, icon: '🏆', color: '#F59E0B' },
  { id: 5, name: 'Leyenda', days: 100, icon: '👑', color: '#8B5CF6' }
];

// Storage helper
const storage = {
  get: (key) => { try { return { value: localStorage.getItem(key) }; } catch { return { value: null }; } },
  set: (key, value) => { try { localStorage.setItem(key, value); } catch {} },
  remove: (key) => { try { localStorage.removeItem(key); } catch {} }
};

// DevPanel Component
function DevPanel({ onReset, onTogglePremium, isPremium, showDevPanel, setShowDevPanel }) {
  if (!IS_DEV) return null;
  return (
    <div className="fixed bottom-24 left-2 z-50">
      {showDevPanel && (
        <div className="mb-2 flex flex-col gap-1.5 bg-gray-900/90 p-2 rounded-lg shadow-lg">
          <button onClick={onReset} className="bg-red-500 text-white text-xs font-semibold py-1 px-2 rounded">Reset</button>
          <button onClick={onTogglePremium} className={`${isPremium ? 'bg-green-500' : 'bg-purple-500'} text-white text-xs font-semibold py-1 px-2 rounded`}>
            {isPremium ? 'Premium ✓' : 'Premium'}
          </button>
        </div>
      )}
      <button onClick={() => setShowDevPanel(!showDevPanel)} className={`${showDevPanel ? 'bg-gray-700' : 'bg-gray-500/70'} text-white text-xs font-semibold py-1 px-2 rounded shadow`}>
        {showDevPanel ? '✕' : 'DEV'}
      </button>
    </div>
  );
}

// PremiumModal Component
function PremiumModal({ visible, onClose, waitlistEmail, onWaitlistSubmit }) {
  const [email, setEmail] = useState(waitlistEmail || '');
  const [submitted, setSubmitted] = useState(!!waitlistEmail);
  const [justSubmitted, setJustSubmitted] = useState(false);
  if (!visible) return null;
  const handleSubmit = () => { if (!email || !email.includes('@')) return; onWaitlistSubmit(email); setSubmitted(true); setJustSubmitted(true); };
  const benefits = [
    { emoji: '📚', title: '+2000 preguntas', desc: 'Banco completo' },
    { emoji: '🔄', title: 'Tests dinámicos', desc: 'Preguntas diferentes cada vez' },
    { emoji: '📋', title: 'Simulacros', desc: 'Formato real de examen' },
    { emoji: '❤️', title: 'Favoritas ilimitadas', desc: 'Guarda todas' },
    { emoji: '📊', title: 'Estadísticas', desc: 'Conoce tus puntos débiles' }
  ];
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[85vh] overflow-hidden">
        <div className="bg-amber-500 p-6 text-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white text-2xl">✕</button>
          <div className="text-6xl mb-3">👑</div>
          <h2 className="text-white text-xl font-bold">Llega pronto algo increíble</h2>
          <p className="text-white/90 mt-1">Sé el primero en acceder</p>
        </div>
        <div className="p-6 overflow-y-auto max-h-96">
          {benefits.map((b, i) => (<div key={i} className="flex gap-3 mb-4"><span className="text-3xl">{b.emoji}</span><div><div className="font-bold text-gray-900">{b.title}</div><div className="text-gray-500 text-sm">{b.desc}</div></div></div>))}
          <p className="text-center text-gray-500 my-4">Lanzamos en <span className="text-amber-500 font-bold">Enero 2026</span></p>
          {submitted ? (<div className="bg-green-50 rounded-xl p-4 text-center"><p className="text-green-600 font-bold">{justSubmitted ? '¡Apuntado! Te avisaremos 🎉' : '✓ Ya estás en la lista'}</p></div>
          ) : (<div className="space-y-3"><input type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl p-3.5" /><button onClick={handleSubmit} className="w-full bg-amber-500 text-white font-bold py-4 rounded-xl">🔔 Avísame</button></div>)}
          <button onClick={onClose} className="w-full text-gray-400 py-4 mt-2">Ahora no</button>
        </div>
      </div>
    </div>
  );
}

// StreakCelebration Component
function StreakCelebration({ visible, badge, onClose }) {
  if (!visible || !badge) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 text-center w-4/5 max-w-sm">
        <div className="text-7xl mb-4">{badge.icon}</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Nuevo logro!</h2>
        <p className="text-xl text-purple-600 font-semibold">{badge.name}</p>
        <p className="text-gray-500 mt-1 mb-6">{badge.days} días de racha</p>
        <button onClick={onClose} className="bg-purple-600 text-white font-bold py-3.5 px-8 rounded-xl">¡Genial!</button>
      </div>
    </div>
  );
}

// SettingsModal Component
function SettingsModal({ visible, onClose, userData, onNavigate, onShowPremium }) {
  if (!visible) return null;
  const Row = ({ icon, label, rightText, onPress, locked }) => (
    <button onClick={locked ? undefined : onPress} className={`flex items-center justify-between w-full py-3.5 px-4 border-b border-gray-100 ${locked ? 'opacity-50' : 'hover:bg-gray-50'}`}>
      <div className="flex items-center gap-3"><span className="text-xl">{icon}</span><span className="text-gray-700">{label}</span></div>
      <div className="flex items-center gap-2">{rightText && <span className="text-gray-400 text-sm">{rightText}</span>}<span className="text-gray-400">{locked ? '🔒' : '›'}</span></div>
    </button>
  );
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="pt-12 px-4 pb-2 border-b border-gray-100"><button onClick={onClose} className="py-2 text-gray-700">← Atrás</button></div>
      <div className="px-4 pb-8">
        <div className="flex items-center gap-3 mt-4 mb-6"><span className="text-3xl">⚙️</span><h1 className="text-2xl font-bold text-gray-900">Ajustes</h1></div>
        <p className="text-sm font-semibold text-gray-900 mt-6 mb-2 px-1">Ajustes</p>
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <Row icon="🔔" label="Notificaciones" rightText="Próximamente" locked />
          <Row icon="📅" label="Meta diaria" rightText={`${userData.dailyGoal || 15} preguntas`} locked />
        </div>
        <p className="text-sm font-semibold text-gray-900 mt-6 mb-2 px-1">Cuenta</p>
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <Row icon="👑" label="Plan Premium" rightText="Próximamente" onPress={onShowPremium} />
          <Row icon="✉️" label="Contacto" onPress={() => { onClose(); onNavigate('contact'); }} />
        </div>
        <p className="text-sm font-semibold text-gray-900 mt-6 mb-2 px-1">Legal</p>
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <Row icon="🛡️" label="Privacidad" onPress={() => { onClose(); onNavigate('privacy'); }} />
          <Row icon="📄" label="Términos" onPress={() => { onClose(); onNavigate('terms'); }} />
        </div>
        <div className="text-center py-10">
          <p className="font-semibold text-gray-900">Oposita Smart</p>
          <p className="text-gray-500 text-sm mt-1">La forma inteligente de opositar</p>
          <p className="text-gray-400 text-xs mt-3">Versión 1.0.0</p>
        </div>
      </div>
    </div>
  );
}

// ProgressModal Component
function ProgressModal({ visible, onClose, stats, userData, onStartTest }) {
  if (!visible) return null;
  const dailyProgress = Math.min(Math.round((stats.todayQuestions || 0) / (userData.dailyGoal || 15) * 100), 100);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Tu progreso de hoy</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">✕</button>
        </div>
        <div className="p-5">
          <div className="text-center py-5">
            <div className="w-32 h-32 rounded-full border-[12px] border-purple-600 mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">{dailyProgress}%</span>
            </div>
            <p className="text-gray-700"><span className="text-2xl font-bold">{stats.todayQuestions || 0}</span>/{userData.dailyGoal || 15}</p>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 bg-gray-50 rounded-2xl p-4 text-center">
              <span className="text-xl">🏆</span><p className="text-2xl font-bold mt-2">{stats.testsCompleted}</p><p className="text-gray-500 text-xs">Tests</p>
            </div>
            <div className="flex-1 bg-gray-50 rounded-2xl p-4 text-center">
              <span className="text-xl">🎯</span><p className="text-2xl font-bold mt-2">{stats.accuracyRate}%</p><p className="text-gray-500 text-xs">Aciertos</p>
            </div>
          </div>
          {dailyProgress < 100 && <button onClick={() => { onClose(); onStartTest(); }} className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl mt-5">Continuar →</button>}
        </div>
      </div>
    </div>
  );
}

// LegalScreen Component
function LegalScreen({ type, onBack }) {
  const content = {
    privacy: { title: 'Política de Privacidad', text: 'En Oposita Smart nos tomamos muy en serio tu privacidad.\n\nDatos que recopilamos:\n• Email (opcional)\n• Progreso de estudio (local)\n\nNunca vendemos tus datos.\n\nÚltima actualización: Diciembre 2024' },
    terms: { title: 'Términos de Servicio', text: 'Al usar Oposita Smart, aceptas estos términos.\n\n• La app es para uso personal y educativo\n• No garantizamos el éxito en oposiciones\n\nÚltima actualización: Diciembre 2024' },
    contact: { title: 'Contacto', isContact: true },
    faq: { title: 'FAQ', isFaq: true, faqs: [{ q: '¿Es gratis?', a: 'Sí, con 3 tests diarios gratuitos.' }, { q: '¿Cuándo sale Premium?', a: 'Enero 2026.' }] },
    about: { title: 'Acerca de', isAbout: true }
  };
  const c = content[type] || content.privacy;
  return (
    <div className="min-h-screen bg-white">
      <button onClick={onBack} className="pt-12 px-4 pb-4 text-gray-700">← Atrás</button>
      <div className="px-6 pb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{c.title}</h1>
        {c.isContact ? (<div className="bg-gray-50 rounded-2xl p-5 text-center"><span className="text-3xl">✉️</span><h3 className="font-bold mt-3">¿Preguntas?</h3><p className="text-purple-600 font-semibold mt-2">hola@opositasmart.com</p></div>)
        : c.isFaq ? (<div className="space-y-3">{c.faqs.map((f, i) => (<div key={i} className="bg-gray-50 rounded-xl p-4"><p className="font-semibold">{f.q}</p><p className="text-gray-500 text-sm mt-1">{f.a}</p></div>))}</div>)
        : c.isAbout ? (<div className="text-center"><span className="text-6xl">🎓</span><h2 className="text-2xl font-bold mt-4">Oposita Smart</h2><p className="text-purple-600 font-semibold">La forma inteligente de opositar</p><p className="text-gray-400 text-xs mt-4">© {new Date().getFullYear()}</p></div>)
        : (<p className="text-gray-700 whitespace-pre-line">{c.text}</p>)}
      </div>
    </div>
  );
}

// WelcomeScreen Component
function WelcomeScreen({ onStart, onReset, onSkip }) {
  const [float, setFloat] = useState(0);
  useEffect(() => { const i = setInterval(() => setFloat(f => f === 0 ? -10 : 0), 1500); return () => clearInterval(i); }, []);
  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-6">
      <div className="text-center w-full max-w-md">
        <div className="w-24 h-24 bg-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg transition-transform duration-1000" style={{ transform: `translateY(${float}px)` }}>
          <span className="text-5xl">🎓</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Oposita Smart</h1>
        <p className="text-xl text-purple-600 font-semibold mb-2">Tu plaza, paso a paso</p>
        <p className="text-gray-500 mb-12">Unos minutos al día, a tu ritmo. Sin agobios.</p>
        <button onClick={onStart} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-5 px-8 rounded-2xl text-lg shadow-lg shadow-purple-600/30 transition-all active:scale-[0.98]">Empezar</button>
        {IS_DEV && (<div className="flex items-center justify-center gap-2 mt-12 pt-6 border-t border-gray-200"><button onClick={onSkip} className="text-gray-400 text-xs">[DEV] Saltar</button><span className="text-gray-300">·</span><button onClick={onReset} className="text-red-300 text-xs">[DEV] Reset</button></div>)}
      </div>
    </div>
  );
}

// Onboarding Components
function OnboardingOposicion({ onSelect }) {
  const options = [{ id: 'admin', label: 'Administrativo del Estado', icon: '🏢' }, { id: 'aux', label: 'Auxiliar Administrativo', icon: '📄' }, { id: 'gestion', label: 'Gestión del Estado', icon: '💼' }, { id: 'otra', label: 'Otra oposición', icon: '📝' }];
  return (
    <div className="min-h-screen bg-purple-50 px-6 pt-16">
      <div className="flex justify-center gap-2 mb-8"><div className="w-6 h-2 rounded-full bg-purple-600"></div><div className="w-2 h-2 rounded-full bg-gray-300"></div><div className="w-2 h-2 rounded-full bg-gray-300"></div><div className="w-2 h-2 rounded-full bg-gray-300"></div></div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">¿Qué oposición preparas?</h1>
      <p className="text-gray-500 mb-8">Selecciona para personalizar tu experiencia</p>
      {options.map((o) => (<button key={o.id} onClick={() => onSelect(o.id)} className="w-full bg-white rounded-2xl p-4 flex items-center mb-3 border-2 border-gray-100 hover:border-purple-600"><div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4"><span className="text-2xl">{o.icon}</span></div><span className="flex-1 text-left font-medium text-gray-800">{o.label}</span><span className="text-gray-400 text-2xl">›</span></button>))}
    </div>
  );
}

function OnboardingTiempo({ onSelect, onBack }) {
  const options = [{ id: '15', label: '15 minutos', desc: 'Perfecto para empezar' }, { id: '30', label: '30 minutos', desc: 'Ritmo constante' }, { id: '60', label: '1 hora o más', desc: 'Máximo rendimiento' }];
  return (
    <div className="min-h-screen bg-purple-50 px-6 pt-16">
      <button onClick={onBack} className="mb-6 text-gray-700">← Atrás</button>
      <div className="flex justify-center gap-2 mb-8"><div className="w-2 h-2 rounded-full bg-purple-600"></div><div className="w-6 h-2 rounded-full bg-purple-600"></div><div className="w-2 h-2 rounded-full bg-gray-300"></div><div className="w-2 h-2 rounded-full bg-gray-300"></div></div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">¿Cuánto tiempo al día?</h1>
      <p className="text-gray-500 mb-8">Puedes cambiarlo cuando quieras</p>
      {options.map((t) => (<button key={t.id} onClick={() => onSelect(t.id)} className="w-full bg-white rounded-2xl p-5 mb-3 border-2 border-gray-100 hover:border-purple-600 text-left"><p className="font-semibold text-gray-800 text-lg">{t.label}</p><p className="text-gray-500 text-sm mt-1">{t.desc}</p></button>))}
    </div>
  );
}

function OnboardingFecha({ onSelect, onBack }) {
  const options = [{ id: 'menos-6', label: 'Menos de 6 meses', icon: '⚡' }, { id: '6-12', label: 'Entre 6 y 12 meses', icon: '📅' }, { id: 'sin-fecha', label: 'Aún no lo sé', icon: '❓' }];
  return (
    <div className="min-h-screen bg-purple-50 px-6 pt-16">
      <button onClick={onBack} className="mb-6 text-gray-700">← Atrás</button>
      <div className="flex justify-center gap-2 mb-8"><div className="w-2 h-2 rounded-full bg-purple-600"></div><div className="w-2 h-2 rounded-full bg-purple-600"></div><div className="w-6 h-2 rounded-full bg-purple-600"></div><div className="w-2 h-2 rounded-full bg-gray-300"></div></div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">¿Cuándo es tu examen?</h1>
      <p className="text-gray-500 mb-8">Te ayudaremos a planificar</p>
      {options.map((f) => (<button key={f.id} onClick={() => onSelect(f.id)} className="w-full bg-white rounded-2xl p-4 flex items-center mb-3 border-2 border-gray-100 hover:border-purple-600"><div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4"><span className="text-2xl">{f.icon}</span></div><span className="flex-1 text-left font-medium text-gray-800">{f.label}</span><span className="text-gray-400 text-2xl">›</span></button>))}
    </div>
  );
}

function OnboardingIntro({ onStart, onBack }) {
  return (
    <div className="min-h-screen bg-purple-50 px-6 pt-16">
      <button onClick={onBack} className="mb-6 text-gray-700">← Atrás</button>
      <div className="flex justify-center gap-2 mb-8"><div className="w-2 h-2 rounded-full bg-purple-600"></div><div className="w-2 h-2 rounded-full bg-purple-600"></div><div className="w-2 h-2 rounded-full bg-purple-600"></div><div className="w-6 h-2 rounded-full bg-purple-600"></div></div>
      <div className="text-center mt-8 mb-8"><div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto"><span className="text-5xl">🚀</span></div></div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">¡Vamos a hacer tu primer test!</h1>
      <p className="text-gray-500 mb-8 text-center">5 preguntas rápidas para conocer tu nivel.</p>
      <div className="bg-white rounded-2xl p-5 mb-8 border border-gray-200"><p className="text-gray-700 mb-3">⏱️ Solo 2-3 minutos</p><p className="text-gray-700 mb-3">💡 Explicaciones incluidas</p><p className="text-gray-700">🛡️ Sin penalización</p></div>
      <button onClick={onStart} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-5 rounded-2xl text-lg active:scale-[0.98]">Empezar test</button>
    </div>
  );
}

// TabBar Component
function TabBar({ activeTab, onTabChange }) {
  const tabs = [{ id: 'inicio', icon: '🏠', label: 'Inicio' }, { id: 'actividad', icon: '📊', label: 'Actividad' }, { id: 'temas', icon: '📖', label: 'Temas' }, { id: 'recursos', icon: '🎓', label: 'Recursos' }];
  return (
    <div className="px-4 pb-2">
      <div className="flex bg-white rounded-[20px] h-[58px] items-center px-1 shadow-[0_2px_24px_rgba(0,0,0,0.12)] border border-gray-100/80">
        {tabs.map((t) => (<button key={t.id} onClick={() => onTabChange(t.id)} className="flex-1 flex flex-col items-center justify-center py-1"><div className={`w-9 h-9 rounded-full flex items-center justify-center mb-0.5 ${activeTab === t.id ? 'bg-gray-100' : ''}`}><span className={`text-xl ${activeTab === t.id ? '' : 'opacity-50'}`}>{t.icon}</span></div><span className={`text-[10px] ${activeTab === t.id ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>{t.label}</span></button>))}
      </div>
    </div>
  );
}

// HomeScreen Component
function HomeScreen({ streakData, stats, onStartTest, onTabChange, activeTab, onSettings, onShowProgress, canStartTest, onShowPremium, isPremium, freeTestsUsed, userData, showStreakBanner, onDismissBanner, onSignup, onNavigate }) {
  const [fireScale, setFireScale] = useState(1);
  const dailyProgressPercent = Math.min(Math.round((stats.testsToday * 5) / (userData?.dailyGoal || 15) * 100), 100);
  useEffect(() => { const i = setInterval(() => setFireScale(s => s === 1 ? 1.1 : 1), 1000); return () => clearInterval(i); }, []);
  const getStreakMsg = () => { const d = streakData.current; if (d === 0) return { main: "0", sub: "", msg: "¡Tu racha empieza hoy!" }; if (d === 1) return { main: "1", sub: "día", msg: "¡Primer paso!" }; if (d <= 6) return { main: `${d}`, sub: "días", msg: "¡Imparable!" }; return { main: `${d}`, sub: "días", msg: "🔥 Racha legendaria" }; };
  const nextBadge = BADGES.find(b => b.days > streakData.current);
  const daysToNext = nextBadge ? nextBadge.days - streakData.current : null;
  const testsRemaining = FREE_TESTS_LIMIT - freeTestsUsed;
  const shouldShowBanner = showStreakBanner && streakData.current >= 3 && !userData?.accountCreated;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex items-center justify-between px-4 pt-12 pb-2 bg-white border-b border-gray-100">
        <button onClick={onShowProgress} className="w-10 h-10 flex items-center justify-center"><div className="w-9 h-9 rounded-full border-[3px] border-purple-500 bg-purple-100 flex items-center justify-center"><span className="text-[10px] font-bold text-purple-600">{dailyProgressPercent}</span></div></button>
        <span className="text-[15px] font-semibold text-gray-800">Oposita Smart</span>
        <button onClick={onSettings} className="w-10 h-10 flex items-center justify-center"><span className="text-lg">⚙️</span></button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24">
        {shouldShowBanner && (<div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-4"><div className="flex items-start mb-3"><span className="text-2xl mr-3">🔥</span><div className="flex-1"><p className="font-semibold text-gray-900">Protege tu racha de {streakData.current} días</p><p className="text-gray-500 text-sm">Crea tu cuenta para no perder tu progreso.</p></div><button onClick={onDismissBanner} className="text-gray-400">✕</button></div><button onClick={onSignup} className="w-full bg-orange-500 text-white font-semibold py-3 rounded-xl">Crear cuenta gratis</button></div>)}
        <p className="text-gray-400 text-xs text-center mb-4">{userData?.oposicionLabel || 'Administrativo del Estado'} · Turno Libre</p>
        <div className="bg-orange-50 border border-orange-100 rounded-[20px] p-6 mb-6 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md transition-transform duration-500" style={{ transform: `scale(${fireScale})` }}><span className="text-5xl">🔥</span></div>
            <div className="flex items-baseline justify-center mb-2"><span className="text-3xl font-bold text-gray-900">{getStreakMsg().main}</span>{getStreakMsg().sub && <span className="text-lg text-gray-600 ml-1.5">{getStreakMsg().sub}</span>}</div>
            <p className={`text-sm font-medium ${streakData.current >= 7 ? 'text-orange-600' : 'text-gray-500'}`}>{getStreakMsg().msg}</p>
            {daysToNext && streakData.current > 0 && (<div className="mt-5"><div className="flex justify-between text-xs mb-1.5"><span className="text-gray-500">Próximo logro</span><span className="font-semibold text-orange-600">{daysToNext} días</span></div><div className="h-2 bg-orange-100 rounded-full overflow-hidden"><div className="h-full bg-orange-500 rounded-full" style={{ width: `${Math.min(((streakData.current % 10) / 10) * 100, 100)}%` }}></div></div></div>)}
          </div>
          {canStartTest ? (<button onClick={onStartTest} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-md active:scale-[0.98]">Continuar estudiando →</button>) : (<div className="text-center"><p className="text-red-600 font-semibold mb-3">🔒 Tests agotados</p><button onClick={onShowPremium} className="bg-amber-500 text-white font-semibold py-3 px-6 rounded-xl">Ver Premium</button></div>)}
          {!isPremium && canStartTest && <p className="text-center text-gray-500 text-sm mt-4">{testsRemaining} test{testsRemaining !== 1 ? 's' : ''} gratuito{testsRemaining !== 1 ? 's' : ''}</p>}
          {isPremium && <p className="text-center text-amber-500 font-semibold mt-4">👑 Premium</p>}
        </div>
        <div className="flex gap-3 mb-6">
          <div className="flex-1 bg-white rounded-2xl p-5 border border-gray-100"><span className="text-2xl">✓</span><p className="text-3xl font-bold text-gray-900 mt-2">{stats.testsToday}</p><p className="text-gray-500 text-sm">Tests hoy</p></div>
          <div className="flex-1 bg-white rounded-2xl p-5 border border-gray-100"><span className="text-2xl">🏆</span><p className="text-3xl font-bold text-gray-900 mt-2">{stats.accuracyRate}%</p><p className="text-gray-500 text-sm">Aciertos</p></div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-6"><p className="font-semibold text-gray-900 mb-4">📊 Estadísticas totales</p><div className="flex"><div className="flex-1"><p className="text-2xl font-bold text-purple-600">{stats.testsCompleted}</p><p className="text-gray-500 text-xs">Tests</p></div><div className="flex-1"><p className="text-2xl font-bold text-purple-600">{stats.questionsCorrect}</p><p className="text-gray-500 text-xs">Correctas</p></div></div></div>
        <div className="mt-6">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-8">
            {[{ icon: 'ℹ️', label: 'Acerca de', s: 'about' }, { icon: '❓', label: 'FAQ', s: 'faq' }].map((item, i, arr) => (<button key={i} onClick={() => onNavigate(item.s)} className={`w-full flex items-center py-4 px-4 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}><span className="text-xl mr-3">{item.icon}</span><span className="flex-1 text-left text-gray-700">{item.label}</span><span className="text-gray-300">›</span></button>))}
          </div>
          <div className="text-center py-6"><p className="font-semibold text-gray-900 text-lg">Oposita Smart</p><p className="text-gray-500 text-sm mt-1">La forma inteligente de opositar</p><p className="text-gray-400 text-xs mt-4">© {new Date().getFullYear()}</p></div>
        </div>
      </div>
      <TabBar activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}

// Other Tab Screens
function ActividadScreen({ onTabChange, activeTab, stats }) {
  return (<div className="min-h-screen bg-slate-50 flex flex-col"><div className="flex-1 overflow-y-auto px-4 pt-16 pb-24"><h1 className="text-2xl font-bold text-gray-900 mb-6">Tu actividad</h1>{stats.testsCompleted > 0 ? (<div className="bg-white rounded-2xl p-5 border border-gray-100"><span className="text-2xl">🎯</span><p className="font-semibold mt-3 mb-4">Resumen</p><p className="text-gray-500">{stats.testsCompleted} tests · {stats.questionsAnswered} preguntas</p></div>) : (<div className="bg-white rounded-[20px] p-10 text-center border border-gray-100"><span className="text-5xl">📊</span><h2 className="text-xl font-bold mt-4 mb-2">Aún no hay actividad</h2><p className="text-gray-500">Completa tu primer test</p></div>)}</div><TabBar activeTab={activeTab} onTabChange={onTabChange} /></div>);
}

function TemasScreen({ onTabChange, activeTab }) {
  return (<div className="min-h-screen bg-slate-50 flex flex-col"><div className="flex-1 overflow-y-auto px-4 pt-16 pb-24"><h1 className="text-2xl font-bold text-gray-900 mb-6">Tus temas</h1>{topicsList.map((t) => (<div key={t.id} className="bg-white rounded-2xl p-4 flex items-center mb-3 border-2 border-purple-100"><span className="text-3xl mr-4">{t.icon}</span><div><p className="font-bold text-gray-900">{t.title}</p><p className="text-gray-500 text-sm">{allQuestions.filter(q => q.topic === t.id).length} preguntas</p></div></div>))}</div><TabBar activeTab={activeTab} onTabChange={onTabChange} /></div>);
}

function RecursosScreen({ onTabChange, activeTab }) {
  return (<div className="min-h-screen bg-slate-50 flex flex-col"><div className="flex-1 overflow-y-auto px-4 pt-16 pb-24"><h1 className="text-2xl font-bold text-gray-900 mb-6">Recursos</h1><div className="bg-white rounded-2xl p-6 border border-gray-100"><span className="text-2xl">💡</span><p className="font-bold text-lg mt-4 mb-4">Consejos de estudio</p><p className="text-gray-700 mb-2">• Estudia a la misma hora</p><p className="text-gray-700 mb-2">• Repasa los errores</p><p className="text-gray-700">• Descansos cada 25 min</p></div></div><TabBar activeTab={activeTab} onTabChange={onTabChange} /></div>);
}

// TestScreen Component
function TestScreen({ questions, onFinish, onClose }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [time, setTime] = useState(0);
  const q = questions[idx];
  useEffect(() => { const t = setInterval(() => setTime(s => s + 1), 1000); return () => clearInterval(t); }, []);
  const fmt = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const handleAnswer = (id) => {
    if (answers[idx]) return;
    const newAns = { ...answers, [idx]: id };
    setAnswers(newAns);
    setTimeout(() => {
      if (idx < questions.length - 1) setIdx(idx + 1);
      else { const correct = Object.entries(newAns).filter(([i, a]) => a === questions[parseInt(i)].correct).length; onFinish({ total: questions.length, correct, time, questions, answers: newAns }); }
    }, 800);
  };
  const answered = answers[idx] !== undefined;
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex items-center justify-between px-4 pt-14 pb-4 border-b border-gray-100"><button onClick={onClose} className="text-2xl text-gray-500">✕</button><span className="font-semibold">{idx + 1}/{questions.length}</span><span className="text-gray-500">⏱️ {fmt(time)}</span></div>
      <div className="h-1 bg-gray-100"><div className="h-1 bg-purple-600" style={{ width: `${((idx + 1) / questions.length) * 100}%` }}></div></div>
      <div className="flex-1 overflow-y-auto p-5">
        <p className="text-lg font-semibold text-gray-900 mb-6">{q.question}</p>
        <div className="space-y-3">
          {q.options.map((o) => {
            const sel = answers[idx] === o.id;
            const cor = o.id === q.correct;
            let cls = 'bg-white border-2 border-gray-200 hover:border-purple-600';
            if (answered && cor) cls = 'bg-green-50 border-2 border-green-300';
            else if (answered && sel) cls = 'bg-red-50 border-2 border-red-300';
            return (<button key={o.id} onClick={() => handleAnswer(o.id)} disabled={answered} className={`w-full rounded-xl p-4 flex items-start text-left ${cls}`}><span className="font-bold text-gray-700 mr-3">{o.id.toUpperCase()}.</span><span className="flex-1 text-gray-700">{o.text}</span>{answered && cor && <span className="text-green-500 font-bold">✓</span>}{answered && sel && !cor && <span className="text-red-500 font-bold">✕</span>}</button>);
          })}
        </div>
        {answered && q.explanation && (<div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4"><p className="font-semibold text-blue-800 mb-2">💡 Explicación</p><p className="text-blue-900">{q.explanation}</p></div>)}
      </div>
    </div>
  );
}

// ResultsScreen Component
function ResultsScreen({ results, onRetry, onHome, canRetry, onShowPremium, onViewDetail }) {
  const pct = Math.round((results.correct / results.total) * 100);
  const good = pct >= 70;
  const fmt = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  return (
    <div className="min-h-screen bg-white overflow-y-auto px-4 pt-14 pb-10">
      <button onClick={onHome} className="mb-6 text-2xl text-gray-500">✕</button>
      <div className={`rounded-3xl p-8 text-center mb-6 ${good ? 'bg-green-50' : 'bg-orange-50'}`}><span className="text-6xl">{good ? '🎉' : '💪'}</span><p className="text-4xl font-bold mt-4">{results.correct}/{results.total}</p><p className={`text-lg font-semibold mt-1 ${good ? 'text-green-600' : 'text-orange-600'}`}>{pct}%</p><p className="text-gray-500 mt-2">Tiempo: {fmt(results.time)}</p></div>
      <h2 className="font-bold text-lg mb-4">Resumen</h2>
      {results.questions.map((q, i) => { const cor = results.answers[i] === q.correct; return (<button key={i} onClick={() => onViewDetail(i)} className="w-full flex items-center bg-gray-50 rounded-xl p-3.5 mb-2 text-left"><div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${cor ? 'bg-green-100' : 'bg-red-100'}`}><span className={`font-bold ${cor ? 'text-green-600' : 'text-red-600'}`}>{cor ? '✓' : '✕'}</span></div><span className="flex-1 text-gray-700 truncate">P{i + 1}: {q.question.substring(0, 35)}...</span><span className="text-gray-400">›</span></button>); })}
      <div className="mt-6 space-y-3">
        {canRetry ? (<button onClick={onRetry} className="w-full bg-purple-600 text-white font-bold py-5 rounded-2xl">Otro test</button>) : (<button onClick={onShowPremium} className="w-full bg-amber-500 text-white font-bold py-5 rounded-2xl">🔒 Desbloquear</button>)}
        <button onClick={onHome} className="w-full text-gray-500 font-medium py-4">Volver</button>
      </div>
    </div>
  );
}

// QuestionDetailScreen Component
function QuestionDetailScreen({ question, questionIndex, userAnswer, onBack, onToggleFavorite, isFavorite }) {
  const correct = userAnswer === question.correct;
  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-between pt-12 px-4 pb-4 border-b border-gray-100"><button onClick={onBack} className="text-gray-700">← Atrás</button><span className="font-semibold">Pregunta {questionIndex + 1}</span><button onClick={onToggleFavorite} className="text-2xl">{isFavorite ? '❤️' : '🤍'}</button></div>
      <div className="p-5">
        <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-semibold mb-5 ${correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{correct ? '✓ Correcta' : '✕ Incorrecta'}</span>
        <p className="text-lg font-semibold mb-6">{question.question}</p>
        <div className="space-y-3 mb-6">{question.options.map((o) => { const isUser = o.id === userAnswer; const isCor = o.id === question.correct; let cls = 'bg-gray-50 border border-gray-200'; if (isCor) cls = 'bg-green-50 border-2 border-green-300'; else if (isUser) cls = 'bg-red-50 border-2 border-red-300'; return (<div key={o.id} className={`rounded-xl p-4 ${cls}`}><div className="flex justify-between mb-2"><span className="font-bold">{o.id.toUpperCase()}.</span><div className="flex gap-2">{isUser && <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">Tu respuesta</span>}{isCor && <span className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full">Correcta</span>}</div></div><p className="text-gray-700">{o.text}</p></div>); })}</div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5"><p className="font-semibold text-blue-800 mb-3">💡 Explicación</p><p className="text-blue-900">{question.explanation}</p></div>
      </div>
    </div>
  );
}

// SignupScreen Component
function SignupScreen({ onSubmit, onSkip, userData }) {
  const [name, setName] = useState(userData?.name || '');
  const [email, setEmail] = useState(userData?.email || '');
  const [accepted, setAccepted] = useState(false);
  const canSubmit = email.includes('@') && accepted;
  return (
    <div className="min-h-screen bg-purple-50">
      <button onClick={onSkip} className="absolute top-12 right-4 py-2 px-3 text-gray-500">Saltar</button>
      <div className="pt-24 px-6">
        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6"><span className="text-4xl">🔒</span></div>
        <h1 className="text-2xl font-bold text-center mb-2">Protege tu progreso</h1>
        <p className="text-gray-500 text-center mb-8">Guarda tu racha en la nube.</p>
        <div className="space-y-5">
          <div><label className="text-sm font-semibold text-gray-700">Nombre</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white border-2 border-gray-200 rounded-xl p-3.5 mt-1" /></div>
          <div><label className="text-sm font-semibold text-gray-700">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white border-2 border-gray-200 rounded-xl p-3.5 mt-1" /></div>
          <button onClick={() => setAccepted(!accepted)} className="flex items-center gap-3"><div className={`w-6 h-6 border-2 rounded-md flex items-center justify-center ${accepted ? 'bg-purple-600 border-purple-600' : 'border-gray-300'}`}>{accepted && <span className="text-white text-sm">✓</span>}</div><span className="text-gray-500 text-sm">Acepto la política de privacidad</span></button>
          <button onClick={() => canSubmit && onSubmit({ name, email })} disabled={!canSubmit} className={`w-full py-4 rounded-xl font-bold text-white ${canSubmit ? 'bg-purple-600' : 'bg-gray-300'}`}>Crear cuenta</button>
        </div>
      </div>
    </div>
  );
}

// Main App Component
export default function OpositaApp() {
  const [screen, setScreen] = useState('loading');
  const [activeTab, setActiveTab] = useState('inicio');
  const [testQuestions, setTestQuestions] = useState([]);
  const [testResults, setTestResults] = useState(null);
  const [streakData, setStreakData] = useState({ current: 0, longest: 0, lastCompletedDate: null });
  const [stats, setStats] = useState({ testsCompleted: 0, questionsCorrect: 0, questionsAnswered: 0, testsToday: 0, accuracyRate: 0, todayQuestions: 0 });
  const [isPremium, setIsPremium] = useState(false);
  const [freeTestsUsed, setFreeTestsUsed] = useState(0);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);
  const [showStreakBanner, setShowStreakBanner] = useState(true);
  const [signupFormShownCount, setSignupFormShownCount] = useState(0);
  const [showDevPanel, setShowDevPanel] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '', dailyGoal: 15, oposicionLabel: 'Administrativo del Estado', accountCreated: false });

  const canStartTest = isPremium || freeTestsUsed < FREE_TESTS_LIMIT;

  useEffect(() => { checkOnboarding(); }, []);

  const checkOnboarding = () => { const r = storage.get('oposita-onboarding-complete'); if (r.value === 'true') { loadUserData(); setScreen('home'); } else { setScreen('welcome'); } };

  const loadUserData = () => {
    const streakR = storage.get('oposita-streak'); if (streakR.value) { const d = JSON.parse(streakR.value); if (d.lastCompletedDate) { const diff = Math.floor((new Date() - new Date(d.lastCompletedDate)) / 86400000); if (diff > 1) { d.current = 0; d.lastCompletedDate = null; storage.set('oposita-streak', JSON.stringify(d)); } } setStreakData(d); }
    const statsR = storage.get('oposita-stats'); if (statsR.value) setStats(JSON.parse(statsR.value));
    const premR = storage.get('oposita-premium'); if (premR.value === 'true') setIsPremium(true);
    const freeR = storage.get('oposita-free-tests'); if (freeR.value) { const d = JSON.parse(freeR.value); const today = new Date().toDateString(); if (d.date === today) setFreeTestsUsed(d.count); else { setFreeTestsUsed(0); storage.set('oposita-free-tests', JSON.stringify({ date: today, count: 0 })); } }
    const waitR = storage.get('waitlist_email'); if (waitR.value) setWaitlistEmail(waitR.value);
    const userR = storage.get('oposita-user'); if (userR.value) setUserData(JSON.parse(userR.value));
    const favR = storage.get('oposita-favorites'); if (favR.value) setFavorites(JSON.parse(favR.value));
  };

  const completeOnboarding = () => { storage.set('oposita-onboarding-complete', 'true'); };
  const startTest = () => { if (!canStartTest) { setShowPremiumModal(true); return; } setTestQuestions(getRandomQuestions(5)); setScreen('test'); };

  const finishTest = (results) => {
    setTestResults(results);
    const today = new Date().toDateString();
    let newStreak = { ...streakData }; let newBadge = null;
    if (newStreak.lastCompletedDate !== today) { const last = newStreak.lastCompletedDate ? new Date(newStreak.lastCompletedDate) : null; if (!last) newStreak.current = 1; else { const diff = Math.floor((new Date(today) - last) / 86400000); if (diff === 1) { newStreak.current += 1; newBadge = BADGES.find(b => b.days === newStreak.current); } else if (diff !== 0) newStreak.current = 1; } newStreak.longest = Math.max(newStreak.current, newStreak.longest); newStreak.lastCompletedDate = today; setStreakData(newStreak); storage.set('oposita-streak', JSON.stringify(newStreak)); }
    const newStats = { ...stats, testsCompleted: stats.testsCompleted + 1, questionsCorrect: stats.questionsCorrect + results.correct, questionsAnswered: stats.questionsAnswered + results.total, testsToday: stats.testsToday + 1, todayQuestions: (stats.todayQuestions || 0) + results.total, accuracyRate: Math.round(((stats.questionsCorrect + results.correct) / (stats.questionsAnswered + results.total)) * 100) || 0 };
    setStats(newStats); storage.set('oposita-stats', JSON.stringify(newStats));
    if (!isPremium) { const c = freeTestsUsed + 1; setFreeTestsUsed(c); storage.set('oposita-free-tests', JSON.stringify({ date: today, count: c })); }
    if (newBadge) { setEarnedBadge(newBadge); setShowCelebration(true); setTimeout(() => { setShowCelebration(false); setScreen('results'); }, 2500); } else setScreen('results');
  };

  const handleWaitlistSubmit = (email) => { setWaitlistEmail(email); storage.set('waitlist_email', email); };
  const handleDevReset = () => { storage.remove('oposita-onboarding-complete'); storage.remove('oposita-streak'); storage.remove('oposita-stats'); storage.remove('oposita-premium'); storage.remove('oposita-free-tests'); storage.remove('waitlist_email'); setStreakData({ current: 0, longest: 0, lastCompletedDate: null }); setStats({ testsCompleted: 0, questionsCorrect: 0, questionsAnswered: 0, testsToday: 0, accuracyRate: 0, todayQuestions: 0 }); setFreeTestsUsed(0); setIsPremium(false); setWaitlistEmail(''); setScreen('welcome'); };
  const handleDevTogglePremium = () => { const v = !isPremium; setIsPremium(v); storage.set('oposita-premium', v ? 'true' : 'false'); };
  const handleDevSkip = () => { completeOnboarding(); loadUserData(); setScreen('home'); };
  const toggleFavorite = (id) => { const isFav = favorites.includes(id); if (isFav) { const n = favorites.filter(f => f !== id); setFavorites(n); storage.set('oposita-favorites', JSON.stringify(n)); } else { if (!isPremium && favorites.length >= FREE_FAVORITES_LIMIT) { setShowPremiumModal(true); return; } const n = [...favorites, id]; setFavorites(n); storage.set('oposita-favorites', JSON.stringify(n)); } };
  const handleSignup = ({ name, email }) => { const d = { ...userData, name, email, accountCreated: true }; setUserData(d); storage.set('oposita-user', JSON.stringify(d)); setScreen('home'); };
  const handleSkipSignup = () => { setSignupFormShownCount(s => s + 1); storage.set('oposita-signup-count', JSON.stringify(signupFormShownCount + 1)); setScreen('home'); };
  const goToSignupOrHome = () => { if (!userData.accountCreated && signupFormShownCount < 2) setScreen('signup'); else setScreen('home'); };

  if (screen === 'loading') return (<div className="min-h-screen bg-purple-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div></div>);

  return (
    <div className="relative">
      <PremiumModal visible={showPremiumModal} onClose={() => setShowPremiumModal(false)} waitlistEmail={waitlistEmail} onWaitlistSubmit={handleWaitlistSubmit} />
      <StreakCelebration visible={showCelebration} badge={earnedBadge} onClose={() => setShowCelebration(false)} />
      <SettingsModal visible={showSettingsModal} onClose={() => setShowSettingsModal(false)} userData={userData} onNavigate={s => setScreen(s)} onShowPremium={() => { setShowSettingsModal(false); setShowPremiumModal(true); }} />
      <ProgressModal visible={showProgressModal} onClose={() => setShowProgressModal(false)} stats={stats} userData={userData} onStartTest={startTest} />
      {screen === 'home' && <DevPanel onReset={handleDevReset} onTogglePremium={handleDevTogglePremium} isPremium={isPremium} showDevPanel={showDevPanel} setShowDevPanel={setShowDevPanel} />}
      {['privacy', 'terms', 'contact', 'faq', 'about'].includes(screen) && <LegalScreen type={screen} onBack={() => setScreen('home')} />}
      {screen === 'signup' && <SignupScreen onSubmit={handleSignup} onSkip={handleSkipSignup} userData={userData} />}
      {screen === 'question-detail' && selectedQuestionIndex !== null && <QuestionDetailScreen question={testQuestions[selectedQuestionIndex]} questionIndex={selectedQuestionIndex} userAnswer={testResults?.answers?.[selectedQuestionIndex]} onBack={() => setScreen('results')} onToggleFavorite={() => toggleFavorite(testQuestions[selectedQuestionIndex]?.id)} isFavorite={favorites.includes(testQuestions[selectedQuestionIndex]?.id)} />}
      {screen === 'welcome' && <WelcomeScreen onStart={() => setScreen('onboarding-oposicion')} onReset={handleDevReset} onSkip={handleDevSkip} />}
      {screen === 'onboarding-oposicion' && <OnboardingOposicion onSelect={() => setScreen('onboarding-tiempo')} />}
      {screen === 'onboarding-tiempo' && <OnboardingTiempo onSelect={() => setScreen('onboarding-fecha')} onBack={() => setScreen('onboarding-oposicion')} />}
      {screen === 'onboarding-fecha' && <OnboardingFecha onSelect={() => setScreen('onboarding-intro')} onBack={() => setScreen('onboarding-tiempo')} />}
      {screen === 'onboarding-intro' && <OnboardingIntro onStart={() => { completeOnboarding(); startTest(); }} onBack={() => setScreen('onboarding-fecha')} />}
      {screen === 'test' && <TestScreen questions={testQuestions} onFinish={finishTest} onClose={() => setScreen('home')} />}
      {screen === 'results' && <ResultsScreen results={testResults} onRetry={startTest} onHome={goToSignupOrHome} canRetry={canStartTest} onShowPremium={() => setShowPremiumModal(true)} onViewDetail={(i) => { setSelectedQuestionIndex(i); setScreen('question-detail'); }} />}
      {screen === 'home' && activeTab === 'inicio' && <HomeScreen streakData={streakData} stats={stats} onStartTest={startTest} onTabChange={setActiveTab} activeTab={activeTab} onSettings={() => setShowSettingsModal(true)} onShowProgress={() => setShowProgressModal(true)} canStartTest={canStartTest} onShowPremium={() => setShowPremiumModal(true)} isPremium={isPremium} freeTestsUsed={freeTestsUsed} userData={userData} showStreakBanner={showStreakBanner} onDismissBanner={() => setShowStreakBanner(false)} onSignup={() => setScreen('signup')} onNavigate={s => setScreen(s)} />}
      {screen === 'home' && activeTab === 'actividad' && <ActividadScreen onTabChange={setActiveTab} activeTab={activeTab} stats={stats} />}
      {screen === 'home' && activeTab === 'temas' && <TemasScreen onTabChange={setActiveTab} activeTab={activeTab} />}
      {screen === 'home' && activeTab === 'recursos' && <RecursosScreen onTabChange={setActiveTab} activeTab={activeTab} />}
    </div>
  );
}
