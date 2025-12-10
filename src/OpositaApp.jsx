import React, { useState, useEffect } from 'react';
import { Home, BookOpen, Trophy, Clock, TrendingUp, ArrowLeft, CheckCircle, XCircle, Target, Flame, Zap, Star, Lock, Crown, BarChart3, Calendar, History, GraduationCap, Lightbulb, Info } from 'lucide-react';

export default function OpositaApp() {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [activeTab, setActiveTab] = useState('inicio');
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    examDate: '',
    dailyGoal: 15,
    dailyGoalMinutes: 15,
    accountCreated: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [testResults, setTestResults] = useState(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumModalTrigger, setPremiumModalTrigger] = useState('general');
  const [dailyTestsCount, setDailyTestsCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('annual');
  const [lastStudyDate, setLastStudyDate] = useState(null);
  const [streakData, setStreakData] = useState({
    current: 0,
    longest: 0,
    lastCompletedDate: null
  });
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(null);
  const [signupFormShownCount, setSignupFormShownCount] = useState(0);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [showStreakBanner, setShowStreakBanner] = useState(true);

  const badges = [
    { id: 1, name: 'Constancia', days: 3, icon: '🔥', color: 'orange' },
    { id: 2, name: 'Compromiso', days: 7, icon: '💪', color: 'red' },
    { id: 3, name: 'Dedicación', days: 14, icon: '⭐', color: 'yellow' },
    { id: 4, name: 'Imparable', days: 30, icon: '🏆', color: 'gold' },
    { id: 5, name: 'Leyenda', days: 100, icon: '👑', color: 'purple' }
  ];

  const [totalStats, setTotalStats] = useState({
    testsCompleted: 0,
    questionsCorrect: 0,
    todayQuestions: 0,
    currentStreak: 0,
    totalDaysStudied: 0,
    accuracyRate: 0,
    weeklyProgress: [12, 15, 10, 15, 20, 8, 0]
  });

  const [topicsProgress, setTopicsProgress] = useState({
    1: { completed: 0, total: 150, streak: 7 },
    2: { completed: 0, total: 120, streak: 0, locked: false },
    3: { completed: 0, total: 200, streak: 0, locked: true },
    4: { completed: 0, total: 180, streak: 0, locked: true }
  });

  const topicsList = [
    { id: 1, title: "Constitución Española", icon: "📖" },
    { id: 2, title: "Organización del Estado", icon: "🏛️" },
    { id: 3, title: "Derecho Administrativo", icon: "⚖️" },
    { id: 4, title: "Administración Pública", icon: "🏢" }
  ];

  const questions = [
    {
      id: 1,
      question: "¿En qué año se aprobó la Constitución Española vigente?",
      options: [
        { id: 'a', text: '1976' },
        { id: 'b', text: '1978' },
        { id: 'c', text: '1979' },
        { id: 'd', text: '1977' }
      ],
      correct: 'b',
      explanation: "La Constitución Española fue aprobada por las Cortes Generales el 31 de octubre de 1978, ratificada por referéndum el 6 de diciembre de 1978 y sancionada por el Rey el 27 de diciembre de 1978."
    },
    {
      id: 2,
      question: "¿Cuál es la forma política del Estado español según la Constitución?",
      options: [
        { id: 'a', text: 'República parlamentaria' },
        { id: 'b', text: 'Monarquía absoluta' },
        { id: 'c', text: 'Monarquía parlamentaria' },
        { id: 'd', text: 'Estado federal' }
      ],
      correct: 'c',
      explanation: "Según el artículo 1.3 de la Constitución Española, 'La forma política del Estado español es la Monarquía parlamentaria'."
    },
    {
      id: 3,
      question: "¿Cuántos artículos tiene la Constitución Española?",
      options: [
        { id: 'a', text: '169 artículos' },
        { id: 'b', text: '165 artículos' },
        { id: 'c', text: '150 artículos' },
        { id: 'd', text: '180 artículos' }
      ],
      correct: 'a',
      explanation: "La Constitución Española consta de 169 artículos, distribuidos en un Título Preliminar y diez Títulos, además de disposiciones adicionales, transitorias, una derogatoria y una final."
    },
    {
      id: 4,
      question: "¿Qué mayoría se necesita en el Congreso para reformar la Constitución en el procedimiento ordinario?",
      options: [
        { id: 'a', text: 'Mayoría simple' },
        { id: 'b', text: 'Mayoría absoluta' },
        { id: 'c', text: 'Tres quintos' },
        { id: 'd', text: 'Dos tercios' }
      ],
      correct: 'c',
      explanation: "Según el artículo 167 de la Constitución, la reforma requerirá la aprobación por una mayoría de tres quintos de cada una de las Cámaras."
    },
    {
      id: 5,
      question: "¿Cuál de los siguientes NO es un derecho fundamental reconocido en la Sección 1ª del Capítulo II del Título I?",
      options: [
        { id: 'a', text: 'Derecho a la vida' },
        { id: 'b', text: 'Derecho a la educación' },
        { id: 'c', text: 'Derecho al trabajo' },
        { id: 'd', text: 'Libertad ideológica' }
      ],
      correct: 'c',
      explanation: "El derecho al trabajo (art. 35) no está en la Sección 1ª sino en la Sección 2ª del Capítulo II. Los derechos de la Sección 1ª gozan de mayor protección constitucional."
    }
  ];

  // Calcular progreso total del temario
  const calculateTotalProgress = () => {
    const totalCompleted = Object.values(topicsProgress).reduce((sum, t) => sum + t.completed, 0);
    const totalQuestions = Object.values(topicsProgress).reduce((sum, t) => sum + t.total, 0);
    return Math.round((totalCompleted / totalQuestions) * 100);
  };

  // Calcular días restantes para el examen
  const getDaysUntilExam = () => {
    if (!userData.examDate || userData.examDate === 'sin fecha') return null;

    const examMappings = {
      '< 6 meses': 90,
      '6-12 meses': 270,
      '> 1 año': 450
    };

    return examMappings[userData.examDate] || null;
  };

  const completeOnboarding = async () => {
    try {
      await window.storage.set('oposita-onboarding-complete', 'true');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAnswerSelect = (answerId) => {
    if (!answers[currentQuestion]) {
      setSelectedAnswer(answerId);
      setAnswers({ ...answers, [currentQuestion]: answerId });
      setShowExplanation(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1] || null);
      setShowExplanation(!!answers[currentQuestion + 1]);
    }
  };

  const handleFinishTest = async () => {
    const correctAnswers = Object.entries(answers).filter(
      ([idx, answer]) => answer === questions[idx].correct
    );

    const results = {
      total: questions.length,
      answered: Object.keys(answers).length,
      correct: correctAnswers.length,
      incorrect: Object.keys(answers).length - correctAnswers.length,
      percentage: Math.round((correctAnswers.length / questions.length) * 100),
      time: timeElapsed
    };

    const today = new Date().toDateString();
    let newStreak = streakData.current;
    let shouldCelebrate = false;
    let newBadge = null;

    try {
      if (streakData.lastCompletedDate !== today) {
        const lastDate = streakData.lastCompletedDate ? new Date(streakData.lastCompletedDate) : null;
        const todayDate = new Date(today);

        if (!lastDate) {
          newStreak = 1;
        } else {
          const diffDays = Math.floor((todayDate - new Date(lastDate)) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            newStreak = streakData.current + 1;
            const unlockedBadge = badges.find(b => b.days === newStreak);
            if (unlockedBadge) {
              newBadge = unlockedBadge;
              shouldCelebrate = true;
            }
          } else if (diffDays === 0) {
            newStreak = streakData.current;
          } else {
            newStreak = 1;
          }
        }

        const newStreakData = {
          current: newStreak,
          longest: Math.max(newStreak, streakData.longest),
          lastCompletedDate: today
        };

        setStreakData(newStreakData);
        await window.storage.set('oposita-streak', JSON.stringify(newStreakData));
      }
    } catch (error) {
      console.error('Error actualizando racha:', error);
    }

    const newWeeklyProgress = [...totalStats.weeklyProgress];
    newWeeklyProgress[6] = (newWeeklyProgress[6] || 0) + questions.length;

    setTotalStats(prev => ({
      testsCompleted: prev.testsCompleted + 1,
      questionsCorrect: prev.questionsCorrect + correctAnswers.length,
      todayQuestions: prev.todayQuestions + questions.length,
      currentStreak: newStreak,
      totalDaysStudied: prev.totalDaysStudied + (prev.todayQuestions === 0 ? 1 : 0),
      accuracyRate: Math.round(((prev.questionsCorrect + correctAnswers.length) / ((prev.testsCompleted + 1) * questions.length)) * 100),
      weeklyProgress: newWeeklyProgress
    }));

    setTopicsProgress(prev => ({
      ...prev,
      1: {
        ...prev[1],
        completed: Math.min(prev[1].completed + questions.length, prev[1].total),
        streak: prev[1].streak
      }
    }));

    try {
      const newCount = dailyTestsCount + 1;
      setDailyTestsCount(newCount);
      await window.storage.set('oposita-daily-tests', JSON.stringify({ date: today, count: newCount }));
    } catch (error) {
      console.error('Error guardando tests diarios:', error);
    }

    setTestResults(results);

    if (shouldCelebrate && newBadge) {
      setEarnedBadge(newBadge);
      setShowStreakCelebration(true);
      setTimeout(() => {
        setShowStreakCelebration(false);
        setCurrentPage('onboarding-results');
      }, 2000);
    } else {
      setCurrentPage('onboarding-results');
    }
  };

  const handleCreateAccount = async () => {
    if (!privacyAccepted) return;

    const newUserData = {
      ...userData,
      name: formName || userData.name,
      email: formEmail,
      accountCreated: true
    };

    setUserData(newUserData);

    try {
      await window.storage.set('oposita-user', JSON.stringify(newUserData));
      await window.storage.set('oposita-signup-count', JSON.stringify(signupFormShownCount + 1));
    } catch (error) {
      console.error('Error guardando cuenta:', error);
    }

    setCurrentPage('home');
  };

  const handleSkipSignup = async () => {
    try {
      const newCount = signupFormShownCount + 1;
      setSignupFormShownCount(newCount);
      await window.storage.set('oposita-signup-count', JSON.stringify(newCount));
    } catch (error) {
      console.error('Error:', error);
    }
    setCurrentPage('home');
  };

  const goToSignupOrHome = () => {
    if (!userData.accountCreated && signupFormShownCount < 2) {
      setFormName(userData.name);
      setCurrentPage('signup');
    } else {
      setCurrentPage('home');
    }
  };

  const getMotivationalMessage = () => {
    if (streakData.current >= 7) return "¡Vas imparable! 🔥 Solo 3 días más para tu siguiente insignia";
    if (totalStats.accuracyRate >= 80) return "¡Brutal! Estás dominando este tema 💪";
    if (streakData.current >= 3) return `¡${streakData.current} días seguidos! La constancia es clave ✊`;
    return "Cada pregunta te acerca a tu objetivo ✅";
  };

  const startTest = () => {
    setCurrentPage('first-test');
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers({});
    setShowExplanation(false);
    setTimeElapsed(0);
  };

  useEffect(() => {
    if (currentPage === 'first-test') {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentPage]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const statsResult = await window.storage.get('oposita-stats-v2');
        if (statsResult && statsResult.value) {
          setTotalStats(JSON.parse(statsResult.value));
        }

        const progressResult = await window.storage.get('oposita-progress-v2');
        if (progressResult && progressResult.value) {
          setTopicsProgress(JSON.parse(progressResult.value));
        }

        const userResult = await window.storage.get('oposita-user');
        if (userResult && userResult.value) {
          setUserData(JSON.parse(userResult.value));
        }

        const signupCountResult = await window.storage.get('oposita-signup-count');
        if (signupCountResult && signupCountResult.value) {
          setSignupFormShownCount(JSON.parse(signupCountResult.value));
        }

        const streakResult = await window.storage.get('oposita-streak');
        if (streakResult && streakResult.value) {
          const savedStreak = JSON.parse(streakResult.value);
          setStreakData(savedStreak);

          if (savedStreak.lastCompletedDate) {
            const lastDate = new Date(savedStreak.lastCompletedDate);
            const today = new Date();
            const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

            if (diffDays > 1) {
              setStreakData({ current: 0, longest: savedStreak.longest, lastCompletedDate: null });
              await window.storage.set('oposita-streak', JSON.stringify({
                current: 0,
                longest: savedStreak.longest,
                lastCompletedDate: null
              }));
            }
          }
        }

        const dailyTestsResult = await window.storage.get('oposita-daily-tests');
        if (dailyTestsResult && dailyTestsResult.value) {
          const savedData = JSON.parse(dailyTestsResult.value);
          const today = new Date().toDateString();
          if (savedData.date === today) {
            setDailyTestsCount(savedData.count);
          } else {
            setDailyTestsCount(0);
            await window.storage.set('oposita-daily-tests', JSON.stringify({ date: today, count: 0 }));
          }
        }

        const premiumResult = await window.storage.get('oposita-premium');
        if (premiumResult && premiumResult.value === 'true') {
          setIsPremium(true);
        }

        const onboardingResult = await window.storage.get('oposita-onboarding-complete');
        if (onboardingResult && onboardingResult.value === 'true') {
          setCurrentPage('home');
        }
      } catch (error) {
        console.log('Primera vez usando la app');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoading && currentPage === 'home') {
      const saveStats = async () => {
        try {
          await window.storage.set('oposita-stats-v2', JSON.stringify(totalStats));
        } catch (error) {
          console.error('Error:', error);
        }
      };
      saveStats();
    }
  }, [totalStats, isLoading, currentPage]);

  useEffect(() => {
    if (!isLoading && currentPage === 'home') {
      const saveProgress = async () => {
        try {
          await window.storage.set('oposita-progress-v2', JSON.stringify(topicsProgress));
        } catch (error) {
          console.error('Error:', error);
        }
      };
      saveProgress();
    }
  }, [topicsProgress, isLoading, currentPage]);

  // Premium Modal Component
  const PremiumModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowPremiumModal(false)}>
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-t-3xl relative">
          <button
            onClick={() => setShowPremiumModal(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <XCircle className="w-6 h-6" />
          </button>
          <Crown className="w-16 h-16 text-white mx-auto mb-4 drop-shadow-lg" />
          <h2 className="text-3xl font-bold text-white text-center drop-shadow">Desbloquea todo</h2>
          <p className="text-white/90 text-center mt-2 font-medium">Desbloquea todos los temas y simulacros</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3">
              <div className="text-gray-500 text-sm font-bold mb-3">GRATIS</div>
              <div className="text-sm text-gray-600 space-y-2">
                <div>3 tests/día</div>
                <div>2 temas</div>
                <div>Resultados básicos</div>
              </div>
            </div>
            <div className="text-center border-2 border-purple-500 rounded-xl p-3 bg-purple-50">
              <div className="text-purple-600 font-bold text-sm mb-3 flex items-center justify-center gap-1">
                <Crown className="w-4 h-4" />
                PREMIUM
              </div>
              <div className="text-sm font-semibold text-purple-900 space-y-2">
                <div>✨ Tests ilimitados</div>
                <div>✨ 4 temas completos</div>
                <div className="flex items-center justify-center gap-1">
                  <span>✨ Análisis IA</span>
                  <span className="text-xs bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded">Próximamente</span>
                </div>
                <div>✨ Simulacros</div>
              </div>
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg mb-3">
            Probar 7 días gratis
          </button>

          <button
            onClick={() => setShowPremiumModal(false)}
            className="w-full text-gray-600 font-semibold py-3 hover:text-gray-800"
          >
            Continuar con plan gratuito
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            9,99€/mes después del trial · Cancela cuando quieras
          </p>
        </div>
      </div>
    </div>
  );

  // Bottom Tab Bar Component
  const BottomTabBar = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
      <div className="max-w-4xl mx-auto flex justify-around">
        {[
          { id: 'inicio', label: 'Inicio', icon: Home },
          { id: 'actividad', label: 'Actividad', icon: History },
          { id: 'temas', label: 'Temas', icon: BookOpen },
          { id: 'recursos', label: 'Recursos', icon: GraduationCap }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'text-purple-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <tab.icon className={`w-6 h-6 ${activeTab === tab.id ? 'stroke-2' : ''}`} />
            <span className={`text-xs mt-1 ${activeTab === tab.id ? 'font-semibold' : ''}`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-300 to-yellow-400 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-800 font-semibold">Cargando...</p>
        </div>
      </div>
    );
  }

  // PANTALLA 1: BIENVENIDA
  if (currentPage === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="inline-block bg-yellow-400 rounded-full p-8 mb-6 shadow-2xl animate-bounce">
              <Trophy className="w-20 h-20 text-purple-700" />
            </div>

            <h1 className="text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
              Aprueba tu oposición de Administrativo del Estado
            </h1>

            <p className="text-purple-100 text-xl font-medium">
              Más de 15.000 opositores ya estudian con nosotros
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('onboarding1')}
            className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold py-5 px-8 rounded-2xl text-xl shadow-2xl transform hover:scale-105 transition-all mb-4"
          >
            Comenzar gratis
          </button>

          <p className="text-purple-200 text-sm">
            Sin tarjeta. Cancela cuando quieras.
          </p>

          {/* DEV: Skip button */}
          <button
            onClick={() => {
              completeOnboarding();
              setCurrentPage('home');
            }}
            className="mt-6 text-purple-300 text-xs underline hover:text-white"
          >
            [DEV] Saltar al Home
          </button>
        </div>
      </div>
    );
  }

  // PANTALLA 2: ¿CUÁNDO ES TU EXAMEN?
  if (currentPage === 'onboarding1') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-6 drop-shadow">
              ¿Cuándo es tu examen?
            </h2>

            <div className="flex justify-center gap-2 mt-6">
              <div className="w-3 h-3 rounded-full bg-white shadow-lg"></div>
              <div className="w-3 h-3 rounded-full bg-white/40"></div>
              <div className="w-3 h-3 rounded-full bg-white/40"></div>
              <div className="w-3 h-3 rounded-full bg-white/40"></div>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { value: '< 6 meses', label: 'En menos de 6 meses', emoji: '⚡' },
              { value: '6-12 meses', label: 'Entre 6-12 meses', emoji: '📅' },
              { value: '> 1 año', label: 'En más de 1 año', emoji: '🎯' },
              { value: 'sin fecha', label: 'Aún no tengo fecha', emoji: '🤔' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setUserData({ ...userData, examDate: option.value });
                  setCurrentPage('onboarding2');
                }}
                className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:border-white text-white font-semibold py-5 px-6 rounded-2xl transition-all text-left flex items-center gap-4 shadow-lg hover:shadow-2xl transform hover:scale-105"
              >
                <span className="text-3xl">{option.emoji}</span>
                <span className="text-lg">{option.label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage('welcome')}
            className="w-full mt-6 text-white/70 hover:text-white font-medium py-3 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
        </div>
      </div>
    );
  }

  // PANTALLA 3: OBJETIVO DIARIO
  if (currentPage === 'onboarding2') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-4 drop-shadow">
              ¿Cuánto tiempo tienes cada día?
            </h2>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
              <p className="text-white font-semibold text-lg">
                Solo 15 min/día = 5,475 preguntas al año
              </p>
            </div>

            <div className="flex justify-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white shadow-lg"></div>
              <div className="w-3 h-3 rounded-full bg-white shadow-lg"></div>
              <div className="w-3 h-3 rounded-full bg-white/40"></div>
              <div className="w-3 h-3 rounded-full bg-white/40"></div>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { minutes: 15, questions: 10, label: '15 minutos', sublabel: '10 preguntas', emoji: '⏱️' },
              { minutes: 30, questions: 20, label: '30 minutos', sublabel: '20 preguntas', emoji: '📚' },
              { minutes: 60, questions: 40, label: '1 hora', sublabel: '40 preguntas', emoji: '🎓' },
              { minutes: 120, questions: 80, label: '2+ horas', sublabel: '80+ preguntas', emoji: '🚀' }
            ].map((option) => (
              <button
                key={option.minutes}
                onClick={() => {
                  setUserData({ ...userData, dailyGoal: option.questions, dailyGoalMinutes: option.minutes });
                  setCurrentPage('onboarding3');
                }}
                className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:border-white text-white font-semibold py-5 px-6 rounded-2xl transition-all text-left shadow-lg hover:shadow-2xl transform hover:scale-105"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{option.emoji}</span>
                  <div className="flex-1">
                    <div className="text-xl font-bold">{option.label}</div>
                    <div className="text-purple-100 text-sm">{option.sublabel}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage('onboarding1')}
            className="w-full mt-6 text-white/70 hover:text-white font-medium py-3 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
        </div>
      </div>
    );
  }

  // PANTALLA 4: PRIMER TEST
  if (currentPage === 'onboarding3') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-6">
            {/* Plan confirmado */}
            <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-4 mb-6 border border-green-400/30">
              <p className="text-green-100 font-semibold">
                ✅ Perfecto, creamos un plan con <span className="text-white font-bold">{userData.dailyGoal} preguntas al día</span> para ti.
              </p>
            </div>

            <h2 className="text-4xl font-bold text-white mb-4 drop-shadow">
              Vamos a hacer tu primer test ahora
            </h2>

            <div className="flex justify-center gap-2 mt-6">
              <div className="w-3 h-3 rounded-full bg-white shadow-lg"></div>
              <div className="w-3 h-3 rounded-full bg-white shadow-lg"></div>
              <div className="w-3 h-3 rounded-full bg-white shadow-lg"></div>
              <div className="w-3 h-3 rounded-full bg-white/40"></div>
            </div>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 rounded-3xl blur-xl opacity-50 animate-pulse"></div>

            <div className="relative bg-gradient-to-br from-purple-400 to-purple-500 p-8 rounded-3xl shadow-2xl border-2 border-white/30">
              <div className="text-6xl mb-6 text-center animate-bounce">📖</div>
              <h3 className="text-3xl font-bold text-white mb-3 text-center drop-shadow">
                Constitución Española
              </h3>
              <div className="flex items-center justify-center gap-4 text-purple-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">2 minutos</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-purple-200"></div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">5 preguntas</span>
                </div>
              </div>
            </div>
          </div>

          {/* Texto de calibración */}
          <div className="bg-blue-500/20 backdrop-blur-sm rounded-xl p-4 mb-6 border border-blue-400/30">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-200 flex-shrink-0 mt-0.5" />
              <p className="text-blue-100 text-sm">
                Este primer test solo sirve para calibrar tu nivel, no te preocupes por la nota 😉
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              startTest();
              completeOnboarding();
            }}
            className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold py-6 px-8 rounded-2xl text-xl shadow-2xl transform hover:scale-105 transition-all mb-4"
          >
            Empezar mi primer test
          </button>

          <button
            onClick={() => setCurrentPage('onboarding2')}
            className="w-full text-white/70 hover:text-white font-medium py-3 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
        </div>
      </div>
    );
  }

  // PANTALLA TEST
  if (currentPage === 'first-test') {
    const question = questions[currentQuestion];
    const answeredCount = Object.keys(answers).length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-700 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6 pt-4">
            <button
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-2 text-white hover:text-purple-200 transition"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="font-semibold">Salir</span>
            </button>

            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <Clock className="w-5 h-5 text-white" />
              <span className="font-bold text-white">{formatTime(timeElapsed)}</span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-white text-sm mb-2">
              <span>Pregunta {currentQuestion + 1} de {questions.length}</span>
              <span>{answeredCount}/{questions.length} respondidas</span>
            </div>
            <div className="bg-white/30 rounded-full h-3">
              <div
                className="bg-white rounded-full h-3 transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6">
            <div className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-purple-100 text-purple-600 font-bold rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 text-lg">
                  {currentQuestion + 1}
                </div>
                <h2 className="text-xl font-bold text-gray-900 leading-relaxed">
                  {question.question}
                </h2>
              </div>

              <div className="space-y-3">
                {question.options.map((option) => {
                  const isSelected = selectedAnswer === option.id;
                  const isCorrect = option.id === question.correct;
                  const showResult = showExplanation;

                  let buttonClass = "w-full text-left p-4 rounded-xl border-2 transition-all ";

                  if (showResult) {
                    if (isCorrect) {
                      buttonClass += "border-green-500 bg-green-50 ";
                    } else if (isSelected && !isCorrect) {
                      buttonClass += "border-red-500 bg-red-50 ";
                    } else {
                      buttonClass += "border-gray-200 bg-gray-50 ";
                    }
                  } else if (isSelected) {
                    buttonClass += "border-purple-500 bg-purple-50 ";
                  } else {
                    buttonClass += "border-gray-200 hover:border-purple-300 hover:bg-purple-50 ";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswerSelect(option.id)}
                      disabled={showExplanation}
                      className={buttonClass}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold ${
                          showResult && isCorrect ? 'border-green-500 bg-green-500 text-white' :
                          showResult && isSelected && !isCorrect ? 'border-red-500 bg-red-500 text-white' :
                          isSelected ? 'border-purple-500 bg-purple-500 text-white' :
                          'border-gray-300 text-gray-600'
                        }`}>
                          {option.id.toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900 flex-1">{option.text}</span>
                        {showResult && isCorrect && <CheckCircle className="w-6 h-6 text-green-600" />}
                        {showResult && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-600" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div className={`mt-6 p-4 rounded-xl ${
                  selectedAnswer === question.correct ? 'bg-green-50 border-2 border-green-200' : 'bg-blue-50 border-2 border-blue-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">💡</div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">
                        {selectedAnswer === question.correct ? '¡Correcto!' : 'Explicación'}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                disabled={!selectedAnswer}
                className="flex-1 bg-white hover:bg-gray-100 disabled:bg-white/50 disabled:cursor-not-allowed text-purple-600 font-bold py-4 px-6 rounded-2xl transition shadow-lg"
              >
                Siguiente →
              </button>
            ) : (
              <button
                onClick={handleFinishTest}
                disabled={!selectedAnswer}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl transition shadow-lg"
              >
                Finalizar Test ✓
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // PANTALLA RESULTADOS
  if (currentPage === 'onboarding-results') {
    const isGoodScore = testResults?.percentage >= 60;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {isGoodScore && (
            <div className="text-center mb-6 animate-bounce">
              <div className="text-7xl">🎉</div>
            </div>
          )}

          <div className="bg-white rounded-3xl p-8 shadow-2xl mb-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-purple-600 mb-3">
                ¡{testResults?.correct} de {testResults?.total} correctas! {isGoodScore ? '🎉' : '💪'}
              </h2>
              <div className="text-6xl font-bold text-gray-800 mb-2">
                {testResults?.percentage}%
              </div>
              <p className="text-gray-600 text-lg">de acierto</p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 mb-6 border-2 border-purple-100">
              <div className="flex items-center gap-3 justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
                <p className="text-purple-900 font-bold">
                  Estás en el TOP 45% de nuevos usuarios
                </p>
              </div>
            </div>

            <div className="border-2 border-purple-200 rounded-xl p-5 bg-gradient-to-br from-purple-50 to-white">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-6 h-6 text-purple-600" />
                <span className="font-bold text-purple-900 text-lg">Los usuarios Premium tienen:</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span><strong>127% más</strong> preguntas acertadas</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span>Acceso a <strong>15.000+ preguntas</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span>Simulacros de <strong>examen real</strong></span>
                </li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => setShowPremiumModal(true)}
            className="w-full bg-white/20 backdrop-blur-sm border-2 border-white text-white font-bold py-4 px-6 rounded-2xl mb-3 hover:bg-white/30 transition-all shadow-lg"
          >
            Ver planes Premium
          </button>

          <button
            onClick={goToSignupOrHome}
            className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-2xl shadow-2xl transition-all"
          >
            Continuar con plan gratuito
          </button>

          {/* DEV: Skip to home */}
          <button
            onClick={() => setCurrentPage('home')}
            className="w-full mt-4 text-purple-300 text-xs underline hover:text-white"
          >
            [DEV] Saltar al Home directamente
          </button>
        </div>

        {showPremiumModal && <PremiumModal />}
      </div>
    );
  }

  // PANTALLA SIGNUP
  if (currentPage === 'signup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="inline-block bg-purple-100 rounded-full p-4 mb-4">
                <CheckCircle className="w-12 h-12 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Guarda tu progreso</h2>
              <p className="text-gray-600">
                Crea tu cuenta para no perder tu racha, tu progreso y tus resultados.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tu nombre</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ej: María"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tu correo electrónico</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="Ej: maria@email.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Te enviaremos recordatorios útiles y recursos para tu oposición. Nada de spam.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="privacy"
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  className="mt-1 w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="privacy" className="text-sm text-gray-600">
                  He leído y acepto la{' '}
                  <a href="/privacidad" className="text-purple-600 underline hover:text-purple-700">
                    Política de Privacidad
                  </a>
                </label>
              </div>

              <button
                onClick={handleCreateAccount}
                disabled={!privacyAccepted || !formEmail}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all disabled:cursor-not-allowed"
              >
                Crear mi cuenta
              </button>

              <p className="text-xs text-gray-500 text-center">
                Al crear tu cuenta aceptas nuestra Política de Privacidad. Nunca compartimos tus datos con terceros.
              </p>

              <div className="border-t pt-4">
                <button
                  onClick={handleSkipSignup}
                  className="w-full text-gray-500 font-medium py-2 hover:text-gray-700 transition"
                >
                  Continuar sin crear cuenta
                </button>
                <p className="text-xs text-gray-400 text-center mt-1">
                  Podrías perder tu progreso si cambias de dispositivo.
                </p>
              </div>

              {/* DEV: Skip */}
              <button
                onClick={() => setCurrentPage('home')}
                className="w-full text-gray-300 text-xs underline hover:text-gray-500"
              >
                [DEV] Saltar formulario
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // HOME
  const daysUntilExam = getDaysUntilExam();
  const totalProgress = calculateTotalProgress();

  // Contenido de Actividad
  const ActividadContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Tu actividad</h2>

      {totalStats.testsCompleted === 0 ? (
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Aún no hay actividad</h3>
          <p className="text-gray-600 mb-4">Completa tu primer test para ver tu progreso aquí</p>
          <button
            onClick={startTest}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition"
          >
            Hacer mi primer test
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-6 h-6 text-purple-600" />
                <span className="text-gray-600 text-sm font-medium">Tests completados</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{totalStats.testsCompleted}</div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-6 h-6 text-green-600" />
                <span className="text-gray-600 text-sm font-medium">Tasa de acierto</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{totalStats.accuracyRate}%</div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                <span className="text-gray-600 text-sm font-medium">Preguntas correctas</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{totalStats.questionsCorrect}</div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-6 h-6 text-orange-600" />
                <span className="text-gray-600 text-sm font-medium">Días estudiando</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{totalStats.totalDaysStudied}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-900 mb-4">Progreso semanal</h3>
            <div className="flex items-end justify-between h-32 gap-2">
              {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gray-100 rounded-t-lg flex-1 relative">
                    <div
                      className="absolute bottom-0 w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg transition-all"
                      style={{ height: `${Math.min((totalStats.weeklyProgress[i] / 20) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{day}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  // Contenido de Temas
  const TemasContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Tus temas</h2>

      <div className="space-y-4">
        {topicsList.map((topic) => {
          const progress = topicsProgress[topic.id];
          const percentage = Math.round((progress.completed / progress.total) * 100);
          const isLocked = progress.locked;

          return (
            <div
              key={topic.id}
              className={`rounded-xl p-4 transition-all ${
                isLocked
                  ? 'bg-gray-50 border-2 border-gray-200'
                  : 'bg-gradient-to-r from-purple-50 to-white border-2 border-purple-200 hover:border-purple-400 cursor-pointer'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{topic.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-900">{topic.title}</h4>
                    {isLocked && <Lock className="w-4 h-4 text-gray-400" />}
                    {progress.streak > 0 && !isLocked && (
                      <div className="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded-full">
                        <Flame className="w-3 h-3 text-orange-600" />
                        <span className="text-xs font-bold text-orange-600">{progress.streak} días</span>
                      </div>
                    )}
                  </div>

                  {isLocked ? (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        {progress.total} preguntas · Simulacros incluidos
                      </p>
                      <p className="text-xs text-purple-600 font-medium mb-2">Solo disponible en Premium</p>
                      <button
                        onClick={() => {
                          setPremiumModalTrigger('locked-topic');
                          setShowPremiumModal(true);
                        }}
                        className="flex items-center gap-2 bg-purple-100 text-purple-700 font-semibold text-sm px-3 py-1.5 rounded-lg hover:bg-purple-200 transition"
                      >
                        <Lock className="w-3 h-3" />
                        Desbloquear con Premium
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 mb-2">
                        {progress.completed} de {progress.total} preguntas completadas
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-full h-2 transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-gray-700">{percentage}%</span>
                      </div>
                      {topic.id === 1 && (
                        <button
                          onClick={startTest}
                          className="mt-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-all"
                        >
                          Continuar
                        </button>
                      )}
                      {topic.id === 2 && progress.completed === 0 && (
                        <button className="mt-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg text-sm transition-all flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          Empezar tema
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Contenido de Recursos
  const RecursosContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Recursos para tu oposición</h2>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Consejos de estudio
        </h3>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-purple-500">•</span>
            <span>Estudia a la misma hora cada día para crear un hábito</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500">•</span>
            <span>Repasa los errores del día anterior antes de empezar</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500">•</span>
            <span>Haz descansos cortos cada 25-30 minutos</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500">•</span>
            <span>Practica con simulacros completos una vez por semana</span>
          </li>
        </ul>
      </div>

      <div className="bg-gray-100 rounded-2xl p-6 border-2 border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-gray-200 p-2 rounded-lg">
            <BarChart3 className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <h3 className="font-bold text-gray-500">Análisis con IA</h3>
            <span className="text-xs bg-gray-300 text-gray-600 px-2 py-0.5 rounded">Próximamente</span>
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          Pronto podrás recibir análisis personalizados de tu rendimiento y recomendaciones de estudio basadas en IA.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="font-bold text-gray-900 mb-4">Enlaces útiles</h3>
        <div className="space-y-3">
          <a href="#" className="block text-purple-600 hover:text-purple-700 font-medium">
            📄 BOE - Convocatorias oficiales
          </a>
          <a href="#" className="block text-purple-600 hover:text-purple-700 font-medium">
            📚 Temario oficial actualizado
          </a>
          <a href="#" className="block text-purple-600 hover:text-purple-700 font-medium">
            ❓ Preguntas frecuentes
          </a>
        </div>
      </div>
    </div>
  );

  // Contenido de Inicio
  const InicioContent = () => (
    <>
      {/* Banner protege tu racha */}
      {streakData.current >= 3 && !userData.accountCreated && showStreakBanner && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 mb-6 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Flame className="w-6 h-6 text-yellow-300 flex-shrink-0" />
              <div>
                <p className="text-white font-bold">Protege tu racha de {streakData.current} días</p>
                <p className="text-white/80 text-sm">Crea tu cuenta para no perder tu progreso si cambias de móvil.</p>
              </div>
            </div>
            <button onClick={() => setShowStreakBanner(false)} className="text-white/60 hover:text-white">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={() => setCurrentPage('signup')}
            className="mt-3 w-full bg-white text-orange-600 font-bold py-2 px-4 rounded-xl hover:bg-orange-50 transition"
          >
            Crear cuenta gratis
          </button>
        </div>
      )}

      {/* Info examen y progreso */}
      <div className="bg-white/80 backdrop-blur rounded-xl p-4 mb-6 border border-white/50">
        {daysUntilExam ? (
          <p className="text-gray-700 font-medium">
            📅 Te quedan aproximadamente <span className="font-bold text-purple-600">{daysUntilExam} días</span> para tu examen
          </p>
        ) : (
          <p className="text-gray-600">
            🤔 Aún no tienes fecha de examen. Te ayudamos a construir el hábito igualmente.
          </p>
        )}
        <p className="text-gray-600 text-sm mt-1">
          📊 Llevas aproximadamente <span className="font-bold">{totalProgress}%</span> del temario
        </p>
      </div>

      {/* Racha */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6 shadow-xl mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <Flame className="w-12 h-12 text-yellow-300 drop-shadow" />
            <div>
              <div className="text-white/80 text-sm font-medium">Racha</div>
              <div className="text-white text-4xl font-bold drop-shadow">{streakData.current} días</div>
            </div>
          </div>

          <div className="bg-white/20 rounded-full h-3 mb-2">
            <div
              className="bg-white rounded-full h-3 transition-all duration-500"
              style={{ width: `${(streakData.current % 10) * 10}%` }}
            ></div>
          </div>
          <p className="text-white text-sm mb-3 drop-shadow">
            ¡Solo {Math.max(0, badges.find(b => b.days > streakData.current)?.days - streakData.current || 10 - (streakData.current % 10))} días más para tu próxima insignia!
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            {badges.map(badge => {
              const isUnlocked = streakData.current >= badge.days || streakData.longest >= badge.days;
              return (
                <div
                  key={badge.id}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold transition-all ${
                    isUnlocked
                      ? 'bg-yellow-400 text-gray-900 shadow-lg'
                      : 'bg-white/20 text-white/50'
                  }`}
                >
                  <span className="text-lg">{badge.icon}</span>
                  <span className="text-xs">{badge.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Objetivo diario */}
      <div className="bg-white rounded-2xl p-6 shadow-xl mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Tu objetivo de hoy</h2>
        <div className="flex items-center gap-6 mb-4">
          <div className="relative w-28 h-28">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="56" cy="56" r="50" fill="none" stroke="#E5E7EB" strokeWidth="10"></circle>
              <circle
                cx="56"
                cy="56"
                r="50"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="10"
                strokeDasharray={`${Math.min((totalStats.todayQuestions / userData.dailyGoal) * 314, 314)} 314`}
                strokeLinecap="round"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">
                {Math.min(Math.round((totalStats.todayQuestions / userData.dailyGoal) * 100), 100)}%
              </span>
            </div>
          </div>

          <div className="flex-1">
            <div className="text-gray-600 mb-2">
              <span className="text-2xl font-bold text-gray-900">{totalStats.todayQuestions}</span>
              <span className="text-gray-600">/{userData.dailyGoal} preguntas</span>
            </div>
            <p className="text-sm text-gray-500">
              Te quedan {Math.max(0, userData.dailyGoal - totalStats.todayQuestions)} preguntas · ~{Math.max(0, Math.round(((userData.dailyGoal - totalStats.todayQuestions) / userData.dailyGoal) * userData.dailyGoalMinutes))} minutos
            </p>
          </div>
        </div>

        {totalStats.todayQuestions >= userData.dailyGoal ? (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">✅</div>
            <p className="text-green-800 font-bold">¡Objetivo cumplido! Mañana a por el siguiente</p>
          </div>
        ) : (
          <button
            onClick={startTest}
            className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all hover:scale-105"
          >
            Completar mi objetivo →
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-6 h-6 text-purple-600" />
            <span className="text-gray-600 text-sm font-medium">Tests completados</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalStats.testsCompleted}</div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-6 h-6 text-green-600" />
            <span className="text-gray-600 text-sm font-medium">Tasa de acierto</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalStats.accuracyRate}%</div>
        </div>
      </div>

      {/* Mensaje motivacional */}
      <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-6">
        <p className="text-purple-900 font-semibold text-center">
          {getMotivationalMessage()}
        </p>
      </div>

      {/* Desafío del día */}
      <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl p-6 shadow-xl border-2 border-yellow-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative">
          <div className="flex items-start gap-4">
            <Zap className="w-10 h-10 text-white flex-shrink-0 drop-shadow" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2 drop-shadow">⚡ DESAFÍO DEL DÍA</h3>
              <p className="text-white/90 font-semibold mb-3">
                Responde 10 preguntas sin fallar
              </p>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <div className="text-white/80">Recompensa:</div>
                  <div className="text-white font-bold">+50 puntos XP</div>
                </div>
                <div className="text-sm text-right">
                  <div className="text-white/80">Caduca en:</div>
                  <div className="text-white font-bold">18h 42m</div>
                </div>
              </div>
            </div>
          </div>
          <button className="w-full mt-4 bg-white hover:bg-gray-100 text-orange-600 font-bold py-3 px-6 rounded-xl shadow-lg transition-all">
            Aceptar desafío
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-300 to-yellow-400 pb-24">
      <div className="max-w-4xl mx-auto p-4">
        <div className="pt-6 mb-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                ¡Hola{userData.name ? `, ${userData.name}` : ''}! 👋
              </h1>
            </div>
            <button
              onClick={() => setShowPremiumModal(true)}
              className="bg-gradient-to-r from-yellow-400 to-orange-400 text-purple-900 font-bold px-4 py-2 rounded-full text-sm flex items-center gap-1 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Crown className="w-4 h-4" />
              Premium
            </button>
          </div>

          {/* Contenido según tab activo */}
          {activeTab === 'inicio' && <InicioContent />}
          {activeTab === 'actividad' && <ActividadContent />}
          {activeTab === 'temas' && <TemasContent />}
          {activeTab === 'recursos' && <RecursosContent />}
        </div>
      </div>

      <BottomTabBar />
      {showPremiumModal && <PremiumModal />}
    </div>
  );
}
