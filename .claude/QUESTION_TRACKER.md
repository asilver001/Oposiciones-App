# Question Tracker - OpositaSmart

> Estado del banco de preguntas actualizado con cada pipeline de calidad.
> Datos de Supabase (tabla `questions` WHERE `is_active = true`).

**Ultima actualizacion:** 2026-02-20
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

| Ley | Total | Verified | Answers Fixed | Refs Fixed | Drift Fixed | Estado |
|-----|-------|----------|---------------|------------|-------------|--------|
| CE | 699 | 699 | 6 | 31 | 7 | COMPLETADO |
| Ley 40/2015 | 230 | 226 | 5 | 15 | 2 | COMPLETADO (4 sin ley) |
| LOTC | 80 | 80 | 3 | 3 | 2 | COMPLETADO |
| LOPJ | 67 | 67 | 1 | 1 | 15 | COMPLETADO |
| Ley 50/1997 | 47 | 47 | 2 | 1 | 1 | COMPLETADO |
| TREBEP | 28 | 25 | 1 | 4 | 2 | COMPLETADO (3 sin ley) |
| LBRL | 23 | 23 | 0 | 3 | 0 | COMPLETADO |
| Ley 39/2015 | 20 | 20 | 1 | 3 | 0 | COMPLETADO |
| Ley 19/2013 | 10 | 10 | 0 | 0 | 1 | COMPLETADO |
| LOPDGDD | 10 | 10 | 0 | 4 | 0 | COMPLETADO |
| LGP | 6 | 6 | 0 | 0 | 0 | COMPLETADO |
| Otra/Sin ref | 202 | 6 | 0 | 0 | 0 | PENDIENTE (~87 sin ley extraida, ~61 no verificables) |
| **TOTAL** | **1,422** | **1,219** | **19** | **65** | **30** | **85.7%** |

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

#### LOTC — Detalles (Feb 19, 2026)

70/70 verified. 55 quotes fixed, 3 answers fixed, 3 refs fixed, 2 drift fixed.
- ID 626: respuesta incorrecta (distribucion asuntos Salas → Pleno establece turno, no Presidente)
- ID 1119: mayoria simple solo para incapacidad e incompatibilidad, no para todos los casos de cese
- ID 658: pregunta defectuosa (ninguna opcion era correcta) → reorientada a caso 5.o (3/4 partes)
- IDs 617/689: Art. 8 → Art. 7.2 (presidencia Sala Primera)
- ID 675: Art. 7 → Art. 6.2 (composicion del Pleno)
- Contradiccion resuelta: IDs 676 vs 1282 (sentencia vs declaracion recurso previo)
- 27 abreviaturas "LOTC" eliminadas de question_text

#### LOPJ — Detalles (Feb 19, 2026)

64/64 verified. 1 answer fixed, 1 ref fixed, 15 drift fixed.
- ID 814: CGPJ tiene 6 comisiones (no 4). Art. 600 → Art. 595
- IDs 1146/1365: "Juzgado de Primera Instancia e Instruccion" → "Tribunal de Instancia" (terminologia vigente)
- 13 preguntas con abreviatura "LOPJ" → "Ley Organica del Poder Judicial"

#### Ley 50/1997 — Detalles (Feb 19, 2026)

43/43 verified. 2 answers fixed, 1 ref fixed, 1 drift fixed.
- ID 435: suplencia Presidente omitia Vicepresidentes (Art. 13)
- ID 725: suspension delegaciones legislativas solo por elecciones generales (Art. 21.6), no "cualquier causa de cese"
- ID 716: Art. 6.3 → Art. 6.2 (requisitos RD Comision Delegada)
- ID 1141: explicacion referenciaba opcion incorrecta + cargo erroneo (Art. 8.1)

#### LBRL + Ley 39/2015 — Detalles (Feb 19, 2026)

43/43 verified (23 LBRL + 20 L39). 1 answer fixed, 6 refs fixed, 7 quotes fixed.
- LBRL: 3 refs corregidas (381: texto completo→cita limpia, 1067: Art. 34.1.d→h, 1391: Art. 35.2.b→35.1)
- L39 ID 305: recurso de reposicion NO pone fin a via administrativa → recurso de alzada si (Art. 114.1.a)
- L39: 3 refs corregidas (306: Art. 33→96.6, 309: Art. 30.1→30.3, 316: Art. 39.1→39.2)

