import React, { useState } from 'react';

/**
 * Interactive Dental Tooth Chart Component
 * Uses FDI (Federation Dentaire Internationale) notation
 * Upper Right: 11-18, Upper Left: 21-28
 * Lower Left: 31-38, Lower Right: 41-48
 */

// Tooth paths for SVG - anatomically shaped teeth
const toothPaths = {
  // Central Incisors (11, 21, 31, 41)
  central: "M10,0 C16,0 20,4 20,12 L20,35 C20,38 18,40 15,40 L5,40 C2,40 0,38 0,35 L0,12 C0,4 4,0 10,0",
  // Lateral Incisors (12, 22, 32, 42)
  lateral: "M9,0 C14,0 18,4 18,10 L18,32 C18,35 16,37 13,37 L5,37 C2,37 0,35 0,32 L0,10 C0,4 4,0 9,0",
  // Canines (13, 23, 33, 43)
  canine: "M10,0 C15,0 18,5 18,12 L17,38 C17,42 14,45 10,45 L10,45 C6,45 3,42 3,38 L2,12 C2,5 5,0 10,0",
  // First Premolars (14, 24, 34, 44)
  premolar1: "M11,0 C17,0 22,5 22,12 L22,32 C22,36 18,40 12,40 L10,40 C4,40 0,36 0,32 L0,12 C0,5 5,0 11,0",
  // Second Premolars (15, 25, 35, 45)
  premolar2: "M11,0 C17,0 22,5 22,12 L22,32 C22,36 18,40 12,40 L10,40 C4,40 0,36 0,32 L0,12 C0,5 5,0 11,0",
  // First Molars (16, 26, 36, 46)
  molar1: "M14,0 C22,0 28,6 28,14 L28,34 C28,40 22,46 14,46 L14,46 C6,46 0,40 0,34 L0,14 C0,6 6,0 14,0",
  // Second Molars (17, 27, 37, 47)
  molar2: "M13,0 C20,0 26,6 26,13 L26,32 C26,38 20,44 13,44 L13,44 C6,44 0,38 0,32 L0,13 C0,6 6,0 13,0",
  // Third Molars / Wisdom (18, 28, 38, 48)
  molar3: "M11,0 C17,0 22,5 22,11 L22,28 C22,34 17,39 11,39 L11,39 C5,39 0,34 0,28 L0,11 C0,5 5,0 11,0"
};

// Get tooth shape based on number
const getToothPath = (number) => {
  const lastDigit = number % 10;
  switch (lastDigit) {
    case 1: return toothPaths.central;
    case 2: return toothPaths.lateral;
    case 3: return toothPaths.canine;
    case 4: return toothPaths.premolar1;
    case 5: return toothPaths.premolar2;
    case 6: return toothPaths.molar1;
    case 7: return toothPaths.molar2;
    case 8: return toothPaths.molar3;
    default: return toothPaths.molar1;
  }
};

// Get tooth width for positioning
const getToothWidth = (number) => {
  const lastDigit = number % 10;
  switch (lastDigit) {
    case 1: return 22;
    case 2: return 20;
    case 3: return 20;
    case 4: return 24;
    case 5: return 24;
    case 6: return 30;
    case 7: return 28;
    case 8: return 24;
    default: return 24;
  }
};

// Calculate tooth positions for arch layout
const calculateToothPositions = (quadrant) => {
  const positions = [];
  const startNum = quadrant * 10;
  const spacing = 3;

  let currentX = 0;
  for (let i = 8; i >= 1; i--) {
    const toothNum = startNum + i;
    const width = getToothWidth(toothNum);
    positions.push({
      number: toothNum,
      x: currentX,
      width
    });
    currentX += width + spacing;
  }

  return positions;
};

// Individual Tooth Component
function Tooth({
  number,
  x,
  y,
  selected,
  type,
  onClick,
  isUpper,
  disabled
}) {
  const [isHovered, setIsHovered] = useState(false);
  const path = getToothPath(number);
  const width = getToothWidth(number);

  // Determine fill color based on state
  let fillColor = '#f8fafc'; // Default light
  let strokeColor = '#cbd5e1'; // Default border

  if (selected) {
    if (type === 'abutment') {
      fillColor = '#10b981'; // Emerald for abutment
      strokeColor = '#059669';
    } else if (type === 'pontic') {
      fillColor = '#3b82f6'; // Blue for pontic
      strokeColor = '#2563eb';
    } else {
      fillColor = '#10b981';
      strokeColor = '#059669';
    }
  } else if (isHovered && !disabled) {
    fillColor = '#e0f2fe';
    strokeColor = '#0ea5e9';
  }

  return (
    <g
      transform={`translate(${x}, ${y}) ${isUpper ? '' : 'scale(1, -1) translate(0, -48)'}`}
      onClick={() => !disabled && onClick(number)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: disabled ? 'default' : 'pointer' }}
      className="transition-all duration-200"
    >
      <path
        d={path}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="2"
        className="transition-all duration-200"
        style={{
          transform: isHovered && !disabled ? 'scale(1.08)' : 'scale(1)',
          transformOrigin: 'center'
        }}
      />
      {/* Tooth number label */}
      <text
        x={width / 2}
        y={isUpper ? 55 : -8}
        textAnchor="middle"
        fontSize="10"
        fontWeight="600"
        fill={selected ? '#0f172a' : '#64748b'}
        style={{ transform: isUpper ? '' : 'scale(1, -1)', transformOrigin: `${width / 2}px ${isUpper ? 55 : -8}px` }}
      >
        {number}
      </text>
    </g>
  );
}

