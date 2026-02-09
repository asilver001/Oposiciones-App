import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronDown,
  ChevronRight,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  Play,
  Lock,
  Unlock,
  Target,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import EmptyState from '../common/EmptyState';
import DevModeRandomizer from '../dev/DevModeRandomizer';
import { useAuth } from '../../contexts/AuthContext';
import {
  getRecommendedOrder
} from '../../data/topicPrerequisites';

// Thematic sub-groupings for Auxiliar Administrativo AGE
// Maps topic numbers to their thematic sub-group within a block
const SUBGROUPS = {
  'Constitucion Espanola': [1, 2, 3, 4, 5],
  'Organizacion y Gobierno': [6, 7, 8, 9, 10],
  'Empleo Publico y Procedimiento': [11, 12, 13, 14, 15, 16]
};

// Icons for sub-groups
const SUBGROUP_ICONS = {
  'Constitucion Espanola': '📜',
  'Organizacion y Gobierno': '🏛️',
  'Empleo Publico y Procedimiento': '👥'
};

// Status configuration with colors and labels
const statusConfig = {
  dominado: {
    label: 'Dominado',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200',
    icon: CheckCircle,
    iconColor: 'text-green-500',
    ctaLabel: 'Repasar',
    ctaColor: 'bg-green-600'
  },
  avanzando: {
    label: 'Avanzando',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200',
    icon: TrendingUp,
    iconColor: 'text-blue-500',
    ctaLabel: 'Continuar',
    ctaColor: 'bg-blue-600'
  },
  progreso: {
    label: 'En progreso',
    color: 'text-brand-600',
    bgColor: 'bg-brand-100',
    borderColor: 'border-brand-200',
    icon: BookOpen,
    iconColor: 'text-brand-500',
    ctaLabel: 'Continuar',
    ctaColor: 'bg-brand-600'
  },
  nuevo: {
    label: 'Nuevo',
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200',
    icon: Sparkles,
    iconColor: 'text-gray-400',
    ctaLabel: 'Empezar',
    ctaColor: 'bg-brand-600'
  },
  riesgo: {
    label: 'Repasar',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-200',
    icon: AlertCircle,
    iconColor: 'text-amber-500',
    ctaLabel: 'Repasar',
    ctaColor: 'bg-amber-600'
  },
  en_riesgo: {
    label: 'En riesgo',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-200',
    icon: AlertCircle,
    iconColor: 'text-red-500',
    ctaLabel: 'Repasar',
    ctaColor: 'bg-red-600'
  }
};

/**
 * StatusBadge - Displays status with icon and color
 */
function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.nuevo;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
      <Icon className={`w-3 h-3 ${config.iconColor}`} />
      {config.label}
    </span>
  );
}

/**
 * AccuracyBadge - Color-coded accuracy percentage
 */
function AccuracyBadge({ accuracy }) {
  if (accuracy === 0) return null;

  let colorClass = 'text-green-600 bg-green-50';
  if (accuracy < 60) colorClass = 'text-red-600 bg-red-50';
  else if (accuracy < 80) colorClass = 'text-amber-600 bg-amber-50';

  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${colorClass}`}>
      <Target className="w-3 h-3" />
      {accuracy}%
    </span>
  );
}

/**
 * ProgressBar - Visual progress indicator
 */
function ProgressBar({ percentage, status }) {
  const getColor = () => {
    switch (status) {
      case 'dominado': return 'bg-green-500';
      case 'avanzando': return 'bg-blue-500';
      case 'en_riesgo': return 'bg-red-500';
      case 'riesgo': return 'bg-amber-500';
      default: return 'bg-brand-500';
    }
  };

  return (
    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
      <motion.div
        className={`h-full ${getColor()} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(percentage, 100)}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  );
}

/**
 * TopicCard - Enhanced individual topic card with session stats
 */