#### TREBEP — Detalles (Feb 19, 2026)

24/24 verified. 1 answer fixed, 4 refs fixed, 2 drift fixed.
- ID 1467: ANSWER_FIXED — reserva de puesto en excedencia cuidado hijo es 2 anos (Art. 89), no 1
- ID 1468: REF_FIXED — servicios especiales es Art. 87 TREBEP, no Art. 86 (que es servicio activo)
- ID 1491: REF_FIXED — prescripcion de faltas es Art. 97, no Art. 95.2
- ID 1493: REF_FIXED — complemento especifico es Art. 24.b, no Art. 24.c (que es productividad)
- ID 1465: REF_FIXED — cese libre designacion, Art. 84.3→Art. 80 (Art. 84 es movilidad voluntaria)
- ID 1458: DRIFT_FIXED — libre designacion puestos "especial responsabilidad y confianza" (Art. 80)
- ID 1494: DRIFT_FIXED — retribuciones basicas son sueldo+trienios (Art. 23), no incluyen pagas extraordinarias como elemento separado

#### CE — Detalles (Feb 19, 2026)

6 agentes paralelos por rango de articulos:
- **CE-1** (Arts 1-55, Titulo Preliminar + Titulo I): 140/140 verified. 1 answer fixed (ID 193), 12 refs cleaned
- **CE-2** (Arts 56-76, Corona + Cortes Generales): 139/139 verified. 9 refs fixed (IDs 637,669,679,680,688,800,812,385,429)
- **CE-3** (Arts 77-96 + Sin Articulo): 83/83 verified. 2 refs fixed (IDs 293,1112) + 9 refs normalized
- **CE-4** (Arts 97-136, Gobierno + Poder Judicial + TC): 113/113 verified. 2 answers fixed (IDs 270,439), 2 quotes fixed, 3 drift fixed, 1 ref fixed
- **CE-5** (Arts 137-152, Organizacion Territorial): 107/107 verified. 1 answer fixed (ID 139), 1 ref fixed, 3 drift fixed, 1 quote fixed
- **CE-6** (Arts 153-169, Reforma + TC): 76/76 verified. 2 answers fixed (IDs 143,150), 6 refs fixed, 1 drift fixed

Hallazgos criticos:
- ID 143: Art. 28.1 esta en Seccion 1a (Arts 15-29) → protegido por Art. 168 (procedimiento agravado), no Art. 167
- ID 150: Art. 21 igual en Seccion 1a → Art. 168 aplica, no Art. 167
- ID 1112: referencia incorrecta Art. 92 (referendum consultivo) → Art. 167.3 (referendum reforma ordinaria)
- ID 688: Art. 62.h CE (Reales Academias) → Art. 53 LOTC (sentencia de amparo) — articulo completamente distinto
- 31 legal_references verbosas limpiadas a formato cita (ej: "Art. 167.3 CE establece que..." → "Art. 167.3 CE")
- Archivo CE incompleto: Arts 81-96 faltan de la extraccion (verificacion manual contra texto constitucional)

#### Ley 19/2013 (Transparencia) — Detalles (Feb 20, 2026)

10/10 verified. 0 answers fixed, 1 drift fixed.
- ID 1484: DRIFT_FIXED — escenario introductorio era sobre demarcacion judicial (LOPJ), completamente incongruente con Ley 19/2013 Art. 10.3 (plazos de resolucion de solicitudes de reutilizacion). Escenario reescrito.

#### LOPDGDD — Detalles (Feb 20, 2026)

10/10 verified. 0 answers fixed, 4 refs fixed.
- ID 1495: REF_FIXED — Art. 13.1 LOPDGDD → Art. 13 LOPDGDD y Art. 15.3 RGPD (formato obligatorio esta en RGPD)
- ID 1496: REF_FIXED — Art. 34.3 LOPDGDD → Art. 36 LOPDGDD y Art. 38.6 RGPD (conflicto interes DPD)
- ID 1498: REF_FIXED — Art. 46.2 LOPDGDD → Art. 47 LOPDGDD y Art. 57 RGPD (funciones AEPD)
- ID 1511: REF_FIXED — Art. 34.1 LOPDGDD → Art. 39 RGPD y Art. 36 LOPDGDD (funciones DPD)
- **Hallazgo:** Archivo `Ley_47_2003_LGP.md` esta mal nombrado — contiene L19/L40/LOPDGDD, no LGP

