import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import storage from './storage';
import { allQuestions, topicsList, getRandomQuestions } from './data/questions/index.js';

// ============ WELCOME SCREEN ============
function WelcomeScreen({ onStart }) {
  return (
    <View style={styles.welcomeContainer}>
      <View style={styles.logoBox}>
        <Text style={styles.logoEmoji}>🎓</Text>
      </View>
      <Text style={styles.welcomeTitle}>Oposita Smart</Text>
      <Text style={styles.welcomeSubtitle}>Te acompañamos en tu preparación</Text>
      <Text style={styles.welcomeDesc}>Unos minutos al día, a tu ritmo. Sin agobios.</Text>
      <Pressable style={styles.primaryButton} onPress={onStart}>
        <Text style={styles.primaryButtonText}>Empezar</Text>
      </Pressable>
    </View>
  );
}

// ============ ONBOARDING SCREENS ============
function OnboardingOposicion({ onSelect, onBack }) {
  const options = [
    { id: 'admin-estado', label: 'Administrativo del Estado', icon: '🏢' },
    { id: 'aux-admin', label: 'Auxiliar Administrativo', icon: '📄' },
    { id: 'gestion-estado', label: 'Gestión del Estado', icon: '💼' },
    { id: 'justicia', label: 'Justicia', icon: '⚖️' },
    { id: 'hacienda', label: 'Hacienda', icon: '💰' },
    { id: 'otra', label: 'Otra oposición', icon: '📝' },
  ];
  return (
    <ScrollView style={styles.onboardingContainer}>
      <Text style={styles.onboardingTitle}>¿Qué oposición preparas?</Text>
      <Text style={styles.onboardingSubtitle}>Selecciona tu oposición para personalizar tu experiencia</Text>
      {options.map((op) => (
        <Pressable key={op.id} style={styles.optionCard} onPress={() => onSelect(op.id)}>
          <View style={styles.optionIcon}><Text style={styles.optionIconText}>{op.icon}</Text></View>
          <Text style={styles.optionLabel}>{op.label}</Text>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

function OnboardingTiempo({ onSelect, onBack }) {
  const options = [
    { id: '15', label: '15 minutos', desc: 'Perfecto para empezar' },
    { id: '30', label: '30 minutos', desc: 'Ritmo constante' },
    { id: '45', label: '45 minutos', desc: 'Preparación intensiva' },
    { id: '60', label: '1 hora o más', desc: 'Máximo rendimiento' },
  ];
  return (
    <View style={styles.onboardingContainer}>
      <Pressable style={styles.backButton} onPress={onBack}><Text style={styles.backText}>← Atrás</Text></Pressable>
      <Text style={styles.onboardingTitle}>¿Cuánto tiempo al día?</Text>
      <Text style={styles.onboardingSubtitle}>No te preocupes, puedes cambiarlo cuando quieras</Text>
      {options.map((t) => (
        <Pressable key={t.id} style={styles.optionCardSimple} onPress={() => onSelect(t.id)}>
          <Text style={styles.optionLabelBold}>{t.label}</Text>
          <Text style={styles.optionDesc}>{t.desc}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function OnboardingFecha({ onSelect, onBack }) {
  const options = [
    { id: 'menos-6', label: 'Menos de 6 meses', icon: '⚡' },
    { id: '6-12', label: 'Entre 6 y 12 meses', icon: '📅' },
    { id: 'mas-12', label: 'Más de 1 año', icon: '⏰' },
    { id: 'sin-fecha', label: 'Aún no lo sé', icon: '❓' },
  ];
  return (
    <View style={styles.onboardingContainer}>
      <Pressable style={styles.backButton} onPress={onBack}><Text style={styles.backText}>← Atrás</Text></Pressable>
      <Text style={styles.onboardingTitle}>¿Cuándo es tu examen?</Text>
      <Text style={styles.onboardingSubtitle}>Te ayudaremos a planificar tu estudio</Text>
      {options.map((f) => (
        <Pressable key={f.id} style={styles.optionCard} onPress={() => onSelect(f.id)}>
          <View style={styles.optionIcon}><Text style={styles.optionIconText}>{f.icon}</Text></View>
          <Text style={styles.optionLabel}>{f.label}</Text>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      ))}
    </View>
  );
}

function OnboardingIntro({ onStart, onBack }) {
  return (
    <View style={styles.onboardingContainer}>
      <Pressable style={styles.backButton} onPress={onBack}><Text style={styles.backText}>← Atrás</Text></Pressable>
      <View style={styles.introIconBox}><Text style={styles.introIcon}>🚀</Text></View>
      <Text style={styles.onboardingTitle}>¡Vamos a hacer tu primer test!</Text>
      <Text style={styles.onboardingSubtitle}>5 preguntas rápidas para conocer tu nivel inicial.</Text>
      <View style={styles.infoBox}>
        <Text style={styles.infoRow}>⏱️ Solo 2-3 minutos</Text>
        <Text style={styles.infoRow}>💡 Explicaciones incluidas</Text>
        <Text style={styles.infoRow}>🛡️ Sin penalización por errores</Text>
      </View>
      <Pressable style={styles.primaryButton} onPress={onStart}>
        <Text style={styles.primaryButtonText}>Empezar test</Text>
      </Pressable>
    </View>
  );
}

// ============ HOME SCREEN (TABS) ============
function HomeScreen({ streakDays, onStartTest, onTabChange, activeTab }) {
  const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <View style={styles.homeContainer}>
      <ScrollView style={styles.homeScroll}>
        <View style={styles.homeHeader}>
          <View>
            <Text style={styles.dateText}>{today}</Text>
            <Text style={styles.headerTitle}>Tu progreso de hoy</Text>
          </View>
        </View>

        <View style={styles.streakCard}>
          <View style={styles.streakContent}>
            <View style={styles.fireIcon}><Text style={styles.fireEmoji}>🔥</Text></View>
            <Text style={styles.streakNumber}>{streakDays}</Text>
            <Text style={styles.streakLabel}>{streakDays === 1 ? 'día de racha' : 'días de racha'}</Text>
          </View>
          <Pressable style={styles.ctaButton} onPress={onStartTest}>
            <Text style={styles.ctaText}>Continuar estudiando →</Text>
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>✓</Text>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Tests hoy</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🏆</Text>
            <Text style={styles.statNumber}>0%</Text>
            <Text style={styles.statLabel}>Aciertos</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.tabBar}>
        {['inicio', 'actividad', 'temas', 'recursos'].map((tab) => (
          <Pressable key={tab} style={styles.tabItem} onPress={() => onTabChange(tab)}>
            <Text style={[styles.tabIcon, activeTab === tab && styles.tabIconActive]}>
              {tab === 'inicio' ? '🏠' : tab === 'actividad' ? '📊' : tab === 'temas' ? '📖' : '🎓'}
            </Text>
            <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function ActividadScreen({ onTabChange, activeTab }) {
  return (
    <View style={styles.homeContainer}>
      <ScrollView style={styles.homeScroll}>
        <Text style={styles.screenTitle}>Tu actividad</Text>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyTitle}>Aún no hay actividad</Text>
          <Text style={styles.emptyText}>Completa tu primer test para ver tu progreso aquí</Text>
        </View>
      </ScrollView>
      <View style={styles.tabBar}>
        {['inicio', 'actividad', 'temas', 'recursos'].map((tab) => (
          <Pressable key={tab} style={styles.tabItem} onPress={() => onTabChange(tab)}>
            <Text style={[styles.tabIcon, activeTab === tab && styles.tabIconActive]}>
              {tab === 'inicio' ? '🏠' : tab === 'actividad' ? '📊' : tab === 'temas' ? '📖' : '🎓'}
            </Text>
            <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function TemasScreen({ onTabChange, activeTab }) {
  return (
    <View style={styles.homeContainer}>
      <ScrollView style={styles.homeScroll}>
        <Text style={styles.screenTitle}>Tus temas</Text>
        {topicsList.map((tema) => (
          <View key={tema.id} style={styles.temaCard}>
            <Text style={styles.temaIcon}>{tema.icon}</Text>
            <View style={styles.temaContent}>
              <Text style={styles.temaTitle}>{tema.title}</Text>
              <Text style={styles.temaQuestions}>{allQuestions.filter(q => q.topic === tema.id).length} preguntas</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.tabBar}>
        {['inicio', 'actividad', 'temas', 'recursos'].map((tab) => (
          <Pressable key={tab} style={styles.tabItem} onPress={() => onTabChange(tab)}>
            <Text style={[styles.tabIcon, activeTab === tab && styles.tabIconActive]}>
              {tab === 'inicio' ? '🏠' : tab === 'actividad' ? '📊' : tab === 'temas' ? '📖' : '🎓'}
            </Text>
            <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function RecursosScreen({ onTabChange, activeTab }) {
  return (
    <View style={styles.homeContainer}>
      <ScrollView style={styles.homeScroll}>
        <Text style={styles.screenTitle}>Recursos</Text>
        <View style={styles.resourceCard}>
          <Text style={styles.resourceIcon}>💡</Text>
          <Text style={styles.resourceTitle}>Consejos de estudio</Text>
          <Text style={styles.resourceTip}>• Estudia a la misma hora cada día</Text>
          <Text style={styles.resourceTip}>• Repasa los errores del día anterior</Text>
          <Text style={styles.resourceTip}>• Haz descansos cada 25-30 minutos</Text>
        </View>
      </ScrollView>
      <View style={styles.tabBar}>
        {['inicio', 'actividad', 'temas', 'recursos'].map((tab) => (
          <Pressable key={tab} style={styles.tabItem} onPress={() => onTabChange(tab)}>
            <Text style={[styles.tabIcon, activeTab === tab && styles.tabIconActive]}>
              {tab === 'inicio' ? '🏠' : tab === 'actividad' ? '📊' : tab === 'temas' ? '📖' : '🎓'}
            </Text>
            <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

// ============ TEST SCREEN ============
function TestScreen({ questions, onFinish, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => setTimeElapsed(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const handleAnswer = (answerId) => {
    if (answers[currentIndex]) return;
    const newAnswers = { ...answers, [currentIndex]: answerId };
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        const correct = Object.entries(newAnswers).filter(
          ([idx, ans]) => ans === questions[parseInt(idx)].correct
        ).length;
        onFinish({ total: questions.length, correct, time: timeElapsed, questions, answers: newAnswers });
      }
    }, 800);
  };

  const hasAnswered = answers[currentIndex] !== undefined;

  return (
    <View style={styles.testContainer}>
      <View style={styles.testHeader}>
        <Pressable onPress={onClose}><Text style={styles.closeBtn}>✕</Text></Pressable>
        <Text style={styles.progress}>{currentIndex + 1}/{questions.length}</Text>
        <Text style={styles.timer}>{formatTime(timeElapsed)}</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((currentIndex + 1) / questions.length) * 100}%` }]} />
      </View>
      <ScrollView style={styles.testContent}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option) => {
            const isSelected = answers[currentIndex] === option.id;
            const isCorrect = option.id === currentQuestion.correct;
            let optionStyle = styles.optionBtn;
            if (hasAnswered && isCorrect) optionStyle = styles.optionCorrect;
            else if (hasAnswered && isSelected) optionStyle = styles.optionWrong;

            return (
              <Pressable
                key={option.id}
                style={optionStyle}
                onPress={() => handleAnswer(option.id)}
                disabled={hasAnswered}
              >
                <Text style={styles.optionId}>{option.id.toUpperCase()}.</Text>
                <Text style={styles.optionText}>{option.text}</Text>
                {hasAnswered && isCorrect && <Text style={styles.checkIcon}>✓</Text>}
                {hasAnswered && isSelected && !isCorrect && <Text style={styles.xIcon}>✕</Text>}
              </Pressable>
            );
          })}
        </View>
        {hasAnswered && currentQuestion.explanation && (
          <View style={styles.explanationBox}>
            <Text style={styles.explanationTitle}>💡 Explicación</Text>
            <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ============ RESULTS SCREEN ============
function ResultsScreen({ results, onRetry, onHome }) {
  const percentage = Math.round((results.correct / results.total) * 100);
  const isGood = percentage >= 70;
  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <ScrollView style={styles.resultsContainer}>
      <Pressable style={styles.closeResults} onPress={onHome}><Text style={styles.closeBtn}>✕</Text></Pressable>
      <View style={[styles.resultCard, isGood ? styles.resultGood : styles.resultBad]}>
        <Text style={styles.resultEmoji}>{isGood ? '🎉' : '💪'}</Text>
        <Text style={styles.resultScore}>{results.correct}/{results.total}</Text>
        <Text style={[styles.resultPercent, isGood ? styles.percentGood : styles.percentBad]}>{percentage}% de aciertos</Text>
        <Text style={styles.resultTime}>Tiempo: {formatTime(results.time)}</Text>
      </View>
      <View style={styles.messageCard}>
        <Text style={styles.messageText}>
          {isGood ? '¡Excelente trabajo! Sigue así.' : 'Buen intento. Cada test te acerca más a tu objetivo.'}
        </Text>
      </View>
      <Text style={styles.summaryTitle}>Resumen</Text>
      {results.questions.map((q, idx) => {
        const userAnswer = results.answers[idx];
        const isCorrect = userAnswer === q.correct;
        return (
          <View key={idx} style={styles.summaryRow}>
            <View style={[styles.summaryIcon, isCorrect ? styles.iconGreen : styles.iconRed]}>
              <Text style={styles.summaryIconText}>{isCorrect ? '✓' : '✕'}</Text>
            </View>
            <Text style={styles.summaryText}>Pregunta {idx + 1}</Text>
          </View>
        );
      })}
      <View style={styles.actionsRow}>
        <Pressable style={styles.primaryButton} onPress={onRetry}>
          <Text style={styles.primaryButtonText}>Hacer otro test</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={onHome}>
          <Text style={styles.secondaryButtonText}>Volver al inicio</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

// ============ MAIN APP ============
export default function App() {
  const [screen, setScreen] = useState('loading');
  const [activeTab, setActiveTab] = useState('inicio');
  const [streakDays, setStreakDays] = useState(0);
  const [testQuestions, setTestQuestions] = useState([]);
  const [testResults, setTestResults] = useState(null);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    const result = await storage.get('oposita-onboarding-complete');
    if (result.value === 'true') {
      loadUserData();
      setScreen('home');
    } else {
      setScreen('welcome');
    }
  };

  const loadUserData = async () => {
    const streakResult = await storage.get('oposita-streak');
    if (streakResult.value) {
      const data = JSON.parse(streakResult.value);
      setStreakDays(data.current || 0);
    }
  };

  const completeOnboarding = async () => {
    await storage.set('oposita-onboarding-complete', 'true');
    setScreen('home');
  };

  const startTest = () => {
    const questions = getRandomQuestions(5);
    setTestQuestions(questions);
    setScreen('test');
  };

  const finishTest = async (results) => {
    setTestResults(results);
    // Update streak
    const today = new Date().toDateString();
    const streakResult = await storage.get('oposita-streak');
    let streakData = streakResult.value ? JSON.parse(streakResult.value) : { current: 0, lastDate: null };

    if (streakData.lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (streakData.lastDate === yesterday.toDateString()) {
        streakData.current += 1;
      } else {
        streakData.current = 1;
      }
      streakData.lastDate = today;
      await storage.set('oposita-streak', JSON.stringify(streakData));
      setStreakDays(streakData.current);
    }

    setScreen('results');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Render based on screen
  if (screen === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  if (screen === 'welcome') {
    return <WelcomeScreen onStart={() => setScreen('onboarding-oposicion')} />;
  }

  if (screen === 'onboarding-oposicion') {
    return <OnboardingOposicion onSelect={() => setScreen('onboarding-tiempo')} />;
  }

  if (screen === 'onboarding-tiempo') {
    return <OnboardingTiempo onSelect={() => setScreen('onboarding-fecha')} onBack={() => setScreen('onboarding-oposicion')} />;
  }

  if (screen === 'onboarding-fecha') {
    return <OnboardingFecha onSelect={() => setScreen('onboarding-intro')} onBack={() => setScreen('onboarding-tiempo')} />;
  }

  if (screen === 'onboarding-intro') {
    return <OnboardingIntro onStart={() => { completeOnboarding(); startTest(); }} onBack={() => setScreen('onboarding-fecha')} />;
  }

  if (screen === 'test') {
    return <TestScreen questions={testQuestions} onFinish={finishTest} onClose={() => setScreen('home')} />;
  }

  if (screen === 'results') {
    return <ResultsScreen results={testResults} onRetry={startTest} onHome={() => setScreen('home')} />;
  }

  // Home with tabs
  if (activeTab === 'inicio') {
    return <HomeScreen streakDays={streakDays} onStartTest={startTest} onTabChange={handleTabChange} activeTab={activeTab} />;
  }
  if (activeTab === 'actividad') {
    return <ActividadScreen onTabChange={handleTabChange} activeTab={activeTab} />;
  }
  if (activeTab === 'temas') {
    return <TemasScreen onTabChange={handleTabChange} activeTab={activeTab} />;
  }
  if (activeTab === 'recursos') {
    return <RecursosScreen onTabChange={handleTabChange} activeTab={activeTab} />;
  }

  return <HomeScreen streakDays={streakDays} onStartTest={startTest} onTabChange={handleTabChange} activeTab={activeTab} />;
}

// ============ STYLES ============
const styles = StyleSheet.create({
  // Loading
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAF5FF' },
  loadingText: { marginTop: 16, color: '#6B7280' },

  // Welcome
  welcomeContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAF5FF', padding: 24 },
  logoBox: { width: 80, height: 80, backgroundColor: '#EDE9FE', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 32 },
  logoEmoji: { fontSize: 40 },
  welcomeTitle: { fontSize: 30, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
  welcomeSubtitle: { fontSize: 18, color: '#4B5563', marginBottom: 8 },
  welcomeDesc: { color: '#9CA3AF', textAlign: 'center', marginBottom: 40 },

  // Buttons
  primaryButton: { backgroundColor: '#22C55E', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12, width: '100%' },
  primaryButtonText: { color: 'white', fontWeight: '600', fontSize: 18, textAlign: 'center' },
  secondaryButton: { paddingVertical: 16, paddingHorizontal: 32 },
  secondaryButtonText: { color: '#6B7280', fontWeight: '500', textAlign: 'center' },

  // Onboarding
  onboardingContainer: { flex: 1, backgroundColor: '#FAF5FF', paddingHorizontal: 24, paddingTop: 60 },
  onboardingTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  onboardingSubtitle: { color: '#6B7280', marginBottom: 32 },
  backButton: { marginBottom: 24 },
  backText: { color: '#374151', fontSize: 16 },
  optionCard: { backgroundColor: 'white', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderWidth: 2, borderColor: '#F3F4F6' },
  optionCardSimple: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 2, borderColor: '#F3F4F6' },
  optionIcon: { width: 48, height: 48, backgroundColor: '#EDE9FE', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  optionIconText: { fontSize: 24 },
  optionLabel: { flex: 1, color: '#1F2937', fontWeight: '500', fontSize: 16 },
  optionLabelBold: { color: '#1F2937', fontWeight: '600', fontSize: 18 },
  optionDesc: { color: '#6B7280', fontSize: 14, marginTop: 4 },
  chevron: { color: '#9CA3AF', fontSize: 24 },
  introIconBox: { alignItems: 'center', marginBottom: 32 },
  introIcon: { fontSize: 64, backgroundColor: '#EDE9FE', padding: 20, borderRadius: 64, overflow: 'hidden' },
  infoBox: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 32 },
  infoRow: { color: '#374151', marginBottom: 12, fontSize: 16 },

  // Home
  homeContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  homeScroll: { flex: 1, paddingHorizontal: 16, paddingTop: 56 },
  homeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  dateText: { fontSize: 14, color: '#7C3AED', fontWeight: '500' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  screenTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 24 },

  // Streak Card
  streakCard: { backgroundColor: '#FFF7ED', borderRadius: 16, padding: 24, marginBottom: 24, borderWidth: 1, borderColor: '#FFEDD5' },
  streakContent: { alignItems: 'center' },
  fireIcon: { width: 64, height: 64, backgroundColor: '#FFEDD5', borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  fireEmoji: { fontSize: 32 },
  streakNumber: { fontSize: 30, fontWeight: 'bold', color: '#111827' },
  streakLabel: { color: '#4B5563' },
  ctaButton: { marginTop: 24, backgroundColor: '#F97316', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  ctaText: { color: 'white', fontWeight: '600', fontSize: 16, textAlign: 'center' },

  // Stats
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: 'white', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#F3F4F6' },
  statEmoji: { fontSize: 24 },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginTop: 8 },
  statLabel: { fontSize: 14, color: '#6B7280' },

  // Tab Bar
  tabBar: { flexDirection: 'row', backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingBottom: 20, paddingTop: 8 },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  tabIcon: { fontSize: 20, color: '#9CA3AF' },
  tabIconActive: { color: '#1F2937' },
  tabLabel: { fontSize: 10, color: '#9CA3AF', fontWeight: '600', marginTop: 4 },
  tabLabelActive: { color: '#1F2937' },

  // Empty state
  emptyCard: { backgroundColor: 'white', borderRadius: 16, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: '#F3F4F6' },
  emptyIcon: { fontSize: 48, color: '#D1D5DB' },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginTop: 16, marginBottom: 8 },
  emptyText: { color: '#6B7280', textAlign: 'center' },

  // Temas
  temaCard: { backgroundColor: 'white', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderWidth: 2, borderColor: '#EDE9FE' },
  temaIcon: { fontSize: 30, marginRight: 16 },
  temaContent: { flex: 1 },
  temaTitle: { fontWeight: 'bold', color: '#111827' },
  temaQuestions: { fontSize: 14, color: '#6B7280' },

  // Resources
  resourceCard: { backgroundColor: 'white', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: '#F3F4F6' },
  resourceIcon: { fontSize: 24, marginBottom: 16 },
  resourceTitle: { fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  resourceTip: { color: '#374151', marginBottom: 8 },

  // Test
  testContainer: { flex: 1, backgroundColor: 'white' },
  testHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 56, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  closeBtn: { fontSize: 24, color: '#6B7280' },
  progress: { color: '#4B5563', fontWeight: '500' },
  timer: { color: '#6B7280' },
  progressBar: { height: 4, backgroundColor: '#F3F4F6' },
  progressFill: { height: 4, backgroundColor: '#8B5CF6' },
  testContent: { flex: 1, padding: 16 },
  questionText: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 24, lineHeight: 26 },
  optionsContainer: { gap: 12 },
  optionBtn: { backgroundColor: 'white', borderWidth: 2, borderColor: '#E5E7EB', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'flex-start' },
  optionCorrect: { backgroundColor: '#F0FDF4', borderWidth: 2, borderColor: '#86EFAC', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'flex-start' },
  optionWrong: { backgroundColor: '#FEF2F2', borderWidth: 2, borderColor: '#FCA5A5', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'flex-start' },
  optionId: { fontWeight: 'bold', color: '#374151', marginRight: 12 },
  optionText: { flex: 1, color: '#374151' },
  checkIcon: { color: '#10B981', fontSize: 20 },
  xIcon: { color: '#EF4444', fontSize: 20 },
  explanationBox: { marginTop: 24, backgroundColor: '#EFF6FF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#DBEAFE' },
  explanationTitle: { fontWeight: '600', color: '#1E40AF', marginBottom: 8 },
  explanationText: { color: '#1E3A8A', lineHeight: 22 },

  // Results
  resultsContainer: { flex: 1, backgroundColor: 'white', paddingHorizontal: 16, paddingTop: 56 },
  closeResults: { marginBottom: 24 },
  resultCard: { borderRadius: 24, padding: 32, alignItems: 'center', marginBottom: 24 },
  resultGood: { backgroundColor: '#F0FDF4' },
  resultBad: { backgroundColor: '#FFF7ED' },
  resultEmoji: { fontSize: 48, marginBottom: 16 },
  resultScore: { fontSize: 36, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  resultPercent: { fontSize: 18, fontWeight: '500' },
  percentGood: { color: '#16A34A' },
  percentBad: { color: '#EA580C' },
  resultTime: { color: '#6B7280', marginTop: 8 },
  messageCard: { backgroundColor: 'white', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#F3F4F6', marginBottom: 24 },
  messageText: { color: '#374151', textAlign: 'center' },
  summaryTitle: { fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 12, padding: 16, marginBottom: 8 },
  summaryIcon: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  iconGreen: { backgroundColor: '#DCFCE7' },
  iconRed: { backgroundColor: '#FEE2E2' },
  summaryIconText: { fontSize: 16, fontWeight: 'bold' },
  summaryText: { color: '#374151' },
  actionsRow: { marginTop: 24, marginBottom: 32 },
});