function TopicCard({ topic, onSelect, locked, lockMessage, hasPrereqs }) {
  const config = statusConfig[topic.status] || statusConfig.nuevo;

  const sessionQuestions = topic.sessionQuestions || 0;
  const sessionAccuracy = topic.sessionAccuracy || 0;
  const sessionsCount = topic.sessionsCompleted || 0;

  return (
    <motion.button
      onClick={() => !locked && onSelect(topic)}
      className={`w-full text-left p-4 rounded-xl border-2 transition-colors relative
        ${locked
          ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
          : `${config.borderColor} bg-white hover:border-brand-400 hover:shadow-md active:scale-[0.98]`
        }`}
      whileHover={locked ? {} : { y: -2 }}
      whileTap={locked ? {} : { scale: 0.98 }}
    >
      {locked && (
        <div className="absolute top-3 right-3 w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center">
          <Lock className="w-4 h-4 text-gray-500" />
        </div>
      )}

      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 shrink-0">T{topic.number}</span>
            <h4 className={`font-semibold truncate text-sm ${locked ? 'text-gray-500' : 'text-gray-900'}`}>
              {topic.name}
            </h4>
          </div>
          {locked && lockMessage ? (
            <p className="text-xs text-gray-400 mt-0.5">{lockMessage}</p>
          ) : (
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-gray-500">
                {topic.questionsAnswered || 0}/{topic.questionsTotal || 0} preguntas
              </p>
              {sessionQuestions > 0 && (
                <span className="text-xs text-gray-400">
                  · {sessionsCount} {sessionsCount === 1 ? 'sesion' : 'sesiones'}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {!locked && <AccuracyBadge accuracy={topic.accuracy || sessionAccuracy} />}
          {!locked && <StatusBadge status={topic.status} />}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <ProgressBar
            percentage={locked ? 0 : (topic.progress || 0)}
            status={locked ? 'nuevo' : topic.status}
          />
        </div>
        <span className={`text-sm font-bold min-w-[40px] text-right ${locked ? 'text-gray-400' : 'text-gray-700'}`}>
          {locked ? '--' : `${topic.progress || 0}%`}
        </span>
      </div>

      {/* Bottom row: unlock badge + CTA */}
      <div className="flex items-center justify-between mt-2">
        <div>
          {!locked && hasPrereqs && topic.progress > 0 && (
            <p className="text-xs text-green-500 flex items-center gap-1">
              <Unlock className="w-3 h-3" /> Desbloqueado
            </p>
          )}
          {!locked && topic.lastPracticed && (
            <p className="text-xs text-gray-400">
              Ultima: {topic.lastPracticed}
            </p>
          )}
        </div>
        {!locked && (
          <span className={`text-xs font-semibold text-white px-3 py-1 rounded-full ${config.ctaColor}`}>
            {config.ctaLabel}
          </span>
        )}
      </div>
    </motion.button>
  );
}

/**
 * SubgroupHeader - Thematic sub-group label
 */
function SubgroupHeader({ name, icon, topicCount }) {
  return (
    <div className="flex items-center gap-2 pt-2 pb-1">
      <span className="text-sm">{icon}</span>
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{name}</span>
      <span className="text-xs text-gray-400">({topicCount})</span>
    </div>
  );
}

/**
 * BlockSection - Collapsible block section with sub-groups
 */
function BlockSection({ blockName, topics, isExpanded, onToggle, onTopicSelect }) {
  const totalProgress = topics.length > 0
    ? Math.round(topics.reduce((sum, t) => sum + (t.progress || 0), 0) / topics.length)
    : 0;

  const dominadosCount = topics.filter(t => t.status === 'dominado').length;
  const totalQuestionsPracticed = topics.reduce((sum, t) => sum + (t.sessionQuestions || 0), 0);

  // Group topics into sub-groups
  const subgroupedTopics = useMemo(() => {
    const groups = [];
    const assigned = new Set();

    // Check each subgroup
    Object.entries(SUBGROUPS).forEach(([sgName, sgTopicNums]) => {
      const sgTopics = topics.filter(t => sgTopicNums.includes(t.number));
      if (sgTopics.length > 0) {
        groups.push({
          name: sgName,
          icon: SUBGROUP_ICONS[sgName] || '📚',
          topics: sgTopics
        });
        sgTopics.forEach(t => assigned.add(t.id));
      }
    });

    // Any topics not in a subgroup
    const unassigned = topics.filter(t => !assigned.has(t.id));
    if (unassigned.length > 0 && groups.length > 0) {
      groups.push({ name: 'Otros', icon: '📚', topics: unassigned });
    } else if (groups.length === 0) {
      // No subgroups match — render flat
      groups.push({ name: null, icon: null, topics });
    }

    return groups;
  }, [topics]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-brand-600" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900 text-sm">{blockName}</h3>
            <p className="text-xs text-gray-500">
              {topics.length} temas · {dominadosCount} dominados
              {totalQuestionsPracticed > 0 && ` · ${totalQuestionsPracticed} practicadas`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-sm font-bold text-brand-600">{totalProgress}%</span>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {subgroupedTopics.map((sg, sgIdx) => (
                <div key={sg.name || sgIdx}>
                  {sg.name && (
                    <SubgroupHeader
                      name={sg.name}
                      icon={sg.icon}
                      topicCount={sg.topics.length}
                    />
                  )}
                  <div className="space-y-3 mb-2">
                    {sg.topics.map((topic) => (
                      <TopicCard
                        key={topic.id}
                        topic={topic}
                        onSelect={onTopicSelect}
                        locked={false}
                        lockMessage={null}
                        hasPrereqs={false}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * FilterChip - Filter button for blocks
 */
function FilterChip({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
        ${isActive
          ? 'bg-brand-600 text-white shadow-sm'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
    >
      {label}
    </button>
  );
}

/**
 * NoSearchResults - Shown when no topics match filter
 */
function NoSearchResults({ searchQuery, onClear }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-8 text-center shadow-sm"
    >
      <div className="text-5xl mb-4">
        <Search className="w-12 h-12 mx-auto text-gray-300" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No se encontraron temas
      </h3>
      <p className="text-gray-500 mb-4">
        No hay temas que coincidan con &quot;{searchQuery}&quot;
      </p>
      <button
        onClick={onClear}
        className="text-brand-600 font-medium hover:text-brand-700"
      >
        Limpiar busqueda
      </button>
    </motion.div>
  );
}

/**
 * LoadingState - Skeleton loading
 */
function LoadingState() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gray-200 rounded-xl" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/4" />
            </div>
          </div>
          <div className="space-y-2">
            {[1, 2].map((j) => (
              <div key={j} className="h-16 bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Main TemasListView component
 */
export default function TemasListView({
  topics = [],
  topicsByBlock = {},
  userProgress = {},
  onTopicSelect,
  loading = false
}) {
  const { isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [simulationMode, setSimulationMode] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [expandedBlocks, setExpandedBlocks] = useState(new Set());

  // Calculate real topic progress from userProgress (always enrich with questionCount)
  const realTopicProgress = useMemo(() => {
    if (topics.length === 0) return null;

    return topics.map((topic) => {
      const progressKey = topic.number ?? topic.id;
      const progress = userProgress[progressKey] || {
        answered: 0, correct: 0, accuracy: 0,
        new: 0, learning: 0, review: 0, relearning: 0, mastered: 0, masteryRate: 0,
        sessionsCompleted: 0, sessionQuestions: 0, sessionCorrect: 0, sessionTime: 0
      };

      const totalCards = progress.new + progress.learning + progress.review + progress.relearning;
      const questionsTotal = topic.questionCount || 20;
      const progressPercent = progress.masteryRate || 0;

      let status = 'nuevo';
      if (totalCards === 0 && !progress.sessionsCompleted) {
        status = 'nuevo';
      } else if (progress.masteryRate >= 80 && progress.accuracy >= 75) {
        status = 'dominado';
      } else if (progress.masteryRate >= 50 || progress.accuracy >= 65) {
        status = 'avanzando';
      } else if (progress.relearning > 0 || progress.accuracy < 50) {
        status = totalCards > 0 ? 'riesgo' : 'progreso';
      } else {
        status = 'progreso';
      }

      // Session-based accuracy
      const sessionAccuracy = progress.sessionQuestions > 0
        ? Math.round((progress.sessionCorrect / progress.sessionQuestions) * 100)
        : 0;

      return {
        ...topic,
        progress: progressPercent,
        status,
        questionsAnswered: totalCards,
        questionsTotal,
        accuracy: progress.accuracy || 0,
        sessionsCompleted: progress.sessionsCompleted || 0,
        sessionQuestions: progress.sessionQuestions || 0,
        sessionAccuracy,
        fsrs: {
          new: progress.new,
          learning: progress.learning,
          review: progress.review,
          relearning: progress.relearning,
          mastered: progress.mastered
        }
      };
    });
  }, [topics, userProgress]);

  // Generate simulated topic progress based on simulation mode
  /* eslint-disable react-hooks/purity */
  const generateSimulatedTopics = useMemo(() => {
    if (!simulationMode || topics.length === 0) return null;

    return topics.map((topic) => {
      let progress, status, questionsAnswered, sessionsCompleted, sessionQuestions;
      const questionsTotal = topic.questionsTotal || 20;

      switch (simulationMode) {
        case 'nuevo':
          progress = 0; status = 'nuevo'; questionsAnswered = 0;
          sessionsCompleted = 0; sessionQuestions = 0;
          break;
        case 'activo':
          progress = Math.floor(Math.random() * 31) + 30;
          status = Math.random() > 0.5 ? 'avanzando' : 'progreso';
          questionsAnswered = Math.floor(questionsTotal * (progress / 100));
          sessionsCompleted = Math.floor(Math.random() * 5) + 1;
          sessionQuestions = questionsAnswered * 2;
          break;
        case 'veterano':
          progress = Math.floor(Math.random() * 31) + 70;
          status = progress >= 85 ? 'dominado' : 'avanzando';
          questionsAnswered = Math.floor(questionsTotal * (progress / 100));
          sessionsCompleted = Math.floor(Math.random() * 10) + 5;
          sessionQuestions = questionsAnswered * 3;
          break;
        case 'aleatorio':
        default:
          progress = Math.floor(Math.random() * 101);
          if (progress < 20) status = 'nuevo';
          else if (progress < 60) status = 'progreso';
          else if (progress >= 85) status = 'dominado';
          else status = Math.random() > 0.7 ? 'riesgo' : 'avanzando';
          questionsAnswered = Math.floor(questionsTotal * (progress / 100));
          sessionsCompleted = progress > 0 ? Math.floor(Math.random() * 8) + 1 : 0;
          sessionQuestions = questionsAnswered * 2;
          break;
      }

      return {
        ...topic,
        progress,
        status,
        questionsAnswered,
        questionsTotal,
        accuracy: progress > 0 ? Math.floor(Math.random() * 41) + 60 : 0,
        sessionsCompleted,
        sessionQuestions,
        sessionAccuracy: progress > 0 ? Math.floor(Math.random() * 41) + 60 : 0
      };
    });
  }, [simulationMode, topics]);
  /* eslint-enable react-hooks/purity */

  // Use simulated, real progress, or raw topics (in that priority order)
  const effectiveTopics = generateSimulatedTopics || realTopicProgress || topics;

  // Normalize topicsByBlock: enrich block topics with progress data
  const normalizedBlocks = useMemo(() => {
    const result = {};
    const enrichedMap = new Map();
    effectiveTopics.forEach((t) => enrichedMap.set(t.id, t));

    Object.values(topicsByBlock).forEach((block) => {
      if (block && block.name && block.topics) {
        const blockTopics = block.topics.map((topic) => {
          const enriched = enrichedMap.get(topic.id);
          if (enriched) return enriched;
          return { ...topic, questionsTotal: topic.questionCount || 0, questionsAnswered: 0 };
        });

        result[block.name] = {
          id: block.id,
          name: block.name,
          number: block.number,
          topics: blockTopics
        };
      }
    });

    return result;
  }, [topicsByBlock, effectiveTopics]);

  // Initialize expanded blocks with first block
  React.useEffect(() => {
    const blockNames = Object.keys(normalizedBlocks);
    if (blockNames.length > 0 && expandedBlocks.size === 0) {
      setExpandedBlocks(new Set([blockNames[0]]));
    }
  }, [normalizedBlocks]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter topics based on search and block
  const filteredTopicsByBlock = useMemo(() => {
    const result = {};

    Object.entries(normalizedBlocks).forEach(([blockName, block]) => {
      if (selectedBlock && blockName !== selectedBlock) return;

      const filtered = (block.topics || []).filter((topic) =>
        topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `tema ${topic.number}`.includes(searchQuery.toLowerCase()) ||
        `t${topic.number}`.includes(searchQuery.toLowerCase())
      );

      if (filtered.length > 0) {
        result[blockName] = { ...block, topics: filtered };
      }
    });

    return result;
  }, [normalizedBlocks, searchQuery, selectedBlock]);

  // Toggle block expansion
  const toggleBlock = (blockName) => {
    setExpandedBlocks((prev) => {
      const next = new Set(prev);
      if (next.has(blockName)) next.delete(blockName);
      else next.add(blockName);
      return next;
    });
  };

  // Calculate overall stats
  const overallStats = useMemo(() => {
    const total = effectiveTopics.length;
    const dominados = effectiveTopics.filter((t) => t.status === 'dominado').length;
    const enRiesgo = effectiveTopics.filter((t) => t.status === 'riesgo' || t.status === 'en_riesgo').length;
    const avgProgress = total > 0
      ? Math.round(effectiveTopics.reduce((sum, t) => sum + (t.progress || 0), 0) / total)
      : 0;
    const totalPracticed = effectiveTopics.reduce((sum, t) => sum + (t.sessionQuestions || 0), 0);
    const totalSessions = effectiveTopics.reduce((sum, t) => sum + (t.sessionsCompleted || 0), 0);

    return { total, dominados, enRiesgo, avgProgress, totalPracticed, totalSessions };
  }, [effectiveTopics]);

  // Recommended topics to study next
  const recommendedTopics = useMemo(() => {
    const recommended = getRecommendedOrder(userProgress);
    return recommended
      .map((num) => effectiveTopics.find((t) => (t.number ?? t.id) === num))
      .filter(Boolean)
      .slice(0, 3);
  }, [userProgress, effectiveTopics]);

  if (loading) {
    return <div className="space-y-6"><LoadingState /></div>;
  }

  if (topics.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={BookOpen}
          title="No hay temas disponibles"
          description="Los temas estaran disponibles pronto."
          variant="purple"
        />
      </div>
    );
  }

  const hasResults = Object.keys(filteredTopicsByBlock).length > 0;

  return (
    <div className="space-y-5">
      {/* Progress Header */}
      <div className="bg-gradient-to-br from-brand-50 to-purple-50 rounded-2xl p-4 border border-brand-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900">Tu progreso</h2>
          <span className="text-2xl font-bold text-brand-600">{overallStats.avgProgress}%</span>
        </div>
        <ProgressBar percentage={overallStats.avgProgress} status="progreso" />
        <div className="grid grid-cols-4 gap-2 mt-3">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{overallStats.total}</p>
            <p className="text-[10px] text-gray-500">Temas</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-green-600">{overallStats.dominados}</p>
            <p className="text-[10px] text-green-600">Dominados</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-amber-600">{overallStats.enRiesgo}</p>
            <p className="text-[10px] text-amber-600">Repasar</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-brand-600">{overallStats.totalPracticed}</p>
            <p className="text-[10px] text-brand-600">Practicadas</p>
          </div>
        </div>
      </div>

      {/* Recommended Next Topics */}
      {recommendedTopics.length > 0 && (
        <div className="bg-brand-50 rounded-2xl p-4 border border-brand-100">
          <h3 className="text-sm font-semibold text-brand-700 mb-3 flex items-center gap-2">
            <Play className="w-4 h-4" />
            Te sugerimos continuar con
          </h3>
          <div className="space-y-2">
            {recommendedTopics.map((topic, idx) => (
              <button
                key={topic.id}
                onClick={() => onTopicSelect(topic)}
                className="w-full flex items-center gap-3 p-2.5 bg-white rounded-xl
                  hover:shadow-sm hover:border-brand-300 border border-brand-100
                  transition-all text-left"
              >
                <span className="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center
                  text-xs font-bold text-brand-600 shrink-0">
                  {idx + 1}
                </span>
                <span className="text-sm font-medium text-gray-800 truncate flex-1">
                  T{topic.number ?? topic.id}. {topic.name}
                </span>
                <ChevronRight className="w-4 h-4 text-brand-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar tema..."
          className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-200
            focus:border-brand-400 focus:ring-2 focus:ring-brand-100
            outline-none transition-all text-gray-900 placeholder-gray-400"
        />
      </div>

      {/* Block Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        <FilterChip
          label="Todos"
          isActive={selectedBlock === null}
          onClick={() => setSelectedBlock(null)}
        />
        {Object.keys(normalizedBlocks).map((blockName) => (
          <FilterChip
            key={blockName}
            label={blockName}
            isActive={selectedBlock === blockName}
            onClick={() => setSelectedBlock(blockName)}
          />
        ))}
      </div>

      {/* Topics List */}
      {hasResults ? (
        <div className="space-y-4">
          {Object.entries(filteredTopicsByBlock).map(([blockName, block]) => (
            <BlockSection
              key={blockName}
              blockName={blockName}
              topics={block.topics || []}
              isExpanded={expandedBlocks.has(blockName)}
              onToggle={() => toggleBlock(blockName)}
              onTopicSelect={onTopicSelect}
            />
          ))}
        </div>
      ) : (
        <NoSearchResults
          searchQuery={searchQuery}
          onClear={() => {
            setSearchQuery('');
            setSelectedBlock(null);
          }}
        />
      )}

      {/* DevMode Randomizer - development or admin */}
      {(import.meta.env.DEV || isAdmin) && (
        <DevModeRandomizer
          activeMode={simulationMode}
          onSelectMode={setSimulationMode}
          onClear={() => setSimulationMode(null)}
          pageContext="temas"
        />
      )}
    </div>
  );
}
