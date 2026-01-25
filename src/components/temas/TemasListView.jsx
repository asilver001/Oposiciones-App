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
  Filter,
  Play
} from 'lucide-react';
import EmptyState from '../common/EmptyState';
import DevModeRandomizer from '../dev/DevModeRandomizer';
import { useAuth } from '../../contexts/AuthContext';

/**
 * TemasListView - Topic list page with filtering and progress tracking
 *
 * Props:
 * - topics: array of topic objects
 * - topicsByBlock: object mapping block names to topic arrays
 * - onTopicSelect: function called when a topic is selected
 * - loading: boolean indicating loading state
 */

// Status configuration with colors and labels
const statusConfig = {
  dominado: {
    label: 'Dominado',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200',
    icon: CheckCircle,
    iconColor: 'text-green-500'
  },
  avanzando: {
    label: 'Avanzando',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-200',
    icon: Clock,
    iconColor: 'text-amber-500'
  },
  nuevo: {
    label: 'Nuevo',
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200',
    icon: Sparkles,
    iconColor: 'text-gray-400'
  },
  en_riesgo: {
    label: 'En riesgo',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-200',
    icon: AlertCircle,
    iconColor: 'text-red-500'
  }
};

// Block names are now dynamic from the data

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
 * ProgressBar - Visual progress indicator
 */
function ProgressBar({ percentage, status }) {
  const getGradient = () => {
    switch (status) {
      case 'dominado':
        return 'from-green-500 to-green-400';
      case 'avanzando':
        return 'from-amber-500 to-amber-400';
      case 'en_riesgo':
        return 'from-red-500 to-red-400';
      default:
        return 'from-purple-500 to-purple-400';
    }
  };

  return (
    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
      <motion.div
        className={`h-full bg-gradient-to-r ${getGradient()} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  );
}

/**
 * TopicCard - Individual topic card
 */
function TopicCard({ topic, onSelect }) {
  const config = statusConfig[topic.status] || statusConfig.nuevo;

  return (
    <motion.button
      onClick={() => onSelect(topic)}
      className={`w-full text-left p-4 rounded-xl border-2 transition-colors
        ${config.borderColor} bg-white hover:border-purple-400 hover:shadow-md
        active:scale-[0.98]`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">
            {topic.name}
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">
            {topic.questionsAnswered || 0} de {topic.questionsTotal || 0} preguntas
          </p>
        </div>
        <StatusBadge status={topic.status} />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <ProgressBar percentage={topic.progress || 0} status={topic.status} />
        </div>
        <span className="text-sm font-bold text-gray-700 min-w-[40px] text-right">
          {topic.progress || 0}%
        </span>
      </div>

      {topic.lastPracticed && (
        <p className="text-xs text-gray-400 mt-2">
          Ultima practica: {topic.lastPracticed}
        </p>
      )}
    </motion.button>
  );
}

/**
 * BlockSection - Collapsible block section
 */
function BlockSection({ blockName, topics, isExpanded, onToggle, onTopicSelect }) {
  const totalProgress = topics.length > 0
    ? Math.round(topics.reduce((sum, t) => sum + (t.progress || 0), 0) / topics.length)
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">{blockName}</h3>
            <p className="text-xs text-gray-500">{topics.length} temas</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-sm font-bold text-purple-600">{totalProgress}%</span>
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
            <div className="px-4 pb-4 space-y-3">
              {topics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  onSelect={onTopicSelect}
                />
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
          ? 'bg-purple-600 text-white shadow-md'
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
        No hay temas que coincidan con "{searchQuery}"
      </p>
      <button
        onClick={onClear}
        className="text-purple-600 font-medium hover:text-purple-700"
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
  onTopicSelect,
  loading = false
}) {
  const { isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [simulationMode, setSimulationMode] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [expandedBlocks, setExpandedBlocks] = useState(new Set());

  // Normalize topicsByBlock structure from useTopics hook
  // Hook returns: { blockId: { id, name, number, code, topics: [...] } }
  // We need: { blockName: { id, name, topics: [...] } }
  const normalizedBlocks = useMemo(() => {
    const result = {};

    Object.values(topicsByBlock).forEach((block) => {
      if (block && block.name && block.topics) {
        result[block.name] = {
          id: block.id,
          name: block.name,
          number: block.number,
          topics: block.topics
        };
      }
    });

    return result;
  }, [topicsByBlock]);

  // Initialize expanded blocks with first block
  React.useEffect(() => {
    const blockNames = Object.keys(normalizedBlocks);
    if (blockNames.length > 0 && expandedBlocks.size === 0) {
      setExpandedBlocks(new Set([blockNames[0]]));
    }
  }, [normalizedBlocks]);

  // Filter topics based on search and block
  const filteredTopicsByBlock = useMemo(() => {
    const result = {};

    Object.entries(normalizedBlocks).forEach(([blockName, block]) => {
      // Filter by selected block
      if (selectedBlock && blockName !== selectedBlock) return;

      // Filter by search query
      const filtered = (block.topics || []).filter((topic) =>
        topic.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (filtered.length > 0) {
        result[blockName] = {
          ...block,
          topics: filtered
        };
      }
    });

    return result;
  }, [normalizedBlocks, searchQuery, selectedBlock]);

  // Toggle block expansion
  const toggleBlock = (blockName) => {
    setExpandedBlocks((prev) => {
      const next = new Set(prev);
      if (next.has(blockName)) {
        next.delete(blockName);
      } else {
        next.add(blockName);
      }
      return next;
    });
  };

  // Calculate overall stats
  const overallStats = useMemo(() => {
    const total = topics.length;
    const dominados = topics.filter((t) => t.status === 'dominado').length;
    const enRiesgo = topics.filter((t) => t.status === 'en_riesgo').length;
    const avgProgress = total > 0
      ? Math.round(topics.reduce((sum, t) => sum + (t.progress || 0), 0) / total)
      : 0;

    return { total, dominados, enRiesgo, avgProgress };
  }, [topics]);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingState />
      </div>
    );
  }

  // Check if there are no topics at all
  const hasNoTopics = topics.length === 0;

  if (hasNoTopics) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={BookOpen}
          title="No hay temas disponibles"
          description="Aún no hay temas cargados en el sistema. Los temas estarán disponibles pronto."
          actionLabel="Explorar contenido"
          onAction={() => onTopicSelect?.(null)}
          variant="purple"
        />
      </div>
    );
  }

  const hasResults = Object.keys(filteredTopicsByBlock).length > 0;

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <div className="flex items-center justify-end">
        <div className="text-right">
          <p className="text-2xl font-bold text-purple-600">{overallStats.avgProgress}%</p>
          <p className="text-xs text-gray-500">progreso total</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <p className="text-xl font-bold text-gray-900">{overallStats.total}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="bg-green-50 rounded-xl p-3 shadow-sm text-center">
          <p className="text-xl font-bold text-green-600">{overallStats.dominados}</p>
          <p className="text-xs text-green-600">Dominados</p>
        </div>
        <div className="bg-red-50 rounded-xl p-3 shadow-sm text-center">
          <p className="text-xl font-bold text-red-600">{overallStats.enRiesgo}</p>
          <p className="text-xs text-red-600">En riesgo</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar tema..."
          className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-200
            focus:border-purple-400 focus:ring-2 focus:ring-purple-100
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
