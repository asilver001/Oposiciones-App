# Plan de Refactorización: OpositaApp.jsx

## Estado Actual

**Archivo:** `src/OpositaApp.jsx`
**Líneas:** 2571
**Estado:** ⚠️ CRÍTICO - Muy por encima del límite recomendado (300-500 líneas)

---

## Análisis de Estructura Actual

### Componentes Inline Identificados (líneas aproximadas)

| Componente | Líneas | Descripción |
|------------|--------|-------------|
| `DevPanel` | 22-81 | Panel de desarrollo flotante |
| `PremiumModal` | 673-749 | Modal de upgrade a premium |
| `BottomTabBar` | 750-833 | Navegación inferior |
| `ActividadContent` | 1544-1820 | Página de actividad/stats |
| `TemasContent` | 1821-1910 | Listado de temas |
| `RecursosContent` | 1911-1993 | Recursos y enlaces |
| `InicioContent` | 1994-2147 | Página principal/home |
| `SettingsModal` | 2148-2294 | Modal de configuración |
| `ProgressModal` | 2295-2395 | Modal de progreso diario |
| `TopBar` | 2396-2430 | Barra superior |

### Estados (~50 useState en el componente principal)

```javascript
// Estados de navegación
currentPage, activeTab

// Estados de usuario
userData, isLoading, isPremium, premiumMode

// Estados de test/quiz
currentQuestion, selectedAnswer, answers, showExplanation,
timeElapsed, testResults, questions

// Estados de racha/gamificación
streakData, showStreakCelebration, earnedBadge, showStreakBanner

// Estados de modales
showExitConfirm, showPremiumModal, showSettingsModal, showProgressModal,
showAdminLoginModal, showAnimationPlayground, showDraftFeatures, showFeedbackPanel

// Estados de formularios
formName, formEmail, privacyAccepted, signupFormShownCount

// Estados de stats
dailyTestsCount, totalStats, topicsProgress, recentInsights, lastSessionStats
```

### Funciones de Lógica (~20 funciones)

- `selectRandomQuestions`
- `calculateTotalProgress`
- `getDaysUntilExam`
- `completeOnboarding`
- `handleAnswerSelect`
- `handleNextQuestion`
- `handleFinishTest`
- `handleCreateAccount`
- `handleSkipSignup`
- `goToSignupOrHome`
- `getStreakMessage`
- `handleDevReset`
- Y más...

---

## Propuesta de Subdivisión

### Fase 1: Extraer Componentes UI (Bajo Riesgo)

**Objetivo:** Extraer componentes visuales que son autocontenidos.

#### 1.1 DevPanel → `src/components/dev/DevPanel.jsx`
```
✅ Autocontenido
✅ Solo recibe props, no modifica estado global
✅ Fácil de probar
```

#### 1.2 BottomTabBar → `src/components/navigation/BottomTabBar.jsx`
```
✅ Ya existe lógica de tabs simple
✅ Recibe activeTab y setActiveTab como props
⚠️ Tiene lógica de roles (admin/reviewer)
```

#### 1.3 TopBar → `src/components/navigation/TopBar.jsx`
```
✅ Componente pequeño (~35 líneas)
✅ Solo UI, sin lógica compleja
```

#### 1.4 Modales → `src/components/modals/`
- `PremiumModal.jsx` (~75 líneas)
- `SettingsModal.jsx` (~145 líneas)
- `ProgressModal.jsx` (~100 líneas)

```
✅ Autocontenidos
✅ Reciben datos por props
⚠️ SettingsModal tiene lógica de logout
```

---

### Fase 2: Extraer Páginas de Contenido (Medio Riesgo)

**Objetivo:** Extraer las "páginas" que se renderizan según activeTab.

#### 2.1 InicioContent → `src/components/pages/HomePage.jsx`
```
⚠️ Depende de muchos estados
⚠️ Tiene CTAs que cambian página
Necesita: userData, streakData, totalStats, topicsProgress, etc.
```

