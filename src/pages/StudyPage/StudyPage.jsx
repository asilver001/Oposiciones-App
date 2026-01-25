import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStudyStore, useUserStore } from '../../stores';
import { allQuestions, getRandomQuestions, getQuestionsByTopic } from '../../data/questions';
import { ArrowLeft, Target, Clock } from 'lucide-react';

export default function StudyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { questions, setQuestions, resetSession } = useStudyStore();
  const { userData } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize study session
    const initSession = async () => {
      try {
        // Check if a specific topic was requested
        const topicId = location.state?.topicId;

        let sessionQuestions;
        if (topicId) {
          // Get questions for specific topic
          sessionQuestions = getQuestionsByTopic(topicId);
          // Shuffle and limit to daily goal
          const shuffled = [...sessionQuestions].sort(() => Math.random() - 0.5);
          sessionQuestions = shuffled.slice(0, userData.dailyGoal || 15);
        } else {
          // Get random questions based on user preferences
          sessionQuestions = getRandomQuestions(
            userData.dailyGoal || 15,
            null // 'all' topics
          );
        }

        setQuestions(sessionQuestions);
      } catch (error) {
        console.error('Error initializing study session:', error);
        // Fallback to random questions
        const fallbackQuestions = getRandomQuestions(userData.dailyGoal || 15);
        setQuestions(fallbackQuestions);
      } finally {
        setIsLoading(false);
      }
    };

    initSession();

    return () => {
      // Cleanup on unmount
      resetSession();
    };
  }, [setQuestions, resetSession, userData.dailyGoal, location.state?.topicId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparando sesión...</p>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50 p-4">
        <div className="max-w-md mx-auto text-center bg-white rounded-2xl shadow-lg p-8">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No hay preguntas disponibles
          </h2>
          <p className="text-gray-600 mb-6">
            No se encontraron preguntas para esta sesión.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // Placeholder for now - will integrate HybridSession component later
  return (
    <div className="min-h-screen bg-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-purple-600">
              <Target className="w-4 h-4" />
              <span>{questions.length} preguntas</span>
            </div>
          </div>
        </div>

        {/* Study Session Placeholder */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Sesión de Estudio
          </h2>
          <p className="text-gray-600 mb-6">
            {questions.length} preguntas listas para comenzar
          </p>
          <button
            onClick={() => {
              // TODO: Start study session with HybridSession component
              alert('HybridSession component will be integrated here');
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors"
          >
            Comenzar Test
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600">
              {userData.dailyGoal || 15}
            </div>
            <div className="text-xs text-gray-600">Meta diaria</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600">
              {userData.examDate || '—'}
            </div>
            <div className="text-xs text-gray-600">Fecha examen</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600">
              {questions.length}
            </div>
            <div className="text-xs text-gray-600">Preguntas hoy</div>
          </div>
        </div>
      </div>
    </div>
  );
}
