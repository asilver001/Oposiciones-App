# UX/UI Assessment - OpositaSmart

**Fecha:** 2026-01-18
**Evaluador:** Claude (UX/UI Expert Assessment)
**Versión de la App:** Pre-beta (~34% completado)
**Target:** Opositores españoles (Auxiliar Administrativo AGE)

---

## Resumen Ejecutivo

OpositaSmart está en una transición hacia un nuevo sistema de diseño "Soft+Fort" con paleta rose/purple/violet y componentes estilo bento grid. La aplicación muestra un progreso sólido en varios aspectos de UX, pero presenta inconsistencias visuales significativas entre el código legacy (OpositaApp.jsx) y los nuevos componentes en DraftFeatures.jsx. Se recomienda priorizar la unificación visual y mejorar la accesibilidad.

---

## 1. Consistencia Visual

### 1.1 Sistema de Colores

| Hallazgo | Severidad | Ubicación |
|----------|-----------|-----------|
| **Paletas múltiples coexistiendo**: OpositaApp usa purple-600/700, DraftFeatures usa gradientes rose/violet/emerald/amber | Alta | Toda la app |
| **Gradientes inconsistentes**: Algunos componentes usan `from-purple-500 to-purple-600`, otros `from-purple-500 to-violet-600` | Media | Botones CTA |
| **Estados de color mezclados**: Fortaleza.jsx usa `estadoConfig` diferente a DraftFeatures.jsx (diferentes nombres y colores) | Alta | Fortaleza |
| **Colores semánticos sin sistema**: Verde para correcto, rojo para incorrecto, pero sin tokens definidos | Media | QuestionCard, SessionComplete |

**Recomendaciones:**
- Crear un archivo `tokens.css` o `theme.js` con variables CSS/JS para colores semánticos
- Unificar gradientes: elegir entre purple puro o purple-to-violet
- Consolidar `estadoConfig` en un único lugar importable

### 1.2 Tipografía

| Hallazgo | Severidad | Ubicación |
|----------|-----------|-----------|
| **Tamaños de título inconsistentes**: `text-2xl`, `text-3xl`, `text-xl` usados sin jerarquía clara | Media | Headers de página |
| **Font weights variados**: `font-bold`, `font-semibold`, `font-medium` sin regla clara | Baja | Toda la app |
| **Títulos de modales**: Varían entre `text-xl` y `text-lg` | Baja | Modales |

**Recomendaciones:**
- Definir escala tipográfica: H1=text-3xl, H2=text-2xl, H3=text-xl, body=text-base
- Estandarizar: títulos `font-bold`, subtítulos `font-semibold`, body `font-normal`

### 1.3 Espaciado

| Hallazgo | Severidad | Ubicación |
|----------|-----------|-----------|
| **Padding de cards variable**: `p-4`, `p-5`, `p-6` usados arbitrariamente | Media | Cards |
| **Gaps inconsistentes**: `gap-2`, `gap-3`, `gap-4` sin sistema | Baja | Layouts |
| **Márgenes de sección**: `mb-4`, `mb-6`, `space-y-6` sin patrón claro | Media | Secciones |

**Recomendaciones:**
- Establecer sistema: cards pequeñas `p-4`, cards medianas `p-5`, cards grandes `p-6`
- Usar `space-y-4` para listas, `space-y-6` para secciones principales
- Documentar en el componente `Card.jsx` los paddings predefinidos

### 1.4 Componentes

| Hallazgo | Severidad | Ubicación |
|----------|-----------|-----------|
| **Dos versiones de Fortaleza**: `Fortaleza.jsx` (dots) vs `FortalezaWithBars` en DraftFeatures (progress bars) | Alta | Dashboard |
| **Botones no unificados**: `Button.jsx` existe pero no se usa consistentemente | Alta | Toda la app |
| **Modales duplicados**: `Modal.jsx` en /ui vs modales inline en DraftFeatures | Media | Modales |
| **Border-radius inconsistente**: `rounded-xl`, `rounded-2xl`, `rounded-3xl` mezclados | Media | Toda la app |

**Recomendaciones:**
- Migrar a componente Button unificado en todos los lugares
- Decidir y deprecar una versión de Fortaleza
- Estandarizar: `rounded-xl` para elementos pequeños, `rounded-2xl` para cards, `rounded-3xl` para modales

---

## 2. Usabilidad

### 2.1 Navegación

| Hallazgo | Severidad | Ubicación |
|----------|-----------|-----------|
| **Bottom Tab Bar bien implementada**: Floating style, iconos claros, estados activos | Positivo | BottomTabBar |
| **Navegación por estado string**: `currentPage` con múltiples valores string es frágil | Media | OpositaApp.jsx |
| **Sin breadcrumbs en páginas profundas**: Privacy, Terms, FAQ no muestran contexto | Baja | Páginas legales |
| **Botones DEV visibles en producción**: WelcomeScreen muestra [DEV] Saltar y Reset | Alta | WelcomeScreen |

