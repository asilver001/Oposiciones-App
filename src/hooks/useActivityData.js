/**
 * Activity Data Hook
 * Fetches and processes activity data for the Activity tab
 * Uses test_sessions table from Supabase
 */

import { useState, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

/**
 * Hook for fetching activity data from Supabase
 * @returns {Object} Activity data and fetch functions
 */
export function useActivityData() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Data states
  const [weeklyData, setWeeklyData] = useState([0, 0, 0, 0, 0, 0, 0]); // L-D
  const [sessionHistory, setSessionHistory] = useState([]);
  const [calendarData, setCalendarData] = useState([]); // Days practiced this month
  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const [totalStats, setTotalStats] = useState({
    testsCompleted: 0,
    questionsCorrect: 0,
    totalQuestions: 0,
    accuracyRate: 0,
    daysStudied: 0
  });
  const [todayStats, setTodayStats] = useState({
    questionsAnswered: 0,
    questionsCorrect: 0,
    testsCompleted: 0,
    accuracyRate: 0
  });
  const [weeklyImprovement, setWeeklyImprovement] = useState(0);
  const [leastPracticedTema, setLeastPracticedTema] = useState(null);

  // FSRS states breakdown
  const [fsrsStats, setFsrsStats] = useState({
    new: 0,        // Never seen questions
    learning: 0,   // Currently learning
    review: 0,     // In review cycle
    relearning: 0, // Failed and relearning
    mastered: 0,   // High accuracy
    total: 0       // Total questions in database
  });

  /**
   * Get the Monday of the current week
   */
  const getWeekStart = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust when Sunday
    const monday = new Date(now.getFullYear(), now.getMonth(), diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  /**
   * Get the first day of the current month
   */
  const getMonthStart = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  };

  /**
   * Fetch FSRS breakdown stats
   */
  const fetchFsrsStats = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Get total questions count
      const { count: totalQuestions } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Get per-topic progress from user_topic_progress
      const { data: topicData } = await supabase
        .from('user_topic_progress')
        .select('questions_seen, questions_correct, overall_accuracy_percent')
        .eq('user_id', user.id);

      const topics = topicData || [];
      const totalSeen = topics.reduce((sum, t) => sum + (t.questions_seen || 0), 0);

      // Per-topic mastery: count questions from topics with >=80% accuracy
      const masteredCount = topics
        .filter(t => (t.overall_accuracy_percent || 0) >= 80)
        .reduce((sum, t) => sum + (t.questions_seen || 0), 0);
      const learningCount = totalSeen - masteredCount;

      const stats = {
        new: 0,
        learning: learningCount,
        review: 0,
        relearning: 0,
        mastered: masteredCount,
        total: totalQuestions || 0,
        unseen: Math.max(0, (totalQuestions || 0) - totalSeen)
      };

      setFsrsStats(stats);
    } catch (err) {
      console.error('Error fetching FSRS stats:', err);
    }
  }, [user]);

  /**
   * Fetch all activity data from test_sessions table
   */
  const fetchActivityData = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const weekStart = getWeekStart();
      const monthStart = getMonthStart();

      // Fetch all sessions for this user from test_sessions table
      // ACTUAL columns: topic_id, correct_count, total_questions, time_seconds, percentage, status
      const { data: sessions, error: sessionsError } = await supabase
        .from('test_sessions')
        .select('id, user_id, topic_id, correct_count, total_questions, started_at, completed_at, time_seconds, percentage')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('started_at', { ascending: false });

      if (sessionsError) {
        console.error('Error fetching test_sessions:', sessionsError);
        setError(sessionsError.message);
        setLoading(false);
        return;
      }

      const allSessions = sessions || [];

      // Process weekly data (correct answers per day)
      const weeklyCorrect = [0, 0, 0, 0, 0, 0, 0]; // L, M, X, J, V, S, D
      const thisWeekSessions = allSessions.filter(s => {
        const sessionDate = new Date(s.started_at);
        return sessionDate >= weekStart;
      });

      thisWeekSessions.forEach(session => {
        const sessionDate = new Date(session.started_at);
        let dayIndex = sessionDate.getDay() - 1; // Monday = 0
        if (dayIndex === -1) dayIndex = 6; // Sunday = 6
        weeklyCorrect[dayIndex] += session.correct_count || 0;
      });

      setWeeklyData(weeklyCorrect);

      // Session history (last 10) - normalize column names for component compatibility
      const normalizedSessions = allSessions.slice(0, 10).map(s => ({
        ...s,
        // Add normalized names for backward compatibility with ActividadContent and useAnalytics
        correctas: s.correct_count,
        correct_answers: s.correct_count,
        total_preguntas: s.total_questions,
        // Normalize topic_id (INTEGER) to tema_filter (array) for backward compat
        tema_filter: s.topic_id != null ? [s.topic_id] : [],
        porcentaje_acierto: s.total_questions > 0
          ? Math.round((s.correct_count / s.total_questions) * 100)
          : (s.percentage || 0)
      }));
      setSessionHistory(normalizedSessions);

      // Calendar data (days practiced this month)
      const monthDays = new Set();
      allSessions.forEach(session => {
        const sessionDate = new Date(session.started_at);
        if (sessionDate >= monthStart) {
          monthDays.add(sessionDate.getDate());
        }
      });
      setCalendarData(Array.from(monthDays));

      // Calculate total stats
      const totalTests = allSessions.length;
      const totalCorrect = allSessions.reduce((sum, s) => sum + (s.correct_count || 0), 0);
      const totalQuestions = allSessions.reduce((sum, s) => sum + (s.total_questions || 0), 0);
      const avgAccuracy = totalQuestions > 0
        ? Math.round((totalCorrect / totalQuestions) * 100)
        : 0;

      // Calculate days studied (unique days with sessions)
      const studyDays = new Set();
      allSessions.forEach(session => {
        const d = new Date(session.started_at);
        studyDays.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
      });

      setTotalStats({
        testsCompleted: totalTests,
        questionsCorrect: totalCorrect,
        totalQuestions: totalQuestions,
        accuracyRate: avgAccuracy,
        daysStudied: studyDays.size
      });

      // Calculate today's stats
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todaySessions = allSessions.filter(s => new Date(s.started_at) >= todayStart);
      const todayCorrect = todaySessions.reduce((sum, s) => sum + (s.correct_count || 0), 0);
      const todayTotal = todaySessions.reduce((sum, s) => sum + (s.total_questions || 0), 0);
      setTodayStats({
        questionsAnswered: todayTotal,
        questionsCorrect: todayCorrect,
        testsCompleted: todaySessions.length,
        accuracyRate: todayTotal > 0 ? Math.round((todayCorrect / todayTotal) * 100) : 0
      });

      // Calculate streak (consecutive days)
      const sortedDays = Array.from(studyDays)
        .map(d => {
          const [y, m, day] = d.split('-').map(Number);
          return new Date(y, m, day);
        })
        .sort((a, b) => b - a); // Most recent first

      let currentStreak = 0;
      let longestStreak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Calculate longest streak from all study days
      if (sortedDays.length > 0) {
        // Sort ascending for longest streak calculation
        const ascending = [...sortedDays].sort((a, b) => a - b);
        let tempStreak = 1;
        for (let i = 1; i < ascending.length; i++) {
          const prev = new Date(ascending[i - 1]);
          const curr = new Date(ascending[i]);
          prev.setHours(0, 0, 0, 0);
          curr.setHours(0, 0, 0, 0);
          const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            tempStreak++;
          } else if (diffDays > 1) {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
        }
        longestStreak = Math.max(longestStreak, tempStreak);

        // Calculate current streak (must include today or yesterday)
        const lastStudyDay = new Date(sortedDays[0]);
        lastStudyDay.setHours(0, 0, 0, 0);

        if (lastStudyDay.getTime() === today.getTime() ||
            lastStudyDay.getTime() === yesterday.getTime()) {
          currentStreak = 1;
          let checkDate = new Date(lastStudyDay);

          for (let i = 1; i < sortedDays.length; i++) {
            checkDate.setDate(checkDate.getDate() - 1);
            const prevDay = new Date(sortedDays[i]);
            prevDay.setHours(0, 0, 0, 0);

            if (prevDay.getTime() === checkDate.getTime()) {
              currentStreak++;
            } else {
              break;
            }
          }
        }
      }
      setStreak({ current: currentStreak, longest: longestStreak });

      // Calculate weekly improvement (compare this week vs last week)
      const lastWeekStart = new Date(weekStart);
      lastWeekStart.setDate(lastWeekStart.getDate() - 7);

      const lastWeekSessions = allSessions.filter(s => {
        const d = new Date(s.started_at);
        return d >= lastWeekStart && d < weekStart;
      });

      // Calculate accuracy for this week
      const thisWeekCorrect = thisWeekSessions.reduce((sum, s) => sum + (s.correct_count || 0), 0);
      const thisWeekTotal = thisWeekSessions.reduce((sum, s) => sum + (s.total_questions || 0), 0);
      const thisWeekAvg = thisWeekTotal > 0 ? (thisWeekCorrect / thisWeekTotal) * 100 : 0;

      // Calculate accuracy for last week
      const lastWeekCorrect = lastWeekSessions.reduce((sum, s) => sum + (s.correct_count || 0), 0);
      const lastWeekTotal = lastWeekSessions.reduce((sum, s) => sum + (s.total_questions || 0), 0);
      const lastWeekAvg = lastWeekTotal > 0 ? (lastWeekCorrect / lastWeekTotal) * 100 : 0;

      const improvement = lastWeekAvg > 0
        ? Math.round(thisWeekAvg - lastWeekAvg)
        : 0;
      setWeeklyImprovement(improvement);

      // Find least practiced tema
      const temaLastPracticed = {};
      allSessions.forEach(session => {
        const topicId = session.topic_id; // INTEGER (single topic, not array)
        if (topicId != null) {
          const existing = temaLastPracticed[topicId];
          const sessionDate = new Date(session.started_at);
          if (!existing || sessionDate > existing) {
            temaLastPracticed[topicId] = sessionDate;
          }
        }
      });

      // Find tema with oldest last practice date
      let oldestTema = null;
      let oldestDate = null;
      Object.entries(temaLastPracticed).forEach(([tema, date]) => {
        if (!oldestDate || date < oldestDate) {
          oldestDate = date;
          oldestTema = parseInt(tema);
        }
      });

      // Only suggest if not practiced in last 7 days
      if (oldestDate) {
        const daysSince = Math.floor((new Date() - oldestDate) / (1000 * 60 * 60 * 24));
        if (daysSince >= 7) {
          setLeastPracticedTema({ tema: oldestTema, daysSince });
        } else {
          setLeastPracticedTema(null);
        }
      }

      setLoading(false);

      // Fetch FSRS stats in parallel
      fetchFsrsStats();

    } catch (err) {
      console.error('Error in fetchActivityData:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [user, fetchFsrsStats]);

  /**
   * Generate motivational message based on data
   */
  const motivationalMessage = useMemo(() => {
    if (totalStats.testsCompleted === 0) {
      return null;
    }

    // Priority 1: Streak
    if (streak.current >= 5) {
      return {
        type: 'streak',
        emoji: '🔥',
        message: `¡Llevas ${streak.current} días seguidos! Sigue así`,
        color: 'text-orange-600',
        bg: 'bg-orange-50'
      };
    }

    // Priority 2: Weekly improvement
    if (weeklyImprovement > 0) {
      return {
        type: 'improvement',
        emoji: '📈',
        message: `Has mejorado un ${weeklyImprovement}% esta semana`,
        color: 'text-green-600',
        bg: 'bg-green-50'
      };
    }

    // Priority 3: Least practiced tema
    if (leastPracticedTema) {
      return {
        type: 'suggestion',
        emoji: '💡',
        message: `Consejo: Repasa el Tema ${leastPracticedTema.tema}, llevas ${leastPracticedTema.daysSince} días sin practicarlo`,
        color: 'text-blue-600',
        bg: 'bg-blue-50'
      };
    }

    // Priority 4: Small streak
    if (streak.current >= 2) {
      return {
        type: 'streak',
        emoji: '✨',
        message: `¡${streak.current} días consecutivos! Cada día cuenta`,
        color: 'text-brand-600',
        bg: 'bg-brand-50'
      };
    }

    // Priority 5: Encouraging message
    if (totalStats.testsCompleted >= 10) {
      return {
        type: 'milestone',
        emoji: '🎯',
        message: `¡${totalStats.testsCompleted} tests completados! Vas por buen camino`,
        color: 'text-brand-600',
        bg: 'bg-brand-50'
      };
    }

    // Default: Welcome message
    return {
      type: 'welcome',
      emoji: '👋',
      message: 'Bienvenido/a. ¡La constancia es la clave!',
      color: 'text-gray-600',
      bg: 'bg-gray-50'
    };

  }, [streak, weeklyImprovement, leastPracticedTema, totalStats]);

  /**
   * Format relative date
   */
  const formatRelativeDate = useCallback((dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  }, []);

  return {
    // State
    loading,
    error,

    // Data
    weeklyData,
    sessionHistory,
    calendarData,
    streak,
    totalStats,
    todayStats,
    weeklyImprovement,
    leastPracticedTema,
    motivationalMessage,
    fsrsStats,

    // Functions
    fetchActivityData,
    fetchFsrsStats,
    formatRelativeDate
  };
}

export default useActivityData;