#### 2.2 TemasContent → `src/components/pages/TemasPage.jsx`
```
✅ Relativamente simple (~90 líneas)
⚠️ Usa hook useTopics
```

#### 2.3 ActividadContent → `src/components/pages/ActividadPage.jsx`
```
⚠️ Componente más grande (~275 líneas)
⚠️ Usa hook useActivityData
⚠️ Tiene muchos sub-componentes inline
```

#### 2.4 RecursosContent → `src/components/pages/RecursosPage.jsx`
```
✅ Autocontenido (~80 líneas)
✅ Solo datos estáticos y navegación externa
```

---

### Fase 3: Extraer Lógica de Estado (Alto Riesgo)

**Objetivo:** Consolidar estados relacionados en hooks o contextos.

#### 3.1 useQuizSession → `src/hooks/useQuizSession.js`
```javascript
// Agrupa:
- currentQuestion, selectedAnswer, answers
- showExplanation, timeElapsed, testResults
- questions, handleAnswerSelect, handleNextQuestion, handleFinishTest
```

#### 3.2 useStreakManager → `src/hooks/useStreakManager.js`
```javascript
// Agrupa:
- streakData, showStreakCelebration, earnedBadge
- getStreakMessage, updateStreak
```

#### 3.3 useOnboarding → `src/hooks/useOnboarding.js`
```javascript
// Agrupa:
- onboarding steps state
- completeOnboarding, handleCreateAccount, handleSkipSignup
```

#### 3.4 NavigationContext → `src/contexts/NavigationContext.jsx`
```javascript
// Agrupa:
- currentPage, setCurrentPage
- activeTab, setActiveTab
- Lógica de navegación
```

---

## Estructura Final Propuesta

```
src/
├── OpositaApp.jsx              # ~300 líneas (orquestador)
│
├── components/
│   ├── dev/
│   │   └── DevPanel.jsx        # Panel de desarrollo
│   │
│   ├── navigation/
│   │   ├── BottomTabBar.jsx    # Navegación inferior
│   │   └── TopBar.jsx          # Barra superior
│   │
│   ├── modals/
│   │   ├── PremiumModal.jsx    # Modal premium
│   │   ├── SettingsModal.jsx   # Modal configuración
│   │   └── ProgressModal.jsx   # Modal progreso diario
│   │
│   ├── pages/
│   │   ├── HomePage.jsx        # Contenido de Inicio
│   │   ├── TemasPage.jsx       # Contenido de Temas
│   │   ├── ActividadPage.jsx   # Contenido de Actividad
│   │   └── RecursosPage.jsx    # Contenido de Recursos
│   │
│   └── ... (existentes)
│
├── hooks/
│   ├── useQuizSession.js       # Lógica de sesión de quiz
│   ├── useStreakManager.js     # Gestión de rachas
│   ├── useOnboarding.js        # Flujo de onboarding
│   └── ... (existentes)
│
└── contexts/
    ├── NavigationContext.jsx   # Estado de navegación
    └── ... (existentes)
```

---

## Plan de Migración Incremental

### Semana 1: Componentes UI Simples (Fase 1)

| Día | Tarea | Archivos | Riesgo |
|-----|-------|----------|--------|
| 1 | Extraer DevPanel | DevPanel.jsx | Bajo |
| 1 | Extraer TopBar | TopBar.jsx | Bajo |
| 2 | Extraer BottomTabBar | BottomTabBar.jsx | Bajo |
| 3 | Extraer PremiumModal | PremiumModal.jsx | Bajo |
| 4 | Extraer SettingsModal | SettingsModal.jsx | Medio |
| 5 | Extraer ProgressModal | ProgressModal.jsx | Bajo |

**Resultado esperado:** OpositaApp.jsx ~1800 líneas

### Semana 2: Páginas de Contenido (Fase 2)

| Día | Tarea | Archivos | Riesgo |
|-----|-------|----------|--------|
| 1 | Extraer RecursosPage | RecursosPage.jsx | Bajo |
| 2 | Extraer TemasPage | TemasPage.jsx | Medio |
| 3-4 | Extraer ActividadPage | ActividadPage.jsx | Medio |
| 5 | Extraer HomePage | HomePage.jsx | Alto |

