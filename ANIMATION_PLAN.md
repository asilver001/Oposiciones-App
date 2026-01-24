# 🎯 MISIÓN: Implementar Sistema de Animaciones Estilo Tiimo en OpositaSmart

## 📋 CONTEXTO DEL PROYECTO

OpositaSmart es una app de preparación de oposiciones para el cuerpo de Auxiliar Administrativo del Estado (AGE). La filosofía es "bienestar primero" - evitar la gamificación tóxica y crear una experiencia calmada y motivadora.

**Stack técnico:**
- React 19 + Vite 7
- Tailwind CSS
- Supabase
- Framer Motion (a instalar si no existe)

**Estilo visual objetivo:** Tiimo (iPhone App of the Year 2025)
- Colores suaves y calmados
- Animaciones sutiles pero satisfactorias
- Sin rojo para errores (usar ámbar)
- Feedback positivo constante

---

## 🏗️ ARQUITECTURA DE SUBAGENTES

Este proyecto se ejecutará con **4 subagentes especializados** coordinados por un **agente controlador**.

### AGENTE CONTROLADOR (Tú)
**Responsabilidades:**
1. Asignar tareas a cada subagente
2. Revisar el trabajo completado
3. Verificar coherencia visual entre componentes
4. Asegurar que las animaciones siguen el mismo patrón
5. Hacer commit solo cuando todo esté validado

**Criterios de aceptación que debes verificar:**
- [ ] Todas las animaciones usan Framer Motion
- [ ] Timing consistente: 150-300ms para interacciones, 300-500ms para transiciones
- [ ] Colores consistentes con el tema de la app
- [ ] Sin animaciones que bloqueen la interacción
- [ ] Respetan `prefers-reduced-motion`

---

## 👷 SUBAGENTE 1: Animaciones de Botones y Feedback Táctil

**Archivos a modificar:**
- `src/components/ui/` - todos los botones
- Cualquier botón en la app

**Tareas:**
1. Añadir feedback táctil a TODOS los botones:
```jsx
import { motion } from 'framer-motion';

// Patrón estándar para botones
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.97 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
```

2. Crear variantes para diferentes tipos de botón:
   - **Primario**: scale + sombra al hover
   - **Secundario**: solo scale sutil
   - **Icono**: scale más pronunciado (0.9)
   - **Destructivo**: shake en hover (opcional)

**Criterios de aceptación:**
- [ ] Todos los botones tienen feedback al tap
- [ ] La animación se siente "springy" no "robótica"
- [ ] No hay delay perceptible

---

## 👷 SUBAGENTE 2: Animaciones de Quiz y Respuestas

**Archivos a modificar:**
- `src/components/study/` - componentes de quiz
- Componentes relacionados con preguntas y respuestas

**Tareas:**

1. **Selección de respuesta:**
```jsx
<motion.button
  animate={{ 
    scale: isSelected ? 1.02 : 1,
    backgroundColor: isSelected ? "#DBEAFE" : "#FFFFFF",
    borderColor: isSelected ? "#3B82F6" : "#E5E7EB"
  }}
  transition={{ type: "spring", stiffness: 500, damping: 30 }}
>
```

2. **Feedback de respuesta correcta:**
```jsx
// Flash verde + icono que aparece con bounce
<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: [0, 1.2, 1] }}
  className="bg-emerald-100 border-emerald-400"
>
  <motion.span animate={{ rotate: [0, 10, 0] }}>✓</motion.span>
</motion.div>
```

3. **Feedback de respuesta incorrecta:**
```jsx
// Shake horizontal SUAVE + color ÁMBAR (no rojo!)
<motion.div
  animate={{ x: [0, -8, 8, -8, 8, 0] }}
  transition={{ duration: 0.4 }}
  className="bg-amber-50 border-amber-400"  // ¡NUNCA rojo!
>
```

4. **Transición entre preguntas:**
```jsx
<AnimatePresence mode="wait">
  <motion.div
    key={currentQuestionIndex}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
  >
```

**Criterios de aceptación:**
- [ ] Seleccionar respuesta se siente satisfactorio
- [ ] Correcto = celebración sutil
- [ ] Incorrecto = informativo pero NO punitivo (ámbar, no rojo)
- [ ] Transiciones entre preguntas son fluidas

---

## 👷 SUBAGENTE 3: Animaciones de Progreso y Fortaleza

**Archivos a modificar:**
- `src/components/Fortaleza.jsx`
- Barras de progreso en toda la app
- Contador de racha

**Tareas:**

1. **Barra de progreso animada:**
```jsx
<motion.div
  initial={{ width: 0 }}
  animate={{ width: `${progress}%` }}
  transition={{ type: "spring", stiffness: 100, damping: 20 }}
  className="h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
/>
```

2. **Sistema Fortaleza (6 bloques):**
```jsx
// Entrada escalonada
{blocks.map((block, i) => (
  <motion.div
    key={i}
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay: i * 0.1, type: "spring" }}
  >
    {/* Pulse para bloques "en riesgo" */}
    {block.status === 'at-risk' && (
      <motion.div
        animate={{ 
          boxShadow: [
            "0 0 0 0 rgba(251, 191, 36, 0.4)",
            "0 0 0 10px rgba(251, 191, 36, 0)"
          ]
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    )}
  </motion.div>
))}
```

