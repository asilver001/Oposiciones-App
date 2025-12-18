// Fortress Logic - Sistema de Fortaleza de Conocimiento
// Cada tema tiene 6 bloques que decaen con el tiempo

/**
 * Safely parse a date string, returning null if invalid
 */
const safeParseDate = (dateValue) => {
  if (!dateValue) return null;
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return null;
    return date;
  } catch (e) {
    return null;
  }
};

/**
 * Calcula el decaimiento de la fortaleza de un tema
 * @param {Object} topic - Datos del progreso del tema
 * @returns {Object} - Tema con fortaleza actualizada
 */
export const calculateDecay = (topic) => {
  if (!topic.lastStudiedAt || topic.strengthLevel === 0) {
    return topic;
  }

  const now = new Date();
  const lastStudied = safeParseDate(topic.lastStudiedAt);

  // If date is invalid, return topic unchanged
  if (!lastStudied) {
    return topic;
  }

  const hoursSinceStudy = (now - lastStudied) / (1000 * 60 * 60);

  // Determinar velocidad de decaimiento según consolidación
  let decayRateHours;
  switch (topic.consolidationLevel) {
    case 'new':
      decayRateHours = 36; // 1.5 días por bloque
      break;
    case 'in_progress':
      decayRateHours = 60; // 2.5 días por bloque
      break;
    case 'consolidated':
      decayRateHours = 84; // 3.5 días por bloque
      break;
    default:
      decayRateHours = 48; // 2 días por defecto
  }

  // Calcular bloques perdidos
  const blocksLost = Math.floor(hoursSinceStudy / decayRateHours);
  const newStrengthLevel = Math.max(0, topic.strengthLevel - blocksLost);

  // Calcular próximo decaimiento
  const nextDecayHours = decayRateHours - (hoursSinceStudy % decayRateHours);
  const nextDecayAt = new Date(now.getTime() + nextDecayHours * 60 * 60 * 1000);

  return {
    ...topic,
    strengthLevel: newStrengthLevel,
    strengthPercentage: Math.round((newStrengthLevel / 6) * 100),
    nextDecayAt: nextDecayAt.toISOString(),
    blocksLost
  };
};

/**
 * Actualiza un tema después de una sesión de estudio
 * @param {Object} topic - Datos del progreso del tema
 * @param {Object} sessionResults - Resultados de la sesión
 * @returns {Object} - Tema actualizado
 */
export const updateTopicAfterStudy = (topic, sessionResults) => {
  const newTotalSessions = (topic.totalSessions || 0) + 1;

  // Determinar nuevo nivel de consolidación
  let newConsolidationLevel;
  if (newTotalSessions >= 6) {
    newConsolidationLevel = 'consolidated';
  } else if (newTotalSessions >= 3) {
    newConsolidationLevel = 'in_progress';
  } else {
    newConsolidationLevel = 'new';
  }

  // Calcular nuevo nivel de fortaleza basado en rendimiento
  const accuracyBonus = sessionResults.accuracy >= 80 ? 2 :
                        sessionResults.accuracy >= 60 ? 1 : 0;
  const newStrengthLevel = Math.min(6, (topic.strengthLevel || 0) + 1 + accuracyBonus);

  const totalQuestionsAnswered = (topic.totalQuestionsAnswered || 0) + sessionResults.totalQuestions;
  const correctAnswers = (topic.correctAnswers || 0) + sessionResults.correct;

  return {
    ...topic,
    strengthLevel: newStrengthLevel,
    strengthPercentage: Math.round((newStrengthLevel / 6) * 100),
    consolidationLevel: newConsolidationLevel,
    totalSessions: newTotalSessions,
    lastStudiedAt: new Date().toISOString(),
    totalQuestionsAnswered,
    correctAnswers,
    accuracy: Math.round((correctAnswers / totalQuestionsAnswered) * 100)
  };
};

/**
 * Inicializa los datos de fortaleza para los temas
 * @param {Array} topicsList - Lista de temas
 * @param {Object} existingProgress - Progreso existente (opcional)
 * @returns {Object} - Objeto con datos de fortaleza por tema
 */
