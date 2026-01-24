# FASE 1: Refactor Arquitectónico - Plan de Implementación

**Objetivo:** Transformar OpositaApp.jsx de monolito (1,869 líneas) a arquitectura limpia con routing, layouts, y state management moderno.

**Duración:** 10-12 días (1 dev) | 5-6 días (2 devs)

---

## Estado Actual Analizado

### OpositaApp.jsx - Anatomía del Monolito

**1,869 líneas conteniendo:**
- 37+ useState hooks (estado masivo)
- Routing manual via `currentPage` string
- 10+ páginas completas inline
- UI de modales, paneles, forms
- Lógica de negocio mezclada con UI

**Estados de navegación identificados:**
- Onboarding: `welcome`, `goal-oposicion`, `goal-tiempo`, `date`, `intro`
- Auth: `login`, `signup`, `forgot-password`
- Test: `first-test`, `onboarding-results`
- Main: `home` (con tabs: `inicio`, `actividad`, `temas`, `recursos`)
- Admin: `admin-panel`, `reviewer-panel`
- Legal: `privacy`, `terms`, `legal`, `about`, `faq`, `contact`

---

## Estrategia de Migración

### Principios:
1. **No breaking changes** - App funciona en todo momento
2. **Incremental** - Migrar página por página
3. **Testeable** - Cada paso se verifica antes del siguiente
4. **Rollback-friendly** - Siempre se puede revertir

### Orden de Implementación:
1. Foundation → Layouts → Pages → Router → State → Cleanup

---

## MILESTONE 1: Foundation (Día 1-2, 12 horas)

### 1.1 Instalar Dependencias

```bash
npm install react-router-dom@6 zustand
npm install -D @types/node
```

### 1.2 Crear Estructura de Carpetas

```bash
mkdir -p src/{pages,layouts,theme,stores,router}
mkdir -p src/pages/{HomePage,AuthPage,OnboardingPage,StudyPage,ActivityPage,TemasPage,RecursosPage,AdminPage,LegalPage}
mkdir -p src/layouts/{MainLayout,OnboardingLayout,AuthLayout,MinimalLayout}
mkdir -p src/components/routing
```

### 1.3 Design System (`/src/theme`)

**colors.js:**
```javascript
export const colors = {
  primary: {
    50: '#faf5ff',
    600: '#9333ea',
    700: '#7e22ce',
  },
  status: {
    nuevo: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
    progreso: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
    avanzando: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
    riesgo: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
    dominado: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' },
  }
};
```

**spacing.js, shadows.js, index.js** - Ver plan completo

### 1.4 Zustand Stores

**useNavigationStore.js:**
```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useNavigationStore = create(
  persist(
    (set) => ({
      activeTab: 'inicio',
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Modal states
      showPremiumModal: false,
      showSettingsModal: false,
      togglePremiumModal: () => set((s) => ({ showPremiumModal: !s.showPremiumModal })),
      // ... más estados de modales
    }),
    { name: 'navigation-storage' }
  )
);
```

**useUserStore.js, useStudyStore.js** - Centralizar estado global

### 1.5 Configurar Path Aliases (vite.config.js)

```javascript
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@components': path.resolve(__dirname, './src/components'),
      '@theme': path.resolve(__dirname, './src/theme'),
      '@stores': path.resolve(__dirname, './src/stores'),
    }
  }
});
```

---

## MILESTONE 2: Layouts (Día 3-4, 16 horas)

### 2.1 MainLayout

**Estructura:**
```jsx
<div className="min-h-screen">
  <TopBar />
  <main className="pt-16 pb-24 px-4 max-w-4xl mx-auto">
    <Outlet /> {/* Page components render here */}
  </main>
  <BottomTabBar />
</div>
```

**Archivos:**
- `/src/layouts/MainLayout/MainLayout.jsx`
- `/src/layouts/MainLayout/TopBar.jsx` (mover de components/home)
- `/src/layouts/MainLayout/BottomTabBar.jsx` (mover de components/navigation)
- `/src/layouts/MainLayout/index.js`

### 2.2 OnboardingLayout

Fullscreen, sin navegación:
```jsx
<div className="min-h-screen">
  <Outlet />
</div>
```

### 2.3 AuthLayout

Centrado, fondo morado:
```jsx
<div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center p-4">
  <div className="w-full max-w-md">
    <Outlet />
  </div>
</div>
```

### 2.4 MinimalLayout

Para legal pages:
```jsx
<div className="min-h-screen bg-gray-50 p-4">
  <div className="max-w-2xl mx-auto">
    <button onClick={() => navigate(-1)}>Volver</button>
    <Outlet />
  </div>
</div>
```

### 2.5 Route Protection

