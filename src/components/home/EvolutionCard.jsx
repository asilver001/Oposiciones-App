import React from 'react';
import { ChevronRight, TrendingUp } from 'lucide-react';

// Componente de gráfico SVG simple para mostrar retención
const RetentionChart = ({ data, height = 80 }) => {
  if (!data || data.length < 2) {
    return (
      <div className="flex items-center justify-center h-20 text-gray-400 text-sm">
        Aún no hay datos suficientes
      </div>
    );
  }

  const width = 280;
  const padding = 10;
  const maxRetention = 100;

  // Calcular puntos del gráfico
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((d.retention || 0) / maxRetention) * (height - 2 * padding);
    return { x, y, retention: d.retention };
  });

  const pointsString = points.map(p => `${p.x},${p.y}`).join(' ');
  const areaPoints = `${padding},${height - padding} ${pointsString} ${width - padding},${height - padding}`;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      {/* Gradiente de fondo */}
      <defs>
        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Líneas de referencia horizontales */}
      <line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        stroke="#E5E7EB"
        strokeWidth="1"
      />
      <line
        x1={padding}
        y1={height / 2}
        x2={width - padding}
        y2={height / 2}
        stroke="#E5E7EB"
        strokeWidth="1"
        strokeDasharray="4 4"
      />

      {/* Área bajo la curva */}
      <polygon
        points={areaPoints}
        fill="url(#chartGradient)"
      />

      {/* Línea de retención */}
      <polyline
        points={pointsString}
        fill="none"
        stroke="#8B5CF6"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Punto final destacado */}
      {points.length > 0 && (
        <circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r="4"
          fill="white"
          stroke="#8B5CF6"
          strokeWidth="2"
        />
      )}

      {/* Etiquetas */}
      <text x={padding} y={height - 2} className="text-[10px] fill-gray-400">
        Inicio
      </text>
      <text x={width - padding - 20} y={height - 2} className="text-[10px] fill-gray-400">
        Hoy
      </text>
    </svg>
  );
};

// Componente principal de la tarjeta de Evolución
const EvolutionCard = ({ retentionHistory, metrics, onViewMore }) => {
  const currentRetention = metrics?.overallRetention || 0;
  const retentionChange = metrics?.retentionChange || 0;
  const passProbability = metrics?.estimatedPassProbability || 0;

  // Generar datos mock si no hay historial real
  const chartData = retentionHistory?.length > 0
    ? retentionHistory
    : generateMockRetentionData(currentRetention);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          📈 TU EVOLUCIÓN
        </h3>
        <button
          onClick={onViewMore}
          className="text-purple-600 text-sm font-semibold flex items-center gap-1 hover:text-purple-700 transition"
        >
          Ver más
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Gráfico */}
      <div className="mb-4">
        <RetentionChart data={chartData} height={80} />
      </div>

      {/* Métricas */}
      <div className="flex items-center justify-center gap-6 text-sm flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">📊 Retención:</span>
          <span className="font-bold text-gray-900">{currentRetention}%</span>
          {retentionChange !== 0 && (
            <span className={`text-xs font-semibold ${
              retentionChange > 0 ? 'text-green-600' : 'text-red-500'
            }`}>
              {retentionChange > 0 ? '+' : ''}{retentionChange}%
            </span>
          )}
        </div>

        <span className="text-gray-300">•</span>

        <div className="flex items-center gap-2">
          <span className="text-gray-500">🎯 Prob. corte:</span>
          <span className="font-bold text-gray-900">~{passProbability}%</span>
        </div>
      </div>
    </div>
  );
};

// Generar datos mock de retención para demostración
const generateMockRetentionData = (currentRetention) => {
  const data = [];
  const points = 7;
  const startRetention = Math.max(30, currentRetention - 25);

  for (let i = 0; i < points; i++) {
    const progress = i / (points - 1);
    const retention = startRetention + (currentRetention - startRetention) * progress;
    data.push({
      date: new Date(Date.now() - (points - 1 - i) * 24 * 60 * 60 * 1000).toISOString(),
      retention: Math.round(retention + (Math.random() - 0.5) * 5)
    });
  }

  // Asegurar que el último punto sea el valor actual
  data[data.length - 1].retention = currentRetention;

  return data;
};

export default EvolutionCard;
