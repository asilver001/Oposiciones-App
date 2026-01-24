# Propuesta de Reorganización - Estructura de Carpetas

## Análisis de Estructura Actual

### ✅ Lo que funciona bien:

1. **Separación clara de concerns:**
   - `/components` - UI components
   - `/contexts` - React contexts
   - `/hooks` - Custom hooks
   - `/services` - Business logic
   - `/lib` - Utilities
   - `/utils` - Helpers

2. **Componentes organizados por feature:**
   - `/components/auth/` - Forms de autenticación
   - `/components/study/` - Sesiones de estudio
   - `/components/admin/` - Panel administrativo
   - `/components/review/` - Sistema de repaso

3. **Index.js para exports limpios:**
   - Facilita imports: `import { LoginForm } from '@/components/auth'`

### ❌ Problemas identificados:

1. **OpositaApp.jsx es un monolito (1,869 líneas)**
   - Contiene routing, estado global, UI
   - Debería dividirse en páginas + layouts

2. **Falta carpeta `/pages`:**
   - Los componentes de "página" están mezclados con componentes reutilizables
   - Ejemplo: `ActividadPage.jsx`, `RecursosPage.jsx` están en `/components`

3. **DraftFeatures.jsx (8,713 líneas) en producción:**
   - Debería estar en `/playground` o eliminarse

4. **Falta carpeta `/layouts`:**
   - `TopBar.jsx`, `BottomTabBar.jsx` son layouts, no componentes home

5. **storage.js en root:**
   - Debería estar en `/lib` como abstraction layer

6. **Mixing de concerns:**
   - `Fortaleza.jsx` (viejo) vs `FortalezaVisual.jsx` (nuevo)
   - `motion.jsx` vs `motion.js`

---

## Propuesta de Nueva Estructura

### FASE 1: Organización Inmediata (1-2 días)