export const initializeFortressData = (topicsList, existingProgress = {}) => {
  const fortressData = {};

  topicsList.forEach(topic => {
    const existing = existingProgress[topic.id];

    fortressData[topic.id] = {
      topicId: topic.id,
      topicName: topic.title,
      topicShortName: getShortName(topic.title),
      strengthLevel: existing?.strengthLevel || 0,
      strengthPercentage: existing?.strengthPercentage || 0,
      consolidationLevel: existing?.consolidationLevel || 'new',
      totalSessions: existing?.totalSessions || 0,
      lastStudiedAt: existing?.lastStudiedAt || null,
      nextDecayAt: existing?.nextDecayAt || null,
      totalQuestionsAnswered: existing?.totalQuestionsAnswered || 0,
      correctAnswers: existing?.correctAnswers || 0,
      accuracy: existing?.accuracy || 0
    };
  });

  return fortressData;
};

/**
 * Genera un nombre corto para mostrar en la fortaleza
 */
const getShortName = (title) => {
  const shortNames = {
    'La Constitución Española': 'Const.',
    'La Corona': 'Corona',
    'Las Cortes Generales': 'Cortes',
    'El Gobierno y la Administración': 'Gob.',
    'El Poder Judicial': 'Judicial',
    'Organización Territorial': 'Territ.',
    'El Tribunal Constitucional': 'T.Const.',
    'Comunidades Autónomas': 'CCAA',
    'Administración General del Estado': 'AGE',
    'Procedimiento Administrativo': 'Proc.'
  };

  return shortNames[title] || title.split(' ').slice(0, 2).join(' ').substring(0, 8);
};

/**
 * Obtiene el estado de un tema basado en su fortaleza
 */
export const getTopicStatus = (strengthLevel) => {
  if (strengthLevel >= 5) return { text: 'SÓLIDO', class: 'solid', color: 'green' };
  if (strengthLevel >= 3) return { text: '↓ bajando', class: 'declining', color: 'yellow' };
  if (strengthLevel >= 1) return { text: 'CRÍTICO', class: 'critical', color: 'red' };
  return { text: 'SIN EMPEZAR', class: 'empty', color: 'gray' };
};

/**
 * Encuentra temas que necesitan atención urgente
 */
export const getUrgentTopics = (fortressData) => {
  const topics = Object.values(fortressData);

  return topics
    .filter(t => t.strengthLevel > 0 && t.nextDecayAt && safeParseDate(t.nextDecayAt))
    .sort((a, b) => {
      const dateA = safeParseDate(a.nextDecayAt);
      const dateB = safeParseDate(b.nextDecayAt);
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;
      return dateA - dateB;
    })
    .slice(0, 3);
};

// Export safeParseDate for use in other files
export { safeParseDate };

/**
 * Genera datos mock para testing/demo
 */
export const generateMockFortressData = () => {
  const now = new Date();

  return {
    1: {
      topicId: 1,
      topicName: 'La Constitución Española',
      topicShortName: 'Const.',
      strengthLevel: 6,
      strengthPercentage: 100,
      consolidationLevel: 'consolidated',
      totalSessions: 8,
      lastStudiedAt: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
      nextDecayAt: new Date(now + 60 * 60 * 60 * 1000).toISOString(),
      totalQuestionsAnswered: 120,
      correctAnswers: 96,
      accuracy: 80
    },
    2: {
      topicId: 2,
      topicName: 'Administración General del Estado',
      topicShortName: 'AGE',
      strengthLevel: 4,
      strengthPercentage: 67,
      consolidationLevel: 'in_progress',
      totalSessions: 4,
      lastStudiedAt: new Date(now - 48 * 60 * 60 * 1000).toISOString(),
      nextDecayAt: new Date(now + 12 * 60 * 60 * 1000).toISOString(),
      totalQuestionsAnswered: 60,
      correctAnswers: 42,
      accuracy: 70
    },
    3: {
      topicId: 3,
      topicName: 'Procedimiento Administrativo',
      topicShortName: 'Proc.',
      strengthLevel: 1,
      strengthPercentage: 17,
      consolidationLevel: 'new',
      totalSessions: 1,
      lastStudiedAt: new Date(now - 72 * 60 * 60 * 1000).toISOString(),
      nextDecayAt: new Date(now + 6 * 60 * 60 * 1000).toISOString(),
      totalQuestionsAnswered: 15,
      correctAnswers: 8,
      accuracy: 53
    }
  };
};