**Recomendaciones:**
- Implementar router o sistema de navegación más robusto
- Eliminar elementos DEV del build de producción (usar `import.meta.env.DEV`)
- Agregar indicadores de ubicación en páginas secundarias

### 2.2 CTAs (Call to Action)

| Hallazgo | Severidad | Ubicación |
|----------|-----------|-----------|
| **CTAs primarios claros**: "Empezar", "Continuar", gradientes purple destacan | Positivo | Botones principales |
| **Jerarquía visual correcta**: Primario (sólido) > Secundario (outline) > Ghost | Positivo | Button.jsx |
| **Algunos CTAs poco descriptivos**: "Ver más" sin contexto, "Continuar" ambiguo | Baja | Varios |
| **Botones deshabilitados sin feedback visual suficiente**: Solo `opacity-50` | Media | Forms |

**Recomendaciones:**
- Cambiar "Ver más" por "Ver todos los temas (8 más)"
- Agregar cursor: `cursor-not-allowed` y tooltip en botones deshabilitados

### 2.3 Flujo de Usuario

| Hallazgo | Severidad | Ubicación |
|----------|-----------|-----------|
| **Onboarding bien estructurado**: 4 pasos claros con progreso visual | Positivo | Onboarding |
| **Test inicial integrado**: Primera experiencia práctica antes del registro | Positivo | first-test |
| **Confirmación de salida en tests**: Modal de "¿Salir del test?" previene pérdida accidental | Positivo | HybridSession |
| **Auto-avance rápido en test**: 0.3s puede ser muy rápido para algunos usuarios | Media | first-test |
| **Flujo signup/login fragmentado**: Múltiples páginas en lugar de modal | Baja | Auth |

**Recomendaciones:**
- Hacer el tiempo de auto-avance configurable o aumentarlo a 1s mínimo
- Considerar auth modal en lugar de páginas completas para menos friction

### 2.4 Friction Points

| Hallazgo | Severidad | Ubicación |
|----------|-----------|-----------|
| **Premium modal "Próximamente" puede frustrar**: Usuario ve modal sin poder actuar | Media | PremiumModal |
| **Temas bloqueados visibles**: Causa frustración ver contenido no accesible | Media | TemasContent |
| **Sin indicador de guardado automático**: Usuario no sabe si su progreso está guardado | Media | Toda la app |
| **Formulario de contacto sin confirmación real**: Solo alert() | Baja | Contact |

**Recomendaciones:**
- Agregar toast/snackbar confirmando guardado de progreso
- Reducir visibilidad de contenido Premium hasta que esté disponible
- Implementar envío real de formulario de contacto o quitar temporalmente

---

## 3. Accesibilidad

### 3.1 Contraste de Colores

| Hallazgo | Severidad | Ubicación |
|----------|-----------|-----------|
| **Textos grises claros sobre blanco**: `text-gray-400`, `text-gray-500` pueden no cumplir WCAG AA | Alta | Labels, subtítulos |
| **Gradientes con texto blanco**: OK en la mayoría de casos | Positivo | CTAs |
| **Estados disabled poco visibles**: Solo opacity reduce visibilidad | Media | Botones |
| **Links purple sobre purple-50**: Puede tener bajo contraste | Media | Algunos fondos |

**Recomendaciones:**
- Subir grises mínimo a `text-gray-600` para textos secundarios
- Agregar borde o sombra a estados disabled además de opacity
- Verificar ratios de contraste con herramienta como Axe o WAVE

### 3.2 Tamaños de Fuente

| Hallazgo | Severidad | Ubicación |
|----------|-----------|-----------|
| **Fuentes base legibles**: `text-base` (16px) para body | Positivo | General |
| **Algunos textos muy pequeños**: `text-[10px]`, `text-xs` difíciles de leer | Media | Leyendas, hints |
| **Stats bien grandes**: `text-2xl`, `text-3xl` para números importantes | Positivo | Dashboards |

**Recomendaciones:**
- Mínimo `text-xs` (12px) para cualquier texto legible
- Evitar `text-[10px]` - usar iconos o eliminar si no es esencial

### 3.3 Estados Interactivos

| Hallazgo | Severidad | Ubicación |
|----------|-----------|-----------|
| **Hover states presentes**: `hover:bg-gray-100`, `hover:scale-1.02` | Positivo | Botones, cards |
| **Focus states ausentes**: No se definen `:focus-visible` en la mayoría de componentes | Alta | Toda la app |
| **Active states bien implementados**: `active:scale-[0.98]` da feedback táctil | Positivo | Botones |
| **Sin indicadores de loading en navegación**: Solo spinner central | Media | Transiciones |

