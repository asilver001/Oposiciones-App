/**
 * NodeDetailSheet — Bottom sheet overlay when a topic node is selected.
 * Shows stats + CTA to start studying.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Lock, CheckCircle2, TrendingUp, AlertTriangle, X } from 'lucide-react';
import { STATUS_COLORS } from './temarioData';
import { isTopicUnlocked, getUnlockMessage, TOPIC_SHORT_NAMES } from '../../../data/topicPrerequisites';

const STATUS_LABELS = {
  dominado: { label: 'Dominado', icon: CheckCircle2, class: 'text-emerald-600 bg-emerald-50' },
  avanzando: { label: 'Avanzando', icon: TrendingUp, class: 'text-blue-600 bg-blue-50' },
  progreso: { label: 'En progreso', icon: BookOpen, class: 'text-purple-600 bg-purple-50' },
  nuevo: { label: 'Sin empezar', icon: BookOpen, class: 'text-gray-500 bg-gray-100' },
  riesgo: { label: 'Necesita repaso', icon: AlertTriangle, class: 'text-amber-600 bg-amber-50' },
};

export default function NodeDetailSheet({ node, userProgress = {}, onStudy, onClose }) {
  if (!node) return null;

  const unlocked = isTopicUnlocked(node.id, userProgress);
  const unlockMsg = getUnlockMessage(node.id, userProgress);
  const statusInfo = STATUS_LABELS[node.status] || STATUS_LABELS.nuevo;
  const StatusIcon = statusInfo.icon;

  return (
    <AnimatePresence>
      {node && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/10 z-10"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 z-20 bg-white rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] max-h-[60%] overflow-y-auto"
          >
            {/* Handle */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>

            <div className="px-5 pb-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ backgroundColor: node.bloqueColor }}
                  >
                    T{node.id}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">
                      {node.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{node.bloqueLabel}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-gray-100 shrink-0"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Status badge */}
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-3 ${statusInfo.class}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                {statusInfo.label}
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-gray-900">{node.accuracy}%</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Acierto</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-gray-900">{node.sessions}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Sesiones</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-gray-900">{node.questionCount}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Preguntas</p>
                </div>
              </div>

              {/* Prerequisites */}
              {node.dependencies.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1.5">Prerequisitos:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {node.dependencies.map(dep => {
                      const depProgress = userProgress[dep];
                      const depDone = depProgress && (depProgress.accuracy >= 65 || depProgress.masteryRate >= 50);
                      return (
                        <span
                          key={dep}
                          className={`text-xs px-2 py-0.5 rounded-full border ${
                            depDone
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                              : 'bg-gray-50 border-gray-200 text-gray-500'
                          }`}
                        >
                          {depDone && <span className="mr-0.5">&#10003;</span>}
                          T{dep} {TOPIC_SHORT_NAMES[dep]}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CTA */}
              {unlocked ? (
                <button
                  onClick={() => onStudy?.(node)}
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl transition-all active:scale-[0.98] text-sm"
                >
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  Estudiar Tema {node.id}
                </button>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                  <Lock className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                  <p className="text-xs text-amber-700">{unlockMsg || 'Completa los prerequisitos'}</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
