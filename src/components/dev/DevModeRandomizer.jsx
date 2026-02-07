import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dices, User, Activity, Crown, Shuffle, UserCheck } from 'lucide-react';

/**
 * DevModeRandomizer - Shared component for simulating different user states
 *
 * Used for development/testing to preview how the UI looks with different
 * amounts of user data (new user, active user, veteran, random).
 */

// Data generation functions
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
      tema: ['Constitucion', 'La Corona', 'Derechos', 'Gobierno'][Math.floor(Math.random() * 4)],
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

// LocalStorage key for persisting selected mode
const STORAGE_KEY = 'dev-simulation-mode';

/**
 * Get the persisted simulation mode from localStorage
 */
export function getPersistedMode() {
  try {
    return localStorage.getItem(STORAGE_KEY) || null;
  } catch {
    return null;
  }
}

/**
 * Persist the simulation mode to localStorage
 */
function persistMode(mode) {
  try {
    if (mode) {
      localStorage.setItem(STORAGE_KEY, mode);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

// User state configurations for simulation
export const userStates = {
  real: {
    label: 'Mi datos reales',
    emoji: '\u{1F464}',
    icon: UserCheck,
    isReal: true // Flag: use actual Supabase data, no mock
  },
  nuevo: {
    label: 'Usuario Nuevo',
    emoji: '\u{1F464}',
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
    emoji: '\u{1F4CA}',
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
    emoji: '\u{1F3C6}',
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
    emoji: '\u{1F3B2}',
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

// Context-specific descriptions for each page
const pageContexts = {
  home: {
    real: 'Tu progreso real desde Supabase',
    nuevo: 'Sin tests, sin racha, fortaleza vacía',
    activo: '15 tests, 68% aciertos, racha de 5 días',
    veterano: '89 tests, 82% aciertos, racha de 23 días',
    aleatorio: 'Estadísticas aleatorias'
  },
  actividad: {
    real: 'Tu actividad real desde Supabase',
    nuevo: 'Historial vacío, gráficas en cero',
    activo: '5 sesiones recientes, progreso visible',
    veterano: 'Historial completo, calendario lleno',
    aleatorio: 'Datos aleatorios de actividad'
  },
  temas: {
    real: 'Tu progreso real por tema',
    nuevo: 'Todos los temas sin empezar',
    activo: 'Algunos temas en progreso',
    veterano: 'Mayoría de temas dominados',
    aleatorio: 'Progreso aleatorio por tema'
  },
  recursos: {
    real: 'Tus recursos reales',
    nuevo: 'Sin favoritos guardados',
    activo: 'Algunos recursos marcados',
    veterano: 'Colección de recursos favoritos',
    aleatorio: 'Favoritos aleatorios'
  }
};

/**
 * DevModeRandomizer - Floating button with dropdown for simulating user states
 *
 * @param {string} activeMode - Currently selected simulation mode ('nuevo', 'activo', 'veterano', 'aleatorio', or null)
 * @param {function} onSelectMode - Callback when a mode is selected
 * @param {function} onClear - Callback when returning to real data
 * @param {string} pageContext - Current page context ('home', 'actividad', 'temas', 'recursos')
 */
export default function DevModeRandomizer({ activeMode, onSelectMode, onClear, pageContext = 'home' }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // On mount, restore persisted mode
  useEffect(() => {
    const persisted = getPersistedMode();
    if (persisted && persisted !== activeMode) {
      onSelectMode(persisted);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = useCallback((mode) => {
    persistMode(mode === 'real' ? null : mode);
    if (mode === 'real') {
      onClear();
    } else {
      onSelectMode(mode);
    }
    setIsOpen(false);
  }, [onSelectMode, onClear]);

  const handleClear = useCallback(() => {
    persistMode(null);
    onClear();
    setIsOpen(false);
  }, [onClear]);

  const modes = ['real', 'nuevo', 'activo', 'veterano', 'aleatorio'];

  return (
    <div ref={menuRef} className="fixed bottom-24 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-16 right-0 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden min-w-[220px]"
          >
            <div className="p-2 border-b bg-gray-50">
              <p className="text-xs font-semibold text-gray-600 px-2">Simular Usuario</p>
            </div>
            <div className="p-1">
              {modes.map((mode) => {
                const state = userStates[mode];
                const Icon = state.icon;
                const isActive = mode === 'real' ? !activeMode : activeMode === mode;
                const contextDesc = pageContexts[pageContext]?.[mode] || '';
                return (
                  <button
                    key={mode}
                    onClick={() => handleSelect(mode)}
                    className={`w-full flex flex-col items-start px-3 py-2 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-brand-100 text-brand-700'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{state.emoji} {state.label}</span>
                    </div>
                    {contextDesc && (
                      <span className="text-[10px] text-gray-500 mt-0.5 ml-6">{contextDesc}</span>
                    )}
                  </button>
                );
              })}
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
            ? 'bg-brand-600 text-white'
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
