/**
 * StudyPlanEngine - The "brain" of OpositaSmart
 *
 * Computes 2-3 daily study activities based on:
 * - FSRS due reviews (spaced repetition)
 * - Topic accuracy (weak areas)
 * - Days since last practice (stale topics)
 * - Exam date (urgency)
 * - Prerequisites (unlock order)
 * - Today's activity (avoid overload)
 *
 * Returns ordered activities with 1-click session configs.
 */

import { TOPIC_PREREQUISITES, TOPIC_SHORT_NAMES, isTopicUnlocked } from '../data/topicPrerequisites';

/**
 * Activity types the engine can recommend
 */
export const ActivityType = {
  REVIEW_DUE: 'review-due',
  WEAK_TOPIC: 'weak-topic',
  NEW_TOPIC: 'new-topic',
  REINFORCE: 'reinforce',
  SIMULACRO: 'simulacro',
  ERROR_REVIEW: 'error-review',
  REST: 'rest',
};

/**
 * Compute days until exam from examDate string
 * @param {string} examDate - ISO date string or 'YYYY-MM-DD'
 * @returns {number|null} Days until exam, or null if no date set
 */
function daysUntilExam(examDate) {
  if (!examDate) return null;
  const exam = new Date(examDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  exam.setHours(0, 0, 0, 0);
  const diff = Math.ceil((exam - now) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : null;
}

/**
 * Compute urgency multiplier based on exam proximity
 * Closer exam = higher urgency = more daily work suggested
 */
function getUrgencyMultiplier(daysLeft) {
  if (daysLeft === null) return 1.0;
  if (daysLeft <= 7) return 2.0;
  if (daysLeft <= 30) return 1.5;
  if (daysLeft <= 90) return 1.2;
  return 1.0;
}

/**
 * Main engine: compute today's study plan
 *
 * @param {Object} params
 * @param {number} params.dueReviewCount - Number of FSRS reviews due today
 * @param {Array} params.topicProgress - Array of { number, name, accuracy, answered, total, sessionsCompleted, lastPracticed, status }
 * @param {Object} params.userProgress - Map of topicNumber -> progress data (for prerequisites)
 * @param {Array} params.availableTopics - Topics with is_available=true and questionCount>0
 * @param {Object} params.todayStats - { questionsAnswered, testsCompleted }
 * @param {string} params.examDate - User's exam date
 * @param {number} params.dailyGoal - Daily question goal
 * @param {Object} params.overallStats - { accuracyRate, testsCompleted }
 * @returns {Array} Ordered list of recommended activities
 */
export function computeStudyPlan({
  dueReviewCount = 0,
  topicProgress = [],
  userProgress = {},
  availableTopics = [],
  todayStats = { questionsAnswered: 0, testsCompleted: 0 },
  examDate = null,
  dailyGoal = 15,
  overallStats = { accuracyRate: 0, testsCompleted: 0 }
}) {
  const activities = [];
  const daysLeft = daysUntilExam(examDate);
  const urgency = getUrgencyMultiplier(daysLeft);
  const questionsToday = todayStats.questionsAnswered || 0;
  const adjustedGoal = Math.round(dailyGoal * urgency);

  // Check if user has done enough today
  if (questionsToday >= adjustedGoal * 1.5) {
    activities.push({
      type: ActivityType.REST,
      title: 'Buen trabajo hoy',
      description: `Ya has respondido ${questionsToday} preguntas. Descansa y vuelve mañana.`,
      icon: 'coffee',
      priority: 1,
      estimatedMinutes: 0,
      config: null,
    });
    return activities;
  }

  // --- Activity 1: FSRS reviews due ---
  if (dueReviewCount > 0) {
    const reviewQuestions = Math.min(dueReviewCount, 15);
    activities.push({
      type: ActivityType.REVIEW_DUE,
      title: 'Repasar pendientes',
      description: `${dueReviewCount} pregunta${dueReviewCount !== 1 ? 's' : ''} ${dueReviewCount !== 1 ? 'necesitan' : 'necesita'} repaso para no olvidarlas.`,
      icon: 'refresh-cw',
      priority: 10,
      estimatedMinutes: Math.round(reviewQuestions * 0.75),
      config: {
        mode: 'repaso-errores',
        totalQuestions: reviewQuestions,
        failedOnly: false,
        title: 'Repaso espaciado',
      },
    });
  }

  // --- Identify weak topics (accuracy < 60%, at least 5 questions answered) ---
  const weakTopics = topicProgress
    .filter(t => t.answered >= 5 && t.accuracy < 60)
    .sort((a, b) => a.accuracy - b.accuracy);

  if (weakTopics.length > 0) {
    const weakest = weakTopics[0];
    activities.push({
      type: ActivityType.WEAK_TOPIC,
      title: `Reforzar T${weakest.number}`,
      description: `${weakest.name}: ${weakest.accuracy}% de acierto. Practica para mejorar.`,
      icon: 'alert-triangle',
      priority: 20,
      estimatedMinutes: 10,
      config: {
        mode: 'practica-tema',
        topic: { number: weakest.number, name: weakest.name, id: weakest.id },
        totalQuestions: 15,
        title: `Reforzar: ${TOPIC_SHORT_NAMES[weakest.number] || weakest.name}`,
      },
    });
  }

  // --- Identify stale topics (not practiced in 7+ days, accuracy 60-80%) ---
  const now = new Date();
  const staleTopics = topicProgress
    .filter(t => {
      if (!t.lastPracticed || t.answered < 3) return false;
      const daysSince = Math.floor((now - new Date(t.lastPracticed)) / (1000 * 60 * 60 * 24));
      return daysSince >= 7 && t.accuracy >= 50;
    })
    .sort((a, b) => {
      const daysA = Math.floor((now - new Date(a.lastPracticed)) / (1000 * 60 * 60 * 24));
      const daysB = Math.floor((now - new Date(b.lastPracticed)) / (1000 * 60 * 60 * 24));
      return daysB - daysA;
    });

  if (staleTopics.length > 0 && activities.length < 3) {
    const stale = staleTopics[0];
    const daysSince = Math.floor((now - new Date(stale.lastPracticed)) / (1000 * 60 * 60 * 24));
    activities.push({
      type: ActivityType.REINFORCE,
      title: `Repasar T${stale.number}`,
      description: `${stale.name}: ${daysSince} días sin practicar. No pierdas lo aprendido.`,
      icon: 'clock',
      priority: 30,
      estimatedMinutes: 8,
      config: {
        mode: 'practica-tema',
        topic: { number: stale.number, name: stale.name, id: stale.id },
        totalQuestions: 10,
        title: `Repaso: ${TOPIC_SHORT_NAMES[stale.number] || stale.name}`,
      },
    });
  }

  // --- Suggest new topic if prerequisites met ---
  const availableNumbers = new Set(availableTopics.map(t => t.number));
  const studiedNumbers = new Set(topicProgress.filter(t => t.answered > 0).map(t => t.number));

  // Find first unstudied topic that is unlocked
  const topicOrder = Object.keys(TOPIC_PREREQUISITES).map(Number).sort((a, b) => a - b);
  let newTopicSuggestion = null;

  for (const num of topicOrder) {
    if (!availableNumbers.has(num)) continue; // topic not available
    if (studiedNumbers.has(num)) continue; // already studied
    if (isTopicUnlocked(num, userProgress)) {
      const topicInfo = availableTopics.find(t => t.number === num);
      if (topicInfo) {
        newTopicSuggestion = topicInfo;
        break;
      }
    }
  }

  if (newTopicSuggestion && activities.length < 3) {
    activities.push({
      type: ActivityType.NEW_TOPIC,
      title: `Empezar T${newTopicSuggestion.number}`,
      description: `${newTopicSuggestion.name}: ${newTopicSuggestion.questionCount || '?'} preguntas disponibles.`,
      icon: 'book-open',
      priority: 40,
      estimatedMinutes: 12,
      config: {
        mode: 'practica-tema',
        topic: { number: newTopicSuggestion.number, name: newTopicSuggestion.name, id: newTopicSuggestion.id },
        totalQuestions: 15,
        title: `Nuevo: ${TOPIC_SHORT_NAMES[newTopicSuggestion.number] || newTopicSuggestion.name}`,
      },
    });
  }

  // --- Simulacro suggestion when enough preparation ---
  if (overallStats.testsCompleted >= 10 && overallStats.accuracyRate >= 55 && activities.length < 3) {
    activities.push({
      type: ActivityType.SIMULACRO,
      title: 'Simulacro de examen',
      description: '100 preguntas en 60 min. Practica en condiciones reales.',
      icon: 'clock',
      priority: 50,
      estimatedMinutes: 60,
      config: {
        mode: 'simulacro',
        questionCount: 100,
        timeLimit: 60,
        title: 'Simulacro de examen',
      },
    });
  }

  // --- Fallback: if no activities, suggest a general session ---
  if (activities.length === 0) {
    const fallbackTopic = topicProgress.length > 0
      ? topicProgress.sort((a, b) => (a.accuracy || 0) - (b.accuracy || 0))[0]
      : null;

    activities.push({
      type: ActivityType.NEW_TOPIC,
      title: 'Sesión de práctica',
      description: fallbackTopic
        ? `Continúa con ${fallbackTopic.name}`
        : 'Empieza con un test rápido de 10 preguntas.',
      icon: 'zap',
      priority: 50,
      estimatedMinutes: 10,
      config: fallbackTopic
        ? {
          mode: 'practica-tema',
          topic: { number: fallbackTopic.number, name: fallbackTopic.name, id: fallbackTopic.id },
          totalQuestions: 15,
          title: fallbackTopic.name,
        }
        : {
          mode: 'test-rapido',
          totalQuestions: 10,
          title: 'Test rápido',
        },
    });
  }

  // Sort by priority (lower = more important)
  activities.sort((a, b) => a.priority - b.priority);

  // Return top 3
  return activities.slice(0, 3);
}

/**
 * Compute exam countdown data
 * @param {string} examDate
 * @returns {Object} { daysLeft, urgencyLevel, message }
 */
export function getExamCountdown(examDate) {
  const days = daysUntilExam(examDate);
  if (days === null) {
    return { daysLeft: null, urgencyLevel: 'none', message: 'Sin fecha de examen' };
  }
  let urgencyLevel = 'calm';
  let message = `${days} días para el examen`;
  if (days <= 7) {
    urgencyLevel = 'critical';
    message = `¡${days} día${days !== 1 ? 's' : ''} para el examen!`;
  } else if (days <= 30) {
    urgencyLevel = 'warning';
    message = `${days} días para el examen`;
  } else if (days <= 90) {
    urgencyLevel = 'focus';
    message = `${days} días para el examen`;
  }
  return { daysLeft: days, urgencyLevel, message };
}

/**
 * Get a short motivational insight based on today's progress
 */
export function getDailyInsight(todayStats, streak, _overallStats) {
  const q = todayStats.questionsAnswered || 0;
  const acc = todayStats.accuracyRate || 0;

  if (q === 0 && streak.current > 0) {
    return { text: `Llevas ${streak.current} días de racha. ¡No la rompas!`, type: 'streak' };
  }
  if (q === 0) {
    return { text: 'Empieza hoy con unos minutos de práctica.', type: 'start' };
  }
  if (acc >= 80) {
    return { text: `${acc}% de acierto hoy. ¡Excelente!`, type: 'great' };
  }
  if (acc >= 60) {
    return { text: `${acc}% de acierto. Buen ritmo, sigue así.`, type: 'good' };
  }
  return { text: `${q} preguntas hoy. Cada práctica cuenta.`, type: 'ok' };
}
