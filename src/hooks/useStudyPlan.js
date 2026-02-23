/**
 * useStudyPlan Hook
 *
 * Connects the StudyPlanEngine to React, providing
 * today's recommended activities and exam countdown.
 */

import { useMemo } from 'react';
import { computeStudyPlan, getExamCountdown, getDailyInsight } from '../services/studyPlanEngine';
import { useUserStore } from '../stores/useUserStore';

/**
 * @param {Object} params
 * @param {number} params.dueReviewCount - FSRS reviews due
 * @param {Array} params.topicProgress - From useTopics.getFortalezaData()
 * @param {Object} params.userProgress - From useTopics.userProgress
 * @param {Array} params.availableTopics - Topics with questions
 * @param {Object} params.todayStats - From useActivityData
 * @param {Object} params.totalStats - From useActivityData
 * @param {Object} params.streak - From useActivityData
 * @returns {Object} { activities, examCountdown, dailyInsight }
 */
export function useStudyPlan({
  dueReviewCount = 0,
  topicProgress = [],
  userProgress = {},
  availableTopics = [],
  todayStats = {},
  totalStats = {},
  streak = { current: 0 },
} = {}) {
  const examDate = useUserStore((s) => s.userData.examDate);
  const dailyGoal = useUserStore((s) => s.userData.dailyGoalMinutes) || 15;

  const activities = useMemo(
    () => computeStudyPlan({
      dueReviewCount,
      topicProgress,
      userProgress,
      availableTopics,
      todayStats,
      examDate,
      dailyGoal: dailyGoal * 1.5, // Convert minutes to approx questions
      overallStats: totalStats,
    }),
    [dueReviewCount, topicProgress, userProgress, availableTopics, todayStats, examDate, dailyGoal, totalStats]
  );

  const examCountdown = useMemo(
    () => getExamCountdown(examDate),
    [examDate]
  );

  const dailyInsight = useMemo(
    () => getDailyInsight(todayStats, streak, totalStats),
    [todayStats, streak, totalStats]
  );

  return { activities, examCountdown, dailyInsight };
}

export default useStudyPlan;
