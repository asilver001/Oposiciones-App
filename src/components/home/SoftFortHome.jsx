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
  Zap, Flame, Target, Trophy, ChevronRight,
  Info, HelpCircle, Instagram, Sparkles
} from 'lucide-react';
import TopBar from './TopBar';
import FortalezaVisual, { statusConfig } from './FortalezaVisual';
import EmptyState from '../common/EmptyState';
import { StatsFlipCard } from '../common/FlipCard';
import DevModeRandomizer from '../dev/DevModeRandomizer';

// Animation presets
const spring = {
  bouncy: { type: "spring", stiffness: 400, damping: 10 },
  snappy: { type: "spring", stiffness: 400, damping: 25 },
  gentle: { type: "spring", stiffness: 100, damping: 20 },
  smooth: { type: "spring", stiffness: 50, damping: 15 },
};

// Soft theme configuration
const themeConfig = {
  heroClass: 'bg-gradient-to-br from-rose-100 via-purple-100 to-violet-100',
  textClass: 'text-gray-800',
  subtextClass: 'text-gray-500',
  badgeClass: 'bg-purple-200/50 text-purple-700',
  buttonClass: 'bg-purple-600 text-white',
  progressStroke: '#8B5CF6',
  progressBg: 'rgba(139,92,246,0.15)',
  decorationClass: 'bg-purple-300/30',
};

/**
 * Get motivational message based on streak
 */
function getMotivationalMessage(streak) {
  if (streak === 0) return "Empieza tu racha hoy";
  if (streak === 1) return "Primer dia completado";
  if (streak < 3) return "Buen comienzo";
  if (streak < 7) return "Vas muy bien";
  if (streak < 14) return "Increible constancia";
  if (streak < 30) return "Imparable";
  return "Leyenda";
}

/**
 * SessionCard - Today's session CTA card
 */
