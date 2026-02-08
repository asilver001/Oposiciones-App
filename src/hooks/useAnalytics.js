/**
 * useAnalytics Hook
 *
 * Computes advanced analytics metrics from existing activity data:
 * - Learning velocity (questions mastered per week)
 * - Readiness score (0-100% exam preparedness)
 * - Topic strength map (accuracy per topic)
 * - Estimated days to ready (prediction)
 *
 * Consumes output from useActivityData - does NOT fetch data itself.
 */

import { useMemo } from 'react';

const TOTAL_TOPICS = 11;

/**
 * Compute learning velocity from session history
 * @param {Array} sessionHistory - Array of session objects with correctas, total_preguntas, created_at/started_at
 * @param {Object} fsrsStats - FSRS breakdown { mastered, total, ... }
 * @returns {{ currentVelocity: number, trend: string, weeklyHistory: number[] }}
 */
function computeVelocity(sessionHistory) {
  if (!sessionHistory || sessionHistory.length < 2) {
    return { currentVelocity: 0, trend: 'stable', weeklyHistory: [] };
  }

  // Group sessions by week (ISO week)
  const weekMap = {};
  sessionHistory.forEach(s => {
    const date = new Date(s.created_at || s.started_at);
    const weekStart = getMonday(date);
    const key = weekStart.toISOString().slice(0, 10);
    if (!weekMap[key]) weekMap[key] = { correct: 0, total: 0 };
    weekMap[key].correct += (s.correctas || s.correct_count || 0);
    weekMap[key].total += (s.total_preguntas || s.total_questions || 0);
  });

  // Sort weeks chronologically
  const sortedWeeks = Object.keys(weekMap).sort();
  const weeklyHistory = sortedWeeks.map(k => weekMap[k].correct);

  // Current velocity: questions correct this week (proxy for mastered)
  // Use mastered from FSRS if available, otherwise use weekly correct average
  const currentWeek = weeklyHistory[weeklyHistory.length - 1] || 0;
  const prevWeek = weeklyHistory.length >= 2 ? weeklyHistory[weeklyHistory.length - 2] : 0;

  let trend = 'stable';
  if (currentWeek > prevWeek + 2) trend = 'up';
  else if (currentWeek < prevWeek - 2) trend = 'down';

  return {
    currentVelocity: currentWeek,
    trend,
    weeklyHistory: weeklyHistory.slice(-8) // last 8 weeks
  };
}

/**
 * Compute readiness score (0-100)
 * Formula: mastery(40%) + accuracy(30%) + coverage(20%) + consistency(10%)
 */
function computeReadiness(totalStats, fsrsStats, sessionHistory, streak) {
  const mastered = fsrsStats?.mastered || 0;
  const total = fsrsStats?.total || 1;
  const masteryRatio = Math.min(mastered / total, 1);

  const avgAccuracy = (totalStats?.accuracyRate || 0) / 100;

  // Topic coverage: count unique topics from session history
  const topicsStudied = new Set();
  (sessionHistory || []).forEach(s => {
    const tema = s.tema || s.topic_id || s.tema_id;
    if (tema) topicsStudied.add(tema);
  });
  const coverageRatio = Math.min(topicsStudied.size / TOTAL_TOPICS, 1);

  // Streak bonus: caps at 7 days
  const currentStreak = streak || totalStats?.currentStreak || 0;
  const streakBonus = Math.min(currentStreak / 7, 1);

  const score = Math.round(
    masteryRatio * 40 +
    avgAccuracy * 30 +
    coverageRatio * 20 +
    streakBonus * 10
  );

  let level = 'inicial';
  if (score >= 80) level = 'preparado';
  else if (score >= 60) level = 'avanzado';
  else if (score >= 30) level = 'en_progreso';

  return {
    score: Math.min(score, 100),
    breakdown: {
      mastery: Math.round(masteryRatio * 100),
      accuracy: Math.round(avgAccuracy * 100),
      coverage: Math.round(coverageRatio * 100),
      consistency: Math.round(streakBonus * 100)
    },
    level
  };
}

/**
 * Compute topic strength map from session history
 */
