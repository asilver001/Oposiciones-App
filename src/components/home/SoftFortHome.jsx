/**
 * SoftFortHome Component - Oposita Smart
 *
 * Main home page component with Soft+Fort aesthetic.
 * Features: welcome section, session CTA, FortalezaVisual, stats summary.
 * Philosophy: "Bienestar primero" - calming design without anxiety-inducing elements.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Zap, Sparkles, Settings,
  RefreshCw, AlertTriangle, BookOpen, Clock, Play
} from 'lucide-react';
import { TopBar } from '@layouts/MainLayout';
import FortalezaVisual, { statusConfig } from './FortalezaVisual';
import EmptyState from '../common/EmptyState';
import DevModeRandomizer, { userStates } from '../dev/DevModeRandomizer';
import { useAuth } from '../../contexts/AuthContext';
import { useUserStore } from '../../stores/useUserStore';

/**
 * Icon mapping for study plan activities
 */

/**
 * TodaySessionCard - Green editorial CTA with first activity
 */
function TodaySessionCard({ activities, onStartActivity }) {
  const activity = activities?.[0];
  if (!activity) return null;

  return (
    <motion.div
      className="relative overflow-hidden rounded-[24px] p-7 text-white"
      style={{ background: 'linear-gradient(145deg, #1B4332 0%, #2D6A4F 60%, #3A7D5C 100%)' }}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-[150px] h-[150px] rounded-full"
        style={{ background: 'rgba(255,255,255,0.04)' }} />
      <div className="absolute -bottom-6 -left-6 w-[90px] h-[90px] rounded-full"
        style={{ background: 'rgba(255,255,255,0.03)' }} />

      <div className="relative z-10">
        <p className="text-[13px] font-medium mb-1.5" style={{ opacity: 0.5 }}>
          Tu sesión de hoy
        </p>
        <h2 className="text-[22px] font-bold mb-1" style={{ letterSpacing: '-0.02em' }}>
          {activity.title}
        </h2>
        <p className="text-[15px] mb-5" style={{ opacity: 0.45 }}>
          {activity.description}
        </p>

        <div className="mb-[18px]" style={{ height: 1, background: 'rgba(255,255,255,0.08)' }} />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-[14px]" style={{ opacity: 0.4 }}>
            <span>{activity.estimatedMinutes || 10} min</span>
            <span>·</span>
            <span>{activity.questionCount || 8} preguntas</span>
          </div>
          <motion.button
            onClick={() => onStartActivity(activity)}
            className="w-[50px] h-[50px] rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.12)' }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-5 h-5 text-white fill-white" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * TodaySessionCardFallback - For when there's no study plan, uses nextTopic
 */
function TodaySessionCardFallback({ nextTopic, onStartSession }) {
  const fallbackActivity = {
    title: `T${nextTopic?.number || nextTopic?.id}. ${nextTopic?.name}`,
    description: '15 preguntas · Práctica de tema',
    estimatedMinutes: 10,
    questionCount: 15,
  };

  return (
    <motion.div
      className="relative overflow-hidden rounded-[24px] p-7 text-white"
      style={{ background: 'linear-gradient(145deg, #1B4332 0%, #2D6A4F 60%, #3A7D5C 100%)' }}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <div className="absolute -top-10 -right-10 w-[150px] h-[150px] rounded-full"
        style={{ background: 'rgba(255,255,255,0.04)' }} />
      <div className="absolute -bottom-6 -left-6 w-[90px] h-[90px] rounded-full"
        style={{ background: 'rgba(255,255,255,0.03)' }} />

      <div className="relative z-10">
        <p className="text-[13px] font-medium mb-1.5" style={{ opacity: 0.5 }}>
          Tu sesión de hoy
        </p>
        <h2 className="text-[22px] font-bold mb-1" style={{ letterSpacing: '-0.02em' }}>
          {fallbackActivity.title}
        </h2>
        <p className="text-[15px] mb-5" style={{ opacity: 0.45 }}>
          {fallbackActivity.description}
        </p>

        <div className="mb-[18px]" style={{ height: 1, background: 'rgba(255,255,255,0.08)' }} />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-[14px]" style={{ opacity: 0.4 }}>
            <span>{fallbackActivity.estimatedMinutes} min</span>
            <span>·</span>
            <span>{fallbackActivity.questionCount} preguntas</span>
          </div>
          <motion.button
            onClick={() => onStartSession(nextTopic)}
            className="w-[50px] h-[50px] rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.12)' }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-5 h-5 text-white fill-white" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Icon mapping for study plan activities
 */
const activityIcons = {
  'refresh-cw': RefreshCw,
  'alert-triangle': AlertTriangle,
  'book-open': BookOpen,
  'clock': Clock,
  'zap': Zap,
  'coffee': Clock,
};


/**
 * StatsRow - Two-column stats (questions + accuracy)
 */
function StatsRow({ totalQuestions, accuracyRate }) {
  return (
    <motion.div
      className="flex overflow-hidden rounded-[20px]"
      style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.15 }}
    >
      <div className="flex-1 py-6 px-5 text-center" style={{ borderRight: '1px solid #F3F3F0' }}>
        <p className="text-[32px] font-bold text-gray-900" style={{ letterSpacing: '-0.03em', lineHeight: 1 }}>
          {totalQuestions}
        </p>
        <p className="text-[12px] font-medium mt-[7px]" style={{ color: '#B5B5B0' }}>
          Preguntas
        </p>
      </div>
      <div className="flex-1 py-6 px-5 text-center">
        <p className="text-[32px] font-bold" style={{ color: '#2D6A4F', letterSpacing: '-0.03em', lineHeight: 1 }}>
          {accuracyRate}%
        </p>
        <p className="text-[12px] font-medium mt-[7px]" style={{ color: '#B5B5B0' }}>
          Precisión
        </p>
      </div>
    </motion.div>
  );
}


/**
 * WeeklyGoalCard - Editorial calm weekly progress
 */
const DAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

function WeeklyGoalCard({ weeklyData = [0, 0, 0, 0, 0, 0, 0], goal = 75 }) {
  const weeklyTotal = weeklyData.reduce((s, d) => s + d, 0);
  const percent = Math.min(Math.round((weeklyTotal / goal) * 100), 100);
  const todayIdx = (() => {
    const d = new Date().getDay();
    return d === 0 ? 6 : d - 1;
  })();

  return (
    <motion.div
      className="rounded-[20px] p-5"
      style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.25 }}
    >
      <div className="flex items-center justify-between mb-3.5">
        <span className="text-[16px] font-semibold text-gray-900">Meta semanal</span>
        <span className="text-[14px] font-medium" style={{ color: '#B5B5B0' }}>
          {weeklyTotal} / {goal}
        </span>
      </div>

      <div className="rounded-full overflow-hidden mb-4" style={{ height: 7, background: '#F3F3F0' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #2D6A4F, #52B788)' }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>

      <div className="flex justify-between px-0.5">
        {DAY_LABELS.map((d, i) => {
          const completed = weeklyData[i] > 0;
          const isToday = i === todayIdx;
          return (
            <div key={i} className="text-center">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center mb-1.5 mx-auto"
                style={{
                  background: completed ? '#2D6A4F' : '#F3F3F0'
                }}
              >
                {completed && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="white" strokeWidth="3" strokeLinecap="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                )}
              </div>
              <span className="text-[12px]" style={{
                color: isToday ? '#2D6A4F' : '#C8C8C8',
                fontWeight: isToday ? 600 : 400
              }}>{d}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}


/**
 * SoftFortHome - Main home page component
 *
 * @param {Object} props
 * @param {string} props.userName - User's display name
 * @param {Object} props.streakData - { current: number, longest: number }
 * @param {Object} props.totalStats - { testsCompleted: number, questionsCorrect: number, accuracyRate: number }
 * @param {Array} props.fortalezaData - Topic progress data for FortalezaVisual
 * @param {Function} props.onStartSession - Called when "Empezar" is clicked
 * @param {Function} props.onTopicSelect - Called when a topic is selected
 * @param {Function} props.onSettingsClick - Called when settings clicked
 * @param {Function} props.onProgressClick - Called when progress circle clicked
 * @param {Function} props.onStreakClick - Called when streak card clicked
 * @param {Function} props.onAccuracyClick - Called when accuracy card clicked
 * @param {Function} props.onLevelClick - Called when level card clicked
 * @param {Function} props.onViewAllTopics - Called when "Ver todo" clicked
 * @param {Function} props.onNavigate - Called for footer navigation
 */
export default function SoftFortHome({
  userName = 'Usuario',
  streakData = { current: 0, longest: 0 },
  totalStats = { testsCompleted: 0, questionsCorrect: 0, accuracyRate: 0, totalQuestions: 0 },
  weeklyImprovement = 0,
  weeklyData = [0, 0, 0, 0, 0, 0, 0],
  todayStats = { questionsAnswered: 0 },
  fortalezaData = [],
  studyPlan = null,
  onStartSession,
  onStartActivity,
  onTopicSelect,
  onSettingsClick,
  onProgressClick,
  onStreakClick,
  onAccuracyClick,
  onLevelClick,
  onViewAllTopics,
  onNavigate,
  showTopBar = true,
  showFooter = false
}) {
  const { isAdmin } = useAuth();
  const weeklyGoalQuestions = useUserStore((s) => s.userData.weeklyGoalQuestions) || 75;
  const [simulationMode, setSimulationMode] = useState(null);

  // Get simulated data when in simulation mode
  const getSimulatedData = () => {
    if (!simulationMode) return null;
    const state = userStates[simulationMode];
    if (state.generate) {
      return state.generate(); // For 'aleatorio' mode
    }
    return state;
  };

  const simulatedData = getSimulatedData();

  // Use simulated or real data
  const effectiveStats = simulatedData?.totalStats || totalStats;
  const effectiveStreak = simulatedData
    ? { current: simulatedData.totalStats.currentStreak, longest: simulatedData.totalStats.currentStreak + 5 }
    : streakData;

  // Check if user is completely new (no activity at all)
  const isNewUser = effectiveStats.testsCompleted === 0 &&
                    effectiveStats.questionsCorrect === 0 &&
                    effectiveStreak.current === 0 &&
                    fortalezaData.length === 0;

  // Calculate daily progress (simplified - can be enhanced)
  const dailyProgress = Math.min(100, effectiveStats.testsCompleted * 10);

  // Get next topic to study (prioritize riesgo, then progreso)
  const sortedTopics = [...fortalezaData].sort((a, b) => {
    const configA = statusConfig[a.status] || statusConfig.nuevo;
    const configB = statusConfig[b.status] || statusConfig.nuevo;
    if (configA.priority !== configB.priority) return configA.priority - configB.priority;
    return b.progress - a.progress;
  });

  const nextTopic = sortedTopics[0] || {
    id: 1,
    name: 'Constitucion Espanola',
    status: 'nuevo',
    progress: 0
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3 min-h-screen"
      style={{ background: '#FAFAF7' }}
    >
      {/* TopBar - optional, can be disabled when using parent's TopBar */}
      {showTopBar && (
        <TopBar
          dailyProgress={dailyProgress}
          dailyGoal={100}
          userName={userName}
          onSettingsClick={onSettingsClick}
          onProgressClick={onProgressClick}
        />
      )}

      <div className="px-6 space-y-3">
        {/* Greeting */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[13px] font-medium" style={{ color: '#B0B0B0', letterSpacing: '0.04em' }}>
              {new Date().toLocaleDateString('es-ES', { weekday: 'long' })}
            </p>
            <h2 className="text-[32px] font-bold text-gray-900" style={{ letterSpacing: '-0.03em', marginTop: 2 }}>
              Hola, {userName.split(' ')[0]}
            </h2>
          </div>
          <button onClick={onSettingsClick}
            className="w-[42px] h-[42px] rounded-full flex items-center justify-center"
            style={{ background: '#F0F0EE' }}>
            <Settings className="w-5 h-5" style={{ color: '#999' }} />
          </button>
        </div>

        {/* Empty State for New Users */}
        {isNewUser && (
          <EmptyState
            icon={Sparkles}
            title="¡Bienvenido! Comienza tu preparación"
            description="Da el primer paso en tu camino hacia la oposición. Empieza con un test rápido para evaluar tu nivel actual."
            actionLabel="Hacer primer test"
            onAction={onStartSession}
            variant="purple"
          />
        )}

        {/* Session Card — AI-recommended or fallback */}
        {!isNewUser && studyPlan?.activities && (
          <TodaySessionCard
            activities={studyPlan.activities}
            onStartActivity={onStartActivity || ((a) => onStartSession(a.config?.topic))}
          />
        )}

        {!isNewUser && !studyPlan?.activities && (
          <TodaySessionCardFallback
            nextTopic={nextTopic}
            onStartSession={onStartSession}
          />
        )}

        {/* Stats + Weekly + Fortaleza — stacked, no grid */}
        {!isNewUser && (
          <>
            <StatsRow
              totalQuestions={effectiveStats.totalQuestions || 0}
              accuracyRate={effectiveStats.accuracyRate || 0}
            />

            <WeeklyGoalCard
              weeklyData={weeklyData}
              goal={weeklyGoalQuestions}
            />

            <FortalezaVisual
              topics={fortalezaData}
              onTopicSelect={onTopicSelect}
              onViewAll={onViewAllTopics}
              maxVisible={3}
            />
          </>
        )}
      </div>

      {/* DevMode Randomizer - development or admin */}
      {(import.meta.env.DEV || isAdmin) && (
        <DevModeRandomizer
          activeMode={simulationMode}
          onSelectMode={setSimulationMode}
          onClear={() => setSimulationMode(null)}
          pageContext="home"
        />
      )}

    </motion.div>
  );
}