// Main ToothChart Component
export default function ToothChart({
  selectedTeeth = [],
  onTeethChange,
  mode = 'single', // 'single', 'multiple', 'bridge'
  showLegend = true,
  disabled = false,
  size = 'normal' // 'small', 'normal', 'large'
}) {
  const [hoverTooth, setHoverTooth] = useState(null);

  // Scale based on size
  const scale = size === 'small' ? 0.6 : size === 'large' ? 1.2 : 1;
  const viewBoxWidth = 580;
  const viewBoxHeight = 280;

  // Calculate positions for all quadrants
  const quadrant1 = calculateToothPositions(1); // Upper right
  const quadrant2 = calculateToothPositions(2); // Upper left
  const quadrant3 = calculateToothPositions(3); // Lower left
  const quadrant4 = calculateToothPositions(4); // Lower right

  // Handle tooth click
  const handleToothClick = (number) => {
    if (disabled) return;

    const existing = selectedTeeth.find(t => t.number === number);

    if (existing) {
      // Cycle through: abutment -> pontic -> deselect
      if (mode === 'bridge') {
        if (existing.type === 'abutment') {
          onTeethChange(selectedTeeth.map(t =>
            t.number === number ? { ...t, type: 'pontic' } : t
          ));
        } else {
          onTeethChange(selectedTeeth.filter(t => t.number !== number));
        }
      } else {
        onTeethChange(selectedTeeth.filter(t => t.number !== number));
      }
    } else {
      if (mode === 'single') {
        onTeethChange([{ number, type: 'abutment' }]);
      } else {
        onTeethChange([...selectedTeeth, { number, type: 'abutment' }]);
      }
    }
  };

  // Get selected tooth info
  const getToothType = (number) => {
    const tooth = selectedTeeth.find(t => t.number === number);
    return tooth?.type || null;
  };

  // Render arch
  const renderArch = (quadrantLeft, quadrantRight, isUpper, yOffset) => {
    // Combine quadrants for full arch (right to left for upper, left to right for lower)
    const leftPositions = [...quadrantLeft].reverse();
    const rightPositions = quadrantRight;

    let totalWidth = 0;
    const allTeeth = [];

    // Right side (from center going right)
    rightPositions.forEach((pos, idx) => {
      allTeeth.push({
        ...pos,
        x: viewBoxWidth / 2 + totalWidth + 10,
        y: yOffset
      });
      totalWidth += pos.width + 3;
    });

    totalWidth = 0;
    // Left side (from center going left)
    leftPositions.forEach((pos, idx) => {
      totalWidth += pos.width + 3;
      allTeeth.push({
        ...pos,
        x: viewBoxWidth / 2 - totalWidth - 10,
        y: yOffset
      });
    });

    return allTeeth.map(tooth => (
      <Tooth
        key={tooth.number}
        number={tooth.number}
        x={tooth.x}
        y={tooth.y}
        selected={selectedTeeth.some(t => t.number === tooth.number)}
        type={getToothType(tooth.number)}
        onClick={handleToothClick}
        isUpper={isUpper}
        disabled={disabled}
      />
    ));
  };

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full h-auto"
        style={{ maxHeight: 300 * scale }}
      >
        {/* Background with subtle gradient */}
        <defs>
          <linearGradient id="archBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </linearGradient>
        </defs>

        {/* Arch labels */}
        <text x={viewBoxWidth / 2} y="20" textAnchor="middle" fontSize="12" fill="#64748b" fontWeight="500">
          UPPER ARCH
        </text>
        <text x={viewBoxWidth / 2} y={viewBoxHeight - 8} textAnchor="middle" fontSize="12" fill="#64748b" fontWeight="500">
          LOWER ARCH
        </text>

        {/* Center line */}
        <line
          x1={viewBoxWidth / 2}
          y1="30"
          x2={viewBoxWidth / 2}
          y2={viewBoxHeight - 20}
          stroke="#e2e8f0"
          strokeWidth="1"
          strokeDasharray="4,4"
        />

        {/* Right/Left labels */}
        <text x="15" y={viewBoxHeight / 2} fontSize="10" fill="#94a3b8" fontWeight="500">
          RIGHT
        </text>
        <text x={viewBoxWidth - 30} y={viewBoxHeight / 2} fontSize="10" fill="#94a3b8" fontWeight="500">
          LEFT
        </text>

        {/* Upper arch */}
        <g transform="translate(0, 30)">
          {renderArch(quadrant2, quadrant1, true, 10)}
        </g>

        {/* Lower arch */}
        <g transform="translate(0, 150)">
          {renderArch(quadrant3, quadrant4, false, 50)}
        </g>
      </svg>

      {/* Legend */}
      {showLegend && mode === 'bridge' && (
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-emerald-500"></div>
            <span className="text-slate-600">Abutment</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500"></div>
            <span className="text-slate-600">Pontic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-slate-300 bg-slate-50"></div>
            <span className="text-slate-600">Not selected</span>
          </div>
        </div>
      )}

      {/* Selected teeth summary */}
      {selectedTeeth.length > 0 && (
        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600">
            <span className="font-medium">Selected teeth:</span>{' '}
            {selectedTeeth.map(t => (
              <span
                key={t.number}
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mr-1 ${
                  t.type === 'pontic'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {t.number}
                {mode === 'bridge' && <span className="ml-1 opacity-70">({t.type})</span>}
              </span>
            ))}
          </p>
        </div>
      )}
    </div>
  );
}
