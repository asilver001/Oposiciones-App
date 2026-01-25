import React from 'react';
import ActividadPage from '../../components/activity/ActividadPage';
import { useUserStore } from '../../stores';
import { useNavigate } from 'react-router-dom';

export default function ActivityPage() {
  const navigate = useNavigate();
  const { totalStats, streakData } = useUserStore();

  // Calculate weekly data (placeholder - would come from backend)
  const weeklyData = [0, 0, 0, 0, 0, 0, 0];

  // Session history (placeholder - would come from backend)
  const sessionHistory = [];

  // Calendar data (placeholder - would come from backend)
  const calendarData = [];

  // Calculate accuracy rate
  const accuracyRate = totalStats.totalQuestions > 0
    ? Math.round((totalStats.correctAnswers / totalStats.totalQuestions) * 100)
    : 0;

  // Format stats for ActividadPage
  const formattedStats = {
    testsCompleted: totalStats.totalQuestions || 0,
    questionsCorrect: totalStats.correctAnswers || 0,
    accuracyRate: accuracyRate,
    totalMinutes: totalStats.totalTimeSpent || 0,
    currentStreak: streakData.current || 0,
    daysStudied: 0, // Would come from backend
  };

  return (
    <ActividadPage
      weeklyData={weeklyData}
      sessionHistory={sessionHistory}
      totalStats={formattedStats}
      calendarData={calendarData}
      loading={false}
      onStartTest={() => navigate('/study')}
      devMode={true} // Enable dev mode for testing different user states
    />
  );
}
