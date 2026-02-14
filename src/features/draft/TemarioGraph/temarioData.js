/**
 * Temario data for C2 Auxiliar Administrativo AGE
 * 28 temas organized in 5 bloques with prerequisite dependencies
 */

import { TOPIC_PREREQUISITES, TOPIC_SHORT_NAMES } from '../../../data/topicPrerequisites';

// Full tema names from MASTER_OPOSICIONES
const TEMA_FULL_NAMES = {
  1: 'La Constitución Española de 1978',
  2: 'Derechos y deberes fundamentales',
  3: 'La Corona. Las Cortes Generales',
  4: 'El Gobierno y la Administración. El Poder Judicial. El Tribunal Constitucional',
  5: 'Organización territorial del Estado',
  6: 'La Administración General del Estado',
  7: 'La AGE: Órganos territoriales y en el exterior',
  8: 'Las Comunidades Autónomas',
  9: 'La Administración Local',
  10: 'La Unión Europea',
  11: 'Personal al servicio de las AAPP. El EBEP',
  12: 'Derechos y deberes de los empleados públicos',
  13: 'Régimen disciplinario',
  14: 'Ley 39/2015: Disposiciones generales',
  15: 'El acto administrativo',
  16: 'Procedimiento administrativo común',
  17: 'Revisión de actos. Recursos administrativos',
  18: 'Ley 40/2015: Régimen Jurídico del Sector Público',
  19: 'Informática básica: conceptos fundamentales',
  20: 'Windows 11',
  21: 'Word 2019',
  22: 'Excel 2019',
  23: 'Access 2019',
  24: 'PowerPoint 2019',
  25: 'Outlook 2019',
  26: 'Internet y navegadores web',
  27: 'Administración electrónica',
  28: 'Protección de datos personales (RGPD)'
};

// Bloque assignments
export const BLOQUES = {
  constitucion: { name: 'Constitución Española', color: '#8b5cf6', temas: [1, 2, 3, 4, 5] },
  organizacion: { name: 'Organización Administrativa', color: '#3b82f6', temas: [6, 7, 8, 9, 10] },
  funcion: { name: 'Función Pública', color: '#10b981', temas: [11, 12, 13] },
  procedimiento: { name: 'Procedimiento Administrativo', color: '#f59e0b', temas: [14, 15, 16, 17, 18] },
  ofimatica: { name: 'Ofimática', color: '#ec4899', temas: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28] }
};

function getBloqueForTema(temaNum) {
  for (const [key, bloque] of Object.entries(BLOQUES)) {
    if (bloque.temas.includes(temaNum)) return key;
  }
  return 'ofimatica';
}

/**
 * Generate temario nodes for visualization
 * @param {Object} userProgress - Map of topicNum -> { accuracy, sessions, answered, ... }
 * @param {Object} questionCounts - Map of topicNum -> number of questions
 */
export function getTemarioNodes(userProgress = {}, questionCounts = {}) {
  return Object.keys(TOPIC_PREREQUISITES).map(Number).map(num => {
    const bloque = getBloqueForTema(num);
    const progress = userProgress[num] || {};
    const accuracy = progress.accuracy || 0;
    const sessions = progress.sessionsCompleted || 0;

    let status = 'nuevo';
    if (sessions === 0) status = 'nuevo';
    else if (accuracy >= 80) status = 'dominado';
    else if (accuracy >= 60) status = 'avanzando';
    else if (accuracy < 50 && sessions > 0) status = 'riesgo';
    else status = 'progreso';

    return {
      id: num,
      name: TEMA_FULL_NAMES[num] || `Tema ${num}`,
      shortName: TOPIC_SHORT_NAMES[num] || `T${num}`,
      label: `T${num}`,
      bloque,
      bloqueColor: BLOQUES[bloque].color,
      bloqueLabel: BLOQUES[bloque].name,
      dependencies: TOPIC_PREREQUISITES[num] || [],
      questionCount: questionCounts[num] || 0,
      accuracy,
      sessions,
      status,
      answered: progress.answered || 0
    };
  });
}

/**
 * Generate links from prerequisites
 */
export function getTemarioLinks() {
  const links = [];
  for (const [target, deps] of Object.entries(TOPIC_PREREQUISITES)) {
    for (const source of deps) {
      links.push({ source, target: Number(target) });
    }
  }
  return links;
}

/**
 * Get graph data in { nodes, links } format for ForceGraph
 */
export function getTemarioGraphData(userProgress = {}, questionCounts = {}) {
  return {
    nodes: getTemarioNodes(userProgress, questionCounts),
    links: getTemarioLinks()
  };
}

export const STATUS_COLORS = {
  dominado: '#10b981',
  avanzando: '#3b82f6',
  progreso: '#a855f7',
  nuevo: '#4b5563',
  riesgo: '#f59e0b',
  locked: '#1f2937'
};
