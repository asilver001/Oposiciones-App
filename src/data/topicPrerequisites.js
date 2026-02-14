/**
 * Topic prerequisite mapping for AGE Auxiliar Administrativo.
 *
 * Each key is a topic number and its value is the list of topic numbers
 * that should be studied (masteryRate >= 50%) before starting that topic.
 */

export const TOPIC_PREREQUISITES = {
  // Bloque I: Constitución Española
  1: [],           // CE: Principios generales
  2: [1],          // Derechos y deberes fundamentales
  3: [1],          // Corona, Cortes Generales
  4: [1, 3],       // Gobierno, Poder Judicial, TC
  5: [1],          // Organización territorial
  // Bloque I: Organización Administrativa
  6: [1, 5],       // AGE central
  7: [1],          // AGE territorial
  8: [3],          // Comunidades Autónomas
  9: [3, 8],       // Administración Local
  10: [3, 8],      // Unión Europea
  // Bloque I: Función Pública
  11: [6],         // EBEP - Personal AAPP
  12: [11],        // Derechos y deberes empleados
  13: [11],        // Régimen disciplinario
  // Bloque I: Procedimiento Administrativo
  14: [6],         // Ley 39/2015 disposiciones generales
  15: [14],        // Acto administrativo
  16: [14, 15],    // Procedimiento administrativo común
  17: [15, 16],    // Revisión de actos, recursos
  18: [14],        // Ley 40/2015 LRJSP
  // Bloque II: Ofimática
  19: [],          // Informática básica
  20: [19],        // Windows 11
  21: [19],        // Word 2019
  22: [19],        // Excel 2019
  23: [19],        // Access 2019
  24: [19],        // PowerPoint 2019
  25: [19],        // Outlook 2019
  26: [19],        // Internet y navegadores
  27: [14, 18],    // Administración electrónica
  28: []           // Protección de datos RGPD
};

export const TOPIC_SHORT_NAMES = {
  1: 'La Constitución',
  2: 'Derechos fundamentales',
  3: 'Corona y Cortes',
  4: 'Gobierno y Poder Judicial',
  5: 'Organización territorial',
  6: 'AGE Central',
  7: 'AGE Territorial',
  8: 'Comunidades Autónomas',
  9: 'Administración Local',
  10: 'Unión Europea',
  11: 'EBEP',
  12: 'Derechos empleados',
  13: 'Régimen disciplinario',
  14: 'Ley 39/2015',
  15: 'Acto administrativo',
  16: 'Procedimiento común',
  17: 'Recursos administrativos',
  18: 'Ley 40/2015 LRJSP',
  19: 'Informática básica',
  20: 'Windows 11',
  21: 'Word 2019',
  22: 'Excel 2019',
  23: 'Access 2019',
  24: 'PowerPoint 2019',
  25: 'Outlook 2019',
  26: 'Internet',
  27: 'Admin. electrónica',
  28: 'Protección de datos'
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