```
src/
├── main.jsx                    # Entry point (no cambiar)
├── index.css                   # Global styles (no cambiar)
│
├── App.jsx                     # NUEVO: Wrapper con providers
│   └── AppRouter.jsx           # NUEVO: Routing logic (extraído de OpositaApp)
│
├── pages/                      # NUEVO: Page-level components
│   ├── HomePage/
│   │   ├── index.jsx           # Export default HomePage
│   │   └── HomePage.jsx        # (era SoftFortHome.jsx)
│   ├── StudyPage/
│   │   ├── index.jsx
│   │   ├── StudyPage.jsx       # (era parte de OpositaApp)
│   │   └── components/         # Componentes específicos de esta página
│   │       ├── SessionCard.jsx
│   │       └── StudyModeSelector.jsx
│   ├── ActividadPage/
│   │   ├── index.jsx
│   │   └── ActividadPage.jsx   # (mover de components/)
│   ├── RecursosPage/
│   │   ├── index.jsx
│   │   └── RecursosPage.jsx    # (mover de components/)
│   ├── AdminPage/
│   │   ├── index.jsx
│   │   ├── AdminPage.jsx       # (wrapper del AdminPanel)
│   │   └── components/         # (todo el contenido de components/admin/)
│   ├── ReviewerPage/
│   │   ├── index.jsx
│   │   └── ReviewerPage.jsx    # (wrapper del ReviewContainer)
│   ├── OnboardingPage/
│   │   ├── index.jsx
│   │   ├── OnboardingPage.jsx  # (flow completo)
│   │   └── steps/              # (mover components/onboarding/ aquí)
│   ├── AuthPage/
│   │   ├── index.jsx
│   │   ├── LoginPage.jsx
│   │   ├── SignUpPage.jsx
│   │   └── ForgotPasswordPage.jsx
│   └── NotFoundPage/
│       └── index.jsx
│
├── layouts/                    # NUEVO: Layout components
│   ├── MainLayout/
│   │   ├── index.jsx
│   │   ├── MainLayout.jsx      # Wrapper con TopBar + BottomTabBar
│   │   ├── TopBar.jsx          # (mover de components/home/)
│   │   └── BottomTabBar.jsx    # (mover de components/navigation/)
│   ├── OnboardingLayout/
│   │   ├── index.jsx
│   │   └── OnboardingLayout.jsx # Sin navegación, fullscreen
│   └── AuthLayout/
│       ├── index.jsx
│       └── AuthLayout.jsx      # Centrado, sin navegación
│
├── components/                 # SOLO componentes reutilizables
│   ├── common/                 # NUEVO: Componentes comunes
│   │   ├── EmptyState/
│   │   │   ├── index.jsx
│   │   │   └── EmptyState.jsx  # NUEVO: Para states vacíos
│   │   ├── LoadingSkeleton/
│   │   │   ├── index.jsx
│   │   │   └── LoadingSkeleton.jsx  # NUEVO: Skeletons
│   │   └── Toast/
│   │       ├── index.jsx
│   │       └── Toast.jsx       # NUEVO: Notifications
│   ├── ui/                     # Componentes base (mantener)
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Modal/
│   │   └── ProgressBar/
│   ├── study/                  # Feature: Estudio
│   │   ├── QuestionCard/
│   │   ├── HybridSession/      # Dividir si es muy grande
│   │   ├── SessionComplete/
│   │   └── SessionHeader/
│   ├── fortaleza/              # Feature: Sistema de progreso
│   │   ├── FortalezaVisual/    # (renombrar)
│   │   ├── ProgressCircle/
│   │   └── StatusBadge/
│   ├── insights/               # Feature: Insights
│   │   ├── InsightCard/
│   │   └── InsightModal/
│   ├── feedback/
│   │   └── FeedbackPanel/
│   └── dev/                    # Herramientas de desarrollo
│       ├── DevPanel/
│       └── FlowVisualizer/     # NUEVO: Flowy integration
│
├── features/                   # NUEVO: Feature modules (optional, fase 2)
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── index.js
│   └── study/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── index.js
│
├── contexts/                   # React contexts (mantener)
│   ├── AuthContext.jsx
│   └── AdminContext.jsx
│
├── hooks/                      # Custom hooks (mantener estructura)
│   ├── useActivityData.js
│   ├── useAppNavigation.js
│   ├── useAuth.js
│   ├── useSpacedRepetition.js
│   ├── useTopics.js
│   └── useUserInsights.js
│
├── services/                   # Business logic (mantener)
│   ├── api/                    # NUEVO: API abstractions
│   │   ├── supabaseClient.js   # (mover de lib/)
│   │   └── apiService.js       # NUEVO: Generic API calls
│   ├── insightDetector.js
│   ├── questionImportService.js
│   ├── questionsService.js
│   └── spacedRepetitionService.js
│
├── lib/                        # Utilities & algorithms
│   ├── fsrs.js                 # (mantener)
│   ├── storage.js              # (mover de root)
│   └── constants.js            # NUEVO: App-wide constants
│
├── utils/                      # Helpers
│   ├── questionValidator.js
│   ├── testInsights.js
│   └── formatters.js           # NUEVO: Date, number formatters
│
├── data/                       # Static data
│   └── questions/              # (mantener)
│
├── theme/                      # NUEVO: Design system
│   ├── colors.js               # Unified status colors
│   ├── spacing.js              # Spacing scale
│   ├── typography.js           # Font sizes, weights
│   └── shadows.js              # Shadow system
│
├── types/                      # NUEVO: TypeScript types (fase 2)
│   ├── question.ts
│   ├── user.ts
│   └── session.ts
│
└── __tests__/                  # NUEVO: Tests (fase 2)
    ├── unit/
    ├── integration/
    └── e2e/
```

---

## FASE 2: Feature-based Organization (Opcional, largo plazo)

