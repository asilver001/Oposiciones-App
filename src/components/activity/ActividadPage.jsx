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
  X
} from 'lucide-react';

/**
 * ActividadPage - Activity and statistics page
 *
 * Props:
 * - weeklyData: array of daily activity data
 * - sessionHistory: array of past sessions
 * - totalStats: object with overall statistics
 * - motivationalMessage: object with motivational content
 * - calendarData: array of days practiced this month
 * - onStartTest: function to start a new test
 * - devMode: boolean to show the randomizer button
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

/**
 * DevModeRandomizer - Floating button with dropdown for simulating user states
 */
function DevModeRandomizer({ activeMode, onSelectMode, onClear }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
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
                    <span className="text-sm font-medium">Mostrar datos reales</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main floating button */}
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

      {/* Active mode badge */}
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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
};

/**
 * StatCard - Individual statistic card
 */
function StatCard({ icon: Icon, iconColor, label, value, bgColor = 'bg-white' }) {
  return (
    <motion.div
      variants={itemVariants}
      className={`${bgColor} rounded-2xl p-5 shadow-lg`}
    >
      <div className="flex items-center gap-3 mb-2">
        <Icon className={`w-6 h-6 ${iconColor}`} />
        <span className="text-gray-600 text-sm font-medium">{label}</span>
      </div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
    </motion.div>
  );
}

/**
 * WeeklyChart - Bar chart for weekly activity
 */
