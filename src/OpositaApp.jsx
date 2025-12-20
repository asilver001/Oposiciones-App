import React, { useState, useEffect } from 'react';
import { Home, BookOpen, Trophy, Clock, TrendingUp, ArrowLeft, CheckCircle, XCircle, Target, Flame, Zap, Star, Lock, Crown, BarChart3, Calendar, History, GraduationCap, Lightbulb, Info, Settings, ChevronRight, Instagram, Mail, Bell, User, LogOut, HelpCircle, FileText, Shield, ExternalLink } from 'lucide-react';
import { allQuestions, topicsList, getRandomQuestions } from './data/questions';
import { useAuth } from './contexts/AuthContext';
import { useAdmin } from './contexts/AdminContext';
import { SignUpForm, LoginForm, ForgotPasswordForm } from './components/auth';
import { AdminLoginModal, AdminPanel, ReviewerPanel } from './components/admin';
import { useUserInsights } from './hooks/useUserInsights';
import FeedbackPanel from './components/FeedbackPanel';
import Fortaleza from './components/Fortaleza';

// ============ ONBOARDING COMPONENTS (estilo simple purple-50) ============

function WelcomeScreen({ onStart, onSkip, onReset }) {
  const [float, setFloat] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setFloat(f => f === 0 ? -10 : 0), 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-6">
      <div className="text-center w-full max-w-md">
        <div
          className="w-24 h-24 bg-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg transition-transform duration-1000"
          style={{ transform: `translateY(${float}px)` }}
        >
          <span className="text-5xl">🎓</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Oposita Smart</h1>
        <p className="text-xl text-purple-600 font-semibold mb-2">Tu plaza, paso a paso</p>
        <p className="text-gray-500 mb-12">Unos minutos al día, a tu ritmo. Sin agobios.</p>
        <button
          onClick={onStart}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-5 px-8 rounded-2xl text-lg shadow-lg shadow-purple-600/30 transition-all active:scale-[0.98]"
        >
          Empezar
        </button>
        <div className="flex items-center justify-center gap-2 mt-12 pt-6 border-t border-gray-200">
          <button onClick={onSkip} className="text-gray-400 text-xs hover:text-gray-600">[DEV] Saltar</button>
          <span className="text-gray-300">·</span>
          <button onClick={onReset} className="text-red-300 text-xs hover:text-red-500">[DEV] Reset</button>
        </div>
      </div>
    </div>
  );
}

function OnboardingOposicion({ onSelect }) {
  const options = [
    { id: 'admin', label: 'Administrativo del Estado', icon: '🏢' },
    { id: 'aux', label: 'Auxiliar Administrativo', icon: '📄' },
    { id: 'gestion', label: 'Gestión del Estado', icon: '💼' },
    { id: 'otra', label: 'Otra oposición', icon: '📝' }
  ];
  return (
    <div className="min-h-screen bg-purple-50 px-6 pt-16">
      <div className="flex justify-center gap-2 mb-8">
        <div className="w-6 h-2 rounded-full bg-purple-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">¿Qué oposición preparas?</h1>
      <p className="text-gray-500 mb-8">Selecciona para personalizar tu experiencia</p>
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onSelect(o.id)}
          className="w-full bg-white rounded-2xl p-4 flex items-center mb-3 border-2 border-gray-100 hover:border-purple-600 transition-all"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
            <span className="text-2xl">{o.icon}</span>
          </div>
          <span className="flex-1 text-left font-medium text-gray-800">{o.label}</span>
          <span className="text-gray-400 text-2xl">›</span>
        </button>
      ))}
    </div>
  );
}

function OnboardingTiempo({ onSelect, onBack }) {
  const options = [
    { id: '15', label: '15 minutos', desc: 'Perfecto para empezar', questions: 10 },
    { id: '30', label: '30 minutos', desc: 'Ritmo constante', questions: 20 },
    { id: '60', label: '1 hora o más', desc: 'Máximo rendimiento', questions: 40 }
  ];
  return (
    <div className="min-h-screen bg-purple-50 px-6 pt-16">
      <button onClick={onBack} className="mb-6 text-gray-700 flex items-center gap-2">
        <ArrowLeft className="w-5 h-5" /> Atrás
      </button>
      <div className="flex justify-center gap-2 mb-8">
        <div className="w-2 h-2 rounded-full bg-purple-600"></div>
        <div className="w-6 h-2 rounded-full bg-purple-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">¿Cuánto tiempo al día?</h1>
      <p className="text-gray-500 mb-8">Puedes cambiarlo cuando quieras</p>
      {options.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t)}
          className="w-full bg-white rounded-2xl p-5 mb-3 border-2 border-gray-100 hover:border-purple-600 text-left transition-all"
        >
          <p className="font-semibold text-gray-800 text-lg">{t.label}</p>
          <p className="text-gray-500 text-sm mt-1">{t.desc}</p>
        </button>
      ))}
    </div>
  );
}