#### LGP (Ley 47/2003) — Detalles (Feb 20, 2026)

6/6 verified. 0 answers fixed. Verificadas por conocimiento legal (texto LGP no en archivos extraidos).

#### CE + L40 (bare refs recien-taggeadas) — Detalles (Feb 20, 2026)

21/21 verified. 1 answer fixed, 3 refs fixed.
- ID 377: ANSWER_FIXED — plan de actuacion se revisa cada TRES anos (Art. 85 L40), no dos. Opcion b→d
- ID 378: REF_FIXED — Art. 91→Art. 90 L40 (estructura organos gobierno/ejecutivos)
- IDs 442/444: REF_FIXED — Art. 103→Art. 104 L40 (regimen juridico EPE = Derecho privado, no definicion)

---

## Vista 4: Por Completitud de Datos

| Campo | Completo | Faltante | % Completo |
|-------|----------|----------|------------|
| `question_text` | 1,422 | 0 | 100% |
| `options` (JSONB) | 1,422 | 0 | 100% |
| `explanation` | 1,422 | 0 | 100% |
| `legal_reference` | 1,421 | 1 | 99.9% |
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
| 2026-02-20 | Proceso de deteccion de discrepancias disenado: `.claude/questions/DISCREPANCY_PROCESS.md`. Fase 0 SQL checks: 0 problemas estructurales. Top 5 hotspots (51 qs) revisados: 0 contradicciones |
| 2026-02-20 | Quick-win verification: L19(10/10, 1 drift), LOPDGDD(10/10, 4 refs), LGP(6/6), CE+L40 recien-taggeadas(21/21, 1 answer, 3 refs). 22 bare refs clasificados. Total: 1,219/1,422 (85.7%) |
| 2026-02-20 | 251 preguntas 'Otra/Sin ref' clasificadas por ley: ~55 LBRL, ~20 LOREG, ~20 LO 3/1981, ~20 Ley 2/2014, ~43 refs sin nombre de ley. ~87 necesitan extraccion de ley, ~61 no verificables (UE, Agenda 2030) |
| 2026-02-19 | TREBEP verificado: 24/24. 1 answer fixed, 4 refs fixed, 2 drift fixed. CE Arts 81-96 anadidos al archivo de extraccion. Total acumulado: 1,171/1,422 (82.3%) |
| 2026-02-19 | VERIFICACION POR CAPITULO CE: 690/690 verificadas (6 agentes paralelos). 6 answers fixed, 31 refs fixed, 7 drift fixed, 3 quotes fixed. Total acumulado: 1,147/1,422 (80.7%). Pendiente: TREBEP (25), Otra/Sin ref (252) |
| 2026-02-19 | VERIFICACION POR CAPITULO Ronda 2: LOTC(79), LOPJ(67), L50(47), LBRL(23), L39(20) = 236 verificadas. 7 answers fixed, 11 refs fixed, 18 drift fixed. Total acumulado: 489/1422 (34%). Solo CE pendiente (658 qs) |
| 2026-02-16 | VERIFICACION POR CAPITULO Ley 40/2015: 220/224 verificadas. 4 answers fixed, 12 refs fixed, 2 drift fixed. 207 con cita textual. 3 agentes paralelos (Titulo I + II) |
| 2026-02-15 | RE-ASSESSMENT OPUS 4.6: 1,002/1,120 verificadas. 540 con fuente legal, 460 sin fuente. Explicaciones con «citas textuales». 3 wrong answers corregidas. 56 needs_refresh. 118 pendientes (T1,T4,T5,T8). Backup en questions_pre_reassessment_backup |
| 2026-02-15 | Tracker creado con 6 vistas. Pipeline variantes disenado |
| 2026-02-14 | Migracion 11→16 temas completada. 75 preguntas AI creadas |
| 2026-02-10 | Pipeline calidad Rev.3 completado. 994 reformuladas, 143 flags corregidos |
| 2026-02-07 | Documento QUALITY_STANDARDS.md creado |
