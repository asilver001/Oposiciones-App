/**
 * useSpacedRepetition Hook
 * React hook for managing spaced repetition study sessions
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  generateHybridSession,
  updateProgress,
  getStudyStats,
  getDueReviews,
  recordDailyStudy,
  recordTestSession,
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
  const sessionStartRef = useRef(null);

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
        sessionStartRef.current = new Date().toISOString();
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

    // Always update session stats and advance, regardless of DB result
    setSessionStats(prev => ({
      ...prev,
      answered: prev.answered + 1,
      correct: prev.correct + (wasCorrect ? 1 : 0)
    }));
    setCurrentIndex(prev => prev + 1);

    // Update progress in database (fire-and-forget, don't block session)
    try {
      await updateProgress(user.id, currentQuestion.id, wasCorrect);
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  }, [user?.id, currentIndex, questions]);

  // Complete session - save to both test_sessions and study_history
  const completeSession = useCallback(async () => {
    if (!user?.id) return;

    const now = new Date().toISOString();
    const startedAt = sessionStartRef.current || now;
    const timeSeconds = Math.round((new Date(now) - new Date(startedAt)) / 1000);

    try {
      // Save individual session to test_sessions (read by home page)
      await recordTestSession(user.id, {
        correctCount: sessionStats.correct,
        totalQuestions: sessionStats.answered,
        startedAt,
        completedAt: now,
        timeSeconds,
        testType: config.mode || 'practice'
      });

      // Also save daily aggregate to study_history
      await recordDailyStudy(user.id, sessionStats.answered, sessionStats.correct);
    } catch (err) {
      console.error('Error recording session:', err);
    }
  }, [user?.id, sessionStats, config.mode]);

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
