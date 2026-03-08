/**
 * RecipeSwitcherDemo - Demo of all design token recipes
 *
 * Shows all available recipes with live preview.
 */

import { motion } from 'framer-motion';
import { Check, Palette, Sun, Moon, Leaf, Briefcase, Heart } from 'lucide-react';
import { useTheme } from '../../styles/ThemeContext';
import SessionCard from '../home/SessionCard';
import StatsRow from '../home/StatsRow';
import WeeklyProgress from '../home/WeeklyProgress';
import FortressPreview from '../home/FortressPreview';

const recipeIcons = {
  current: Palette,
  minimal: Sun,
  warm: Leaf,
  dark: Moon,
  tool: Briefcase,
  wellness: Heart,
  darkStudy: Moon,
};

const recipeDescriptions = {
  current: 'Púrpura vibrante, redondeado, denso',
  minimal: 'Monocromático, limpio, espacioso',
  warm: 'Terroso, suave, amigable',
  dark: 'Modo oscuro, acentos vibrantes',
  tool: 'Estilo Notion/Linear, serio, preciso',
  wellness: 'Cálido, calma, estilo journaling',
  darkStudy: 'Modo noche, verde luminoso',
};

// Demo data
const demoStats = [
  { value: 247, label: 'Preguntas' },
  { value: '82%', label: 'Precisión' },
  { value: 15, label: 'Racha' },
  { value: 4, label: 'Horas' },
];

const demoTopics = [
  { id: 1, name: 'Constitución Española', progress: 78 },
  { id: 2, name: 'Ley 39/2015 LPAC', progress: 45 },
  { id: 3, name: 'Ley 40/2015 LRJSP', progress: 22 },
];

export default function RecipeSwitcherDemo() {
  const { recipeName, setRecipe, recipes } = useTheme();

  return (
    <div className="space-y-8 pb-8">
      {/* Recipe Selector */}
      <section>
        <h3 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">
          Seleccionar Receta
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(recipes).map(([key, recipe]) => {
            const isActive = recipeName === key;
            const Icon = recipeIcons[key] || Palette;

            return (
              <motion.button
                key={key}
                onClick={() => setRecipe(key)}
                className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                  isActive
                    ? 'border-brand-600 bg-brand-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div
                    className="absolute top-2 right-2 w-5 h-5 bg-brand-600 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                )}
                <Icon
                  className={`w-5 h-5 mb-2 ${isActive ? 'text-brand-600' : 'text-gray-400'}`}
                />
                <p
                  className={`font-semibold text-sm ${isActive ? 'text-brand-600' : 'text-gray-900'}`}
                >
                  {recipe.label}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{recipeDescriptions[key]}</p>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Live Preview */}
      <section
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: 'var(--surface-primary)',
          border: '1px solid var(--border-default)',
        }}
      >
        <div className="p-4 border-b" style={{ borderColor: 'var(--border-default)' }}>
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            Vista Previa: {recipes[recipeName]?.label}
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Así se verá tu app con esta receta
          </p>
        </div>

        {/* Preview container with recipe styles */}
        <div className="p-4 space-y-6" style={{ backgroundColor: 'var(--surface-secondary)' }}>
          {/* Session Card */}
          <div>
            <p
              className="text-xs font-medium mb-2 uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}
            >
              Session Card
            </p>
            <SessionCard
              title="Continuar estudio"
              subtitle="Constitución Española"
              duration="10 min"
              questionsReady={8}
              onClick={() => {}}
            />
          </div>

          {/* Stats */}
          <div>
            <p
              className="text-xs font-medium mb-2 uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}
            >
              Stats
            </p>
            <div className="card">
              <StatsRow stats={demoStats} />
            </div>
          </div>

          {/* Weekly Progress */}
          <div>
            <p
              className="text-xs font-medium mb-2 uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}
            >
              Progreso Semanal
            </p>
            <div className="card">
              <WeeklyProgress current={5} goal={7} />
            </div>
          </div>

          {/* Topics */}
          <div>
            <p
              className="text-xs font-medium mb-2 uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}
            >
              Temas
            </p>
            <div className="card">
              <FortressPreview topics={demoTopics} maxVisible={3} />
            </div>
          </div>
        </div>
      </section>

      {/* Current Recipe Info */}
      <section className="card">
        <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Receta Activa: {recipes[recipeName]?.label}
        </h4>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          Los estilos se aplican automáticamente a toda la app via CSS custom properties.
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--surface-tertiary)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Fuente Display:</span>
            <br />
            <span
              style={{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
              }}
            >
              {recipes[recipeName]?.fontFamily?.display || 'Inter'}
            </span>
          </div>
          <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--surface-tertiary)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Brand Color:</span>
            <br />
            <div className="flex items-center gap-2 mt-1">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: 'var(--color-brand-600)' }}
              />
              <span style={{ color: 'var(--text-primary)' }}>
                {recipes[recipeName]?.colors?.brand?.[600] || '#9333ea'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Color Swatches */}
      <section>
        <h3
          className="text-xs font-medium mb-3 uppercase tracking-wider"
          style={{ color: 'var(--text-muted)' }}
        >
          Paleta de Colores
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {['surface-primary', 'surface-secondary', 'surface-tertiary', 'surface-inverse'].map(
            (name) => (
              <div key={name} className="text-center">
                <div
                  className="w-full h-10 rounded-lg border"
                  style={{
                    backgroundColor: `var(--${name})`,
                    borderColor: 'var(--border-default)',
                  }}
                />
                <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                  {name.split('-')[1]}
                </p>
              </div>
            )
          )}
        </div>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {['text-primary', 'text-secondary', 'text-muted', 'text-inverse'].map((name) => (
            <div key={name} className="text-center">
              <div
                className="w-full h-10 rounded-lg border flex items-center justify-center"
                style={{
                  backgroundColor:
                    name === 'text-inverse' ? 'var(--surface-inverse)' : 'var(--surface-primary)',
                  borderColor: 'var(--border-default)',
                }}
              >
                <span
                  className="text-sm font-semibold"
                  style={{ color: `var(--${name})` }}
                >
                  Aa
                </span>
              </div>
              <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                {name.split('-')[1]}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
