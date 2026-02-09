/**
 * Topic prerequisite mapping for AGE Auxiliar Administrativo.
 *
 * Each key is a topic number and its value is the list of topic numbers
 * that should be studied (masteryRate >= 50%) before starting that topic.
 */

export const TOPIC_PREREQUISITES = {
  1: [],
  2: [1],
  3: [1],
  4: [1, 3],
  5: [1],
  6: [1, 2, 5],
  7: [1],
  8: [3],
  9: [3, 8],
  10: [3, 8],
  11: [3],
  12: [],
  13: [],
  14: [],
  15: [],
  16: []
};

const TOPIC_SHORT_NAMES = {
  1: 'La Constitucion',
  2: 'Derechos fundamentales',
  3: 'Gobierno y Administracion',
  4: 'Organizacion territorial',
  5: 'Cortes Generales',
  6: 'Tribunal Constitucional',
  7: 'Union Europea',
  8: 'Acto Administrativo',
  9: 'Procedimiento administrativo',
  10: 'Contratos del sector publico',
  11: 'Funcion publica',
  12: 'Proteccion de Datos',
  13: 'Personal al Servicio AAPP',
  14: 'Presupuestos Generales',
  15: 'Prevencion de Riesgos',
  16: 'Politicas de Igualdad'
};

/**
 * Returns the list of prerequisite topic numbers for a given topic.
 */
export function getPrerequisites(topicNumber) {
  return TOPIC_PREREQUISITES[topicNumber] || [];
}

/**
 * Returns true if all prerequisites for the topic have masteryRate >= 50%.
 *
 * @param {number} topicNumber - The topic to check
 * @param {Object} userProgress - Map of topicNumber -> { masteryRate, accuracy, ... }
 */
export function isTopicUnlocked(topicNumber, userProgress = {}) {
  const prereqs = TOPIC_PREREQUISITES[topicNumber];
  if (!prereqs || prereqs.length === 0) return true;

  return prereqs.every((prereq) => {
    const progress = userProgress[prereq];
    if (!progress) return false;
    return (progress.masteryRate >= 50) || (progress.accuracy >= 65);
  });
}

/**
 * Returns a human-readable message listing the missing prerequisites.
 *
 * @param {number} topicNumber
 * @param {Object} userProgress
 * @returns {string|null} Message or null if already unlocked
 */
export function getUnlockMessage(topicNumber, userProgress = {}) {
  const prereqs = TOPIC_PREREQUISITES[topicNumber];
  if (!prereqs || prereqs.length === 0) return null;

  const missing = prereqs.filter((prereq) => {
    const progress = userProgress[prereq];
    if (!progress) return true;
    return (progress.masteryRate < 50) && (progress.accuracy < 65);
  });

  if (missing.length === 0) return null;

  const names = missing.map(
    (num) => `Tema ${num} (${TOPIC_SHORT_NAMES[num] || '?'})`
  );
  return `Completa primero: ${names.join(', ')}`;
}

/**
 * Returns an ordered list of topic numbers recommended to study next.
 * A topic is recommended if it is unlocked but not yet mastered (masteryRate < 50).
 *
 * @param {Object} userProgress
 * @returns {number[]}
 */
export function getRecommendedOrder(userProgress = {}) {
  const recommended = [];

  // Process in numeric order
  const topicNumbers = Object.keys(TOPIC_PREREQUISITES)
    .map(Number)
    .sort((a, b) => a - b);

  for (const num of topicNumbers) {
    const progress = userProgress[num];
    const mastered = progress && (progress.masteryRate >= 50 || progress.accuracy >= 65);

    if (!mastered && isTopicUnlocked(num, userProgress)) {
      recommended.push(num);
    }
  }

  return recommended;
}
