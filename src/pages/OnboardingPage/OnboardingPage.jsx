import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores';
import { WelcomeScreen, GoalStep, DateStep, IntroStep } from '../../components/onboarding';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('welcome'); // welcome, goal-oposicion, goal-tiempo, date, intro
  const { setUserData, completeOnboarding } = useUserStore();
  const [tempData, setTempData] = useState({});

  const handleComplete = () => {
    // Save all onboarding data
    setUserData(tempData);
    completeOnboarding();
    navigate('/study'); // Go to first test
  };

  const handleSkip = () => {
    completeOnboarding();
    navigate('/');
  };

  // Welcome Screen
  if (step === 'welcome') {
    return (
      <WelcomeScreen
        onStart={() => setStep('goal-oposicion')}
        onLogin={() => navigate('/login')}
      />
    );
  }

  // Goal - Oposición
  if (step === 'goal-oposicion') {
    return (
      <GoalStep
        step="oposicion"
        onSelect={(oposicionId) => {
          setTempData({ ...tempData, oposicion: oposicionId });
          setStep('goal-tiempo');
        }}
        onBack={() => setStep('welcome')}
      />
    );
  }

  // Goal - Tiempo
  if (step === 'goal-tiempo') {
    return (
      <GoalStep
        step="tiempo"
        onSelect={(option) => {
          setTempData({
            ...tempData,
            dailyGoal: option.questions,
            dailyGoalMinutes: parseInt(option.id)
          });
          setStep('date');
        }}
        onBack={() => setStep('goal-oposicion')}
      />
    );
  }

  // Date Selection
  if (step === 'date') {
    return (
      <DateStep
        onSelect={(label) => {
          setTempData({ ...tempData, examDate: label });
          setStep('intro');
        }}
        onBack={() => setStep('goal-tiempo')}
      />
    );
  }

  // Final Intro
  if (step === 'intro') {
    return (
      <IntroStep
        onStart={handleComplete}
        onSkip={handleSkip}
        onBack={() => setStep('date')}
      />
    );
  }

  return null;
}
