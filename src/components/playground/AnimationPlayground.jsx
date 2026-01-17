/**
 * Animation Playground - OpositaSmart
 *
 * Award-winning animation showcase and testing ground.
 * All animations can be toggled and previewed before integration.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
  ArrowLeft, Check, X, Sparkles, Zap, Trophy, Flame,
  Star, Heart, ChevronRight, Play, Pause, RotateCcw,
  Sun, Moon, Volume2, VolumeX, Eye, EyeOff
} from 'lucide-react';

// ============================================
// ANIMATION PRESETS (Award-Winning Quality)
// ============================================

const springPresets = {
  // Bouncy - for celebrations and success states
  bouncy: { type: "spring", stiffness: 400, damping: 10 },
  // Snappy - for button interactions
  snappy: { type: "spring", stiffness: 400, damping: 25 },
  // Gentle - for page transitions
  gentle: { type: "spring", stiffness: 100, damping: 20 },
  // Wobbly - for playful feedback
  wobbly: { type: "spring", stiffness: 300, damping: 8 },
  // Smooth - for progress bars
  smooth: { type: "spring", stiffness: 50, damping: 15 },
};

// Stagger children animations
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: springPresets.gentle
  },
};

// ============================================
// MICRO-INTERACTIONS
// ============================================

// Premium button with haptic-like feedback
function PremiumButton({ children, variant = 'primary', onClick, disabled = false }) {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/30',
    secondary: 'bg-white border-2 border-purple-200 text-purple-700',
    success: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30',
    ghost: 'bg-purple-50 text-purple-700',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-3 rounded-2xl font-semibold text-base
        ${variants[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={springPresets.snappy}
    >
      {children}
    </motion.button>
  );
}

// Magnetic button - follows cursor slightly
function MagneticButton({ children, onClick }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.1);
    y.set((e.clientY - centerY) * 0.1);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.95 }}
      className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/40 transition-shadow"
    >
      {children}
    </motion.button>
  );
}

// ============================================
// QUIZ ANSWER ANIMATIONS
// ============================================

function QuizAnswerOption({
  text,
  index,
  isSelected,
  isCorrect,
  isRevealed,
  onSelect,
  disabled
}) {
  const letters = ['A', 'B', 'C', 'D'];

  // Determine visual state
  let state = 'default';
  if (isRevealed) {
    if (isCorrect) state = 'correct';
    else if (isSelected) state = 'incorrect';
  } else if (isSelected) {
    state = 'selected';
  }

  const stateStyles = {
    default: {
      bg: 'bg-white',
      border: 'border-gray-200',
      text: 'text-gray-800',
      badge: 'bg-gray-100 text-gray-600 border-gray-200',
    },
    selected: {
      bg: 'bg-purple-50',
      border: 'border-purple-400',
      text: 'text-purple-900',
      badge: 'bg-purple-500 text-white border-purple-500',
    },
    correct: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-400',
      text: 'text-emerald-900',
      badge: 'bg-emerald-500 text-white border-emerald-500',
    },
    incorrect: {
      bg: 'bg-amber-50',
      border: 'border-amber-400',
      text: 'text-amber-900',
      badge: 'bg-amber-500 text-white border-amber-500',
    },
  };

  const style = stateStyles[state];

  // Animation variants
  const variants = {
    default: { scale: 1, x: 0 },
    selected: { scale: 1.02 },
    correct: { scale: 1.02 },
    incorrect: {
      x: [0, -8, 8, -8, 8, 0],
      transition: { duration: 0.4 }
    },
  };

  return (
    <motion.button
      onClick={() => !disabled && onSelect(index)}
      disabled={disabled}
      className={`
        w-full p-4 rounded-xl border-2 text-left
        ${style.bg} ${style.border} ${style.text}
        ${disabled ? 'cursor-default' : 'cursor-pointer'}
      `}
      initial="default"
      animate={state}
      variants={variants}
      whileHover={!disabled ? { scale: 1.01, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={springPresets.snappy}
    >
      <div className="flex items-center gap-3">
        <motion.span
          className={`
            w-8 h-8 rounded-full border-2 flex items-center justify-center
            font-bold text-sm ${style.badge}
          `}
          animate={state === 'correct' ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          {isRevealed && isCorrect ? (
            <Check className="w-4 h-4" />
          ) : isRevealed && isSelected && !isCorrect ? (
            <X className="w-4 h-4" />
          ) : (
            letters[index]
          )}
        </motion.span>
        <span className="flex-1 font-medium">{text}</span>
      </div>
    </motion.button>
  );
}

// Quiz card with page-flip transition
function QuizCard({ question, questionNumber, totalQuestions, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (index) => {
    if (revealed) return;
    setSelected(index);
  };

  const handleConfirm = () => {
    setRevealed(true);
    setTimeout(() => {
      onAnswer?.(selected === question.correctIndex);
    }, 1500);
  };

  const handleReset = () => {
    setSelected(null);
    setRevealed(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      exit={{ opacity: 0, y: -30, rotateX: 10 }}
      transition={springPresets.gentle}
      className="bg-white rounded-3xl shadow-xl p-6 max-w-lg mx-auto"
    >
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">
          Pregunta {questionNumber} de {totalQuestions}
        </span>
        <motion.div
          className="h-1.5 bg-gray-100 rounded-full flex-1 mx-4 overflow-hidden"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            transition={springPresets.smooth}
          />
        </motion.div>
      </div>

      {/* Question */}
      <h3 className="text-lg font-semibold text-gray-900 mb-6 leading-relaxed">
        {question.text}
      </h3>

      {/* Options */}
      <motion.div
        className="space-y-3 mb-6"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {question.options.map((opt, i) => (
          <motion.div key={i} variants={staggerItem}>
            <QuizAnswerOption
              text={opt}
              index={i}
              isSelected={selected === i}
              isCorrect={i === question.correctIndex}
              isRevealed={revealed}
              onSelect={handleSelect}
              disabled={revealed}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Actions */}
      <div className="flex gap-3">
        <motion.button
          onClick={handleReset}
          className="p-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200"
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>

        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.button
              key="confirm"
              onClick={handleConfirm}
              disabled={selected === null}
              className={`
                flex-1 py-3 rounded-xl font-semibold
                ${selected !== null
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
              `}
              whileHover={selected !== null ? { scale: 1.02 } : {}}
              whileTap={selected !== null ? { scale: 0.98 } : {}}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Confirmar
            </motion.button>
          ) : (
            <motion.div
              key="result"
              className={`
                flex-1 py-3 rounded-xl font-semibold text-center
                ${selected === question.correctIndex
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'}
              `}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={springPresets.bouncy}
            >
              {selected === question.correctIndex ? '¡Correcto!' : 'Revisa la respuesta'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ============================================
// PROGRESS ANIMATIONS
// ============================================

// Animated progress bar with spring physics
function AnimatedProgressBar({ value, max = 100, color = 'purple', showLabel = true }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colors = {
    purple: 'from-purple-500 to-violet-600',
    emerald: 'from-emerald-500 to-teal-600',
    amber: 'from-amber-500 to-orange-600',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Progreso</span>
          <motion.span
            className="text-sm font-bold text-purple-600"
            key={value}
            initial={{ scale: 1.2, color: '#7c3aed' }}
            animate={{ scale: 1, color: '#7c3aed' }}
            transition={springPresets.bouncy}
          >
            {Math.round(percentage)}%
          </motion.span>
        </div>
      )}
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${colors[color]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={springPresets.smooth}
        />
      </div>
    </div>
  );
}

// Circular progress with animated stroke
function CircularProgress({ value, max = 100, size = 120, strokeWidth = 8 }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={springPresets.smooth}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="text-2xl font-bold text-gray-800"
          key={value}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={springPresets.bouncy}
        >
          {Math.round(percentage)}%
        </motion.span>
      </div>
    </div>
  );
}

// ============================================
// STREAK & CELEBRATION ANIMATIONS
// ============================================

function StreakCounter({ count, isAnimating = false }) {
  return (
    <motion.div
      className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-amber-50 px-5 py-3 rounded-2xl border border-orange-200"
      animate={isAnimating ? { scale: [1, 1.05, 1] } : {}}
      transition={springPresets.bouncy}
    >
      <motion.span
        className="text-3xl"
        animate={isAnimating ? {
          rotate: [0, -10, 10, -10, 0],
          scale: [1, 1.2, 1]
        } : {}}
        transition={{ duration: 0.5 }}
      >
        🔥
      </motion.span>
      <div>
        <motion.span
          className="text-2xl font-bold text-orange-600 block"
          key={count}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={springPresets.bouncy}
        >
          {count} días
        </motion.span>
        <span className="text-sm text-orange-600/70">Racha de estudio</span>
      </div>
    </motion.div>
  );
}

// Confetti-like celebration
function CelebrationBurst({ show, onComplete }) {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    emoji: ['🎉', '✨', '⭐', '🌟', '💫'][i % 5],
    x: Math.random() * 200 - 100,
    y: Math.random() * -150 - 50,
    rotate: Math.random() * 360,
    delay: Math.random() * 0.3,
  }));

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationComplete={onComplete}
        >
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute text-2xl left-1/2 top-1/2"
              initial={{ x: 0, y: 0, scale: 0, rotate: 0 }}
              animate={{
                x: p.x,
                y: p.y,
                scale: [0, 1, 0],
                rotate: p.rotate,
              }}
              transition={{
                duration: 1,
                delay: p.delay,
                ease: "easeOut"
              }}
            >
              {p.emoji}
            </motion.span>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Success checkmark animation
