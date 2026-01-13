# CLAUDE.md - Guía para Claude Code

## Descripción del Proyecto

**OpositaSmart** es una aplicación web de preparación para oposiciones españolas (actualmente enfocada en Auxiliar Administrativo del Estado - AGE).

### Filosofía Core
- **Bienestar primero**: Sin gamificación tóxica, sin presión artificial
- **A tu ritmo**: "Unos minutos al día, sin agobios"
- **Ciencia del aprendizaje**: Basado en repetición espaciada (FSRS)

## Stack Tecnológico

- **Frontend**: React 19 + Vite 7
- **Estilos**: Tailwind CSS 4
- **Backend**: Supabase (auth + base de datos)
- **Iconos**: Lucide React
- **Deploy**: GitHub Pages (gh-pages)

## Estructura del Proyecto

```
src/
├── OpositaApp.jsx          # Componente principal (2560 líneas - NECESITA REFACTOR)
├── main.jsx                # Entry point
├── index.css               # Estilos globales
├── components/
│   ├── admin/              # Panel de administración
│   │   ├── AdminPanel.jsx
│   │   ├── AdminLoginModal.jsx
│   │   ├── PreguntasTab.jsx
│   │   ├── TemasTab.jsx
│   │   └── QuestionImporter/Exporter.jsx
│   ├── auth/               # Autenticación
│   │   ├── LoginForm.jsx
│   │   ├── SignUpForm.jsx
│   │   └── ForgotPasswordForm.jsx
│   ├── study/              # Sesiones de estudio
│   │   ├── HybridSession.jsx    # Sesión híbrida (17K chars)
│   │   └── StudyDashboard.jsx
│   ├── review/             # Repaso de preguntas
│   │   ├── ReviewContainer.jsx
│   │   └── QuestionCardCompact.jsx
│   ├── FeedbackPanel.jsx
│   └── Fortaleza.jsx       # Sistema de progreso visual
├── contexts/
│   ├── AuthContext.jsx     # Estado de autenticación
│   └── AdminContext.jsx    # Estado de admin
├── hooks/
│   ├── useAuth.js
│   ├── useSpacedRepetition.js  # Algoritmo FSRS
│   ├── useUserInsights.js
│   └── useActivityData.js
├── lib/
│   ├── supabase.js         # Cliente Supabase
│   └── fsrs.js             # Implementación FSRS
└── data/
    └── questions/          # Banco de preguntas
```

## Comandos

```bash
npm run dev      # Servidor desarrollo (Vite)
npm run build    # Build producción
npm run preview  # Preview build local
npm run deploy   # Deploy a GitHub Pages
npm run lint     # ESLint
```

## Convenciones de Código

### Componentes
- Componentes funcionales con hooks
- Props destructuradas en parámetros
- Tailwind para estilos (inline classes)
- Lucide para iconos

### Naming
- Componentes: PascalCase (`StudyDashboard.jsx`)
- Hooks: camelCase con prefijo `use` (`useSpacedRepetition.js`)
- Archivos de datos: kebab-case (`ce-constitucion.js`)

### Estilo Visual
- Paleta principal: Purple (purple-50 a purple-700)
- Bordes redondeados grandes: `rounded-2xl`, `rounded-3xl`
- Sombras suaves: `shadow-lg shadow-purple-600/30`
- Transiciones: `transition-all`, `active:scale-[0.98]`

## Deuda Técnica Conocida

1. **OpositaApp.jsx** (2560 líneas): Contiene demasiada lógica
   - Onboarding completo debería extraerse
   - Estados de navegación mezclados con UI
   - Múltiples componentes inline

2. **HybridSession.jsx** (17K chars): Componente muy grande

3. Sin TypeScript (actualmente JavaScript puro)

4. Sin tests automatizados

## Variables de Entorno

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Contexto del Negocio

- **Oposición target**: Auxiliar Administrativo AGE
- **Usuarios**: Opositores españoles
- **Modelo**: Freemium (no implementado aún)
- **Estado actual**: ~34% completado, pre-beta
