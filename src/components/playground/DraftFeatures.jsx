/**
 * DraftFeatures - Preliminary Integrations
 *
 * Features ready for review before integration into main app:
 * 1. Fortaleza with animated progress bars (replaces dots)
 * 2. Circular progress with interactive modal
 * 3. Enhanced Fortaleza with new layout
 * 4. Expandable cards demo
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, Reorder, useMotionValue, useTransform } from 'framer-motion';
import {
  ArrowLeft, Check, X, ChevronRight, ChevronDown, ChevronUp, ChevronLeft,
  BookOpen, Target, Flame, Trophy, Clock, TrendingUp,
  Zap, Star, AlertTriangle, Plus, Eye, Calendar,
  BarChart3, Award, Brain, Sparkles, GripVertical,
  Users, Medal, Percent, Activity, PieChart, ArrowUpRight,
  Settings, HelpCircle, Info, Instagram, Mail, Bell, Shield, FileText
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

function FortalezaWithBars({ temas, onVerTodo, onTemaClick, maxVisible = 3 }) {
  // Sort by priority (riesgo first, then by progress)
  const sortedTemas = [...temas].sort((a, b) => {
    const configA = estadoConfig[a.estado] || estadoConfig.nuevo;
    const configB = estadoConfig[b.estado] || estadoConfig.nuevo;
    if (configA.priority !== configB.priority) return configA.priority - configB.priority;
    return b.progreso - a.progreso;
  });

  const visibleTemas = sortedTemas.slice(0, maxVisible);
  const hasMore = temas.length > maxVisible;

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
      </div>

      {/* Temas with animated bars - CLICKEABLE */}
      <div className="px-4 py-2">
        {visibleTemas.map((tema, index) => {
          const config = estadoConfig[tema.estado] || estadoConfig.nuevo;
          const Icon = config.icon;

          return (
            <motion.button
              key={tema.id}
              onClick={() => onTemaClick?.(tema)}
              className="w-full py-3 border-b border-gray-50 last:border-b-0 text-left"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...spring.gentle, delay: index * 0.05 }}
              whileHover={{ x: 4, backgroundColor: 'rgba(147, 51, 234, 0.02)' }}
              whileTap={{ scale: 0.99 }}
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
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bg} ${config.text} whitespace-nowrap`}>
                    {tema.progreso}%
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              </div>

              {/* Progress bar */}
              <AnimatedProgressBar value={tema.progreso} estado={tema.estado} size="md" />
            </motion.button>
          );
        })}
      </div>

      {/* Show more - sin número */}
      {hasMore && (
        <motion.button
          onClick={onVerTodo}
          className="w-full px-4 py-3 text-sm text-purple-600 font-medium hover:bg-purple-50/50 transition-colors border-t border-gray-100 flex items-center justify-center gap-1"
          whileHover={{ backgroundColor: 'rgba(147, 51, 234, 0.05)' }}
          whileTap={{ scale: 0.98 }}
        >
          Ver más temas <ChevronRight className="w-4 h-4" />
        </motion.button>
      )}

      {/* Legend */}
      <div className="px-4 py-2.5 bg-gray-50/50 border-t border-gray-100 flex flex-wrap gap-3 justify-center">
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
// STAT CARDS
// ============================================

function StatCard({ icon: Icon, label, value, color = 'purple', trend }) {
  const colors = {
    purple: 'from-purple-500 to-violet-600',
    emerald: 'from-emerald-500 to-teal-600',
    amber: 'from-amber-500 to-orange-600',
    pink: 'from-pink-500 to-rose-600',
  };

  return (
    <motion.div
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
      whileHover={{ y: -4 }}
      transition={spring.snappy}
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
            className={`text-xs font-medium ${trend > 0 ? 'text-emerald-500' : 'text-amber-500'}`}
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
// SWIPEABLE TEMA ITEM - Swipe to reveal actions
// ============================================

function SwipeableTemaItem({ tema, onAction, onDragEnd }) {
  const x = useMotionValue(0);
  const config = estadoConfig[tema.estado] || estadoConfig.nuevo;
  const Icon = config.icon;

  // Transform for background reveal
  const actionOpacity = useTransform(x, [-100, -50, 0], [1, 0.5, 0]);
  const actionScale = useTransform(x, [-100, -50, 0], [1, 0.8, 0.5]);

  const handleDragEnd = (event, info) => {
    if (info.offset.x < -80) {
      onAction?.(tema);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl mb-2">
      {/* Action revealed on swipe */}
      <motion.div
        className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-purple-500 to-purple-600 flex items-center justify-end pr-4"
        style={{ opacity: actionOpacity }}
      >
        <motion.div style={{ scale: actionScale }}>
          <Target className="w-6 h-6 text-white" />
        </motion.div>
      </motion.div>

      {/* Draggable item */}
      <motion.div
        className="bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-3 cursor-grab active:cursor-grabbing relative"
        drag="x"
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.1}
        style={{ x }}
        onDragEnd={handleDragEnd}
        whileTap={{ scale: 0.98 }}
      >
        {/* Drag handle */}
        <div className="text-gray-300 touch-none">
          <GripVertical className="w-5 h-5" />
        </div>

        {/* Icon */}
        <motion.div
          className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}
          animate={config.pulse ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Icon className={`w-5 h-5 ${config.text}`} />
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">
            <span className="text-gray-400">T{tema.id}</span> {tema.nombre}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${config.gradient}`}
                initial={{ width: 0 }}
                animate={{ width: `${tema.progreso}%` }}
                transition={spring.smooth}
              />
            </div>
            <span className={`text-xs font-medium ${config.text}`}>{tema.progreso}%</span>
          </div>
        </div>

        {/* Swipe hint */}
        <ChevronRight className="w-4 h-4 text-gray-300" />
      </motion.div>
    </div>
  );
}

// ============================================
// FORTALEZA WITH REORDER + SWIPE
// ============================================

