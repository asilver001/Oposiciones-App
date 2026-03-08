/**
 * AnalyticsWidgets - Advanced analytics visualization widgets
 *
 * Components:
 * - ReadinessGauge: Circular readiness score (0-100%)
 * - VelocityCard: Learning velocity with trend
 * - TopicStrengthBars: Per-topic accuracy bars
 * - ReadinessPrediction: Estimated days to ready
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Brain,
  BarChart3,
  Calendar,
  Minus
} from 'lucide-react';

const LEVEL_LABELS = {
  inicial: 'Inicial',
  en_progreso: 'En progreso',
  avanzado: 'Avanzado',
  preparado: 'Preparado'
};

// Topic names aligned with DB continuous numbering (T1-T28)
const TOPIC_NAMES = {
  1: 'T1 - Constitución Española',
  2: 'T2 - Transparencia',
  3: 'T3 - AGE',
  4: 'T4 - CCAA y Adm. Local',
  5: 'T5 - Unión Europea',
  6: 'T6 - LPAC + LRJSP',
  7: 'T7 - Protección de Datos',
  8: 'T8 - Cortes Generales',
  9: 'T9 - Personal funcionario',
  10: 'T10 - Derechos funcionarios',
  11: 'T11 - Poder Judicial',
  12: 'T12 - Presupuestos del Estado',
  13: 'T13 - Igualdad y derechos',
  14: 'T14 - Tribunal Constitucional',
  15: 'T15 - Gobierno',
  16: 'T16 - Gobierno Abierto',
};

/**
 * Circular gauge showing readiness score
 */
export function ReadinessGauge({ readiness }) {
  const { score, breakdown, level } = readiness;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const strokeColor = 'stroke-gray-900';
  const textColor = 'text-gray-900';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-gray-600" />
        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Preparacion</h4>
      </div>

      <div className="flex items-center gap-6">
        {/* Circular gauge */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60" cy="60" r={radius}
              fill="none"
              strokeWidth="8"
              className="stroke-gray-100 dark:stroke-gray-700"
            />
            <motion.circle
              cx="60" cy="60" r={radius}
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              className={strokeColor}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${textColor}`}>{score}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">/ 100</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="flex-1 space-y-2">
          <p className={`text-sm font-semibold ${textColor}`}>
            {LEVEL_LABELS[level]}
          </p>
          <div className="space-y-1.5 text-xs">
            <BreakdownRow label="Dominio" value={breakdown.mastery} />
            <BreakdownRow label="Acierto" value={breakdown.accuracy} />
            <BreakdownRow label="Cobertura" value={breakdown.coverage} />
            <BreakdownRow label="Constancia" value={breakdown.consistency} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function BreakdownRow({ label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500 dark:text-gray-400 w-20">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gray-900 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <span className="text-gray-700 dark:text-gray-300 w-8 text-right font-medium">{value}%</span>
    </div>
  );
}

/**
 * Learning velocity with trend indicator
 */
export function VelocityCard({ velocity }) {
  const { currentVelocity, trend } = velocity;

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = 'text-gray-600';
  const trendBg = 'bg-gray-100';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex-1"
    >
      <div className="flex items-center gap-2 mb-2">
        <BarChart3 className="w-4 h-4 text-gray-600" />
        <span className="text-xs text-gray-500 dark:text-gray-400">Velocidad</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{currentVelocity}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">preg/semana</span>
      </div>
      <div className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full ${trendBg}`}>
        <TrendIcon className={`w-3.5 h-3.5 ${trendColor}`} />
        <span className={`text-xs font-medium ${trendColor}`}>
          {trend === 'up' ? 'Subiendo' : trend === 'down' ? 'Bajando' : 'Estable'}
        </span>
      </div>
    </motion.div>
  );
}

/**
 * Per-topic accuracy bars sorted by weakest first
 */
export function TopicStrengthBars({ topicStrength }) {
  const { topics } = topicStrength;

  if (!topics || topics.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-5 h-5 text-gray-600" />
        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Fortaleza por tema</h4>
      </div>

      <div className="space-y-2.5">
        {topics.map((topic, idx) => {
          const barColor = 'bg-gray-900';
          const textColor = 'text-gray-600';

          const topicLabel = TOPIC_NAMES[topic.tema] || `Tema ${topic.tema}`;

          return (
            <motion.div
              key={topic.tema}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * idx }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-700 dark:text-gray-300 truncate flex-1 mr-2">{topicLabel}</span>
                <span className={`text-xs font-semibold ${textColor}`}>{topic.accuracy}%</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${barColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${topic.accuracy}%` }}
                  transition={{ duration: 0.6, delay: 0.05 * idx }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

/**
 * Prediction card showing estimated days to readiness
 */
export function ReadinessPrediction({ prediction }) {
  const { days, targetDate, confidence } = prediction;

  if (days === null) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex-1"
      >
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4 text-gray-600" />
          <span className="text-xs text-gray-500 dark:text-gray-400">Prediccion</span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Necesitas mas sesiones para estimar
        </p>
      </motion.div>
    );
  }

  const confidenceLabel = confidence === 'high' ? 'Alta' : confidence === 'medium' ? 'Media' : 'Baja';
  const confidenceColor = 'bg-gray-100 text-gray-600';

  const formattedDate = targetDate
    ? new Date(targetDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex-1"
    >
      <div className="flex items-center gap-2 mb-2">
        <Calendar className="w-4 h-4 text-gray-600" />
        <span className="text-xs text-gray-500 dark:text-gray-400">Prediccion</span>
      </div>
      <div className="flex items-end gap-1">
        {days > 730 ? (
          <>
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">+2</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">años</span>
          </>
        ) : days > 365 ? (
          <>
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">+1</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">año</span>
          </>
        ) : (
          <>
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">~{days}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">días</span>
          </>
        )}
      </div>
      {days <= 730 && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Objetivo: {formattedDate}
        </p>
      )}
      {days > 365 && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Sigue así, cada día cuenta
        </p>
      )}
      <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium ${confidenceColor}`}>
        Fiabilidad: {confidenceLabel}
      </span>
    </motion.div>
  );
}

/**
 * Not enough data message
 */
export function AnalyticsEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 text-center"
    >
      <Brain className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Necesitas completar mas sesiones
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Completa al menos 2 tests para ver tus analytics avanzados.
      </p>
    </motion.div>
  );
}
