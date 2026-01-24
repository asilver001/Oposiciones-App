import React, { useMemo, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Target,
  CheckCircle,
  Calendar,
  Flame,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  BarChart3,
  Sparkles,
  Play,
  Dices,
  User,
  Activity,
  Crown,
  Shuffle,
  X,
  Zap,
  AlertTriangle,
  BookMarked,
  Eye,
  Check
} from 'lucide-react';
import EmptyState from '../common/EmptyState';

/**
 * ActividadPage - Activity page with swipeable tabs
 *
 * Two tabs:
 * 1. Modos (left) - Study mode selection
 * 2. Progreso (right) - Statistics and history
 */

// Simulated user states for dev mode
const generateSessionHistory = (count, baseAccuracy) => {
  const sessions = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(i * 1.5);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    const accuracy = Math.max(30, Math.min(100, baseAccuracy + (Math.random() * 20 - 10)));
    const total = Math.floor(Math.random() * 15) + 5;
    const correct = Math.round(total * (accuracy / 100));
    sessions.push({
      id: `sim-${i}`,
      created_at: date.toISOString(),
      tema_id: Math.random() > 0.3 ? Math.floor(Math.random() * 10) + 1 : null,
      tema: ['Constitución', 'La Corona', 'Derechos', 'Gobierno'][Math.floor(Math.random() * 4)],
      correctas: correct,
      total_preguntas: total,
      porcentaje_acierto: Math.round(accuracy)
    });
  }
  return sessions;
};

const generateCalendarData = (daysCount) => {
  const days = [];
  const now = new Date();
  const currentDay = now.getDate();
  for (let i = 0; i < daysCount && i < currentDay; i++) {
    const day = currentDay - Math.floor(Math.random() * currentDay);
    if (!days.includes(day)) {
      days.push(day);
    }
  }
  return days.sort((a, b) => a - b);
};

const userStates = {
  nuevo: {
    label: 'Usuario Nuevo',
    emoji: '👤',
    icon: User,
    totalStats: {
      testsCompleted: 0,
      questionsCorrect: 0,
      accuracyRate: 0,
      totalMinutes: 0,
      currentStreak: 0,
      daysStudied: 0
    },
    weeklyData: [0, 0, 0, 0, 0, 0, 0],
    sessionHistory: [],
    calendarData: []
  },
  activo: {
    label: 'Usuario Activo',
    emoji: '📊',
    icon: Activity,
    totalStats: {
      testsCompleted: 15,
      questionsCorrect: 87,
      accuracyRate: 68,
      totalMinutes: 145,
      currentStreak: 5,
      daysStudied: 12
    },
    weeklyData: [3, 5, 2, 4, 6, 0, 2],
    sessionHistory: generateSessionHistory(5, 68),
    calendarData: generateCalendarData(12)
  },
  veterano: {
    label: 'Usuario Veterano',
    emoji: '🏆',
    icon: Crown,
    totalStats: {
      testsCompleted: 89,
      questionsCorrect: 534,
      accuracyRate: 82,
      totalMinutes: 890,
      currentStreak: 23,
      daysStudied: 45
    },
    weeklyData: [8, 12, 10, 15, 9, 6, 11],
    sessionHistory: generateSessionHistory(15, 82),
    calendarData: generateCalendarData(20)
  },
  aleatorio: {
    label: 'Aleatorio',
    emoji: '🎲',
    icon: Shuffle,
    generate: () => {
      const testsCompleted = Math.floor(Math.random() * 100);
      const accuracyRate = Math.floor(Math.random() * 60) + 40;
      const questionsCorrect = Math.floor(testsCompleted * 8 * (accuracyRate / 100));
      const currentStreak = Math.floor(Math.random() * 30);
      const daysStudied = Math.floor(Math.random() * 60) + 1;
      return {
        totalStats: {
          testsCompleted,
          questionsCorrect,
          accuracyRate,
          totalMinutes: testsCompleted * 10,
          currentStreak,
          daysStudied
        },
        weeklyData: Array(7).fill(0).map(() => Math.floor(Math.random() * 20)),
        sessionHistory: generateSessionHistory(Math.floor(Math.random() * 15) + 1, accuracyRate),
        calendarData: generateCalendarData(daysStudied)
      };
    }
  }
};

