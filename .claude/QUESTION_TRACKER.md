# Question Tracker - OpositaSmart

> Estado del banco de preguntas actualizado con cada pipeline de calidad.
> Datos de Supabase (tabla `questions` WHERE `is_active = true`).

**Ultima actualizacion:** 2026-02-15
**Total preguntas activas:** 1,422

---

## Vista 1: Por Tema (distribucion actual)

| Tema | Nombre | Total | Objetivo | Cobertura |
|------|--------|-------|----------|-----------|
| T1 | CE: Principios, derechos, garantias | 241 | 100+ | OK |
| T2 | Servicios de Informacion Administrativa | 211 | 100+ | OK |
| T3 | AGE: organos centrales y territoriales | 136 | 100+ | OK |
| T4 | CCAA, Administracion local | 126 | 100+ | OK |
| T5 | Union Europea | 118 | 100+ | OK |
| T6 | LPAC + LRJSP, procedimiento, recursos | 10 | 100+ | CRITICO |
| T7 | Proteccion de datos (LOPDGDD) | 10 | 100+ | CRITICO |
| T8 | Cortes Generales, Defensor del Pueblo | 208 | 100+ | OK |
| T9 | Personal funcionario | 211 | 100+ | OK |
| T10 | Derechos y deberes de los funcionarios | 10 | 100+ | CRITICO |
| T11 | Poder Judicial, CGPJ, TS | 88 | 100+ | BAJO |
| T12 | Presupuestos del Estado | 10 | 100+ | CRITICO |
| T13 | Igualdad, genero, LGTBI, discapacidad | 16 | 100+ | CRITICO |
| T14 | Derechos y deberes de los funcionarios | 10 | 100+ | CRITICO |
| T15 | El presupuesto del Estado | 7 | 100+ | CRITICO |
| T16 | Igualdad, violencia de genero, LGTBI | 10 | 100+ | CRITICO |
| **TOTAL** | | **1,422** | **1,600+** | |

**Temas con cobertura OK (>100):** T1-T5, T8-T9 (7 temas, 1,251 preguntas)
**Temas con cobertura CRITICA (<20):** T6, T7, T10, T12, T14, T15, T16 (7 temas, 67 preguntas)
**Temas en progreso:** T11, T13 (2 temas, 104 preguntas)

---

## Vista 2: Por Origen

| Origen | Cantidad | % | Descripcion |
|--------|----------|---|-------------|
| Importadas (`imported`) | 301 | 21% | De archivos Word/PDF de examenes reales |
| Reformuladas (`reformulated`) | 1,046 | 74% | Mejoradas por pipeline de calidad |
| Creadas por IA (`ai_created`) | 75 | 5% | Generadas para temas sin cobertura |
| **TOTAL** | **1,422** | **100%** | |

### Desglose importadas por tema
| Tema | Importadas | Reformuladas | AI Created |
|------|-----------|--------------|------------|
| T1 | 147 | 94 | 0 |
| T2 | 29 | 182 | 0 |
| T3 | 30 | 106 | 0 |
| T4 | 15 | 111 | 0 |
| T5 | 19 | 99 | 0 |
| T6 | 0 | 0 | 10 |
| T7 | 0 | 0 | 10 |
| T8 | 13 | 195 | 0 |
| T9 | 17 | 194 | 0 |
| T10 | 0 | 0 | 10 |
| T11 | 23 | 65 | 0 |
| T12 | 0 | 0 | 10 |
| T13 | 6 | 0 | 10 |
| T14 | 0 | 0 | 10 |
| T15 | 2 | 0 | 5 |
| T16 | 0 | 0 | 10 |

---

## Vista 3: Por Estado de Validacion

| Estado | Cantidad | % | Accion requerida |
|--------|----------|---|-----------------|
| `human_pending` | 1,258 | 88.5% | Pendientes de aprobacion humana |
| `auto_validated` | 164 | 11.5% | Validadas por pipeline automatico |
| `human_approved` | 0 | 0% | — |
| `rejected` | 0 | 0% | — |

### Re-Assessment Opus 4.6 (review_comment tags)

