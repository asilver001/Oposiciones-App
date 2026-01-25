import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores';
import { useTopics } from '../../hooks/useTopics';
import { SoftFortHome } from '../../components/home';

export default function HomePage() {
  const navigate = useNavigate();
  const { userData, streakData, totalStats } = useUserStore();
  const { topicsWithQuestions, getFortalezaData } = useTopics();

  // Get fortaleza data from topics
  const fortalezaData = getFortalezaData();

  // Calculate total stats for SoftFortHome
  const calculatedStats = {
    testsCompleted: totalStats.totalQuestions || 0,
    questionsCorrect: totalStats.correctAnswers || 0,
    accuracyRate: totalStats.totalQuestions > 0
      ? Math.round((totalStats.correctAnswers / totalStats.totalQuestions) * 100)
      : 0,
  };

  return (
    <SoftFortHome
      userName={userData.name || 'Usuario'}
      streakData={{
        current: streakData.current || 0,
        longest: streakData.longest || 0,
      }}
      totalStats={calculatedStats}
      fortalezaData={fortalezaData}
      topicsWithQuestions={topicsWithQuestions}
      onStartSession={() => navigate('/study')}
      onTopicSelect={(topicId) => {
        // Navigate to study page with topic filter
        navigate('/study', { state: { topicId } });
      }}
      onSettingsClick={() => navigate('/settings')}
      onProgressClick={() => navigate('/activity')}
      onStreakClick={() => navigate('/activity')}
      onAccuracyClick={() => navigate('/activity')}
      onLevelClick={() => navigate('/activity')}
      onViewAllTopics={() => navigate('/temas')}
      onNavigateToTopics={() => navigate('/temas')}
      onNavigateToActivity={() => navigate('/activity')}
      onNavigate={(section) => {
        // Handle footer navigation
        if (section === 'about') {
          navigate('/about');
        } else if (section === 'faq') {
          navigate('/faq');
        }
      }}
    />
  );
}