function WeeklyChart({ weeklyData }) {
  const maxValue = Math.max(...weeklyData.map(d => d.questions || 0), 1);
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1;

  // Handle both array formats
  const normalizedData = days.map((day, i) => {
    if (weeklyData[i] && typeof weeklyData[i] === 'object') {
      return weeklyData[i];
    }
    return { day, questions: weeklyData[i] || 0, correct: 0 };
  });

  const hasData = normalizedData.some(d => d.questions > 0);

  if (!hasData) {
    return (
      <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="font-bold text-gray-900 mb-4">Progreso semanal</h3>
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500 text-sm">Completa tu primer test para ver tu progreso</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="font-bold text-gray-900 mb-4">Progreso semanal</h3>
      <div className="flex items-end justify-between h-32 gap-2">
        {normalizedData.map((data, i) => {
          const value = data.questions || 0;
          const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
          const isToday = i === todayIndex;

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-gray-100 rounded-t-lg flex-1 relative min-h-[80px]">
                <motion.div
                  className={`absolute bottom-0 w-full rounded-t-lg ${
                    isToday
                      ? 'bg-gradient-to-t from-orange-500 to-orange-400'
                      : 'bg-gradient-to-t from-purple-500 to-purple-400'
                  }`}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(height, value > 0 ? 8 : 0)}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                />
                {value > 0 && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-600">
                    {value}
                  </div>
                )}
              </div>
              <span className={`text-xs font-medium ${isToday ? 'text-orange-600' : 'text-gray-500'}`}>
                {days[i]}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

/**
 * MonthlyCalendar - Calendar heatmap for the current month
 */
function MonthlyCalendar({ calendarData = [] }) {
  const calendar = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Get the day of week for the first day (0 = Sunday, adjust to Monday = 0)
    let startDay = firstDay.getDay() - 1;
    if (startDay === -1) startDay = 6;

    const result = [];
    // Add empty cells for days before the first of the month
    for (let i = 0; i < startDay; i++) {
      result.push({ day: null, practiced: false });
    }
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      result.push({
        day,
        practiced: calendarData.includes(day),
        isToday: day === now.getDate()
      });
    }
    return result;
  }, [calendarData]);

  const monthName = new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  return (
    <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="font-bold text-gray-900 mb-4 capitalize">{monthName}</h3>
      <div className="grid grid-cols-7 gap-1">
        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-400 py-1">
            {day}
          </div>
        ))}
        {calendar.map((cell, idx) => (
          <div
            key={idx}
            className={`aspect-square flex items-center justify-center rounded-lg text-xs relative ${
              cell.day === null
                ? ''
                : cell.isToday
                ? 'bg-purple-100 font-bold text-purple-700'
                : cell.practiced
                ? 'bg-gray-50 text-gray-700'
                : 'text-gray-400'
            }`}
          >
            {cell.day}
            {cell.practiced && (
              <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-green-500 rounded-full" />
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-4 pt-3 border-t text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span>Dia practicado</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-purple-100 rounded" />
          <span>Hoy</span>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * SessionHistory - List of recent sessions
 */
function SessionHistory({ sessions = [], formatRelativeDate }) {
  // Default date formatter if not provided
  const formatDate = formatRelativeDate || ((date) => {
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} dias`;
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  });

  // Determine trend compared to previous session
  const getTrend = (session, index) => {
    if (index >= sessions.length - 1) return 'neutral';
    const prevSession = sessions[index + 1];
    if (!prevSession) return 'neutral';

    const currentRate = session.porcentaje_acierto || session.accuracy || 0;
    const prevRate = prevSession.porcentaje_acierto || prevSession.accuracy || 0;

    if (currentRate > prevRate + 5) return 'up';
    if (currentRate < prevRate - 5) return 'down';
    return 'neutral';
  };

  if (sessions.length === 0) {
    return (
      <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="font-bold text-gray-900 mb-4">Ultimas sesiones</h3>
        <div className="text-center py-6">
          <Clock className="w-12 h-12 mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500 text-sm">Aun no has completado ningun test</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="font-bold text-gray-900 mb-4">Ultimas sesiones</h3>
      <div className="space-y-3">
        {sessions.slice(0, 7).map((session, idx) => {
          const trend = getTrend(session, idx);
          const temaName = session.tema_id ? `Tema ${session.tema_id}` : (session.topics || 'Mixto');
          const correct = session.correctas || session.correctAnswers || 0;
          const total = session.total_preguntas || session.questionsAnswered || 0;
          const accuracy = session.porcentaje_acierto || session.accuracy || 0;

          return (
            <motion.div
              key={session.id || idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-lg">
                {session.tema_id ? '📚' : '🎯'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 truncate">{temaName}</span>
                  <span className="text-xs text-gray-400">
                    {formatDate(session.created_at || session.date)}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {correct}/{total} correctas
                  <span className="mx-1">·</span>
                  <span className={
                    accuracy >= 70 ? 'text-green-600' :
                    accuracy >= 50 ? 'text-orange-600' : 'text-red-500'
                  }>
                    {accuracy}%
                  </span>
                </div>
              </div>
              <div className={`p-1 rounded-full ${
                trend === 'up' ? 'bg-green-100' :
                trend === 'down' ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                {trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : trend === 'down' ? (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                ) : (
                  <Minus className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

/**
 * MotivationalBanner - Displays motivational message
 */
function MotivationalBanner({ message }) {
  if (!message) return null;

  return (
    <motion.div
      variants={itemVariants}
      className={`rounded-2xl p-4 ${message.bg || 'bg-purple-50'} border border-opacity-50`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{message.emoji || '✨'}</span>
        <p className={`font-medium ${message.color || 'text-purple-700'}`}>
          {message.message}
        </p>
      </div>
    </motion.div>
  );
}

/**
 * EmptyState - Shown when no activity exists
 */
function EmptyState({ onStartTest }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-8 shadow-lg text-center"
    >
      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <BarChart3 className="w-8 h-8 text-purple-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Aun no hay actividad</h3>
      <p className="text-gray-600 mb-6">Completa tu primer test para ver tu progreso aqui</p>
      {onStartTest && (
        <button
          onClick={onStartTest}
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700
            text-white font-semibold py-3 px-6 rounded-xl transition-all
            active:scale-[0.98] shadow-lg shadow-purple-600/30"
        >
          <Play className="w-5 h-5" />
          Hacer mi primer test
        </button>
      )}
    </motion.div>
  );
}

/**
 * LoadingState - Skeleton loading
 */
function LoadingState() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Tu actividad</h2>
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    </div>
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
  // Dev mode state for simulation
  const [simulationMode, setSimulationMode] = useState(null);
  const [simulatedData, setSimulatedData] = useState(null);

  // Handle mode selection
  const handleSelectMode = (mode) => {
    setSimulationMode(mode);
    const state = userStates[mode];
    if (mode === 'aleatorio') {
      // Generate new random data each time
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

  // Clear simulation
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

  if (loading) {
    return <LoadingState />;
  }

  const hasActivity = displayData.totalStats.testsCompleted > 0;

  return (
    <>
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header with simulation badge */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Tu actividad</h2>
          {simulationMode && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-sm font-medium"
            >
              <Dices className="w-4 h-4" />
              <span>Simulado: {userStates[simulationMode].emoji}</span>
            </motion.div>
          )}
        </div>

        {!hasActivity ? (
          <EmptyState onStartTest={onStartTest} />
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                icon={Trophy}
                iconColor="text-purple-600"
                label="Tests completados"
                value={displayData.totalStats.testsCompleted}
              />
              <StatCard
                icon={Target}
                iconColor="text-green-600"
                label="Tasa de acierto"
                value={`${displayData.totalStats.accuracyRate}%`}
              />
              <StatCard
                icon={CheckCircle}
                iconColor="text-blue-600"
                label="Preguntas correctas"
                value={displayData.totalStats.questionsCorrect}
              />
              <StatCard
                icon={Calendar}
                iconColor="text-orange-600"
                label="Dias estudiando"
                value={displayData.totalStats.daysStudied || displayData.totalStats.totalDaysStudied || 0}
              />
            </div>

            {/* Current Streak - if exists */}
            {displayData.totalStats.currentStreak > 0 && (
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-4 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-white">
                    <p className="text-sm opacity-90">Racha actual</p>
                    <p className="text-2xl font-bold">{displayData.totalStats.currentStreak} dias consecutivos</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Weekly Progress Chart */}
            <WeeklyChart weeklyData={displayData.weeklyData} />

            {/* Monthly Calendar */}
            <MonthlyCalendar calendarData={displayData.calendarData} />

            {/* Session History */}
            <SessionHistory
              sessions={displayData.sessionHistory}
              formatRelativeDate={formatRelativeDate}
            />

            {/* Motivational Message */}
            {motivationalMessage && (
              <MotivationalBanner message={motivationalMessage} />
            )}
          </>
        )}
      </motion.div>

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
