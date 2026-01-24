import React from 'react';
import { Brain, Flame, Target, BookOpen, TrendingUp, Play, Calendar, Award } from 'lucide-react';
import { useStudyStats } from '../../hooks/useSpacedRepetition';
import EmptyState from '../common/EmptyState';

export default function StudyDashboard({ onStartSession }) {
  const { stats, weeklyProgress, isLoading } = useStudyStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Inicia sesión para ver tu progreso</p>
      </div>
    );
  }

  // Check if user has no study activity yet
  const hasNoActivity = stats.totalStudied === 0 && stats.streak === 0;

  if (hasNoActivity) {
    return (
      <EmptyState
        icon={Play}
        title="Aún no has comenzado ninguna sesión"
        description="Empieza tu primera sesión de estudio y comienza a construir tu racha de aprendizaje."
        actionLabel="Comenzar primera sesión"
        onAction={onStartSession}
        variant="purple"
      />
    );
  }

  const maxQuestions = Math.max(...weeklyProgress.map(d => d.questions), 1);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Brain className="w-6 h-6" />
          Tu Sesión de Estudio
        </h2>
        <p className="text-purple-100 text-sm mb-4">
          Repaso espaciado + preguntas nuevas mezcladas inteligentemente
        </p>

        {/* Due Today Alert */}
        {stats.dueToday > 0 && (
          <div className="bg-white/10 rounded-xl p-4 mb-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-yellow-300" />
              <div>
                <p className="font-semibold text-lg">{stats.dueToday} preguntas para repasar hoy</p>
                <p className="text-purple-200 text-sm">No pierdas tu racha de estudio</p>
              </div>
            </div>
          </div>
        )}

        {/* Start Button */}
        <button
          onClick={() => onStartSession?.()}
          className="w-full bg-white text-purple-700 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-purple-50 transition shadow-lg"
        >
          <Play className="w-5 h-5" />
          Empezar sesión de estudio
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Streak */}
        <div className="bg-orange-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-orange-700">Racha</span>
          </div>
          <p className="text-3xl font-bold text-orange-600">{stats.streak}</p>
          <p className="text-xs text-orange-500">días seguidos</p>
        </div>

        {/* Retention */}
        <div className="bg-green-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-green-700">Retención</span>
          </div>
          <p className="text-3xl font-bold text-green-600">{stats.retention}%</p>
          <p className="text-xs text-green-500">respuestas correctas</p>
        </div>

        {/* Mastered */}
        <div className="bg-purple-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-purple-700">Dominadas</span>
          </div>
          <p className="text-3xl font-bold text-purple-600">{stats.mastered}</p>
          <p className="text-xs text-purple-500">preguntas</p>
        </div>

        {/* Total Studied */}
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-blue-700">Estudiadas</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">{stats.totalStudied}</p>
          <p className="text-xs text-blue-500">total</p>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-700">Progreso semanal</h3>
        </div>

        <div className="flex items-end justify-between gap-2 h-32">
          {weeklyProgress.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center justify-end h-24">
                {/* Bar */}
                <div
                  className="w-full bg-purple-500 rounded-t-lg transition-all duration-300"
                  style={{
                    height: `${(day.questions / maxQuestions) * 100}%`,
                    minHeight: day.questions > 0 ? '8px' : '0px',
                    opacity: day.questions > 0 ? 1 : 0.2,
                    backgroundColor: day.questions > 0 ? undefined : '#e5e7eb'
                  }}
                />
              </div>
              {/* Day label */}
              <p className="text-xs text-gray-500 mt-2">{day.day}</p>
              {/* Count */}
              {day.questions > 0 && (
                <p className="text-xs font-medium text-purple-600">{day.questions}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Learning Status */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
        <h3 className="font-semibold text-gray-700 mb-3">Estado de aprendizaje</h3>
        <div className="space-y-2">
          {/* Learning */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Aprendiendo</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full"
                  style={{ width: `${stats.totalStudied > 0 ? (stats.learning / stats.totalStudied) * 100 : 0}%` }}
                />
              </div>
              <span className="text-sm font-medium text-yellow-600 w-8">{stats.learning}</span>
            </div>
          </div>

          {/* Review */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">En repaso</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${stats.totalStudied > 0 ? (stats.review / stats.totalStudied) * 100 : 0}%` }}
                />
              </div>
              <span className="text-sm font-medium text-blue-600 w-8">{stats.review || 0}</span>
            </div>
          </div>

          {/* Mastered */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Dominadas</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${stats.totalStudied > 0 ? (stats.mastered / stats.totalStudied) * 100 : 0}%` }}
                />
              </div>
              <span className="text-sm font-medium text-green-600 w-8">{stats.mastered}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
