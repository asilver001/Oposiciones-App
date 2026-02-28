import React, { useState } from 'react';
import { vitaShades, stumpShades } from '../data/shades';

/**
 * VITA Shade Selector Component
 * Visual color swatch grid for selecting tooth shades
 */

function ShadeSwatch({ shade, isSelected, onClick, size = 'normal' }) {
  const sizeClasses = {
    small: 'w-10 h-10 text-xs',
    normal: 'w-14 h-14 text-sm',
    large: 'w-16 h-16 text-base'
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        rounded-lg border-2 transition-all duration-200
        flex flex-col items-center justify-center
        hover:scale-110 hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500
        ${isSelected
          ? 'border-slate-900 ring-2 ring-slate-900 ring-offset-2 shadow-lg scale-105'
          : 'border-slate-200 hover:border-slate-400'
        }
      `}
      style={{ backgroundColor: shade.color }}
      title={shade.description}
    >
      <span
        className={`font-bold ${
          // Determine text color based on shade brightness
          shade.color && parseInt(shade.color.slice(1, 3), 16) > 200
            ? 'text-slate-700'
            : 'text-white'
        }`}
      >
        {shade.name}
      </span>
    </button>
  );
}

function ShadeFamily({ family, familyData, selectedShade, onSelect, size = 'normal' }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-semibold text-slate-700">{family}</span>
        <span className="text-xs text-slate-400">{familyData.name}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {familyData.shades.map(shade => (
          <ShadeSwatch
            key={shade.id}
            shade={shade}
            isSelected={selectedShade === shade.id}
            onClick={() => onSelect(shade.id)}
            size={size}
          />
        ))}
      </div>
    </div>
  );
}

export default function ShadeSelector({
  value,
  onChange,
  type = 'vita', // 'vita' or 'stump'
  size = 'normal',
  showPreview = true,
  label = 'Select Shade'
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const shades = type === 'vita' ? vitaShades : null;
  const flatShades = type === 'stump' ? stumpShades : null;

  // Get selected shade details
  const getSelectedShade = () => {
    if (type === 'vita') {
      for (const family of Object.values(vitaShades)) {
        const found = family.shades.find(s => s.id === value);
        if (found) return found;
      }
    } else {
      return stumpShades.find(s => s.id === value);
    }
    return null;
  };

  const selectedShade = getSelectedShade();

  if (type === 'stump') {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
        <div className="flex flex-wrap gap-3">
          {stumpShades.map(shade => (
            <button
              key={shade.id}
              onClick={() => onChange(shade.id)}
              className={`
                px-4 py-2 rounded-lg border-2 transition-all duration-200
                flex items-center gap-2
                ${value === shade.id
                  ? 'border-slate-900 bg-slate-50 shadow-md'
                  : 'border-slate-200 hover:border-slate-400'
                }
              `}
            >
              <div
                className="w-5 h-5 rounded-full border border-slate-300"
                style={{ backgroundColor: shade.color }}
              />
              <span className="text-sm font-medium text-slate-700">{shade.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Compact mode with expandable grid
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>

      {/* Selected shade preview / trigger */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          w-full p-3 rounded-xl border-2 transition-all duration-200
          flex items-center justify-between
          ${isExpanded ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-400'}
        `}
      >
        <div className="flex items-center gap-3">
          {selectedShade ? (
            <>
              <div
                className="w-10 h-10 rounded-lg border-2 border-slate-300 shadow-inner"
                style={{ backgroundColor: selectedShade.color }}
              />
              <div className="text-left">
                <p className="font-semibold text-slate-800">{selectedShade.id}</p>
                <p className="text-xs text-slate-500">{selectedShade.description}</p>
              </div>
            </>
          ) : (
            <span className="text-slate-500">Click to select a shade</span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded shade grid */}
      {isExpanded && (
        <div className="mt-3 p-4 bg-white rounded-xl border border-slate-200 shadow-lg animate-in slide-in-from-top-2 duration-200">
          {Object.entries(vitaShades).map(([family, familyData]) => (
            <ShadeFamily
              key={family}
              family={family}
              familyData={familyData}
              selectedShade={value}
              onSelect={(id) => {
                onChange(id);
                setIsExpanded(false);
              }}
              size={size}
            />
          ))}
        </div>
      )}

      {/* Full shade preview */}
      {showPreview && selectedShade && !isExpanded && (
        <div className="mt-3 flex items-center gap-4 p-3 bg-gradient-to-r from-slate-50 to-white rounded-lg border border-slate-100">
          <div
            className="w-16 h-16 rounded-xl shadow-md border border-slate-200"
            style={{ backgroundColor: selectedShade.color }}
          />
          <div>
            <p className="text-lg font-bold text-slate-800">{selectedShade.id}</p>
            <p className="text-sm text-slate-500">{selectedShade.description}</p>
            <button
              onClick={() => setIsExpanded(true)}
              className="text-xs text-sky-600 hover:text-sky-700 mt-1"
            >
              Change shade
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline shade display (read-only)
export function ShadeDisplay({ shadeId, size = 'small' }) {
  const getShade = () => {
    for (const family of Object.values(vitaShades)) {
      const found = family.shades.find(s => s.id === shadeId);
      if (found) return found;
    }
    const stump = stumpShades.find(s => s.id === shadeId);
    return stump || null;
  };

  const shade = getShade();
  if (!shade) return <span className="text-slate-400">-</span>;

  const sizeClasses = {
    small: 'w-6 h-6 text-[10px]',
    normal: 'w-8 h-8 text-xs',
    large: 'w-10 h-10 text-sm'
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeClasses[size]} rounded border border-slate-300 flex items-center justify-center font-bold`}
        style={{
          backgroundColor: shade.color,
          color: parseInt(shade.color.slice(1, 3), 16) > 200 ? '#334155' : '#ffffff'
        }}
      >
        {shade.id}
      </div>
    </div>
  );
}
