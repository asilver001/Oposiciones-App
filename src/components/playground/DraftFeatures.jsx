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
  Settings, HelpCircle, Info, Instagram, Mail, Bell, Shield, FileText,
  Search, Heart, Scale, MapPin, GraduationCap, Lightbulb, BookMarked, ExternalLink
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
// Slides from bottom like the webapp's ProgressModal
// ============================================

function TemaOptionsModal({ isOpen, onClose, tema }) {
  if (!isOpen || !tema) return null;

  const config = estadoConfig[tema.estado] || estadoConfig.nuevo;
  const Icon = config.icon;

  const options = [
    { id: 'test', icon: Zap, label: 'Test rápido', desc: '10 preguntas aleatorias', gradient: 'from-purple-500 to-violet-600' },
    { id: 'exam', icon: Clock, label: 'Simulacro', desc: 'Examen completo cronometrado', gradient: 'from-violet-500 to-purple-600' },
    { id: 'review', icon: BookOpen, label: 'Repasar teoría', desc: 'Material de estudio', gradient: 'from-purple-400 to-violet-500' },
    { id: 'weak', icon: AlertTriangle, label: 'Puntos débiles', desc: 'Preguntas falladas', gradient: 'from-amber-400 to-orange-500' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[300]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal - Slides from bottom */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-[301] flex justify-center"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="bg-white rounded-t-3xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl">
              {/* Header */}
              <div className="sticky top-0 bg-white px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${config.gradient} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Tema {tema.id}</h3>
                    <p className="text-xs text-gray-500">{tema.nombre}</p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5 text-gray-500" />
                </motion.button>
              </div>

              {/* Progress section */}
              <div className="px-5 py-5 bg-gradient-to-br from-purple-50 to-violet-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Tu progreso</span>
                  <span className={`text-sm font-bold ${config.text}`}>{tema.progreso}%</span>
                </div>
                <div className="h-3 bg-white/80 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${config.gradient} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${tema.progreso}%` }}
                    transition={spring.smooth}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">45 preguntas disponibles</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bg} ${config.text}`}>
                    {config.label}
                  </span>
                </div>
              </div>

              {/* Options */}
              <div className="p-5 space-y-3">
                {options.map((option) => {
                  const OptIcon = option.icon;
                  return (
                    <motion.button
                      key={option.id}
                      className="w-full p-4 bg-gray-50 hover:bg-purple-50 rounded-xl flex items-center gap-4 text-left transition-all"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        console.log(`Selected: ${option.id} for tema ${tema.id}`);
                        onClose();
                      }}
                    >
                      <div className={`w-12 h-12 bg-gradient-to-br ${option.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <OptIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{option.label}</p>
                        <p className="text-sm text-gray-500">{option.desc}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </motion.button>
                  );
                })}
              </div>

              {/* Footer CTA */}
              <div className="px-5 pb-8 pt-2">
                <motion.button
                  onClick={onClose}
                  className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all"
                  whileTap={{ scale: 0.98 }}
                >
                  Empezar sesión completa
                </motion.button>
              </div>
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
// MOMENTUM THEME CONFIGURATIONS
// ============================================

const momentumThemes = {
  dark: {
    heroClass: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
    textClass: 'text-white',
    subtextClass: 'text-gray-400',
    badgeClass: 'bg-white/10 text-gray-400',
    buttonClass: 'bg-white text-gray-900',
    progressStroke: '#8B5CF6',
    progressBg: 'rgba(255,255,255,0.1)',
    decorationClass: 'bg-purple-500/20',
  },
  purple: {
    heroClass: 'bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700',
    textClass: 'text-white',
    subtextClass: 'text-purple-200',
    badgeClass: 'bg-white/20 text-purple-100',
    buttonClass: 'bg-white text-purple-600',
    progressStroke: '#ffffff',
    progressBg: 'rgba(255,255,255,0.2)',
    decorationClass: 'bg-white/10',
  },
  soft: {
    heroClass: 'bg-gradient-to-br from-rose-100 via-purple-100 to-violet-100',
    textClass: 'text-gray-800',
    subtextClass: 'text-gray-500',
    badgeClass: 'bg-purple-200/50 text-purple-700',
    buttonClass: 'bg-purple-600 text-white',
    progressStroke: '#8B5CF6',
    progressBg: 'rgba(139,92,246,0.15)',
    decorationClass: 'bg-purple-300/30',
  },
  white: {
    heroClass: 'bg-white border-2 border-gray-100',
    textClass: 'text-gray-900',
    subtextClass: 'text-gray-500',
    badgeClass: 'bg-gray-100 text-gray-600',
    buttonClass: 'bg-purple-600 text-white',
    progressStroke: '#8B5CF6',
    progressBg: 'rgba(0,0,0,0.05)',
    decorationClass: 'bg-purple-100',
  },
  gradient: {
    heroClass: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400',
    textClass: 'text-white',
    subtextClass: 'text-white/80',
    badgeClass: 'bg-white/20 text-white',
    buttonClass: 'bg-white text-purple-600',
    progressStroke: '#ffffff',
    progressBg: 'rgba(255,255,255,0.2)',
    decorationClass: 'bg-white/20',
  },
};

// ============================================
// HOME ALTERNATIVE 2: MOMENTUM
// Inspirado en Notion/Linear - Bento grid, datos claros
// ============================================

function HomeMomentum({
  temas,
  theme = 'dark',
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
  const themeConfig = momentumThemes[theme] || momentumThemes.dark;

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
        {/* Large CTA card - spans 2 columns - THEMED */}
        <motion.div
          className={`col-span-2 ${themeConfig.heroClass} rounded-2xl p-5 relative overflow-hidden`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.01 }}
        >
          <div className={`absolute top-0 right-0 w-32 h-32 ${themeConfig.decorationClass} rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl`} />

          <div className="flex items-start justify-between relative">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
                  <TemaIcon className={`w-4 h-4 ${config.text}`} />
                </div>
                <span className={`text-xs ${themeConfig.badgeClass} px-2 py-0.5 rounded-full`}>{config.label}</span>
              </div>
              <h2 className={`text-lg font-bold mb-1 ${themeConfig.textClass}`}>T{nextTema?.id}. {nextTema?.nombre}</h2>
              <p className={`text-sm ${themeConfig.subtextClass} mb-4`}>15 preguntas · ~10 min</p>
              <motion.button
                onClick={onStartSession}
                className={`px-5 py-2.5 ${themeConfig.buttonClass} font-semibold rounded-xl text-sm flex items-center gap-2`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Zap className="w-4 h-4" /> Empezar ahora
              </motion.button>
            </div>
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="34" fill="none" stroke={themeConfig.progressBg} strokeWidth="6" />
                <motion.circle
                  cx="40" cy="40" r="34" fill="none" stroke={themeConfig.progressStroke} strokeWidth="6"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 214" }}
                  animate={{ strokeDasharray: `${(nextTema?.progreso / 100) * 214} 214` }}
                  transition={spring.smooth}
                />
              </svg>
              <span className={`absolute inset-0 flex items-center justify-center text-lg font-bold ${themeConfig.textClass}`}>{nextTema?.progreso}%</span>
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
// MOMENTUM SOFT + FORTALEZA VERSION
// Replaces "Esta semana" and "Todos los temas" with Fortaleza
// ============================================

function HomeMomentumFortaleza({
  temas,
  onStartSession,
  onTemaAction,
  onVerTodos,
  onRachaClick,
  onPrecisionClick,
  onLevelClick,
  onSettingsClick,
  onShowProgress,
  onNavigate
}) {
  const nextTema = temas.find(t => t.estado === 'riesgo') || temas.find(t => t.estado === 'progreso') || temas[0];
  const config = estadoConfig[nextTema?.estado] || estadoConfig.nuevo;
  const TemaIcon = config.icon;
  const dailyProgressPercent = 40;

  // Soft theme config
  const themeConfig = momentumThemes.soft;

  // Get top 3 temas for compact fortaleza
  const sortedTemas = [...temas].sort((a, b) => {
    const configA = estadoConfig[a.estado] || estadoConfig.nuevo;
    const configB = estadoConfig[b.estado] || estadoConfig.nuevo;
    if (configA.priority !== configB.priority) return configA.priority - configB.priority;
    return b.progreso - a.progreso;
  });
  const topTemas = sortedTemas.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      {/* TopBar - inside content flow, not fixed */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between h-14 px-4">
          {/* Left - Progress circle button */}
          <motion.button
            onClick={onShowProgress}
            className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-purple-50 active:scale-95 transition-all duration-200"
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-9 h-9 transform -rotate-90">
              <circle
                cx="18" cy="18" r="14"
                fill="none"
                stroke="#F3E8FF"
                strokeWidth="3"
              />
              <circle
                cx="18" cy="18" r="14"
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${(dailyProgressPercent / 100) * 88} 88`}
                className="transition-all duration-500"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-purple-600">
              {dailyProgressPercent}
            </span>
          </motion.button>

          {/* Center - Title */}
          <h1 className="text-[15px] font-semibold text-gray-800 tracking-tight">Oposita Smart</h1>

          {/* Right - Settings */}
          <motion.button
            onClick={onSettingsClick}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:scale-95 transition-all duration-200"
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-[18px] h-[18px] text-gray-500" />
          </motion.button>
        </div>
      </div>

      {/* Greeting section */}
      <div>
        <p className="text-xs text-purple-500 font-medium uppercase tracking-wider">
          {new Date().toLocaleDateString('es-ES', { weekday: 'long' })}
        </p>
        <h2 className="text-xl font-bold text-gray-900">Tu Momentum</h2>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Large CTA card - spans 2 columns - SOFT THEME */}
        <motion.div
          className={`col-span-2 ${themeConfig.heroClass} rounded-2xl p-5 relative overflow-hidden`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.01 }}
        >
          <div className={`absolute top-0 right-0 w-32 h-32 ${themeConfig.decorationClass} rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl`} />

          <div className="flex items-start justify-between relative">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
                  <TemaIcon className={`w-4 h-4 ${config.text}`} />
                </div>
                <span className={`text-xs ${themeConfig.badgeClass} px-2 py-0.5 rounded-full`}>{config.label}</span>
              </div>
              <h2 className={`text-lg font-bold mb-1 ${themeConfig.textClass}`}>T{nextTema?.id}. {nextTema?.nombre}</h2>
              <p className={`text-sm ${themeConfig.subtextClass} mb-4`}>15 preguntas · ~10 min</p>
              <motion.button
                onClick={onStartSession}
                className={`px-5 py-2.5 ${themeConfig.buttonClass} font-semibold rounded-xl text-sm flex items-center gap-2`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Zap className="w-4 h-4" /> Empezar ahora
              </motion.button>
            </div>
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="34" fill="none" stroke={themeConfig.progressBg} strokeWidth="6" />
                <motion.circle
                  cx="40" cy="40" r="34" fill="none" stroke={themeConfig.progressStroke} strokeWidth="6"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 214" }}
                  animate={{ strokeDasharray: `${(nextTema?.progreso / 100) * 214} 214` }}
                  transition={spring.smooth}
                />
              </svg>
              <span className={`absolute inset-0 flex items-center justify-center text-lg font-bold ${themeConfig.textClass}`}>{nextTema?.progreso}%</span>
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

        {/* FORTALEZA - replaces "Esta semana" and "Todos los temas" */}
        <motion.div
          className="col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-lg">🏰</span>
              <h3 className="font-semibold text-gray-900 text-sm">Tu Fortaleza</h3>
            </div>
            <motion.button
              onClick={onVerTodos}
              className="text-xs text-purple-600 font-medium flex items-center gap-1"
              whileHover={{ x: 2 }}
            >
              Ver todo <ChevronRight className="w-3 h-3" />
            </motion.button>
          </div>

          {/* Compact temas list */}
          <div className="px-4 py-2">
            {topTemas.map((tema, index) => {
              const temaConfig = estadoConfig[tema.estado] || estadoConfig.nuevo;
              const TemaIconItem = temaConfig.icon;
              return (
                <motion.button
                  key={tema.id}
                  onClick={() => onTemaAction?.(tema)}
                  className="w-full py-2.5 flex items-center gap-3 border-b border-gray-50 last:border-b-0"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  whileHover={{ x: 4, backgroundColor: 'rgba(147, 51, 234, 0.02)' }}
                >
                  <div className={`w-8 h-8 rounded-lg ${temaConfig.bg} flex items-center justify-center flex-shrink-0`}>
                    <TemaIconItem className={`w-4 h-4 ${temaConfig.text}`} />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      <span className="text-gray-400">T{tema.id}</span> {tema.nombre}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${temaConfig.gradient} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${tema.progreso}%` }}
                          transition={{ delay: 0.4 + index * 0.05, ...spring.smooth }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{tema.progreso}%</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                </motion.button>
              );
            })}
          </div>
        </motion.div>

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

      {/* Footer - like webapp */}
      <motion.footer
        className="mt-6 mb-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100 overflow-hidden mb-8">
          {/* Acerca de */}
          <motion.button
            onClick={() => onNavigate?.('about')}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">Acerca de</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </motion.button>

          {/* FAQ */}
          <motion.button
            onClick={() => onNavigate?.('faq')}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">Preguntas Frecuentes</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </motion.button>

          {/* Instagram */}
          <motion.button
            onClick={() => window.open('https://instagram.com/opositasmart', '_blank')}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <Instagram className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">Instagram</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </motion.button>
        </div>

        {/* Branding */}
        <div className="text-center py-6">
          <p className="text-gray-900 font-semibold text-lg mb-1">Oposita Smart</p>
          <p className="text-gray-500 text-sm">La forma inteligente de opositar</p>
        </div>
      </motion.footer>
    </motion.div>
  );
}

// ============================================
// ACTIVITIES PAGE - with weekly progress
// ============================================

function ActivitiesPage({ onClose }) {
  const weekProgress = [65, 80, 45, 90, 60, 0, 0]; // Mon-Sun
  const monthData = [
    { week: 'Sem 1', questions: 45, accuracy: 82 },
    { week: 'Sem 2', questions: 62, accuracy: 85 },
    { week: 'Sem 3', questions: 38, accuracy: 79 },
    { week: 'Sem 4', questions: 55, accuracy: 87 },
  ];

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-purple-500 font-medium uppercase tracking-wider">Actividad</p>
          <h1 className="text-xl font-bold text-gray-900">Tu Progreso</h1>
        </div>
        <motion.button
          className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center"
          whileTap={{ scale: 0.95 }}
        >
          <Calendar className="w-5 h-5 text-gray-400" />
        </motion.button>
      </div>

      {/* Weekly progress - Featured card */}
      <motion.div
        className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Esta semana</h3>
            <p className="text-xs text-gray-500">Lun 13 - Dom 19 Enero</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-purple-600">45</p>
            <p className="text-xs text-gray-500">preguntas</p>
          </div>
        </div>
        <div className="flex items-end justify-between gap-2 h-24">
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => {
            const isToday = i === 4; // Friday
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
                <motion.div
                  className={`w-full rounded-lg overflow-hidden ${isToday ? 'ring-2 ring-purple-400 ring-offset-2' : ''}`}
                  style={{ height: '72px' }}
                >
                  <div className="w-full h-full bg-gray-100 flex items-end">
                    <motion.div
                      className={`w-full ${weekProgress[i] > 0 ? 'bg-gradient-to-t from-purple-600 to-purple-400' : 'bg-gray-200'} rounded-t-lg`}
                      initial={{ height: 0 }}
                      animate={{ height: `${weekProgress[i]}%` }}
                      transition={{ delay: 0.2 + i * 0.05, ...spring.bouncy }}
                    />
                  </div>
                </motion.div>
                <span className={`text-xs font-medium ${isToday ? 'text-purple-600' : i < 5 ? 'text-gray-600' : 'text-gray-300'}`}>
                  {day}
                </span>
              </div>
            );
          })}
        </div>
        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-xs text-gray-500">Completado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-gray-200" />
            <span className="text-xs text-gray-500">Sin actividad</span>
          </div>
        </div>
      </motion.div>

      {/* Monthly summary */}
      <motion.div
        className="bg-white rounded-2xl p-5 border border-gray-100"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Este mes</h3>
          <span className="text-xs text-gray-400">Enero 2026</span>
        </div>
        <div className="space-y-3">
          {monthData.map((week, i) => (
            <motion.div
              key={week.week}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
            >
              <span className="text-xs text-gray-500 w-12">{week.week}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(week.questions / 70) * 100}%` }}
                  transition={{ delay: 0.4 + i * 0.05, ...spring.smooth }}
                />
              </div>
              <span className="text-xs font-medium text-gray-700 w-8">{week.questions}</span>
              <span className={`text-xs font-medium ${week.accuracy >= 85 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {week.accuracy}%
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <span className="text-xs text-emerald-600 font-medium">Mejor semana</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">62</p>
          <p className="text-xs text-gray-500">preguntas · Sem 2</p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <span className="text-xs text-amber-600 font-medium">Racha actual</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">7</p>
          <p className="text-xs text-gray-500">días consecutivos</p>
        </motion.div>
      </div>

      {/* Accuracy trend */}
      <motion.div
        className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-5 border border-purple-100"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold text-gray-900">Precisión media</h3>
          </div>
          <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">↑ +5% vs mes anterior</span>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold text-purple-600">83%</span>
          <span className="text-sm text-gray-500 mb-1">este mes</span>
        </div>
      </motion.div>

      {/* Footer - same as Soft+Fort */}
      <motion.footer
        className="mt-6 mb-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100 overflow-hidden mb-8">
          {/* Acerca de */}
          <motion.button
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">Acerca de</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </motion.button>

          {/* FAQ */}
          <motion.button
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">Preguntas Frecuentes</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </motion.button>

          {/* Instagram */}
          <motion.button
            onClick={() => window.open('https://instagram.com/opositasmart', '_blank')}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <Instagram className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">Instagram</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </motion.button>
        </div>

        {/* Branding */}
        <div className="text-center py-6">
          <p className="text-gray-900 font-semibold text-lg mb-1">Oposita Smart</p>
          <p className="text-gray-500 text-sm">La forma inteligente de opositar</p>
        </div>
      </motion.footer>
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
// RECURSOS PAGE
// ============================================

// Resource category configuration
const recursosCategorias = [
  {
    id: 'legislacion',
    title: 'Legislacion',
    icon: Scale,
    description: 'Leyes fundamentales para tu oposicion',
    gradient: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    recursos: [
      { id: 'ce', title: 'Constitucion Espanola 1978', subtitle: 'Texto consolidado BOE', type: 'pdf', isNew: false, isFavorite: true, lastAccessed: '2024-01-15' },
      { id: 'ley39', title: 'Ley 39/2015 - LPACAP', subtitle: 'Procedimiento Administrativo Comun', type: 'pdf', isNew: false, isFavorite: true, lastAccessed: '2024-01-14' },
      { id: 'ley40', title: 'Ley 40/2015 - LRJSP', subtitle: 'Regimen Juridico Sector Publico', type: 'pdf', isNew: true, isFavorite: false, lastAccessed: null },
      { id: 'ebep', title: 'RDL 5/2015 - EBEP', subtitle: 'Estatuto Basico Empleado Publico', type: 'pdf', isNew: false, isFavorite: false, lastAccessed: '2024-01-10' },
      { id: 'lofage', title: 'Ley 6/1997 - LOFAGE', subtitle: 'Organizacion y Func. de la AGE', type: 'pdf', isNew: false, isFavorite: false, lastAccessed: null },
    ]
  },
  {
    id: 'esquemas',
    title: 'Esquemas y Mapas',
    icon: MapPin,
    description: 'Visualiza conceptos clave',
    gradient: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
    recursos: [
      { id: 'esq-ce', title: 'Estructura de la Constitucion', subtitle: '10 Titulos + Disposiciones', type: 'esquema', isNew: false, isFavorite: true, lastAccessed: '2024-01-15' },
      { id: 'esq-derechos', title: 'Derechos Fundamentales', subtitle: 'Arts. 14-29 CE', type: 'esquema', isNew: true, isFavorite: false, lastAccessed: null },
      { id: 'esq-cortes', title: 'Las Cortes Generales', subtitle: 'Congreso y Senado', type: 'mapa', isNew: false, isFavorite: false, lastAccessed: '2024-01-12' },
      { id: 'esq-gobierno', title: 'El Gobierno', subtitle: 'Composicion y funciones', type: 'esquema', isNew: false, isFavorite: false, lastAccessed: null },
      { id: 'esq-proc', title: 'Procedimiento Administrativo', subtitle: 'Fases y plazos', type: 'mapa', isNew: true, isFavorite: false, lastAccessed: null },
    ]
  },
  {
    id: 'resumenes',
    title: 'Resumenes por Tema',
    icon: FileText,
    description: 'Lo esencial de cada tema',
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    recursos: [
      { id: 'res-t1', title: 'T1: La Constitucion', subtitle: 'Caracteristicas y estructura', type: 'resumen', isNew: false, isFavorite: true, lastAccessed: '2024-01-15' },
      { id: 'res-t2', title: 'T2: Derechos y Deberes', subtitle: 'Derechos fundamentales', type: 'resumen', isNew: false, isFavorite: false, lastAccessed: '2024-01-14' },
      { id: 'res-t3', title: 'T3: Corona y Cortes', subtitle: 'Instituciones del Estado', type: 'resumen', isNew: false, isFavorite: true, lastAccessed: '2024-01-13' },
      { id: 'res-t14', title: 'T14: Ley 39/2015', subtitle: 'Disposiciones generales', type: 'resumen', isNew: true, isFavorite: false, lastAccessed: null },
      { id: 'res-t15', title: 'T15: El Acto Administrativo', subtitle: 'Eficacia y validez', type: 'resumen', isNew: true, isFavorite: false, lastAccessed: null },
    ]
  },
  {
    id: 'calendario',
    title: 'Calendario de Estudio',
    icon: Calendar,
    description: 'Planifica tu preparacion',
    gradient: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    recursos: [
      { id: 'cal-6m', title: 'Plan 6 meses', subtitle: 'Preparacion intensiva', type: 'calendario', isNew: false, isFavorite: true, lastAccessed: '2024-01-10' },
      { id: 'cal-12m', title: 'Plan 12 meses', subtitle: 'Preparacion equilibrada', type: 'calendario', isNew: false, isFavorite: false, lastAccessed: null },
      { id: 'cal-conv', title: 'Fechas convocatoria 2025', subtitle: 'AGE C2 - Aux. Administrativo', type: 'info', isNew: true, isFavorite: false, lastAccessed: null },
    ]
  },
  {
    id: 'tecnicas',
    title: 'Tecnicas de Estudio',
    icon: Lightbulb,
    description: 'Aprende a estudiar mejor',
    gradient: 'from-sky-500 to-blue-600',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200',
    recursos: [
      { id: 'tec-fsrs', title: 'Repeticion espaciada', subtitle: 'Como funciona el algoritmo', type: 'guia', isNew: false, isFavorite: true, lastAccessed: '2024-01-08' },
      { id: 'tec-test', title: 'Estrategia de tests', subtitle: 'Maximiza tu puntuacion', type: 'guia', isNew: false, isFavorite: false, lastAccessed: '2024-01-05' },
      { id: 'tec-mem', title: 'Tecnicas de memoria', subtitle: 'Articulos y fechas', type: 'guia', isNew: true, isFavorite: false, lastAccessed: null },
      { id: 'tec-plan', title: 'Gestion del tiempo', subtitle: 'Estudiar sin agobios', type: 'guia', isNew: false, isFavorite: false, lastAccessed: null },
    ]
  },
  {
    id: 'glosario',
    title: 'Glosario de Terminos',
    icon: BookMarked,
    description: 'Definiciones clave',
    gradient: 'from-fuchsia-500 to-pink-600',
    bg: 'bg-fuchsia-50',
    text: 'text-fuchsia-700',
    border: 'border-fuchsia-200',
    recursos: [
      { id: 'glo-admin', title: 'Derecho Administrativo', subtitle: '120 terminos', type: 'glosario', isNew: false, isFavorite: true, lastAccessed: '2024-01-12' },
      { id: 'glo-const', title: 'Derecho Constitucional', subtitle: '85 terminos', type: 'glosario', isNew: false, isFavorite: false, lastAccessed: '2024-01-11' },
      { id: 'glo-proc', title: 'Procedimiento', subtitle: '60 terminos', type: 'glosario', isNew: true, isFavorite: false, lastAccessed: null },
    ]
  },
];

// Filter types for resources
const filterOptions = [
  { id: 'todos', label: 'Todos', icon: BookOpen },
  { id: 'favoritos', label: 'Favoritos', icon: Heart },
  { id: 'recientes', label: 'Recientes', icon: Clock },
  { id: 'nuevos', label: 'Nuevos', icon: Sparkles },
];

// Expandable Resource Card component
function ResourceCategoryCard({ categoria, isExpanded, onToggle, onResourceClick, favoriteIds, onToggleFavorite }) {
  const Icon = categoria.icon;
  const newCount = categoria.recursos.filter(r => r.isNew).length;

  return (
    <motion.div
      className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${categoria.border}`}
      layout
      transition={spring.gentle}
    >
      {/* Header - Always visible */}
      <motion.button
        onClick={onToggle}
        className="w-full p-4 flex items-center gap-3 text-left"
        whileHover={{ backgroundColor: 'rgba(0,0,0,0.01)' }}
        whileTap={{ scale: 0.995 }}
      >
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoria.gradient} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-900">{categoria.title}</p>
            {newCount > 0 && (
              <motion.span
                className="px-2 py-0.5 bg-rose-100 text-rose-600 text-xs font-medium rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={spring.bouncy}
              >
                {newCount} nuevo{newCount > 1 ? 's' : ''}
              </motion.span>
            )}
          </div>
          <p className="text-sm text-gray-500 truncate">{categoria.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium ${categoria.text} px-2 py-1 rounded-lg ${categoria.bg}`}>
            {categoria.recursos.length}
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={spring.snappy}
          >
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </motion.div>
        </div>
      </motion.button>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={spring.gentle}
          >
            <div className="px-4 pb-4 space-y-2 border-t border-gray-100 pt-3">
              {categoria.recursos.map((recurso, i) => {
                const isFav = favoriteIds.includes(recurso.id);
                return (
                  <motion.div
                    key={recurso.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...spring.gentle, delay: i * 0.03 }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(recurso.id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${isFav ? 'fill-rose-500 text-rose-500' : 'text-gray-300 group-hover:text-gray-400'}`}
                      />
                    </button>
                    <button
                      onClick={() => onResourceClick(recurso)}
                      className="flex-1 min-w-0 text-left flex items-center gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-800 truncate">{recurso.title}</p>
                          {recurso.isNew && (
                            <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-600 text-[10px] font-medium rounded">
                              NUEVO
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{recurso.subtitle}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400 flex-shrink-0" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Main RecursosPage component
function RecursosPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('todos');
  const [expandedCategories, setExpandedCategories] = useState(['legislacion']); // Default expanded
  const [favoriteIds, setFavoriteIds] = useState(['ce', 'ley39', 'esq-ce', 'res-t1', 'res-t3', 'cal-6m', 'tec-fsrs', 'glo-admin']);

  // Toggle category expansion
  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Toggle favorite
  const toggleFavorite = (resourceId) => {
    setFavoriteIds(prev =>
      prev.includes(resourceId)
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  // Handle resource click
  const handleResourceClick = (recurso) => {
    console.log('Open resource:', recurso);
    // In production, this would open the resource
  };

  // Filter categories based on search and filter
  const filteredCategorias = recursosCategorias.map(cat => {
    let filteredRecursos = cat.recursos;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredRecursos = filteredRecursos.filter(r =>
        r.title.toLowerCase().includes(query) ||
        r.subtitle.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (activeFilter === 'favoritos') {
      filteredRecursos = filteredRecursos.filter(r => favoriteIds.includes(r.id));
    } else if (activeFilter === 'nuevos') {
      filteredRecursos = filteredRecursos.filter(r => r.isNew);
    } else if (activeFilter === 'recientes') {
      filteredRecursos = filteredRecursos.filter(r => r.lastAccessed);
    }

    return { ...cat, recursos: filteredRecursos };
  }).filter(cat => cat.recursos.length > 0);

  // Count totals
  const totalRecursos = recursosCategorias.reduce((sum, cat) => sum + cat.recursos.length, 0);
  const totalNuevos = recursosCategorias.reduce((sum, cat) => sum + cat.recursos.filter(r => r.isNew).length, 0);

  return (
    <div className="space-y-4">
      {/* Header stats */}
      <motion.div
        className="bg-gradient-to-br from-rose-50 via-purple-50 to-violet-50 rounded-2xl p-4 border border-rose-100"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring.gentle}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-purple-600 rounded-xl flex items-center justify-center">
            <BookMarked className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Biblioteca de Recursos</h2>
            <p className="text-sm text-gray-500">{totalRecursos} recursos disponibles</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/60 backdrop-blur rounded-xl p-2 text-center">
            <p className="text-lg font-bold text-purple-600">{recursosCategorias.length}</p>
            <p className="text-xs text-gray-500">Categorias</p>
          </div>
          <div className="bg-white/60 backdrop-blur rounded-xl p-2 text-center">
            <p className="text-lg font-bold text-rose-600">{favoriteIds.length}</p>
            <p className="text-xs text-gray-500">Favoritos</p>
          </div>
          <div className="bg-white/60 backdrop-blur rounded-xl p-2 text-center">
            <p className="text-lg font-bold text-emerald-600">{totalNuevos}</p>
            <p className="text-xs text-gray-500">Nuevos</p>
          </div>
        </div>
      </motion.div>

      {/* Search bar */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring.gentle, delay: 0.05 }}
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar recursos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </motion.div>

      {/* Filter chips */}
      <motion.div
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring.gentle, delay: 0.1 }}
      >
        {filterOptions.map((filter) => {
          const FilterIcon = filter.icon;
          const isActive = activeFilter === filter.id;
          return (
            <motion.button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-colors
                ${isActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              whileTap={{ scale: 0.97 }}
            >
              <FilterIcon className="w-4 h-4" />
              {filter.label}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Categories */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...spring.gentle, delay: 0.15 }}
      >
        {filteredCategorias.length > 0 ? (
          filteredCategorias.map((categoria, i) => (
            <motion.div
              key={categoria.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring.gentle, delay: 0.1 + i * 0.05 }}
            >
              <ResourceCategoryCard
                categoria={categoria}
                isExpanded={expandedCategories.includes(categoria.id)}
                onToggle={() => toggleCategory(categoria.id)}
                onResourceClick={handleResourceClick}
                favoriteIds={favoriteIds}
                onToggleFavorite={toggleFavorite}
              />
            </motion.div>
          ))
        ) : (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No se encontraron recursos</p>
            <p className="text-sm text-gray-400">Prueba con otra busqueda o filtro</p>
          </motion.div>
        )}
      </motion.div>

      {/* Quick access - Recent */}
      {activeFilter === 'todos' && !searchQuery && (
        <motion.div
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring.gentle, delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-gray-400" />
            <h3 className="font-semibold text-gray-800 text-sm">Ultimo acceso</h3>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {recursosCategorias
              .flatMap(cat => cat.recursos.filter(r => r.lastAccessed))
              .sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed))
              .slice(0, 5)
              .map((recurso, i) => (
                <motion.button
                  key={recurso.id}
                  onClick={() => handleResourceClick(recurso)}
                  className="flex-shrink-0 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <p className="text-sm font-medium text-gray-700 whitespace-nowrap">{recurso.title}</p>
                  <p className="text-xs text-gray-400">{recurso.lastAccessed}</p>
                </motion.button>
              ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ============================================
// FEATURE PROPOSALS PAGE
// ============================================

// FlipCard component (from AnimationPlayground)
function FlipCard({ front, back, className = "" }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`perspective-1000 cursor-pointer ${className}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={spring.gentle}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className="absolute inset-0 rounded-2xl flex items-center justify-center backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {front}
        </div>
        <div
          className="absolute inset-0 rounded-2xl flex items-center justify-center"
          style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}

// AnimatedCounter component (from AnimationPlayground)
function AnimatedCounter({ value, duration = 1, suffix = "", className = "" }) {
  const [displayValue, setDisplayValue] = useState(0);

  React.useEffect(() => {
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
    <motion.span className={className} key={value}>
      {displayValue.toLocaleString()}{suffix}
    </motion.span>
  );
}

// Feature Proposals Page Component
function FeatureProposalsPage() {
  const [activeProposal, setActiveProposal] = useState('flip-card');
  const [demoStreak, setDemoStreak] = useState(7);
  const [demoAccuracy, setDemoAccuracy] = useState(87);
  const [demoQuestions, setDemoQuestions] = useState(1247);

  // Demo tema data for FlipCard proposals
  const demoTemaCards = [
    { id: 1, tema: 'Art. 66 CE', pregunta: 'Quien representa al pueblo espanol?', respuesta: 'Las Cortes Generales' },
    { id: 2, tema: 'Art. 1.1 CE', pregunta: 'Cuales son los valores superiores?', respuesta: 'Libertad, justicia, igualdad, pluralismo' },
    { id: 3, tema: 'Art. 2 CE', pregunta: 'Fundamento de la Constitucion?', respuesta: 'La indisoluble unidad de la Nacion' },
  ];

  const proposals = [
    { id: 'flip-card', label: 'Flip Card', icon: '🔄' },
    { id: 'counter', label: 'Contador Animado', icon: '🔢' },
  ];

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-4">
        <h3 className="font-bold text-violet-800 mb-1">Propuestas de Integracion</h3>
        <p className="text-sm text-violet-600">
          Mockups interactivos de features del Animation Playground. Click en cada propuesta para probar.
        </p>
      </div>

      {/* Proposal selector */}
      <div className="flex gap-2">
        {proposals.map((p) => (
          <motion.button
            key={p.id}
            onClick={() => setActiveProposal(p.id)}
            className={`px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-2
              ${activeProposal === p.id
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                : 'bg-white border border-gray-200 text-gray-700'}`}
            whileTap={{ scale: 0.97 }}
          >
            {p.icon} {p.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* FLIP CARD PROPOSALS */}
        {activeProposal === 'flip-card' && (
          <motion.div
            key="flip-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Proposal 1: Flashcards de repaso */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-rose-50/50">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📚</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Propuesta 1: Flashcards de Repaso</h4>
                    <p className="text-xs text-gray-500">Tarjetas pregunta/respuesta para modo repaso</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Ubicacion:</strong> Modo Repaso, Sesion de estudio tipo flashcard
                </p>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {demoTemaCards.map((card) => (
                    <FlipCard
                      key={card.id}
                      className="w-48 h-32 flex-shrink-0"
                      front={
                        <div className="w-full h-full bg-gradient-to-br from-rose-400 to-purple-500 rounded-2xl p-4 flex flex-col justify-between text-white shadow-lg">
                          <span className="text-xs font-medium opacity-80">{card.tema}</span>
                          <p className="text-sm font-medium">{card.pregunta}</p>
                          <span className="text-xs opacity-60">Tap para ver</span>
                        </div>
                      }
                      back={
                        <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl p-4 flex flex-col justify-center items-center text-white shadow-lg">
                          <Check className="w-6 h-6 mb-2 opacity-80" />
                          <p className="text-sm font-bold text-center">{card.respuesta}</p>
                        </div>
                      }
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Proposal 2: Stats que muestran detalles */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-violet-50/50">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📊</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Propuesta 2: Stats con Detalles</h4>
                    <p className="text-xs text-gray-500">Estadisticas que revelan info al voltear</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Ubicacion:</strong> Dashboard, Bento grid de estadisticas
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <FlipCard
                    className="h-28"
                    front={
                      <div className="w-full h-full bg-gradient-to-br from-purple-100 to-violet-100 rounded-xl p-4 flex flex-col justify-between border border-purple-200">
                        <Target className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-2xl font-bold text-purple-700">87%</p>
                          <p className="text-xs text-purple-500">Precision</p>
                        </div>
                      </div>
                    }
                    back={
                      <div className="w-full h-full bg-purple-600 rounded-xl p-4 flex flex-col justify-center text-white">
                        <p className="text-xs opacity-80">Ultimas 50 preguntas</p>
                        <p className="text-sm font-medium mt-1">43 correctas, 7 fallidas</p>
                        <p className="text-xs mt-2 opacity-60">Tendencia: +5% esta semana</p>
                      </div>
                    }
                  />
                  <FlipCard
                    className="h-28"
                    front={
                      <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl p-4 flex flex-col justify-between border border-amber-200">
                        <Flame className="w-5 h-5 text-amber-600" />
                        <div>
                          <p className="text-2xl font-bold text-amber-700">7 dias</p>
                          <p className="text-xs text-amber-500">Racha actual</p>
                        </div>
                      </div>
                    }
                    back={
                      <div className="w-full h-full bg-amber-500 rounded-xl p-6 flex flex-col justify-center text-white">
                        <p className="text-xs opacity-80">Record personal</p>
                        <p className="text-sm font-medium mt-1">14 dias consecutivos</p>
                        <p className="text-xs mt-2 opacity-60">Meta: 30 dias</p>
                      </div>
                    }
                  />
                </div>
              </div>
            </div>

            {/* Proposal 3: Tema cards con info oculta */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-pink-50/50">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏰</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Propuesta 3: Temas en Fortaleza</h4>
                    <p className="text-xs text-gray-500">Cards de tema que revelan estadisticas</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Ubicacion:</strong> Tu Fortaleza, grid de temas
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 1, nombre: 'CE', estado: 'dominado', progreso: 95, correctas: 47, total: 50 },
                    { id: 2, nombre: 'LPAC', estado: 'avanzando', progreso: 72, correctas: 36, total: 50 },
                    { id: 3, nombre: 'Corona', estado: 'riesgo', progreso: 45, correctas: 9, total: 20 },
                  ].map((tema) => {
                    const config = estadoConfig[tema.estado];
                    return (
                      <FlipCard
                        key={tema.id}
                        className="h-20"
                        front={
                          <div className={`w-full h-full bg-gradient-to-br ${config.gradient} rounded-xl p-3 flex flex-col justify-between text-white shadow-md`}>
                            <span className="text-xs font-medium opacity-80">T{tema.id}</span>
                            <div>
                              <p className="text-lg font-bold">{tema.progreso}%</p>
                              <p className="text-xs opacity-80">{tema.nombre}</p>
                            </div>
                          </div>
                        }
                        back={
                          <div className="w-full h-full bg-white border-2 border-gray-200 rounded-xl p-2 flex flex-col justify-center items-center">
                            <p className="text-xs text-gray-500">Aciertos</p>
                            <p className="text-sm font-bold text-gray-800">{tema.correctas}/{tema.total}</p>
                            <div className="h-1 w-full bg-gray-100 rounded-full mt-2 overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${config.gradient}`}
                                style={{ width: `${tema.progreso}%` }}
                              />
                            </div>
                          </div>
                        }
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Proposal 4: Pregunta con explicacion */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-emerald-50/50">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💡</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Propuesta 4: Pregunta con Explicacion</h4>
                    <p className="text-xs text-gray-500">Ver la explicacion al voltear la tarjeta</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Ubicacion:</strong> Resultado de pregunta, revision post-sesion
                </p>
                <FlipCard
                  className="w-full h-40"
                  front={
                    <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-4 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="w-5 h-5 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-700">Respuesta correcta</span>
                      </div>
                      <p className="text-gray-800 font-medium flex-1">
                        Las Cortes Generales representan al pueblo espanol
                      </p>
                      <p className="text-xs text-emerald-600">Tap para ver explicacion detallada</p>
                    </div>
                  }
                  back={
                    <div className="w-full h-full bg-white border-2 border-gray-200 rounded-2xl p-4 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">Explicacion</span>
                      </div>
                      <p className="text-sm text-gray-700 flex-1">
                        Segun el Art. 66.1 CE, las Cortes Generales representan al pueblo espanol y estan formadas por el Congreso y el Senado.
                      </p>
                      <p className="text-xs text-gray-400">Art. 66 - Titulo III CE</p>
                    </div>
                  }
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* ANIMATED COUNTER PROPOSALS */}
        {activeProposal === 'counter' && (
          <motion.div
            key="counter"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Proposal 1: Total preguntas respondidas */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-purple-50/50">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📝</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Propuesta 1: Total Preguntas</h4>
                    <p className="text-xs text-gray-500">Contador del total de preguntas respondidas</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Ubicacion:</strong> Dashboard principal, estadisticas generales
                </p>
                <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl p-6 text-center border border-purple-200">
                  <BookOpen className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <AnimatedCounter
                    value={demoQuestions}
                    duration={1.5}
                    className="text-4xl font-bold text-purple-700 tabular-nums"
                  />
                  <p className="text-sm text-purple-600 mt-1">preguntas respondidas</p>
                  <motion.button
                    onClick={() => setDemoQuestions(q => q + Math.floor(Math.random() * 50) + 10)}
                    className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium"
                    whileTap={{ scale: 0.95 }}
                  >
                    Simular +preguntas
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Proposal 2: Precision porcentaje */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-emerald-50/50">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎯</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Propuesta 2: Precision Animada</h4>
                    <p className="text-xs text-gray-500">Porcentaje de aciertos con animacion</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Ubicacion:</strong> Resultado de sesion, stats en dashboard
                </p>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-100 rounded-xl p-6 text-center border border-emerald-200">
                  <Target className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <div className="flex items-baseline justify-center gap-1">
                    <AnimatedCounter
                      value={demoAccuracy}
                      duration={1}
                      className="text-5xl font-bold text-emerald-700 tabular-nums"
                    />
                    <span className="text-2xl font-bold text-emerald-600">%</span>
                  </div>
                  <p className="text-sm text-emerald-600 mt-1">precision global</p>
                  <div className="flex gap-2 justify-center mt-4">
                    <motion.button
                      onClick={() => setDemoAccuracy(a => Math.min(100, a + 5))}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-medium"
                      whileTap={{ scale: 0.95 }}
                    >
                      +5%
                    </motion.button>
                    <motion.button
                      onClick={() => setDemoAccuracy(a => Math.max(0, a - 5))}
                      className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
                      whileTap={{ scale: 0.95 }}
                    >
                      -5%
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>

            {/* Proposal 3: Racha de dias */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-amber-50/50">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔥</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Propuesta 3: Racha Animada</h4>
                    <p className="text-xs text-gray-500">Contador de dias de racha</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Ubicacion:</strong> TopBar, Dashboard, celebracion de racha
                </p>
                <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl p-6 text-center border border-amber-200">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                    className="text-4xl mb-2"
                  >
                    🔥
                  </motion.div>
                  <div className="flex items-baseline justify-center gap-2">
                    <AnimatedCounter
                      value={demoStreak}
                      duration={0.8}
                      className="text-5xl font-bold text-amber-700 tabular-nums"
                    />
                    <span className="text-xl font-medium text-amber-600">dias</span>
                  </div>
                  <p className="text-sm text-amber-600 mt-1">racha actual</p>
                  <motion.button
                    onClick={() => setDemoStreak(s => s + 1)}
                    className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium"
                    whileTap={{ scale: 0.95 }}
                  >
                    +1 dia
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Proposal 4: Nivel y XP */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-pink-50/50">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⭐</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Propuesta 4: Nivel y XP</h4>
                    <p className="text-xs text-gray-500">Contador de puntos de experiencia</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Ubicacion:</strong> Perfil de usuario, resultado de sesion con XP ganado
                </p>
                <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-xl p-6 border border-pink-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-pink-600">Nivel actual</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-pink-700">12</span>
                        <Trophy className="w-5 h-5 text-pink-500" />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-pink-600">XP Total</p>
                      <AnimatedCounter
                        value={2450}
                        duration={1.2}
                        className="text-2xl font-bold text-pink-700 tabular-nums"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-pink-600 mb-1">
                      <span>Progreso al nivel 13</span>
                      <span>450/1000 XP</span>
                    </div>
                    <div className="h-3 bg-pink-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '45%' }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// TEMAS DATA - Full 28 topics from AGE syllabus
// ============================================

const temasAGECompleto = [
  // Bloque I: Organizacion Publica (Temas 1-18)
  { id: 1, nombre: 'La Constitucion Espanola de 1978', bloque: 'Constitucion', preguntas: 42, estado: 'dominado', progreso: 92 },
  { id: 2, nombre: 'Derechos y deberes fundamentales', bloque: 'Constitucion', preguntas: 38, estado: 'avanzando', progreso: 78 },
  { id: 3, nombre: 'La Corona. Las Cortes Generales', bloque: 'Constitucion', preguntas: 40, estado: 'progreso', progreso: 55 },
  { id: 4, nombre: 'El Gobierno y la Administracion. El Poder Judicial', bloque: 'Constitucion', preguntas: 35, estado: 'riesgo', progreso: 32 },
  { id: 5, nombre: 'Organizacion territorial del Estado', bloque: 'Constitucion', preguntas: 28, estado: 'nuevo', progreso: 0 },
  { id: 6, nombre: 'La Administracion General del Estado', bloque: 'Organizacion', preguntas: 45, estado: 'progreso', progreso: 48 },
  { id: 7, nombre: 'La AGE: Organos territoriales', bloque: 'Organizacion', preguntas: 32, estado: 'riesgo', progreso: 25 },
  { id: 8, nombre: 'Las Comunidades Autonomas', bloque: 'Organizacion', preguntas: 30, estado: 'nuevo', progreso: 0 },
  { id: 9, nombre: 'La Administracion Local', bloque: 'Organizacion', preguntas: 27, estado: 'nuevo', progreso: 0 },
  { id: 10, nombre: 'La Union Europea', bloque: 'Organizacion', preguntas: 35, estado: 'avanzando', progreso: 65 },
  { id: 11, nombre: 'Personal al servicio de las AAPP. El EBEP', bloque: 'Funcion Publica', preguntas: 48, estado: 'progreso', progreso: 42 },
  { id: 12, nombre: 'Derechos y deberes de los empleados publicos', bloque: 'Funcion Publica', preguntas: 36, estado: 'nuevo', progreso: 0 },
  { id: 13, nombre: 'Regimen disciplinario', bloque: 'Funcion Publica', preguntas: 22, estado: 'nuevo', progreso: 0 },
  { id: 14, nombre: 'Ley 39/2015: Disposiciones generales', bloque: 'Procedimiento', preguntas: 50, estado: 'avanzando', progreso: 70 },
  { id: 15, nombre: 'El acto administrativo', bloque: 'Procedimiento', preguntas: 44, estado: 'dominado', progreso: 88 },
  { id: 16, nombre: 'Disposiciones sobre procedimiento comun', bloque: 'Procedimiento', preguntas: 46, estado: 'progreso', progreso: 52 },
  { id: 17, nombre: 'Revision de actos. Recursos administrativos', bloque: 'Procedimiento', preguntas: 42, estado: 'riesgo', progreso: 28 },
  { id: 18, nombre: 'Ley 40/2015: Regimen Juridico del Sector Publico', bloque: 'Procedimiento', preguntas: 40, estado: 'nuevo', progreso: 0 },
  // Bloque II: Ofimatica (Temas 19-28)
  { id: 19, nombre: 'Informatica basica: Conceptos fundamentales', bloque: 'Ofimatica', preguntas: 38, estado: 'dominado', progreso: 95 },
  { id: 20, nombre: 'Sistemas operativos: Windows 11', bloque: 'Ofimatica', preguntas: 52, estado: 'avanzando', progreso: 72 },
  { id: 21, nombre: 'Procesadores de texto: Word 2019', bloque: 'Ofimatica', preguntas: 55, estado: 'progreso', progreso: 58 },
  { id: 22, nombre: 'Hojas de calculo: Excel 2019', bloque: 'Ofimatica', preguntas: 58, estado: 'riesgo', progreso: 35 },
  { id: 23, nombre: 'Bases de datos: Access 2019', bloque: 'Ofimatica', preguntas: 42, estado: 'nuevo', progreso: 0 },
  { id: 24, nombre: 'Presentaciones: PowerPoint 2019', bloque: 'Ofimatica', preguntas: 32, estado: 'nuevo', progreso: 0 },
  { id: 25, nombre: 'Correo electronico: Outlook 2019', bloque: 'Ofimatica', preguntas: 28, estado: 'progreso', progreso: 45 },
  { id: 26, nombre: 'Internet y navegadores', bloque: 'Ofimatica', preguntas: 30, estado: 'avanzando', progreso: 68 },
  { id: 27, nombre: 'Administracion electronica', bloque: 'Ofimatica', preguntas: 44, estado: 'progreso', progreso: 40 },
  { id: 28, nombre: 'Proteccion de datos (RGPD y LOPDGDD)', bloque: 'Ofimatica', preguntas: 46, estado: 'riesgo', progreso: 22 },
];

// ============================================
// PROPUESTA A - Lista Clasica Mejorada
// ============================================

function TemasListaClasica({ temas = temasAGECompleto, onTemaClick }) {
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  const filtros = [
    { id: 'todos', label: 'Todos', count: temas.length },
    { id: 'dominado', label: 'Dominados', count: temas.filter(t => t.estado === 'dominado').length },
    { id: 'avanzando', label: 'Avanzando', count: temas.filter(t => t.estado === 'avanzando').length },
    { id: 'progreso', label: 'En progreso', count: temas.filter(t => t.estado === 'progreso').length },
    { id: 'riesgo', label: 'En riesgo', count: temas.filter(t => t.estado === 'riesgo').length },
    { id: 'nuevo', label: 'Nuevos', count: temas.filter(t => t.estado === 'nuevo').length },
  ];

  const temasFiltrados = temas
    .filter(t => filtroEstado === 'todos' || t.estado === filtroEstado)
    .filter(t => busqueda === '' || t.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  const bloques = [...new Set(temasFiltrados.map(t => t.bloque))];

  return (
    <motion.div className="min-h-screen bg-gradient-to-b from-rose-50/50 via-purple-50/30 to-violet-50/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="bg-white/80 backdrop-blur-lg border-b border-purple-100 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Temario AGE</h1>
              <p className="text-xs text-gray-500">28 temas - Auxiliar Administrativo</p>
            </div>
          </div>
          <div className="relative mb-3">
            <input type="text" placeholder="Buscar tema..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-300" />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {filtros.map((filtro) => (
              <motion.button key={filtro.id} onClick={() => setFiltroEstado(filtro.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all
                  ${filtroEstado === filtro.id ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25' : 'bg-white text-gray-600 border border-gray-200'}`}
                whileTap={{ scale: 0.95 }}>
                {filtro.label}
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${filtroEstado === filtro.id ? 'bg-white/20' : 'bg-gray-100'}`}>{filtro.count}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
      <div className="px-4 py-4 space-y-6">
        {bloques.map((bloque) => {
          const temasBloque = temasFiltrados.filter(t => t.bloque === bloque);
          if (temasBloque.length === 0) return null;
          return (
            <motion.div key={bloque} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">{bloque}</span>
                <div className="flex-1 h-px bg-purple-200" />
                <span className="text-xs text-gray-400">{temasBloque.length} temas</span>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {temasBloque.map((tema, index) => {
                  const config = estadoConfig[tema.estado] || estadoConfig.nuevo;
                  const Icon = config.icon;
                  return (
                    <motion.button key={tema.id} onClick={() => onTemaClick?.(tema)}
                      className="w-full px-4 py-3.5 flex items-center gap-3 border-b border-gray-50 last:border-b-0 hover:bg-purple-50/50 transition-colors text-left"
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.03 }} whileTap={{ scale: 0.99 }}>
                      <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${config.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-400">T{tema.id}</span>
                          <p className="text-sm font-medium text-gray-800 truncate">{tema.nombre}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div className={`h-full bg-gradient-to-r ${config.gradient} rounded-full`}
                              initial={{ width: 0 }} animate={{ width: `${tema.progreso}%` }} transition={{ delay: 0.2 + index * 0.03, ...spring.smooth }} />
                          </div>
                          <span className="text-xs text-gray-500 w-10 text-right">{tema.progreso}%</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bg} ${config.text}`}>{config.label}</span>
                        <span className="text-[10px] text-gray-400">{tema.preguntas} preguntas</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
        {temasFiltrados.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No se encontraron temas</p>
          </div>
        )}
      </div>
      <div className="px-4 pb-6">
        <div className="bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-xs">Progreso global</p>
              <p className="text-2xl font-bold">{Math.round(temas.reduce((acc, t) => acc + t.progreso, 0) / temas.length)}%</p>
            </div>
            <div className="text-right">
              <p className="text-purple-200 text-xs">Total preguntas</p>
              <p className="text-2xl font-bold">{temas.reduce((acc, t) => acc + t.preguntas, 0)}</p>
            </div>
          </div>
          <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div className="h-full bg-white rounded-full" initial={{ width: 0 }}
              animate={{ width: `${Math.round(temas.reduce((acc, t) => acc + t.progreso, 0) / temas.length)}%` }} transition={spring.smooth} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// PROPUESTA B - Grid de Bloques
// ============================================

function TemasGridBloques({ temas = temasAGECompleto, onTemaClick }) {
  const [expandedTema, setExpandedTema] = useState(null);
  const [filtroBloque, setFiltroBloque] = useState('todos');

  const bloques = ['todos', ...new Set(temas.map(t => t.bloque))];
  const temasFiltrados = filtroBloque === 'todos' ? temas : temas.filter(t => t.bloque === filtroBloque);

  const getEstadoBgColor = (estado) => {
    const colors = { dominado: 'bg-emerald-50', avanzando: 'bg-purple-50', progreso: 'bg-blue-50', riesgo: 'bg-amber-50', nuevo: 'bg-gray-50' };
    return colors[estado] || colors.nuevo;
  };

  return (
    <motion.div className="min-h-screen bg-gradient-to-b from-rose-50/50 via-purple-50/30 to-violet-50/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="bg-white/80 backdrop-blur-lg border-b border-purple-100 sticky top-0 z-10 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <PieChart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Temario AGE</h1>
              <p className="text-xs text-gray-500">Vista de bloques</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-purple-600">{Math.round(temas.reduce((acc, t) => acc + t.progreso, 0) / temas.length)}%</p>
            <p className="text-xs text-gray-500">completado</p>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {bloques.map((bloque) => (
            <motion.button key={bloque} onClick={() => setFiltroBloque(bloque)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all
                ${filtroBloque === bloque ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25' : 'bg-white text-gray-600 border border-gray-200'}`}
              whileTap={{ scale: 0.95 }}>
              {bloque === 'todos' ? 'Todos' : bloque}
            </motion.button>
          ))}
        </div>
      </div>
      <div className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {temasFiltrados.map((tema, index) => {
            const config = estadoConfig[tema.estado] || estadoConfig.nuevo;
            const Icon = config.icon;
            const isExpanded = expandedTema === tema.id;
            return (
              <motion.div key={tema.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }} layout className={`${isExpanded ? 'col-span-2' : ''}`}>
                <motion.button onClick={() => setExpandedTema(isExpanded ? null : tema.id)}
                  className={`w-full ${getEstadoBgColor(tema.estado)} rounded-2xl p-4 border ${tema.estado === 'riesgo' ? 'border-amber-200' : 'border-gray-100'} text-left relative overflow-hidden`}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} layout>
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
                    <motion.div className={`h-full bg-gradient-to-r ${config.gradient}`} initial={{ width: 0 }} animate={{ width: `${tema.progreso}%` }} transition={spring.smooth} />
                  </div>
                  <div className="pt-2">
                    <div className="flex items-start justify-between mb-2">
                      <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${config.text}`} />
                      </div>
                      <span className="text-lg font-bold text-gray-800">{tema.progreso}%</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">T{tema.id}</p>
                    <p className={`text-sm font-semibold text-gray-800 ${isExpanded ? '' : 'line-clamp-2'} leading-tight mb-2`}>{tema.nombre}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${config.bg} ${config.text} font-medium`}>{config.label}</span>
                      <span className="text-[10px] text-gray-400">{tema.preguntas} preg.</span>
                    </div>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                          <motion.button onClick={(e) => { e.stopPropagation(); onTemaClick?.(tema); }}
                            className="w-full py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2" whileTap={{ scale: 0.98 }}>
                            <Zap className="w-4 h-4" /> Test rapido
                          </motion.button>
                          <div className="grid grid-cols-2 gap-2">
                            <button className="py-2 bg-white rounded-lg text-xs font-medium text-gray-600 border border-gray-200">Simulacro</button>
                            <button className="py-2 bg-white rounded-lg text-xs font-medium text-gray-600 border border-gray-200">Repasar</button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>
      <div className="px-4 pb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-xs font-medium text-gray-500 mb-3">Leyenda de estados</p>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(estadoConfig).slice(0, 5).map(([key, config]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${config.gradient}`} />
                <span className="text-[10px] text-gray-500">{config.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// PROPUESTA C - Fortaleza Expandida
// ============================================

function TemasFortalezaExpandida({ temas = temasAGECompleto, onTemaClick }) {
  const [selectedTorre, setSelectedTorre] = useState(null);

  const torres = [
    { id: 'constitucion', nombre: 'Torre de la Constitucion', emoji: '🏛️', bloques: ['Constitucion'] },
    { id: 'organizacion', nombre: 'Torre de la Organizacion', emoji: '🏢', bloques: ['Organizacion'] },
    { id: 'funcion', nombre: 'Torre de la Funcion Publica', emoji: '👥', bloques: ['Funcion Publica'] },
    { id: 'procedimiento', nombre: 'Torre del Procedimiento', emoji: '📋', bloques: ['Procedimiento'] },
    { id: 'ofimatica', nombre: 'Torre Digital', emoji: '💻', bloques: ['Ofimatica'] },
  ];

  const getTorreStats = (torre) => {
    const temasTorre = temas.filter(t => torre.bloques.includes(t.bloque));
    const progreso = temasTorre.length > 0 ? Math.round(temasTorre.reduce((acc, t) => acc + t.progreso, 0) / temasTorre.length) : 0;
    const dominados = temasTorre.filter(t => t.estado === 'dominado').length;
    const enRiesgo = temasTorre.filter(t => t.estado === 'riesgo').length;
    return { temasTorre, progreso, dominados, enRiesgo, total: temasTorre.length };
  };

  const getTorreLevel = (progreso) => {
    if (progreso >= 90) return { level: 5, label: 'Maestro', color: 'from-amber-400 to-yellow-500' };
    if (progreso >= 70) return { level: 4, label: 'Avanzado', color: 'from-emerald-400 to-emerald-500' };
    if (progreso >= 50) return { level: 3, label: 'Intermedio', color: 'from-purple-400 to-purple-500' };
    if (progreso >= 25) return { level: 2, label: 'Aprendiz', color: 'from-blue-400 to-blue-500' };
    return { level: 1, label: 'Iniciado', color: 'from-gray-400 to-gray-500' };
  };

  const globalProgreso = Math.round(temas.reduce((acc, t) => acc + t.progreso, 0) / temas.length);
  const totalPreguntas = temas.reduce((acc, t) => acc + t.preguntas, 0);
  const temasDominados = temas.filter(t => t.estado === 'dominado').length;
  const temasEnRiesgo = temas.filter(t => t.estado === 'riesgo').length;

  return (
    <motion.div className="min-h-screen bg-gradient-to-b from-rose-50/50 via-purple-50/30 to-violet-50/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 px-4 pt-6 pb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🏰</span>
            <div>
              <h1 className="text-xl font-bold text-white">Tu Fortaleza</h1>
              <p className="text-purple-200 text-sm">Construye tu conocimiento</p>
            </div>
          </div>
          <div className="flex items-center gap-6 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                <motion.circle cx="40" cy="40" r="32" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round"
                  initial={{ strokeDasharray: "0 201" }} animate={{ strokeDasharray: `${(globalProgreso / 100) * 201} 201` }} transition={spring.smooth} />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white">{globalProgreso}%</span>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-3">
              <div><p className="text-2xl font-bold text-white">{temasDominados}</p><p className="text-xs text-purple-200">Temas dominados</p></div>
              <div><p className="text-2xl font-bold text-amber-300">{temasEnRiesgo}</p><p className="text-xs text-purple-200">Necesitan atencion</p></div>
              <div><p className="text-2xl font-bold text-white">{totalPreguntas}</p><p className="text-xs text-purple-200">Preguntas totales</p></div>
              <div><p className="text-2xl font-bold text-white">{temas.length}</p><p className="text-xs text-purple-200">Temas en total</p></div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 py-4 -mt-4 space-y-3">
        {torres.map((torre, index) => {
          const stats = getTorreStats(torre);
          const levelInfo = getTorreLevel(stats.progreso);
          const isSelected = selectedTorre === torre.id;
          return (
            <motion.div key={torre.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} layout>
              <motion.button onClick={() => setSelectedTorre(isSelected ? null : torre.id)}
                className={`w-full bg-white rounded-2xl border ${stats.enRiesgo > 0 ? 'border-amber-200' : 'border-gray-100'} shadow-sm overflow-hidden text-left`}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} layout>
                <div className="h-1.5 bg-gray-100">
                  <motion.div className={`h-full bg-gradient-to-r ${levelInfo.color}`} initial={{ width: 0 }} animate={{ width: `${stats.progreso}%` }}
                    transition={{ delay: 0.3 + index * 0.1, ...spring.smooth }} />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{torre.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800">{torre.nombre}</h3>
                        {stats.enRiesgo > 0 && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-medium">
                            <AlertTriangle className="w-3 h-3" /> {stats.enRiesgo}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${levelInfo.color} text-white font-medium`}>
                          Nv.{levelInfo.level} {levelInfo.label}
                        </span>
                        <span className="text-xs text-gray-500">{stats.total} temas</span>
                        <span className="text-xs text-emerald-600">{stats.dominados} dominados</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800">{stats.progreso}%</p>
                      <motion.div animate={{ rotate: isSelected ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="w-5 h-5 text-gray-400 mx-auto" />
                      </motion.div>
                    </div>
                  </div>
                </div>
                <AnimatePresence>
                  {isSelected && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="border-t border-gray-100">
                      <div className="p-3 space-y-2">
                        {stats.temasTorre.map((tema) => {
                          const config = estadoConfig[tema.estado] || estadoConfig.nuevo;
                          const Icon = config.icon;
                          return (
                            <motion.button key={tema.id} onClick={(e) => { e.stopPropagation(); onTemaClick?.(tema); }}
                              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors" whileTap={{ scale: 0.98 }}>
                              <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
                                <Icon className={`w-4 h-4 ${config.text}`} />
                              </div>
                              <div className="flex-1 text-left">
                                <p className="text-sm font-medium text-gray-700"><span className="text-gray-400">T{tema.id}</span> {tema.nombre}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full bg-gradient-to-r ${config.gradient} rounded-full`} style={{ width: `${tema.progreso}%` }} />
                                  </div>
                                  <span className="text-[10px] text-gray-500">{tema.progreso}%</span>
                                </div>
                              </div>
                              <div className="text-right"><span className="text-[10px] text-gray-400">{tema.preguntas} preg.</span></div>
                              <ChevronRight className="w-4 h-4 text-gray-300" />
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          );
        })}
      </div>
      <div className="px-4 pb-6">
        <motion.button className="w-full bg-gradient-to-r from-purple-500 to-violet-600 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Sparkles className="w-5 h-5" /> Continuar donde lo dejaste
        </motion.button>
      </div>
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
    { id: 'momentum-fortaleza', label: '🏰 Soft+Fort' },
    { id: 'temas-lista', label: '📚 Temas A' },
    { id: 'temas-grid', label: '📚 Temas B' },
    { id: 'temas-fortaleza', label: '📚 Temas C' },
    { id: 'proposals', label: '💡 Propuestas' },
    { id: 'recursos', label: '📖 Recursos' },
    { id: 'activities', label: '📈 Actividad' },
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

          {/* MOMENTUM SOFT + FORTALEZA */}
          {activeTab === 'momentum-fortaleza' && (
            <motion.div
              key="momentum-fortaleza"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-sm text-rose-800 mb-4">
                <strong>🏰 Soft + Fortaleza:</strong> Reemplaza "Esta semana" y "Todos los temas" por Tu Fortaleza
              </div>
              <HomeMomentumFortaleza
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

          {/* PROPUESTA A - Temas Lista Clasica Mejorada */}
          {activeTab === 'temas-lista' && (
            <motion.div
              key="temas-lista"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-sm text-purple-800 mb-4">
                <strong>📚 Propuesta A - Lista Clasica Mejorada:</strong> Lista vertical con busqueda, filtros por estado, agrupacion por bloques y contador de preguntas
              </div>
              <TemasListaClasica onTemaClick={(tema) => setSelectedTema(tema)} />
            </motion.div>
          )}

          {/* PROPUESTA B - Temas Grid de Bloques */}
          {activeTab === 'temas-grid' && (
            <motion.div
              key="temas-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-violet-50 border border-violet-200 rounded-xl p-3 text-sm text-violet-800 mb-4">
                <strong>📚 Propuesta B - Grid de Bloques:</strong> Temas en grid compacto color-coded, expandibles al click para acciones rapidas
              </div>
              <TemasGridBloques onTemaClick={(tema) => setSelectedTema(tema)} />
            </motion.div>
          )}

          {/* PROPUESTA C - Temas Fortaleza Expandida */}
          {activeTab === 'temas-fortaleza' && (
            <motion.div
              key="temas-fortaleza"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-sm text-indigo-800 mb-4">
                <strong>📚 Propuesta C - Fortaleza Expandida:</strong> Torres por bloque con niveles, progreso global y gamificacion visual
              </div>
              <TemasFortalezaExpandida onTemaClick={(tema) => setSelectedTema(tema)} />
            </motion.div>
          )}

          {/* RECURSOS PAGE */}
          {activeTab === 'recursos' && (
            <motion.div
              key="recursos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-sm text-rose-800 mb-4">
                <strong>📖 Recursos:</strong> Biblioteca de recursos con categorias expandibles, busqueda y favoritos
              </div>
              <RecursosPage />
            </motion.div>
          )}

          {/* ACTIVITIES PAGE */}
          {activeTab === 'activities' && (
            <motion.div
              key="activities"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-sm text-purple-800 mb-4">
                <strong>📈 Actividad:</strong> Página de actividades con "Esta semana" y estadísticas mensuales
              </div>
              <ActivitiesPage />
            </motion.div>
          )}

          {/* MOMENTUM - Purple */}
          {activeTab === 'momentum-purple' && (
            <motion.div
              key="momentum-purple"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-sm text-purple-800 mb-4">
                <strong>💜 Purple:</strong> Gradiente púrpura · Cohesivo con la app
              </div>
              <HomeMomentum
                temas={demoTemas}
                theme="purple"
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

          {/* MOMENTUM - White */}
          {activeTab === 'momentum-white' && (
            <motion.div
              key="momentum-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-700 mb-4">
                <strong>⚪ White:</strong> Limpio y minimalista · Apple-style
              </div>
              <HomeMomentum
                temas={demoTemas}
                theme="white"
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

          {/* FEATURE PROPOSALS PAGE */}
          {activeTab === 'proposals' && (
            <motion.div
              key="proposals"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FeatureProposalsPage />
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
