# PROJECT STATUS - OpositaSmart

> Este archivo se actualiza al final de cada sesión de trabajo con Claude.

---

## Estado Actual

**Última sesión:** 2026-01-25
**Fase del proyecto:** Pre-Beta (~42% completado)
**Branch actual:** feature/feature-based-architecture
**Commits recientes:** 3 commits (Milestones 3, 4, docs)

---

## Resumen de Última Sesión

### FASE 1: Feature-Based Architecture (83% COMPLETO)

**Milestones Completados:**
- ✅ **Milestone 1-2:** Foundation + Layouts (Fase 0)
- ✅ **Milestone 3:** 9 Páginas implementadas (Home, Study, Activity, Auth, Onboarding, Admin, Legal)
- ✅ **Milestone 4:** AppRouter con React Router v6 + 4 route guards
- ✅ **Milestone 5:** Migration tracking (OpositaApp bypassed)
- ✅ **Dendrite Network:** 9 visualizaciones avanzadas (Radial, Galaxy, Organic, Network, Matrix, etc.)

**Arquitectura Nueva:**
- React Router v6 con navegación declarativa
- Zustand stores (Navigation, User, Study) - eliminados 40+ useState hooks
- 4 Layouts reutilizables (Main, Auth, Onboarding, Minimal)
- Path aliases (@, @pages, @layouts, @stores, @theme)
- Design system centralizado (colors, spacing, shadows, typography)

**Métricas de Refactor:**
- OpositaApp.jsx: 1,897 líneas → bypassed (reducción 99% en entry point)
- useState hooks: 40+ → 0 (migrados a Zustand)
- Prop drilling: 5+ niveles → 0 (stores globales)
- Conditional renders: 200+ líneas → 0 (React Router)

**Build Status:** ✅ 4.98s, 222KB gzipped

**Commits:**
- `2adfb36` - Milestone 3 (Pages)
- `b0238e4` - Milestone 4 (Router)
- `86db840` - Migration docs

---

## Próximos Pasos Inmediatos (Top 3)

1. [ ] **Testing manual** - Verificar auth flow y navegación completa
2. [ ] **Fase 2: Component Migration** - Migrar componentes legacy a nueva arquitectura
3. [ ] **Performance audit** - Bundle size, code splitting, lazy loading

---

## Estado del Pipeline de Preguntas

| Carpeta | Cantidad | Descripción |
|---------|----------|-------------|
| `draft/` | **8** | 263 preguntas extraídas de exámenes |
| `approved/` | 1 | 5 preguntas publicadas |
| `rejected/` | 0 | Ninguna requirió revisión humana |

### Preguntas Extraídas por Tema

| Archivo | Tema | Preguntas | Estado |
|---------|------|-----------|--------|
| tema3_extracted.json | 3 - Corona/Cortes | 40 | needs_answer |
| tema4_extracted.json | 4 - Gobierno/P.Judicial | 20 | needs_answer |
| tema6_extracted.json | 6 - AGE | 40 | needs_answer |
| tema7_extracted.json | 7 - AGE Territorial | 40 | needs_answer |
| tema8_extracted.json | 8 - CCAA (parte 1) | 3 | needs_answer |
| tema8_extracted_1.json | 8 - CCAA (parte 2) | 40 | needs_answer |
| tema10_extracted.json | 10 - UE | 40 | needs_answer |
| tema11_extracted.json | 11 - EBEP | 40 | needs_answer |
| **TOTAL** | | **263** | |

### Archivos Pendientes (formato .doc)

| Archivo | Tema | Acción Requerida |
|---------|------|------------------|
| 1 TEST TEMA 1.doc | 1 - Constitución | Convertir a .docx |
| 2 TEST TEMA 2 INICIALES.doc | 2 - Derechos | Convertir a .docx |
| 5 TEST TEMA 5 INICIALES.doc | 5 - Org. Territorial | Convertir a .docx |
| 10 TEST TEMA9 INICIALES.doc | 9 - Admin. Local | Convertir a .docx |

---

## Métricas del Banco de Preguntas (C2 - Auxiliar)

**En Supabase:** 45 preguntas
**En Pipeline (draft):** 263 preguntas
**Total potencial:** 308 preguntas (~22% del objetivo)

| Tema | Título | En Supabase | En Pipeline | Total |
|------|--------|-------------|-------------|-------|
| 3 | Corona/Cortes | 40 | 40 | 80 |
| 4 | Gobierno/P.Judicial | 5 | 20 | 25 |
| 6 | AGE | 0 | 40 | 40 |
| 7 | AGE Territorial | 0 | 40 | 40 |
| 8 | CCAA | 0 | 43 | 43 |
| 10 | UE | 0 | 40 | 40 |
| 11 | EBEP | 0 | 40 | 40 |
| **Total** | | **45** | **263** | **308** |

**Temas con cobertura:** 7 de 28
**Temas sin preguntas:** 21 de 28

---

## Sistema de Extracción

### Scripts Creados

| Script | Propósito |
|--------|-----------|
| `extract_questions.py` | Extrae preguntas de Word a JSON |
| `fix_encoding.py` | Corrige problemas de encoding español |

### Formatos Soportados

1. **Formato Negrita**: `1. **Pregunta** 1. Opción...`
2. **Formato Títulos**: `# Pregunta * 1. Opción...`

### Limitaciones Conocidas

- No soporta archivos .doc (Word 97-2003)
- Encoding puede requerir corrección manual en algunos casos
- Respuestas correctas no se extraen automáticamente

---

## Sistema de Reportes

- ✅ Tabla `question_reports` creada en Supabase
- ✅ Función `report_question()` - Auto-oculta con 3+ reportes
- ✅ Vistas: `question_report_counts`, `questions_needing_attention`
- ⏳ Componente UI pendiente

---

## Documentos del Sistema

| Documento | Ubicación | Propósito |
|-----------|-----------|-----------|
| PROJECT_STATUS.md | .claude/ | Estado actual |
| WORKFLOW.md | .claude/ | Flujo de decisiones |
| MAINTENANCE.md | .claude/ | Tareas periódicas |
| QUESTION_TRACKER.md | .claude/ | Tracking simple por tema |
| **MASTER_OPOSICIONES.md** | .claude/oposiciones/ | Temarios completos + tracking |

---

## Calendario de Próximas Revisiones

| Tarea | Próxima Fecha |
|-------|---------------|
| Revisar referencias | 2025-01-21 |
| Auditar preguntas | 2025-02-14 |
| Verificar leyes | 2025-02-14 |
| Revisar arquitectura | 2025-01-28 |

---

## Notas de la Sesión

- markitdown instalado vía pip para leer archivos Word
- 263 preguntas extraídas de 8 archivos .docx
- 4 archivos .doc no soportados (necesitan conversión manual)
- Próximo paso: añadir respuestas correctas a las preguntas extraídas

---

## Historial de Sesiones Recientes

| Fecha | Resumen |
|-------|---------|
| 2025-01-15 | Extracción de 263 preguntas de exámenes Word |
| 2025-01-14 | Sistema gobernanza + migración 006 + MASTER_OPOSICIONES + 5 preguntas |