| Tag | Cantidad | Descripcion |
|-----|----------|-------------|
| `[VERIFIED]` (con fuente) | 540 | Verificada contra texto legal (CE, LOPJ, LOTC, Ley 50/1997) |
| `[VERIFIED_NO_SOURCE]` | 460 | Verificada internamente (sin Ley 40/2015 ni Ley 39/2015) |
| `[VERIFIED_QUOTE]` | 26 | Cita textual verificada word-for-word contra ley |
| `[ERROR]` | 1 | Error factual detectado y corregido |
| `[AMBIGUOUS]` | 1 | Requiere revision humana |
| Sin tag (pendiente) | 118 | T1(8), T4(94), T5(3), T8(13) — agentes detenidos |
| `needs_refresh = true` | 56 | Flaggeadas para revision (duplicates, tema mismatch, etc.) |

> **Nota:** Los tags `[VERIFIED*]` estan en `review_comment`, no en `validation_status`.
> Backup pre-reassessment: tabla `questions_pre_reassessment_backup` (1,120 rows).

### Pipeline Verificacion por Capitulo (Rev. 2 — Feb 15-16, 2026)

Protocolo: agrupar preguntas por capitulo dentro de cada ley. El agente lee cada capitulo UNA vez y verifica TODAS las preguntas de ese capitulo juntas.

| Ley | Total | Verified | Con «cita» | Answers Fixed | Refs Fixed | Drift Fixed | Estado |
|-----|-------|----------|-----------|---------------|------------|-------------|--------|
| Ley 40/2015 | 224 | 220 | 207 (92%) | 4 | 12 | 2 | COMPLETADO |
| CE | 691 | 33 | 444 (64%) | 0 | 0 | 0 | PENDIENTE |
| LOTC | 79 | 9 | 18 (23%) | 0 | 0 | 0 | PENDIENTE |
| LOPJ | 67 | 3 | 65 (97%) | 0 | 0 | 0 | PENDIENTE |
| Ley 50/1997 | 47 | 4 | 42 (89%) | 0 | 0 | 0 | PENDIENTE |
| LBRL | 23 | 0 | 0 (0%) | 0 | 0 | 0 | PENDIENTE |
| Ley 39/2015 | 20 | 0 | 0 (0%) | 0 | 0 | 0 | PENDIENTE |
| Otra/Sin ref | 271 | 0 | 24 (9%) | 0 | 0 | 0 | N/A |
| **TOTAL** | **1,422** | **269** | **800** | **4** | **12** | **2** | |

#### Ley 40/2015 — Detalles (Feb 16, 2026)

3 agentes paralelos por titulo:
- **Agent A** (Titulo I Cap I+II, Arts 54-68): 80/80 verified. 76 citas, 2 answers fixed (IDs 1214, 1372)
- **Agent B** (Titulo I Cap III+IV + Preliminar, Arts 69-80+1-53): 61/65 verified. 44 citas, 2 answers fixed (IDs 1343, 990), 7 refs fixed, 1 drift
- **Agent C** (Titulo II, Arts 81-138): 79/79 verified. 79 citas, 5 refs fixed

Hallazgos criticos:
- ID 1214: respuesta incorrecta (Subdirectores Generales nombrados tambien por Subsecretario, Art. 67.2)
- ID 1372: respuesta incorrecta (Subsecretario SI tiene potestad disciplinaria faltas graves, Art. 63.1.n)
- ID 1343: contradiccion resuelta sobre suplencia Delegado Gobierno (Art. 72.2)
- 7 articulos inexistentes citados (70.2, 71.3, 73.2, 74.3.b) — corregidos
- 5 legal_references de Titulo II apuntaban a articulos adyacentes (82/83, 90/104, 133/134, 136/138)

---

## Vista 4: Por Completitud de Datos

| Campo | Completo | Faltante | % Completo |
|-------|----------|----------|------------|
| `question_text` | 1,422 | 0 | 100% |
| `options` (JSONB) | 1,422 | 0 | 100% |
| `explanation` | 1,422 | 0 | 100% |
| `legal_reference` | 1,420 | 2 | 99.9% |
| `tema` | 1,422 | 0 | 100% |
| `difficulty` | 1,422 | 0 | 100% |

---

## Vista 5: Variantes Adaptativas (Piloto)

### Estado del Pipeline de Variantes

| Fase | Estado | Detalles |
|------|--------|---------|
| Diseno del pipeline | COMPLETADO | 3 niveles (L1/L2/L3) documentados en QUALITY_STANDARDS.md |
| Tabla `question_variants` | PENDIENTE | Schema definido, migration no aplicada |
| Seleccion de semillas (10/tema) | PENDIENTE | 160 semillas (10 × 16 temas) |
| Generacion L1 (Haiku) | PENDIENTE | ~160 variantes cosmeticas |
| Generacion L2 (Sonnet) | PENDIENTE | ~160 variantes inversion |
| Generacion L3 (Sonnet) | PENDIENTE | ~160 variantes desde articulo |
| Verificacion Opus | PENDIENTE | ~480 variantes a verificar |
| Confirmacion Tier S | PENDIENTE | Sample 10-20% revision humana |
| Escalado al banco completo | PENDIENTE | ~4,200 variantes adicionales |