**Resultado esperado:** OpositaApp.jsx ~900 líneas

### Semana 3: Lógica y Estados (Fase 3)

| Día | Tarea | Archivos | Riesgo |
|-----|-------|----------|--------|
| 1-2 | Crear useQuizSession | useQuizSession.js | Alto |
| 3 | Crear useStreakManager | useStreakManager.js | Medio |
| 4 | Crear useOnboarding | useOnboarding.js | Medio |
| 5 | Crear NavigationContext | NavigationContext.jsx | Alto |

**Resultado esperado:** OpositaApp.jsx ~300-400 líneas

---

## Orden de Extracción por Prioridad

### Prioridad 1 (Hacer AHORA) - Sin dependencias complejas

1. **DevPanel** - Completamente autocontenido
2. **TopBar** - Solo UI
3. **RecursosContent** - Solo datos estáticos

### Prioridad 2 (Esta semana) - Dependencias simples

4. **BottomTabBar** - Props simples (activeTab, setActiveTab)
5. **PremiumModal** - Props de datos
6. **ProgressModal** - Props de stats

### Prioridad 3 (Próxima semana) - Dependencias de hooks

7. **TemasContent** - Usa useTopics
8. **ActividadContent** - Usa useActivityData
9. **SettingsModal** - Tiene lógica de logout

### Prioridad 4 (Cuando haya tiempo) - Requiere refactor de estado

10. **HomePage** - Muchas dependencias
11. **useQuizSession** - Requiere mover mucho estado
12. **NavigationContext** - Cambio estructural

---

## Consideraciones con el Plan de 5 Agentes

### Impacto en Agentes Actuales

El plan de implementación (implementation-plan-jan18.md) ya contempla crear:
- `SoftFortHome.jsx` (Agente 1) → Reemplazará parte de InicioContent
- `TemasListView.jsx` (Agente 2) → Reemplazará TemasContent
- `ActividadPage.jsx` (Agente 2) → Reemplazará ActividadContent
- `RecursosPage.jsx` (Agente 3) → Reemplazará RecursosContent

**Recomendación:** Los agentes deben crear componentes NUEVOS en carpetas separadas. Después de revisar, reemplazamos los inline de OpositaApp.jsx con imports a los nuevos componentes.

### Flujo Sugerido

```
1. Agentes crean componentes nuevos
   └── src/components/home/SoftFortHome.jsx
   └── src/components/temas/TemasListView.jsx
   └── src/components/activity/ActividadPage.jsx
   └── src/components/recursos/RecursosPage.jsx

2. Usuario revisa y aprueba

3. Refactor de OpositaApp.jsx:
   - Eliminar InicioContent → import SoftFortHome
   - Eliminar TemasContent → import TemasListView
   - Eliminar ActividadContent → import ActividadPage
   - Eliminar RecursosContent → import RecursosPage

4. OpositaApp.jsx queda como orquestador
```

---

## Métricas de Éxito

| Métrica | Actual | Objetivo |
|---------|--------|----------|
| Líneas en OpositaApp.jsx | 2571 | < 400 |
| Componentes inline | 10 | 0 |
| useState en OpositaApp | ~50 | < 15 |
| Funciones en OpositaApp | ~20 | < 5 |

---

## Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Romper navegación | Media | Alto | Extraer BottomTabBar primero, probar |
| Props drilling excesivo | Alta | Medio | Usar Context para navegación |
| Re-renders innecesarios | Media | Bajo | Memoización donde sea necesario |
| Imports circulares | Baja | Alto | Estructura de carpetas clara |

---

## Checklist Pre-Refactor

- [ ] Backup del archivo actual
- [ ] Tests manuales de todas las páginas funcionando
- [ ] Documentar flujos de navegación actuales
- [ ] Identificar todos los efectos secundarios (useEffect)
- [ ] Listar todas las llamadas a localStorage

---

*Plan creado: 18 Enero 2026*
*Última actualización: 18 Enero 2026*