function OnboardingFecha({ onSelect, onBack }) {
  const options = [
    { id: '3m', label: 'En menos de 3 meses' },
    { id: '6m', label: 'Entre 3 y 6 meses' },
    { id: '1y', label: 'Más de 6 meses' },
    { id: 'ns', label: 'Todavía no lo sé' }
  ];
  return (
    <div className="min-h-screen bg-purple-50 px-6 pt-16">
      <button onClick={onBack} className="mb-6 text-gray-700 flex items-center gap-2">
        <ArrowLeft className="w-5 h-5" /> Atrás
      </button>
      <div className="flex justify-center gap-2 mb-8">
        <div className="w-2 h-2 rounded-full bg-purple-600"></div>
        <div className="w-2 h-2 rounded-full bg-purple-600"></div>
        <div className="w-6 h-2 rounded-full bg-purple-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">¿Cuándo es tu examen?</h1>
      <p className="text-gray-500 mb-8">Así adaptamos el plan a tu ritmo</p>
      {options.map((f) => (
        <button
          key={f.id}
          onClick={() => onSelect(f.label)}
          className="w-full bg-white rounded-2xl p-5 mb-3 border-2 border-gray-100 hover:border-purple-600 text-left transition-all"
        >
          <p className="font-medium text-gray-800">{f.label}</p>
        </button>
      ))}
    </div>
  );
}

function OnboardingIntro({ onStart, onSkip, onBack }) {
  return (
    <div className="min-h-screen bg-purple-50 px-6 pt-16">
      <button onClick={onBack} className="mb-6 text-gray-700 flex items-center gap-2">
        <ArrowLeft className="w-5 h-5" /> Atrás
      </button>
      <div className="flex justify-center gap-2 mb-12">
        <div className="w-2 h-2 rounded-full bg-purple-600"></div>
        <div className="w-2 h-2 rounded-full bg-purple-600"></div>
        <div className="w-2 h-2 rounded-full bg-purple-600"></div>
        <div className="w-6 h-2 rounded-full bg-purple-600"></div>
      </div>
      <div className="text-center">
        <div className="w-20 h-20 bg-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
          <span className="text-4xl">🚀</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">¡Vamos a hacer tu primer test!</h1>
        <p className="text-gray-500 mb-12">5 preguntas para conocer tu nivel. Sin presión, es solo para personalizar tu experiencia.</p>
        <button
          onClick={onStart}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-5 px-8 rounded-2xl text-lg shadow-lg shadow-purple-600/30 transition-all active:scale-[0.98]"
        >
          Empezar test
        </button>
        <button onClick={onSkip} className="mt-4 text-gray-500 text-sm">
          Saltar por ahora
        </button>
      </div>
    </div>
  );
}

// ============ DEV PANEL COMPONENT ============

function DevPanel({ onReset, onGoToOnboarding, onShowPremium, onShowAdminLogin, streakCount, testsCount }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 left-4 z-50 w-10 h-10 bg-gray-900/80 hover:bg-gray-900 text-white rounded-full shadow-lg flex items-center justify-center text-xs font-bold"
      >
        DEV
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 left-4 z-50 bg-gray-900/95 rounded-2xl p-4 shadow-2xl min-w-[200px]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-white font-semibold text-sm">🛠️ Dev Tools</span>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white text-lg">×</button>
      </div>
      <div className="space-y-2">
        <button onClick={onShowAdminLogin} className="w-full bg-indigo-500/90 hover:bg-indigo-600 text-white text-xs py-2 px-3 rounded-lg text-left">
          🔐 Acceso Admin
        </button>
        <div className="border-t border-gray-700 my-2"></div>
        <button onClick={onReset} className="w-full bg-red-500/90 hover:bg-red-600 text-white text-xs py-2 px-3 rounded-lg text-left">
          🗑️ Reset TODO
        </button>
        <button onClick={onGoToOnboarding} className="w-full bg-purple-500/90 hover:bg-purple-600 text-white text-xs py-2 px-3 rounded-lg text-left">
          🔄 Ir a Onboarding
        </button>
        <button onClick={onShowPremium} className="w-full bg-yellow-500/90 hover:bg-yellow-600 text-white text-xs py-2 px-3 rounded-lg text-left">
          👑 Ver Premium Modal
        </button>
        <div className="pt-2 border-t border-gray-700 text-[10px] text-gray-500">
          streak: {streakCount} · tests: {testsCount}
        </div>
      </div>
    </div>
  );
}

// ============ MAIN APP COMPONENT ============