### Proyeccion de Banco con Variantes

| Concepto | Cantidad |
|----------|----------|
| Preguntas semilla actuales | 1,422 |
| Variantes piloto (10/tema × 3) | +480 |
| **Subtotal post-piloto** | **1,902** |
| Variantes escalado (~1,262 restantes × 3) | +3,786 |
| **Total proyectado** | **5,688** |

### Coste Estimado

| Fase | Modelo | Items | Coste |
|------|--------|-------|-------|
| Piloto - Generacion L1 | Haiku | 160 | ~$0.05 |
| Piloto - Generacion L2+L3 | Sonnet | 320 | ~$2.00 |
| Piloto - Verificacion | Opus | 480 | ~$4.00 |
| **Piloto total** | | | **~$6.05** |
| Escalado - Generacion | Haiku+Sonnet | ~3,786 | ~$22 |
| Escalado - Verificacion | Opus | ~3,786 | ~$32 |
| **Escalado total** | | | **~$54** |
| **GRAN TOTAL** | | | **~$60** |

---

## Vista 6: Temas Pendientes de Expansion (prioridad)

| Prioridad | Tema | Actual | Necesita | Accion |
|-----------|------|--------|----------|--------|
| P1 | T15 | 7 | +93 | Crear preguntas - tema mas vacio |
| P1 | T6 | 10 | +90 | Crear preguntas desde LPAC/LRJSP |
| P1 | T7 | 10 | +90 | Crear preguntas desde LOPDGDD |
| P1 | T10 | 10 | +90 | Crear preguntas - derechos funcionarios |
| P1 | T12 | 10 | +90 | Crear preguntas - presupuestos |
| P1 | T14 | 10 | +90 | Crear preguntas - derechos funcionarios |
| P1 | T16 | 10 | +90 | Crear preguntas - igualdad/genero |
| P2 | T13 | 16 | +84 | Expandir igualdad LGTBI |
| P2 | T11 | 88 | +12 | Completar Poder Judicial |
| P3 | T5 | 118 | — | OK, posible expansion UE |
| — | T1-T4 | 714 | — | Cobertura suficiente |
| — | T8-T9 | 419 | — | Cobertura suficiente |

**Total preguntas necesarias para llegar a 100/tema:** ~729 preguntas nuevas

> **Nota:** Las preguntas para temas 12-28 estan siendo trabajadas en otra instancia de Claude (Feb 2026).

---

## Reglas de Revision en Cascada

Cuando una pregunta o variante se marca como incorrecta:

1. **Flag individual:** La pregunta/variante se marca `needs_refresh = true`
2. **Cascada automatica:** Todas las variantes del mismo `parent_id` pasan a `cascade_review_pending`
3. **Revision Opus:** Cada sibling es re-verificado por Opus 4.6
4. **Resolucion:** `variant_verified` (pasa) o `variant_rejected` (falla)

**Trigger:** Si el error es en el articulo legal (no redaccion), TODAS las variantes del articulo son sospechosas.

---

## Historial de Cambios

| Fecha | Cambio |
|-------|--------|
| 2026-02-16 | VERIFICACION POR CAPITULO Ley 40/2015: 220/224 verificadas. 4 answers fixed, 12 refs fixed, 2 drift fixed. 207 con cita textual. 3 agentes paralelos (Titulo I + II) |
| 2026-02-15 | RE-ASSESSMENT OPUS 4.6: 1,002/1,120 verificadas. 540 con fuente legal, 460 sin fuente. Explicaciones con «citas textuales». 3 wrong answers corregidas. 56 needs_refresh. 118 pendientes (T1,T4,T5,T8). Backup en questions_pre_reassessment_backup |
| 2026-02-15 | Tracker creado con 6 vistas. Pipeline variantes disenado |
| 2026-02-14 | Migracion 11→16 temas completada. 75 preguntas AI creadas |
| 2026-02-10 | Pipeline calidad Rev.3 completado. 994 reformuladas, 143 flags corregidos |
| 2026-02-07 | Documento QUALITY_STANDARDS.md creado |