// Study modes configuration
const studyModes = [
  { id: 'test-rapido', icon: Zap, title: 'Test Rápido', desc: '5-10 preguntas', time: '~5 min', gradient: 'from-purple-500 to-violet-600', status: 'disponible' },
  { id: 'practica-tema', icon: Target, title: 'Por Tema', desc: 'Elige tema', time: '~15 min', gradient: 'from-blue-500 to-cyan-600', status: 'disponible' },
  { id: 'repaso-errores', icon: AlertTriangle, title: 'Errores', desc: 'Pendientes', time: 'Variable', gradient: 'from-amber-500 to-orange-600', status: 'disponible', badge: '12' },
  { id: 'flashcards', icon: BookMarked, title: 'Flashcards', desc: 'Memorización', time: '~10 min', gradient: 'from-emerald-500 to-teal-600', status: 'disponible' },
  { id: 'simulacro', icon: Clock, title: 'Simulacro', desc: '100 preguntas', time: '60 min', gradient: 'from-rose-500 to-pink-600', status: 'proximamente' },
  { id: 'lectura', icon: Eye, title: 'Solo Lectura', desc: 'Sin contestar', time: 'Libre', gradient: 'from-gray-500 to-slate-600', status: 'premium' },
];

/**
 * DevModeRandomizer - Floating button with dropdown for simulating user states
 */
