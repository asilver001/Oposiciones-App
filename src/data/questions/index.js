/**
 * Oposita Smart - Sistema de Preguntas Escalable
 *
 * Este archivo centraliza todas las preguntas de los diferentes temas.
 * Para añadir más preguntas:
 * 1. Crea un nuevo archivo tema[N]-[nombre].js con el array de preguntas
 * 2. Importa el archivo aquí
 * 3. Añade las preguntas al array allQuestions
 *
 * IMPORTANTE: Este diseño evita dependencias circulares al mantener
 * los archivos de datos como módulos independientes sin importaciones cruzadas.
 */

import { tema1Questions } from './tema1-constitucion.js';
import { tema2Questions } from './tema2-organizacion.js';

// Combinar todas las preguntas de todos los temas
export const allQuestions = [
  ...tema1Questions,
  ...tema2Questions,
];

// Información de los temas disponibles
export const topicsList = [
  { id: 1, title: "Constitución Española", icon: "📖" },
  { id: 2, title: "Organización del Estado", icon: "🏛️" },
  { id: 3, title: "Derecho Administrativo", icon: "⚖️" },
  { id: 4, title: "Administración Pública", icon: "🏢" }
];

// Funciones de utilidad para trabajar con preguntas
export const getQuestionsByTopic = (topicId) => {
  return allQuestions.filter(q => q.topic === topicId);
};

export const getRandomQuestions = (count = 5, topicId = null) => {
  let questions = topicId ? getQuestionsByTopic(topicId) : allQuestions;
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

// Export por defecto
export default {
  allQuestions,
  topicsList,
  getQuestionsByTopic,
  getRandomQuestions,
  getTotalQuestionsByTopic
};
