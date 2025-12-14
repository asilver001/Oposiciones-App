import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, ActivityIndicator, TextInput, Animated, Platform } from 'react-native';
import storage from './storage';
import { allQuestions, topicsList, getRandomQuestions } from './data/questions/index.js';

// ============ CONSTANTS ============
const FREE_TESTS_LIMIT = 3;
const FREE_FAVORITES_LIMIT = 10;
const IS_DEV = true; // Set to false for production

// Badges for streak system
const BADGES = [
  { id: 1, name: 'Constancia', days: 3, icon: '🔥', color: '#F97316' },
  { id: 2, name: 'Compromiso', days: 7, icon: '💪', color: '#EF4444' },
  { id: 3, name: 'Dedicación', days: 14, icon: '⭐', color: '#EAB308' },
  { id: 4, name: 'Imparable', days: 30, icon: '🏆', color: '#F59E0B' },
  { id: 5, name: 'Leyenda', days: 100, icon: '👑', color: '#8B5CF6' }
];

// ============ DEV PANEL ============
function DevPanel({ onReset, onDeplete, onTogglePremium, isPremium, freeTestsUsed }) {
  if (!IS_DEV) return null;

  return (
    <View style={styles.devPanel}>
      <Pressable style={styles.devBtnReset} onPress={onReset}>
        <Text style={styles.devBtnText}>[DEV] Reset</Text>
      </Pressable>
      <Pressable style={styles.devBtnDeplete} onPress={onDeplete}>
        <Text style={styles.devBtnText}>[DEV] Agotar ({freeTestsUsed}/{FREE_TESTS_LIMIT})</Text>
      </Pressable>
      <Pressable style={[styles.devBtnPremium, isPremium && styles.devBtnPremiumActive]} onPress={onTogglePremium}>
        <Text style={styles.devBtnText}>[DEV] Premium {isPremium ? 'ON' : 'OFF'}</Text>
      </Pressable>
    </View>
  );
}

// ============ PREMIUM MODAL ============
function PremiumModal({ visible, onClose, waitlistEmail, onWaitlistSubmit }) {
  const [email, setEmail] = useState(waitlistEmail || '');
  const [submitted, setSubmitted] = useState(!!waitlistEmail);
  const [justSubmitted, setJustSubmitted] = useState(false);

  if (!visible) return null;

  const handleSubmit = () => {
    if (!email || !email.includes('@')) return;
    onWaitlistSubmit(email);
    setSubmitted(true);
    setJustSubmitted(true);
  };

  const benefits = [
    { emoji: '📚', title: '+2000 preguntas', description: 'Banco completo para prepararte a fondo' },
    { emoji: '🔄', title: 'Tests dinámicos', description: 'Preguntas diferentes cada vez' },
    { emoji: '📋', title: 'Simulacros de examen', description: 'Practica con tiempo y formato real' },
    { emoji: '❤️', title: 'Favoritas ilimitadas', description: 'Guarda todas las preguntas que quieras' },
    { emoji: '📊', title: 'Estadísticas avanzadas', description: 'Conoce tus puntos débiles' }
  ];

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.premiumModal}>
        {/* Header */}
        <View style={styles.premiumHeader}>
          <Pressable style={styles.modalClose} onPress={onClose}>
            <Text style={styles.modalCloseText}>✕</Text>
          </Pressable>
          <Text style={styles.premiumCrown}>👑</Text>
          <Text style={styles.premiumTitle}>Llega pronto algo increíble</Text>
          <Text style={styles.premiumSubtitle}>Sé el primero en acceder</Text>
        </View>

        <ScrollView style={styles.premiumContent}>
          {/* Benefits */}
          {benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitRow}>
              <Text style={styles.benefitEmoji}>{benefit.emoji}</Text>
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                <Text style={styles.benefitDesc}>{benefit.description}</Text>
              </View>
            </View>
          ))}

          {/* Launch date */}
          <Text style={styles.launchDate}>
            Lanzamos en <Text style={styles.launchDateHighlight}>Enero 2026</Text>
          </Text>

          {/* Waitlist form */}
          {submitted ? (
            <View style={styles.waitlistSuccess}>
              {justSubmitted ? (
                <Text style={styles.waitlistSuccessText}>¡Apuntado! Te avisaremos 🎉</Text>
              ) : (
                <>
                  <Text style={styles.waitlistAlready}>✓ Ya estás en la lista de espera</Text>
                  <Text style={styles.waitlistEmail}>{waitlistEmail}</Text>
                </>
              )}
            </View>
          ) : (
            <View style={styles.waitlistForm}>
              <TextInput
                style={styles.waitlistInput}
                placeholder="tu@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Pressable style={styles.waitlistButton} onPress={handleSubmit}>
                <Text style={styles.waitlistButtonText}>🔔 Avísame del lanzamiento</Text>
              </Pressable>
            </View>
          )}

          <Pressable style={styles.modalDismiss} onPress={onClose}>
            <Text style={styles.modalDismissText}>Ahora no</Text>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );
}

// ============ STREAK CELEBRATION MODAL ============
function StreakCelebration({ visible, badge, onClose }) {
  if (!visible || !badge) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.celebrationModal}>
        <Text style={styles.celebrationEmoji}>{badge.icon}</Text>
        <Text style={styles.celebrationTitle}>¡Nuevo logro!</Text>
        <Text style={styles.celebrationBadge}>{badge.name}</Text>
        <Text style={styles.celebrationDays}>{badge.days} días de racha</Text>
        <Pressable style={styles.celebrationButton} onPress={onClose}>
          <Text style={styles.celebrationButtonText}>¡Genial!</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ============ WELCOME SCREEN ============
