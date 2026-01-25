/**
 * RecursosPage - Biblioteca de Recursos para OpositaSmart
 *
 * 6 categorias expandibles:
 * 1. Legislacion - BOE, leyes, reglamentos
 * 2. Esquemas - Resumenes visuales, mapas mentales
 * 3. Simulacros - Acceso a examenes de practica
 * 4. Tips de Estudio - Tecnicas y consejos
 * 5. Glosario - Terminos y definiciones clave
 * 6. Enlaces Utiles - Recursos externos
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale, BookOpen, Target, Lightbulb, BookMarked, ExternalLink,
  ChevronDown, ChevronRight, Heart, Search, X, Sparkles, Clock
} from 'lucide-react';
import DevModeRandomizer from '../dev/DevModeRandomizer';
import { useAuth } from '../../contexts/AuthContext';

// Spring presets
const spring = {
  bouncy: { type: "spring", stiffness: 400, damping: 10 },
  snappy: { type: "spring", stiffness: 400, damping: 25 },
  gentle: { type: "spring", stiffness: 100, damping: 20 },
  smooth: { type: "spring", stiffness: 50, damping: 15 },
};

// Categories data
const categorias = [
  {
    id: 'legislacion',
    title: 'Legislacion',
    icon: Scale,
    emoji: '📚',
    description: 'BOE, leyes y reglamentos oficiales',
    gradient: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    recursos: [
      { id: 'ce', title: 'Constitucion Espanola 1978', subtitle: 'Texto consolidado BOE', url: 'https://www.boe.es/buscar/act.php?id=BOE-A-1978-31229', isExternal: true },
      { id: 'ley39', title: 'Ley 39/2015 - LPACAP', subtitle: 'Procedimiento Administrativo Comun', url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2015-10565', isExternal: true },
      { id: 'ley40', title: 'Ley 40/2015 - LRJSP', subtitle: 'Regimen Juridico Sector Publico', url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2015-10566', isExternal: true },
      { id: 'ebep', title: 'RDL 5/2015 - EBEP', subtitle: 'Estatuto Basico Empleado Publico', url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2015-11719', isExternal: true },
      { id: 'lgt', title: 'Ley 58/2003 - LGT', subtitle: 'Ley General Tributaria', url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2003-23186', isExternal: true },
    ]
  },
  {
    id: 'esquemas',
    title: 'Esquemas',
    icon: BookOpen,
    emoji: '📝',
    description: 'Resumenes visuales y mapas mentales',
    gradient: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
    recursos: [
      { id: 'esq-ce', title: 'Estructura de la Constitucion', subtitle: 'Preambulo, Titulo Preliminar, 10 Titulos', isNew: true },
      { id: 'esq-derechos', title: 'Derechos Fundamentales', subtitle: 'Arts. 14-29 - Seccion 1a Capitulo II', isNew: true },
      { id: 'esq-cortes', title: 'Las Cortes Generales', subtitle: 'Congreso, Senado, funciones', isNew: false },
      { id: 'esq-gobierno', title: 'El Gobierno', subtitle: 'Composicion, funciones, responsabilidad', isNew: false },
      { id: 'esq-proc', title: 'Procedimiento Administrativo', subtitle: 'Fases, plazos, recursos', isNew: true },
    ]
  },
  {
    id: 'simulacros',
    title: 'Simulacros',
    icon: Target,
    emoji: '🎯',
    description: 'Examenes de practica completos',
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    recursos: [
      { id: 'sim-conv2024', title: 'Simulacro Convocatoria 2024', subtitle: '100 preguntas - 90 min', isInternal: true, route: 'simulacro-2024' },
      { id: 'sim-rapido', title: 'Simulacro Rapido', subtitle: '30 preguntas - 25 min', isInternal: true, route: 'simulacro-rapido' },
      { id: 'sim-tematico', title: 'Simulacro por Bloques', subtitle: 'Elige tu tema - Sin limite', isInternal: true, route: 'simulacro-tematico' },
      { id: 'sim-errores', title: 'Repasa tus Errores', subtitle: 'Preguntas que fallaste', isInternal: true, route: 'simulacro-errores' },
    ]
  },
  {
    id: 'tips',
    title: 'Tips de Estudio',
    icon: Lightbulb,
    emoji: '💡',
    description: 'Tecnicas y consejos de estudio',
    gradient: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    recursos: [
      { id: 'tip-fsrs', title: 'Repeticion Espaciada (FSRS)', subtitle: 'Como funciona el algoritmo de repasos', isNew: false },
      { id: 'tip-test', title: 'Estrategia de Tests', subtitle: 'Tecnicas para maximizar puntuacion', isNew: false },
      { id: 'tip-memoria', title: 'Tecnicas de Memoria', subtitle: 'Memorizar articulos y fechas', isNew: true },
      { id: 'tip-tiempo', title: 'Gestion del Tiempo', subtitle: 'Estudiar sin agobios ni estres', isNew: false },
      { id: 'tip-examen', title: 'El Dia del Examen', subtitle: 'Consejos para el gran dia', isNew: true },
    ]
  },
  {
    id: 'glosario',
    title: 'Glosario',
    icon: BookMarked,
    emoji: '📖',
    description: 'Terminos y definiciones clave',
    gradient: 'from-sky-500 to-blue-600',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200',
    recursos: [
      { id: 'glo-admin', title: 'Derecho Administrativo', subtitle: '120+ terminos con definiciones' },
      { id: 'glo-const', title: 'Derecho Constitucional', subtitle: '85+ terminos clave' },
      { id: 'glo-proc', title: 'Procedimiento Administrativo', subtitle: '60+ terminos de la Ley 39/2015', isNew: true },
      { id: 'glo-rrhh', title: 'Funcion Publica', subtitle: '40+ terminos del EBEP' },
    ]
  },
  {
    id: 'enlaces',
    title: 'Enlaces Utiles',
    icon: ExternalLink,
    emoji: '🔗',
    description: 'Recursos externos de interes',
    gradient: 'from-fuchsia-500 to-pink-600',
    bg: 'bg-fuchsia-50',
    text: 'text-fuchsia-700',
    border: 'border-fuchsia-200',
    recursos: [
      { id: 'enl-boe', title: 'BOE - Boletin Oficial', subtitle: 'Legislacion consolidada', url: 'https://www.boe.es/', isExternal: true },
      { id: 'enl-inap', title: 'INAP', subtitle: 'Instituto Nacional de Administracion Publica', url: 'https://www.inap.es/', isExternal: true },
      { id: 'enl-060', title: 'Portal 060', subtitle: 'Administracion General del Estado', url: 'https://administracion.gob.es/', isExternal: true },
      { id: 'enl-sepe', title: 'Portal de Empleo Publico', subtitle: 'Convocatorias y ofertas', url: 'https://administracion.gob.es/pag_Home/empleoBecas/empleo/empleoPublico.html', isExternal: true },
    ]
  },
];

// Single resource item
function ResourceItem({ recurso, onResourceClick, isFavorite, onToggleFavorite }) {
  const handleClick = () => {
    if (recurso.isExternal && recurso.url) {
      window.open(recurso.url, '_blank', 'noopener,noreferrer');
    } else if (recurso.isInternal && recurso.route) {
      onResourceClick?.(recurso);
    }
  };

  return (
    <motion.div
      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-gray-800 text-sm truncate">{recurso.title}</p>
          {recurso.isNew && (
            <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-semibold rounded-full">
              NUEVO
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 truncate">{recurso.subtitle}</p>
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(recurso.id);
          }}
          className="p-1.5 rounded-lg hover:bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity"
          whileTap={{ scale: 0.9 }}
        >
          <Heart
            className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`}
          />
        </motion.button>

        {recurso.isExternal ? (
          <ExternalLink className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        )}
      </div>
    </motion.div>
  );
}

// Expandable category card
function CategoryCard({ categoria, isExpanded, onToggle, onResourceClick, favoriteIds, onToggleFavorite }) {
  const Icon = categoria.icon;
  const itemCount = categoria.recursos.length;
  const newCount = categoria.recursos.filter(r => r.isNew).length;

  return (
    <motion.div
      className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${categoria.border}`}
      layout
      transition={spring.gentle}
    >
      {/* Header - Always visible */}
      <motion.button
        className="w-full p-4 flex items-center gap-3 text-left"
        onClick={onToggle}
        whileTap={{ scale: 0.99 }}
      >
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoria.gradient} flex items-center justify-center flex-shrink-0 shadow-lg shadow-${categoria.gradient.split('-')[1]}-500/20`}>
          <span className="text-2xl">{categoria.emoji}</span>
        </div>

        {/* Title & subtitle */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{categoria.title}</h3>
            {newCount > 0 && (
              <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-semibold rounded-full">
                {newCount} nuevo{newCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 truncate">{categoria.description}</p>
        </div>

        {/* Count badge & chevron */}
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${categoria.bg} ${categoria.text}`}>
            {itemCount}
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={spring.snappy}
          >
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </motion.div>
        </div>
      </motion.button>

      {/* Expandable content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={spring.gentle}
          >
            <div className="px-4 pb-4 space-y-2 border-t border-gray-100 pt-3">
              {categoria.recursos.map((recurso, i) => (
                <motion.div
                  key={recurso.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <ResourceItem
                    recurso={recurso}
                    onResourceClick={onResourceClick}
                    isFavorite={favoriteIds?.includes(recurso.id)}
                    onToggleFavorite={onToggleFavorite}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Main RecursosPage component
export default function RecursosPage({ onNavigate }) {
  const { isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [simulationMode, setSimulationMode] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState(['legislacion']);
  const [favoriteIds, setFavoriteIds] = useState(['ce', 'ley39', 'tip-fsrs']);

  // Toggle category expansion
  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Toggle favorite
  const toggleFavorite = (resourceId) => {
    setFavoriteIds(prev =>
      prev.includes(resourceId)
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  // Handle resource click for internal navigation
  const handleResourceClick = (recurso) => {
    if (recurso.isInternal && onNavigate) {
      onNavigate(recurso.route);
    }
  };

  // Filter categories based on search
  const filteredCategorias = searchQuery
    ? categorias.map(cat => ({
        ...cat,
        recursos: cat.recursos.filter(r =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(cat => cat.recursos.length > 0)
    : categorias;

  // Calculate totals
  const totalRecursos = categorias.reduce((sum, cat) => sum + cat.recursos.length, 0);
  const totalNuevos = categorias.reduce((sum, cat) => sum + cat.recursos.filter(r => r.isNew).length, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <motion.div
        className="bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 rounded-2xl p-4 border border-purple-100"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring.gentle}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
            <BookMarked className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-medium text-gray-700">Tu biblioteca de preparacion</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/60 backdrop-blur rounded-xl p-2.5 text-center">
            <p className="text-lg font-bold text-purple-600">{categorias.length}</p>
            <p className="text-xs text-gray-500">Categorias</p>
          </div>
          <div className="bg-white/60 backdrop-blur rounded-xl p-2.5 text-center">
            <p className="text-lg font-bold text-violet-600">{totalRecursos}</p>
            <p className="text-xs text-gray-500">Recursos</p>
          </div>
          <div className="bg-white/60 backdrop-blur rounded-xl p-2.5 text-center">
            <p className="text-lg font-bold text-emerald-600">{totalNuevos}</p>
            <p className="text-xs text-gray-500">Nuevos</p>
          </div>
        </div>
      </motion.div>

      {/* Search bar */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring.gentle, delay: 0.05 }}
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar recursos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-3 bg-white rounded-xl border border-gray-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </motion.div>

      {/* Categories */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...spring.gentle, delay: 0.1 }}
      >
        {filteredCategorias.length > 0 ? (
          filteredCategorias.map((categoria, i) => (
            <motion.div
              key={categoria.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring.gentle, delay: 0.05 + i * 0.03 }}
            >
              <CategoryCard
                categoria={categoria}
                isExpanded={expandedCategories.includes(categoria.id)}
                onToggle={() => toggleCategory(categoria.id)}
                onResourceClick={handleResourceClick}
                favoriteIds={favoriteIds}
                onToggleFavorite={toggleFavorite}
              />
            </motion.div>
          ))
        ) : (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No se encontraron recursos</p>
            <p className="text-sm text-gray-400">Prueba con otra busqueda</p>
          </motion.div>
        )}
      </motion.div>

      {/* Quick tips */}
      <motion.div
        className="bg-purple-50 border border-purple-100 rounded-xl p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring.gentle, delay: 0.3 }}
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-purple-800 text-sm">Consejo del dia</p>
            <p className="text-sm text-purple-600 mt-0.5">
              Guarda tus recursos favoritos con el corazon para acceder mas rapido.
            </p>
          </div>
        </div>
      </motion.div>

      {/* DevMode Randomizer - development or admin */}
      {(import.meta.env.DEV || isAdmin) && (
        <DevModeRandomizer
          activeMode={simulationMode}
          onSelectMode={setSimulationMode}
          onClear={() => setSimulationMode(null)}
          pageContext="recursos"
        />
      )}
    </div>
  );
}