export default function OpositaApp() {
  // Auth hook
  const {
    user,
    loading: authLoading,
    error: authError,
    signUp,
    signIn,
    signOut,
    resetPassword,
    isAuthenticated,
    isAnonymous,
    continueAsAnonymous
  } = useAuth();

  // Admin context
  const { adminUser, isAdmin, isReviewer, isLoggedIn: isAdminLoggedIn } = useAdmin();
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);

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
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
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

  // Insights state
  const [recentInsights, setRecentInsights] = useState([]);
  const [lastSessionStats, setLastSessionStats] = useState(null);
  const [showFeedbackPanel, setShowFeedbackPanel] = useState(false);

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

  // Las preguntas (allQuestions) y lista de temas (topicsList) se importan desde ./data/questions
  // Para añadir más preguntas, edita los archivos en src/data/questions/

  // Estado para las preguntas del test actual
  const [questions, setQuestions] = useState([]);

  // Seleccionar preguntas aleatorias para cada test
  const selectRandomQuestions = (count = 5) => {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Inicializar preguntas
  useEffect(() => {
    if (questions.length === 0) {
      setQuestions(selectRandomQuestions(5));
    }
  }, []);

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

  // Mensaje empático según racha (tono sobrio)
  const getStreakMessage = () => {
    const days = streakData.current;
    if (days === 0) return { main: "Hoy es un buen día para empezar", sub: null };
    if (days === 1) return { main: "Llevas 1 día", sub: "Un paso cada vez" };
    if (days <= 3) return { main: `Llevas ${days} días seguidos`, sub: "Vas por buen camino" };
    if (days <= 6) return { main: `Llevas ${days} días seguidos`, sub: "La constancia suma" };
    if (days <= 13) return { main: `Llevas ${days} días seguidos`, sub: "Una semana de progreso" };
    return { main: `Llevas ${days} días seguidos`, sub: "La constancia da resultados" };
  };

  // Días para próximo logro
  const getDaysToNextBadge = () => {
    const nextBadge = badges.find(b => b.days > streakData.current);
    return nextBadge ? nextBadge.days - streakData.current : null;
  };

  const startTest = () => {
    setQuestions(selectRandomQuestions(5));
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

  // Load insights data when on home page
  const { getRecentInsights, getLastSessionStats, markInsightAsSeen } = useUserInsights();

  useEffect(() => {
    if (!isLoading && currentPage === 'home' && isAuthenticated) {
      const loadInsightsData = async () => {
        try {
          const [insights, stats] = await Promise.all([
            getRecentInsights(5, true), // solo no vistos
            getLastSessionStats()
          ]);

          setRecentInsights(insights || []);
          setLastSessionStats(stats);
          setShowFeedbackPanel((insights || []).length > 0);
        } catch (error) {
          console.error('Error loading insights:', error);
        }
      };
      loadInsightsData();
    }
  }, [isLoading, currentPage, isAuthenticated]);

  // Premium Modal Component - Versión "Próximamente"
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
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-16 h-16 text-white drop-shadow-lg" />
            <span className="bg-white/30 text-white text-sm font-bold px-3 py-1 rounded-full">🚀 Próximamente</span>
          </div>
          <h2 className="text-3xl font-bold text-white text-center drop-shadow">Premium</h2>
          <p className="text-white/90 text-center mt-2 font-medium">Muy pronto disponible</p>
        </div>

        <div className="p-6">
          {/* Mensaje próximamente */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-6">
            <p className="text-purple-800 text-center font-medium">
              La suscripción premium estará disponible próximamente con acceso a todas las preguntas y funciones avanzadas.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3">
              <div className="text-gray-500 text-sm font-bold mb-3">GRATIS (ACTUAL)</div>
              <div className="text-sm text-gray-600 space-y-2">
                <div>✓ Tests diarios</div>
                <div>✓ 2 temas</div>
                <div>✓ Resultados básicos</div>
                <div>✓ Sistema de rachas</div>
              </div>
            </div>
            <div className="text-center border-2 border-gray-300 rounded-xl p-3 bg-gray-50 opacity-75">
              <div className="text-gray-500 font-bold text-sm mb-3 flex items-center justify-center gap-1">
                <Crown className="w-4 h-4" />
                PREMIUM
                <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded ml-1">Pronto</span>
              </div>
              <div className="text-sm text-gray-500 space-y-2">
                <div>Tests ilimitados</div>
                <div>4 temas completos</div>
                <div className="flex items-center justify-center gap-1">
                  <span>Análisis IA</span>
                </div>
                <div>Simulacros reales</div>
              </div>
            </div>
          </div>

          <button
            disabled
            className="w-full bg-gray-300 text-gray-500 font-bold py-4 px-6 rounded-2xl shadow-lg mb-3 cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span>🚀</span>
            Próximamente
          </button>

          <button
            onClick={() => setShowPremiumModal(false)}
            className="w-full text-purple-600 font-semibold py-3 hover:text-purple-800"
          >
            Continuar con plan gratuito
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Te avisaremos cuando esté disponible
          </p>
        </div>
      </div>
    </div>
  );

  // Bottom Tab Bar Component - Fase 1 floating style
  const BottomTabBar = () => (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-2">
      {/* Contenedor floating con márgenes, sombra y bordes redondeados */}
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-[20px] shadow-[0_2px_24px_rgba(0,0,0,0.12)] border border-gray-100/80">
          <div className="flex justify-around items-center h-[58px] px-1">
            {[
              { id: 'inicio', label: 'Inicio', icon: Home },
              { id: 'actividad', label: 'Actividad', icon: History },
              { id: 'temas', label: 'Temas', icon: BookOpen },
              { id: 'recursos', label: 'Recursos', icon: GraduationCap }
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex flex-col items-center justify-center min-w-[4rem] py-1 px-2 rounded-xl transition-all duration-200 active:scale-95"
                >
                  <div className={`
                    flex items-center justify-center w-9 h-9 rounded-full mb-0.5 transition-all duration-200
                    ${isActive ? 'bg-gray-100' : ''}
                  `}>
                    <tab.icon
                      className={`
                        w-[22px] h-[22px] transition-all duration-200
                        ${isActive
                          ? 'text-gray-900 stroke-[2]'
                          : 'text-gray-400 stroke-[1.5]'
                        }
                      `}
                    />
                  </div>
                  <span className={`
                    text-[10px] leading-tight transition-all duration-200
                    ${isActive
                      ? 'text-gray-900 font-semibold'
                      : 'text-gray-400 font-medium'
                    }
                  `}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
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

  // Helper function for dev reset
  const handleDevReset = async () => {
    await window.storage.remove('oposita-onboarding-complete');
    await window.storage.remove('oposita-user');
    await window.storage.remove('oposita-stats-v2');
    await window.storage.remove('oposita-progress-v2');
    await window.storage.remove('oposita-streak');
    await window.storage.remove('oposita-daily-tests');
    await window.storage.remove('oposita-signup-count');
    await window.storage.remove('oposita-premium');
    window.location.reload();
  };

  // ADMIN PANELS (render before other pages)
  if (currentPage === 'admin-panel' && isAdminLoggedIn) {
    return <AdminPanel onBack={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'reviewer-panel' && isAdminLoggedIn) {
    return <ReviewerPanel onBack={() => setCurrentPage('home')} />;
  }

  // ONBOARDING SCREENS (using simple purple-50 components)
  if (currentPage === 'welcome') {
    return (
      <WelcomeScreen
        onStart={() => setCurrentPage('onboarding1')}
        onSkip={() => { completeOnboarding(); setCurrentPage('home'); }}
        onReset={handleDevReset}
      />
    );
  }

  if (currentPage === 'onboarding1') {
    return <OnboardingOposicion onSelect={() => setCurrentPage('onboarding2')} />;
  }

  if (currentPage === 'onboarding2') {
    return (
      <OnboardingTiempo
        onSelect={(option) => {
          setUserData({ ...userData, dailyGoal: option.questions, dailyGoalMinutes: parseInt(option.id) });
          setCurrentPage('onboarding3');
        }}
        onBack={() => setCurrentPage('onboarding1')}
      />
    );
  }

  if (currentPage === 'onboarding3') {
    return (
      <OnboardingFecha
        onSelect={(label) => {
          setUserData({ ...userData, examDate: label });
          setCurrentPage('onboarding4');
        }}
        onBack={() => setCurrentPage('onboarding2')}
      />
    );
  }

  if (currentPage === 'onboarding4') {
    return (
      <OnboardingIntro
        onStart={() => { completeOnboarding(); startTest(); }}
        onSkip={() => { completeOnboarding(); setCurrentPage('home'); }}
        onBack={() => setCurrentPage('onboarding3')}
      />
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

  // PANTALLA SIGNUP (usando componente SignUpForm)
  if (currentPage === 'signup') {
    return (
      <SignUpForm
        onSignUp={async (email, password, metadata) => {
          const result = await signUp(email, password, metadata);
          if (!result.error) {
            // Update local userData
            const newUserData = {
              ...userData,
              name: metadata?.display_name || '',
              email: email,
              accountCreated: true
            };
            setUserData(newUserData);
            await window.storage.set('oposita-user', JSON.stringify(newUserData));
          }
          return result;
        }}
        onGoToLogin={() => setCurrentPage('login')}
        onSkip={() => {
          continueAsAnonymous();
          handleSkipSignup();
        }}
        onShowPrivacy={(type) => setCurrentPage(type === 'terms' ? 'terms' : 'privacy')}
        loading={authLoading}
        error={authError}
      />
    );
  }

  // PANTALLA LOGIN
  if (currentPage === 'login') {
    return (
      <LoginForm
        onLogin={async (email, password) => {
          const result = await signIn(email, password);
          if (!result.error && result.data?.user) {
            // Update local userData with Supabase user data
            const newUserData = {
              ...userData,
              name: result.data.user.user_metadata?.display_name || email.split('@')[0],
              email: email,
              accountCreated: true
            };
            setUserData(newUserData);
            await window.storage.set('oposita-user', JSON.stringify(newUserData));
            setCurrentPage('home');
          }
          return result;
        }}
        onGoToSignUp={() => setCurrentPage('signup')}
        onForgotPassword={() => setCurrentPage('forgot-password')}
        onSkip={() => {
          continueAsAnonymous();
          handleSkipSignup();
        }}
        onBack={() => setCurrentPage('signup')}
        loading={authLoading}
        error={authError}
      />
    );
  }

  // PANTALLA RECUPERAR CONTRASEÑA
  if (currentPage === 'forgot-password') {
    return (
      <ForgotPasswordForm
        onResetPassword={resetPassword}
        onGoToLogin={() => setCurrentPage('login')}
        onBack={() => setCurrentPage('login')}
        loading={authLoading}
        error={authError}
      />
    );
  }

  // PÁGINA DE PRIVACIDAD
  if (currentPage === 'privacy') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 text-purple-600 font-medium mb-6 hover:text-purple-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Política de Privacidad</h1>
            <div className="prose prose-sm text-gray-600 space-y-4">
              <p><strong>Última actualización:</strong> Diciembre 2024</p>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">1. Responsable del tratamiento</h2>
              <p>Oposita Smart es una aplicación web educativa. Todos los datos se almacenan localmente en tu dispositivo mediante localStorage.</p>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">2. Datos que recopilamos</h2>
              <p>Almacenamos localmente en tu navegador:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Progreso de estudio y estadísticas</li>
                <li>Preferencias de configuración</li>
                <li>Nombre y email (solo si los proporcionas voluntariamente)</li>
              </ul>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">3. Uso de los datos</h2>
              <p>Los datos se utilizan exclusivamente para:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Guardar tu progreso de estudio</li>
                <li>Personalizar tu experiencia</li>
                <li>Mostrar estadísticas de rendimiento</li>
              </ul>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">4. Almacenamiento local</h2>
              <p>Todos los datos se guardan en el localStorage de tu navegador. No enviamos datos a servidores externos. Puedes eliminar estos datos en cualquier momento borrando los datos de navegación.</p>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">5. Tus derechos</h2>
              <p>Conforme al RGPD, tienes derecho a acceder, rectificar y eliminar tus datos. Como los datos están en tu dispositivo, tienes control total sobre ellos.</p>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">6. Contacto</h2>
              <p>Para cualquier consulta sobre privacidad, puedes contactarnos a través de la sección de contacto de la aplicación.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PÁGINA DE TÉRMINOS Y CONDICIONES
  if (currentPage === 'terms') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 text-purple-600 font-medium mb-6 hover:text-purple-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Términos y Condiciones</h1>
            <div className="prose prose-sm text-gray-600 space-y-4">
              <p><strong>Última actualización:</strong> Diciembre 2024</p>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">1. Aceptación de los términos</h2>
              <p>Al utilizar Oposita Smart, aceptas estos términos y condiciones. Si no estás de acuerdo, por favor no utilices la aplicación.</p>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">2. Descripción del servicio</h2>
              <p>Oposita Smart es una aplicación web gratuita de preparación para oposiciones de Administrativo del Estado. Ofrecemos tests de práctica, seguimiento de progreso y material de estudio.</p>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">3. Uso permitido</h2>
              <p>Te comprometes a:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Usar la aplicación solo con fines educativos personales</li>
                <li>No intentar copiar o redistribuir el contenido</li>
                <li>No realizar ingeniería inversa del software</li>
              </ul>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">4. Propiedad intelectual</h2>
              <p>Todo el contenido de Oposita Smart, incluyendo textos, diseños y funcionalidades, está protegido por derechos de autor.</p>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">5. Limitación de responsabilidad</h2>
              <p>Oposita Smart se proporciona "tal cual". No garantizamos que el uso de la aplicación resulte en la aprobación de oposiciones. El contenido es orientativo y complementario a otros materiales de estudio.</p>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">6. Modificaciones</h2>
              <p>Nos reservamos el derecho de modificar estos términos. Los cambios serán efectivos desde su publicación en la aplicación.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PÁGINA DE AVISO LEGAL
  if (currentPage === 'legal') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 text-purple-600 font-medium mb-6 hover:text-purple-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Aviso Legal</h1>
            <div className="prose prose-sm text-gray-600 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mt-6">1. Información general</h2>
              <p>Oposita Smart es una aplicación web educativa para la preparación de oposiciones.</p>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">2. Objeto</h2>
              <p>Esta aplicación tiene como finalidad proporcionar herramientas de estudio y práctica para personas que se preparan para oposiciones de Administrativo del Estado.</p>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">3. Condiciones de acceso</h2>
              <p>El acceso a Oposita Smart es gratuito. Algunas funcionalidades premium pueden requerir suscripción en el futuro.</p>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">4. Propiedad intelectual</h2>
              <p>Todos los contenidos de esta aplicación (textos, imágenes, código, diseño) son propiedad de Oposita Smart o se utilizan con autorización.</p>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">5. Legislación aplicable</h2>
              <p>Este aviso legal se rige por la legislación española. Para cualquier controversia, serán competentes los juzgados y tribunales de España.</p>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">6. LSSI-CE</h2>
              <p>En cumplimiento de la Ley 34/2002, de 11 de julio, de servicios de la sociedad de la información y de comercio electrónico, le informamos que esta es una aplicación web de carácter educativo.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PÁGINA ACERCA DE
  if (currentPage === 'about') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 text-purple-600 font-medium mb-6 hover:text-purple-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-center mb-6">
              <div className="inline-block bg-purple-100 rounded-full p-4 mb-4">
                <Trophy className="w-12 h-12 text-purple-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Oposita Smart</h1>
              <p className="text-purple-600 font-medium">La forma inteligente de opositar</p>
            </div>

            <div className="prose prose-sm text-gray-600 space-y-4">
              <p>Oposita Smart nace con la misión de hacer la preparación de oposiciones más accesible, efectiva y motivadora.</p>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">Nuestra misión</h2>
              <p>Creemos que preparar unas oposiciones no tiene por qué ser un proceso solitario y tedioso. Nuestra aplicación está diseñada para ayudarte a estudiar de forma más inteligente, con seguimiento de progreso, rachas de estudio y contenido actualizado.</p>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">Características</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Tests de práctica con explicaciones detalladas</li>
                <li>Seguimiento de progreso y estadísticas</li>
                <li>Sistema de rachas para mantener la motivación</li>
                <li>Contenido actualizado según el temario oficial</li>
                <li>Funciona offline una vez cargada</li>
              </ul>

              <h2 className="text-lg font-semibold text-gray-900 mt-6">Tecnología</h2>
              <p>Oposita Smart es una Progressive Web App (PWA) que puedes instalar en tu dispositivo y usar sin conexión. Tus datos se guardan localmente para máxima privacidad.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PÁGINA FAQ
  if (currentPage === 'faq') {
    const faqs = [
      {
        q: "¿Es gratis Oposita Smart?",
        a: "Sí, Oposita Smart es completamente gratuito. Ofrecemos acceso a tests de práctica, seguimiento de progreso y material de estudio sin coste."
      },
      {
        q: "¿Puedo usar la app sin conexión?",
        a: "Sí, Oposita Smart es una Progressive Web App (PWA). Una vez cargada, puedes usarla sin conexión a internet. Tu progreso se guarda localmente."
      },
      {
        q: "¿Cómo se guarda mi progreso?",
        a: "Tu progreso se guarda automáticamente en el almacenamiento local de tu navegador (localStorage). No necesitas crear una cuenta para guardar tu avance."
      },
      {
        q: "¿El contenido está actualizado?",
        a: "Sí, nuestras preguntas están basadas en el temario oficial de oposiciones de Administrativo del Estado y se actualizan regularmente."
      },
      {
        q: "¿Puedo instalar la app en mi móvil?",
        a: "Sí, puedes instalar Oposita Smart como una app en tu móvil. En el navegador, busca la opción 'Añadir a pantalla de inicio' o 'Instalar aplicación'."
      },
      {
        q: "¿Qué pasa si borro los datos del navegador?",
        a: "Si borras los datos de navegación o el localStorage, perderás tu progreso guardado. Recomendamos no limpiar los datos de este sitio si quieres conservar tu avance."
      },
      {
        q: "¿Cómo funciona el sistema de rachas?",
        a: "El sistema de rachas cuenta los días consecutivos que estudias. Completa al menos un test cada día para mantener tu racha activa y ganar insignias."
      },
      {
        q: "¿Puedo sugerir mejoras o reportar errores?",
        a: "¡Por supuesto! Usa la sección de contacto para enviarnos tus sugerencias, reportar errores o cualquier otra consulta."
      }
    ];

    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 text-purple-600 font-medium mb-6 hover:text-purple-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Preguntas Frecuentes</h1>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600 text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PÁGINA DE CONTACTO
  if (currentPage === 'contact') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 text-purple-600 font-medium mb-6 hover:text-purple-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Contacto</h1>
            <p className="text-gray-600 mb-6">¿Tienes alguna pregunta, sugerencia o has encontrado un error? Nos encantaría saber de ti.</p>

            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              alert('Gracias por tu mensaje. Te responderemos lo antes posible.');
            }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Tu nombre"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="tu@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
                <select className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option>Sugerencia</option>
                  <option>Reportar error</option>
                  <option>Pregunta general</option>
                  <option>Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                <textarea
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows="4"
                  placeholder="Escribe tu mensaje aquí..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition"
              >
                Enviar mensaje
              </button>
            </form>
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
          <a
            href="https://www.boe.es/buscar/boe.php"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-purple-600 hover:text-purple-700 font-medium"
          >
            📄 BOE - Convocatorias oficiales
          </a>
          <a
            href="https://www.hacienda.gob.es/es-ES/Areas%20Tematicas/Funcion%20Publica/Paginas/Cuerpos%20y%20Escalas.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-purple-600 hover:text-purple-700 font-medium"
          >
            📚 Información oficial de oposiciones
          </a>
          <button
            onClick={() => setCurrentPage('faq')}
            className="block text-purple-600 hover:text-purple-700 font-medium text-left"
          >
            ❓ Preguntas frecuentes
          </button>
          <button
            onClick={() => setCurrentPage('contact')}
            className="block text-purple-600 hover:text-purple-700 font-medium text-left"
          >
            ✉️ Contacto
          </button>
        </div>
      </div>
    </div>
  );

  // Contenido de Inicio - Rediseño UX (calma, continuidad, acompañamiento)
  const InicioContent = () => {
    const streakMessage = getStreakMessage();
    const daysToNext = getDaysToNextBadge();

    // Mock data for Fortaleza - TODO: Replace with real data from topicsProgress
    const fortalezaTemas = [
      { id: 1, nombre: 'Constitucion Espanola', progreso: 4, estado: 'progresando' },
      { id: 2, nombre: 'Organizacion del Estado', progreso: 2, estado: 'nuevo' },
      { id: 3, nombre: 'Derecho Administrativo', progreso: 6, estado: 'solido' },
      { id: 4, nombre: 'Administracion Publica', progreso: 1, estado: 'peligro' },
    ];

    return (
      <>
        {/* Banner protege tu racha */}
        {streakData.current >= 3 && !userData.accountCreated && showStreakBanner && (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 mb-6 shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Flame className="w-6 h-6 text-yellow-300 flex-shrink-0" />
                <div>
                  <p className="text-white font-bold">Protege tu racha de {streakData.current} días</p>
                  <p className="text-white/80 text-sm">Crea tu cuenta para no perder tu progreso.</p>
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

        {/* FeedbackPanel - Insights de la última sesión */}
        {showFeedbackPanel && lastSessionStats && (
          <div className="mb-6">
            <FeedbackPanel
              insights={recentInsights}
              sessionStats={{
                correctas: lastSessionStats.correctas || 0,
                incorrectas: lastSessionStats.incorrectas || 0,
                en_blanco: lastSessionStats.en_blanco || 0,
                porcentaje_acierto: lastSessionStats.porcentaje_acierto || 0
              }}
              sessionDate={lastSessionStats.created_at}
              defaultExpanded={false}
              onInsightAction={(insight) => {
                // Mark insight as seen when user interacts
                if (insight.id) {
                  markInsightAsSeen(insight.id);
                }
              }}
            />
          </div>
        )}

        {/* Fortaleza - Progreso por tema */}
        {fortalezaTemas.length > 0 && (
          <div className="mb-6">
            <Fortaleza
              temas={fortalezaTemas}
              onVerTodo={() => setActiveTab('temas')}
              maxVisible={3}
            />
          </div>
        )}

        {/* Tu Sesión de Hoy */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-gray-800 flex items-center gap-2">
              🎯 Tu Sesion de Hoy
            </span>
            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full font-medium">
              ~20 min
            </span>
          </div>

          {/* Session Items */}
          <div className="space-y-3 mb-4">
            {/* Tema nuevo */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-lg">
                📗
              </div>
              <div>
                <div className="font-medium text-gray-800">Tema 8 - AGE Central</div>
                <div className="text-sm text-gray-500">Tema nuevo · 15 preguntas</div>
              </div>
            </div>

            {/* Repaso */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-lg">
                🔄
              </div>
              <div>
                <div className="font-medium text-gray-800">Tema 4 - La Corona</div>
                <div className="text-sm text-gray-500">Repaso · Art. 57 debil</div>
              </div>
            </div>
          </div>

          {/* Botón Empezar */}
          <button
            onClick={startTest}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all active:scale-[0.98]"
          >
            Empezar sesion →
          </button>
        </div>

        {/* Ver más opciones */}
        <button
          onClick={() => console.log('TODO: Abrir modal de opciones')}
          className="w-full text-center text-purple-600 font-medium hover:text-purple-700 mb-6"
        >
          Ver mas opciones →
        </button>

        {/* Reto del día (opcional, discreto) */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Reto del dia</p>
                <p className="text-xs text-gray-500">10 preguntas seguidas</p>
              </div>
            </div>
            <button
              onClick={startTest}
              className="px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition"
            >
              Intentar
            </button>
          </div>
        </div>
      </>
    );
  };

  // Calcular porcentaje de progreso diario para el mini indicador de la TopBar
  const dailyProgressPercent = Math.min(Math.round((totalStats.todayQuestions / userData.dailyGoal) * 100), 100);

  // Página de Ajustes estilo Tiimo
  const SettingsModal = () => {
    const SettingsRow = ({ icon: Icon, label, onClick, rightText, locked, external }) => (
      <button
        onClick={onClick}
        disabled={locked}
        className={`w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50 transition ${locked ? 'opacity-50' : ''}`}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-gray-500" />
          <span className="text-gray-700">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          {rightText && <span className="text-gray-400 text-sm">{rightText}</span>}
          {locked ? (
            <Lock className="w-4 h-4 text-gray-400" />
          ) : external ? (
            <ExternalLink className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>
    );

    const SectionTitle = ({ children }) => (
      <h3 className="text-sm font-semibold text-gray-900 px-4 pt-6 pb-2">{children}</h3>
    );

    return (
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-lg border-b border-gray-100 z-10">
          <div className="flex items-center h-14 px-4">
            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        <div className="px-4 pb-8">
          {/* Título */}
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-7 h-7 text-gray-700" />
            <h1 className="text-2xl font-bold text-gray-900">Ajustes</h1>
          </div>

          {/* Sección: Ajustes */}
          <SectionTitle>Ajustes</SectionTitle>
          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
            <SettingsRow icon={Bell} label="Notificaciones" onClick={() => {}} rightText="Próximamente" locked />
            <SettingsRow icon={Calendar} label="Meta diaria" onClick={() => {}} rightText={`${userData.dailyGoal} preguntas`} locked />
          </div>

          {/* Sección: Perfil */}
          <SectionTitle>Perfil</SectionTitle>
          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
            <SettingsRow icon={User} label="Editar perfil" onClick={() => {}} rightText={userData.name || 'Sin nombre'} locked />
          </div>

          {/* Sección: Cuenta y suscripción */}
          <SectionTitle>Cuenta y suscripción</SectionTitle>
          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
            <SettingsRow icon={Crown} label="Plan Premium" onClick={() => setShowPremiumModal(true)} rightText="Próximamente" />
            <SettingsRow icon={Mail} label="Contacto" onClick={() => { setShowSettingsModal(false); setCurrentPage('contact'); }} />
            {isAuthenticated ? (
              <SettingsRow
                icon={LogOut}
                label="Cerrar sesión"
                onClick={async () => {
                  await signOut();
                  setShowSettingsModal(false);
                  setCurrentPage('welcome');
                }}
              />
            ) : (
              <SettingsRow
                icon={User}
                label="Iniciar sesión"
                onClick={() => {
                  setShowSettingsModal(false);
                  setCurrentPage('login');
                }}
              />
            )}
          </div>

          {/* Sección: Otros */}
          <SectionTitle>Otros</SectionTitle>
          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
            <SettingsRow icon={Shield} label="Política de privacidad" onClick={() => { setShowSettingsModal(false); setCurrentPage('privacy'); }} />
            <SettingsRow icon={FileText} label="Términos de servicio" onClick={() => { setShowSettingsModal(false); setCurrentPage('terms'); }} />
            <SettingsRow icon={FileText} label="Aviso legal" onClick={() => { setShowSettingsModal(false); setCurrentPage('legal'); }} />
          </div>

          {/* Info de la app */}
          <div className="text-center pt-8 pb-4">
            <p className="text-gray-900 font-medium">Oposita Smart</p>
            <p className="text-gray-500 text-sm mt-1">La forma inteligente de opositar</p>
            <p className="text-gray-400 text-xs mt-3">
              Versión 1.0.0
            </p>
            {userData.email && (
              <p className="text-gray-400 text-xs mt-1">
                {userData.email}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Modal de Progreso Diario
  const ProgressModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md max-h-[85vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Tu progreso de hoy</h3>
          <button
            onClick={() => setShowProgressModal(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <XCircle className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Anillo de progreso grande */}
          <div className="flex flex-col items-center py-4">
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" fill="none" stroke="#F3E8FF" strokeWidth="12" />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="12"
                  strokeDasharray={`${Math.min((totalStats.todayQuestions / userData.dailyGoal) * 352, 352)} 352`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">
                  {Math.min(Math.round((totalStats.todayQuestions / userData.dailyGoal) * 100), 100)}%
                </span>
              </div>
            </div>
            <p className="text-gray-600">
              <span className="text-2xl font-bold text-gray-900">{totalStats.todayQuestions}</span>
              <span className="text-gray-500">/{userData.dailyGoal} preguntas</span>
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {totalStats.todayQuestions >= userData.dailyGoal
                ? '¡Objetivo cumplido! 🎉'
                : `Te quedan ${Math.max(0, userData.dailyGoal - totalStats.todayQuestions)} preguntas`}
            </p>
          </div>

          {/* Stats en grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-4 h-4 text-purple-500" />
                <span className="text-xs text-gray-500 font-medium">Tests completados</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{totalStats.testsCompleted}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-green-500" />
                <span className="text-xs text-gray-500 font-medium">Tasa de acierto</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{totalStats.accuracyRate}%</p>
            </div>
          </div>

          {/* Info examen */}
          <div className="bg-purple-50 rounded-xl p-4">
            {daysUntilExam ? (
              <p className="text-gray-700 text-sm">
                📅 Te quedan <span className="font-bold text-purple-600">{daysUntilExam} días</span> para tu examen
              </p>
            ) : (
              <p className="text-gray-600 text-sm">
                🤔 Aún no tienes fecha de examen
              </p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              📊 Llevas <span className="font-semibold">{totalProgress}%</span> del temario
            </p>
          </div>

          {/* Botón de acción */}
          {totalStats.todayQuestions < userData.dailyGoal && (
            <button
              onClick={() => {
                setShowProgressModal(false);
                startTest();
              }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 rounded-xl transition-all active:scale-[0.98]"
            >
              Continuar estudiando →
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Nueva TopBar fija - Fase 1
  const TopBar = () => (
    <div className="fixed top-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-lg shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Izquierda - Botón de progreso diario */}
          <button
            onClick={() => setShowProgressModal(true)}
            className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-purple-50 active:scale-95 transition-all duration-200"
          >
            {/* Mini anillo de progreso */}
            <svg className="w-9 h-9 transform -rotate-90">
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#F3E8FF"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="3"
                strokeDasharray={`${(dailyProgressPercent / 100) * 88} 88`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <span className="absolute text-[10px] font-bold text-purple-600">
              {dailyProgressPercent}
            </span>
          </button>

          {/* Centro - Título */}
          <h1 className="text-[15px] font-semibold text-gray-800 tracking-tight">
            {activeTab === 'inicio' && 'Oposita Smart'}
            {activeTab === 'actividad' && 'Actividad'}
            {activeTab === 'temas' && 'Temas'}
            {activeTab === 'recursos' && 'Recursos'}
          </h1>

          {/* Derecha - Botón de ajustes */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:scale-95 transition-all duration-200"
          >
            <Settings className="w-[18px] h-[18px] text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 pb-28">
      {/* Nueva TopBar fija */}
      <TopBar />

      <div className="max-w-4xl mx-auto px-4 pt-16">
        <div className="pt-4 mb-6">
          {/* Área de saludo - Fase 1 rediseñada */}
          {activeTab === 'inicio' && (
            <div className="mb-5">
              <p className="text-[13px] font-medium text-purple-500 mb-0.5 capitalize">
                {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
              <h2 className="text-[22px] font-bold text-gray-900 leading-tight mb-0.5">
                Tu progreso de hoy
              </h2>
              <p className="text-gray-400 text-sm">
                {userData.name ? `${userData.name}, continúa` : 'Continúa'} donde lo dejaste
              </p>
            </div>
          )}

          {/* Contenido según tab activo */}
          {activeTab === 'inicio' && <InicioContent />}
          {activeTab === 'actividad' && <ActividadContent />}
          {activeTab === 'temas' && <TemasContent />}
          {activeTab === 'recursos' && <RecursosContent />}

          {/* Footer */}
          <footer className="mt-10">
            {/* Lista de opciones - solo en inicio */}
            {activeTab === 'inicio' && (
              <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100 overflow-hidden mb-8">
                <button
                  onClick={() => setCurrentPage('about')}
                  className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <Info className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">Acerca de</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </button>
                <button
                  onClick={() => setCurrentPage('faq')}
                  className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">FAQ</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </button>
                <button
                  onClick={() => window.open('https://instagram.com', '_blank')}
                  className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <Instagram className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">Síguenos en Instagram</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </button>
              </div>
            )}

            {/* Nombre y slogan - en todas las pestañas */}
            <div className="text-center py-6">
              <p className="text-gray-900 font-semibold text-lg mb-1">Oposita Smart</p>
              <p className="text-gray-500 text-sm">La forma inteligente de opositar</p>
              <p className="text-xs text-gray-400 mt-4">
                © {new Date().getFullYear()} Oposita Smart
              </p>
            </div>
          </footer>
        </div>
      </div>

      {/* DEV Panel Colapsable */}
      <DevPanel
        onReset={handleDevReset}
        onGoToOnboarding={() => setCurrentPage('welcome')}
        onShowPremium={() => setShowPremiumModal(true)}
        onShowAdminLogin={() => setShowAdminLoginModal(true)}
        streakCount={streakData.current}
        testsCount={totalStats.testsCompleted}
      />

      <BottomTabBar />
      {showPremiumModal && <PremiumModal />}
      {showSettingsModal && <SettingsModal />}
      {showProgressModal && <ProgressModal />}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={showAdminLoginModal}
        onClose={() => setShowAdminLoginModal(false)}
        onSuccess={(role) => {
          setShowAdminLoginModal(false);
          setCurrentPage(role === 'admin' ? 'admin-panel' : 'reviewer-panel');
        }}
      />
    </div>
  );
}
