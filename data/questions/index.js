/**
 * Oposita Smart - Sistema de Preguntas Escalable
 *
 * Este archivo centraliza todas las preguntas de los diferentes temas.
 * Para añadir más preguntas:
 * 1. Crea un nuevo archivo [categoria]-[nombre].js con el array de preguntas
 * 2. Importa el archivo aquí
 * 3. Añade las preguntas al array allQuestions
 *
 * IMPORTANTE: Este diseño evita dependencias circulares al mantener
 * los archivos de datos como módulos independientes sin importaciones cruzadas.
 *
 * CATEGORÍAS:
 * - CE: Constitución Española (topic: 1)
 * - L39: Ley 39/2015 Procedimiento Administrativo (topic: 3)
 * - EBEP: Estatuto Básico del Empleado Público (topic: 4)
 * - INF: Informática y TIC (topic: 5)
 * - LCSP: Ley de Contratos del Sector Público (topic: 6)
 * - LGP: Ley General Presupuestaria (topic: 6)
 * - FP: Función Pública (topic: 4)
 * - RD640: RD 640/1987 Pagos a justificar (topic: 6)
 */

// Importar preguntas por categoría con metadatos
import { ceQuestions } from './ce-constitucion.js';
import { l39Questions } from './l39-procedimiento.js';
import { ebepQuestions } from './ebep-empleados.js';
import { infQuestions } from './inf-informatica.js';
import { otrasLeyesQuestions } from './otras-leyes.js';

// Importar preguntas legacy (sin metadatos extendidos)
import { tema1Questions } from './tema1-constitucion.js';
import { tema2Questions } from './tema2-organizacion.js';

// Combinar todas las preguntas de todos los temas
export const allQuestions = [
  // Nuevas preguntas con metadatos para preparadores
  ...ceQuestions,
  ...l39Questions,
  ...ebepQuestions,
  ...infQuestions,
  ...otrasLeyesQuestions,
  // Preguntas legacy
  ...tema1Questions,
  ...tema2Questions,
];

// Información de los temas disponibles
export const topicsList = [
  { id: 1, title: "Constitución Española", icon: "📖", categoria: "CE" },
  { id: 2, title: "Organización del Estado", icon: "🏛️", categoria: "ORG" },
  { id: 3, title: "Procedimiento Administrativo", icon: "📋", categoria: "L39" },
  { id: 4, title: "Empleado Público (EBEP)", icon: "👔", categoria: "EBEP" },
  { id: 5, title: "Informática y TIC", icon: "💻", categoria: "INF" },
  { id: 6, title: "Otras Leyes (LCSP, LGP...)", icon: "📚", categoria: "OTRAS" }
];

// Información de categorías con metadatos
export const categoriesList = [
  { id: "CE", title: "Constitución Española", ley: "CE 1978", topic: 1 },
  { id: "L39", title: "Procedimiento Administrativo", ley: "Ley 39/2015", topic: 3 },
  { id: "EBEP", title: "Empleado Público", ley: "TREBEP", topic: 4 },
  { id: "INF", title: "Informática y TIC", ley: "Varios", topic: 5 },
  { id: "LCSP", title: "Contratos del Sector Público", ley: "Ley 9/2017", topic: 6 },
  { id: "LGP", title: "Ley General Presupuestaria", ley: "Ley 47/2003", topic: 6 },
  { id: "FP", title: "Función Pública", ley: "Ley 30/1984", topic: 4 },
  { id: "RD640", title: "Pagos a justificar", ley: "RD 640/1987", topic: 6 }
];

// Funciones de utilidad para trabajar con preguntas
export const getQuestionsByTopic = (topicId) => {
  return allQuestions.filter(q => q.topic === topicId);
};

export const getQuestionsByCategory = (categoria) => {
  return allQuestions.filter(q => q.categoria === categoria);
};

export const getRandomQuestions = (count = 5, topicId = null, categoria = null) => {
  let questions = allQuestions;

  if (categoria) {
    questions = getQuestionsByCategory(categoria);
  } else if (topicId) {
    questions = getQuestionsByTopic(topicId);
  }

  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const getTotalQuestionsByTopic = () => {
  const counts = {};
  allQuestions.forEach(q => {
    counts[q.topic] = (counts[q.topic] || 0) + 1;
  });
  return counts;
};

export const getTotalQuestionsByCategory = () => {
  const counts = {};
  allQuestions.forEach(q => {
    if (q.categoria) {
      counts[q.categoria] = (counts[q.categoria] || 0) + 1;
    }
  });
  return counts;
};

// Obtener preguntas por nivel de dificultad
export const getQuestionsByLevel = (nivel) => {
  return allQuestions.filter(q => q.nivel === nivel);
};

// Obtener preguntas por artículo de ley
export const getQuestionsByArticle = (ley, articulo) => {
  return allQuestions.filter(q => q.ley === ley && q.articulo === articulo);
};

// Export por defecto
export default {
  allQuestions,
  topicsList,
  categoriesList,
  getQuestionsByTopic,
  getQuestionsByCategory,
  getRandomQuestions,
  getTotalQuestionsByTopic,
  getTotalQuestionsByCategory,
  getQuestionsByLevel,
  getQuestionsByArticle
};
