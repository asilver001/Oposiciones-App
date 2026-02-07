import { motion } from 'framer-motion';
import { Trophy, Target, XCircle } from 'lucide-react';

export default function ProgressModal({
  onClose,
  todayQuestions = 0,
  dailyGoal = 15,
  testsCompleted = 0,
  accuracyRate = 0,
  daysUntilExam = null,
  totalProgress = 0,
  onContinueStudying,
}) {
  const progressPercent = Math.min(Math.round((todayQuestions / dailyGoal) * 100), 100);
  const circumference = 352; // 2 * PI * 56
  const strokeDasharray = `${Math.min((todayQuestions / dailyGoal) * circumference, circumference)} ${circumference}`;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 z-50"
        onClick={onClose}
      />

      {/* Side Panel - slides from left */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed inset-y-0 left-0 w-80 sm:w-96 bg-white z-50 shadow-2xl overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Tu progreso de hoy</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <XCircle className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Large progress ring */}
          <div className="flex flex-col items-center py-4">
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" fill="none" stroke="#F3E8FF" strokeWidth="12" />
                <circle
                  cx="64" cy="64" r="56"
                  fill="none" stroke="#8B5CF6" strokeWidth="12"
                  strokeDasharray={strokeDasharray}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">{progressPercent}%</span>
              </div>
            </div>
            <p className="text-gray-600">
              <span className="text-2xl font-bold text-gray-900">{todayQuestions}</span>
              <span className="text-gray-500">/{dailyGoal} preguntas</span>
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {todayQuestions >= dailyGoal
                ? 'Objetivo cumplido!'
                : `Te quedan ${Math.max(0, dailyGoal - todayQuestions)} preguntas`}
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-4 h-4 text-brand-500" />
                <span className="text-xs text-gray-500 font-medium">Tests completados</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{testsCompleted}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-green-500" />
                <span className="text-xs text-gray-500 font-medium">Tasa de acierto</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{accuracyRate}%</p>
            </div>
          </div>

          {/* Exam info */}
          <div className="bg-brand-50 rounded-xl p-4">
            {daysUntilExam ? (
              <p className="text-gray-700 text-sm">
                Te quedan <span className="font-bold text-brand-600">{daysUntilExam} dias</span> para tu examen
              </p>
            ) : (
              <p className="text-gray-600 text-sm">
                Aun no tienes fecha de examen
              </p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              Llevas <span className="font-semibold">{totalProgress}%</span> del temario
            </p>
          </div>

          {/* CTA button */}
          {todayQuestions < dailyGoal && onContinueStudying && (
            <button
              onClick={() => {
                onClose();
                onContinueStudying();
              }}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-4 rounded-xl transition-all active:scale-[0.98]"
            >
              Continuar estudiando
            </button>
          )}
        </div>
      </motion.div>
    </>
  );
}
