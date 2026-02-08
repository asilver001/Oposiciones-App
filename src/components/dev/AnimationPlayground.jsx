/**
 * Animation Playground - OpositaSmart
 *
 * Award-winning animation showcase and testing ground.
 * All animations can be toggled and previewed before integration.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useInView } from 'framer-motion';
import {
  ArrowLeft, Check, X, Sparkles, Zap, Trophy, Flame,
  Star, Heart, ChevronRight, Play, Pause, RotateCcw,
  Sun, Moon, Volume2, VolumeX, Eye, EyeOff, BookOpen,
  Target, Award, TrendingUp, Clock, Calendar, Gift,
  ThumbsUp, MessageCircle, Share2, Bookmark, Bell,
  Settings, User, Home, Search, Menu, Plus, Minus,
  ChevronDown, ChevronUp, ArrowRight, RefreshCw
} from 'lucide-react';

// ============================================
// ANIMATION PRESETS (Award-Winning Quality)
// ============================================

const springPresets = {
  bouncy: { type: "spring", stiffness: 400, damping: 10 },
  snappy: { type: "spring", stiffness: 400, damping: 25 },
  gentle: { type: "spring", stiffness: 100, damping: 20 },
  wobbly: { type: "spring", stiffness: 300, damping: 8 },
  smooth: { type: "spring", stiffness: 50, damping: 15 },
  slow: { type: "spring", stiffness: 30, damping: 20 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: springPresets.gentle },
};

// ============================================
// 1. MICRO-INTERACTIONS - BUTTONS
// ============================================

function PremiumButton({ children, variant = 'primary', onClick, disabled = false, icon: Icon }) {
  const variants = {
    primary: 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-lg shadow-brand-500/30',
    secondary: 'bg-white border-2 border-brand-200 text-brand-700',
    success: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30',
    ghost: 'bg-brand-50 text-brand-700',
    amber: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-3 rounded-2xl font-semibold text-base flex items-center gap-2
        ${variants[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={springPresets.snappy}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </motion.button>
  );
}

function MagneticButton({ children, onClick }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  };

  return (
    <motion.button
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.95 }}
      className="px-8 py-4 bg-gradient-to-r from-violet-600 to-brand-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-brand-500/25 hover:shadow-2xl hover:shadow-brand-500/40 transition-shadow"
    >
      {children}
    </motion.button>
  );
}

// Glow button with animated border
function GlowButton({ children, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="relative px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold overflow-hidden group"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-brand-500 via-pink-500 to-brand-500 opacity-75"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        style={{ filter: 'blur(20px)' }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

// Ripple button
function RippleButton({ children, onClick }) {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples(prev => [...prev, { x, y, id }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 600);
    onClick?.();
  };

  return (
    <motion.button
      onClick={handleClick}
      className="relative px-8 py-4 bg-brand-600 text-white rounded-2xl font-bold overflow-hidden"
      whileTap={{ scale: 0.98 }}
    >
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          style={{ left: ripple.x, top: ripple.y, width: 10, height: 10, marginLeft: -5, marginTop: -5 }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 20, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

// ============================================
// 2. QUIZ ANIMATIONS
// ============================================

function QuizAnswerOption({ text, index, isSelected, isCorrect, isRevealed, onSelect, disabled }) {
  const letters = ['A', 'B', 'C', 'D'];

  let state = 'default';
  if (isRevealed) {
    if (isCorrect) state = 'correct';
    else if (isSelected) state = 'incorrect';
  } else if (isSelected) {
    state = 'selected';
  }

  const stateStyles = {
    default: { bg: 'bg-white', border: 'border-gray-200', text: 'text-gray-800', badge: 'bg-gray-100 text-gray-600' },
    selected: { bg: 'bg-brand-50', border: 'border-brand-400', text: 'text-brand-900', badge: 'bg-brand-500 text-white' },
    correct: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-900', badge: 'bg-emerald-500 text-white' },
    incorrect: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-900', badge: 'bg-amber-500 text-white' },
  };

  const style = stateStyles[state];

  return (
    <motion.button
      onClick={() => !disabled && onSelect(index)}
      disabled={disabled}
      className={`w-full p-4 rounded-xl border-2 text-left ${style.bg} ${style.border} ${style.text} ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{
        opacity: 1,
        x: 0,
        ...(state === 'incorrect' ? { x: [0, -8, 8, -8, 8, 0] } : {})
      }}
      whileHover={!disabled ? { scale: 1.01, x: 4 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={state === 'incorrect' ? { duration: 0.4 } : springPresets.snappy}
    >
      <div className="flex items-center gap-3">
        <motion.span
          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${style.badge}`}
          animate={state === 'correct' ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          {isRevealed && isCorrect ? <Check className="w-4 h-4" /> :
           isRevealed && isSelected && !isCorrect ? <X className="w-4 h-4" /> : letters[index]}
        </motion.span>
        <span className="flex-1 font-medium">{text}</span>
        {isRevealed && isCorrect && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={springPresets.bouncy}
          >
            <Sparkles className="w-5 h-5 text-emerald-500" />
          </motion.span>
        )}
      </div>
    </motion.button>
  );
}

function QuizCard({ question, questionNumber, totalQuestions, onAnswer, onReset }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const handleConfirm = () => {
    setRevealed(true);
    setTimeout(() => onAnswer?.(selected === question.correctIndex), 1500);
  };

  const handleReset = () => {
    setSelected(null);
    setRevealed(false);
    onReset?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: -5 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      exit={{ opacity: 0, y: -30, rotateX: 5 }}
      transition={springPresets.gentle}
      className="bg-white rounded-3xl shadow-xl shadow-brand-500/10 p-6 w-full max-w-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500 font-medium">Pregunta {questionNumber}/{totalQuestions}</span>
        <div className="flex items-center gap-2">
          <motion.div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-500 to-violet-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
              transition={springPresets.smooth}
            />
          </motion.div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-6">{question.text}</h3>

      <div className="space-y-3 mb-6">
        {question.options.map((opt, i) => (
          <QuizAnswerOption
            key={i}
            text={opt}
            index={i}
            isSelected={selected === i}
            isCorrect={i === question.correctIndex}
            isRevealed={revealed}
            onSelect={setSelected}
            disabled={revealed}
          />
        ))}
      </div>

      <div className="flex gap-3">
        <motion.button
          onClick={handleReset}
          className="p-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200"
          whileTap={{ scale: 0.95, rotate: -180 }}
          transition={{ duration: 0.3 }}
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>

        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.button
              key="confirm"
              onClick={handleConfirm}
              disabled={selected === null}
              className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2
                ${selected !== null ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              whileHover={selected !== null ? { scale: 1.02 } : {}}
              whileTap={selected !== null ? { scale: 0.98 } : {}}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              Confirmar <ChevronRight className="w-5 h-5" />
            </motion.button>
          ) : (
            <motion.div
              key="result"
              className={`flex-1 py-3 rounded-xl font-semibold text-center flex items-center justify-center gap-2
                ${selected === question.correctIndex ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={springPresets.bouncy}
            >
              {selected === question.correctIndex ? (
                <><Trophy className="w-5 h-5" /> ¡Correcto!</>
              ) : (
                <><Eye className="w-5 h-5" /> Revisa la respuesta</>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ============================================
// 3. PROGRESS ANIMATIONS
// ============================================

function AnimatedProgressBar({ value, max = 100, color = 'purple', showLabel = true, size = 'md' }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const colors = {
    purple: 'from-brand-500 to-violet-600',
    emerald: 'from-emerald-500 to-teal-600',
    amber: 'from-amber-500 to-orange-600',
    pink: 'from-pink-500 to-rose-600',
  };
  const sizes = { sm: 'h-1.5', md: 'h-3', lg: 'h-4' };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Progreso</span>
          <motion.span
            className="text-sm font-bold text-brand-600"
            key={value}
            initial={{ scale: 1.3, y: -5 }}
            animate={{ scale: 1, y: 0 }}
            transition={springPresets.bouncy}
          >
            {Math.round(percentage)}%
          </motion.span>
        </div>
      )}
      <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${sizes[size]}`}>
        <motion.div
          className={`h-full bg-gradient-to-r ${colors[color]} rounded-full relative`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={springPresets.smooth}
        >
          <motion.div
            className="absolute inset-0 bg-white/20"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: '50%' }}
          />
        </motion.div>
      </div>
    </div>
  );
}

function CircularProgress({ value, max = 100, size = 100, strokeWidth = 8, showIcon = false }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size/2} cy={size/2} r={radius} fill="none"
          stroke="url(#circleGradient)" strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={springPresets.smooth}
        />
        <defs>
          <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-brand-500)" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showIcon && <Star className="w-5 h-5 text-brand-500 mb-1" />}
        <motion.span
          className="text-xl font-bold text-gray-800"
          key={value}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={springPresets.bouncy}
        >
          {Math.round(percentage)}%
        </motion.span>
      </div>
    </div>
  );
}

// Animated counter
function AnimatedCounter({ value, duration = 1 }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <motion.span
      className="text-4xl font-bold text-brand-600 tabular-nums"
      key={value}
    >
      {displayValue.toLocaleString()}
    </motion.span>
  );
}

// ============================================
// 4. STREAK & CELEBRATIONS
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
        animate={isAnimating ? { rotate: [0, -15, 15, -15, 0], scale: [1, 1.2, 1] } : {}}
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

// Pre-compute particles outside render to avoid impure Math.random during render
const CELEBRATION_PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  emoji: ['🎉', '✨', '⭐', '🌟', '💫', '🎊'][i % 6],
  angle: (i / 24) * 360,
  distance: 80 + ((i * 7 + 3) % 60),
  delay: (i * 0.008),
}));

function CelebrationBurst({ show }) {
  const particles = CELEBRATION_PARTICLES;

  return (
    <AnimatePresence>
      {show && (
        <motion.div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute text-2xl"
              initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
              animate={{
                scale: [0, 1.2, 0],
                x: Math.cos(p.angle * Math.PI / 180) * p.distance,
                y: Math.sin(p.angle * Math.PI / 180) * p.distance,
                opacity: [1, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, delay: p.delay, ease: "easeOut" }}
            >
              {p.emoji}
            </motion.span>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SuccessCheckmark({ show, size = 80 }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/40"
          style={{ width: size, height: size }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={springPresets.bouncy}
        >
          <motion.div
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Check className="text-white" style={{ width: size * 0.5, height: size * 0.5 }} strokeWidth={3} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Achievement unlock animation
function AchievementUnlock({ show, title, description, icon: Icon = Trophy }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-4 shadow-xl shadow-orange-500/30 flex items-center gap-4 max-w-sm"
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={springPresets.bouncy}
        >
          <motion.div
            className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center"
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Icon className="w-8 h-8 text-white" />
          </motion.div>
          <div className="flex-1">
            <motion.p
              className="text-white/80 text-xs font-medium"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              🏆 Logro desbloqueado
            </motion.p>
            <motion.p
              className="text-white font-bold"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {title}
            </motion.p>
            <motion.p
              className="text-white/70 text-sm"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              {description}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================
// 5. FORTALEZA ENHANCED
// ============================================

function FortalezaBlock({ estado, progreso, tema: _tema, delay = 0 }) {
  const config = {
    dominado: { bg: 'from-emerald-400 to-emerald-500', icon: Check, shadow: 'shadow-emerald-500/40' },
    avanzando: { bg: 'from-brand-400 to-brand-500', icon: TrendingUp, shadow: 'shadow-brand-500/40' },
    progreso: { bg: 'from-blue-400 to-blue-500', icon: BookOpen, shadow: 'shadow-blue-500/40' },
    riesgo: { bg: 'from-amber-400 to-amber-500', icon: Clock, shadow: 'shadow-amber-500/40', pulse: true },
    nuevo: { bg: 'from-gray-300 to-gray-400', icon: Plus, shadow: 'shadow-gray-400/40' },
  };

  const c = config[estado] || config.nuevo;
  const Icon = c.icon;

  return (
    <motion.div
      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${c.bg} flex items-center justify-center shadow-lg ${c.shadow} cursor-pointer relative overflow-hidden`}
      initial={{ scale: 0, opacity: 0, rotateY: -90 }}
      animate={{ scale: 1, opacity: 1, rotateY: 0 }}
      whileHover={{ scale: 1.1, y: -4 }}
      whileTap={{ scale: 0.95 }}
      transition={{ ...springPresets.bouncy, delay }}
    >
      {c.pulse && (
        <motion.div
          className="absolute inset-0 bg-white/30 rounded-xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      <Icon className="w-6 h-6 text-white relative z-10" />
      {progreso > 0 && progreso < 100 && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-white/30"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progreso / 100 }}
          style={{ originX: 0 }}
        />
      )}
    </motion.div>
  );
}

function FortalezaEnhanced({ temas }) {
  return (
    <motion.div
      className="bg-white rounded-2xl p-5 shadow-sm border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springPresets.gentle}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🏰</span>
        <h3 className="font-bold text-gray-900">Tu Fortaleza</h3>
      </div>
      <div className="flex gap-2 flex-wrap justify-center">
        {temas.map((tema, i) => (
          <FortalezaBlock
            key={tema.id}
            estado={tema.estado}
            progreso={tema.progreso}
            tema={tema.id}
            delay={i * 0.05}
          />
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500" /> Dominado</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-brand-500" /> Avanzando</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500" /> En riesgo</span>
      </div>
    </motion.div>
  );
}

// ============================================
// 6. TRANSITIONS & LOADING
// ============================================

function SkeletonPulse({ className }) {
  return (
    <motion.div
      className={`bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-xl ${className}`}
      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      style={{ backgroundSize: '200% 100%' }}
    />
  );
}

function QuizSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-6 w-full max-w-lg space-y-4">
      <div className="flex justify-between">
        <SkeletonPulse className="h-4 w-24" />
        <SkeletonPulse className="h-4 w-16" />
      </div>
      <SkeletonPulse className="h-6 w-full" />
      <SkeletonPulse className="h-6 w-3/4" />
      <div className="space-y-3 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonPulse key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );
}

// Card flip animation
function FlipCard({ front, back }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="perspective-1000 w-64 h-40 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={springPresets.gentle}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-violet-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-xl backface-hidden">
          {front}
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-xl"
          style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}

// Scroll reveal animation
function ScrollReveal({ children }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={springPresets.gentle}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// 7. INTERACTIVE ELEMENTS
// ============================================

// Toggle switch
function AnimatedToggle({ isOn, onToggle, label }) {
  return (
    <button onClick={onToggle} className="flex items-center gap-3">
      <motion.div
        className={`w-14 h-8 rounded-full p-1 cursor-pointer ${isOn ? 'bg-brand-600' : 'bg-gray-300'}`}
        animate={{ backgroundColor: isOn ? '#9333ea' : '#d1d5db' }}
      >
        <motion.div
          className="w-6 h-6 bg-white rounded-full shadow-md"
          animate={{ x: isOn ? 24 : 0 }}
          transition={springPresets.snappy}
        />
      </motion.div>
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
    </button>
  );
}

// Expandable card
function ExpandableCard({ title, children, icon: Icon = ChevronDown }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="bg-white rounded-2xl border shadow-sm overflow-hidden"
      layout
    >
      <motion.button
        className="w-full p-4 flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-semibold text-gray-900">{title}</span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={springPresets.snappy}
        >
          <Icon className="w-5 h-5 text-gray-500" />
        </motion.div>
      </motion.button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={springPresets.gentle}
          >
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Floating action button
function FloatingActionButton({ icon: Icon = Plus, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="w-14 h-14 rounded-full bg-gradient-to-r from-brand-600 to-violet-600 text-white shadow-xl shadow-brand-500/40 flex items-center justify-center"
      whileHover={{ scale: 1.1, y: -4 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={springPresets.bouncy}
    >
      <Icon className="w-6 h-6" />
    </motion.button>
  );
}

// Notification badge
function NotificationBadge({ count }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={springPresets.bouncy}
        >
          {count > 9 ? '9+' : count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

// ============================================
// 8. CARDS & LISTS
// ============================================

function StatCard({ icon: Icon, label, value, color = 'purple', trend }) {
  const colors = {
    purple: 'from-brand-500 to-violet-600',
    emerald: 'from-emerald-500 to-teal-600',
    amber: 'from-amber-500 to-orange-600',
    pink: 'from-pink-500 to-rose-600',
  };

  return (
    <motion.div
      className="bg-white rounded-2xl p-4 shadow-sm border"
      whileHover={{ y: -4, shadow: 'lg' }}
      transition={springPresets.snappy}
    >
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-sm text-gray-500">{label}</p>
      <div className="flex items-end gap-2">
        <motion.p
          className="text-2xl font-bold text-gray-900"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {value}
        </motion.p>
        {trend && (
          <motion.span
            className={`text-xs font-medium ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {trend > 0 ? '+' : ''}{trend}%
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}

function AnimatedList({ items }) {
  return (
    <motion.ul
      className="space-y-2"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {items.map((item, i) => (
        <motion.li
          key={i}
          variants={staggerItem}
          className="bg-white p-4 rounded-xl border flex items-center gap-3 cursor-pointer hover:border-brand-300 transition-colors"
          whileHover={{ x: 4 }}
        >
          <span className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm">
            {i + 1}
          </span>
          <span className="flex-1 font-medium text-gray-800">{item}</span>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </motion.li>
      ))}
    </motion.ul>
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
  const [showAchievement, setShowAchievement] = useState(false);
  const [toggleState, setToggleState] = useState(false);
  const [notifications, setNotifications] = useState(3);

  const demoQuestion = {
    text: "Según el artículo 66 de la Constitución, ¿quién representa al pueblo español?",
    options: ["El Rey", "Las Cortes Generales", "El Gobierno", "El Tribunal Constitucional"],
    correctIndex: 1,
  };

  const demoTemas = [
    { id: 1, estado: 'dominado', progreso: 100 },
    { id: 2, estado: 'dominado', progreso: 100 },
    { id: 3, estado: 'avanzando', progreso: 75 },
    { id: 4, estado: 'progreso', progreso: 45 },
    { id: 5, estado: 'riesgo', progreso: 20 },
    { id: 6, estado: 'nuevo', progreso: 0 },
    { id: 7, estado: 'nuevo', progreso: 0 },
    { id: 8, estado: 'nuevo', progreso: 0 },
  ];

  const sections = [
    { id: 'buttons', label: 'Botones', icon: '👆' },
    { id: 'quiz', label: 'Quiz', icon: '📝' },
    { id: 'progress', label: 'Progreso', icon: '📊' },
    { id: 'feedback', label: 'Feedback', icon: '✨' },
    { id: 'fortaleza', label: 'Fortaleza', icon: '🏰' },
    { id: 'interactive', label: 'Interactivos', icon: '🎛️' },
    { id: 'cards', label: 'Cards', icon: '🃏' },
  ];

  const incrementStreak = () => {
    setStreakAnimating(true);
    setStreak(s => s + 1);
    setTimeout(() => setStreakAnimating(false), 600);
  };

  const triggerCelebration = () => {
    setShowCelebration(true);
    setShowSuccess(true);
    setTimeout(() => { setShowCelebration(false); setShowSuccess(false); }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-gradient-to-br from-slate-50 via-brand-50/30 to-indigo-50/50 overflow-y-auto">
      {/* Header */}
      <motion.header
        className="sticky top-0 bg-white/90 backdrop-blur-lg border-b border-gray-100 z-50"
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
            className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-brand-100 to-pink-100 rounded-full"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span className="text-sm font-medium text-brand-700">framer-motion</span>
          </motion.div>
        </div>
      </motion.header>

      {/* Navigation */}
      <div className="sticky top-[73px] bg-white/90 backdrop-blur-lg border-b border-gray-100 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {sections.map((section) => (
              <motion.button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap text-sm
                  ${activeSection === section.id
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
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
      <main className="max-w-4xl mx-auto px-4 py-8 pb-32">
        <AnimatePresence mode="wait">
          {/* BUTTONS */}
          {activeSection === 'buttons' && (
            <motion.div key="buttons" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <Card title="Botones Premium" description="Scale + shadow con spring physics">
                <div className="flex gap-3 flex-wrap">
                  <PremiumButton variant="primary" icon={Zap}>Comenzar</PremiumButton>
                  <PremiumButton variant="secondary" icon={BookOpen}>Repasar</PremiumButton>
                  <PremiumButton variant="success" icon={Check}>Completado</PremiumButton>
                  <PremiumButton variant="amber" icon={Flame}>Racha</PremiumButton>
                </div>
              </Card>

              <Card title="Botón Magnético" description="Sigue el cursor sutilmente">
                <MagneticButton>Hover sobre mí ✨</MagneticButton>
              </Card>

              <Card title="Botón con Glow" description="Gradiente animado de fondo">
                <GlowButton>Efecto Glow</GlowButton>
              </Card>

              <Card title="Botón Ripple" description="Efecto onda al hacer click">
                <RippleButton>Click para ver ripple</RippleButton>
              </Card>

              <Card title="FAB (Floating Action Button)" description="Con entrada bouncy">
                <div className="flex gap-4">
                  <FloatingActionButton icon={Plus} />
                  <FloatingActionButton icon={BookOpen} />
                  <FloatingActionButton icon={Sparkles} />
                </div>
              </Card>
            </motion.div>
          )}

          {/* QUIZ */}
          {activeSection === 'quiz' && (
            <motion.div key="quiz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <Card title="Quiz Card Completo" description="Selección con feedback ámbar (no rojo)">
                <QuizCard question={demoQuestion} questionNumber={5} totalQuestions={10} />
              </Card>

              <Card title="Skeleton Loading" description="Mientras cargan las preguntas">
                <QuizSkeleton />
              </Card>

              <Card title="Flip Card" description="Click para voltear (flashcards)">
                <FlipCard front="¿Art. 66 CE?" back="Las Cortes Generales" />
              </Card>
            </motion.div>
          )}

          {/* PROGRESS */}
          {activeSection === 'progress' && (
            <motion.div key="progress" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <Card title="Barra de Progreso" description="Con shimmer animado">
                <div className="w-full max-w-md space-y-6">
                  <AnimatedProgressBar value={progress} color="purple" />
                  <AnimatedProgressBar value={progress * 0.7} color="emerald" />
                  <AnimatedProgressBar value={progress * 0.5} color="amber" />
                  <div className="flex gap-2 justify-center">
                    {[25, 50, 75, 100].map(p => (
                      <motion.button
                        key={p}
                        onClick={() => setProgress(p)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium
                          ${progress === p ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                        whileTap={{ scale: 0.95 }}
                      >
                        {p}%
                      </motion.button>
                    ))}
                  </div>
                </div>
              </Card>

              <Card title="Progreso Circular" description="Con icono central">
                <div className="flex gap-8 items-center">
                  <CircularProgress value={progress} size={100} showIcon />
                  <CircularProgress value={progress * 0.7} size={80} />
                  <CircularProgress value={progress * 0.5} size={60} />
                </div>
              </Card>

              <Card title="Contador Animado" description="Números que incrementan">
                <div className="text-center">
                  <AnimatedCounter value={1247} duration={1.5} />
                  <p className="text-gray-500 mt-1">preguntas respondidas</p>
                </div>
              </Card>
            </motion.div>
          )}

          {/* FEEDBACK */}
          {activeSection === 'feedback' && (
            <motion.div key="feedback" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6 relative">
              <CelebrationBurst show={showCelebration} />

              <Card title="Racha de Estudio" description="Animación al incrementar">
                <div className="flex items-center gap-4">
                  <StreakCounter count={streak} isAnimating={streakAnimating} />
                  <PremiumButton variant="ghost" onClick={incrementStreak}>+1 día</PremiumButton>
                </div>
              </Card>

              <Card title="Celebración" description="Confetti + checkmark">
                <div className="flex flex-col items-center gap-4 relative">
                  <SuccessCheckmark show={showSuccess} />
                  <PremiumButton onClick={triggerCelebration} icon={Sparkles}>Celebrar</PremiumButton>
                </div>
              </Card>

              <Card title="Achievement Unlock" description="Notificación de logro">
                <div className="space-y-4">
                  <AchievementUnlock
                    show={showAchievement}
                    title="Primera Racha"
                    description="7 días seguidos estudiando"
                    icon={Flame}
                  />
                  <PremiumButton
                    variant="amber"
                    onClick={() => setShowAchievement(!showAchievement)}
                    icon={Trophy}
                  >
                    {showAchievement ? 'Ocultar' : 'Mostrar'} Logro
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
                    className="p-4 rounded-xl bg-amber-50 border-2 border-amber-400 flex items-center gap-2 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ x: [0, -5, 5, -5, 5, 0] }}
                  >
                    <X className="w-5 h-5 text-amber-600" />
                    <span className="font-medium text-amber-700">Revisar (click)</span>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* FORTALEZA */}
          {activeSection === 'fortaleza' && (
            <motion.div key="fortaleza" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <Card title="Fortaleza Mejorada" description="Bloques con estados y animaciones">
                <FortalezaEnhanced temas={demoTemas} />
              </Card>

              <Card title="Bloques Individuales" description="Hover para interacción">
                <div className="flex gap-3 flex-wrap">
                  {['dominado', 'avanzando', 'progreso', 'riesgo', 'nuevo'].map((estado, i) => (
                    <div key={estado} className="text-center">
                      <FortalezaBlock estado={estado} progreso={estado === 'dominado' ? 100 : 50} delay={i * 0.1} />
                      <p className="text-xs text-gray-500 mt-2 capitalize">{estado}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* INTERACTIVE */}
          {activeSection === 'interactive' && (
            <motion.div key="interactive" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <Card title="Toggle Switch" description="Animación suave">
                <div className="space-y-4">
                  <AnimatedToggle isOn={toggleState} onToggle={() => setToggleState(!toggleState)} label="Notificaciones" />
                  <AnimatedToggle isOn={!toggleState} onToggle={() => setToggleState(!toggleState)} label="Modo oscuro" />
                </div>
              </Card>

              <Card title="Card Expandible" description="Con AnimatePresence">
                <div className="space-y-3 w-full max-w-md">
                  <ExpandableCard title="¿Cómo funciona la repetición espaciada?">
                    <p className="text-gray-600 text-sm">
                      La repetición espaciada es una técnica de aprendizaje que presenta la información
                      en intervalos crecientes, optimizando la retención a largo plazo.
                    </p>
                  </ExpandableCard>
                  <ExpandableCard title="¿Qué es el sistema FSRS?">
                    <p className="text-gray-600 text-sm">
                      FSRS (Free Spaced Repetition Scheduler) es un algoritmo moderno de repetición
                      espaciada que se adapta a tu ritmo de aprendizaje.
                    </p>
                  </ExpandableCard>
                </div>
              </Card>

              <Card title="Badge de Notificaciones" description="Contador con animación">
                <div className="flex gap-6">
                  <motion.div className="relative p-3 bg-gray-100 rounded-xl" whileTap={{ scale: 0.95 }}>
                    <Bell className="w-6 h-6 text-gray-600" />
                    <NotificationBadge count={notifications} />
                  </motion.div>
                  <div className="flex gap-2">
                    <PremiumButton variant="ghost" onClick={() => setNotifications(n => n + 1)}>+1</PremiumButton>
                    <PremiumButton variant="ghost" onClick={() => setNotifications(0)}>Clear</PremiumButton>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* CARDS */}
          {activeSection === 'cards' && (
            <motion.div key="cards" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <Card title="Stat Cards" description="Con hover lift">
                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                  <StatCard icon={Target} label="Precisión" value="87%" color="purple" trend={5} />
                  <StatCard icon={Flame} label="Racha" value="7 días" color="amber" trend={2} />
                  <StatCard icon={BookOpen} label="Estudiado" value="45 min" color="emerald" />
                  <StatCard icon={Trophy} label="Nivel" value="12" color="pink" trend={1} />
                </div>
              </Card>

              <Card title="Lista Animada" description="Entrada escalonada">
                <div className="w-full max-w-md">
                  <AnimatedList items={[
                    "Constitución Española",
                    "Derechos y Libertades",
                    "Organización Territorial",
                    "Procedimiento Administrativo",
                  ]} />
                </div>
              </Card>

              <Card title="Scroll Reveal" description="Aparece al hacer scroll">
                <div className="space-y-4 w-full">
                  {[1, 2, 3].map(i => (
                    <ScrollReveal key={i}>
                      <div className="p-4 bg-gradient-to-r from-brand-50 to-pink-50 rounded-xl border border-brand-100">
                        <p className="font-medium text-brand-800">Elemento {i} con scroll reveal</p>
                        <p className="text-sm text-brand-600">Aparece cuando entra en viewport</p>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              <Zap className="w-4 h-4 inline text-amber-500" /> {sections.length} categorías · 25+ animaciones
            </p>
            <PremiumButton variant="primary" onClick={onClose} icon={Check}>
              Cerrar Playground
            </PremiumButton>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Card component
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
      <div className="flex flex-col items-start gap-4">{children}</div>
    </motion.div>
  );
}
