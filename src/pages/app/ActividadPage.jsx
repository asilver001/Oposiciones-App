/**
 * ActividadPage
 *
 * Activity and progress tracking view.
 * Integrates with useActivityData for real stats and handles navigation to different study modes.
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ActividadPage from '../../components/activity/ActividadPage';
import { useActivityData } from '../../hooks/useActivityData';
import { ROUTES } from '../../router/routes';

export default function ActividadPageWrapper() {
  const navigate = useNavigate();
  const {
    loading,
    weeklyData,
    sessionHistory,
    totalStats,
    calendarData,
    streak,
    motivationalMessage,
    fetchActivityData,
    formatRelativeDate
  } = useActivityData();

  // Fetch data on mount
  useEffect(() => {
    fetchActivityData();
  }, [fetchActivityData]);

  const handleBack = () => {
    navigate(ROUTES.HOME);
  };

  /**
   * Handle starting a study session based on selected mode
   * @param {string} mode - The study mode ID
   */
  const handleStartTest = (mode) => {
    switch (mode) {
      case 'test-rapido':
        // Quick test: 5-10 random questions
        navigate(ROUTES.STUDY, {
          state: {
            mode: 'test-rapido',
            questionCount: 10,
            title: 'Test Rápido'
          }
        });
        break;

      case 'practica-tema':
        // Practice by topic: Navigate to topics page to select
        navigate(ROUTES.TEMAS, {
          state: {
            selectForStudy: true
          }
        });
        break;

      case 'repaso-errores':
        // Review errors: Study questions marked as failed
        navigate(ROUTES.STUDY, {
          state: {
            mode: 'repaso-errores',
            title: 'Repaso de Errores'
          }
        });
        break;

      case 'flashcards':
        // Flashcard mode
        navigate(ROUTES.STUDY, {
          state: {
            mode: 'flashcards',
            title: 'Flashcards'
          }
        });
        break;

      case 'simulacro':
        // Full exam simulation (100 questions, 60 min)
        navigate(ROUTES.STUDY, {
          state: {
            mode: 'simulacro',
            questionCount: 100,
            timeLimit: 60,
            title: 'Simulacro de Examen'
          }
        });
        break;

      case 'lectura':
        // Read-only mode (no answering)
        navigate(ROUTES.TEMAS, {
          state: {
            mode: 'lectura',
            selectForStudy: true
          }
        });
        break;

      default:
        // Fallback to generic study
        navigate(ROUTES.STUDY);
    }
  };

  // Combine streak into totalStats for the component
  const enrichedStats = {
    ...totalStats,
    currentStreak: streak
  };

  return (
    <ActividadPage
      loading={loading}
      weeklyData={weeklyData}
      sessionHistory={sessionHistory}
      totalStats={enrichedStats}
      calendarData={calendarData}
      motivationalMessage={motivationalMessage}
      onBack={handleBack}
      onStartTest={handleStartTest}
      formatRelativeDate={formatRelativeDate}
    />
  );
}