function SessionCard({ nextTopic, onStartSession }) {
  const config = statusConfig[nextTopic?.status] || statusConfig.nuevo;
  const TemaIcon = config.icon;

  return (
    <motion.div
      className={`col-span-2 ${themeConfig.heroClass} rounded-2xl p-5 relative overflow-hidden`}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      whileHover={{ scale: 1.01 }}
    >
      {/* Decorative blur */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${themeConfig.decorationClass} rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl`} />

      <div className="flex items-start justify-between relative">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
              <TemaIcon className={`w-4 h-4 ${config.text}`} />
            </div>
            <span className={`text-xs ${themeConfig.badgeClass} px-2 py-0.5 rounded-full`}>
              {config.label}
            </span>
          </div>
          <h2 className={`text-lg font-bold mb-1 ${themeConfig.textClass}`}>
            T{nextTopic?.id}. {nextTopic?.name}
          </h2>
          <p className={`text-sm ${themeConfig.subtextClass} mb-4`}>
            15 preguntas · ~10 min
          </p>
          <motion.button
            onClick={onStartSession}
            className={`px-5 py-2.5 ${themeConfig.buttonClass} font-semibold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-purple-500/25`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Zap className="w-4 h-4" /> Empezar ahora
          </motion.button>
        </div>

        {/* Progress circle */}
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle
              cx="40" cy="40" r="34"
              fill="none"
              stroke={themeConfig.progressBg}
              strokeWidth="6"
            />
            <motion.circle
              cx="40" cy="40" r="34"
              fill="none"
              stroke={themeConfig.progressStroke}
              strokeWidth="6"
              strokeLinecap="round"
              initial={{ strokeDasharray: "0 214" }}
              animate={{ strokeDasharray: `${(nextTopic?.progress / 100) * 214} 214` }}
              transition={spring.smooth}
            />
          </svg>
          <span className={`absolute inset-0 flex items-center justify-center text-lg font-bold ${themeConfig.textClass}`}>
            {nextTopic?.progress}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * StatCard - Streak/Accuracy stat card
 */
function StatCard({ icon: Icon, value, label, colorScheme, onClick, badge, delay = 0 }) {
  const colorClasses = {
    amber: {
      bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
      border: 'border-amber-100',
      icon: 'text-amber-500',
      badge: 'text-amber-600 bg-amber-100',
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-50 to-violet-50',
      border: 'border-purple-100',
      icon: 'text-purple-500',
      badge: 'text-emerald-600 bg-emerald-50',
    },
  };

  const colors = colorClasses[colorScheme] || colorClasses.purple;

  return (
    <motion.button
      onClick={onClick}
      className={`${colors.bg} rounded-2xl p-4 text-left border ${colors.border}`}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between mb-3">
        <Icon className={`w-6 h-6 ${colors.icon}`} />
        {badge && (
          <span className={`text-xs ${colors.badge} px-2 py-0.5 rounded-full`}>
            {badge}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-0.5">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </motion.button>
  );
}

/**
 * LevelCard - XP/Level display
 */
function LevelCard({ level, xp, percentile, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="col-span-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl p-4 text-white flex items-center justify-between"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.35 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <Trophy className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="font-bold text-lg">Nivel {level}</p>
          <p className="text-sm text-white/80">Top {percentile}% de opositores</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold">{xp}</p>
        <p className="text-xs text-white/70">XP totales</p>
      </div>
    </motion.button>
  );
}

/**
 * Footer - Links and branding
 */
function Footer({ onNavigate }) {
  const links = [
    { id: 'about', icon: Info, label: 'Acerca de' },
    { id: 'faq', icon: HelpCircle, label: 'Preguntas Frecuentes' },
    { id: 'instagram', icon: Instagram, label: 'Instagram', external: true },
  ];

  return (
    <motion.footer
      className="mt-6 mb-4"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100 overflow-hidden mb-8">
        {links.map((link) => (
          <motion.button
            key={link.id}
            onClick={() => {
              if (link.external) {
                window.open('https://instagram.com/opositasmart', '_blank');
              } else {
                onNavigate?.(link.id);
              }
            }}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <link.icon className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{link.label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </motion.button>
        ))}
      </div>

      {/* Branding */}
      <div className="text-center py-6">
        <p className="text-gray-900 font-semibold text-lg mb-1">Oposita Smart</p>
        <p className="text-gray-500 text-sm">La forma inteligente de opositar</p>
      </div>
    </motion.footer>
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
  totalStats = { testsCompleted: 0, questionsCorrect: 0, accuracyRate: 0 },
  fortalezaData = [],
  onStartSession,
  onTopicSelect,
  onSettingsClick,
  onProgressClick,
  onStreakClick,
  onAccuracyClick,
  onLevelClick,
  onViewAllTopics,
  onNavigate,
  showTopBar = true,
  showFooter = true
}) {
  const [simulationMode, setSimulationMode] = useState(null);

  // Check if user is completely new (no activity at all)
  const isNewUser = totalStats.testsCompleted === 0 &&
                    totalStats.questionsCorrect === 0 &&
                    streakData.current === 0 &&
                    fortalezaData.length === 0;

  // Calculate daily progress (simplified - can be enhanced)
  const dailyProgress = Math.min(100, totalStats.testsCompleted * 10);

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

  // Get motivational badge for streak
  const streakBadge = streakData.current > 0 ? `🔥 ${getMotivationalMessage(streakData.current)}` : null;

  // Get accuracy trend badge
  const accuracyBadge = totalStats.accuracyRate > 0 ? '↑ +5%' : null;

  // Calculate level and XP (simplified)
  const xp = totalStats.questionsCorrect * 10;
  const level = Math.floor(xp / 100) + 1;
  const percentile = Math.max(1, 100 - Math.floor(level * 5));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
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

      {/* Greeting section */}
      <div>
        <p className="text-xs text-purple-500 font-medium uppercase tracking-wider">
          {new Date().toLocaleDateString('es-ES', { weekday: 'long' })}
        </p>
        <h2 className="text-xl font-bold text-gray-900">
          Hola, {userName.split(' ')[0]}
        </h2>
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

      {/* Bento Grid - Only show if user has activity */}
      {!isNewUser && <div className="grid grid-cols-2 gap-3">
        {/* Session CTA - spans 2 columns */}
        <SessionCard
          nextTopic={nextTopic}
          onStartSession={onStartSession}
        />

        {/* Streak card */}
        <StatsFlipCard
          icon={Flame}
          value={streakData.current}
          label="días consecutivos"
          detail={`Tu mejor racha fue de ${streakData.longest} días. ¡Sigue así para superarla!`}
          colorScheme="amber"
          onClick={onStreakClick}
          badge={streakBadge}
          delay={0.15}
        />

        {/* Accuracy card */}
        <StatsFlipCard
          icon={Target}
          value={`${totalStats.accuracyRate}%`}
          label="precisión media"
          detail={`Has acertado ${totalStats.questionsCorrect} preguntas en total. ¡Cada día mejor!`}
          colorScheme="purple"
          onClick={onAccuracyClick}
          badge={accuracyBadge}
          delay={0.2}
        />

        {/* Fortaleza Visual - spans 2 columns */}
        <div className="col-span-2">
          <FortalezaVisual
            topics={fortalezaData}
            onTopicSelect={onTopicSelect}
            onViewAll={onViewAllTopics}
            maxVisible={3}
          />
        </div>

        {/* Level/Ranking card */}
        <LevelCard
          level={level}
          xp={xp}
          percentile={percentile}
          onClick={onLevelClick}
        />
      </div>}

      {/* Footer - optional */}
      {showFooter && <Footer onNavigate={onNavigate} />}

      {/* DevMode Randomizer - development only */}
      {import.meta.env.DEV && (
        <DevModeRandomizer
          activeMode={simulationMode}
          onSelectMode={setSimulationMode}
          onClear={() => setSimulationMode(null)}
        />
      )}

    </motion.div>
  );
}
