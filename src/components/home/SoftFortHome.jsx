/**
 * SoftFortHome — Lovable-inspired 2-column dashboard
 *
 * Desktop: Main content (left) + Right panel (progress/topics)
 * Mobile: Single column stack
 *
 * Philosophy: "Bienestar primero" — positive framing, no raw failure metrics.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, Layers, RotateCcw, FileText, Sparkles,
  Info, HelpCircle, Instagram, ChevronRight, Play, Lock
} from 'lucide-react';
import { usePremium } from '../../hooks/usePremium';
import FortalezaVisual, { statusConfig } from './FortalezaVisual';
import EmptyState from '../common/EmptyState';
import DevModeRandomizer, { userStates } from '../dev/DevModeRandomizer';
import { useAuth } from '../../contexts/AuthContext';
import { useUserStore } from '../../stores/useUserStore';
import { getGuestData, initGuestData } from '../../features/guest/guestStorage';

// ============================================================
// SUB-COMPONENTS
// ============================================================

/** Hero session card — the primary CTA */
function HeroSessionCard({ activity, onStart }) {
  if (!activity) return null;

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-7 mb-8 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 animate-fade-up"
      style={{
        background: 'linear-gradient(145deg, #1B4332, #2D6A4F, #40916C)',
        boxShadow: 'var(--shadow-hero)',
        animationDelay: '140ms',
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-hero-hover)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-hero)'}
      onClick={() => onStart(activity)}
    >
      {/* Decorative circles */}
      <div className="absolute -top-12 -right-12 w-[180px] h-[180px] rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
      <div className="absolute -bottom-16 right-28 w-[220px] h-[220px] rounded-full" style={{ background: 'rgba(255,255,255,0.03)' }} />

      <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-white/60 mb-2 relative">
        Sesión recomendada
      </p>
      <h2 className="text-[22px] font-bold text-white tracking-[-0.02em] mb-1 leading-snug relative">
        {activity.title}
      </h2>
      <p className="text-[14px] text-white/70 mb-5 relative">
        {activity.questionCount || 8} preguntas · ~{activity.estimatedMinutes || 10} min
      </p>
      <button
        className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-[14px] font-semibold px-5 py-2.5 rounded-lg transition-colors duration-150 active:scale-[0.97] relative"
        onClick={(e) => { e.stopPropagation(); onStart(activity); }}
      >
        Empezar
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

/** New user / guest trial hero — Lovable CTA integrated in dashboard */
function WelcomeHeroCard({ onStart }) {
  const guestData = getGuestData();
  const hasStarted = guestData && guestData.totalSessions > 0;
  const avgScore = hasStarted
    ? Math.round(guestData.sessions.reduce((s, ses) => s + (ses.score / ses.total) * 100, 0) / guestData.sessions.length)
    : 0;

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-7 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 animate-fade-up"
      style={{
        background: 'linear-gradient(145deg, #1B4332, #2D6A4F, #40916C)',
        boxShadow: 'var(--shadow-hero)',
        animationDelay: '140ms',
      }}
      onClick={onStart}
    >
      <div className="absolute -top-12 -right-12 w-[180px] h-[180px] rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />

      {hasStarted ? (
        <>
          <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-white/60 mb-2 relative">
            Continúa tu prueba
          </p>
          <h2 className="text-[22px] font-bold text-white tracking-[-0.02em] mb-1 leading-snug relative">
            Sesión {guestData.totalSessions + 1} de {guestData.maxSessions}
          </h2>
          <p className="text-[14px] text-white/70 mb-5 relative">
            Precisión actual: {avgScore}% · 10 preguntas más
          </p>
        </>
      ) : (
        <>
          <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-white/60 mb-2 relative">
            Prueba gratuita
          </p>
          <h2 className="text-[22px] font-bold text-white tracking-[-0.02em] mb-1 leading-snug relative">
            Descubre tu nivel en 2 minutos
          </h2>
          <p className="text-[14px] text-white/70 mb-5 relative">
            10 preguntas reales de Auxiliar Administrativo · Sin registro
          </p>
        </>
      )}
      <button
        className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-[14px] font-semibold px-5 py-2.5 rounded-lg transition-colors duration-150 active:scale-[0.97] relative"
        onClick={(e) => { e.stopPropagation(); onStart(); }}
      >
        Empezar ahora
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

/** Stats row — borderless floating numbers */
function StatsRow({ totalQuestions, topicsExplored, totalHours }) {
  const stats = [
    { value: totalQuestions.toString(), label: 'preguntas respondidas' },
    { value: topicsExplored.toString(), label: 'temas explorados' },
    { value: `${totalHours}h`, label: 'de estudio total' },
  ];

  return (
    <div className="flex gap-12 mb-10 animate-fade-up" style={{ animationDelay: '200ms' }}>
      {stats.map((stat) => (
        <div key={stat.label}>
          <p className="text-[32px] font-extrabold tracking-[-0.03em] text-gray-900 leading-none">
            {stat.value}
          </p>
          <p className="text-[12px] mt-1" style={{ color: 'var(--color-muted-soft)' }}>
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}

/** Quick action cards */
function QuickActions({ onFlashcards, onReview, onSimulacro, reviewCount = 0, isNew = false, isFeatureLocked }) {
  const actions = [
    { icon: Layers, title: 'Flashcards', subtitle: 'Aprende conceptos', onClick: onFlashcards, featureKey: 'flashcards' },
    { icon: RotateCcw, title: 'Repasar', subtitle: reviewCount > 0 ? `${reviewCount} pendientes` : 'Al día', onClick: onReview },
    { icon: FileText, title: 'Simulacro', subtitle: isNew ? 'Disponible tras 50 preg.' : 'Examen completo', onClick: isNew ? null : onSimulacro, disabled: isNew, featureKey: 'simulacro' },
  ];

  return (
    <div className="animate-fade-up" style={{ animationDelay: '260ms' }}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.06em] mb-4" style={{ color: 'var(--color-section-label)' }}>
        Acciones rápidas
      </p>
      <div className="grid grid-cols-3 gap-5">
        {actions.map((action) => {
          const locked = action.featureKey && isFeatureLocked?.(action.featureKey);
          const isDisabled = action.disabled || locked;
          return (
            <button
              key={action.title}
              onClick={isDisabled ? undefined : action.onClick}
              disabled={isDisabled}
              className={`relative bg-white border border-black/5 rounded-lg p-5 text-left cursor-pointer transition-all duration-200 hover:-translate-y-px ${
                isDisabled ? 'opacity-45 cursor-not-allowed hover:translate-y-0' : ''
              }`}
              style={{ boxShadow: 'none' }}
              onMouseEnter={(e) => !isDisabled && (e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
            >
              {locked && (
                <span className="absolute top-2 right-2 flex items-center gap-1 bg-amber-100 text-amber-700 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full">
                  <Lock size={10} />
                  Premium
                </span>
              )}
              <div className="mb-3">
                {locked ? (
                  <Lock size={20} className="text-gray-400" />
                ) : (
                  <action.icon size={20} style={{ color: 'var(--color-forest-primary)' }} />
                )}
              </div>
              <p className="text-[14px] font-semibold text-gray-900">{action.title}</p>
              <p className="text-[12px] mt-0.5" style={{ color: 'var(--color-muted-soft)' }}>{action.subtitle}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Recent sessions list */
function RecentSessions({ sessions = [] }) {
  if (sessions.length === 0) return null;

  return (
    <div className="animate-fade-up" style={{ animationDelay: '320ms' }}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.06em] mb-4" style={{ color: 'var(--color-section-label)' }}>
        Sesiones recientes
      </p>
      <div className="flex flex-col gap-2">
        {sessions.map((session, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5 px-1">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: (session.score / session.total) >= 0.6 ? 'var(--color-forest-primary)' : '#F59E0B' }}
            />
            <span className="text-[14px] text-gray-900 font-medium flex-1">{session.topic}</span>
            <span className="text-[13px] font-medium tabular-nums" style={{ color: 'var(--color-body-text)' }}>
              {session.score}/{session.total}
            </span>
            <span className="text-[12px] w-24 text-right" style={{ color: 'var(--color-muted-soft)' }}>
              {session.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** How it works — new users only */
function HowItWorks() {
  const steps = [
    { num: '1', title: 'Practica', desc: 'Responde preguntas reales del temario' },
    { num: '2', title: 'Aprende', desc: 'Lee la explicación de cada respuesta' },
    { num: '3', title: 'Repasa', desc: 'El algoritmo programa los repasos por ti' },
  ];

  return (
    <div className="bg-white border border-black/5 rounded-xl p-5 animate-fade-up" style={{ animationDelay: '320ms' }}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.06em] mb-4" style={{ color: 'var(--color-section-label)' }}>
        ¿Cómo funciona?
      </p>
      <div className="flex gap-5">
        {steps.map((step) => (
          <div key={step.num} className="flex-1 text-center">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center mx-auto mb-2 text-[12px] font-extrabold"
              style={{ background: 'rgba(45,106,79,0.08)', color: 'var(--color-forest-primary)' }}
            >
              {step.num}
            </div>
            <p className="text-[12px] font-semibold text-gray-900">{step.title}</p>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-muted-soft)' }}>{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// RIGHT PANEL COMPONENTS
// ============================================================

/** Mastery counter */
function MasteryCard({ mastered, total }) {
  return (
    <div className="animate-fade-up" style={{ animationDelay: '120ms' }}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.06em] mb-3" style={{ color: 'var(--color-section-label)' }}>
        Preguntas que dominas
      </p>
      <div className="flex items-baseline gap-1.5 mb-2">
        <span className="text-[36px] font-extrabold tracking-[-0.03em] text-gray-900 leading-none">{mastered}</span>
        <span className="text-[14px]" style={{ color: 'var(--color-muted-soft)' }}>de {total.toLocaleString('es-ES')}</span>
      </div>
      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: '#F3F4F6' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.max(0.5, (mastered / total) * 100)}%`, background: 'var(--color-forest-primary)' }}
        />
      </div>
    </div>
  );
}

/** Weekly circles */
const DAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

function WeeklyCircles({ weeklyData = [0, 0, 0, 0, 0, 0, 0] }) {
  const todayIdx = (() => { const d = new Date().getDay(); return d === 0 ? 6 : d - 1; })();

  return (
    <div className="animate-fade-up" style={{ animationDelay: '180ms' }}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.06em] mb-4" style={{ color: 'var(--color-section-label)' }}>
        Esta semana
      </p>
      <div className="flex gap-1.5 justify-between">
        {DAY_LABELS.map((label, i) => {
          const done = weeklyData[i] > 0;
          const isToday = i === todayIdx;
          return (
            <div
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold transition-colors ${
                done
                  ? 'text-white'
                  : isToday
                    ? 'bg-transparent'
                    : ''
              }`}
              style={{
                ...(done ? { background: 'var(--color-forest-primary)' } : {}),
                ...(isToday && !done ? { border: '2px solid var(--color-forest-primary)', color: 'var(--color-forest-primary)' } : {}),
                ...(!done && !isToday ? { background: '#F3F4F6', color: '#D1D5DB' } : {}),
              }}
            >
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Topics to improve */
function WeakTopics({ topics = [], onTopicSelect }) {
  if (topics.length === 0) return null;

  return (
    <div className="animate-fade-up" style={{ animationDelay: '240ms' }}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.06em] mb-4" style={{ color: 'var(--color-section-label)' }}>
        Donde más puedes mejorar
      </p>
      <div className="flex flex-col gap-3">
        {topics.slice(0, 3).map((topic) => (
          <div key={topic.id || topic.name} className="flex items-center justify-between">
            <span className="text-[13px] text-gray-900">{topic.name}</span>
            <button
              onClick={() => onTopicSelect?.(topic)}
              className="text-[12px] font-semibold hover:underline transition-colors active:scale-[0.97]"
              style={{ color: 'var(--color-forest-primary)' }}
            >
              Practicar →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Community proof */
function CommunityProof() {
  return (
    <div className="text-center animate-fade-up" style={{ animationDelay: '300ms' }}>
      <p className="text-[12px]" style={{ color: 'var(--color-muted-soft)' }}>
        <span className="font-semibold text-gray-900">847</span> opositores estudiando hoy
      </p>
    </div>
  );
}

/** Feature feedback — "¿Qué feature quieres primero?" */
function FeatureFeedback() {
  const [voted, setVoted] = useState(null);
  const features = ['Simulacros de examen', 'Flashcards', 'Temario resumido', 'Más oposiciones'];

  const handleVote = async (feature) => {
    setVoted(feature);
    const { supabase } = await import('../../lib/supabase');
    supabase.from('feature_votes').insert({ feature }).catch(() => {});
  };

  return (
    <div className="mt-10 mb-4 rounded-xl p-5 border border-black/5 bg-white animate-fade-up" style={{ animationDelay: '400ms' }}>
      {voted ? (
        <p className="text-center text-sm" style={{ color: 'var(--color-body-text)' }}>
          ✓ ¡Gracias! Tendremos en cuenta tu voto por <strong>{voted}</strong>.
        </p>
      ) : (
        <>
          <p className="text-xs font-semibold uppercase mb-3" style={{ letterSpacing: '0.06em', color: 'var(--color-section-label)' }}>
            ¿Qué feature quieres primero?
          </p>
          <div className="flex flex-wrap gap-2">
            {features.map(f => (
              <button
                key={f}
                onClick={() => handleVote(f)}
                className="text-sm px-4 py-2 rounded-full border border-black/5 bg-[#FAFAF7] hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-all active:scale-[0.97]"
                style={{ color: 'var(--color-body-text)' }}
              >
                {f}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/** Tip box */
function TipBox({ text = 'Mejor 10 preguntas cada día que 70 el domingo' }) {
  return (
    <div className="rounded-xl p-4 animate-fade-up" style={{ background: 'rgba(45,106,79,0.06)', animationDelay: '360ms' }}>
      <p className="text-[13px] leading-relaxed" style={{ color: 'var(--color-body-text)' }}>
        💡 {text}
      </p>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function SoftFortHome({
  userName = 'Usuario',
  streakData = { current: 0, longest: 0 },
  totalStats = { testsCompleted: 0, questionsCorrect: 0, accuracyRate: 0, totalQuestions: 0 },
  weeklyData = [0, 0, 0, 0, 0, 0, 0],
  todayStats = { questionsAnswered: 0 },
  fortalezaData = [],
  studyPlan = null,
  onStartSession,
  onStartActivity,
  onTopicSelect,
  onNavigate,
  readiness = null,
  showTopBar = false,
  showFooter = true,
  // Unused props kept for compatibility
  onSettingsClick,
  onProgressClick,
  onStreakClick,
  onAccuracyClick,
  onLevelClick,
  onViewAllTopics,
  weeklyImprovement,
}) {
  const { isAdmin, user } = useAuth();
  const weeklyGoalQuestions = useUserStore((s) => s.userData.weeklyGoalQuestions) || 75;
  const [simulationMode, setSimulationMode] = useState(null);
  const { isFeatureLocked } = usePremium();

  // Simulation mode (dev only)
  const getSimulatedData = () => {
    if (!simulationMode) return null;
    const state = userStates[simulationMode];
    return state?.generate ? state.generate() : state;
  };
  const simulatedData = getSimulatedData();
  const effectiveStats = simulatedData?.totalStats || totalStats;
  const effectiveStreak = simulatedData
    ? { current: simulatedData.totalStats.currentStreak, longest: simulatedData.totalStats.currentStreak + 5 }
    : streakData;

  // Derived state
  // Guest (unauthenticated) users always see the trial CTA
  const isNewUser = !user || (effectiveStats.testsCompleted === 0 && effectiveStats.questionsCorrect === 0 && fortalezaData.length === 0);
  const totalAnswered = effectiveStats.totalQuestions || 0;
  const topicsExplored = new Set(fortalezaData.filter(t => t.progress > 0).map(t => t.id)).size || 0;
  const totalHours = Math.round((effectiveStats.testsCompleted * 8) / 60) || 0; // rough estimate

  // Mastered questions (FSRS state >= 2)
  const masteredCount = effectiveStats.questionsCorrect || 0;

  // Weak topics (sorted by worst performance)
  const weakTopics = [...fortalezaData]
    .filter(t => t.progress > 0 && t.progress < 70)
    .sort((a, b) => a.progress - b.progress)
    .slice(0, 3);

  // Next topic for session
  const sortedTopics = [...fortalezaData].sort((a, b) => {
    const configA = statusConfig[a.status] || statusConfig.nuevo;
    const configB = statusConfig[b.status] || statusConfig.nuevo;
    if (configA.priority !== configB.priority) return configA.priority - configB.priority;
    return b.progress - a.progress;
  });
  const nextTopic = sortedTopics[0] || { id: 1, name: 'Constitución Española', status: 'nuevo', progress: 0 };

  // Build activity for hero card — always use full topic name (not codes like "T3")
  const rawActivity = studyPlan?.activities?.[0];
  const heroActivity = rawActivity ? {
    ...rawActivity,
    // If title starts with "Reforzar T" or similar code, replace with topic name
    title: rawActivity.title?.match(/^(Reforzar|Repasar|Practicar)\s+T\d/)
      ? rawActivity.title.replace(/T\d+.*/, nextTopic.name || rawActivity.title)
      : rawActivity.title || nextTopic.name,
  } : {
    title: nextTopic.name,
    description: `Tema ${nextTopic.number || nextTopic.id}`,
    estimatedMinutes: 10,
    questionCount: 8,
    config: { topic: nextTopic },
  };

  const handleStartActivity = (activity) => {
    if (onStartActivity) onStartActivity(activity);
    else if (onStartSession) onStartSession(activity?.config?.topic || nextTopic);
  };

  // Daily insight message
  const getInsight = () => {
    if (isNewUser) return 'Tu primera sesión te espera. Solo 5 minutos para empezar.';
    if (studyPlan?.dailyInsight) return typeof studyPlan.dailyInsight === 'string' ? studyPlan.dailyInsight : studyPlan.dailyInsight.text;
    if (weakTopics.length > 0) {
      return `${weakTopics[0].name} es donde más puedes mejorar — una sesión corta hoy podría marcar la diferencia.`;
    }
    return 'Sigue con tu ritmo. Cada sesión cuenta.';
  };

  // Mock recent sessions from fortalezaData
  const recentSessions = fortalezaData
    .filter(t => t.progress > 0)
    .slice(0, 3)
    .map((t, i) => ({
      topic: t.name,
      score: Math.round(t.progress / 10),
      total: 10,
      date: i === 0 ? 'ayer' : i === 1 ? 'miércoles' : 'martes',
    }));

  const dayLabel = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div>
      {/* GREETING + Create account CTA for guests */}
      <div className="mb-8 animate-fade-up flex items-start justify-between" style={{ animationDelay: '0ms' }}>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.06em] mb-1" style={{ color: 'var(--color-section-label)' }}>
            {dayLabel}
          </p>
          <h1 className="text-[28px] font-bold tracking-[-0.03em] text-gray-900 leading-tight">
            Hola, {userName.split(' ')[0]}
          </h1>
        </div>
        {!user && (
          <a
            href="#/signup"
            className="shrink-0 text-sm font-semibold px-4 py-2 rounded-lg bg-[#2D6A4F] text-white hover:bg-[#1B4332] active:scale-[0.97] transition-all"
          >
            Crear cuenta
          </a>
        )}
      </div>

      {/* DAILY INSIGHT */}
      <div className="mb-7 animate-fade-up" style={{ animationDelay: '80ms' }}>
        <p className="text-[15px] leading-relaxed max-w-[540px]" style={{ color: 'var(--color-body-text)' }}>
          {getInsight()}
        </p>
      </div>

      {/* 2-COLUMN LAYOUT: Main + Right panel */}
      <div className="flex gap-0">

        {/* === LEFT: Main content === */}
        <div className="flex-1 min-w-0 space-y-8 lg:pr-10">
          {/* Hero */}
          {isNewUser ? (
            <WelcomeHeroCard onStart={() => onStartSession?.()} />
          ) : (
            <HeroSessionCard activity={heroActivity} onStart={handleStartActivity} />
          )}

          {/* Stats — borderless */}
          {!isNewUser && (
            <StatsRow
              totalQuestions={totalAnswered}
              topicsExplored={topicsExplored}
              totalHours={totalHours}
            />
          )}

          {/* Quick actions */}
          <QuickActions
            onFlashcards={() => onStartActivity?.({ config: { mode: 'flashcards', autoStart: true } })}
            onReview={() => onStartActivity?.({ config: { mode: 'repaso', autoStart: true } })}
            onSimulacro={() => onStartActivity?.({ config: { mode: 'simulacro', autoStart: true } })}
            reviewCount={12}
            isNew={isNewUser}
            isFeatureLocked={isFeatureLocked}
          />

          {/* Recent sessions OR how it works */}
          {isNewUser ? (
            <HowItWorks />
          ) : (
            <RecentSessions sessions={recentSessions} />
          )}
        </div>

        {/* === RIGHT: Panel (desktop only) === */}
        <div className="hidden lg:block w-[300px] shrink-0 border-l border-black/5 pl-7 space-y-9" style={{ background: 'rgba(255,255,255,0.5)' }}>
          {/* Mastery */}
          <MasteryCard mastered={masteredCount} total={1414} />

          {/* Weekly */}
          <WeeklyCircles weeklyData={weeklyData} />

          {/* Weak topics */}
          {!isNewUser && weakTopics.length > 0 && (
            <WeakTopics topics={weakTopics} onTopicSelect={onTopicSelect} />
          )}

          {/* Community */}
          <CommunityProof />

          {/* Tip */}
          <TipBox />
        </div>
      </div>

      {/* Mobile: Right panel content stacks below */}
      <div className="lg:hidden mt-8 space-y-8">
        <MasteryCard mastered={masteredCount} total={1414} />
        <WeeklyCircles weeklyData={weeklyData} />
        {!isNewUser && weakTopics.length > 0 && (
          <WeakTopics topics={weakTopics} onTopicSelect={onTopicSelect} />
        )}
        <CommunityProof />
        <TipBox />
      </div>

      {/* Feature feedback */}
      <FeatureFeedback />

      {/* DevMode Randomizer */}
      {(import.meta.env.DEV || isAdmin) && (
        <DevModeRandomizer
          activeMode={simulationMode}
          onSelectMode={setSimulationMode}
          onClear={() => setSimulationMode(null)}
          pageContext="home"
        />
      )}
    </div>
  );
}
