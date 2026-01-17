/**
 * DraftFeatures - Preliminary Integrations
 *
 * Features ready for review before integration into main app:
 * 1. Fortaleza with animated progress bars (replaces dots)
 * 2. Circular progress with interactive modal
 * 3. Enhanced Fortaleza with new layout
 * 4. Expandable cards demo
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Check, X, ChevronRight, ChevronDown,
  BookOpen, Target, Flame, Trophy, Clock, TrendingUp,
  Zap, Star, AlertTriangle, Plus, Eye, Calendar,
  BarChart3, Award, Brain, Sparkles
} from 'lucide-react';

// ============================================
// SPRING PRESETS
// ============================================

const spring = {
  bouncy: { type: "spring", stiffness: 400, damping: 10 },
  snappy: { type: "spring", stiffness: 400, damping: 25 },
  gentle: { type: "spring", stiffness: 100, damping: 20 },
  smooth: { type: "spring", stiffness: 50, damping: 15 },
};

// ============================================
// 1. FORTALEZA WITH ANIMATED PROGRESS BARS
// ============================================

const estadoConfig = {
  dominado: {
    label: 'Dominado',
    color: 'emerald',
    gradient: 'from-emerald-400 to-emerald-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    icon: Check,
    priority: 4,
  },
  avanzando: {
    label: 'Avanzando',
    color: 'purple',
    gradient: 'from-purple-400 to-purple-500',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    icon: TrendingUp,
    priority: 3,
  },
  progreso: {
    label: 'En progreso',
    color: 'blue',
    gradient: 'from-blue-400 to-blue-500',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    icon: BookOpen,
    priority: 2,
  },
  riesgo: {
    label: 'Repasar',
    color: 'amber',
    gradient: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    icon: AlertTriangle,
    priority: 1,
    pulse: true,
  },
  nuevo: {
    label: 'Nuevo',
    color: 'gray',
    gradient: 'from-gray-300 to-gray-400',
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    icon: Plus,
    priority: 5,
  },
};

function AnimatedProgressBar({ value, max = 100, estado = 'progreso', showLabel = false, size = 'md' }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const config = estadoConfig[estado] || estadoConfig.progreso;
  const sizes = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3.5' };

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${sizes[size]}`}>
        <motion.div
          className={`h-full bg-gradient-to-r ${config.gradient} rounded-full relative`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={spring.smooth}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-white/25"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: '40%' }}
          />
        </motion.div>
      </div>
      {showLabel && (
        <span className={`text-xs font-medium ${config.text} mt-1`}>{Math.round(percentage)}%</span>
      )}
    </div>
  );
}

function FortalezaWithBars({ temas, onVerTodo, maxVisible = 5 }) {
  // Sort by priority (riesgo first, then by progress)
  const sortedTemas = [...temas].sort((a, b) => {
    const configA = estadoConfig[a.estado] || estadoConfig.nuevo;
    const configB = estadoConfig[b.estado] || estadoConfig.nuevo;
    if (configA.priority !== configB.priority) return configA.priority - configB.priority;
    return b.progreso - a.progreso;
  });

  const visibleTemas = sortedTemas.slice(0, maxVisible);
  const remainingCount = temas.length - maxVisible;

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring.gentle}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏰</span>
          <h3 className="font-semibold text-gray-900">Tu Fortaleza</h3>
        </div>
        {onVerTodo && (
          <motion.button
            onClick={onVerTodo}
            className="flex items-center gap-1 text-sm text-purple-600 font-medium"
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
          >
            Ver todo <ChevronRight className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      {/* Temas with animated bars */}
      <div className="px-4 py-2">
        {visibleTemas.map((tema, index) => {
          const config = estadoConfig[tema.estado] || estadoConfig.nuevo;
          const Icon = config.icon;

          return (
            <motion.div
              key={tema.id}
              className="py-3 border-b border-gray-50 last:border-b-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...spring.gentle, delay: index * 0.05 }}
            >
              {/* Top row: name and status */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <motion.div
                    className={`w-7 h-7 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}
                    animate={config.pulse ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Icon className={`w-4 h-4 ${config.text}`} />
                  </motion.div>
                  <p className="text-sm font-medium text-gray-800 truncate">
                    <span className="text-gray-400">T{tema.id}</span> {tema.nombre}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bg} ${config.text} whitespace-nowrap`}>
                  {tema.progreso}%
                </span>
              </div>

              {/* Progress bar */}
              <AnimatedProgressBar value={tema.progreso} estado={tema.estado} size="md" />
            </motion.div>
          );
        })}
      </div>

      {/* Show more */}
      {remainingCount > 0 && (
        <motion.button
          onClick={onVerTodo}
          className="w-full px-4 py-2.5 text-sm text-gray-500 hover:text-purple-600 hover:bg-gray-50 transition-colors border-t border-gray-100"
          whileHover={{ backgroundColor: 'rgba(147, 51, 234, 0.05)' }}
        >
          +{remainingCount} tema{remainingCount !== 1 ? 's' : ''} más
        </motion.button>
      )}

      {/* Legend */}
      <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-100 flex flex-wrap gap-3 justify-center">
        {['dominado', 'avanzando', 'riesgo'].map(estado => {
          const config = estadoConfig[estado];
          return (
            <span key={estado} className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${config.gradient}`} />
              {config.label}
            </span>
          );
        })}
      </div>
    </motion.div>
  );
}

// ============================================
// 2. CIRCULAR PROGRESS WITH MODAL
// ============================================

function CircularProgress({ value, max = 100, size = 56, strokeWidth = 5, color = 'purple' }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const colors = {
    purple: { stroke: '#8b5cf6', bg: 'text-purple-600' },
    emerald: { stroke: '#10b981', bg: 'text-emerald-600' },
    amber: { stroke: '#f59e0b', bg: 'text-amber-600' },
  };

  const c = colors[color] || colors.purple;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={c.stroke} strokeWidth={strokeWidth}
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={spring.smooth}
        />
      </svg>
      <span className={`absolute text-xs font-bold ${c.bg}`}>{Math.round(percentage)}%</span>
    </div>
  );
}

function ProgressModal({ isOpen, onClose, progressData }) {
  if (!isOpen) return null;

  const areas = [
    { id: 'global', label: 'Progreso Global', value: 45, icon: Target, color: 'purple' },
    { id: 'temas', label: 'Temas Dominados', value: 30, max: 100, icon: BookOpen, color: 'emerald' },
    { id: 'precision', label: 'Precisión', value: 78, icon: Brain, color: 'purple' },
    { id: 'repasos', label: 'Repasos al día', value: 85, icon: Clock, color: 'amber' },
    { id: 'racha', label: 'Racha Actual', value: 100, icon: Flame, color: 'amber' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-[300]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white rounded-3xl shadow-2xl z-[301] overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: '-40%' }}
            animate={{ opacity: 1, scale: 1, y: '-50%' }}
            exit={{ opacity: 0, scale: 0.9, y: '-40%' }}
            transition={spring.bouncy}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Tu Progreso</h3>
                  <p className="text-xs text-gray-500">Vista detallada</p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-100"
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5 text-gray-500" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Main circular progress */}
              <div className="flex items-center justify-center py-4">
                <div className="relative">
                  <CircularProgress value={45} size={120} strokeWidth={10} />
                  <motion.div
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-medium px-3 py-1 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ ...spring.bouncy, delay: 0.3 }}
                  >
                    Progreso Global
                  </motion.div>
                </div>
              </div>

              {/* Area breakdown */}
              <div className="space-y-3">
                {areas.slice(1).map((area, i) => {
                  const Icon = area.icon;
                  return (
                    <motion.div
                      key={area.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ ...spring.gentle, delay: 0.1 + i * 0.05 }}
                    >
                      <CircularProgress value={area.value} size={44} strokeWidth={4} color={area.color} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{area.label}</p>
                        <div className="h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${
                              area.color === 'emerald' ? 'bg-emerald-500' :
                              area.color === 'amber' ? 'bg-amber-500' : 'bg-purple-500'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${area.value}%` }}
                            transition={{ ...spring.smooth, delay: 0.2 + i * 0.05 }}
                          />
                        </div>
                      </div>
                      <Icon className={`w-5 h-5 ${
                        area.color === 'emerald' ? 'text-emerald-500' :
                        area.color === 'amber' ? 'text-amber-500' : 'text-purple-500'
                      }`} />
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
              <motion.button
                onClick={onClose}
                className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Seguir estudiando
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Session card with circular progress
function SessionCardWithProgress({ onStartSession }) {
  const [showModal, setShowModal] = useState(false);
  const globalProgress = 45;

  return (
    <>
      <motion.div
        className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring.gentle}
      >
        {/* Header with circular progress */}
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-gray-800 flex items-center gap-2">
            🎯 Tu Sesión de Hoy
          </span>

          {/* Clickable circular progress */}
          <motion.button
            onClick={() => setShowModal(true)}
            className="relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <CircularProgress value={globalProgress} size={48} strokeWidth={4} />
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ ...spring.bouncy, delay: 0.5 }}
            >
              <Eye className="w-2.5 h-2.5 text-white" />
            </motion.div>
          </motion.button>
        </div>

        {/* Session Items */}
        <div className="space-y-3 mb-4">
          <motion.div
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
            whileHover={{ x: 4 }}
          >
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-lg">📗</div>
            <div className="flex-1">
              <div className="font-medium text-gray-800">Tema 8 - AGE Central</div>
              <div className="text-sm text-gray-500">Tema nuevo · 15 preguntas</div>
            </div>
            <CircularProgress value={0} size={32} strokeWidth={3} color="emerald" />
          </motion.div>

          <motion.div
            className="flex items-center gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-100"
            whileHover={{ x: 4 }}
          >
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-lg">🔄</div>
            <div className="flex-1">
              <div className="font-medium text-gray-800">Tema 4 - La Corona</div>
              <div className="text-sm text-amber-600">Repaso urgente · Art. 57</div>
            </div>
            <CircularProgress value={65} size={32} strokeWidth={3} color="amber" />
          </motion.div>
        </div>

        {/* Start button */}
        <motion.button
          onClick={onStartSession}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-xl font-semibold"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={spring.snappy}
        >
          Empezar sesión →
        </motion.button>
      </motion.div>

      <ProgressModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

// ============================================
// 3. ENHANCED FORTALEZA - CARD GRID VERSION
// ============================================

function FortalezaGrid({ temas }) {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring.gentle}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <span className="text-xl">🏰</span>
        <h3 className="font-semibold text-gray-900">Tu Fortaleza</h3>
        <span className="ml-auto text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
          {temas.filter(t => t.estado === 'dominado').length}/{temas.length} dominados
        </span>
      </div>

      {/* Grid of topic cards */}
      <div className="p-3 grid grid-cols-4 gap-2">
        {temas.map((tema, i) => {
          const config = estadoConfig[tema.estado] || estadoConfig.nuevo;
          const Icon = config.icon;

          return (
            <motion.div
              key={tema.id}
              className={`aspect-square rounded-xl ${config.bg} flex flex-col items-center justify-center p-2 cursor-pointer relative overflow-hidden`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ ...spring.bouncy, delay: i * 0.03 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {config.pulse && (
                <motion.div
                  className="absolute inset-0 bg-amber-400/20"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              <Icon className={`w-5 h-5 ${config.text} mb-1`} />
              <span className="text-xs font-bold text-gray-700">T{tema.id}</span>
              <span className={`text-[10px] font-medium ${config.text}`}>{tema.progreso}%</span>
            </motion.div>
          );
        })}
      </div>

      {/* Stats row */}
      <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-lg font-bold text-emerald-600">{temas.filter(t => t.estado === 'dominado').length}</p>
          <p className="text-xs text-gray-500">Dominados</p>
        </div>
        <div>
          <p className="text-lg font-bold text-purple-600">{temas.filter(t => t.estado === 'avanzando' || t.estado === 'progreso').length}</p>
          <p className="text-xs text-gray-500">En progreso</p>
        </div>
        <div>
          <p className="text-lg font-bold text-amber-600">{temas.filter(t => t.estado === 'riesgo').length}</p>
          <p className="text-xs text-gray-500">Repasar</p>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// 4. EXPANDABLE CARDS
// ============================================

function ExpandableCard({ title, subtitle, icon: Icon, children, defaultOpen = false }) {
  const [isExpanded, setIsExpanded] = useState(defaultOpen);

  return (
    <motion.div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      layout
    >
      <motion.button
        className="w-full p-4 flex items-center gap-3 text-left"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {Icon && (
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-purple-600" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900">{title}</p>
          {subtitle && <p className="text-sm text-gray-500 truncate">{subtitle}</p>}
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={spring.snappy}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={spring.gentle}
          >
            <div className="px-4 pb-4 pt-0 border-t border-gray-100">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Suggested places for expandable cards
function ExpandableCardsDemo() {
  return (
    <div className="space-y-3">
      <ExpandableCard
        title="Estadísticas detalladas"
        subtitle="Ver más métricas"
        icon={BarChart3}
      >
        <div className="pt-3 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Precisión media</span>
            <span className="font-semibold text-purple-600">78%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Tiempo medio/pregunta</span>
            <span className="font-semibold text-purple-600">45s</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Mejor tema</span>
            <span className="font-semibold text-emerald-600">Constitución</span>
          </div>
        </div>
      </ExpandableCard>

      <ExpandableCard
        title="Tema 4 - La Corona"
        subtitle="3 artículos débiles"
        icon={AlertTriangle}
        defaultOpen
      >
        <div className="pt-3 space-y-2">
          <p className="text-sm text-gray-600 mb-3">Artículos que necesitan repaso:</p>
          {['Art. 57 - Sucesión', 'Art. 62 - Funciones del Rey', 'Art. 65 - Casa Real'].map((art, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-amber-800">{art}</span>
            </motion.div>
          ))}
        </div>
      </ExpandableCard>

      <ExpandableCard
        title="Logros recientes"
        subtitle="2 nuevos esta semana"
        icon={Trophy}
      >
        <div className="pt-3 space-y-2">
          {[
            { icon: '🔥', title: 'Racha de 7 días', date: 'Hoy' },
            { icon: '🎯', title: '100 preguntas', date: 'Ayer' },
          ].map((logro, i) => (
            <div key={i} className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg">
              <span className="text-xl">{logro.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-purple-800">{logro.title}</p>
                <p className="text-xs text-purple-600">{logro.date}</p>
              </div>
            </div>
          ))}
        </div>
      </ExpandableCard>
    </div>
  );
}

// ============================================
// MAIN DRAFT FEATURES COMPONENT
// ============================================

export default function DraftFeatures({ onClose }) {
  const [activeTab, setActiveTab] = useState('fortaleza-bars');

  // Demo data
  const demoTemas = [
    { id: 1, nombre: 'Constitución Española', estado: 'dominado', progreso: 95 },
    { id: 2, nombre: 'Derechos Fundamentales', estado: 'dominado', progreso: 88 },
    { id: 3, nombre: 'Cortes Generales', estado: 'avanzando', progreso: 72 },
    { id: 4, nombre: 'La Corona', estado: 'riesgo', progreso: 45 },
    { id: 5, nombre: 'Gobierno y Administración', estado: 'progreso', progreso: 55 },
    { id: 6, nombre: 'Poder Judicial', estado: 'progreso', progreso: 40 },
    { id: 7, nombre: 'Organización Territorial', estado: 'riesgo', progreso: 30 },
    { id: 8, nombre: 'Tribunal Constitucional', estado: 'nuevo', progreso: 0 },
    { id: 9, nombre: 'Reforma Constitucional', estado: 'nuevo', progreso: 0 },
    { id: 10, nombre: 'Procedimiento Administrativo', estado: 'nuevo', progreso: 0 },
    { id: 11, nombre: 'LPACAP', estado: 'nuevo', progreso: 0 },
  ];

  const tabs = [
    { id: 'fortaleza-bars', label: 'Fortaleza + Barras' },
    { id: 'session-progress', label: 'Sesión + Circular' },
    { id: 'fortaleza-grid', label: 'Fortaleza Grid' },
    { id: 'expandable', label: 'Cards Expandibles' },
  ];

  return (
    <div className="fixed inset-0 z-[200] bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50 overflow-y-auto">
      {/* Header */}
      <motion.header
        className="sticky top-0 bg-white/90 backdrop-blur-lg border-b border-gray-100 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={spring.gentle}
      >
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100"
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </motion.button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Draft Features</h1>
              <p className="text-xs text-gray-500">Integraciones preliminares</p>
            </div>
          </div>
          <motion.div
            className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🚧 Preview
          </motion.div>
        </div>
      </motion.header>

      {/* Tabs */}
      <div className="sticky top-[65px] bg-white/90 backdrop-blur-lg border-b border-gray-100 z-40">
        <div className="max-w-lg mx-auto px-4 py-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap text-sm
                  ${activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600'}`}
                whileTap={{ scale: 0.97 }}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 py-6 pb-24">
        <AnimatePresence mode="wait">
          {activeTab === 'fortaleza-bars' && (
            <motion.div
              key="fortaleza-bars"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
                <strong>Cambio:</strong> Reemplaza los puntos por barras de progreso animadas.
                El color indica el estado (ámbar = necesita repaso).
              </div>
              <FortalezaWithBars temas={demoTemas} maxVisible={6} />
            </motion.div>
          )}

          {activeTab === 'session-progress' && (
            <motion.div
              key="session-progress"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-sm text-purple-800">
                <strong>Nuevo:</strong> Icono de progreso circular clickeable que abre
                modal con detalles de todas las áreas.
              </div>
              <SessionCardWithProgress onStartSession={() => console.log('Start session')} />
            </motion.div>
          )}

          {activeTab === 'fortaleza-grid' && (
            <motion.div
              key="fortaleza-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm text-emerald-800">
                <strong>Alternativa:</strong> Vista compacta en grid con iconos.
                Ideal para ver todos los temas de un vistazo.
              </div>
              <FortalezaGrid temas={demoTemas} />
            </motion.div>
          )}

          {activeTab === 'expandable' && (
            <motion.div
              key="expandable"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800">
                <strong>Sugerencias de uso:</strong>
                <ul className="mt-2 space-y-1 text-xs">
                  <li>• Estadísticas en página de inicio</li>
                  <li>• Detalles de temas débiles</li>
                  <li>• Logros y achievements</li>
                  <li>• FAQ en configuración</li>
                  <li>• Explicaciones de preguntas</li>
                </ul>
              </div>
              <ExpandableCardsDemo />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 p-4">
        <div className="max-w-lg mx-auto flex gap-3">
          <motion.button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl"
            whileTap={{ scale: 0.98 }}
          >
            Volver
          </motion.button>
          <motion.button
            className="flex-1 py-3 bg-purple-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Check className="w-5 h-5" /> Aprobar Feature
          </motion.button>
        </div>
      </div>
    </div>
  );
}
