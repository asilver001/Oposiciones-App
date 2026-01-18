# User Journey Analysis - OpositaSmart

> Fecha de analisis: 2026-01-18
> Version de la app: Pre-Beta (~35% completado)
> Branch: epic-kirch

---

## Resumen Ejecutivo

OpositaSmart tiene un flujo de onboarding bien definido y amigable, alineado con su filosofia de "bienestar primero, sin agobios". El flujo principal de quiz funciona, pero carece de funcionalidades avanzadas como Simulacros cronometrados. Este documento mapea los flujos actuales, identifica puntos de friccion y propone la implementacion de Simulacros.

---

## Flujo de Onboarding

### Diagrama de Flujo

```
[welcome] -> [onboarding1] -> [onboarding2] -> [onboarding3] -> [onboarding4]
     |              |              |               |               |
     |         Oposicion        Tiempo          Fecha           Intro
     |                                                            |
     v                                                            v
[home] <------------------------------------------ [first-test] -> [onboarding-results]
     ^                                                                    |
     |                                                                    v
     +---------------------------------------------- [signup] <- (opcional)
```

### Paso 1: Welcome Screen
**Ubicacion:** `src/components/onboarding/WelcomeScreen.jsx`

- **UI:** Pantalla minimalista con logo animado (graduacion cap)
- **Mensaje principal:** "Tu plaza, paso a paso"
- **Submensaje:** "Unos minutos al dia, a tu ritmo. Sin agobios."
- **Accion:** Boton "Empezar" -> onboarding1
- **Skip (DEV):** Salta directamente al home

**Analisis:**
- Positivo: Mensaje alineado con filosofia del producto
- Mejora: Podria mostrar beneficios clave o social proof

### Paso 2: Seleccion de Oposicion
**Componente:** `OnboardingOposicion` (inline en OpositaApp.jsx)

- **Pregunta:** "Que oposicion preparas?"
- **Opciones:** Actualmente solo "Auxiliar AGE" disponible
- **Otras opciones:** Bloqueadas (pronto C1/C2, Otras)

**Analisis:**
- Positivo: Preparado para expansion a otras oposiciones
- Mejora: Indicar claramente cuales estaran disponibles

### Paso 3: Tiempo Diario
**Componente:** `OnboardingTiempo`

- **Pregunta:** "Cuanto tiempo quieres dedicar al dia?"
- **Opciones:**
  - 5 min -> 5 preguntas
  - 10 min -> 10 preguntas
  - 15 min -> 15 preguntas
  - 20 min -> 20 preguntas

**Analisis:**
- Positivo: Opciones realistas, no abrumadoras
- Positivo: Enfasis en "sin agobios"

### Paso 4: Fecha de Examen
**Componente:** `OnboardingFecha`

- **Pregunta:** "Cuando crees que te presentaras?"
- **Opciones:**
  - "< 6 meses"
  - "6-12 meses"
  - "> 1 ano"
  - "Sin fecha aun"

**Analisis:**
- Positivo: No presiona con fecha exacta
- Potencial: Usar esta info para personalizar recomendaciones

### Paso 5: Intro/Prueba
**Componente:** `OnboardingIntro`

- **Mensaje:** Explica como funciona la app
- **Accion:** "Probar ahora" inicia first-test de 5 preguntas
- **Skip:** Puede saltar al home

**Analisis:**
- Positivo: Permite experiencia inmediata sin registro
- Mejora: Podria explicar mejor el sistema FSRS

---

## Flujo de Sesion de Estudio (Quiz)

### Flujo Principal

```
[home] -> click "Empezar" -> [first-test]
                                  |
                                  v
                          [Pregunta 1/5]
                                  |
                          (selecciona respuesta)
                                  |
                          (auto-avance 0.3s)
                                  |
                                  v
                          [Pregunta 2/5]
                                  |
                                ...
                                  |
                                  v
                          [Pregunta 5/5]
                                  |
                          (handleFinishTest)
                                  |
                                  v
                          [onboarding-results]
```

