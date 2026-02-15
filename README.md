# OpositaSmart

Aplicacion web de preparacion para oposiciones espanolas, actualmente enfocada en **Auxiliar Administrativo del Estado (AGE)**.

## Stack

- **Frontend:** React 19 + Vite 7 + Tailwind CSS 4
- **Backend:** Supabase (auth + PostgreSQL)
- **Deploy:** Vercel (produccion) + GitHub Pages (preview)

## Desarrollo

```bash
npm install          # Instalar dependencias
npm run dev          # Servidor de desarrollo
npm run build        # Build de produccion
npm run lint         # ESLint
npm run screenshot   # Capturas Playwright (mobile + desktop)
npm run test:e2e     # Tests E2E
```

Requiere `.env` con:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Estructura

```
src/
  router/          # AppRouter (React Router v6, rutas lazy)
  pages/           # Paginas por ruta
  components/      # Componentes por dominio (study, review, admin, auth, temas)
  features/draft/  # Features experimentales (solo admin)
  hooks/           # Custom hooks (useSpacedRepetition, useActivityData)
  contexts/        # AuthContext, AdminContext
  lib/             # Supabase client, FSRS, error tracking
  data/            # Datos estaticos (prerequisites, topics)
```

## Modos de estudio

| Modo | Preguntas | Duracion |
|------|-----------|----------|
| Test Rapido | 10 | ~5 min |
| Practica Tema | 20 | ~15 min |
| Repaso Errores | 20 | ~15 min |
| Flashcards | 20 | ~10 min |
| Simulacro | 100 | 60 min |
| Lectura | 20 | Libre |

## Temario

28 temas organizados en 2 bloques segun BOE (Orden HFP/435):

- **Bloque I** (T1-T16): Organizacion Publica
- **Bloque II** (T17-T28): Actividad Administrativa y Ofimatica