function computeTopicStrength(sessionHistory) {
  if (!sessionHistory || sessionHistory.length === 0) {
    return { topics: [], weakest: null, strongest: null };
  }

  const topicMap = {};
  sessionHistory.forEach(s => {
    const tema = s.tema || s.topic_id || s.tema_id;
    if (!tema) return;

    if (!topicMap[tema]) {
      topicMap[tema] = { correct: 0, total: 0, sessions: 0, recentAccuracies: [] };
    }
    const correct = s.correctas || s.correct_count || 0;
    const total = s.total_preguntas || s.total_questions || 0;
    topicMap[tema].correct += correct;
    topicMap[tema].total += total;
    topicMap[tema].sessions += 1;
    if (total > 0) {
      topicMap[tema].recentAccuracies.push(Math.round((correct / total) * 100));
    }
  });

  const topics = Object.entries(topicMap).map(([tema, data]) => {
    const accuracy = data.total > 0
      ? Math.round((data.correct / data.total) * 100)
      : 0;

    // Simple trend: compare last session accuracy vs overall
    const recent = data.recentAccuracies;
    let trend = 'stable';
    if (recent.length >= 2) {
      const lastTwo = recent.slice(-2);
      const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
      const recentAvg = (lastTwo[0] + lastTwo[1]) / 2;
      if (recentAvg > avg + 5) trend = 'up';
      else if (recentAvg < avg - 5) trend = 'down';
    }

    return {
      tema: Number(tema),
      accuracy,
      sessions: data.sessions,
      trend
    };
  });

  // Sort by accuracy ascending (weakest first)
  topics.sort((a, b) => a.accuracy - b.accuracy);

  return {
    topics,
    weakest: topics.length > 0 ? topics[0] : null,
    strongest: topics.length > 0 ? topics[topics.length - 1] : null
  };
}

/**
 * Estimate days to exam readiness
 */
function computePrediction(velocity, fsrsStats) {
  const mastered = fsrsStats?.mastered || 0;
  const total = fsrsStats?.total || 0;
  const remaining = total - mastered;

  if (remaining <= 0 || !velocity.currentVelocity) {
    return { days: null, targetDate: null, confidence: 'low' };
  }

  // weekly velocity -> daily velocity
  const dailyVelocity = velocity.currentVelocity / 7;
  if (dailyVelocity <= 0) {
    return { days: null, targetDate: null, confidence: 'low' };
  }

  const days = Math.ceil(remaining / dailyVelocity);
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + days);

  // Confidence based on how much data we have
  let confidence = 'low';
  if (velocity.weeklyHistory.length >= 4) confidence = 'high';
  else if (velocity.weeklyHistory.length >= 2) confidence = 'medium';

  return {
    days,
    targetDate: targetDate.toISOString().slice(0, 10),
    confidence
  };
}

/**
 * Get Monday of the week for a given date
 */
function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.getFullYear(), d.getMonth(), diff);
}

/**
 * useAnalytics hook
 *
 * @param {Object} params
 * @param {Object} params.totalStats - From useActivityData
 * @param {Array} params.sessionHistory - From useActivityData
 * @param {Object} params.fsrsStats - From useActivityData
 * @param {number} params.streak - From useActivityData
 * @returns {Object} Analytics metrics
 */
export function useAnalytics({ totalStats, sessionHistory, fsrsStats, streak } = {}) {
  const hasEnoughData = (totalStats?.testsCompleted || 0) >= 2;

  const velocity = useMemo(
    () => computeVelocity(sessionHistory),
    [sessionHistory]
  );

  const readiness = useMemo(
    () => computeReadiness(totalStats, fsrsStats, sessionHistory, streak),
    [totalStats, fsrsStats, sessionHistory, streak]
  );

  const topicStrength = useMemo(
    () => computeTopicStrength(sessionHistory),
    [sessionHistory]
  );

  const prediction = useMemo(
    () => computePrediction(velocity, fsrsStats),
    [velocity, fsrsStats]
  );

  return {
    hasEnoughData,
    velocity,
    readiness,
    topicStrength,
    prediction
  };
}

export default useAnalytics;