### Pantalla de Quiz (`first-test`)
**Ubicacion:** `OpositaApp.jsx` lineas 907-1063

**Elementos UI:**
- Header con boton "Salir" y cronometro
- Barra de progreso (preguntas completadas)
- Tarjeta de pregunta con opciones A, B, C, D
- Botones "Siguiente" / "Saltar" / "Finalizar Test"

**Comportamiento:**
1. Usuario selecciona respuesta
2. Se guarda en estado `answers`
3. Auto-avance a siguiente pregunta tras 0.3s
4. NO muestra si es correcta/incorrecta durante el test
5. Al finalizar, calcula resultados

**Analisis:**
- Positivo: Flujo rapido sin interrupciones
- Mejora: Opcion de ver explicacion inmediata (modo aprendizaje vs examen)
- Mejora: Sin cronometro real que afecte (solo informativo)

### Pantalla de Resultados (`onboarding-results`)
**Ubicacion:** `OpositaApp.jsx` lineas 1067-1147

**Elementos UI:**
- Confetti si >= 60% acierto
- Puntuacion grande (ej: "3 de 5 correctas! - 60%")
- Comparativa: "Estas en el TOP 45% de nuevos usuarios"
- Beneficios Premium listados
- Botones: "Ver planes Premium" / "Continuar con plan gratuito"

**Analisis:**
- Positivo: Celebra logros, no castiga errores
- Potencial friccion: Empuja Premium muy pronto
- Mejora: Mostrar detalle de respuestas correctas/incorrectas

---

## Flujo de Sesion Hibrida (HybridSession)

**Ubicacion:** `src/components/study/HybridSession.jsx`

Este componente implementa sesiones de repaso espaciado (FSRS):

### Caracteristicas
- Mezcla preguntas nuevas con repasos pendientes
- Usa algoritmo FSRS para espaciado
- Detecta patrones de error (insights)
- Guarda progreso en `user_question_progress`

### Flujo
```
[config] -> loadSession() -> [pregunta]
                                  |
                          (handleSelect)
                                  |
                          (delay 1.5s)
                                  |
                          answerQuestion()
                                  |
                          (siguiente pregunta)
                                  |
                                ...
                                  |
                          [SessionComplete]
                                  |
                          (saveSessionAndDetectInsights)
```

**Analisis:**
- Positivo: Sistema FSRS bien implementado
- Positivo: Deteccion de insights automatica
- Mejora: UI de SessionComplete podria mostrar mas insights

---

## Puntos de Friccion Identificados

### 1. Onboarding demasiado largo
**Problema:** 5 pasos antes de ver contenido real
**Impacto:** Posible abandono antes de probar la app
**Recomendacion:** Reducir a 3 pasos o permitir skip mas visible

### 2. Push a Premium muy temprano
**Problema:** Modal de Premium aparece tras primer test
**Impacto:** Usuario puede sentirse presionado (contradice filosofia "sin agobios")
**Recomendacion:** Mostrar Premium solo tras 3-5 sesiones completadas

### 3. Sin feedback inmediato en quiz
**Problema:** Usuario no sabe si acerto hasta el final
**Impacto:** Menor aprendizaje durante la sesion
**Recomendacion:** Ofrecer modo "Aprendizaje" con feedback inmediato

### 4. Falta de variedad en modos de estudio
**Problema:** Solo existe modo "practica rapida" (5 preguntas)
**Impacto:** Usuarios avanzados no tienen desafio
**Recomendacion:** Implementar Simulacros con diferentes duraciones

### 5. Sin simulacros cronometrados
**Problema:** No hay forma de practicar en condiciones reales
**Impacto:** Usuarios no pueden prepararse para la presion del examen
**Recomendacion:** Ver propuesta detallada abajo

### 6. Pocas preguntas disponibles
**Problema:** Solo 158 preguntas activas, muchos temas con solo 5
**Impacto:** Repeticion de preguntas, baja variedad
**Recomendacion:** Priorizar importacion de preguntas del pipeline (263 pendientes)

