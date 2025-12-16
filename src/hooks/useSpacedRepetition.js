/**
 * useSpacedRepetition Hook
 * React hook for managing spaced repetition study sessions
 */

import { useState, useEffect, useCallback } from 'react';
import {
  generateHybridSession,
  updateProgress,
  getStudyStats,
  getDueReviews,
  recordDailyStudy,
  getWeeklyProgress
} from '../services/spacedRepetitionService';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook for managing a study session
 */
export function useStudySession(config = {}) {
  const { user, isAnonymous } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    total: 0,
    answered: 0,
    correct: 0,
    reviews: 0
  });
  const [error, setError] = useState(null);

  // Load session
  const loadSession = useCallback(async (sessionConfig = config) => {
    if (!user?.id || isAnonymous) {
      setError('Inicia sesión para usar el repaso espaciado');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const sessionQuestions = await generateHybridSession(user.id, sessionConfig);

      if (sessionQuestions.length === 0) {
        setError('No hay preguntas disponibles');
        setQuestions([]);
      } else {
        setQuestions(sessionQuestions);
        setCurrentIndex(0);
        setSessionStats({
          total: sessionQuestions.length,
          answered: 0,
          correct: 0,
          reviews: sessionQuestions.filter(q => q.isReview).length
        });
      }
    } catch (err) {
      console.error('Error loading session:', err);
      setError('Error al cargar la sesión');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, isAnonymous, config]);

  // Answer current question
  const answerQuestion = useCallback(async (wasCorrect) => {
    if (!user?.id || currentIndex >= questions.length) return;

    const currentQuestion = questions[currentIndex];

    try {
      // Update progress in database
      await updateProgress(user.id, currentQuestion.id, wasCorrect);

      // Update session stats
      setSessionStats(prev => ({
        ...prev,
        answered: prev.answered + 1,
        correct: prev.correct + (wasCorrect ? 1 : 0)
      }));

      // Move to next question
      setCurrentIndex(prev => prev + 1);
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  }, [user?.id, currentIndex, questions]);

  // Complete session
  const completeSession = useCallback(async () => {
    if (!user?.id) return;

    try {
      await recordDailyStudy(user.id, sessionStats.answered, sessionStats.correct);
    } catch (err) {
      console.error('Error recording session:', err);
    }
  }, [user?.id, sessionStats]);

  // Get current question
  const currentQuestion = questions[currentIndex] || null;
  const isComplete = currentIndex >= questions.length && questions.length > 0;
  const progress = questions.length > 0 ? (currentIndex / questions.length) * 100 : 0;

  return {
    questions,
    currentQuestion,
    currentIndex,
    isLoading,
    error,
    sessionStats,
    isComplete,
    progress,
    loadSession,
    answerQuestion,
    completeSession
  };
}

/**
 * Hook for study dashboard stats
 */
export function useStudyStats() {
  const { user, isAnonymous } = useAuth();
  const [stats, setStats] = useState(null);
  const [weeklyProgress, setWeeklyProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadStats = useCallback(async () => {
    if (!user?.id || isAnonymous) return;

    setIsLoading(true);

    try {
      const [statsData, weeklyData] = await Promise.all([
        getStudyStats(user.id),
        getWeeklyProgress(user.id)
      ]);

      setStats(statsData);
      setWeeklyProgress(weeklyData);
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, isAnonymous]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    weeklyProgress,
    isLoading,
    refreshStats: loadStats
  };
}

/**
 * Hook for due reviews count (for notifications)
 */
export function useDueReviews() {
  const { user, isAnonymous } = useAuth();
  const [dueCount, setDueCount] = useState(0);

  useEffect(() => {
    async function fetchDueCount() {
      if (!user?.id || isAnonymous) {
        setDueCount(0);
        return;
      }

      try {
        const dueReviews = await getDueReviews(user.id, { limit: 100 });
        setDueCount(dueReviews.length);
      } catch (err) {
        console.error('Error fetching due reviews:', err);
      }
    }

    fetchDueCount();

    // Refresh every 5 minutes
    const interval = setInterval(fetchDueCount, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user?.id, isAnonymous]);

  return dueCount;
}

export default {
  useStudySession,
  useStudyStats,
  useDueReviews
};
