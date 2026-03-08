/**
 * RecipeSwitcherDemo - Demo of all design token recipes
 *
 * Shows all available recipes with live preview.
 */

import { motion } from 'framer-motion';
import { Check, Palette, Sun, Moon, Leaf, Briefcase, Heart } from 'lucide-react';
import { useTheme } from '../../styles/ThemeContext';
import SessionCard from '../home/SessionCard';
import StatsRow, { defaultStats } from '../home/StatsRow';
import WeeklyProgress from '../home/WeeklyProgress';
import { FortressPreviewLinear } from '../home/FortressPreview';

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
  current: 'Verde + blanco, redondeado, denso',
  minimal: 'Monocromático, limpio, espacioso',
  warm: 'Terroso, suave, amigable',
  dark: 'Modo oscuro, verde vibrante',
  tool: 'Estilo Notion/Linear, serio, preciso',
  wellness: 'Cálido, calma, estilo journaling',
  darkStudy: 'Modo noche, verde luminoso',
};

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
                className="relative p-4 rounded-xl border-2 text-left transition-all"
                style={{
                  borderColor: isActive ? 'var(--color-brand-600)' : '#e5e7eb',
                  backgroundColor: isActive ? 'var(--color-brand-50)' : '#ffffff',
                }}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div
                    className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-brand-600)' }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                )}
                <Icon
                  className="w-5 h-5 mb-2"
                  style={{ color: isActive ? 'var(--color-brand-600)' : '#9ca3af' }}
                />
                <p
                  className="font-semibold text-sm"
                  style={{ color: isActive ? 'var(--color-brand-600)' : '#111827' }}
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
            Feature color: verde (#2D6A4F) para progreso y acentos
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
              Tu sesión de hoy
            </p>
            <SessionCard
              title="Continuar estudio"
              subtitle="Constitución Española"
              duration="10 min"
              questionsReady={8}
              onClick={() => {}}
            />
          </div>

          {/* Stats (after session card) */}
          <div>
            <p
              className="text-xs font-medium mb-2 uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}
            >
              Stats (fondo gris, sin líneas)
            </p>
            <StatsRow stats={defaultStats} />
          </div>

          {/* Weekly Progress */}
          <div>
            <p
              className="text-xs font-medium mb-2 uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}
            >
              Progreso Semanal (barra verde)
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
              Temas (barras de progreso verdes)
            </p>
            <div className="card">
              <FortressPreviewLinear topics={demoTopics} maxVisible={3} />
            </div>
          </div>
        </div>
      </section>

      {/* Color System */}
      <section className="card">
        <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Sistema de Color
        </h4>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          Verde (#2D6A4F) como feature color. Reduce fatiga visual y representa "avance".
        </p>

        {/* Brand/Progress colors */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Feature Color (Verde)</p>
          <div className="flex gap-1">
            {[50, 100, 200, 300, 400, 500, 600, 700].map((shade) => (
              <div
                key={shade}
                className="flex-1 h-8 first:rounded-l-lg last:rounded-r-lg"
                style={{ backgroundColor: `var(--color-brand-${shade})` }}
                title={`brand-${shade}`}
              />
            ))}
          </div>
        </div>

        {/* Progress bar demo */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Progress Bar (gradiente verde)</p>
          <div
            className="h-3 rounded-full overflow-hidden"
            style={{ backgroundColor: 'var(--progress-track)' }}
          >
            <div
              className="h-full w-3/4 rounded-full"
              style={{
                background: 'linear-gradient(90deg, var(--progress-gradient-start), var(--progress-gradient-end))',
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