### 7. Duplicacion de perfiles
**Problema:** Existen `profiles` y `user_profiles` con datos similares
**Impacto:** Confusion en codigo, posible inconsistencia de datos
**Recomendacion:** Consolidar en una sola tabla

---

## Propuesta: Flujo de Simulacros

### Concepto

Simulacros son examenes cronometrados que simulan las condiciones reales del examen de Auxiliar AGE:
- 100 preguntas
- 60 minutos
- Penalizacion por errores (-0.25)
- Preguntas en blanco no penalizan

### Opciones de Simulacro

| Tipo | Preguntas | Tiempo | Uso |
|------|-----------|--------|-----|
| Mini | 5 | Sin limite | Calentamiento rapido |
| Express | 10 | 6 min (36s/pregunta) | Practica presion |
| Medio | 20 | 12 min | Sesion moderada |
| Largo | 60 | 36 min | Media maraton |
| Real | 100 | 60 min | Simulacro completo AGE |

### Modos de Tiempo

1. **Sin limite:** Para practicar sin presion
2. **Tiempo total:** X minutos para todo el examen (como el real)
3. **Por pregunta:** X segundos por pregunta, avance automatico

### UI Propuesta - Selector de Simulacro

```
+------------------------------------------+
|           SIMULACROS                      |
+------------------------------------------+
|                                          |
|  [Icono cronometro]                      |
|  Practica en condiciones reales          |
|                                          |
|  +----------------+  +----------------+  |
|  |    EXPRESS     |  |     MEDIO     |  |
|  |  10 preguntas  |  |  20 preguntas |  |
|  |    6 min       |  |    12 min     |  |
|  +----------------+  +----------------+  |
|                                          |
|  +----------------+  +----------------+  |
|  |     LARGO     |  |   REAL AGE    |  |
|  |  60 preguntas  |  | 100 preguntas |  |
|  |    36 min      |  |    60 min     |  |
|  +----------------+  +----------------+  |
|                                          |
|  Opciones avanzadas:                     |
|  [ ] Penalizacion por errores (-0.25)   |
|  [ ] Mostrar tiempo restante            |
|  [ ] Permitir dejar en blanco           |
|                                          |
+------------------------------------------+
```

### UI Propuesta - Durante Simulacro

```
+------------------------------------------+
|  <- Salir    [======----] 45/100   23:41 |
+------------------------------------------+
|                                          |
|  45. Segun el articulo 1.2 de la CE,     |
|      la soberania nacional reside en:    |
|                                          |
|  +------------------------------------+  |
|  | A) El Rey                          |  |
|  +------------------------------------+  |
|  | B) Las Cortes Generales           |  |
|  +------------------------------------+  |
|  | C) El pueblo espanol              | <-|
|  +------------------------------------+  |
|  | D) El Gobierno                    |  |
|  +------------------------------------+  |
|                                          |
|  [En blanco]           [Siguiente ->]   |
|                                          |
|  Navegacion: [<] 45 [>]  Ver todas >>   |
|                                          |
+------------------------------------------+
```

### UI Propuesta - Resultados Simulacro

```
+------------------------------------------+
|           RESULTADOS                      |
+------------------------------------------+
|                                          |
|           [Grafico circular]             |
|              67/100                       |
|                                          |
|  Correctas:    67  (+67.00)              |
|  Incorrectas:  28  (-7.00)               |
|  En blanco:     5  (+0.00)               |
|  --------------------------------        |
|  PUNTUACION:   60.00 / 100               |
|  NOTA:         6.0 / 10                  |
|                                          |
|  +------------------------------------+  |
|  | APROBADO (nota corte: 5.0)        |  |
|  +------------------------------------+  |
|                                          |
|  Tiempo usado: 52:34 / 60:00             |
|  Media por pregunta: 31.5s               |
|                                          |
|  [Ver respuestas]  [Nuevo simulacro]     |
|                                          |
+------------------------------------------+
```

### Comparativa con Examen Real AGE