function SuccessCheckmark({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={springPresets.bouncy}
        >
          <motion.div
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Check className="w-10 h-10 text-white" strokeWidth={3} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================
// FORTALEZA ENHANCED
// ============================================

function FortalezaBlock({ estado, progreso, delay = 0 }) {
  const config = {
    dominado: { bg: 'bg-emerald-100', border: 'border-emerald-500', icon: '✓' },
    avanzando: { bg: 'bg-purple-100', border: 'border-purple-400', icon: null },
    progreso: { bg: 'bg-purple-50', border: 'border-purple-300', icon: null },
    riesgo: { bg: 'bg-amber-100', border: 'border-amber-400', icon: '!', pulse: true },
    nuevo: { bg: 'bg-gray-100', border: 'border-gray-300', icon: null },
  };

  const c = config[estado] || config.nuevo;

  return (
    <motion.div
      className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center ${c.bg} ${c.border}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        ...(c.pulse ? { scale: [1, 1.05, 1] } : {})
      }}
      transition={{
        ...springPresets.bouncy,
        delay,
        ...(c.pulse ? { repeat: Infinity, duration: 2 } : {})
      }}
    >
      {c.icon ? (
        <span className={`font-bold ${estado === 'dominado' ? 'text-emerald-600' : 'text-amber-600'}`}>
          {c.icon}
        </span>
      ) : progreso > 0 ? (
        <span className="text-xs font-bold text-purple-600">{progreso}%</span>
      ) : null}
    </motion.div>
  );
}

