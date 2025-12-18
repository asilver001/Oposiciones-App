import React from 'react';
import { ChevronRight } from 'lucide-react';
import { getTopicStatus, safeParseDate } from '../../utils/fortressLogic';

// Componente para mostrar los bloques de fortaleza de un tema
const TopicFortress = ({ topic }) => {
  const blocks = Array(6).fill(null).map((_, index) => {
    const isFilled = index < topic.strengthLevel;
    return (
      <div
        key={index}
        className={`w-3 h-6 rounded-sm transition-all duration-300 ${
          isFilled
            ? 'bg-gradient-to-t from-purple-600 to-indigo-500'
            : 'bg-gray-200'
        }`}
      />
    );
  });

  const status = getTopicStatus(topic.strengthLevel);

  return (
    <div className="flex-1 text-center">
      <div className="flex gap-0.5 justify-center mb-2">
        {blocks}
      </div>
      <div className="text-xs font-semibold text-gray-700 mb-0.5 truncate">
        {topic.topicShortName}
      </div>
      <div className={`text-[10px] font-bold uppercase ${
        status.color === 'green' ? 'text-green-600' :
        status.color === 'yellow' ? 'text-amber-500' :
        status.color === 'red' ? 'text-red-500' :
        'text-gray-400'
      }`}>
        {status.text}
      </div>
    </div>
  );
};

// Componente de alerta para temas que necesitan atención
const FortressAlert = ({ topics }) => {
  const decliningTopics = Object.values(topics || {}).filter(t => {
    if (!t.lastStudiedAt || t.strengthLevel === 0) return false;
    const lastStudied = safeParseDate(t.lastStudiedAt);
    if (!lastStudied) return false;
    const hoursSinceStudy = (Date.now() - lastStudied) / (1000 * 60 * 60);
    return hoursSinceStudy > 24;
  });

  if (decliningTopics.length === 0) return null;

  const mostUrgent = decliningTopics.sort((a, b) => {
    const dateA = safeParseDate(a.nextDecayAt);
    const dateB = safeParseDate(b.nextDecayAt);
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    return dateA - dateB;
  })[0];

  if (!mostUrgent?.nextDecayAt) return null;

  const decayDate = safeParseDate(mostUrgent.nextDecayAt);
  if (!decayDate) return null;

  const hoursUntilDecay = Math.max(0,
    (decayDate - Date.now()) / (1000 * 60 * 60)
  );

  let alertText = '';
  let alertClass = '';

  if (hoursUntilDecay < 24) {
    alertText = `${mostUrgent.topicShortName} perderá otro bloque mañana`;
    alertClass = 'bg-amber-50 text-amber-700 border-amber-200';
  } else {
    alertText = `Refuerza ${mostUrgent.topicShortName} para mantener tu nivel`;
    alertClass = 'bg-blue-50 text-blue-700 border-blue-200';
  }

  return (
    <div className={`mt-4 p-3 rounded-lg text-sm text-center border ${alertClass}`}>
      {hoursUntilDecay < 24 ? '⚠️' : '💡'} {alertText}
    </div>
  );
};

// Componente principal de la tarjeta de Fortaleza
const FortressCard = ({ fortressData, onViewMore }) => {
  // Obtener los 3 temas más relevantes (con actividad o los primeros)
  const topicsArray = Object.values(fortressData || {});

  const sortedTopics = topicsArray
    .sort((a, b) => {
      // Primero los que tienen fortaleza > 0
      if (a.strengthLevel !== b.strengthLevel) {
        return b.strengthLevel - a.strengthLevel;
      }
      // Luego por última sesión de estudio
      if (a.lastStudiedAt && b.lastStudiedAt) {
        const dateA = safeParseDate(a.lastStudiedAt);
        const dateB = safeParseDate(b.lastStudiedAt);
        if (dateA && dateB) {
          return dateB - dateA;
        }
      }
      return a.topicId - b.topicId;
    })
    .slice(0, 3);

  // Si no hay datos, mostrar estado vacío
  if (sortedTopics.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            🏰 TU FORTALEZA
          </h3>
        </div>
        <div className="text-center py-6">
          <div className="text-4xl mb-3">🏗️</div>
          <p className="text-gray-600 text-sm">
            Completa tu primer test para empezar a construir tu fortaleza
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          🏰 TU FORTALEZA
        </h3>
        <button
          onClick={onViewMore}
          className="text-purple-600 text-sm font-semibold flex items-center gap-1 hover:text-purple-700 transition"
        >
          Ver más
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid de fortalezas */}
      <div className="flex justify-between gap-4 mb-2">
        {sortedTopics.map((topic) => (
          <TopicFortress key={topic.topicId} topic={topic} />
        ))}
      </div>

      {/* Alerta de decaimiento */}
      <FortressAlert topics={fortressData} />
    </div>
  );
};

export default FortressCard;