**Recomendaciones:**
- Agregar `focus-visible:ring-2 focus-visible:ring-purple-500` a elementos interactivos
- Implementar loading states en links/botones que disparan navegación

### 3.4 Semántica HTML

| Hallazgo | Severidad | Ubicación |
|----------|-----------|-----------|
| **Uso de divs como botones**: Algunos elementos clickeables son divs | Media | Cards interactivas |
| **Sin landmarks ARIA**: No hay `role="main"`, `role="navigation"` | Media | Layout |
| **Sin labels en iconos solos**: Iconos sin `aria-label` | Alta | Iconos de navegación |

**Recomendaciones:**
- Usar `<button>` para todos los elementos clickeables
- Agregar `aria-label` a iconos sin texto visible
- Implementar landmarks básicos para screen readers

---

## 4. Performance Percibida

### 4.1 Animaciones

| Hallazgo | Severidad | Ubicación |
|----------|-----------|-----------|
| **Framer Motion bien usado**: Springs con stiffness/damping configurados | Positivo | DraftFeatures |
| **Animaciones suaves**: `transition-all`, duraciones cortas | Positivo | General |
| **Shimmer effect en barras de progreso**: Efecto premium bien implementado | Positivo | AnimatedProgressBar |
| **Posible over-animation**: Muchos elementos con motion pueden cansar | Baja | DraftFeatures |
| **Animación de entrada en welcome**: Float simple pero efectivo | Positivo | WelcomeScreen |

**Recomendaciones:**
- Respetar `prefers-reduced-motion` para usuarios sensibles
- Usar animaciones con moderación en componentes de estudio (concentración)

### 4.2 Feedback Visual

| Hallazgo | Severidad | Ubicación |
|----------|-----------|-----------|
| **Loading spinner central**: Simple y claro | Positivo | isLoading |
| **Progress bar en tests**: Muestra avance claramente | Positivo | SessionHeader |
| **Resultados inmediatos en respuestas**: Verde/rojo tras selección | Positivo | QuestionCard |
| **Sin skeleton loaders**: Transiciones abruptas de loading a contenido | Media | Listas |
| **Sin feedback de guardado**: Usuario no sabe cuando se guarda progreso | Media | General |

**Recomendaciones:**
- Implementar skeleton loaders para listas y cards
- Agregar micro-feedback (toast) al guardar progreso exitosamente
- Considerar optimistic updates para acciones comunes

### 4.3 Loading States

| Hallazgo | Severidad | Ubicación |
|----------|-----------|-----------|
| **Estado de carga global implementado**: `isLoading` en OpositaApp | Positivo | App |
| **Loading en sesión de estudio**: Loader2 con mensaje | Positivo | HybridSession |
| **Loading en actividad**: Spinner simple | Positivo | ActividadContent |
| **Sin loading en cambios de página**: Transiciones instantáneas o con salto | Baja | Navegación |

**Recomendaciones:**
- Agregar transiciones suaves entre páginas
- Considerar lazy loading de componentes pesados

---

## 5. Mobile-First

### 5.1 Diseño Responsive

| Hallazgo | Severidad | Ubicación |
|----------|-----------|-----------|
| **Contenedor max-w-md centrado**: Funciona bien en móvil y desktop | Positivo | Layouts |
| **Bottom Tab Bar bien posicionada**: Floating, accesible con pulgar | Positivo | BottomTabBar |
| **Cards de ancho completo**: Se adaptan al viewport | Positivo | Cards |
| **Grids responsivos ausentes**: `grid-cols-2` fijo sin breakpoints | Media | Stats cards |
| **Modal posicionamiento**: Centrado vertical funciona pero puede requerir scroll | Baja | Modales grandes |

**Recomendaciones:**
- Agregar `sm:grid-cols-2 grid-cols-1` para stats en móvil pequeño
- Considerar modales bottom-sheet en móvil para mejor acceso

### 5.2 Touch Targets

| Hallazgo | Severidad | Ubicación |
|----------|-----------|-----------|
| **Botones grandes**: `py-3`, `py-4` cumplen 44px mínimo | Positivo | CTAs |
| **Tab bar items adecuados**: `min-w-[4rem]` con padding | Positivo | BottomTabBar |
| **Opciones de respuesta amplias**: `p-4` en cada opción | Positivo | QuestionCard |
| **Links pequeños**: "¿Olvidaste tu contraseña?" puede ser difícil de tocar | Media | LoginForm |
| **Iconos sin padding suficiente**: Algunos iconos solos son pequeños | Media | Headers |

**Recomendaciones:**
- Agregar `p-2` mínimo a iconos clickeables
- Aumentar área de tap en links secundarios

### 5.3 Scroll y Gestos