Si el proyecto crece significativamente (50+ componentes por feature):

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm/
│   │   │   └── SignUpForm/
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── services/
│   │   │   └── authService.js
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   └── index.js            # Export todo
│   │
│   ├── study/
│   │   ├── pages/
│   │   │   ├── StudyPage/
│   │   │   └── SessionPage/
│   │   ├── components/
│   │   │   ├── QuestionCard/
│   │   │   └── HybridSession/
│   │   ├── hooks/
│   │   │   ├── useSpacedRepetition.js
│   │   │   └── useStudySession.js
│   │   ├── services/
│   │   │   └── spacedRepetitionService.js
│   │   └── index.js
│   │
│   └── admin/
│       ├── pages/
│       ├── components/
│       ├── hooks/
│       └── services/
```

**Pros:**
- Colocation de código relacionado
- Fácil encontrar todo lo de un feature
- Facilita trabajar en equipos (cada dev un feature)

**Cons:**
- Más complejo inicialmente
- Puede crear duplicación si no se gestiona bien
- Requiere refactor significativo

**Recomendación:** Implementar solo si equipo crece >3 devs.

---

## Plan de Migración

### Paso 1: Crear estructura nueva (2 horas)

```bash
# Crear carpetas
mkdir -p src/{pages,layouts,theme,features}
mkdir -p src/components/common
mkdir -p src/services/api

# Mover archivos
mv src/storage.js src/lib/storage.js
mv src/lib/supabase.js src/services/api/supabaseClient.js
```

### Paso 2: Extraer routing de OpositaApp (4 horas)

```jsx
// src/AppRouter.jsx (NUEVO)
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import OnboardingLayout from '@/layouts/OnboardingLayout';
import HomePage from '@/pages/HomePage';
import StudyPage from '@/pages/StudyPage';
// ...

export default function AppRouter() {
  const { user, isOnboardingComplete } = useAuth();

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  if (!isOnboardingComplete) {
    return <Navigate to="/onboarding" />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/auth/*" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Onboarding */}
        <Route path="/onboarding" element={<OnboardingLayout />}>
          <Route index element={<OnboardingPage />} />
        </Route>

        {/* Protected routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/study" element={<StudyPage />} />
          <Route path="/activity" element={<ActividadPage />} />
          <Route path="/resources" element={<RecursosPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Paso 3: Dividir OpositaApp en páginas (6 horas)

Mover lógica de cada "screen" a su página correspondiente:

```jsx
// src/pages/HomePage/HomePage.jsx
import { useAuth } from '@/hooks/useAuth';
import { useActivityData } from '@/hooks/useActivityData';
import FortalezaVisual from '@/components/fortaleza/FortalezaVisual';

export default function HomePage() {
  const { user } = useAuth();
  const { weeklyData, streak } = useActivityData();

  return (
    <div className="p-4">
      <FortalezaVisual progress={user.progress} />
      {/* ... resto del contenido de SoftFortHome */}
    </div>
  );
}
```

### Paso 4: Crear layouts (2 horas)

```jsx
// src/layouts/MainLayout/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import BottomTabBar from './BottomTabBar';

export default function MainLayout() {
  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <main className="flex-1 overflow-auto pb-16">
        <Outlet />  {/* Páginas se renderizan aquí */}
      </main>
      <BottomTabBar />
    </div>
  );
}
```

### Paso 5: Crear theme system (3 horas)

```javascript
// src/theme/colors.js
export const statusColors = {
  nuevo: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
  progreso: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  avanzando: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
  riesgo: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
  dominado: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' },
};

// src/theme/spacing.js
export const spacing = {
  xs: '0.5rem',  // 8px
  sm: '0.75rem', // 12px
  md: '1rem',    // 16px
  lg: '1.5rem',  // 24px
  xl: '2rem',    // 32px
};