function WelcomeScreen({ onStart, onReset, onDeplete, onTogglePremium, isPremium, freeTestsUsed, onSkip }) {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -10, duration: 1500, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 1500, useNativeDriver: true })
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <View style={styles.welcomeContainer}>
      {/* DEV Panel */}
      <DevPanel
        onReset={onReset}
        onDeplete={onDeplete}
        onTogglePremium={onTogglePremium}
        isPremium={isPremium}
        freeTestsUsed={freeTestsUsed}
      />

      <View style={styles.welcomeContent}>
        {/* Animated Logo */}
        <Animated.View style={[styles.logoBox, { transform: [{ translateY: floatAnim }] }]}>
          <Text style={styles.logoEmoji}>🎓</Text>
        </Animated.View>

        <Text style={styles.welcomeTitle}>Oposita Smart</Text>
        <Text style={styles.welcomeTagline}>Tu plaza, paso a paso</Text>
        <Text style={styles.welcomeDesc}>Unos minutos al día, a tu ritmo. Sin agobios.</Text>

        <Pressable
          style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
          onPress={onStart}
        >
          <Text style={styles.primaryButtonText}>Empezar</Text>
        </Pressable>

        {/* DEV Skip button */}
        {IS_DEV && (
          <Pressable style={styles.devSkip} onPress={onSkip}>
            <Text style={styles.devSkipText}>[DEV] Saltar onboarding</Text>
          </Pressable>
        )}
      </View>
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
      <View style={styles.progressDots}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
      <Text style={styles.onboardingTitle}>¿Qué oposición preparas?</Text>
      <Text style={styles.onboardingSubtitle}>Selecciona tu oposición para personalizar tu experiencia</Text>
      {options.map((op) => (
        <Pressable
          key={op.id}
          style={({ pressed }) => [styles.optionCard, pressed && styles.optionCardPressed]}
          onPress={() => onSelect(op.id)}
        >
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
      <View style={styles.progressDots}>
        <View style={[styles.dot, styles.dotCompleted]} />
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
      <Text style={styles.onboardingTitle}>¿Cuánto tiempo al día?</Text>
      <Text style={styles.onboardingSubtitle}>No te preocupes, puedes cambiarlo cuando quieras</Text>
      {options.map((t) => (
        <Pressable
          key={t.id}
          style={({ pressed }) => [styles.optionCardSimple, pressed && styles.optionCardPressed]}
          onPress={() => onSelect(t.id)}
        >
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
      <View style={styles.progressDots}>
        <View style={[styles.dot, styles.dotCompleted]} />
        <View style={[styles.dot, styles.dotCompleted]} />
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
      </View>
      <Text style={styles.onboardingTitle}>¿Cuándo es tu examen?</Text>
      <Text style={styles.onboardingSubtitle}>Te ayudaremos a planificar tu estudio</Text>
      {options.map((f) => (
        <Pressable
          key={f.id}
          style={({ pressed }) => [styles.optionCard, pressed && styles.optionCardPressed]}
          onPress={() => onSelect(f.id)}
        >
          <View style={styles.optionIcon}><Text style={styles.optionIconText}>{f.icon}</Text></View>
          <Text style={styles.optionLabel}>{f.label}</Text>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      ))}
    </View>
  );
}

function OnboardingIntro({ onStart, onBack }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true })
    ]).start(() => onStart());
  };

  return (
    <View style={styles.onboardingContainer}>
      <Pressable style={styles.backButton} onPress={onBack}><Text style={styles.backText}>← Atrás</Text></Pressable>
      <View style={styles.progressDots}>
        <View style={[styles.dot, styles.dotCompleted]} />
        <View style={[styles.dot, styles.dotCompleted]} />
        <View style={[styles.dot, styles.dotCompleted]} />
        <View style={[styles.dot, styles.dotActive]} />
      </View>
      <View style={styles.introIconBox}><Text style={styles.introIcon}>🚀</Text></View>
      <Text style={styles.onboardingTitle}>¡Vamos a hacer tu primer test!</Text>
      <Text style={styles.onboardingSubtitle}>5 preguntas rápidas para conocer tu nivel inicial.</Text>
      <View style={styles.infoBox}>
        <Text style={styles.infoRow}>⏱️ Solo 2-3 minutos</Text>
        <Text style={styles.infoRow}>💡 Explicaciones incluidas</Text>
        <Text style={styles.infoRow}>🛡️ Sin penalización por errores</Text>
      </View>
      <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%' }}>
        <Pressable style={styles.primaryButton} onPress={handlePress}>
          <Text style={styles.primaryButtonText}>Empezar test</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

// ============ HOME SCREEN (TABS) ============
function HomeScreen({ streakData, stats, onStartTest, onTabChange, activeTab, onSettings, canStartTest, onShowPremium, isPremium, freeTestsUsed }) {
  const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  const fireAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(fireAnim, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
        Animated.timing(fireAnim, { toValue: 1, duration: 1000, useNativeDriver: true })
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const getStreakMessage = () => {
    const days = streakData.current;
    if (days === 0) return "¡Hoy es un buen día para empezar!";
    if (days === 1) return "¡Primer paso dado!";
    if (days <= 3) return "Vas por buen camino";
    if (days <= 6) return "¡Imparable!";
    return "🔥 Racha legendaria";
  };

  const getDaysToNextBadge = () => {
    const nextBadge = BADGES.find(b => b.days > streakData.current);
    return nextBadge ? { badge: nextBadge, days: nextBadge.days - streakData.current } : null;
  };

  const nextBadgeInfo = getDaysToNextBadge();
  const testsRemaining = FREE_TESTS_LIMIT - freeTestsUsed;

  return (
    <View style={styles.homeContainer}>
      <ScrollView style={styles.homeScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.homeHeader}>
          <View>
            <Text style={styles.dateText}>{today}</Text>
            <Text style={styles.headerTitle}>Tu progreso de hoy</Text>
          </View>
          <Pressable style={styles.settingsBtn} onPress={onSettings}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </Pressable>
        </View>

        {/* Streak Card */}
        <View style={styles.streakCard}>
          <View style={styles.streakContent}>
            <Animated.View style={[styles.fireIcon, { transform: [{ scale: fireAnim }] }]}>
              <Text style={styles.fireEmoji}>🔥</Text>
            </Animated.View>
            <Text style={styles.streakNumber}>{streakData.current}</Text>
            <Text style={styles.streakLabel}>{streakData.current === 1 ? 'día de racha' : 'días de racha'}</Text>
            <Text style={styles.streakMessage}>{getStreakMessage()}</Text>

            {nextBadgeInfo && (
              <View style={styles.nextBadge}>
                <Text style={styles.nextBadgeText}>
                  {nextBadgeInfo.badge.icon} {nextBadgeInfo.days} días para "{nextBadgeInfo.badge.name}"
                </Text>
              </View>
            )}
          </View>

          {/* CTA Button */}
          {canStartTest ? (
            <Pressable
              style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
              onPress={onStartTest}
            >
              <Text style={styles.ctaText}>Continuar estudiando →</Text>
            </Pressable>
          ) : (
            <View style={styles.testsDepletedBox}>
              <Text style={styles.testsDepletedText}>🔒 Tests gratuitos agotados</Text>
              <Pressable style={styles.premiumCTA} onPress={onShowPremium}>
                <Text style={styles.premiumCTAText}>Ver opciones Premium</Text>
              </Pressable>
            </View>
          )}

          {/* Free tests counter */}
          {!isPremium && canStartTest && (
            <Text style={styles.testsCounter}>
              {testsRemaining} test{testsRemaining !== 1 ? 's' : ''} gratuito{testsRemaining !== 1 ? 's' : ''} restante{testsRemaining !== 1 ? 's' : ''}
            </Text>
          )}
          {isPremium && (
            <Text style={styles.premiumBadge}>👑 Premium activo</Text>
          )}
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>✓</Text>
            <Text style={styles.statNumber}>{stats.testsToday}</Text>
            <Text style={styles.statLabel}>Tests hoy</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🏆</Text>
            <Text style={styles.statNumber}>{stats.accuracyRate}%</Text>
            <Text style={styles.statLabel}>Aciertos</Text>
          </View>
        </View>

        {/* Total stats */}
        <View style={styles.totalStatsCard}>
          <Text style={styles.totalStatsTitle}>📊 Estadísticas totales</Text>
          <View style={styles.totalStatsRow}>
            <View style={styles.totalStatItem}>
              <Text style={styles.totalStatNumber}>{stats.testsCompleted}</Text>
              <Text style={styles.totalStatLabel}>Tests completados</Text>
            </View>
            <View style={styles.totalStatItem}>
              <Text style={styles.totalStatNumber}>{stats.questionsCorrect}</Text>
              <Text style={styles.totalStatLabel}>Respuestas correctas</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <TabBar activeTab={activeTab} onTabChange={onTabChange} />
    </View>
  );
}

function ActividadScreen({ onTabChange, activeTab, stats }) {
  return (
    <View style={styles.homeContainer}>
      <ScrollView style={styles.homeScroll}>
        <Text style={styles.screenTitle}>Tu actividad</Text>

        {stats.testsCompleted > 0 ? (
          <>
            <View style={styles.activityCard}>
              <Text style={styles.activityIcon}>📈</Text>
              <Text style={styles.activityTitle}>Progreso semanal</Text>
              <View style={styles.weekRow}>
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => (
                  <View key={i} style={styles.weekDay}>
                    <View style={[styles.weekBar, { height: Math.max(4, (stats.weeklyProgress?.[i] || 0) * 3) }]} />
                    <Text style={styles.weekLabel}>{day}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.activityCard}>
              <Text style={styles.activityIcon}>🎯</Text>
              <Text style={styles.activityTitle}>Resumen</Text>
              <Text style={styles.activityStat}>{stats.totalDaysStudied} días estudiados</Text>
              <Text style={styles.activityStat}>{stats.questionsAnswered} preguntas respondidas</Text>
            </View>
          </>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyTitle}>Aún no hay actividad</Text>
            <Text style={styles.emptyText}>Completa tu primer test para ver tu progreso aquí</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
      <TabBar activeTab={activeTab} onTabChange={onTabChange} />
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
        <View style={{ height: 100 }} />
      </ScrollView>
      <TabBar activeTab={activeTab} onTabChange={onTabChange} />
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
        <View style={styles.resourceCard}>
          <Text style={styles.resourceIcon}>📖</Text>
          <Text style={styles.resourceTitle}>Técnicas de memorización</Text>
          <Text style={styles.resourceTip}>• Usa reglas mnemotécnicas</Text>
          <Text style={styles.resourceTip}>• Repite en voz alta</Text>
          <Text style={styles.resourceTip}>• Asocia conceptos con imágenes</Text>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
      <TabBar activeTab={activeTab} onTabChange={onTabChange} />
    </View>
  );
}

// ============ TAB BAR ============
function TabBar({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'inicio', icon: '🏠', label: 'Inicio' },
    { id: 'actividad', icon: '📊', label: 'Actividad' },
    { id: 'temas', icon: '📖', label: 'Temas' },
    { id: 'recursos', icon: '🎓', label: 'Recursos' }
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => (
        <Pressable key={tab.id} style={styles.tabItem} onPress={() => onTabChange(tab.id)}>
          <View style={[styles.tabIconContainer, activeTab === tab.id && styles.tabIconContainerActive]}>
            <Text style={[styles.tabIcon, activeTab === tab.id && styles.tabIconActive]}>{tab.icon}</Text>
          </View>
          <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>{tab.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

// ============ TEST SCREEN ============
function TestScreen({ questions, onFinish, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

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
        // Fade transition
        Animated.sequence([
          Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
          Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true })
        ]).start();
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
        <Text style={styles.timer}>⏱️ {formatTime(timeElapsed)}</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((currentIndex + 1) / questions.length) * 100}%` }]} />
      </View>
      <Animated.ScrollView style={[styles.testContent, { opacity: fadeAnim }]}>
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
                style={({ pressed }) => [optionStyle, pressed && !hasAnswered && styles.optionPressed]}
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
      </Animated.ScrollView>
    </View>
  );
}

// ============ RESULTS SCREEN ============
function ResultsScreen({ results, onRetry, onHome, canRetry, onShowPremium }) {
  const percentage = Math.round((results.correct / results.total) * 100);
  const isGood = percentage >= 70;
  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }).start();
  }, []);

  return (
    <ScrollView style={styles.resultsContainer}>
      <Pressable style={styles.closeResults} onPress={onHome}><Text style={styles.closeBtn}>✕</Text></Pressable>

      <Animated.View style={[styles.resultCard, isGood ? styles.resultGood : styles.resultBad, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.resultEmoji}>{isGood ? '🎉' : '💪'}</Text>
        <Text style={styles.resultScore}>{results.correct}/{results.total}</Text>
        <Text style={[styles.resultPercent, isGood ? styles.percentGood : styles.percentBad]}>{percentage}% de aciertos</Text>
        <Text style={styles.resultTime}>Tiempo: {formatTime(results.time)}</Text>
      </Animated.View>

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
            <Text style={styles.summaryText} numberOfLines={1}>P{idx + 1}: {q.question.substring(0, 40)}...</Text>
          </View>
        );
      })}

      <View style={styles.actionsRow}>
        {canRetry ? (
          <Pressable style={styles.primaryButton} onPress={onRetry}>
            <Text style={styles.primaryButtonText}>Hacer otro test</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.premiumButton} onPress={onShowPremium}>
            <Text style={styles.premiumButtonText}>🔒 Desbloquear más tests</Text>
          </Pressable>
        )}
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
  const [testQuestions, setTestQuestions] = useState([]);
  const [testResults, setTestResults] = useState(null);

  // User data
  const [streakData, setStreakData] = useState({ current: 0, longest: 0, lastCompletedDate: null });
  const [stats, setStats] = useState({
    testsCompleted: 0,
    questionsCorrect: 0,
    questionsAnswered: 0,
    testsToday: 0,
    accuracyRate: 0,
    totalDaysStudied: 0,
    weeklyProgress: [0, 0, 0, 0, 0, 0, 0]
  });

  // Premium system
  const [isPremium, setIsPremium] = useState(false);
  const [freeTestsUsed, setFreeTestsUsed] = useState(0);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');

  // Celebration
  const [showCelebration, setShowCelebration] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(null);

  const canStartTest = isPremium || freeTestsUsed < FREE_TESTS_LIMIT;

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const result = await storage.get('oposita-onboarding-complete');
      if (result.value === 'true') {
        await loadUserData();
        setScreen('home');
      } else {
        setScreen('welcome');
      }
    } catch (e) {
      setScreen('welcome');
    }
  };

  const loadUserData = async () => {
    try {
      // Load streak
      const streakResult = await storage.get('oposita-streak');
      if (streakResult.value) {
        const data = JSON.parse(streakResult.value);
        // Check if streak is still valid
        if (data.lastCompletedDate) {
          const lastDate = new Date(data.lastCompletedDate);
          const today = new Date();
          const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
          if (diffDays > 1) {
            // Streak broken
            data.current = 0;
            data.lastCompletedDate = null;
            await storage.set('oposita-streak', JSON.stringify(data));
          }
        }
        setStreakData(data);
      }

      // Load stats
      const statsResult = await storage.get('oposita-stats');
      if (statsResult.value) {
        setStats(JSON.parse(statsResult.value));
      }

      // Load premium status
      const premiumResult = await storage.get('oposita-premium');
      if (premiumResult.value === 'true') {
        setIsPremium(true);
      }

      // Load free tests used (reset daily)
      const freeTestsResult = await storage.get('oposita-free-tests');
      if (freeTestsResult.value) {
        const data = JSON.parse(freeTestsResult.value);
        const today = new Date().toDateString();
        if (data.date === today) {
          setFreeTestsUsed(data.count);
        } else {
          setFreeTestsUsed(0);
          await storage.set('oposita-free-tests', JSON.stringify({ date: today, count: 0 }));
        }
      }

      // Load waitlist email
      const waitlistResult = await storage.get('waitlist_email');
      if (waitlistResult.value) {
        setWaitlistEmail(waitlistResult.value);
      }
    } catch (e) {
      console.log('Error loading user data:', e);
    }
  };

  const completeOnboarding = async () => {
    await storage.set('oposita-onboarding-complete', 'true');
  };

  const startTest = async () => {
    if (!canStartTest) {
      setShowPremiumModal(true);
      return;
    }
    const questions = getRandomQuestions(5);
    setTestQuestions(questions);
    setScreen('test');
  };

  const finishTest = async (results) => {
    setTestResults(results);

    const today = new Date().toDateString();
    let newStreak = { ...streakData };
    let newBadge = null;

    // Update streak
    if (newStreak.lastCompletedDate !== today) {
      const lastDate = newStreak.lastCompletedDate ? new Date(newStreak.lastCompletedDate) : null;
      const todayDate = new Date(today);

      if (!lastDate) {
        newStreak.current = 1;
      } else {
        const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          newStreak.current += 1;
          // Check for badge
          newBadge = BADGES.find(b => b.days === newStreak.current);
        } else if (diffDays === 0) {
          // Same day, keep streak
        } else {
          newStreak.current = 1;
        }
      }
      newStreak.longest = Math.max(newStreak.current, newStreak.longest);
      newStreak.lastCompletedDate = today;
      setStreakData(newStreak);
      await storage.set('oposita-streak', JSON.stringify(newStreak));
    }

    // Update stats
    const newStats = {
      ...stats,
      testsCompleted: stats.testsCompleted + 1,
      questionsCorrect: stats.questionsCorrect + results.correct,
      questionsAnswered: stats.questionsAnswered + results.total,
      testsToday: stats.testsToday + 1,
      accuracyRate: Math.round(((stats.questionsCorrect + results.correct) / (stats.questionsAnswered + results.total)) * 100) || 0,
      totalDaysStudied: stats.testsToday === 0 ? stats.totalDaysStudied + 1 : stats.totalDaysStudied
    };
    setStats(newStats);
    await storage.set('oposita-stats', JSON.stringify(newStats));

    // Update free tests used
    if (!isPremium) {
      const newCount = freeTestsUsed + 1;
      setFreeTestsUsed(newCount);
      await storage.set('oposita-free-tests', JSON.stringify({ date: today, count: newCount }));
    }

    // Show celebration if badge earned
    if (newBadge) {
      setEarnedBadge(newBadge);
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        setScreen('results');
      }, 2500);
    } else {
      setScreen('results');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleWaitlistSubmit = async (email) => {
    setWaitlistEmail(email);
    await storage.set('waitlist_email', email);
  };

  // DEV functions
  const handleDevReset = async () => {
    await storage.remove('oposita-onboarding-complete');
    await storage.remove('oposita-streak');
    await storage.remove('oposita-stats');
    await storage.remove('oposita-premium');
    await storage.remove('oposita-free-tests');
    await storage.remove('waitlist_email');
    setStreakData({ current: 0, longest: 0, lastCompletedDate: null });
    setStats({ testsCompleted: 0, questionsCorrect: 0, questionsAnswered: 0, testsToday: 0, accuracyRate: 0, totalDaysStudied: 0, weeklyProgress: [0,0,0,0,0,0,0] });
    setFreeTestsUsed(0);
    setIsPremium(false);
    setWaitlistEmail('');
    setScreen('welcome');
  };

  const handleDevDeplete = async () => {
    const today = new Date().toDateString();
    setFreeTestsUsed(FREE_TESTS_LIMIT);
    await storage.set('oposita-free-tests', JSON.stringify({ date: today, count: FREE_TESTS_LIMIT }));
  };

  const handleDevTogglePremium = async () => {
    const newValue = !isPremium;
    setIsPremium(newValue);
    await storage.set('oposita-premium', newValue ? 'true' : 'false');
  };

  const handleDevSkip = async () => {
    await completeOnboarding();
    await loadUserData();
    setScreen('home');
  };

  // Render
  if (screen === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Modals */}
      <PremiumModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        waitlistEmail={waitlistEmail}
        onWaitlistSubmit={handleWaitlistSubmit}
      />
      <StreakCelebration
        visible={showCelebration}
        badge={earnedBadge}
        onClose={() => setShowCelebration(false)}
      />

      {/* Screens */}
      {screen === 'welcome' && (
        <WelcomeScreen
          onStart={() => setScreen('onboarding-oposicion')}
          onReset={handleDevReset}
          onDeplete={handleDevDeplete}
          onTogglePremium={handleDevTogglePremium}
          isPremium={isPremium}
          freeTestsUsed={freeTestsUsed}
          onSkip={handleDevSkip}
        />
      )}

      {screen === 'onboarding-oposicion' && (
        <OnboardingOposicion onSelect={() => setScreen('onboarding-tiempo')} />
      )}

      {screen === 'onboarding-tiempo' && (
        <OnboardingTiempo onSelect={() => setScreen('onboarding-fecha')} onBack={() => setScreen('onboarding-oposicion')} />
      )}

      {screen === 'onboarding-fecha' && (
        <OnboardingFecha onSelect={() => setScreen('onboarding-intro')} onBack={() => setScreen('onboarding-tiempo')} />
      )}

      {screen === 'onboarding-intro' && (
        <OnboardingIntro onStart={() => { completeOnboarding(); startTest(); }} onBack={() => setScreen('onboarding-fecha')} />
      )}

      {screen === 'test' && (
        <TestScreen questions={testQuestions} onFinish={finishTest} onClose={() => setScreen('home')} />
      )}

      {screen === 'results' && (
        <ResultsScreen
          results={testResults}
          onRetry={startTest}
          onHome={() => { setActiveTab('inicio'); setScreen('home'); }}
          canRetry={canStartTest}
          onShowPremium={() => setShowPremiumModal(true)}
        />
      )}

      {screen === 'home' && activeTab === 'inicio' && (
        <HomeScreen
          streakData={streakData}
          stats={stats}
          onStartTest={startTest}
          onTabChange={handleTabChange}
          activeTab={activeTab}
          onSettings={() => {}}
          canStartTest={canStartTest}
          onShowPremium={() => setShowPremiumModal(true)}
          isPremium={isPremium}
          freeTestsUsed={freeTestsUsed}
        />
      )}

      {screen === 'home' && activeTab === 'actividad' && (
        <ActividadScreen onTabChange={handleTabChange} activeTab={activeTab} stats={stats} />
      )}

      {screen === 'home' && activeTab === 'temas' && (
        <TemasScreen onTabChange={handleTabChange} activeTab={activeTab} />
      )}

      {screen === 'home' && activeTab === 'recursos' && (
        <RecursosScreen onTabChange={handleTabChange} activeTab={activeTab} />
      )}
    </View>
  );
}

// ============ STYLES ============
const styles = StyleSheet.create({
  // Loading
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAF5FF' },
  loadingText: { marginTop: 16, color: '#6B7280' },

  // DEV Panel
  devPanel: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, paddingTop: 50, paddingHorizontal: 16 },
  devBtnReset: { backgroundColor: '#FEE2E2', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  devBtnDeplete: { backgroundColor: '#FFEDD5', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  devBtnPremium: { backgroundColor: '#D1FAE5', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  devBtnPremiumActive: { backgroundColor: '#10B981' },
  devBtnText: { fontSize: 11, fontWeight: '600', color: '#374151' },
  devSkip: { marginTop: 24 },
  devSkipText: { color: '#9CA3AF', fontSize: 12 },

  // Welcome
  welcomeContainer: { flex: 1, backgroundColor: '#FAF5FF' },
  welcomeContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  logoBox: { width: 100, height: 100, backgroundColor: '#EDE9FE', borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 32, shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 24, elevation: 8 },
  logoEmoji: { fontSize: 48 },
  welcomeTitle: { fontSize: 32, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  welcomeTagline: { fontSize: 20, color: '#7C3AED', fontWeight: '600', marginBottom: 8 },
  welcomeDesc: { color: '#6B7280', textAlign: 'center', marginBottom: 48, fontSize: 16 },

  // Buttons
  primaryButton: { backgroundColor: '#7C3AED', paddingVertical: 18, paddingHorizontal: 32, borderRadius: 16, width: '100%', shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  primaryButtonPressed: { backgroundColor: '#6D28D9', transform: [{ scale: 0.98 }] },
  primaryButtonText: { color: 'white', fontWeight: '700', fontSize: 18, textAlign: 'center' },
  secondaryButton: { paddingVertical: 16, paddingHorizontal: 32 },
  secondaryButtonText: { color: '#6B7280', fontWeight: '500', textAlign: 'center' },
  premiumButton: { backgroundColor: '#F59E0B', paddingVertical: 18, paddingHorizontal: 32, borderRadius: 16, width: '100%' },
  premiumButtonText: { color: 'white', fontWeight: '700', fontSize: 18, textAlign: 'center' },

  // Progress dots
  progressDots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 32 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E5E7EB' },
  dotActive: { backgroundColor: '#7C3AED', width: 24 },
  dotCompleted: { backgroundColor: '#7C3AED' },

  // Onboarding
  onboardingContainer: { flex: 1, backgroundColor: '#FAF5FF', paddingHorizontal: 24, paddingTop: 60 },
  onboardingTitle: { fontSize: 26, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  onboardingSubtitle: { color: '#6B7280', marginBottom: 32, fontSize: 16 },
  backButton: { marginBottom: 24 },
  backText: { color: '#374151', fontSize: 16 },
  optionCard: { backgroundColor: 'white', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderWidth: 2, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  optionCardSimple: { backgroundColor: 'white', borderRadius: 16, padding: 20, marginBottom: 12, borderWidth: 2, borderColor: '#F3F4F6' },
  optionCardPressed: { backgroundColor: '#F3F4F6', borderColor: '#7C3AED' },
  optionIcon: { width: 48, height: 48, backgroundColor: '#EDE9FE', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  optionIconText: { fontSize: 24 },
  optionLabel: { flex: 1, color: '#1F2937', fontWeight: '500', fontSize: 16 },
  optionLabelBold: { color: '#1F2937', fontWeight: '600', fontSize: 18 },
  optionDesc: { color: '#6B7280', fontSize: 14, marginTop: 4 },
  chevron: { color: '#9CA3AF', fontSize: 24 },
  introIconBox: { alignItems: 'center', marginBottom: 32, marginTop: 32 },
  introIcon: { fontSize: 64, backgroundColor: '#EDE9FE', padding: 24, borderRadius: 64, overflow: 'hidden' },
  infoBox: { backgroundColor: 'white', borderRadius: 16, padding: 20, marginBottom: 32, borderWidth: 1, borderColor: '#E5E7EB' },
  infoRow: { color: '#374151', marginBottom: 12, fontSize: 16 },

  // Home
  homeContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  homeScroll: { flex: 1, paddingHorizontal: 16, paddingTop: 56 },
  homeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  dateText: { fontSize: 14, color: '#7C3AED', fontWeight: '600', textTransform: 'capitalize' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  settingsBtn: { padding: 8 },
  settingsIcon: { fontSize: 24 },
  screenTitle: { fontSize: 26, fontWeight: 'bold', color: '#111827', marginBottom: 24 },

  // Streak Card
  streakCard: { backgroundColor: '#FFF7ED', borderRadius: 20, padding: 24, marginBottom: 24, borderWidth: 1, borderColor: '#FFEDD5', shadowColor: '#F97316', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
  streakContent: { alignItems: 'center' },
  fireIcon: { width: 72, height: 72, backgroundColor: '#FFEDD5', borderRadius: 36, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  fireEmoji: { fontSize: 36 },
  streakNumber: { fontSize: 48, fontWeight: 'bold', color: '#111827' },
  streakLabel: { color: '#4B5563', fontSize: 16 },
  streakMessage: { color: '#F97316', fontWeight: '600', marginTop: 8 },
  nextBadge: { backgroundColor: '#FED7AA', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, marginTop: 12 },
  nextBadgeText: { color: '#C2410C', fontSize: 12, fontWeight: '600' },
  ctaButton: { marginTop: 24, backgroundColor: '#F97316', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 14, shadowColor: '#F97316', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  ctaButtonPressed: { backgroundColor: '#EA580C' },
  ctaText: { color: 'white', fontWeight: '700', fontSize: 16, textAlign: 'center' },
  testsDepletedBox: { marginTop: 20, alignItems: 'center' },
  testsDepletedText: { color: '#DC2626', fontWeight: '600', marginBottom: 12 },
  premiumCTA: { backgroundColor: '#F59E0B', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  premiumCTAText: { color: 'white', fontWeight: '600' },
  testsCounter: { textAlign: 'center', color: '#6B7280', fontSize: 13, marginTop: 16 },
  premiumBadge: { textAlign: 'center', color: '#F59E0B', fontSize: 14, fontWeight: '600', marginTop: 16 },

  // Stats
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: 'white', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  statEmoji: { fontSize: 24 },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginTop: 8 },
  statLabel: { fontSize: 14, color: '#6B7280' },
  totalStatsCard: { backgroundColor: 'white', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#F3F4F6', marginBottom: 24 },
  totalStatsTitle: { fontWeight: '600', color: '#111827', marginBottom: 16 },
  totalStatsRow: { flexDirection: 'row' },
  totalStatItem: { flex: 1 },
  totalStatNumber: { fontSize: 24, fontWeight: 'bold', color: '#7C3AED' },
  totalStatLabel: { fontSize: 12, color: '#6B7280' },

  // Tab Bar
  tabBar: { flexDirection: 'row', backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingBottom: 24, paddingTop: 8, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 8 },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  tabIconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  tabIconContainerActive: { backgroundColor: '#EDE9FE' },
  tabIcon: { fontSize: 20, color: '#9CA3AF' },
  tabIconActive: { color: '#7C3AED' },
  tabLabel: { fontSize: 10, color: '#9CA3AF', fontWeight: '600', marginTop: 4 },
  tabLabelActive: { color: '#7C3AED' },

  // Activity
  activityCard: { backgroundColor: 'white', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#F3F4F6' },
  activityIcon: { fontSize: 24, marginBottom: 12 },
  activityTitle: { fontWeight: '600', color: '#111827', marginBottom: 16 },
  activityStat: { color: '#6B7280', marginBottom: 4 },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 60 },
  weekDay: { alignItems: 'center' },
  weekBar: { width: 24, backgroundColor: '#7C3AED', borderRadius: 4, marginBottom: 4, minHeight: 4 },
  weekLabel: { fontSize: 10, color: '#9CA3AF' },

  // Empty state
  emptyCard: { backgroundColor: 'white', borderRadius: 20, padding: 40, alignItems: 'center', borderWidth: 1, borderColor: '#F3F4F6' },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginTop: 16, marginBottom: 8 },
  emptyText: { color: '#6B7280', textAlign: 'center' },

  // Temas
  temaCard: { backgroundColor: 'white', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderWidth: 2, borderColor: '#EDE9FE' },
  temaIcon: { fontSize: 30, marginRight: 16 },
  temaContent: { flex: 1 },
  temaTitle: { fontWeight: 'bold', color: '#111827' },
  temaQuestions: { fontSize: 14, color: '#6B7280' },

  // Resources
  resourceCard: { backgroundColor: 'white', borderRadius: 16, padding: 24, marginBottom: 16, borderWidth: 1, borderColor: '#F3F4F6' },
  resourceIcon: { fontSize: 24, marginBottom: 16 },
  resourceTitle: { fontWeight: 'bold', color: '#111827', marginBottom: 16, fontSize: 18 },
  resourceTip: { color: '#374151', marginBottom: 8, fontSize: 15 },

  // Test
  testContainer: { flex: 1, backgroundColor: 'white' },
  testHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 56, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  closeBtn: { fontSize: 24, color: '#6B7280', padding: 4 },
  progress: { color: '#4B5563', fontWeight: '600' },
  timer: { color: '#6B7280' },
  progressBar: { height: 4, backgroundColor: '#F3F4F6' },
  progressFill: { height: 4, backgroundColor: '#7C3AED' },
  testContent: { flex: 1, padding: 20 },
  questionText: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 24, lineHeight: 28 },
  optionsContainer: { gap: 12 },
  optionBtn: { backgroundColor: 'white', borderWidth: 2, borderColor: '#E5E7EB', borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'flex-start' },
  optionPressed: { borderColor: '#7C3AED', backgroundColor: '#FAF5FF' },
  optionCorrect: { backgroundColor: '#F0FDF4', borderWidth: 2, borderColor: '#86EFAC', borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'flex-start' },
  optionWrong: { backgroundColor: '#FEF2F2', borderWidth: 2, borderColor: '#FCA5A5', borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'flex-start' },
  optionId: { fontWeight: 'bold', color: '#374151', marginRight: 12 },
  optionText: { flex: 1, color: '#374151', fontSize: 15 },
  checkIcon: { color: '#10B981', fontSize: 20, fontWeight: 'bold' },
  xIcon: { color: '#EF4444', fontSize: 20, fontWeight: 'bold' },
  explanationBox: { marginTop: 24, backgroundColor: '#EFF6FF', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#DBEAFE' },
  explanationTitle: { fontWeight: '600', color: '#1E40AF', marginBottom: 8 },
  explanationText: { color: '#1E3A8A', lineHeight: 22 },

  // Results
  resultsContainer: { flex: 1, backgroundColor: 'white', paddingHorizontal: 16, paddingTop: 56 },
  closeResults: { marginBottom: 24 },
  resultCard: { borderRadius: 24, padding: 32, alignItems: 'center', marginBottom: 24 },
  resultGood: { backgroundColor: '#F0FDF4' },
  resultBad: { backgroundColor: '#FFF7ED' },
  resultEmoji: { fontSize: 56, marginBottom: 16 },
  resultScore: { fontSize: 42, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  resultPercent: { fontSize: 18, fontWeight: '600' },
  percentGood: { color: '#16A34A' },
  percentBad: { color: '#EA580C' },
  resultTime: { color: '#6B7280', marginTop: 8 },
  messageCard: { backgroundColor: '#F9FAFB', borderRadius: 14, padding: 16, marginBottom: 24 },
  messageText: { color: '#374151', textAlign: 'center', fontSize: 16 },
  summaryTitle: { fontWeight: 'bold', color: '#111827', marginBottom: 16, fontSize: 18 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 12, padding: 14, marginBottom: 8 },
  summaryIcon: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  iconGreen: { backgroundColor: '#DCFCE7' },
  iconRed: { backgroundColor: '#FEE2E2' },
  summaryIconText: { fontSize: 16, fontWeight: 'bold' },
  summaryText: { color: '#374151', flex: 1 },
  actionsRow: { marginTop: 24, marginBottom: 40 },

  // Premium Modal
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  premiumModal: { backgroundColor: 'white', borderRadius: 24, width: '90%', maxWidth: 400, maxHeight: '85%', overflow: 'hidden' },
  premiumHeader: { backgroundColor: '#F59E0B', padding: 24, alignItems: 'center' },
  modalClose: { position: 'absolute', top: 16, right: 16 },
  modalCloseText: { color: 'white', fontSize: 24 },
  premiumCrown: { fontSize: 56, marginBottom: 12 },
  premiumTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  premiumSubtitle: { color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  premiumContent: { padding: 24 },
  benefitRow: { flexDirection: 'row', marginBottom: 16 },
  benefitEmoji: { fontSize: 28, marginRight: 12 },
  benefitText: { flex: 1 },
  benefitTitle: { fontWeight: 'bold', color: '#111827' },
  benefitDesc: { color: '#6B7280', fontSize: 13 },
  launchDate: { textAlign: 'center', color: '#6B7280', marginVertical: 16 },
  launchDateHighlight: { color: '#F59E0B', fontWeight: 'bold' },
  waitlistForm: { gap: 12 },
  waitlistInput: { borderWidth: 2, borderColor: '#E5E7EB', borderRadius: 12, padding: 14, fontSize: 16 },
  waitlistButton: { backgroundColor: '#F59E0B', padding: 16, borderRadius: 12, alignItems: 'center' },
  waitlistButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  waitlistSuccess: { backgroundColor: '#F0FDF4', borderRadius: 12, padding: 16, alignItems: 'center' },
  waitlistSuccessText: { color: '#16A34A', fontWeight: 'bold', fontSize: 16 },
  waitlistAlready: { color: '#16A34A' },
  waitlistEmail: { color: '#6B7280', fontSize: 12, marginTop: 4 },
  modalDismiss: { alignItems: 'center', paddingVertical: 16 },
  modalDismissText: { color: '#9CA3AF' },

  // Celebration Modal
  celebrationModal: { backgroundColor: 'white', borderRadius: 24, padding: 32, alignItems: 'center', width: '80%' },
  celebrationEmoji: { fontSize: 72, marginBottom: 16 },
  celebrationTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  celebrationBadge: { fontSize: 20, color: '#7C3AED', fontWeight: '600' },
  celebrationDays: { color: '#6B7280', marginTop: 4, marginBottom: 24 },
  celebrationButton: { backgroundColor: '#7C3AED', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12 },
  celebrationButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