function FortalezaInteractive({ temas: initialTemas, onVerTodos, onTemaAction, maxVisible = 3 }) {
  const [temas, setTemas] = useState(initialTemas.slice(0, maxVisible));
  const hasMore = initialTemas.length > maxVisible;

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
        <span className="text-xs text-gray-400">Arrastra para reordenar</span>
      </div>

      {/* Reorderable list */}
      <div className="p-3">
        <Reorder.Group axis="y" values={temas} onReorder={setTemas} className="space-y-0">
          {temas.map((tema) => (
            <Reorder.Item key={tema.id} value={tema}>
              <SwipeableTemaItem
                tema={tema}
                onAction={onTemaAction}
              />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>

      {/* Ver más */}
      {hasMore && (
        <motion.button
          onClick={onVerTodos}
          className="w-full px-4 py-3 text-sm text-purple-600 font-medium hover:bg-purple-50/50 transition-colors border-t border-gray-100 flex items-center justify-center gap-1"
          whileTap={{ scale: 0.98 }}
        >
          Ver todos los temas <ChevronRight className="w-4 h-4" />
        </motion.button>
      )}

      {/* Legend + hint */}
      <div className="px-4 py-2.5 bg-gray-50/50 border-t border-gray-100">
        <div className="flex flex-wrap gap-3 justify-center mb-2">
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
        <p className="text-[10px] text-gray-400 text-center">← Desliza para practicar</p>
      </div>
    </motion.div>
  );
}

// ============================================
// ALL TEMAS VIEW - Full screen modal
// ============================================

function AllTemasModal({ isOpen, onClose, temas, onTemaAction }) {
  if (!isOpen) return null;

  // Group by estado
  const grouped = {
    riesgo: temas.filter(t => t.estado === 'riesgo'),
    progreso: temas.filter(t => t.estado === 'progreso' || t.estado === 'avanzando'),
    dominado: temas.filter(t => t.estado === 'dominado'),
    nuevo: temas.filter(t => t.estado === 'nuevo'),
  };

  return (
    <motion.div
      className="fixed inset-0 z-[250] bg-white overflow-y-auto"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
    >
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-lg border-b border-gray-100 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <motion.button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100"
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </motion.button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Todos los Temas</h1>
            <p className="text-xs text-gray-500">{temas.length} temas · Toca para practicar</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-4 pb-24 space-y-6">
        {/* Necesitan repaso */}
        {grouped.riesgo.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-amber-600 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Necesitan repaso
            </h3>
            <div className="space-y-2">
              {grouped.riesgo.map(tema => (
                <TemaListItem key={tema.id} tema={tema} onAction={onTemaAction} />
              ))}
            </div>
          </div>
        )}

        {/* En progreso */}
        {grouped.progreso.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-purple-600 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> En progreso
            </h3>
            <div className="space-y-2">
              {grouped.progreso.map(tema => (
                <TemaListItem key={tema.id} tema={tema} onAction={onTemaAction} />
              ))}
            </div>
          </div>
        )}

        {/* Dominados */}
        {grouped.dominado.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-emerald-600 mb-2 flex items-center gap-2">
              <Check className="w-4 h-4" /> Dominados
            </h3>
            <div className="space-y-2">
              {grouped.dominado.map(tema => (
                <TemaListItem key={tema.id} tema={tema} onAction={onTemaAction} />
              ))}
            </div>
          </div>
        )}

        {/* Nuevos */}
        {grouped.nuevo.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Sin empezar
            </h3>
            <div className="space-y-2">
              {grouped.nuevo.map(tema => (
                <TemaListItem key={tema.id} tema={tema} onAction={onTemaAction} />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function TemaListItem({ tema, onAction }) {
  const config = estadoConfig[tema.estado] || estadoConfig.nuevo;
  const Icon = config.icon;

  return (
    <motion.button
      onClick={() => onAction?.(tema)}
      className="w-full bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-3 text-left"
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${config.text}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800">
          <span className="text-gray-400">T{tema.id}</span> {tema.nombre}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[120px]">
            <div className={`h-full bg-gradient-to-r ${config.gradient}`} style={{ width: `${tema.progreso}%` }} />
          </div>
          <span className="text-xs text-gray-500">{tema.progreso}%</span>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300" />
    </motion.button>
  );
}

// ============================================
// INTERACTIVE STAT CARDS WITH MODALS
// ============================================

function InteractiveStatCard({ icon: Icon, label, value, color = 'purple', trend, onClick, badge }) {
  const colors = {
    purple: 'from-purple-500 to-violet-600',
    emerald: 'from-emerald-500 to-teal-600',
    amber: 'from-amber-500 to-orange-600',
    pink: 'from-pink-500 to-rose-600',
  };

  return (
    <motion.button
      onClick={onClick}
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left relative overflow-hidden"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={spring.snappy}
    >
      {badge && (
        <span className="absolute top-2 right-2 px-2 py-0.5 bg-purple-100 text-purple-600 text-[10px] font-medium rounded-full">
          {badge}
        </span>
      )}
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-sm text-gray-500">{label}</p>
      <div className="flex items-end gap-2">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {trend && (
          <span className={`text-xs font-medium ${trend > 0 ? 'text-emerald-500' : 'text-amber-500'} flex items-center`}>
            <ArrowUpRight className="w-3 h-3" />
            {trend}%
          </span>
        )}
      </div>
      <div className="mt-2 flex items-center gap-1 text-xs text-purple-500">
        <span>Ver detalles</span>
        <ChevronRight className="w-3 h-3" />
      </div>
    </motion.button>
  );
}

// Precision Analysis Modal
function PrecisionModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const data = [
    { tema: 'Constitución', precision: 92, total: 45 },
    { tema: 'Derechos Fund.', precision: 85, total: 32 },
    { tema: 'Cortes Gen.', precision: 78, total: 28 },
    { tema: 'La Corona', precision: 62, total: 18 },
    { tema: 'Gobierno', precision: 55, total: 12 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-[300]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
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
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Tu Precisión</h3>
                  <p className="text-xs text-gray-500">Análisis por tema</p>
                </div>
              </div>
              <motion.button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100" whileTap={{ scale: 0.95 }}>
                <X className="w-5 h-5 text-gray-400" />
              </motion.button>
            </div>

            {/* Main stat */}
            <div className="px-5 py-4 bg-gradient-to-br from-purple-50 to-violet-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-purple-600">87%</p>
                  <p className="text-sm text-purple-500">Precisión global</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-700">135</p>
                  <p className="text-xs text-gray-500">preguntas respondidas</p>
                </div>
              </div>
            </div>

            {/* Per tema breakdown */}
            <div className="px-5 py-4 space-y-3 max-h-[200px] overflow-y-auto">
              {data.map((item, i) => (
                <motion.div
                  key={item.tema}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{item.tema}</span>
                      <span className={`font-medium ${item.precision >= 80 ? 'text-emerald-600' : item.precision >= 60 ? 'text-amber-600' : 'text-red-500'}`}>
                        {item.precision}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${item.precision >= 80 ? 'bg-emerald-500' : item.precision >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.precision}%` }}
                        transition={{ ...spring.smooth, delay: 0.2 + i * 0.05 }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 w-12 text-right">{item.total} preg.</span>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
              <motion.button
                onClick={onClose}
                className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Mejorar puntos débiles
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Racha (Streak) Modal
function RachaModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const streakHistory = [
    { day: 'Lun', completed: true },
    { day: 'Mar', completed: true },
    { day: 'Mié', completed: true },
    { day: 'Jue', completed: true },
    { day: 'Vie', completed: true },
    { day: 'Sáb', completed: true },
    { day: 'Dom', completed: true },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-[300]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
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
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Tu Racha</h3>
                  <p className="text-xs text-gray-500">Días consecutivos estudiando</p>
                </div>
              </div>
              <motion.button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100" whileTap={{ scale: 0.95 }}>
                <X className="w-5 h-5 text-gray-400" />
              </motion.button>
            </div>

            {/* Main stat */}
            <div className="px-5 py-6 bg-gradient-to-br from-amber-50 to-orange-50 text-center">
              <motion.div
                className="w-24 h-24 mx-auto bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mb-3"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={spring.bouncy}
              >
                <div className="text-center">
                  <span className="text-3xl font-bold text-white">7</span>
                  <Flame className="w-5 h-5 text-white/80 mx-auto -mt-1" />
                </div>
              </motion.div>
              <p className="text-lg font-semibold text-gray-800">¡Racha de fuego!</p>
              <p className="text-sm text-gray-500">Tu mejor racha: 14 días</p>
            </div>

            {/* Week view */}
            <div className="px-5 py-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Esta semana
              </h4>
              <div className="flex justify-between">
                {streakHistory.map((day, i) => (
                  <motion.div
                    key={day.day}
                    className="flex flex-col items-center gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <motion.div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        day.completed
                          ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                          : 'bg-gray-100'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ ...spring.bouncy, delay: 0.2 + i * 0.05 }}
                    >
                      {day.completed && <Check className="w-5 h-5 text-white" />}
                    </motion.div>
                    <span className="text-xs text-gray-500">{day.day}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Rewards */}
            <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl mb-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-amber-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Próxima recompensa</p>
                  <p className="text-xs text-gray-500">3 días más para desbloquear insignia</p>
                </div>
                <span className="text-xs font-bold text-amber-600">+50 XP</span>
              </div>

              <motion.button
                onClick={onClose}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ¡Mantén la racha! 🔥
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Level Comparison Modal
function LevelModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-[300]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
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
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Tu Nivel</h3>
                  <p className="text-xs text-gray-500">Comparación con otros</p>
                </div>
              </div>
              <motion.button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100" whileTap={{ scale: 0.95 }}>
                <X className="w-5 h-5 text-gray-400" />
              </motion.button>
            </div>

            {/* Level display */}
            <div className="px-5 py-6 bg-gradient-to-br from-pink-50 to-rose-50 text-center">
              <motion.div
                className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center mb-3"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={spring.bouncy}
              >
                <span className="text-3xl font-bold text-white">12</span>
              </motion.div>
              <p className="text-lg font-semibold text-gray-800">Nivel Avanzado</p>
              <p className="text-sm text-gray-500">1,250 XP para nivel 13</p>
            </div>

            {/* Comparison */}
            <div className="px-5 py-4 space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Users className="w-4 h-4" /> Comparación con la comunidad
              </h4>

              {/* Position */}
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-purple-600">Top 15%</p>
                <p className="text-sm text-purple-500">Estás por encima del 85% de usuarios</p>
              </div>

              {/* Stats comparison */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Tu precisión</p>
                  <p className="text-xl font-bold text-emerald-600">87%</p>
                  <p className="text-xs text-emerald-500">+12% vs media</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Tu racha</p>
                  <p className="text-xl font-bold text-amber-600">7 días</p>
                  <p className="text-xs text-amber-500">+4 vs media</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
              <motion.button
                onClick={onClose}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold rounded-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ¡Sigue así! 🎉
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================
// AWARD-WINNING: SWIPEABLE FOCUS MODE
// Horizontal swipe between Focus card and Fortaleza
// ============================================

function FocusModeSwipeable({
  temas,
  onStartSession,
  onTemaAction,
  onVerTodos,
  onRachaClick,
  onPrecisionClick,
  onLevelClick
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const containerRef = useRef(null);
  const x = useMotionValue(0);

  const nextTema = temas.find(t => t.estado === 'riesgo') || temas.find(t => t.estado === 'progreso') || temas[0];
  const config = estadoConfig[nextTema?.estado] || estadoConfig.nuevo;

  // Handle drag end to snap to page
  const handleDragEnd = (event, info) => {
    const threshold = 50;
    if (info.offset.x < -threshold && currentPage === 0) {
      setCurrentPage(1);
    } else if (info.offset.x > threshold && currentPage === 1) {
      setCurrentPage(0);
    }
  };

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Page indicators */}
      <div className="flex justify-center gap-2 mb-2">
        <motion.button
          onClick={() => setCurrentPage(0)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            currentPage === 0
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-500'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          Tu Enfoque
        </motion.button>
        <motion.button
          onClick={() => setCurrentPage(1)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            currentPage === 1
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-500'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          Tu Fortaleza
        </motion.button>
      </div>

      {/* Swipeable container */}
      <div className="relative overflow-hidden rounded-3xl" ref={containerRef}>
        <motion.div
          className="flex"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          animate={{ x: currentPage === 0 ? 0 : '-100%' }}
          transition={spring.snappy}
          style={{ x }}
        >
          {/* Page 1: Focus Card */}
          <motion.div
            className="w-full flex-shrink-0 px-1"
            style={{ minWidth: '100%' }}
          >
            <motion.div
              className="bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 rounded-3xl p-6 text-white relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative">
                <p className="text-purple-200 text-sm mb-2">Tu enfoque de hoy</p>
                <h2 className="text-2xl font-bold mb-1">T{nextTema?.id} {nextTema?.nombre}</h2>
                <p className="text-purple-200 text-sm mb-4">{config.label} · {nextTema?.progreso}% completado</p>

                {/* Progress ring */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
                      <motion.circle
                        cx="32" cy="32" r="28" fill="none" stroke="white" strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={175.9}
                        initial={{ strokeDashoffset: 175.9 }}
                        animate={{ strokeDashoffset: 175.9 - (175.9 * (nextTema?.progreso || 0) / 100) }}
                        transition={spring.smooth}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">{nextTema?.progreso}%</span>
                  </div>
                  <div>
                    <p className="font-medium">15 preguntas restantes</p>
                    <p className="text-sm text-purple-200">~10 min estimado</p>
                  </div>
                </div>

                <motion.button
                  onClick={onStartSession}
                  className="w-full py-4 bg-white text-purple-600 font-bold rounded-2xl flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Zap className="w-5 h-5" />
                  Empezar sesión enfocada
                </motion.button>
              </div>

              {/* Swipe hint */}
              <motion.div
                className="absolute bottom-2 right-4 text-purple-200/50 text-xs flex items-center gap-1"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span>Desliza</span>
                <ChevronRight className="w-3 h-3" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Page 2: Fortaleza - Compact version using same design as Interactivo */}
          <motion.div
            className="w-full flex-shrink-0 px-1"
            style={{ minWidth: '100%' }}
          >
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
              </div>

              {/* Tema rows - only 2 visible */}
              <div className="p-3 space-y-2">
                {temas.slice(0, 2).map((tema, i) => {
                  const temaConfig = estadoConfig[tema.estado] || estadoConfig.nuevo;
                  const TemaIcon = temaConfig.icon;
                  return (
                    <motion.button
                      key={tema.id}
                      onClick={() => onTemaAction?.(tema)}
                      className="w-full bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-3 text-left"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div
                        className={`w-10 h-10 rounded-xl ${temaConfig.bg} flex items-center justify-center flex-shrink-0`}
                        animate={temaConfig.pulse ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <TemaIcon className={`w-5 h-5 ${temaConfig.text}`} />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          <span className="text-gray-400">T{tema.id}</span> {tema.nombre}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full bg-gradient-to-r ${temaConfig.gradient}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${tema.progreso}%` }}
                              transition={spring.smooth}
                            />
                          </div>
                          <span className={`text-xs font-medium ${temaConfig.text}`}>{tema.progreso}%</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </motion.button>
                  );
                })}
              </div>

              {/* Ver todos */}
              <motion.button
                onClick={onVerTodos}
                className="w-full px-4 py-3 text-sm text-purple-600 font-medium hover:bg-purple-50/50 transition-colors border-t border-gray-100 flex items-center justify-center gap-1"
                whileTap={{ scale: 0.98 }}
              >
                Ver todos los temas <ChevronRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Interactive Stats - Clean design like original */}
      <div className="grid grid-cols-3 gap-3">
        <motion.button
          onClick={onRachaClick}
          className="bg-white rounded-2xl p-4 text-center border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Flame className="w-6 h-6 text-amber-500 mx-auto mb-2" />
          <p className="text-xl font-bold text-gray-900">7</p>
          <p className="text-xs text-gray-500">Racha</p>
        </motion.button>

        <motion.button
          onClick={onPrecisionClick}
          className="bg-white rounded-2xl p-4 text-center border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Target className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <p className="text-xl font-bold text-gray-900">87%</p>
          <p className="text-xs text-gray-500">Precisión</p>
        </motion.button>

        <motion.button
          onClick={onLevelClick}
          className="bg-white rounded-2xl p-4 text-center border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Trophy className="w-6 h-6 text-pink-500 mx-auto mb-2" />
          <p className="text-xl font-bold text-gray-900">12</p>
          <p className="text-xs text-gray-500">Nivel</p>
        </motion.button>
      </div>

      {/* Today's goals - condensed */}
      <motion.div
        className="bg-white rounded-2xl p-4 border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" />
            Objetivos de hoy
          </h3>
          <span className="text-xs text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">1/3</span>
        </div>
        <div className="flex gap-2">
          {[
            { label: '15 preguntas', done: false, icon: Target },
            { label: 'Racha', done: true, icon: Flame },
            { label: 'Repaso', done: false, icon: BookOpen },
          ].map((goal, i) => {
            const GoalIcon = goal.icon;
            return (
              <div
                key={i}
                className={`flex-1 p-2 rounded-xl text-center ${
                  goal.done ? 'bg-emerald-50' : 'bg-gray-50'
                }`}
              >
                <GoalIcon className={`w-4 h-4 mx-auto mb-1 ${
                  goal.done ? 'text-emerald-500' : 'text-gray-400'
                }`} />
                <p className={`text-xs ${goal.done ? 'text-emerald-600 font-medium' : 'text-gray-500'}`}>
                  {goal.done ? '✓' : goal.label}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Legacy FocusModeView kept for reference (can be removed)
function FocusModeView({ temas, onStartSession }) {
  const nextTema = temas.find(t => t.estado === 'riesgo') || temas.find(t => t.estado === 'progreso') || temas[0];
  const config = estadoConfig[nextTema?.estado] || estadoConfig.nuevo;

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Hero card - What to focus on */}
      <motion.div
        className="bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 rounded-3xl p-6 text-white relative overflow-hidden"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          <p className="text-purple-200 text-sm mb-2">Tu enfoque de hoy</p>
          <h2 className="text-2xl font-bold mb-1">T{nextTema?.id} {nextTema?.nombre}</h2>
          <p className="text-purple-200 text-sm mb-4">{config.label} · {nextTema?.progreso}% completado</p>

          {/* Progress ring */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
                <motion.circle
                  cx="32" cy="32" r="28" fill="none" stroke="white" strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={175.9}
                  initial={{ strokeDashoffset: 175.9 }}
                  animate={{ strokeDashoffset: 175.9 - (175.9 * (nextTema?.progreso || 0) / 100) }}
                  transition={spring.smooth}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">{nextTema?.progreso}%</span>
            </div>
            <div>
              <p className="font-medium">15 preguntas restantes</p>
              <p className="text-sm text-purple-200">~10 min estimado</p>
            </div>
          </div>

          <motion.button
            onClick={onStartSession}
            className="w-full py-4 bg-white text-purple-600 font-bold rounded-2xl flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Zap className="w-5 h-5" />
            Empezar sesión enfocada
          </motion.button>
        </div>
      </motion.div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div
          className="bg-white rounded-2xl p-4 text-center border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Flame className="w-6 h-6 text-amber-500 mx-auto mb-2" />
          <p className="text-xl font-bold text-gray-900">7</p>
          <p className="text-xs text-gray-500">Racha</p>
        </motion.div>
        <motion.div
          className="bg-white rounded-2xl p-4 text-center border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Target className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <p className="text-xl font-bold text-gray-900">87%</p>
          <p className="text-xs text-gray-500">Precisión</p>
        </motion.div>
        <motion.div
          className="bg-white rounded-2xl p-4 text-center border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Trophy className="w-6 h-6 text-pink-500 mx-auto mb-2" />
          <p className="text-xl font-bold text-gray-900">12</p>
          <p className="text-xs text-gray-500">Nivel</p>
        </motion.div>
      </div>

      {/* Today's goals */}
      <motion.div
        className="bg-white rounded-2xl p-4 border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500" />
          Objetivos de hoy
        </h3>
        <div className="space-y-3">
          {[
            { label: 'Completar 15 preguntas', done: false, progress: 40 },
            { label: 'Mantener racha', done: true, progress: 100 },
            { label: 'Repasar tema débil', done: false, progress: 0 },
          ].map((goal, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${goal.done ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                {goal.done ? <Check className="w-4 h-4 text-emerald-600" /> : <span className="w-2 h-2 rounded-full bg-gray-300" />}
              </div>
              <div className="flex-1">
                <p className={`text-sm ${goal.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{goal.label}</p>
                {!goal.done && goal.progress > 0 && (
                  <div className="h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${goal.progress}%` }} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// AWARD-WINNING OPTION 2: DASHBOARD CARDS
// ============================================

function DashboardView({ temas, onTemaAction, onStartSession }) {
  const urgentTemas = temas.filter(t => t.estado === 'riesgo');

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Greeting + Quick action */}
      <motion.div
        className="bg-white rounded-2xl p-5 border border-gray-100"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-gray-500 text-sm">Buenos días 👋</p>
            <h2 className="text-xl font-bold text-gray-900">¿Listo para estudiar?</h2>
          </div>
          <div className="flex items-center gap-1 bg-amber-100 px-3 py-1.5 rounded-full">
            <Flame className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-amber-600">7</span>
          </div>
        </div>

        <motion.button
          onClick={onStartSession}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-violet-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Zap className="w-5 h-5" />
          Sesión inteligente · 15 min
        </motion.button>
      </motion.div>

      {/* Urgent attention card */}
      {urgentTemas.length > 0 && (
        <motion.div
          className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold text-amber-800">Necesitan atención</h3>
          </div>
          <div className="space-y-2">
            {urgentTemas.slice(0, 2).map(tema => (
              <motion.button
                key={tema.id}
                onClick={() => onTemaAction?.(tema)}
                className="w-full bg-white/80 backdrop-blur rounded-xl p-3 flex items-center gap-3 text-left"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <span className="font-bold text-amber-600">T{tema.id}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{tema.nombre}</p>
                  <p className="text-xs text-amber-600">{tema.progreso}% · Repasar hoy</p>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Stats bento grid */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          className="bg-white rounded-2xl p-4 border border-gray-100 col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Progreso semanal</h3>
            <span className="text-xs text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
          </div>
          <div className="flex items-end gap-1 h-16">
            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
              <motion.div
                key={i}
                className={`flex-1 rounded-t ${i === 6 ? 'bg-purple-500' : 'bg-purple-200'}`}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 0.3 + i * 0.05 }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span><span className="text-purple-600 font-medium">D</span>
          </div>
        </motion.div>

        <motion.button
          className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-4 text-white text-left"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Target className="w-6 h-6 mb-2" />
          <p className="text-2xl font-bold">87%</p>
          <p className="text-sm text-purple-200">Precisión</p>
        </motion.button>

        <motion.button
          className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-4 text-white text-left"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Trophy className="w-6 h-6 mb-2" />
          <p className="text-2xl font-bold">Nivel 12</p>
          <p className="text-sm text-pink-200">Top 15%</p>
        </motion.button>
      </div>

      {/* Quick topics */}
      <motion.div
        className="bg-white rounded-2xl p-4 border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="font-semibold text-gray-900 mb-3">Continúa estudiando</h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {temas.filter(t => t.estado !== 'nuevo').slice(0, 4).map(tema => {
            const config = estadoConfig[tema.estado];
            return (
              <motion.button
                key={tema.id}
                onClick={() => onTemaAction?.(tema)}
                className={`flex-shrink-0 ${config.bg} rounded-xl p-3 min-w-[120px]`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <p className="text-xs text-gray-500 mb-1">Tema {tema.id}</p>
                <p className={`text-sm font-medium ${config.text} truncate`}>{tema.nombre.split(' ')[0]}</p>
                <p className="text-lg font-bold text-gray-800 mt-1">{tema.progreso}%</p>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// TEMA OPTIONS MODAL - When clicking a topic
// ============================================

function TemaOptionsModal({ isOpen, onClose, tema }) {
  if (!isOpen || !tema) return null;

  const config = estadoConfig[tema.estado] || estadoConfig.nuevo;
  const Icon = config.icon;

  const options = [
    { id: 'test', icon: Target, label: 'Test rápido', desc: '10 preguntas aleatorias', color: 'purple' },
    { id: 'exam', icon: Clock, label: 'Simulacro', desc: 'Examen completo cronometrado', color: 'blue' },
    { id: 'review', icon: BookOpen, label: 'Repasar teoría', desc: 'Material de estudio', color: 'emerald' },
    { id: 'weak', icon: AlertTriangle, label: 'Puntos débiles', desc: 'Preguntas falladas', color: 'amber' },
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
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${config.bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${config.text}`} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400">Tema {tema.id}</p>
                  <h3 className="font-bold text-gray-900">{tema.nombre}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${config.gradient}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${tema.progreso}%` }}
                        transition={spring.smooth}
                      />
                    </div>
                    <span className={`text-xs font-medium ${config.text}`}>{tema.progreso}%</span>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-gray-100"
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>
            </div>

            {/* Options */}
            <div className="p-4 space-y-2">
              {options.map((option, i) => {
                const OptIcon = option.icon;
                const colorStyles = {
                  purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
                  blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
                  emerald: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
                  amber: 'bg-amber-50 text-amber-600 hover:bg-amber-100',
                };

                return (
                  <motion.button
                    key={option.id}
                    className={`w-full p-4 rounded-xl flex items-center gap-3 text-left transition-colors ${colorStyles[option.color]}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...spring.gentle, delay: i * 0.05 }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      console.log(`Selected: ${option.id} for tema ${tema.id}`);
                      onClose();
                    }}
                  >
                    <OptIcon className="w-5 h-5" />
                    <div className="flex-1">
                      <p className="font-medium">{option.label}</p>
                      <p className="text-xs opacity-70">{option.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </motion.button>
                );
              })}
            </div>

            {/* Cancel */}
            <div className="px-4 pb-4">
              <motion.button
                onClick={onClose}
                className="w-full py-3 text-gray-500 font-medium text-sm"
                whileTap={{ scale: 0.98 }}
              >
                Cancelar
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================
// FULL HOME PAGE - Complete home with all elements
// ============================================

function FullHomePage({
  temas,
  onStartSession,
  onTemaAction,
  onVerTodos,
  onRachaClick,
  onPrecisionClick,
  onLevelClick,
  onSettingsClick,
  onShowProgress
}) {
  const nextTema = temas.find(t => t.estado === 'riesgo') || temas.find(t => t.estado === 'progreso') || temas[0];
  const config = estadoConfig[nextTema?.estado] || estadoConfig.nuevo;
  const [currentPage, setCurrentPage] = useState(0);

  // Demo data
  const dailyProgressPercent = 40;
  const todayQuestions = 6;
  const dailyGoal = 15;

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* TopBar simulation */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3">
        <div className="flex items-center justify-between">
          {/* Left - Progress circle */}
          <motion.button
            onClick={onShowProgress}
            className="relative w-10 h-10 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-9 h-9 transform -rotate-90">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#F3E8FF" strokeWidth="3" />
              <motion.circle
                cx="18" cy="18" r="14" fill="none" stroke="#8B5CF6" strokeWidth="3"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 88" }}
                animate={{ strokeDasharray: `${(dailyProgressPercent / 100) * 88} 88` }}
                transition={spring.smooth}
              />
            </svg>
            <span className="absolute text-[10px] font-bold text-purple-600">{dailyProgressPercent}</span>
          </motion.button>

          {/* Center - Title */}
          <h1 className="text-[15px] font-semibold text-gray-800 tracking-tight">Oposita Smart</h1>

          {/* Right - Settings */}
          <motion.button
            onClick={onSettingsClick}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-[18px] h-[18px] text-gray-500" />
          </motion.button>
        </div>
      </div>

      {/* Greeting area */}
      <div className="px-1">
        <p className="text-[13px] font-medium text-purple-500 mb-0.5 capitalize">
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <h2 className="text-[22px] font-bold text-gray-900 leading-tight mb-0.5">
          Tu progreso de hoy
        </h2>
        <p className="text-gray-400 text-sm">Continúa donde lo dejaste</p>
      </div>

      {/* Page indicators for swipe */}
      <div className="flex justify-center gap-2">
        <motion.button
          onClick={() => setCurrentPage(0)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            currentPage === 0 ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          Tu Enfoque
        </motion.button>
        <motion.button
          onClick={() => setCurrentPage(1)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            currentPage === 1 ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          Tu Fortaleza
        </motion.button>
      </div>

      {/* Swipeable content */}
      <div className="relative overflow-hidden rounded-3xl">
        <motion.div
          className="flex cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(event, info) => {
            const threshold = 50;
            if (info.offset.x < -threshold && currentPage === 0) {
              setCurrentPage(1);
            } else if (info.offset.x > threshold && currentPage === 1) {
              setCurrentPage(0);
            }
          }}
          animate={{ x: currentPage === 0 ? 0 : '-100%' }}
          transition={spring.snappy}
        >
          {/* Page 1: Focus */}
          <div className="w-full flex-shrink-0 px-1" style={{ minWidth: '100%' }}>
            <motion.div className="bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 rounded-3xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative">
                <p className="text-purple-200 text-sm mb-2">Tu enfoque de hoy</p>
                <h2 className="text-2xl font-bold mb-1">T{nextTema?.id} {nextTema?.nombre}</h2>
                <p className="text-purple-200 text-sm mb-4">{config.label} · {nextTema?.progreso}% completado</p>

                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
                      <motion.circle
                        cx="32" cy="32" r="28" fill="none" stroke="white" strokeWidth="6"
                        strokeLinecap="round" strokeDasharray={175.9}
                        initial={{ strokeDashoffset: 175.9 }}
                        animate={{ strokeDashoffset: 175.9 - (175.9 * (nextTema?.progreso || 0) / 100) }}
                        transition={spring.smooth}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">{nextTema?.progreso}%</span>
                  </div>
                  <div>
                    <p className="font-medium">15 preguntas restantes</p>
                    <p className="text-sm text-purple-200">~10 min estimado</p>
                  </div>
                </div>

                <motion.button
                  onClick={onStartSession}
                  className="w-full py-4 bg-white text-purple-600 font-bold rounded-2xl flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Zap className="w-5 h-5" />
                  Empezar sesión enfocada
                </motion.button>
              </div>

              <motion.div
                className="absolute bottom-2 right-4 text-purple-200/50 text-xs flex items-center gap-1"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span>Desliza</span>
                <ChevronRight className="w-3 h-3" />
              </motion.div>
            </motion.div>
          </div>

          {/* Page 2: Fortaleza compact */}
          <div className="w-full flex-shrink-0 px-1" style={{ minWidth: '100%' }}>
            <motion.div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏰</span>
                  <h3 className="font-semibold text-gray-900">Tu Fortaleza</h3>
                </div>
              </div>
              <div className="p-3 space-y-2">
                {temas.slice(0, 2).map((tema, i) => {
                  const temaConfig = estadoConfig[tema.estado] || estadoConfig.nuevo;
                  const TemaIcon = temaConfig.icon;
                  return (
                    <motion.button
                      key={tema.id}
                      onClick={() => onTemaAction?.(tema)}
                      className="w-full bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-3 text-left"
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`w-10 h-10 rounded-xl ${temaConfig.bg} flex items-center justify-center`}>
                        <TemaIcon className={`w-5 h-5 ${temaConfig.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          <span className="text-gray-400">T{tema.id}</span> {tema.nombre}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r ${temaConfig.gradient}`} style={{ width: `${tema.progreso}%` }} />
                          </div>
                          <span className={`text-xs font-medium ${temaConfig.text}`}>{tema.progreso}%</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </motion.button>
                  );
                })}
              </div>
              <motion.button
                onClick={onVerTodos}
                className="w-full px-4 py-3 text-sm text-purple-600 font-medium hover:bg-purple-50/50 transition-colors border-t border-gray-100 flex items-center justify-center gap-1"
                whileTap={{ scale: 0.98 }}
              >
                Ver todos los temas <ChevronRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <motion.button onClick={onRachaClick} className="bg-white rounded-2xl p-4 text-center border border-gray-100" whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
          <Flame className="w-6 h-6 text-amber-500 mx-auto mb-2" />
          <p className="text-xl font-bold text-gray-900">7</p>
          <p className="text-xs text-gray-500">Racha</p>
        </motion.button>
        <motion.button onClick={onPrecisionClick} className="bg-white rounded-2xl p-4 text-center border border-gray-100" whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
          <Target className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <p className="text-xl font-bold text-gray-900">87%</p>
          <p className="text-xs text-gray-500">Precisión</p>
        </motion.button>
        <motion.button onClick={onLevelClick} className="bg-white rounded-2xl p-4 text-center border border-gray-100" whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
          <Trophy className="w-6 h-6 text-pink-500 mx-auto mb-2" />
          <p className="text-xl font-bold text-gray-900">12</p>
          <p className="text-xs text-gray-500">Nivel</p>
        </motion.button>
      </div>

      {/* Today's goals */}
      <motion.div className="bg-white rounded-2xl p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" />
            Objetivos de hoy
          </h3>
          <span className="text-xs text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">1/3</span>
        </div>
        <div className="flex gap-2">
          {[
            { label: '15 preguntas', done: false, icon: Target },
            { label: 'Racha', done: true, icon: Flame },
            { label: 'Repaso', done: false, icon: BookOpen },
          ].map((goal, i) => {
            const GoalIcon = goal.icon;
            return (
              <div key={i} className={`flex-1 p-2 rounded-xl text-center ${goal.done ? 'bg-emerald-50' : 'bg-gray-50'}`}>
                <GoalIcon className={`w-4 h-4 mx-auto mb-1 ${goal.done ? 'text-emerald-500' : 'text-gray-400'}`} />
                <p className={`text-xs ${goal.done ? 'text-emerald-600 font-medium' : 'text-gray-500'}`}>
                  {goal.done ? '✓' : goal.label}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Footer links - FAQ, About, etc. */}
      <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
        <motion.button
          className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition"
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700">Acerca de</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300" />
        </motion.button>
        <motion.button
          className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition"
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700">FAQ</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300" />
        </motion.button>
        <motion.button
          className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition"
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3">
            <Instagram className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700">Síguenos</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300" />
        </motion.button>
        <motion.button
          className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition"
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700">Contacto</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300" />
        </motion.button>
      </div>

      {/* Legal links */}
      <div className="text-center space-y-2 py-4">
        <div className="flex justify-center gap-4 text-xs text-gray-400">
          <button className="hover:text-purple-600 transition">Privacidad</button>
          <span>·</span>
          <button className="hover:text-purple-600 transition">Términos</button>
          <span>·</span>
          <button className="hover:text-purple-600 transition">Legal</button>
        </div>
        <p className="text-xs text-gray-300">Oposita Smart v1.0 · Hecho con 💜</p>
      </div>
    </motion.div>
  );
}

// ============================================
// HOME ALTERNATIVE 1: ZEN MODE
// Inspirado en Headspace/Calm - Minimalista, un solo foco
// ============================================

function HomeZenMode({
  temas,
  onStartSession,
  onTemaAction,
  onVerTodos,
  onRachaClick,
  onPrecisionClick,
  onLevelClick,
  onSettingsClick,
  onShowProgress
}) {
  const nextTema = temas.find(t => t.estado === 'riesgo') || temas.find(t => t.estado === 'progreso') || temas[0];
  const config = estadoConfig[nextTema?.estado] || estadoConfig.nuevo;
  const dailyProgressPercent = 40;

  // Greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <motion.div
      className="min-h-[600px] flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Minimal TopBar - just essentials */}
      <div className="flex items-center justify-between py-2">
        <motion.button
          onClick={onShowProgress}
          className="relative w-11 h-11"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-11 h-11 transform -rotate-90">
            <circle cx="22" cy="22" r="18" fill="none" stroke="#F3E8FF" strokeWidth="3" />
            <motion.circle
              cx="22" cy="22" r="18" fill="none" stroke="#8B5CF6" strokeWidth="3"
              strokeLinecap="round"
              initial={{ strokeDasharray: "0 113" }}
              animate={{ strokeDasharray: `${(dailyProgressPercent / 100) * 113} 113` }}
              transition={spring.smooth}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-purple-600">{dailyProgressPercent}%</span>
        </motion.button>
        <motion.button
          onClick={onSettingsClick}
          className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-gray-100"
          whileTap={{ scale: 0.95 }}
        >
          <Settings className="w-5 h-5 text-gray-400" />
        </motion.button>
      </div>

      {/* Breathing space + Greeting */}
      <div className="flex-1 flex flex-col justify-center py-8">
        <motion.div
          className="text-center mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-purple-500 text-sm font-medium mb-1">{greeting}</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">¿Listo para estudiar?</h1>
          <p className="text-gray-400">Unos minutos al día, sin agobios</p>
        </motion.div>

        {/* Central Focus Card - The ONLY thing that matters */}
        <motion.div
          className="bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 rounded-[32px] p-8 text-white relative overflow-hidden mx-2"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, ...spring.gentle }}
        >
          {/* Subtle decorations */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />

          <div className="relative text-center">
            {/* Large progress ring */}
            <motion.div
              className="relative w-28 h-28 mx-auto mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, ...spring.bouncy }}
            >
              <svg className="w-28 h-28 transform -rotate-90">
                <circle cx="56" cy="56" r="48" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
                <motion.circle
                  cx="56" cy="56" r="48" fill="none" stroke="white" strokeWidth="8"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 302" }}
                  animate={{ strokeDasharray: `${(nextTema?.progreso / 100) * 302} 302` }}
                  transition={{ delay: 0.6, ...spring.smooth }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{nextTema?.progreso}%</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-purple-200 text-sm mb-1">Tu siguiente tema</p>
              <h2 className="text-xl font-bold mb-1">T{nextTema?.id}. {nextTema?.nombre}</h2>
              <p className="text-purple-200/80 text-sm mb-6">~10 min · 15 preguntas</p>
            </motion.div>

            <motion.button
              onClick={onStartSession}
              className="w-full py-4 bg-white text-purple-600 font-bold rounded-2xl text-lg shadow-lg shadow-purple-900/30"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Comenzar
            </motion.button>
          </div>
        </motion.div>

        {/* Minimal stats - subtle, not competing */}
        <motion.div
          className="flex justify-center gap-8 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button onClick={onRachaClick} className="text-center" whileTap={{ scale: 0.95 }}>
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Flame className="w-4 h-4 text-amber-500" />
              <span className="text-lg font-bold text-gray-800">7</span>
            </div>
            <p className="text-xs text-gray-400">días</p>
          </motion.button>
          <motion.button onClick={onPrecisionClick} className="text-center" whileTap={{ scale: 0.95 }}>
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Target className="w-4 h-4 text-purple-500" />
              <span className="text-lg font-bold text-gray-800">87%</span>
            </div>
            <p className="text-xs text-gray-400">precisión</p>
          </motion.button>
          <motion.button onClick={onLevelClick} className="text-center" whileTap={{ scale: 0.95 }}>
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Trophy className="w-4 h-4 text-pink-500" />
              <span className="text-lg font-bold text-gray-800">12</span>
            </div>
            <p className="text-xs text-gray-400">nivel</p>
          </motion.button>
        </motion.div>
      </div>

      {/* Bottom action - See all topics */}
      <motion.button
        onClick={onVerTodos}
        className="mx-2 mb-4 py-4 bg-gray-50 rounded-2xl text-gray-600 font-medium flex items-center justify-center gap-2"
        whileHover={{ backgroundColor: '#F3E8FF' }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <BookOpen className="w-5 h-5" />
        Ver todos los temas
      </motion.button>
    </motion.div>
  );
}

// ============================================
// HOME ALTERNATIVE 2: MOMENTUM
// Inspirado en Notion/Linear - Bento grid, datos claros
// ============================================

function HomeMomentum({
  temas,
  onStartSession,
  onTemaAction,
  onVerTodos,
  onRachaClick,
  onPrecisionClick,
  onLevelClick,
  onSettingsClick,
  onShowProgress
}) {
  const nextTema = temas.find(t => t.estado === 'riesgo') || temas.find(t => t.estado === 'progreso') || temas[0];
  const config = estadoConfig[nextTema?.estado] || estadoConfig.nuevo;
  const TemaIcon = config.icon;
  const dailyProgressPercent = 40;
  const weekProgress = [65, 80, 45, 90, 60, 0, 0]; // Mon-Sun

  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Compact header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-purple-500 font-medium uppercase tracking-wider">
            {new Date().toLocaleDateString('es-ES', { weekday: 'long' })}
          </p>
          <h1 className="text-xl font-bold text-gray-900">Tu Momentum</h1>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={onShowProgress}
            className="relative w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-sm font-bold text-purple-600">{dailyProgressPercent}%</span>
          </motion.button>
          <motion.button
            onClick={onSettingsClick}
            className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center"
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-4 h-4 text-gray-400" />
          </motion.button>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Large CTA card - spans 2 columns */}
        <motion.div
          className="col-span-2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-5 text-white relative overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

          <div className="flex items-start justify-between relative">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
                  <TemaIcon className={`w-4 h-4 ${config.text}`} />
                </div>
                <span className="text-xs text-gray-400 bg-white/10 px-2 py-0.5 rounded-full">{config.label}</span>
              </div>
              <h2 className="text-lg font-bold mb-1">T{nextTema?.id}. {nextTema?.nombre}</h2>
              <p className="text-sm text-gray-400 mb-4">15 preguntas · ~10 min</p>
              <motion.button
                onClick={onStartSession}
                className="px-5 py-2.5 bg-white text-gray-900 font-semibold rounded-xl text-sm flex items-center gap-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Zap className="w-4 h-4" /> Empezar ahora
              </motion.button>
            </div>
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                <motion.circle
                  cx="40" cy="40" r="34" fill="none" stroke="#8B5CF6" strokeWidth="6"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 214" }}
                  animate={{ strokeDasharray: `${(nextTema?.progreso / 100) * 214} 214` }}
                  transition={spring.smooth}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">{nextTema?.progreso}%</span>
            </div>
          </div>
        </motion.div>

        {/* Streak card */}
        <motion.button
          onClick={onRachaClick}
          className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 text-left border border-amber-100"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between mb-3">
            <Flame className="w-6 h-6 text-amber-500" />
            <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">🔥 En racha</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-0.5">7</p>
          <p className="text-xs text-gray-500">días consecutivos</p>
        </motion.button>

        {/* Precision card */}
        <motion.button
          onClick={onPrecisionClick}
          className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-4 text-left border border-purple-100"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between mb-3">
            <Target className="w-6 h-6 text-purple-500" />
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">↑ +5%</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-0.5">87%</p>
          <p className="text-xs text-gray-500">precisión media</p>
        </motion.button>

        {/* Weekly progress - spans 2 columns */}
        <motion.div
          className="col-span-2 bg-white rounded-2xl p-4 border border-gray-100"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 text-sm">Esta semana</h3>
            <span className="text-xs text-gray-400">45 preguntas</span>
          </div>
          <div className="flex items-end justify-between gap-1 h-16">
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  className="w-full bg-gray-100 rounded-t-sm overflow-hidden"
                  style={{ height: '48px' }}
                >
                  <motion.div
                    className={`w-full ${weekProgress[i] > 0 ? 'bg-purple-500' : 'bg-gray-200'} rounded-t-sm`}
                    initial={{ height: 0 }}
                    animate={{ height: `${weekProgress[i]}%` }}
                    transition={{ delay: 0.3 + i * 0.05, ...spring.bouncy }}
                    style={{ marginTop: 'auto' }}
                  />
                </motion.div>
                <span className={`text-[10px] ${i < 5 ? 'text-gray-600' : 'text-gray-300'}`}>{day}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Topics quick access */}
        <motion.button
          onClick={onVerTodos}
          className="col-span-2 bg-gray-50 rounded-2xl p-4 flex items-center justify-between"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ backgroundColor: '#F3E8FF' }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <BookOpen className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Todos los temas</p>
              <p className="text-xs text-gray-500">11 temas · 4 en progreso</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </motion.button>

        {/* Level/Ranking */}
        <motion.button
          onClick={onLevelClick}
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
              <p className="font-bold text-lg">Nivel 12</p>
              <p className="text-sm text-white/80">Top 15% de opositores</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">850</p>
            <p className="text-xs text-white/70">XP totales</p>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
}

// ============================================
// SETTINGS MODAL - Demo
// ============================================

function SettingsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const SettingsRow = ({ icon: Icon, label, rightText, locked }) => (
    <motion.button
      className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50 transition"
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-gray-500" />
        <span className="text-gray-700">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {rightText && <span className="text-sm text-gray-400">{rightText}</span>}
        {locked && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Próximamente</span>}
        <ChevronRight className="w-4 h-4 text-gray-300" />
      </div>
    </motion.button>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-[300]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white rounded-3xl shadow-2xl z-[301] overflow-hidden max-h-[80vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9, y: '-40%' }}
            animate={{ opacity: 1, scale: 1, y: '-50%' }}
            exit={{ opacity: 0, scale: 0.9, y: '-40%' }}
            transition={spring.bouncy}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="w-7 h-7 text-gray-700" />
                <h3 className="text-lg font-bold text-gray-900">Ajustes</h3>
              </div>
              <motion.button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100" whileTap={{ scale: 0.95 }}>
                <X className="w-5 h-5 text-gray-400" />
              </motion.button>
            </div>

            {/* Sections */}
            <div className="divide-y divide-gray-100">
              {/* Preferencias */}
              <div className="py-2">
                <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Preferencias</p>
                <SettingsRow icon={Bell} label="Notificaciones" rightText="Activadas" locked />
                <SettingsRow icon={Calendar} label="Meta diaria" rightText="15 preguntas" />
              </div>

              {/* Cuenta */}
              <div className="py-2">
                <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Cuenta</p>
                <SettingsRow icon={Users} label="Editar perfil" rightText="Usuario" />
                <SettingsRow icon={Trophy} label="Plan Premium" rightText="Próximamente" />
                <SettingsRow icon={Mail} label="Contacto" />
              </div>

              {/* Legal */}
              <div className="py-2">
                <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Legal</p>
                <SettingsRow icon={Shield} label="Política de privacidad" />
                <SettingsRow icon={FileText} label="Términos de servicio" />
                <SettingsRow icon={FileText} label="Aviso legal" />
              </div>
            </div>

            {/* App info */}
            <div className="px-5 py-4 bg-gray-50 text-center">
              <p className="text-xs text-gray-400">Oposita Smart v1.0</p>
              <p className="text-xs text-gray-300 mt-1">Hecho con 💜 para opositores</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================
// PROGRESS MODAL - Daily progress details
// ============================================

function DailyProgressModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-[300]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
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
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Progreso de Hoy</h3>
                  <p className="text-xs text-gray-500">Tu meta diaria</p>
                </div>
              </div>
              <motion.button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100" whileTap={{ scale: 0.95 }}>
                <X className="w-5 h-5 text-gray-400" />
              </motion.button>
            </div>

            {/* Main progress */}
            <div className="px-5 py-6 bg-gradient-to-br from-purple-50 to-violet-50 text-center">
              <motion.div
                className="relative w-32 h-32 mx-auto mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={spring.bouncy}
              >
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="56" fill="none" stroke="#E9D5FF" strokeWidth="12" />
                  <motion.circle
                    cx="64" cy="64" r="56" fill="none" stroke="#8B5CF6" strokeWidth="12"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 352" }}
                    animate={{ strokeDasharray: `${(40 / 100) * 352} 352` }}
                    transition={spring.smooth}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-purple-600">6</span>
                  <span className="text-sm text-gray-500">de 15</span>
                </div>
              </motion.div>
              <p className="text-lg font-semibold text-gray-800">¡Vas por buen camino!</p>
              <p className="text-sm text-gray-500">9 preguntas más para cumplir tu meta</p>
            </div>

            {/* Stats */}
            <div className="px-5 py-4 grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-xl font-bold text-gray-800">45</p>
                <p className="text-xs text-gray-500">Esta semana</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-xl font-bold text-emerald-600">87%</p>
                <p className="text-xs text-gray-500">Precisión</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-xl font-bold text-amber-600">7</p>
                <p className="text-xs text-gray-500">Racha</p>
              </div>
            </div>

            {/* CTA */}
            <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
              <motion.button
                onClick={onClose}
                className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ¡Seguir estudiando!
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================
// FOCUS MODE ORIGINAL - For comparison
// ============================================

function FocusModeOriginal({ temas, onStartSession }) {
  const nextTema = temas.find(t => t.estado === 'riesgo') || temas.find(t => t.estado === 'progreso') || temas[0];
  const config = estadoConfig[nextTema?.estado] || estadoConfig.nuevo;

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Hero card - What to focus on */}
      <motion.div
        className="bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 rounded-3xl p-6 text-white relative overflow-hidden"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          <p className="text-purple-200 text-sm mb-2">Tu enfoque de hoy</p>
          <h2 className="text-2xl font-bold mb-1">T{nextTema?.id} {nextTema?.nombre}</h2>
          <p className="text-purple-200 text-sm mb-4">{config.label} · {nextTema?.progreso}% completado</p>

          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
                <motion.circle
                  cx="32" cy="32" r="28" fill="none" stroke="white" strokeWidth="6"
                  strokeLinecap="round" strokeDasharray={175.9}
                  initial={{ strokeDashoffset: 175.9 }}
                  animate={{ strokeDashoffset: 175.9 - (175.9 * (nextTema?.progreso || 0) / 100) }}
                  transition={spring.smooth}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">{nextTema?.progreso}%</span>
            </div>
            <div>
              <p className="font-medium">15 preguntas restantes</p>
              <p className="text-sm text-purple-200">~10 min estimado</p>
            </div>
          </div>

          <motion.button
            onClick={onStartSession}
            className="w-full py-4 bg-white text-purple-600 font-bold rounded-2xl flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Zap className="w-5 h-5" />
            Empezar sesión enfocada
          </motion.button>
        </div>
      </motion.div>

      {/* Quick stats - NON INTERACTIVE (original) */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div className="bg-white rounded-2xl p-4 text-center border border-gray-100" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Flame className="w-6 h-6 text-amber-500 mx-auto mb-2" />
          <p className="text-xl font-bold text-gray-900">7</p>
          <p className="text-xs text-gray-500">Racha</p>
        </motion.div>
        <motion.div className="bg-white rounded-2xl p-4 text-center border border-gray-100" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Target className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <p className="text-xl font-bold text-gray-900">87%</p>
          <p className="text-xs text-gray-500">Precisión</p>
        </motion.div>
        <motion.div className="bg-white rounded-2xl p-4 text-center border border-gray-100" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Trophy className="w-6 h-6 text-pink-500 mx-auto mb-2" />
          <p className="text-xl font-bold text-gray-900">12</p>
          <p className="text-xs text-gray-500">Nivel</p>
        </motion.div>
      </div>

      {/* Today's goals - EXPANDED VERSION (original) */}
      <motion.div
        className="bg-white rounded-2xl p-4 border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500" />
          Objetivos de hoy
        </h3>
        <div className="space-y-3">
          {[
            { label: 'Completar 15 preguntas', done: false, progress: 40 },
            { label: 'Mantener racha', done: true, progress: 100 },
            { label: 'Repasar tema débil', done: false, progress: 0 },
          ].map((goal, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${goal.done ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                {goal.done ? <Check className="w-4 h-4 text-emerald-600" /> : <span className="w-2 h-2 rounded-full bg-gray-300" />}
              </div>
              <div className="flex-1">
                <p className={`text-sm ${goal.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{goal.label}</p>
                {!goal.done && goal.progress > 0 && (
                  <div className="h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${goal.progress}%` }} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// MAIN DRAFT FEATURES COMPONENT
// ============================================

export default function DraftFeatures({ onClose }) {
  const [activeTab, setActiveTab] = useState('full-home'); // Default to full home page
  const [selectedTema, setSelectedTema] = useState(null);
  const [showAllTemas, setShowAllTemas] = useState(false);
  const [showPrecisionModal, setShowPrecisionModal] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [showRachaModal, setShowRachaModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);

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
    { id: 'full-home', label: '🏠 Home' },
    { id: 'zen', label: '🧘 Zen' },
    { id: 'momentum', label: '📊 Momentum' },
    { id: 'focus', label: '🎯 Focus' },
    { id: 'focus-original', label: '📋 Original' },
  ];

  return (
    <div className="fixed inset-0 z-[200] bg-white overflow-y-auto">
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
          {/* NEW: Interactive Fortaleza with drag & swipe */}
          {activeTab === 'interactive' && (
            <motion.div
              key="interactive"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-sm text-purple-800">
                <strong>🆕 Fortaleza Interactiva:</strong> Arrastra para reordenar · Desliza ← para practicar
              </div>

              {/* Interactive Fortaleza */}
              <FortalezaInteractive
                temas={demoTemas}
                maxVisible={3}
                onTemaAction={(tema) => setSelectedTema(tema)}
                onVerTodos={() => setShowAllTemas(true)}
              />

              {/* Interactive Stats */}
              <div className="grid grid-cols-2 gap-3">
                <InteractiveStatCard
                  icon={Target}
                  label="Precisión"
                  value="87%"
                  color="purple"
                  trend={5}
                  onClick={() => setShowPrecisionModal(true)}
                  badge="Ver análisis"
                />
                <InteractiveStatCard
                  icon={Trophy}
                  label="Nivel"
                  value="12"
                  color="pink"
                  trend={1}
                  onClick={() => setShowLevelModal(true)}
                  badge="Top 15%"
                />
              </div>

              {/* Start Session Button */}
              <motion.button
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg shadow-purple-500/25"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={spring.snappy}
              >
                <span className="flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5" />
                  Empezar sesión
                </span>
              </motion.button>
            </motion.div>
          )}

          {/* NEW: Swipeable Focus Mode - Award winning */}
          {activeTab === 'focus' && (
            <motion.div
              key="focus"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-violet-50 border border-violet-200 rounded-xl p-3 text-sm text-violet-800 mb-4">
                <strong>🎯 Focus Mode:</strong> Desliza horizontalmente entre Tu Enfoque y Tu Fortaleza · Stats interactivos
              </div>
              <FocusModeSwipeable
                temas={demoTemas}
                onStartSession={() => console.log('Start focused session')}
                onTemaAction={(tema) => setSelectedTema(tema)}
                onVerTodos={() => setShowAllTemas(true)}
                onRachaClick={() => setShowRachaModal(true)}
                onPrecisionClick={() => setShowPrecisionModal(true)}
                onLevelClick={() => setShowLevelModal(true)}
              />
            </motion.div>
          )}

          {/* ZEN MODE - Minimalist, Headspace-inspired */}
          {activeTab === 'zen' && (
            <motion.div
              key="zen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-sm text-indigo-800 mb-4">
                <strong>🧘 Zen Mode:</strong> Minimalista · Un solo foco · Inspirado en Headspace/Calm
              </div>
              <HomeZenMode
                temas={demoTemas}
                onStartSession={() => console.log('Start session')}
                onTemaAction={(tema) => setSelectedTema(tema)}
                onVerTodos={() => setShowAllTemas(true)}
                onRachaClick={() => setShowRachaModal(true)}
                onPrecisionClick={() => setShowPrecisionModal(true)}
                onLevelClick={() => setShowLevelModal(true)}
                onSettingsClick={() => setShowSettingsModal(true)}
                onShowProgress={() => setShowProgressModal(true)}
              />
            </motion.div>
          )}

          {/* MOMENTUM - Bento grid, data-driven */}
          {activeTab === 'momentum' && (
            <motion.div
              key="momentum"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 mb-4">
                <strong>📊 Momentum:</strong> Bento grid · Weekly progress · Inspirado en Notion/Linear
              </div>
              <HomeMomentum
                temas={demoTemas}
                onStartSession={() => console.log('Start session')}
                onTemaAction={(tema) => setSelectedTema(tema)}
                onVerTodos={() => setShowAllTemas(true)}
                onRachaClick={() => setShowRachaModal(true)}
                onPrecisionClick={() => setShowPrecisionModal(true)}
                onLevelClick={() => setShowLevelModal(true)}
                onSettingsClick={() => setShowSettingsModal(true)}
                onShowProgress={() => setShowProgressModal(true)}
              />
            </motion.div>
          )}

          {/* Full Home Page with all elements */}
          {activeTab === 'full-home' && (
            <motion.div
              key="full-home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm text-emerald-800 mb-4">
                <strong>🏠 Home:</strong> Swipeable Focus/Fortaleza + Stats + Goals + FAQ + Footer
              </div>
              <FullHomePage
                temas={demoTemas}
                onStartSession={() => console.log('Start session')}
                onTemaAction={(tema) => setSelectedTema(tema)}
                onVerTodos={() => setShowAllTemas(true)}
                onRachaClick={() => setShowRachaModal(true)}
                onPrecisionClick={() => setShowPrecisionModal(true)}
                onLevelClick={() => setShowLevelModal(true)}
                onSettingsClick={() => setShowSettingsModal(true)}
                onShowProgress={() => setShowProgressModal(true)}
              />
            </motion.div>
          )}

          {/* Focus Mode Original - For comparison */}
          {activeTab === 'focus-original' && (
            <motion.div
              key="focus-original"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-700 mb-4">
                <strong>📋 Versión Original:</strong> Focus Mode sin swipe · Stats no interactivos · Objetivos expandidos
              </div>
              <FocusModeOriginal
                temas={demoTemas}
                onStartSession={() => console.log('Start focused session')}
              />
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

      {/* Tema Options Modal */}
      <TemaOptionsModal
        isOpen={!!selectedTema}
        onClose={() => setSelectedTema(null)}
        tema={selectedTema}
      />

      {/* All Temas Modal */}
      <AnimatePresence>
        {showAllTemas && (
          <AllTemasModal
            isOpen={showAllTemas}
            onClose={() => setShowAllTemas(false)}
            temas={demoTemas}
            onTemaAction={(tema) => {
              setShowAllTemas(false);
              setSelectedTema(tema);
            }}
          />
        )}
      </AnimatePresence>

      {/* Racha Modal */}
      <RachaModal
        isOpen={showRachaModal}
        onClose={() => setShowRachaModal(false)}
      />

      {/* Precision Analysis Modal */}
      <PrecisionModal
        isOpen={showPrecisionModal}
        onClose={() => setShowPrecisionModal(false)}
      />

      {/* Level Comparison Modal */}
      <LevelModal
        isOpen={showLevelModal}
        onClose={() => setShowLevelModal(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />

      {/* Daily Progress Modal */}
      <DailyProgressModal
        isOpen={showProgressModal}
        onClose={() => setShowProgressModal(false)}
      />
    </div>
  );
}