// src/theme/shadows.js
export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow-lg shadow-purple-600/20',
  lg: 'shadow-2xl shadow-purple-600/30',
};
```

### Paso 6: Eliminar DraftFeatures (30 min)

```bash
# Mover a archivo histórico
git mv src/components/playground/DraftFeatures.jsx archived/DraftFeatures.jsx.bak
git commit -m "chore: archive DraftFeatures (8.7K LOC)"
```

### Paso 7: Actualizar imports (2 horas)

Buscar y reemplazar todos los imports afectados:

```bash
# Ejemplo: Buscar imports de TopBar
grep -r "from.*components/home/TopBar" src/
# Reemplazar con: from '@/layouts/MainLayout'
```

---

## Beneficios Esperados

### Antes (Actual):
```
OpositaApp.jsx: 1,869 líneas
├─ Routing
├─ Estado global (37 useState)
├─ Lógica de negocio
├─ UI de 10+ páginas
└─ Handlers de eventos
```

**Problemas:**
- Imposible testear
- Git conflicts constantes
- Difícil de entender
- Slow rerenders

### Después (Propuesto):
```
App.jsx: 50 líneas (providers)
AppRouter.jsx: 100 líneas (routing)
HomePage/: 150 líneas
StudyPage/: 200 líneas
ActividadPage/: 180 líneas
... (resto de páginas)
```

**Beneficios:**
- ✅ Cada página es testeable
- ✅ Git conflicts reducidos 80%
- ✅ Nuevos devs entienden estructura rápido
- ✅ Performance mejorado (code splitting)
- ✅ Navegación con URLs (deep linking)

---

## Compatibilidad con Hallazgos de Assessments

### UI/UX Assessment:
✅ Facilita implementar design system consistente
✅ `theme/` centraliza colores, spacing, shadows
✅ `common/EmptyState` resuelve problema de empty states
✅ `common/Toast` resuelve problema de notifications

### Architecture Assessment:
✅ Divide monolito OpositaApp en páginas
✅ Prepara para state management (Zustand)
✅ Facilita testing (páginas independientes)
✅ Reduce prop drilling (contexts por layout)

### Data Assessment:
✅ `services/api/` abstrae Supabase
✅ Facilita implementar caché en hooks
✅ Separa lógica de negocio de UI

---

## Métricas de Éxito

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| Líneas más grande archivo | 1,869 | <400 | -78% |
| Componentes en root | 4 | 0 | -100% |
| Profundidad de imports | 3-4 | 1-2 | -50% |
| Time to find file | ~30s | <5s | -83% |
| Nuevos devs onboarding | 2-3 días | <1 día | -60% |

---

## Alternativas Consideradas

### Opción A: Keep It Simple (Elegida)
- Estructura plana con `/pages` y `/layouts`
- Fácil de entender
- Suficiente para proyecto actual (35% completado)

### Opción B: Feature Modules
- Agrupar por features (`/features/auth`, `/features/study`)
- Mejor para equipos grandes
- Overhead innecesario actualmente

### Opción C: Monorepo
- Separar frontend, backend, shared
- Over-engineering para proyecto actual
- Considerar si crece >100K LOC

---

## Checklist de Implementación

**Semana 1:**
- [ ] Crear estructura de carpetas nueva
- [ ] Mover `storage.js` a `/lib`
- [ ] Crear `theme/` con colors, spacing, shadows
- [ ] Crear `AppRouter.jsx` (sin implementar routing aún)

**Semana 2:**
- [ ] Extraer HomePage de OpositaApp
- [ ] Extraer StudyPage de OpositaApp
- [ ] Crear MainLayout con TopBar + BottomTabBar
- [ ] Implementar routing básico

**Semana 3:**
- [ ] Extraer resto de páginas (Actividad, Recursos, Admin)
- [ ] Mover componentes a estructura correcta
- [ ] Actualizar todos los imports
- [ ] Eliminar DraftFeatures

**Semana 4:**
- [ ] Testing de navegación
- [ ] Actualizar documentación
- [ ] Code review completo
- [ ] Merge a main

---

## Notas Adicionales

### Imports con Alias

Configurar en `vite.config.js`:

```javascript
export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@layouts': '/src/layouts',
      '@hooks': '/src/hooks',
      '@services': '/src/services',
      '@lib': '/src/lib',
      '@theme': '/src/theme',
    }
  }
});
```

**Uso:**
```javascript
import HomePage from '@pages/HomePage';
import { Button } from '@components/ui';
import { useAuth } from '@hooks/useAuth';
```

### Routing Library

**Opción 1: React Router v6** (Recomendado)
- Industry standard
- Best documentation
- 10KB gzip

**Opción 2: TanStack Router** (Alternativa)
- Type-safe
- Más moderno
- Menor adopción

**Recomendación:** React Router v6 para MVP, considerar TanStack en v2.

---

**Documento creado:** 2026-01-24
**Basado en:** Assessments UI/UX, Architecture, Data
**Prioridad:** ALTA (bloquea refactor de OpositaApp)