function DevModeRandomizer({ activeMode, onSelectMode, onClear }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const modes = ['nuevo', 'activo', 'veterano', 'aleatorio'];

  return (
    <div ref={menuRef} className="fixed bottom-24 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-16 right-0 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden min-w-[180px]"
          >
            <div className="p-2 border-b bg-gray-50">
              <p className="text-xs font-semibold text-gray-600 px-2">Simular Usuario</p>
            </div>
            <div className="p-1">
              {modes.map((mode) => {
                const state = userStates[mode];
                const Icon = state.icon;
                const isActive = activeMode === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => {
                      onSelectMode(mode);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-purple-100 text-purple-700'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{state.emoji} {state.label}</span>
                  </button>
                );
              })}
              {activeMode && (
                <>
                  <div className="border-t my-1" />
                  <button
                    onClick={() => {
                      onClear();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors hover:bg-red-50 text-red-600"
                  >
                    <X className="w-4 h-4" />
                    <span className="text-sm font-medium">Datos reales</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={activeMode ? { rotate: [0, 10, -10, 0] } : {}}
        transition={{ duration: 0.5, repeat: activeMode ? Infinity : 0, repeatDelay: 3 }}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors ${
          activeMode
            ? 'bg-purple-600 text-white'
            : 'bg-white text-gray-700 border border-gray-200'
        }`}
      >
        <Dices className="w-6 h-6" />
      </motion.button>

      {activeMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2 -left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md"
        >
          {userStates[activeMode].emoji}
        </motion.div>
      )}
    </div>
  );
}

/**
 * StudyModesTab - Study mode selection view
 */
function StudyModesTab({ onSelectMode, selectedMode, onStartSession, onSwipeRight }) {
  return (
    <motion.div
      key="modos"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-3"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(e, { offset, velocity }) => {
        if (offset.x < -100 || velocity.x < -500) onSwipeRight();
      }}
    >
      <h4 className="text-sm font-semibold text-gray-700 mb-2">¿Cómo quieres estudiar hoy?</h4>

      {studyModes.map((mode) => {
        const Icon = mode.icon;
        const isSelected = selectedMode === mode.id;
        const isDisabled = mode.status !== 'disponible';

        return (
          <motion.button
            key={mode.id}
            onClick={() => !isDisabled && onSelectMode(isSelected ? null : mode.id)}
            className={`w-full text-left ${isDisabled ? 'opacity-50' : ''}`}
            whileTap={!isDisabled ? { scale: 0.98 } : {}}
            disabled={isDisabled}
          >
            <div className={`bg-white rounded-xl p-3 border-2 transition-all ${
              isSelected ? 'border-purple-400 shadow-md' : 'border-gray-100'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${mode.gradient} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h5 className="font-semibold text-gray-900 text-sm">{mode.title}</h5>
                    {mode.badge && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">{mode.badge}</span>
                    )}
                    {mode.status === 'proximamente' && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">Próximo</span>
                    )}
                    {mode.status === 'premium' && (
                      <span className="text-xs bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full">★</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{mode.desc} · {mode.time}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                }`}>
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
            </div>
          </motion.button>
        );
      })}

      <AnimatePresence>
        {selectedMode && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={onStartSession}
            className="w-full mt-4 bg-purple-600 text-white py-3 rounded-xl font-semibold"
          >
            Comenzar →
          </motion.button>
        )}
      </AnimatePresence>

      <p className="text-center text-xs text-gray-400 py-2">
        ← Desliza para ver tu progreso
      </p>
    </motion.div>
  );
}

/**
 * ProgressTab - Statistics and history view
 */
function ProgressTab({ data, onSwipeLeft, onStartTest, formatRelativeDate }) {
  const formatDate = formatRelativeDate || ((date) => {
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  });

  const hasData = data.testsCompleted > 0;

  if (!hasData) {
    return (
      <motion.div
        key="progreso-empty"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="space-y-4"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={(e, { offset, velocity }) => {
          if (offset.x > 100 || velocity.x > 500) onSwipeLeft();
        }}
      >
        <EmptyState
          icon={BarChart3}
          title="Sin actividad todavía"
          description="Completa tu primer test para ver tu progreso y estadísticas de estudio."
          actionLabel="Empezar a estudiar"
          onAction={onStartTest}
          variant="purple"
        />
        <p className="text-center text-xs text-gray-400 py-2">
          Desliza para ver modos de estudio →
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="progreso"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-4"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(e, { offset, velocity }) => {
        if (offset.x > 100 || velocity.x > 500) onSwipeLeft();
      }}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-5 h-5 text-purple-500" />
            <span className="text-xs text-gray-500">Tests</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.testsCompleted}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-5 h-5 text-green-500" />
            <span className="text-xs text-gray-500">Acierto</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.accuracyRate}%</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-xs text-gray-500">Racha</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.currentStreak} días</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span className="text-xs text-gray-500">Días</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.daysStudied}</p>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h4 className="font-semibold text-gray-900 mb-3">Esta semana</h4>
        <div className="flex items-end justify-between h-24 gap-1">
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => {
            const value = data.weeklyData[i] || 0;
            const maxVal = Math.max(...data.weeklyData, 1);
            const height = (value / maxVal) * 100;
            const isToday = new Date().getDay() === (i === 6 ? 0 : i + 1);
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-gray-100 rounded-t-lg flex-1 relative" style={{ minHeight: 60 }}>
                  <motion.div
                    className={`absolute bottom-0 w-full rounded-t-lg ${isToday ? 'bg-orange-400' : 'bg-purple-400'}`}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(height, value > 0 ? 10 : 0)}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                  />
                </div>
                <span className={`text-xs ${isToday ? 'text-orange-600 font-bold' : 'text-gray-400'}`}>{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Session History */}
      {data.sessionHistory && data.sessionHistory.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-3">Últimas sesiones</h4>
          <div className="space-y-2">
            {data.sessionHistory.slice(0, 5).map((session, idx) => {
              const temaName = session.tema || (session.tema_id ? `Tema ${session.tema_id}` : 'Mixto');
              const correct = session.correctas || 0;
              const total = session.total_preguntas || 0;
              const accuracy = session.porcentaje_acierto || 0;

              return (
                <div key={session.id || idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    📚
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{temaName}</p>
                    <p className="text-xs text-gray-500">{correct}/{total} · {formatDate(session.created_at)}</p>
                  </div>
                  <span className={`text-sm font-bold ${accuracy >= 70 ? 'text-green-600' : 'text-orange-600'}`}>
                    {accuracy}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p className="text-center text-xs text-gray-400 py-2">
        Desliza para ver modos de estudio →
      </p>
    </motion.div>
  );
}

/**
 * Main ActividadPage component
 */
export default function ActividadPage({
  weeklyData = [0, 0, 0, 0, 0, 0, 0],
  sessionHistory = [],
  totalStats = {
    testsCompleted: 0,
    questionsCorrect: 0,
    accuracyRate: 0,
    totalMinutes: 0,
    currentStreak: 0,
    daysStudied: 0
  },
  calendarData = [],
  motivationalMessage = null,
  loading = false,
  onStartTest,
  formatRelativeDate,
  devMode = false
}) {
  // Tab state: 0 = Modos (left), 1 = Progreso (right)
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMode, setSelectedMode] = useState(null);

  // Dev mode state for simulation
  const [simulationMode, setSimulationMode] = useState(null);
  const [simulatedData, setSimulatedData] = useState(null);

  // Tab configuration - Modos first (left), Progreso second (right)
  const tabs = [
    { id: 0, icon: Target, label: 'Modos' },
    { id: 1, icon: BarChart3, label: 'Progreso' }
  ];

  // Handle mode selection
  const handleSelectMode = (mode) => {
    setSimulationMode(mode);
    const state = userStates[mode];
    if (mode === 'aleatorio') {
      setSimulatedData(state.generate());
    } else {
      setSimulatedData({
        totalStats: state.totalStats,
        weeklyData: state.weeklyData,
        sessionHistory: state.sessionHistory,
        calendarData: state.calendarData
      });
    }
  };

  const handleClear = () => {
    setSimulationMode(null);
    setSimulatedData(null);
  };

  // Determine which data to use
  const displayData = simulatedData || {
    totalStats,
    weeklyData,
    sessionHistory,
    calendarData
  };

  // Flatten data for ProgressTab
  const progressData = {
    testsCompleted: displayData.totalStats.testsCompleted,
    accuracyRate: displayData.totalStats.accuracyRate,
    currentStreak: displayData.totalStats.currentStreak,
    daysStudied: displayData.totalStats.daysStudied || displayData.totalStats.totalDaysStudied || 0,
    weeklyData: displayData.weeklyData,
    sessionHistory: displayData.sessionHistory
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Actividad</h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Actividad</h2>
          {simulationMode && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-sm font-medium"
            >
              <Dices className="w-4 h-4" />
              <span>{userStates[simulationMode].emoji}</span>
            </motion.div>
          )}
        </div>

        {/* Tab Headers */}
        <div className="bg-white rounded-xl p-1.5 shadow-sm border border-gray-100">
          <div className="flex gap-1 relative">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                    isActive
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
          {/* Animated indicator */}
          <motion.div
            className="h-0.5 bg-purple-500 rounded-full mt-1.5"
            animate={{ x: activeTab === 0 ? '0%' : '100%', width: '50%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>

        {/* Swipeable content */}
        <AnimatePresence mode="wait">
          {activeTab === 0 ? (
            <StudyModesTab
              selectedMode={selectedMode}
              onSelectMode={setSelectedMode}
              onStartSession={onStartTest}
              onSwipeRight={() => setActiveTab(1)}
            />
          ) : (
            <ProgressTab
              data={progressData}
              onSwipeLeft={() => setActiveTab(0)}
              onStartTest={() => setActiveTab(0)}
              formatRelativeDate={formatRelativeDate}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Dev Mode Randomizer Button */}
      {devMode && (
        <DevModeRandomizer
          activeMode={simulationMode}
          onSelectMode={handleSelectMode}
          onClear={handleClear}
        />
      )}
    </>
  );
}
