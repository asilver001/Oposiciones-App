/**
 * Temario data for C2 Auxiliar Administrativo AGE
 * 28 temas organized in 5 bloques with prerequisite dependencies
 */

import { TOPIC_PREREQUISITES, TOPIC_SHORT_NAMES } from '../../../data/topicPrerequisites';

// Full tema names — aligned with DB topics table (continuous 1-28)
const TEMA_FULL_NAMES = {
  // Bloque I: Organización Pública (T1-T16)
  1: 'La Constitución Española de 1978',
  2: 'Transparencia y buen gobierno (Ley 19/2013)',
  3: 'La Administración General del Estado',
  4: 'Organización territorial: CCAA y Administración local',
  5: 'La Unión Europea',
  6: 'Procedimiento administrativo (LPAC + LRJSP)',
  7: 'Protección de datos personales (LOPDGDD/RGPD)',
  8: 'Las Cortes Generales y el Defensor del Pueblo',
  9: 'Personal al servicio de las Administraciones Públicas',
  10: 'Derechos y deberes de los empleados públicos',
  11: 'El Poder Judicial',
  12: 'El presupuesto del Estado',
  13: 'Igualdad, violencia de género, discapacidad',
  14: 'El Tribunal Constitucional',
  15: 'El Gobierno y la Administración',
  16: 'Gobierno Abierto y Agenda 2030',
  // Bloque II: Actividad Administrativa y Ofimática (T17-T28)
  17: 'Atención al público',
  18: 'Servicios de información administrativa',
  19: 'Concepto de documento, registro y archivo',
  20: 'Administración electrónica y servicios al ciudadano',
  21: 'Informática básica',
  22: 'Introducción al sistema operativo Windows',
  23: 'El explorador de Windows',
  24: 'Procesadores de texto: Word',
  25: 'Hojas de cálculo: Excel',
  26: 'Bases de datos: Access',
  27: 'Correo electrónico: Outlook',
  28: 'Internet'
};

// Bloque assignments — sequential sub-groups within the 2 official bloques
export const BLOQUES = {
  constitucion: { name: 'Constitución y Marco Institucional', color: '#8b5cf6', temas: [1, 2, 3, 4, 5] },
  procedimiento: { name: 'Procedimiento y Organización', color: '#3b82f6', temas: [6, 7, 8, 9, 10] },
  poderes: { name: 'Poderes, Función Pública e Igualdad', color: '#f59e0b', temas: [11, 12, 13, 14, 15, 16] },
  atencion: { name: 'Atención al Ciudadano', color: '#06b6d4', temas: [17, 18, 19, 20] },
  ofimaticaBasica: { name: 'Ofimática Básica', color: '#10b981', temas: [21, 22, 23, 24] },
  ofimaticaAvanzada: { name: 'Ofimática Avanzada', color: '#ec4899', temas: [25, 26, 27, 28] }
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
