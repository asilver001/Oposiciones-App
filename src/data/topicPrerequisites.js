/**
 * Topic prerequisite mapping for AGE Auxiliar Administrativo.
 *
 * Each key is a topic number and its value is the list of topic numbers
 * that should be studied (masteryRate >= 50%) before starting that topic.
 */

export const TOPIC_PREREQUISITES = {
  // Bloque I: Organización Pública (T1-T16)
  1: [],           // La Constitución Española
  2: [1],          // Transparencia (requiere CE base)
  3: [1],          // AGE (requiere CE base)
  4: [1],          // CCAA y Administración local
  5: [1],          // Unión Europea
  6: [3],          // Procedimiento LPAC+LRJSP (requiere AGE)
  7: [],           // Protección de datos (independiente)
  8: [1],          // Cortes Generales (requiere CE base)
  9: [3],          // Personal funcionario (requiere AGE)
  10: [9],         // Derechos empleados (requiere EBEP)
  11: [1, 8],      // Poder Judicial (requiere CE + Cortes)
  12: [8],         // Presupuestos (requiere Cortes)
  13: [],          // Igualdad (independiente)
  14: [1, 8],      // Tribunal Constitucional (requiere CE + Cortes)
  15: [1],         // Gobierno y Administración (requiere CE)
  16: [15],        // Gobierno Abierto (requiere Gobierno)
  // Bloque II: Actividad Administrativa y Ofimática (T17-T28)
  17: [],          // Atención al público
  18: [17],        // Servicios de información
  19: [],          // Documentos, registro y archivo
  20: [19],        // Administración electrónica
  21: [],          // Informática básica
  22: [21],        // Windows
  23: [22],        // Explorador Windows
  24: [21],        // Word
  25: [21],        // Excel
  26: [21],        // Access
  27: [21],        // Outlook
  28: [21]         // Internet
};

export const TOPIC_SHORT_NAMES = {
  1: 'Constitución',
  2: 'Transparencia',
  3: 'AGE',
  4: 'CCAA y Admin. local',
  5: 'Unión Europea',
  6: 'LPAC + LRJSP',
  7: 'Protección datos',
  8: 'Cortes Generales',
  9: 'Personal AAPP',
  10: 'Derechos empleados',
  11: 'Poder Judicial',
  12: 'Presupuestos',
  13: 'Igualdad',
  14: 'Tribunal Constitucional',
  15: 'Gobierno',
  16: 'Gobierno Abierto',
  17: 'Atención al público',
  18: 'Servicios info.',
  19: 'Documentos y archivo',
  20: 'Admin. electrónica',
  21: 'Informática básica',
  22: 'Windows',
  23: 'Explorador Windows',
  24: 'Word',
  25: 'Excel',
  26: 'Access',
  27: 'Outlook',
  28: 'Internet'
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