function FortalezaEnhanced({ temas }) {
  return (
    <motion.div
      className="bg-white rounded-2xl p-5 shadow-sm border"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🏰</span>
        <h3 className="font-bold text-gray-900">Tu Fortaleza</h3>
      </div>

      <div className="flex gap-2 flex-wrap justify-center">
        {temas.map((tema, i) => (
          <motion.div key={tema.id} variants={staggerItem}>
            <FortalezaBlock
              estado={tema.estado}
              progreso={tema.progreso}
              delay={i * 0.05}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================
// PAGE TRANSITIONS
// ============================================

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springPresets.gentle
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: { duration: 0.2 }
  },
};

function PageTransition({ children, id }) {
  return (
    <motion.div
      key={id}
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

// ============================================
// SKELETON LOADERS
// ============================================

function SkeletonPulse({ className }) {
  return (
    <motion.div
      className={`bg-gray-200 rounded-xl ${className}`}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function QuizSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-6 max-w-lg mx-auto space-y-4">
      <SkeletonPulse className="h-4 w-24" />
      <SkeletonPulse className="h-6 w-full" />
      <SkeletonPulse className="h-6 w-3/4" />
      <div className="space-y-3 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonPulse key={i} className="h-14 w-full" />
        ))}
      </div>
    </div>
  );
}

// ============================================
// MAIN PLAYGROUND COMPONENT
// ============================================

export default function AnimationPlayground({ onClose }) {
  const [activeSection, setActiveSection] = useState('buttons');
  const [progress, setProgress] = useState(65);
  const [streak, setStreak] = useState(7);
  const [streakAnimating, setStreakAnimating] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Demo question
  const demoQuestion = {
    text: "Según el artículo 66 de la Constitución, ¿quién representa al pueblo español?",
    options: [
      "El Rey",
      "Las Cortes Generales",
      "El Gobierno",
      "El Tribunal Constitucional"
    ],
    correctIndex: 1,
  };

  // Demo temas for Fortaleza
  const demoTemas = [
    { id: 1, estado: 'dominado', progreso: 100 },
    { id: 2, estado: 'dominado', progreso: 100 },
    { id: 3, estado: 'avanzando', progreso: 75 },
    { id: 4, estado: 'progreso', progreso: 45 },
    { id: 5, estado: 'riesgo', progreso: 20 },
    { id: 6, estado: 'nuevo', progreso: 0 },
  ];

  const sections = [
    { id: 'buttons', label: 'Botones', icon: '👆' },
    { id: 'quiz', label: 'Quiz', icon: '📝' },
    { id: 'progress', label: 'Progreso', icon: '📊' },
    { id: 'feedback', label: 'Feedback', icon: '✨' },
    { id: 'transitions', label: 'Transiciones', icon: '🔄' },
  ];

  const incrementStreak = () => {
    setStreakAnimating(true);
    setStreak(s => s + 1);
    setTimeout(() => setStreakAnimating(false), 600);
  };

  const triggerCelebration = () => {
    setShowCelebration(true);
    setShowSuccess(true);
    setTimeout(() => {
      setShowCelebration(false);
      setShowSuccess(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50">
      {/* Header */}
      <motion.header
        className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={springPresets.gentle}
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100"
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </motion.button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Animation Playground</h1>
              <p className="text-sm text-gray-500">Prueba las animaciones antes de integrar</p>
            </div>
          </div>
          <motion.div
            className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 rounded-full"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">framer-motion</span>
          </motion.div>
        </div>
      </motion.header>

      {/* Navigation */}
      <div className="sticky top-[73px] bg-white/80 backdrop-blur-lg border-b border-gray-100 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {sections.map((section) => (
              <motion.button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`
                  px-4 py-2 rounded-xl font-medium whitespace-nowrap text-sm
                  ${activeSection === section.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}
                `}
                whileTap={{ scale: 0.97 }}
                transition={springPresets.snappy}
              >
                {section.icon} {section.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* BUTTONS SECTION */}
          {activeSection === 'buttons' && (
            <PageTransition id="buttons">
              <div className="space-y-6">
                <Card title="Botón Primario (Spring)" description="Scale + sombra animada">
                  <div className="flex gap-4 flex-wrap">
                    <PremiumButton variant="primary">Comenzar Quiz</PremiumButton>
                    <PremiumButton variant="secondary">Ver Resultados</PremiumButton>
                    <PremiumButton variant="success">¡Completado!</PremiumButton>
                    <PremiumButton variant="ghost">Cancelar</PremiumButton>
                  </div>
                </Card>

                <Card title="Botón Magnético" description="Sigue el cursor sutilmente">
                  <MagneticButton>Hover sobre mí ✨</MagneticButton>
                </Card>

                <Card title="Botones de Acción" description="Para navegación rápida">
                  <div className="flex gap-3">
                    {[
                      { icon: Check, color: 'emerald' },
                      { icon: ChevronRight, color: 'purple' },
                      { icon: RotateCcw, color: 'amber' },
                    ].map((item, i) => (
                      <motion.button
                        key={i}
                        className={`p-4 rounded-xl bg-${item.color}-100 text-${item.color}-600`}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        transition={springPresets.snappy}
                      >
                        <item.icon className="w-6 h-6" />
                      </motion.button>
                    ))}
                  </div>
                </Card>
              </div>
            </PageTransition>
          )}

          {/* QUIZ SECTION */}
          {activeSection === 'quiz' && (
            <PageTransition id="quiz">
              <div className="space-y-6">
                <Card title="Selección de Respuesta" description="Animación de selección + feedback correcto/incorrecto">
                  <QuizCard
                    question={demoQuestion}
                    questionNumber={5}
                    totalQuestions={10}
                  />
                </Card>

                <Card title="Loading State" description="Skeleton mientras cargan preguntas">
                  <QuizSkeleton />
                </Card>
              </div>
            </PageTransition>
          )}

          {/* PROGRESS SECTION */}
          {activeSection === 'progress' && (
            <PageTransition id="progress">
              <div className="space-y-6">
                <Card title="Barra de Progreso (Spring)" description="Animación suave al cambiar valor">
                  <div className="w-full max-w-md space-y-4">
                    <AnimatedProgressBar value={progress} />
                    <div className="flex gap-2 justify-center">
                      {[25, 50, 75, 100].map(p => (
                        <motion.button
                          key={p}
                          onClick={() => setProgress(p)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium
                            ${progress === p
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                          `}
                          whileTap={{ scale: 0.95 }}
                        >
                          {p}%
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </Card>

                <Card title="Progreso Circular" description="Con gradiente y animación">
                  <div className="flex gap-6 items-center">
                    <CircularProgress value={progress} />
                    <div className="space-y-2">
                      <p className="font-semibold text-gray-800">Tema 7</p>
                      <p className="text-sm text-gray-500">Organización del Estado</p>
                    </div>
                  </div>
                </Card>

                <Card title="Fortaleza Animada" description="Entrada escalonada + estados visuales">
                  <FortalezaEnhanced temas={demoTemas} />
                </Card>
              </div>
            </PageTransition>
          )}

          {/* FEEDBACK SECTION */}
          {activeSection === 'feedback' && (
            <PageTransition id="feedback">
              <div className="space-y-6 relative">
                <CelebrationBurst
                  show={showCelebration}
                  onComplete={() => {}}
                />

                <Card title="Racha de Estudio" description="Animación al incrementar">
                  <div className="flex items-center gap-4">
                    <StreakCounter count={streak} isAnimating={streakAnimating} />
                    <PremiumButton variant="ghost" onClick={incrementStreak}>
                      +1 día
                    </PremiumButton>
                  </div>
                </Card>

                <Card title="Celebración" description="Para logros importantes">
                  <div className="flex flex-col items-center gap-4">
                    <SuccessCheckmark show={showSuccess} />
                    <PremiumButton onClick={triggerCelebration}>
                      🎉 Celebrar
                    </PremiumButton>
                  </div>
                </Card>

                <Card title="Feedback Visual" description="Sin rojo - usamos ámbar para errores">
                  <div className="flex gap-4">
                    <motion.div
                      className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-400 flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                    >
                      <Check className="w-5 h-5 text-emerald-600" />
                      <span className="font-medium text-emerald-700">Correcto</span>
                    </motion.div>
                    <motion.div
                      className="p-4 rounded-xl bg-amber-50 border-2 border-amber-400 flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ x: [0, -5, 5, -5, 0] }}
                      transition={{ duration: 0.3 }}
                    >
                      <X className="w-5 h-5 text-amber-600" />
                      <span className="font-medium text-amber-700">Revisar</span>
                    </motion.div>
                  </div>
                </Card>
              </div>
            </PageTransition>
          )}

          {/* TRANSITIONS SECTION */}
          {activeSection === 'transitions' && (
            <PageTransition id="transitions">
              <div className="space-y-6">
                <Card title="Page Transitions" description="AnimatePresence para cambios de vista">
                  <p className="text-sm text-gray-600">
                    Navega entre las secciones arriba para ver las transiciones en acción.
                  </p>
                </Card>

                <Card title="Stagger Children" description="Elementos que aparecen en secuencia">
                  <motion.div
                    className="flex gap-3"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    key={Date.now()} // Force re-render
                  >
                    {[1, 2, 3, 4, 5].map((i) => (
                      <motion.div
                        key={i}
                        variants={staggerItem}
                        className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center font-bold text-purple-600"
                      >
                        {i}
                      </motion.div>
                    ))}
                  </motion.div>
                  <PremiumButton
                    variant="ghost"
                    onClick={() => setActiveSection('transitions')}
                  >
                    Repetir animación
                  </PremiumButton>
                </Card>
              </div>
            </PageTransition>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-900 rounded-2xl p-6 text-white">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Resumen de Features
          </h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• <strong>Spring physics</strong> - Animaciones naturales y fluidas</li>
            <li>• <strong>AnimatePresence</strong> - Transiciones de entrada/salida</li>
            <li>• <strong>Stagger</strong> - Animaciones secuenciales</li>
            <li>• <strong>Magnetic buttons</strong> - Interacción premium</li>
            <li>• <strong>Ámbar para errores</strong> - Sin rojo (menos ansiedad)</li>
            <li>• <strong>Celebraciones</strong> - Confetti y checkmarks</li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// HELPER COMPONENTS
// ============================================

function Card({ title, description, children }) {
  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springPresets.gentle}
    >
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      <div className="flex flex-col items-start gap-4">
        {children}
      </div>
    </motion.div>
  );
}