**ProtectedRoute.jsx:**
```jsx
export function ProtectedRoute({ children, requireAuth = true }) {
  const { isAuthenticated, isAnonymous, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (requireAuth && !isAuthenticated && !isAnonymous) {
    return <Navigate to="/welcome" replace />;
  }

  return children;
}

export function AdminRoute({ children }) {
  const { isAdmin, isReviewer } = useAuth();

  if (!isAdmin && !isReviewer) {
    return <Navigate to="/" replace />;
  }

  return children;
}
```

---

## MILESTONE 3: Pages (Día 5-7, 24 horas)

### 3.1 HomePage

**Extrae:** SoftFortHome wrapper
**Responsabilidad:** Cargar datos, pasar a SoftFortHome component

```jsx
export default function HomePage() {
  const navigate = useNavigate();
  const { userData, streakData, totalStats } = useUserStore();
  const { topicsWithQuestions } = useTopics();

  return (
    <SoftFortHome
      userName={userData.name}
      streakData={streakData}
      totalStats={totalStats}
      fortalezaData={/* ... */}
      onStartSession={() => navigate('/study')}
    />
  );
}
```

### 3.2 StudyPage

**Extrae:** Lógica de test (first-test page)
**Componentes:**
- QuestionCard
- ProgressBar
- ExitConfirmModal

**Zustand:** useStudyStore para estado del test

### 3.3 Otras Páginas

- **ActivityPage** - Wrapper de ActividadPage existente
- **TemasPage** - Wrapper de TemasListView existente
- **RecursosPage** - Wrapper de RecursosPage existente
- **AuthPage/LoginPage** - Wrapper de LoginForm existente
- **OnboardingPage** - Multi-step flow
- **AdminPage** - Wrapper de AdminPanel existente
- **LegalPage** - Páginas de legal/about/faq

---

## MILESTONE 4: Router (Día 8, 8 horas)

### 4.1 AppRouter.jsx

**Estructura de rutas:**
```jsx
<BrowserRouter basename={import.meta.env.BASE_URL}>
  <Routes>
    {/* Public */}
    <Route path="/welcome" element={<OnboardingLayout />}>
      <Route index element={<WelcomePage />} />
    </Route>

    {/* Auth */}
    <Route path="/auth" element={<AuthLayout />}>
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignUpPage />} />
    </Route>

    {/* Main App - Protected */}
    <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
      <Route path="/" element={<HomePage />} />
      <Route path="/study" element={<StudyPage />} />
      <Route path="/activity" element={<ActivityPage />} />
      <Route path="/temas" element={<TemasPage />} />
      <Route path="/recursos" element={<RecursosPage />} />
    </Route>

    {/* Admin */}
    <Route path="/admin" element={<AdminRoute><MainLayout /></AdminRoute>}>
      <Route index element={<AdminPage />} />
    </Route>

    {/* Legal */}
    <Route element={<MinimalLayout />}>
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
    </Route>
  </Routes>
</BrowserRouter>
```

### 4.2 Navigation Helpers

**navigationHelpers.js:**
```javascript
export const PAGE_ROUTE_MAP = {
  'welcome': '/welcome',
  'login': '/auth/login',
  'home': '/',
  'admin-panel': '/admin',
  // ... mapeo completo
};

export function useAppNavigation() {
  const navigate = useNavigate();
  const { setActiveTab } = useNavigationStore();

  return {
    navigateToTab: (tab) => { setActiveTab(tab); navigate('/'); },
    navigateToPage: (path) => navigate(path),
  };
}
```

### 4.3 Actualizar main.jsx

```jsx
import AppRouter from './router/AppRouter';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AdminProvider>
        <AppRouter />
      </AdminProvider>
    </AuthProvider>
  </StrictMode>
);
```

---

## MILESTONE 5: State Migration (Día 9-10, 16 horas)

### 5.1 Migrar Estado a Zustand

**Antes (OpositaApp.jsx):**
```javascript
const [currentPage, setCurrentPage] = useState('welcome');
const [activeTab, setActiveTab] = useState('inicio');
const [showPremiumModal, setShowPremiumModal] = useState(false);
const [userData, setUserData] = useState({...});
// ... 34 más
```

**Después:**
```javascript
// Ya no necesita estado local - todo en stores
const { activeTab } = useNavigationStore();
const { userData } = useUserStore();
const { questions } = useStudyStore();
```

### 5.2 Eliminar Prop Drilling

**Antes:**
```jsx
<SoftFortHome
  onNavigate={handleNavigate}
  onShowPremiumModal={() => setShowPremiumModal(true)}
  onShowSettingsModal={() => setShowSettingsModal(true)}
  // ... 15 más props
/>
```