| Hallazgo | Severidad | Ubicación |
|----------|-----------|-----------|
| **Scroll natural en listas**: Contenedores con overflow-y-auto | Positivo | Listas |
| **Swipe gestures en DraftFeatures**: Drag horizontal bien implementado | Positivo | FocusModeSwipeable |
| **Safe areas consideradas**: `pb-2` en bottom bar | Positivo | BottomTabBar |
| **Sin pull-to-refresh**: No implementado | Baja | Listas |
| **Modal scroll interno**: Puede conflictuar con scroll de página | Baja | Modales largos |

**Recomendaciones:**
- Considerar pull-to-refresh en tabs de actividad
- Bloquear scroll de body cuando modal está abierto

---

## 6. Quick Wins vs Mejoras a Largo Plazo

### Quick Wins (Implementables en 1-2 días)

1. **Eliminar elementos DEV de producción** - Alta prioridad
   - Usar `import.meta.env.DEV` para condicionar botones de desarrollo

2. **Agregar focus-visible a botones** - Alta prioridad
   - Una línea en Button.jsx: `focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2`

3. **Subir contraste de grises** - Alta prioridad
   - Find/replace `text-gray-400` -> `text-gray-500`, `text-gray-500` -> `text-gray-600`

4. **Agregar aria-labels a iconos** - Media prioridad
   - Tab bar icons, botones de cerrar modal

5. **Aumentar tiempo de auto-avance** - Media prioridad
   - Cambiar 300ms a 1000ms en handleAnswerSelect

### Mejoras a Mediano Plazo (1-2 semanas)

1. **Unificar sistema de colores** - Alta prioridad
   - Crear archivo de tokens/theme con variables CSS
   - Migrar gradientes a sistema consistente

2. **Consolidar versiones de Fortaleza** - Alta prioridad
   - Elegir entre dots o progress bars, deprecar la otra

3. **Migrar a componente Button unificado** - Media prioridad
   - Refactorizar botones inline a usar Button.jsx

4. **Implementar skeleton loaders** - Media prioridad
   - Para listas de temas, historial de sesiones

5. **Agregar toast/snackbar system** - Media prioridad
   - Para feedback de guardado, errores, éxitos

### Mejoras a Largo Plazo (1+ mes)

1. **Refactorizar OpositaApp.jsx** - Alta prioridad
   - Extraer onboarding a su propio componente/router
   - Implementar sistema de routing apropiado

2. **Implementar design system completo** - Alta prioridad
   - Documentar tokens, componentes, patrones
   - Storybook o similar para componentes

3. **Audit de accesibilidad completo** - Media prioridad
   - Testing con screen readers
   - Cumplimiento WCAG AA

4. **Optimización de animaciones** - Baja prioridad
   - Respetar prefers-reduced-motion
   - Lazy loading de Framer Motion

5. **Testing de usabilidad** - Alta prioridad
   - Pruebas con usuarios reales
   - Iteración basada en feedback

---

## Anexo: Archivos Clave Revisados

| Archivo | Líneas | Notas |
|---------|--------|-------|
| `src/OpositaApp.jsx` | ~2000+ | Componente monolítico, necesita refactor |
| `src/components/playground/DraftFeatures.jsx` | ~1500+ | Nuevos diseños Soft+Fort |
| `src/components/study/HybridSession.jsx` | ~220 | Bien estructurado |
| `src/components/study/QuestionCard.jsx` | ~100 | Limpio, buen UX |
| `src/components/Fortaleza.jsx` | ~150 | Versión legacy con dots |
| `src/components/ui/Button.jsx` | ~45 | Sistema de variantes OK |
| `src/components/ui/Card.jsx` | ~40 | Variantes bien definidas |
| `src/components/ui/Modal.jsx` | ~60 | Básico pero funcional |
| `src/components/auth/LoginForm.jsx` | ~165 | Completo, buena validación |
| `src/components/onboarding/WelcomeScreen.jsx` | ~40 | Simple pero contiene elementos DEV |
| `src/index.css` | ~7 | Solo import Tailwind |

---

## Conclusión

OpositaSmart tiene una base sólida de UX con un enfoque claro en bienestar y calma. Los principales desafíos son:

1. **Consistencia**: Unificar el sistema visual entre código legacy y nuevo (especialmente entre `Fortaleza.jsx` y `DraftFeatures.jsx`)
2. **Accesibilidad**: Mejorar contraste de textos grises y agregar soporte de teclado/focus states
3. **Mantenibilidad**: Refactorizar OpositaApp.jsx (~2000+ líneas) en componentes más pequeños

El equipo debería priorizar los quick wins de accesibilidad primero (focus states, contraste, aria-labels), seguido de la unificación del sistema de diseño. La filosofía "bienestar primero" se refleja bien en el tono del copy y las animaciones suaves, pero necesita extenderse a la accesibilidad para no excluir usuarios con discapacidades.

---

*Assessment realizado por Claude - UX/UI Expert*
*Enero 2026*