| Aspecto | Examen Real | Simulacro App |
|---------|-------------|---------------|
| Preguntas | 100 | 100 (configurable) |
| Tiempo | 60 minutos | 60 min (configurable) |
| Opciones | A, B, C, D | A, B, C, D |
| Penalizacion | -0.25 por error | -0.25 (configurable) |
| Blancos | No penalizan | No penalizan |
| Nota corte | Variable (~5.0) | Mostrar historico |
| Temas | Proporcional por bloque | Configurable |

### Implementacion Tecnica

#### 1. Nuevas Tablas (ver DATABASE_ARCHITECTURE_REVIEW.md)

- `simulacros` - Configuraciones predefinidas
- `simulacro_sessions` - Sesiones realizadas
- `simulacro_answers` - Respuestas individuales

#### 2. Nuevo Componente React

```javascript
// src/components/simulacro/SimulacroSession.jsx
export default function SimulacroSession({
  config,           // { numPreguntas, tiempoLimite, penalizacion }
  onComplete,
  onExit
}) {
  // Estado
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  // Cargar preguntas al montar
  // Timer countdown
  // Navegacion libre entre preguntas
  // Calcular puntuacion AGE
}
```

#### 3. Hooks Necesarios

```javascript
// src/hooks/useSimulacro.js
export function useSimulacro() {
  // loadSimulacro(config) - Carga preguntas aleatorias
  // saveAnswer(questionId, answer) - Guarda respuesta
  // calculateScore() - Calcula puntuacion AGE
  // finishSimulacro() - Guarda sesion en BD
}
```

#### 4. Flujo de Navegacion

```
[Temas tab] -> [Simulacros card]
                      |
                      v
              [SimulacroSelector]
                      |
              (selecciona tipo)
                      |
                      v
              [SimulacroSession]
                      |
              (responde preguntas)
                      |
              (tiempo agotado O finaliza)
                      |
                      v
              [SimulacroResults]
                      |
              [Ver errores] [Repetir] [Inicio]
```

---

## Recomendaciones de UX

### Corto Plazo (1-2 semanas)

1. **Agregar modo "Aprendizaje"** con feedback inmediato
2. **Retrasar modal Premium** hasta 3+ sesiones
3. **Mostrar detalle de errores** en pantalla de resultados
4. **Importar preguntas pendientes** (263 en pipeline)

### Mediano Plazo (1-2 meses)

1. **Implementar Simulacros basicos** (10, 20, 60 preguntas)
2. **Agregar navegacion entre preguntas** en simulacros
3. **Sistema de puntuacion AGE** con penalizaciones
4. **Historial de simulacros** con graficos de progreso

### Largo Plazo (3+ meses)

1. **Simulacro completo 100 preguntas**
2. **Comparativa con nota de corte historica**
3. **Modo examen con pausa/continuar**
4. **Exportar resultados PDF**
5. **Ranking anonimo entre usuarios**

---

## Metricas de Exito para Simulacros

| Metrica | Target |
|---------|--------|
| Tasa de completado de simulacros | > 70% |
| Usuarios que hacen 2+ simulacros/semana | > 30% |
| Mejora en puntuacion entre simulacros | > 5% |
| NPS de feature Simulacros | > 40 |

---

## Anexo: Puntos de Entrada en Codigo

| Funcionalidad | Archivo | Linea aprox |
|---------------|---------|-------------|
| Welcome Screen | `src/components/onboarding/WelcomeScreen.jsx` | 1-39 |
| Onboarding Steps | `src/OpositaApp.jsx` | 868-903 |
| Quiz Screen | `src/OpositaApp.jsx` | 907-1063 |
| Results Screen | `src/OpositaApp.jsx` | 1067-1147 |
| HybridSession | `src/components/study/HybridSession.jsx` | 1-222 |
| FSRS Logic | `src/hooks/useSpacedRepetition.js` | 1-200 |
| Bottom Navigation | `src/OpositaApp.jsx` | 749-821 |

---

*Documento generado por Agent 5 - Analisis de User Journey*