**Después:**
```jsx
<SoftFortHome />
// Component usa stores directamente:
// const { togglePremiumModal } = useNavigationStore();
```

### 5.3 Actualizar Componentes

Componentes que necesitan actualización:
- BottomTabBar → usar useNavigate() + useLocation()
- TopBar → usar router location, stores
- SoftFortHome → usar stores en vez de props
- Modales → controlar estado via stores

---

## MILESTONE 6: Testing (Día 11-12, 16 horas)

### 6.1 Checklist de Navegación

- [ ] Todas las rutas accesibles via URL
- [ ] Botón back/forward del navegador funciona
- [ ] Deep linking funciona (compartir URL)
- [ ] Protected routes redirigen correctamente
- [ ] Tab switching se mantiene en refresh
- [ ] Modal states se resetean al navegar

### 6.2 Checklist de Estado

- [ ] User data persiste en refresh
- [ ] Stats persisten correctamente
- [ ] Streak calculations funcionan
- [ ] Test progress se guarda
- [ ] Anonymous mode funciona

### 6.3 Performance

- [ ] Code splitting con lazy()
- [ ] Lazy load admin routes
- [ ] Bundle size no aumentó >10%
- [ ] Lighthouse score >90

### 6.4 Compatibilidad

- [ ] localStorage migra a Zustand stores
- [ ] Onboarding completion flag reconocido
- [ ] User sessions preservadas

---

## Checklist de Migración

### Pre-Migration
- [ ] Crear branch `feat/fase-1-routing`
- [ ] Backup de base de datos
- [ ] Documentar funcionalidad actual
- [ ] Full manual test pass
- [ ] Tag version actual en git

### Durante Migration
- [ ] Instalar dependencias
- [ ] Crear estructura de carpetas
- [ ] Build design system
- [ ] Crear Zustand stores
- [ ] Build layouts
- [ ] Extraer páginas
- [ ] Configurar router
- [ ] Migrar estado
- [ ] Actualizar componentes
- [ ] Reducir OpositaApp.jsx

### Post-Migration
- [ ] Run full test suite
- [ ] Manual QA en todos los flujos
- [ ] Test en móvil
- [ ] Performance audit
- [ ] Accessibility audit
- [ ] Actualizar documentación
- [ ] Code review
- [ ] Merge a main

---

## Riesgos y Mitigación

### HIGH: Breaking Auth Flow
**Mitigación:**
- Mantener AuthContext sin cambios
- Testar auth primero
- Rollback plan: Mantener OpositaApp viejo

### MEDIUM: Data Loss
**Mitigación:**
- Usar persist middleware en Zustand
- Migrar localStorage en primer load
- Backup de keys existentes

### MEDIUM: Routing Conflicts
**Mitigación:**
- Base URL configurable
- Test en Vercel y GitHub Pages
- Documentar estructura de URLs

---

## Rollback Strategy

**Inmediato (<5 min):**
```bash
git revert <commit-hash>
npm run deploy
```

**Parcial:**
- Cherry-pick commits funcionales
- Deshabilitar rutas rotas
- Redirect a flujo viejo

---

## Success Criteria

### Code Quality
- [ ] OpositaApp.jsx: 1,869 → <150 líneas
- [ ] No archivos >500 líneas
- [ ] State hooks: 37 → <10 global
- [ ] Prop drilling reducido 80%

### Funcionalidad
- [ ] Todas las features funcionan
- [ ] No data loss
- [ ] URLs funcionan
- [ ] Back/forward funcionan

### Performance
- [ ] Lighthouse >90
- [ ] Bundle no crece >10%
- [ ] Page load <2s
- [ ] Route transitions <300ms

---

## Timeline

| Milestone | Días | Horas | Entregable |
|-----------|------|-------|------------|
| 1. Foundation | 2 | 12 | Folders, theme, stores |
| 2. Layouts | 2 | 16 | Layouts completos |
| 3. Pages | 3 | 24 | Páginas extraídas |
| 4. Router | 1 | 8 | Router configurado |
| 5. State | 2 | 16 | Zustand integrado |
| 6. Testing | 2 | 16 | Producción ready |
| **TOTAL** | **12** | **92** | **Arquitectura limpia** |

---

## Próximos Pasos Inmediatos

1. **Instalar dependencias** (5 min)
2. **Crear estructura de carpetas** (10 min)
3. **Crear design system** (2 horas)
4. **Crear Zustand stores** (4 horas)
5. **Comenzar con MainLayout** (4 horas)

---

**Plan creado:** 24 Enero 2026
**Para ejecutar por:** Agentes paralelos + orquestación manual
**Aprobación requerida:** Usuario debe aprobar antes de comenzar implementación