3. **Contador de racha:**
```jsx
<motion.div className="flex items-center gap-4">
  <motion.span
    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
    transition={{ duration: 2, repeat: Infinity }}
    className="text-4xl"
  >
    🔥
  </motion.span>
  <motion.span
    key={streakCount}  // Key para animar cambios
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="text-3xl font-bold"
  >
    {streakCount} días
  </motion.span>
</motion.div>
```

**Criterios de aceptación:**
- [ ] Las barras de progreso tienen animación spring
- [ ] Fortaleza tiene entrada escalonada
- [ ] Bloques "en riesgo" pulsan suavemente
- [ ] El contador de racha anima al cambiar

---

## 👷 SUBAGENTE 4: Transiciones de Página y Loading States

**Archivos a modificar:**
- `src/OpositaApp.jsx` o el router principal
- Cualquier componente con estados de carga

**Tareas:**

1. **Transiciones de página:**
```jsx
// En el componente de layout o router
import { AnimatePresence, motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

<AnimatePresence mode="wait">
  <motion.div
    key={currentPage}
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

2. **Loading skeleton:**
```jsx
const SkeletonCard = () => (
  <motion.div
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 1.5, repeat: Infinity }}
    className="h-16 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-xl"
  />
);
```

3. **Celebración al completar (opcional - con Lottie):**
```jsx
import Lottie from 'lottie-react';
import confettiAnimation from './animations/confetti.json';

// Descargar de: https://lottiefiles.com/animations/confetti
<Lottie 
  animationData={confettiAnimation} 
  loop={false}
  style={{ position: 'absolute', top: 0, left: 0 }}
/>
```

**Criterios de aceptación:**
- [ ] Cambiar de pantalla se siente suave
- [ ] No hay "flash" de contenido vacío
- [ ] Loading states son elegantes
- [ ] Celebraciones aparecen en momentos correctos

---

## 📦 SETUP INICIAL (Ejecutar primero)

```bash
# Instalar Framer Motion si no existe
npm install framer-motion

# Opcional: para celebraciones complejas
npm install lottie-react
```

---

## 🔄 FLUJO DE TRABAJO

### Paso 1: Controlador asigna tarea
"Subagente 1: Implementa feedback táctil en todos los botones de ui/"

### Paso 2: Subagente ejecuta
- Modifica archivos
- Añade imports de Framer Motion
- Implementa animaciones

### Paso 3: Subagente reporta
"Completado: 12 botones modificados en ui/. Todos usan whileTap y whileHover."

### Paso 4: Controlador revisa
- Ejecuta la app
- Verifica consistencia visual
- Compara con otros componentes ya hechos
- Aprueba o pide correcciones

### Paso 5: Commit
"feat(animations): add tactile feedback to all UI buttons"

---

## ⚠️ REGLAS IMPORTANTES

1. **NUNCA uses rojo para errores** - Siempre ámbar/naranja
2. **NUNCA bloquees la UI** - Animaciones deben permitir interacción
3. **SIEMPRE respeta `prefers-reduced-motion`**:
```jsx
import { useReducedMotion } from 'framer-motion';
const shouldReduceMotion = useReducedMotion();
```
4. **Timing consistente**: 
   - Interacciones: 150-300ms
   - Transiciones: 300-500ms
   - Celebraciones: hasta 1s

5. **Spring > Linear** - Preferir animaciones con física spring

---

## 📊 CHECKLIST FINAL DEL CONTROLADOR

Antes de hacer merge/commit final:

### Consistencia Visual
- [ ] Todos los botones tienen el mismo feedback
- [ ] Colores de éxito/error son consistentes
- [ ] Timing se siente uniforme en toda la app

### Rendimiento
- [ ] No hay lag al interactuar
- [ ] Animaciones corren a 60fps
- [ ] No hay memory leaks

### Accesibilidad
- [ ] prefers-reduced-motion respetado
- [ ] Animaciones no causan mareo
- [ ] Focus states siguen visibles

### Funcionalidad
- [ ] Quiz funciona correctamente
- [ ] Progreso se guarda
- [ ] No hay errores en consola

---

## 🎯 ORDEN DE EJECUCIÓN RECOMENDADO

1. **PRIMERO**: Subagente 1 (Botones) - Establece el patrón base
2. **SEGUNDO**: Subagente 4 (Transiciones) - Mejora la navegación general
3. **TERCERO**: Subagente 2 (Quiz) - El corazón de la app
4. **CUARTO**: Subagente 3 (Progreso) - El toque final

Cada subagente debe esperar aprobación del controlador antes de pasar al siguiente.

---

## 💬 EJEMPLO DE PROMPT PARA INICIAR

Copia esto y pégalo en Claude Code:

```
Lee el archivo ANIMATION_PLAN.md en la raíz del proyecto.

Actúa como el Agente Controlador. Tu primera tarea es:
1. Verificar que framer-motion está instalado (si no, instalarlo)
2. Asignar la primera tarea al Subagente 1 (botones)
3. Revisar el trabajo cuando esté listo
4. Mantener un log de cambios realizados

Empieza preguntándome si quiero proceder con el Subagente 1.
```
