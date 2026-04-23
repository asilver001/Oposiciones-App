---
name: question-crafting
description: Standards and verified examples for creating high-quality oposiciones questions. Use when generating new questions or reformulating existing ones.
---

# Question Crafting — Estándares de Calidad

Cómo crear preguntas de calidad tipo Tier S para OpositaSmart. Basado en feedback de opositores reales que verificaron las preguntas contra el BOE.

## Los 7 principios de una pregunta bien hecha

### 1. Estilo: austero por defecto, narrativo solo con dato concreto

**Regla:** empieza por "Según el artículo X de [ley]…" directo. Añade narrativa **solo** cuando el escenario aporta un dato concreto que la pregunta necesita.

**Sí usar narrativa cuando:**
- El escenario **aporta un dato** que cambia la respuesta (ej: "Un municipio tiene 18.000 habitantes. Según el Art. 26 LBRL, ¿qué servicio NO está obligado a prestar?")
- **Dos supuestos de hecho distintos** que el opositor debe comparar (ej: "Un RD crea una Dirección General permitiendo titular no-funcionario y otro pretende hacer lo mismo con una Subsecretaría…")

**NO usar narrativa cuando:**
- Preguntas sobre definiciones, plazos, mayorías, composición de órganos
- El "escenario" solo es decoración ("Un opositor estudia la composición del CGPJ…")
- Un enunciado directo funciona igual o mejor

**Jerarquía de estilos** (prioridad descendente):

| Estilo | Cuándo | Ejemplo |
|---|---|---|
| **Austero directo** | Hecho jurídico puro (plazo, mayoría, sujeto, definición) | "Según el Art. 27 CE, la enseñanza básica es:" |
| **Austero inverso** | El artículo contiene ≥3 datos verdaderos que el opositor debe memorizar en bloque | "Señale la incorrecta respecto al CGPJ (composición + mandato + presidencia + nombramiento):" |
| **Narrativa con dato** | Escenario añade variable que cambia la respuesta | "Un municipio tiene 18.000 hab. Según Art. 26 LBRL…" |
| **Narrativa escenario dual** | Comparar dos supuestos o dos vías procedimentales | "Un Gobierno autonómico aprueba simultáneamente un reglamento y una ley…" |

**Regla crítica para decidir entre directo e inverso** (evita sesgo del modelo):

| Situación | Estilo correcto |
|---|---|
| El artículo da UN dato concreto (plazo, mayoría, órgano competente, sujeto activo) | **Directa** — pregunta directamente por ese dato |
| El artículo enumera composición + mandato + forma de elección + órgano rector | **Inversa** — "señale la incorrecta" sobre el conjunto |
| El artículo tiene varias competencias enumeradas (letras a/b/c/d) | **Directa** — "¿cuál de las siguientes es competencia del X?" con 3 distractores del artículo par |
| El artículo tiene un listado taxativo con excepciones | **Directa o inversa**, ambas válidas; preferir la forma del examen oficial si se conoce |

**Anti-sesgo:** si puedes hacer la pregunta directa sin sacrificar dificultad, hazla directa. La inversa solo aporta valor cuando el opositor debe recordar múltiples datos del artículo en su conjunto (composición CGPJ, composición TC, etc.). Para datos únicos, usar inversa es artificial y se aleja del estilo AGE oficial.

❌ Forzado: "Un opositor estudia la estructura AGE. Según el Art. 55.3 LRJSP…"
✅ Directo: "Según el Art. 55.3 de la Ley 40/2015, ¿cuál es órgano SUPERIOR (no directivo)?"

❌ Inversa artificial: "Señale la incorrecta sobre la prescripción de las infracciones muy graves" (solo hay UN dato: 3 años)
✅ Directa: "¿En qué plazo prescriben las infracciones muy graves según el Art. 97 TREBEP?"

### 2. Cita explícita del artículo

Siempre mencionar el artículo específico en el enunciado cuando sea posible.

✅ "Según el artículo 21 de la Ley Orgánica 3/1980, del Consejo de Estado..."
✅ "Conforme al artículo 20.3 de la Ley 50/1997, del Gobierno..."
✅ "Según el artículo 26 de la LBRL..."

**Por qué:** Enseña al opositor a ubicar la norma, no solo a adivinar.

### 3. Distractores plausibles con mecánica clara

Cada opción incorrecta debe ser:
- **Plausible** — no obviamente falsa
- **Verificable** — basada en un detalle concreto del BOE
- **Útil pedagógicamente** — su incorrección enseña algo

❌ **Distractor malo** (obviamente falso): "500 vocales"
✅ **Distractor bueno** (confusión común): "mandato de cuatro años" cuando son cinco

### 4. Explicación pedagógica con cita textual

El campo `explanation` debe seguir este formato:

```
📖 Art. XXX.X [Ley]: «[cita literal del BOE]» — [por qué la opción incorrecta es incorrecta].
```

Ejemplos:
- `📖 Art. 122.3 CE: «veinte miembros nombrados por el Rey por un período de cinco años» — no cuatro.`
- `📖 Art. 20.3 Ley 50/1997: «Son indelegables [...] las de nombramiento y separación de los altos cargos atribuidas al Consejo de Ministros.»`

### 5. Distinguir entre normas similares

Muchas preguntas buenas se basan en confundir fácilmente dos cosas parecidas:
- Pleno vs Comisión Permanente del Consejo de Estado (Art. 21 vs Art. 22 LO 3/1980)
- Competencias delegables vs indelegables (Art. 20.3 Ley 50/1997)
- Servicios municipales según tramo de habitantes (Art. 26 LBRL)
- CGPJ (5 años) vs Gobierno (4 años) vs TC (9 años)

### 6. Precisión técnica del enunciado (PRECISION_TEST)

**Regla (feedback real opositor 2026-04-20):** el enunciado NO puede asumir contexto implícito. Cada término jurídicamente relevante debe estar explicitado. Si eliminas una palabra y el enunciado pasa de tener una sola respuesta correcta a tener varias (o ninguna), esa palabra **falta** y la pregunta es imprecisa.

**Test de precisión (aplicar antes de publicar):**

1. **Test del complemento directo ausente**: si la pregunta menciona un plazo/efecto/consecuencia, ¿está claro de QUÉ?
   - ❌ "¿Qué plazo para ratificar o levantar la suspensión?" → ¿la suspensión de qué?
   - ✅ "¿Qué plazo para ratificar o levantar la suspensión **de la disposición o resolución recurrida**?"

2. **Test del régimen especial ausente**: si la respuesta depende de estar en un régimen especial (gran población, estado alarma, procedimiento abreviado), el régimen debe nombrarse.
   - ❌ "¿Qué requisito adicional exige el Art. 121.1 LBRL?" → requisito ¿para qué?
   - ✅ "¿Qué requisito adicional se exige **para la aplicación del régimen de municipios de gran población**?"

3. **Test del rango normativo ausente**: si la vía procedimental depende del rango de la norma (ley vs reglamento vs acto), el enunciado debe precisar el rango.
   - ❌ "El Gobierno central impugna un decreto autonómico vía Art. 161.2 CE" → ¿decreto-ley (rango de ley, iría por 161.1.a)? ¿decreto reglamentario (sin rango de ley, sí va por 161.2)?
   - ✅ "El Gobierno central impugna una **disposición reglamentaria sin rango de ley** del Gobierno autonómico vía Art. 161.2 CE"

4. **Test de la acción sin sujeto activo**: ¿quién hace qué queda claro?
   - ❌ "Se aprueba el presupuesto" → ¿quién lo aprueba? ¿inicial o definitivamente?
   - ✅ "La Junta de Gobierno Local aprueba **el proyecto** de presupuesto"

**Aplicación al crear preguntas:** tras redactar el enunciado, releer subrayando cada sustantivo clave y preguntarse "¿un opositor con conocimiento parcial podría marcar otra opción por ambigüedad del enunciado?". Si la respuesta es sí → precisión faltante.

**Aplicación a modelos:** tanto Sonnet como Opus tienden a asumir contexto cuando el tema está en su cabeza. Esta regla es **especialmente crítica** para Sonnet, que es más propenso a enunciados parcos.

### 7. Matices inter-procedimentales (MATIZ_TEST)

**Regla (feedback real profesor de oposiciones 2026-04-23):** un artículo rara vez vive aislado. Muchos preceptos son **"apéndices" o "herramientas"** que se activan o modifican al combinarse con otros procedimientos. Una pregunta que solo cubre el literal del artículo se queda **corta** cuando ese precepto forma parte de un sistema mayor con variantes de legitimado/objeto/plazo/efecto.

**Patrón paradigmático — Art. 161.2 CE:**

El 161.2 CE parece regular un único procedimiento (impugnación gubernamental directa con suspensión). En realidad es una **herramienta de suspensión** que se engancha a tres vías distintas, cada una con legitimados y objetos diferentes:

| Vía | Contra qué | Legitimado | Regla general | Si invoca 161.2 |
|-----|-----------|------------|---------------|-----------------|
| Impugnación directa (Art. 76 LOTC) | Disposiciones y resoluciones autonómicas **sin** rango de ley | Solo Gobierno | — | Suspensión automática intrínseca (5 meses) |
| Recurso de inconstitucionalidad (161.1.a CE) | Normas **con** rango de ley | Presidente Gob., Defensor, 50 dip., 50 sen., ejecutivos autonómicos, Asambleas | NO suspende | Si recurre el Gobierno → suspensión automática |
| Conflicto positivo de competencias (Arts. 60-72 LOTC) | Disposiciones sin rango de ley con problema competencial | Gobierno o ejecutivos autonómicos | NO suspende | Si Gobierno invoca → suspensión automática |

Una pregunta solo sobre el literal del 161.2 CE cubre la primera fila y se pierde las otras dos. **La pregunta Tier S+ captura el matiz**.

**Test del matiz (aplicar antes de cerrar el lote de preguntas):**

1. **Test del apéndice**: ¿este artículo/precepto puede INVOCARSE dentro de otro procedimiento distinto? ¿Qué cambia (legitimados, plazo, objeto, efecto)?
2. **Test del desarrollo normativo**: ¿la CE remite a una LO/ley ordinaria que desarrolla aspectos concretos? ¿Hay reglas que están en la ley de desarrollo y no en la CE?
3. **Test de la reforma**: ¿el artículo ha sido modificado/condicionado por una reforma posterior (LRSAL 2013, reformas CE) o por jurisprudencia del TC? ¿El texto vigente difiere del "aprendido de memoria"?
4. **Test de la confusión por rango**: ¿cambia la respuesta según el rango de la norma impugnada/afectada (ley vs reglamento vs acto)?

Si respondes **sí** a cualquiera de los 4 tests → el artículo tiene matiz inter-procedimental y el lote debe incluir **al menos 1 pregunta que explote ese matiz** (no solo preguntas literales).

**Regla operativa (protocolo obligatorio al crear ≥3 preguntas sobre un artículo):**

```
1. Leer el literal del artículo (archivo local o BOE fetch)
2. Aplicar MATIZ_TEST (4 preguntas arriba)
3. Si hay matiz:
   a) Generar 2-3 preguntas directas sobre el literal (principios 1-6)
   b) Generar al menos 1 pregunta narrativa que active el matiz
   c) En explanation de la de matiz, citar AMBOS artículos (base + desarrollador)
4. Si no hay matiz: proceder como de costumbre
```

**Consulta obligatoria a la BD antes de generar**: las preguntas de exámenes reales ya incorporadas (1.400+) son regression test. Query:
```sql
SELECT id, question_text, legal_reference, explanation
FROM questions WHERE legal_reference ILIKE '%Art. X%' AND is_active=true;
```
Si una pregunta existente explora un matiz (suele mostrarlo en el `legal_reference` con notación `Art. X CE + Art. Y LO/Ley`), añadir ese matiz a la tabla MATIZ_TABLE de este skill.

### MATIZ_TABLE — artículos con matices inter-procedimentales detectados

Esta tabla crece con cada sesión. Cuando generes preguntas, si el artículo aparece aquí, es **obligatorio** crear al menos 1 pregunta que capture el matiz.

| Artículo base | Matiz / conexión | Ley/artículo que lo activa | Qué cambia |
|---------------|------------------|--------------------------|------------|
| Art. 161.2 CE | Apéndice a recurso de inconstitucionalidad (161.1.a) | Art. 30 LOTC | Si Gobierno recurre ley autonómica e invoca 161.2 → suspensión 5m |
| Art. 161.2 CE | Apéndice a conflicto positivo de competencias | Arts. 60-72 LOTC | Si Gobierno invoca 161.2 → suspensión 5m en el conflicto |
| Art. 161.2 CE | Impugnación directa vs otras vías: qué rango tiene la norma | Arts. 76-77 LOTC | Rango de ley → por 161.1.a; sin rango → por 161.2 directo |
| Art. 149 CE | Delegación de competencias estatales a CCAA | Art. 150.2 CE | El Estado PUEDE delegar por ley orgánica competencias exclusivas |
| Art. 13 LBRL | Creación/supresión de municipios | Ley 27/2013 LRSAL | Reforma 2013 endureció requisitos (5.000 hab. mínimo) |
| Art. 13 LBRL | Fusión voluntaria | Art. 13.4-6 LBRL | Efectos especiales (financiación reforzada durante 5 años) |
| Art. 21 LBRL | Atribuciones Alcalde vs régimen gran población | Art. 124 LBRL (Título X) | En gran población las atribuciones del Alcalde se redistribuyen |
| Art. 22 LBRL | Atribuciones Pleno vs régimen gran población | Art. 123 LBRL (Título X) | En gran población el Pleno pierde/gana competencias |
| Art. 20 LBRL | Órganos obligatorios + facultativos | Art. 122 LBRL | En gran población hay órganos adicionales obligatorios (JGL, distritos) |
| Art. 36 LBRL | Competencias Diputación vs CCAA uniprovinciales | D.A. 3ª LBRL | En CCAA uniprovinciales la Diputación se sustituye por la CA |
| Art. 99 CE | Investidura (mayoría absoluta solo 1ª votación) vs moción censura (absoluta siempre) | Art. 113 CE | En moción censura siempre se requiere mayoría absoluta |
| Art. 116.2 CE | Estado de alarma vs excepción vs sitio | Arts. 116.3 y 116.4 CE | Distintos plazos, órganos autorizantes y mayorías |
| Art. 25 LBRL | Competencia propia del municipio ≠ servicio obligatorio | Art. 26 LBRL | 25 define ámbitos competenciales; 26 lista servicios obligatorios por tramo |
| Art. 47 LPAC | Nulidad de pleno derecho | Art. 48 LPAC | 47 taxativa; 48 anulabilidad residual por defecto de forma con indefensión |
| Art. 121 LPAC | Recurso de alzada | Art. 123 LPAC | Alzada ante superior jerárquico; reposición ante mismo órgano |

**Regla de mantenimiento**: al cerrar una sesión de generación de preguntas, si detectas un matiz nuevo no listado → añádelo a esta tabla con PR al skill.

## Ejemplos canónicos verificados

### Ejemplo 1 — CE: Mandato vocales CGPJ (Tier S)

> Señale la incorrecta respecto al CGPJ:
>
> a) Está integrado por veinte vocales, además del Presidente
> b) El mandato de los vocales tiene una duración de cuatro años ✅
> c) Lo preside el Presidente del Tribunal Supremo
> d) Los vocales son nombrados por Real Decreto con el refrendo del Ministro de Justicia
>
> 📖 Art. 122.3 CE: «veinte miembros nombrados por el Rey por un período de cinco años» — no cuatro.

**Por qué Tier S:** Enunciado directo + pregunta inversa ("incorrecta") + trampa basada en confusión 4/5 años + cita literal del BOE.

**Nota:** La contextualización narrativa ("Un opositor estudia...") no siempre es necesaria. Cuando la trampa es clara y el artículo es central, un enunciado directo tipo "Señale la incorrecta respecto a X" funciona igual de bien y es más limpio.

### Ejemplo 2 — Consejo de Estado: Pleno vs Permanente (Tier S)

> Según el artículo 21 de la Ley Orgánica 3/1980, del Consejo de Estado, ¿cuál de los siguientes asuntos es competencia del Pleno del Consejo de Estado?
>
> a) Proyectos de Decretos legislativos ✅
> b) [Opción redactada literalmente según Art. 22 — competencia de la Permanente]
> c) [Opción redactada literalmente según Art. 22]
> d) [Opción redactada literalmente según Art. 22]
>
> 📖 Art. 21 LO 3/1980. Las opciones B, C y D son competencias de la Comisión Permanente (Art. 22).

**Por qué Tier S:** Cita artículo específico + obliga a distinguir Pleno vs Permanente (confusión habitual).

**Regla aplicada:** Las opciones incorrectas deben citarse **literalmente tal como vienen en el artículo correspondiente**. Si una opción describe una competencia de la Comisión Permanente pero no usa las palabras exactas del Art. 22, el opositor experto podría descartarla por redacción — o peor, dudar si realmente existe. Siempre copiar textualmente del BOE.

**Regla aplicada (2):** Evitar la palabra "consultiva" en el enunciado si el artículo ya presupone que son competencias consultivas. La palabra sobra y añade ruido.

### Ejemplo 3 — LBRL: Servicios municipales (Tier S)

> Un municipio tiene 18.000 habitantes. Según el artículo 26 de la LBRL, ¿cuál de los siguientes servicios NO tiene obligación de prestar?
>
> a) Prevención y extinción de incendios ✅
> b) Biblioteca pública
> c) Pavimentación de las vías públicas
> d) Tratamiento de residuos
>
> 📖 Art. 26.1 LBRL: la prevención y extinción de incendios es obligatoria desde **20.000 habitantes**. Biblioteca pública y tratamiento de residuos son obligatorios desde 5.000 hab. Pavimentación es obligatoria en todos los municipios. 18.000 < 20.000, por eso no hay obligación.

**Por qué Tier S:** Escenario con dato concreto (18.000 hab.) + obliga a memorizar los tramos reales.

**Regla aplicada:** Nunca poner la pista de la respuesta entre paréntesis en las opciones. Si una opción dice "Biblioteca pública (obligatoria desde 5.000 habitantes)", el opositor no tiene que saber los tramos — solo hacer aritmética. Los tramos van **en la explicación, no en las opciones**. Así la pregunta mide conocimiento real.

### Ejemplo 4 — Ley del Gobierno: Competencias indelegables (Tier S)

> Conforme al artículo 20.3 de la Ley 50/1997, del Gobierno, las competencias del Consejo de Ministros relativas al nombramiento y separación de altos cargos:
>
> a) No son delegables en ningún caso ✅
> b) Son delegables en las Comisiones Delegadas del Gobierno, previo acuerdo del CM
> c) Son delegables en el Presidente del Gobierno por razones de urgencia
> d) Son delegables en cada Ministro para los altos cargos de su respectivo Departamento
>
> 📖 Art. 20.3 Ley 50/1997: «Son indelegables [...] las de nombramiento y separación de los altos cargos atribuidas al Consejo de Ministros.»

**Por qué Tier S:** Los distractores son excepciones plausibles (previo acuerdo, urgencia, ministros de ramo) que un opositor podría considerar razonables. La respuesta absoluta ("ningún caso") se verifica con la cita textual "Son indelegables".

## Checklist antes de publicar una pregunta

**Bloque A — Estructura (Principios 1-5)**
```
[ ] Cita del artículo en el enunciado (P2)
[ ] 4 distractores plausibles con mecánica clara (P3)
[ ] Explicación con cita literal BOE entre «...» y razón de cada distractor (P4)
```

**Bloque B — Fidelidad BOE (R1-R5)**
```
[ ] El artículo citado existe y está vigente (fetch local o BOE)
[ ] La respuesta correcta aparece LITERALMENTE en el texto legal
[ ] Si "señale la INCORRECTA": la marcada is_correct:true es la falsa
```

**Bloque C — Precisión (Principio 6)**
```
[ ] PRECISION_TEST: 4 tests aplicados (complemento directo, régimen especial, rango normativo, sujeto activo)
```

**Bloque C bis — Matices inter-procedimentales (Principio 7, aplicar si lote ≥3 preguntas sobre UN artículo)**
```
[ ] MATIZ_TEST: 4 tests aplicados (apéndice, desarrollo normativo, reforma, confusión por rango)
[ ] Consultada la BD por preguntas existentes del artículo para detectar matices ya explorados
[ ] Si hay matiz en MATIZ_TABLE → al menos 1 pregunta del lote lo captura (narrativa cross-artículo)
```

**Bloque D — Coherencia final (Patrones 10, 11 + smoke test)**
```
[ ] SMOKE TEST: leer la explicación; ¿nombra la MISMA letra que tiene is_correct:true?
[ ] Explicación NO contiene "también son correctas" / "todas son válidas"
[ ] Cada distractor is_correct:false es falso según BOE (no supuesto verdadero mal marcado)
```

## Errores comunes a evitar

| Error | Ejemplo | Fix |
|-------|---------|-----|
| Distractor obvio | "500 vocales" | Usar número plausible: "cuatro años" (vs cinco) |
| Pregunta genérica | "¿Cuántos vocales?" | "Señale la incorrecta respecto al CGPJ" |
| Sin cita de artículo | "¿El Gobierno puede delegar...?" | "Conforme al Art. 20.3 Ley 50/1997..." |
| Explicación sin cita | "La respuesta es B" | "📖 Art. 20.3: «Son indelegables...»" |
| Opciones sin mecánica | Cuatro frases al azar | Cada distractor basado en confusión real |
| Absolutismo sin base | "En ningún caso" inventado | Verificar que el BOE dice "indelegable" / "en ningún caso" |
| **Pista entre paréntesis** | "Biblioteca pública (obligatoria desde 5.000 hab)" | Quitar el paréntesis — el dato va en la explicación |
| **Distractor reformulado** | Parafrasear competencias del Art. 22 | Copiar **literalmente** del artículo que corresponde |
| **Palabras redundantes** | "competencia consultiva" cuando el Art. ya es consultivo | Simplificar: "competencia del Pleno" |
| **legal_reference incorrecto** | Respuesta es Título I pero `legal_reference` dice "Título VIII" | `legal_reference` debe apuntar al artículo que FUNDAMENTA la respuesta correcta, no a lo que se desmiente |
| **Terminología doctrinal inventada** | "¿cuál es el órgano colegiado encargado...?" cuando el BOE no usa esa expresión | Usar terminología literal del BOE. No meter conceptos doctrinales que el artículo no emplea |
| **Distractor typo-looking** | "manifiestamente competente" (vs "incompetente" del BOE) | Evitar distractores que parezcan erratas. Usar opciones claramente distintas (ej: anulabilidad vs nulidad) |
| **Explicación <80 chars** | "El silencio no elimina el deber de resolver." | Incluir siempre cita literal del BOE entre «...» y explicar por qué los distractores están mal |
| **Frase meta en enunciado** | "...señale el medio correcto que suele plantear el examen" | El enunciado debe preguntar por el contenido, no hacer meta-referencias al examen |

## 📂 Protocolo preferido: archivo local → BOE fallback

**ANTES de hacer WebFetch**, verifica si tenemos el texto de la ley guardado localmente:

### Archivos locales disponibles (10 leyes)

Carpeta: `c:\Users\alber\OpositaSmart\.claude\questions\Temario\leyes\`

| Archivo | Ley | Artículos | Tema AGE |
|---|---|---|---|
| `CE_Constitucion_Espanola.md` | Constitución Española 1978 | Arts. 1-169 | 1-4 |
| `LRJSP_Ley_40_2015.md` | Ley 40/2015 LRJSP | Arts. 1-158 | 5, 7, 8, 11 |
| `LPAC_Ley_39_2015.md` | Ley 39/2015 LPAC | Arts. 1-133 | 9 |
| `LBRL_Ley_7_1985.md` | Ley 7/1985 LBRL | Arts. 1-141 | 9 |
| `TREBEP_RDLeg_5_2015.md` | RDLeg 5/2015 TREBEP/EBEP | Arts. 1-100 | 10 |
| `Ley_Gobierno_50_1997.md` | Ley 50/1997 del Gobierno | Arts. 1-29 | 5 |
| `LOTC_LO_2_1979.md` | LO 2/1979 Tribunal Constitucional | Arts. 1-102 | 4 |
| `LOPJ_LO_6_1985.md` | LO 6/1985 Poder Judicial | Arts. 1-642 | 4 |
| `LO_Consejo_Estado_3_1980.md` | LO 3/1980 Consejo de Estado | Arts. 1-27 | 4 |
| `EOMF_Ley_50_1981.md` | Ley 50/1981 Estatuto Orgánico Ministerio Fiscal | Arts. 1-72 | 4 |

**Total**: ~14.700 líneas, 1.617 KB, 1.289 artículos verbatim del BOE.

### Flujo preferido

1. **Primero**: busca el artículo en el archivo local con Read tool
2. **Si está**: cita verbatim + marca `auto_validated` con `verification_notes: "Fetch local desde <archivo>.md (consolidado BOE <fecha>)"`
3. **Si NO está** (ley no descargada): usa el protocolo WebFetch (siguiente sección)

### Ventajas del archivo local

- ✅ **Sin truncamiento** (BOE online trunca leyes largas)
- ✅ **Sin dependencia** de URLs del BOE
- ✅ **Más rápido** (Read local vs WebFetch)
- ✅ **Consolidado verificado** (fecha concreta de consolidación)

### Mantenimiento

Los archivos se actualizan cuando:
- GitHub Action mensual detecta divergencia con el BOE
- Manualmente cuando salga una reforma legal importante
- Tras re-descarga periódica (anual recomendado)

## 🔁 Protocolo obligatorio de reformulación (con BOE)

Si tienes acceso a WebFetch, ESTE es el flujo que debes seguir. NO reformules sin completar los 4 pasos:

### Paso 1 — Identificar la ley y el ID BOE
Del `legal_reference` original (o del enunciado), identifica:
- Qué ley es (consulta la lista canónica R2)
- Qué artículo y apartado cita
- Qué ID de BOE corresponde (consulta la tabla "IDs BOE Correctos" más abajo)

### Paso 2 — Fetch del artículo
Usa WebFetch con la URL principal. Si no devuelve el articulado, prueba las alternativas:
1. `https://www.boe.es/buscar/act.php?id=<ID>` (principal)
2. `https://www.boe.es/buscar/doc.php?id=<ID>` (alternativa para artículos extensos)
3. `https://www.boe.es/eli/es/<tipo>/<YYYY>/<MM>/<DD>/<N>/con` (ELI consolidada)

En el prompt de WebFetch, pide EXPLÍCITAMENTE el texto literal del artículo y apartado exacto que te interesa.

### Paso 3 — Verificar coherencia original vs BOE
Compara la respuesta correcta del original contra el texto literal fetcheado:

- **Si coinciden**: reformula con cita verbatim → `auto_validated`
- **Si divergen en redacción** pero el fondo es correcto: reformula con texto literal → `auto_validated`
- **Si divergen en el FONDO** (la respuesta marcada está mal): marca como `needs_correction` y explica qué dice el BOE realmente. NO la publiques hasta revisión humana.

### Paso 4 — Construir la reformulación
Usa el texto verbatim entre «...» en la explicación. Estructura según los ejemplos canónicos.

### ⚠️ Si el fetch falla
- URL devuelve 404 / página vacía / "texto no disponible" → probar las 3 URLs alternativas
- Todas fallan → marca `requires_boe_verification` y delega al verificador humano
- NO inventes el texto del BOE por memoria — eso viola R1

## 🚨 Reglas Críticas Anti-Alucinación (leer PRIMERO)

Estas 5 reglas son OBLIGATORIAS. Si no se cumplen, la pregunta NO se publica — aunque todo lo demás sea perfecto.

### R1. NUNCA inventar citas del BOE

**Prohibido absolutamente:** poner texto entre «...» que no hayas verificado literalmente contra el BOE. No "parafrasear con comillas". No reconstruir "por lo que debería decir".

**Si no puedes fetch del BOE:**
- Opción A: usar `[cita pendiente de verificación]` en la explicación
- Opción B: no poner cita literal; solo decir "según el Art. X..."
- Opción C: rechazar la reformulación y flaggear la pregunta

**Ejemplo de alucinación real detectada:**
- Haiku inventó: `«El territorio, la población y la organización constituyen los elementos del municipio»` como cita del Art. 11 LBRL. El Art. 11 LBRL **no dice eso literalmente**.
- Haiku inventó el nombre de la LO 2/1980 como "Ley Orgánica de Estatutos de Autonomía" (es la del Tribunal Constitucional).

### R2. Nombres CANÓNICOS de leyes (lista obligatoria)

**Antes de escribir el nombre de cualquier ley**, usa exactamente el nombre de esta lista. Nombres distintos = alucinación.

**Leyes Orgánicas:**
- **LO 2/1979** — del Tribunal Constitucional (LOTC)
- **LO 2/1980** — sobre regulación de las distintas modalidades de referéndum
- **LO 3/1980** — del Consejo de Estado
- **LO 5/1985** — del Régimen Electoral General (LOREG)
- **LO 6/1985** — del Poder Judicial (LOPJ)
- **LO 6/2001** — de Universidades
- **LO 3/2007** — para la igualdad efectiva de mujeres y hombres
- **LO 3/2018** — de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD)

**Leyes Ordinarias administrativas (las que más aparecen en oposiciones):**
- **Ley 7/1985** — **Reguladora de las Bases del Régimen Local** (LRBRL o LBRL)
  - ⚠️ NO es "Ley Básica de Régimen Local" (nombre inventado frecuente)
- **Ley 50/1997** — del Gobierno
- **Ley 19/2013** — de transparencia, acceso a la información pública y buen gobierno
- **Ley 39/2015** — del Procedimiento Administrativo Común de las Administraciones Públicas (LPAC)
- **Ley 40/2015** — de Régimen Jurídico del Sector Público (LRJSP)
- **RDLeg 5/2015** — Texto Refundido del Estatuto Básico del Empleado Público (TREBEP o EBEP)
- **Ley 19/2013** — de transparencia (LTBG)
- **Ley 27/2013** — de Racionalización y Sostenibilidad de la Administración Local (LRSAL)

**Constituciones y Tratados:**
- **CE** — Constitución Española de 1978
- **TFUE** — Tratado de Funcionamiento de la Unión Europea
- **TUE** — Tratado de la Unión Europea

**Si una ley NO aparece en esta lista**, NO la cites por nombre — usa solo el número (ej: "Ley 12/2007, sobre X [verificar título]") y flaggéala como pendiente de verificación.

### R6. Criterio "pregunta lista para publicar"

Una pregunta SOLO se puede marcar como **lista para publicar / 100% bien / auto_validated** si se cumple UNA de estas dos condiciones:

**Condición A — Verificación por fetch del BOE:**
- Se ha hecho fetch del artículo citado en `https://www.boe.es/buscar/act.php?id=...`
- Se ha localizado el apartado exacto (ej: Art. 42.3)
- La cita entre «...» es TEXTO LITERAL copiado del BOE verbatim
- La respuesta correcta aparece LITERALMENTE en ese texto

**Condición B — Ejemplo canónico del skill:**
- La cita proviene de un ejemplo ya verificado en este skill (sección "Ejemplos canónicos Tier S")

**Artículos pre-verificados (Condición B):** Si tu pregunta cita uno de estos artículos y usa el texto literal verificado, puedes marcarla como `auto_validated`:

| Artículo | Cita verificada (texto literal BOE) |
|---|---|
| Art. 122.3 CE | «El Consejo General del Poder Judicial estará integrado por el Presidente del Tribunal Supremo, que lo presidirá, y por veinte miembros nombrados por el Rey por un período de cinco años» |
| Art. 124.1 CE | «El Ministerio Fiscal, sin perjuicio de las funciones encomendadas a otros órganos, tiene por misión promover la acción de la justicia en defensa de la legalidad, de los derechos de los ciudadanos y del interés público tutelado por la ley» |
| Art. 125 CE | «Los ciudadanos podrán ejercer la acción popular y participar en la Administración de Justicia mediante la institución del Jurado, en la forma y con respecto a aquellos procesos penales que la ley determine, así como en los Tribunales consuetudinarios y tradicionales» |
| Art. 21 LO 3/1980 | Proyectos de Decretos legislativos (competencia del Pleno) |
| Art. 22 LO 3/1980 | Reglamentos, revisión de oficio, indemnizaciones (competencia Permanente) |
| Art. 26.1 LBRL | Servicios municipales por tramos (biblioteca 5.000, incendios 20.000) |
| Art. 20.3 Ley 50/1997 | «No son en ningún caso delegables las siguientes competencias: a) Las atribuidas directamente por la Constitución. b) Las relativas al nombramiento y separación de los altos cargos atribuidas al Consejo de Ministros. c) Las atribuidas a los órganos colegiados del Gobierno [...]. d) Las atribuidas por una ley que prohíba expresamente la delegación» |
| Art. 1.1 CE | «España se constituye en un Estado social y democrático de Derecho, que propugna como valores superiores de su ordenamiento jurídico la libertad, la justicia, la igualdad y el pluralismo político» |
| Art. 1.2 CE | «La soberanía nacional reside en el pueblo español, del que emanan los poderes del Estado» |
| Art. 1.3 CE | «La forma política del Estado español es la Monarquía parlamentaria» |
| Art. 2 CE | «La Constitución se fundamenta en la indisoluble unidad de la Nación española, patria común e indivisible de todos los españoles, y reconoce y garantiza el derecho a la autonomía de las nacionalidades y regiones que la integran y la solidaridad entre todas ellas» |
| Art. 3.1 CE | «El castellano es la lengua española oficial del Estado. Todos los españoles tienen el deber de conocerla y el derecho a usarla» |
| Art. 10.1 CE | «La dignidad de la persona, los derechos inviolables que le son inherentes, el libre desarrollo de la personalidad, el respeto a la ley y a los derechos de los demás son fundamento del orden político y de la paz social» |
| Art. 14 CE | «Los españoles son iguales ante la ley, sin que pueda prevalecer discriminación alguna por razón de nacimiento, raza, sexo, religión, opinión o cualquier otra condición o circunstancia personal o social» |
| Art. 15 CE | «Todos tienen derecho a la vida y a la integridad física y moral, sin que, en ningún caso, puedan ser sometidos a tortura ni a penas o tratos inhumanos o degradantes. Queda abolida la pena de muerte, salvo lo que puedan disponer las leyes penales militares para tiempos de guerra» |
| Art. 17.2 CE | «La detención preventiva no podrá durar más del tiempo estrictamente necesario [...] y, en todo caso, en el plazo máximo de setenta y dos horas, el detenido deberá ser puesto en libertad o a disposición de la autoridad judicial» |
| Art. 23.1 CE | «Los ciudadanos tienen el derecho a participar en los asuntos públicos, directamente o por medio de representantes, libremente elegidos en elecciones periódicas por sufragio universal» |
| Art. 53.2 CE | «Cualquier ciudadano podrá recabar la tutela de las libertades y derechos reconocidos en el artículo 14 y la Sección primera del Capítulo segundo ante los Tribunales ordinarios [...] y, en su caso, a través del recurso de amparo ante el Tribunal Constitucional» |
| Art. 56.1 CE | «El Rey es el Jefe del Estado, símbolo de su unidad y permanencia, arbitra y modera el funcionamiento regular de las instituciones, asume la más alta representación del Estado español en las relaciones internacionales» |
| Art. 66.1 CE | «Las Cortes Generales representan al pueblo español y están formadas por el Congreso de los Diputados y el Senado» |
| Art. 68.1 CE | «El Congreso se compone de un mínimo de 300 y un máximo de 400 Diputados, elegidos por sufragio universal, libre, igual, directo y secreto, en los términos que establezca la ley» |
| Art. 69.1 CE | «El Senado es la Cámara de representación territorial» |
| Art. 81.2 CE | «La aprobación, modificación o derogación de las leyes orgánicas exigirá mayoría absoluta del Congreso, en una votación final sobre el conjunto del proyecto» |
| Art. 86.1 CE | «En caso de extraordinaria y urgente necesidad, el Gobierno podrá dictar disposiciones legislativas provisionales que tomarán la forma de Decretos-leyes [...]» |
| Art. 97 CE | «El Gobierno dirige la política interior y exterior, la Administración civil y militar y la defensa del Estado. Ejerce la función ejecutiva y la potestad reglamentaria de acuerdo con la Constitución y las leyes» |
| Art. 98.1 CE | «El Gobierno se compone del Presidente, de los Vicepresidentes, en su caso, de los Ministros y de los demás miembros que establezca la ley» |
| Art. 113.1 CE | «El Congreso de los Diputados puede exigir la responsabilidad política del Gobierno mediante la adopción por mayoría absoluta de la moción de censura» |
| Art. 116.2 CE | «El estado de alarma será declarado por el Gobierno mediante decreto acordado en Consejo de Ministros por un plazo máximo de quince días [...]» |
| Art. 116.4 CE | «El estado de sitio será declarado por la mayoría absoluta del Congreso de los Diputados, a propuesta exclusiva del Gobierno» |
| Art. 117.1 CE | «La justicia emana del pueblo y se administra en nombre del Rey por Jueces y Magistrados integrantes del poder judicial, independientes, inamovibles, responsables y sometidos únicamente al imperio de la ley» |
| Art. 117.6 CE | «Se prohíben los Tribunales de excepción» |
| Art. 137 CE | «El Estado se organiza territorialmente en municipios, en provincias y en Comunidades Autónomas, que gozan de autonomía para la gestión de sus respectivos intereses» |
| Art. 140 CE | «La Constitución garantiza la autonomía de los municipios. Estos gozarán de personalidad jurídica plena [...]» |
| Art. 159.1 CE | «El Tribunal Constitucional se compone de 12 miembros nombrados por el Rey; de ellos, cuatro a propuesta del Congreso por mayoría de tres quintos de sus miembros; cuatro a propuesta del Senado, con idéntica mayoría; dos a propuesta del Gobierno, y dos a propuesta del Consejo General del Poder Judicial» |
| Art. 159.3 CE | «Los miembros del Tribunal Constitucional serán designados por un período de nueve años y se renovarán por terceras partes cada tres» |
| Art. 167.1 CE | «Los proyectos de reforma constitucional deberán ser aprobados por una mayoría de tres quintos de cada una de las Cámaras» |
| Art. 168.1 CE | «Cuando se propusiere la revisión total de la Constitución o una parcial que afecte al Titulo preliminar, al Capítulo segundo, Sección primera del Título I, o al Título II, se procederá a la aprobación del principio por mayoría de dos tercios de cada Cámara, y a la disolución inmediata de las Cortes» |
| Art. 5.6 LPAC | «La falta o insuficiente acreditación de la representación no impedirá que se tenga por realizado el acto [...] siempre que se aporte aquélla o se subsane el defecto dentro del plazo de diez días» |
| Art. 14.2 LPAC | «En todo caso, estarán obligados a relacionarse a través de medios electrónicos [...] a) Las personas jurídicas. b) Las entidades sin personalidad jurídica. c) Quienes ejerzan una actividad profesional para la que se requiera colegiación obligatoria [...]» |
| Art. 21.2 LPAC | «El plazo máximo en el que debe notificarse la resolución expresa será el fijado por la norma reguladora [...] Este plazo no podrá exceder de seis meses salvo que una norma con rango de Ley establezca uno mayor» |
| Art. 21.3 LPAC | «Cuando las normas reguladoras de los procedimientos no fijen el plazo máximo, éste será de tres meses» |
| Art. 30.2 LPAC | «Cuando los plazos se señalen por días, se entiende que éstos son hábiles, excluyéndose del cómputo los sábados, los domingos y los declarados festivos» |
| Art. 41.1 LPAC | «Las notificaciones se practicarán preferentemente por medios electrónicos y, en todo caso, cuando el interesado resulte obligado a recibirlas por esta vía» |
| Art. 47.1 LPAC | «Los actos [...] son nulos de pleno derecho: a) Los que lesionen los derechos [...] amparo constitucional. b) Los dictados por órgano manifiestamente incompetente por razón de la materia o del territorio. c) Los que tengan un contenido imposible. d) Los que sean constitutivos de infracción penal [...] e) Los dictados prescindiendo total y absolutamente del procedimiento legalmente establecido [...]» |
| Art. 48.2 LPAC | «No obstante, el defecto de forma sólo determinará la anulabilidad cuando el acto carezca de los requisitos formales indispensables para alcanzar su fin o dé lugar a la indefensión de los interesados» |
| Art. 82.2 LPAC | «Los interesados, en un plazo no inferior a diez días ni superior a quince, podrán alegar y presentar los documentos y justificaciones que estimen pertinentes» |
| Art. 95.1 LPAC | «En los procedimientos iniciados a solicitud del interesado, cuando se produzca su paralización por causa imputable al mismo, la Administración le advertirá que, transcurridos tres meses, se producirá la caducidad del procedimiento» |
| Art. 96.6 LPAC | «Salvo que reste menos para su tramitación ordinaria, los procedimientos administrativos tramitados de manera simplificada deberán ser resueltos en treinta días» |
| Art. 100.1 LPAC | «La ejecución forzosa [...] se efectuará, respetando siempre el principio de proporcionalidad, por los siguientes medios: a) Apremio sobre el patrimonio. b) Ejecución subsidiaria. c) Multa coercitiva. d) Compulsión sobre las personas» |
| Art. 114.1 LPAC | «Ponen fin a la vía administrativa: a) Las resoluciones de los recursos de alzada. b) Las resoluciones de los procedimientos a que se refiere el artículo 112.2. c) Las resoluciones de los órganos administrativos que carezcan de superior jerárquico, salvo que una Ley establezca lo contrario» |
| Art. 121.1 LPAC | «Las resoluciones y actos a que se refiere el artículo 112.1, cuando no pongan fin a la vía administrativa, podrán ser recurridos en alzada ante el órgano superior jerárquico del que los dictó» |
| Art. 122.1 LPAC | «El plazo para la interposición del recurso de alzada será de un mes, si el acto fuera expreso» |
| Art. 122.2 LPAC | «El plazo máximo para dictar y notificar la resolución será de tres meses. Transcurrido este plazo sin que recaiga resolución, se podrá entender desestimado el recurso» |
| Art. 123.1 LPAC | «Los actos administrativos que pongan fin a la vía administrativa podrán ser recurridos potestativamente en reposición ante el mismo órgano que los hubiera dictado o ser impugnados directamente ante el orden jurisdiccional contencioso-administrativo» |
| Art. 124.1 LPAC | «El plazo para la interposición del recurso de reposición será de un mes, si el acto fuera expreso» |
| Art. 3.1 LRJSP | «Las Administraciones Públicas sirven con objetividad los intereses generales y actúan de acuerdo con los principios de eficacia, jerarquía, descentralización, desconcentración y coordinación, con sometimiento pleno a la Constitución, a la Ley y al Derecho» |
| Art. 17.2 LRJSP | «Para la válida constitución del órgano [...] se requerirá la asistencia, presencial o a distancia, del Presidente y Secretario [...] y la de la mitad, al menos, de sus miembros» |
| Art. 89.2 LRJSP | «Dentro de su esfera de competencia, les corresponden las potestades administrativas precisas para el cumplimiento de sus fines, en los términos que prevean sus estatutos, salvo la potestad expropiatoria» |
| Art. 1.1 Ley 50/1997 | «El Gobierno dirige la política interior y exterior, la Administración civil y militar y la defensa del Estado» |
| Art. 1.2 Ley 50/1997 | «El Gobierno se compone del Presidente, del Vicepresidente o Vicepresidentes, en su caso, y de los Ministros» |
| Art. 5.3 Ley 50/1997 | «Las deliberaciones del Consejo de Ministros serán secretas» |
| Art. 11.1 LBRL | «El Municipio es la entidad local básica de la organización territorial del Estado. Tiene personalidad jurídica y plena capacidad para el cumplimiento de sus fines» |
| Art. 11.2 LBRL | «Son elementos del Municipio el territorio, la población y la organización» |
| Art. 13.2 LBRL | «La creación de nuevos municipios solo podrá realizarse sobre la base de núcleos de población territorialmente diferenciados, de al menos 4.000 habitantes y siempre que los municipios resultantes sean financieramente sostenibles» (redacción tras Ley 27/2013 LRSAL) |
| Art. 19.1 LBRL | «El Gobierno y la administración municipal, salvo en aquellos municipios que legalmente funcionen en régimen de Concejo Abierto, corresponde al ayuntamiento, integrado por el Alcalde y los Concejales» |
| Art. 22.1 LBRL | «El Pleno, integrado por todos los Concejales, es presidido por el Alcalde» |
| Art. 42.2 LBRL | «La iniciativa para la creación de una comarca podrá partir de los propios Municipios interesados. En cualquier caso, no podrá crearse la comarca si a ello se oponen expresamente las dos quintas partes de los Municipios que debieran agruparse en ella, siempre que [...] tales Municipios representen al menos la mitad del censo electoral del territorio correspondiente» |
| Art. 8.1 TREBEP | «Son empleados públicos quienes desempeñan funciones retribuidas en las Administraciones Públicas al servicio de los intereses generales» |
| Art. 8.2 TREBEP | «Los empleados públicos se clasifican en: a) Funcionarios de carrera. b) Funcionarios interinos. c) Personal laboral, ya sea fijo, por tiempo indefinido o temporal. d) Personal eventual» |
| Art. 9.2 TREBEP | «En todo caso, el ejercicio de las funciones que impliquen la participación directa o indirecta en el ejercicio de las potestades públicas o en la salvaguardia de los intereses generales del Estado y de las Administraciones Públicas corresponden exclusivamente a los funcionarios públicos» |
| Art. 48.k TREBEP | «Por asuntos particulares, seis días al año» |
| Art. 161.2 CE | «El Gobierno podrá impugnar ante el Tribunal Constitucional las disposiciones y resoluciones adoptadas por los órganos de las Comunidades Autónomas. La impugnación producirá la suspensión de la disposición o resolución recurrida, pero el Tribunal, en su caso, deberá ratificarla o levantarla en un plazo no superior a cinco meses» |
| Art. 30 LOTC | «La admisión de un recurso o de una cuestión de inconstitucionalidad no suspenderá la vigencia ni la aplicación de la Ley, de la disposición normativa o del acto con fuerza de Ley, excepto en el caso en que el Gobierno se ampare en lo dispuesto por el artículo ciento sesenta y uno, dos, de la Constitución» |
| Art. 121.1 LBRL | «Las normas previstas en este título serán de aplicación: a) A los municipios cuya población supere los 250.000 habitantes. b) A los municipios capitales de provincia cuya población sea superior a los 175.000 habitantes. c) A los municipios que sean capitales de provincia, capitales autonómicas o sedes de las instituciones autonómicas. d) Asimismo, a los municipios cuya población supere los 75.000 habitantes, que presenten circunstancias económicas, sociales, históricas o culturales especiales [...]. En los supuestos previstos en los párrafos c) y d), se exigirá que así lo decidan las Asambleas Legislativas correspondientes a iniciativa de los respectivos ayuntamientos» |
| Art. 34.2 LOTC | «transcurrido el cual el Tribunal dictará sentencia en el de diez, salvo que, mediante resolución motivada, el propio Tribunal estime necesario un plazo más amplio que, en ningún caso, podrá exceder de treinta días» |
| Art. 35 LOPJ | «La demarcación judicial, que determinará la circunscripción territorial de los órganos judiciales, se establecerá por ley» |
| Art. 31 Ley 50/1981 (EOMF) | Mandato Fiscal General del Estado: «cuatro años [...] no podrá ser renovado, excepto en los supuestos en que el titular hubiera ostentado el cargo durante un periodo inferior a dos años» |

**Para aplicar Condición B**: cita el artículo de la tabla, usa EXACTAMENTE la cita literal que aparece en el ejemplo canónico, y añade en `verification_notes`: "Cita verificada según ejemplo canónico skill question-crafting". Si modificas aunque sea una palabra de la cita, ya no aplica Condición B — vuelve a requerir fetch.

**Si NO se cumple A ni B**, la pregunta DEBE marcarse como:
- `"status": "requires_boe_verification"`
- `"auto_validated": false`
- La explicación debe contener `[cita pendiente de verificación]` explícitamente

**Prohibido terminantemente:**
- Afirmar "Cumple R1-R5" como si fuera publicable sin verificación BOE
- Poner comillas «...» en explicaciones sin fetch del BOE
- Autoevaluarse "100% bien" o "listo para publicar" basándose solo en conocimiento del modelo

El modelo NO es una fuente autorizada del BOE. Solo el fetch lo es.

### R3. Al reformular, preservar la estructura original de la pregunta

**No cambiar:**
- Pregunta directa → inversa (o viceversa) sin razón
- Completar frase → pregunta con "¿?"
- Respuesta correcta (a/b/c/d)
- Número de opciones (siempre 4)

**Sí puedes cambiar:**
- Añadir cita del artículo al enunciado
- Quitar paréntesis pista de las opciones
- Enriquecer explicación con cita BOE + por qué fallan los distractores
- Actualizar `legal_reference` si está mal

### R4. Al reformular, mantener 3 de 4 opciones originales

**Regla:** si las opciones originales son razonables, manténlas. Solo cambia UNA opción si es claramente defectuosa.

**Prohibido:** reformular creando 4 opciones nuevas inventadas por ti. Eso no es reformular, es crear pregunta nueva.

**Si necesitas cambiar >1 opción:** flaggea la pregunta como "needs_recreation" en vez de reformular.

### R5. Explicación debe quedarse en el ámbito del artículo citado

**Prohibido** mezclar temas ajenos en la explicación para "rellenar":
- ❌ "Otros plazos: Gobierno 4 años, TC 9 años, Cuerpos funcionariales..." (si la pregunta es sobre plazo municipal)
- ❌ "Las competencias sancionadoras son distintas..." (si la pregunta es sobre nombramientos)

**Permitido:** comparar con artículos que el opositor confunde con el correcto:
- ✅ "El Pleno (Art. 22 LBRL) NO tiene esta competencia; solo el Presidente (Art. 34)"

La explicación debe:
1. Citar el artículo correcto
2. Explicar por qué los 3 distractores están mal en ese ámbito
3. No introducir temas nuevos

## Patrones detectados en auditorías (2026-04)

Hallazgos sistémicos de la auditoría Opus del banco de preguntas. Si creas una pregunta nueva o revisas una existente, verifica que NO cae en estos patrones:

### 1. `legal_reference` apunta al distractor, no a la respuesta

**Patrón:** `legal_reference` cita el artículo que desmiente una opción incorrecta, en vez del que fundamenta la correcta.

**Ejemplo real (ID 139):** Pregunta sobre qué Título de la CE tiene más artículos. Respuesta correcta: Título I. `legal_reference` decía: "Título VIII CE (Arts. 137-158)" (que aparecía en el distractor).

**Regla:** El `legal_reference` debe apuntar siempre al artículo/título/sección que fundamenta la respuesta marcada como correcta.

### 2. Frases meta en el enunciado

**Patrón:** El enunciado hace referencia al propio examen o al opositor.

**Ejemplo real (ID 317):** "...señale el medio correcto de acreditación **que suele plantear el examen**".

**Regla:** Enunciado neutro sobre el contenido. Nunca meta-referencias ("que suele caer", "que más confunde", "fácil de recordar").

### 3. Paréntesis explicativos en opciones

**Patrón:** Una opción incluye entre paréntesis el dato que verificaría la respuesta.

**Ejemplo real (ID 139, 1061):** "El Título I (Arts. 10-55, 46 artículos)" — el opositor no necesita saber nada, solo contar.

**Regla:** Los paréntesis explicativos van en la explicación. Las opciones son limpias.

### 4. Plazos atribuidos a la CE que están en leyes de desarrollo

**Patrón:** El enunciado atribuye un plazo concreto a la Constitución, pero el plazo realmente está en una LO o ley ordinaria de desarrollo. La CE solo remite a "ley orgánica".

**Ejemplo real (ID 560):** "En el procedimiento del Art. 151 CE, ¿en qué plazo debe convocarse el referéndum?" — respuesta: 2 meses. Pero ese plazo está en la LO 2/1980, no en la CE. El Art. 151.1 CE solo dice "en los términos que establezca una ley orgánica".

**Regla:** Si el plazo o requisito concreto está en la ley de desarrollo, el enunciado debe mencionarlo ("según su ley orgánica de desarrollo") y el `legal_reference` debe apuntar a la ley de desarrollo, no a la CE.

**Vigilar especialmente:** plazos autonómicos (LO 2/1980), electorales (LOREG), procedimentales (LPAC, LRJSP), presupuestarios (LGP).

### 5. Artículo correcto, apartado equivocado (WRONG_ARTICLE_SUBSECTION)

**Patrón:** El artículo base del `legal_reference` es correcto pero el apartado (`.2` vs `.3`) o la letra (`.b` vs `.c`) está mal. Es el error sistémico más frecuente en leyes con artículos extensos.

**Ejemplos reales (batch 3 de auditoría):**
- ID 586: cita Art. 42.2 LRBRL pero la regla de 2/5 oposición a comarca está en 42.**3**
- ID 592: cita Art. 35.2.b para nombrar Vicepresidentes, pero es Art. 34.**1.c**
- ID 608: cita Art. 13.4 para plazo de 10 años post-fusión, pero es Art. 13.**5** (añadido por LRSAL)

**Regla:** Al generar preguntas sobre LRBRL, TREBEP, Ley 40/2015 (artículos con muchos apartados), verificar el apartado EXACTO contra el BOE. Hacer fetch del artículo completo y localizar el apartado que contiene la regla de la pregunta. Nunca asumir que la regla está en el apartado que suena lógico.

**Leyes donde este patrón es común:**
- LRBRL (Arts. 13, 22, 34-35, 42, 128)
- Ley 40/2015 (Art. 85, 89, 133-137)
- Ley 39/2015 (Art. 21, 30, 47, 122-124)
- TREBEP (Art. 14, 48-51)

### 6. Desfase por jurisprudencia del TC (OUTDATED_BY_CONSTITUTIONAL_COURT_RULING)

**Patrón:** La explicación cita un requisito del texto literal del BOE que ha sido declarado inconstitucional o modificado por jurisprudencia del TC, aunque el BOE no haya actualizado el texto publicado. Es distinto de `ANSWER_NOT_IN_BOE` porque el texto SÍ aparece en el BOE literal, pero ya no es derecho vigente.

**Ejemplo real (ID 590):** La explicación afirma que el Concejo Abierto (Art. 29.1 LRBRL) aplica a municipios con menos de 100 habitantes que tradicionalmente tuvieran ese régimen. La **STC 103/2013** declaró inconstitucional ese umbral de 100 habitantes, pero el texto del BOE no se actualizó.

**Regla:** Al citar preceptos de LRBRL, LRSAL y leyes orgánicas con jurisprudencia abundante, verificar si el artículo ha sido afectado por alguna STC. Si hay afectación, la explicación debe mencionarlo: "Nota: el requisito de X fue declarado inconstitucional por la STC Y/Z."

**Preceptos conocidos con jurisprudencia relevante:**
- Art. 29.1 LRBRL (umbral Concejo Abierto) — STC 103/2013
- Art. 57 bis LRBRL (creación entes instrumentales) — STC 41/2016
- Varios preceptos de LRSAL (Ley 27/2013) afectados por STC 41/2016

### 7. Tricotomías y clasificaciones doctrinales sin anclaje BOE

**Patrón:** La pregunta se basa en una clasificación académica de manual ("los X elementos constitutivos de Y", "las N notas características de Z") que no aparece literalmente en ningún artículo del BOE.

**Ejemplo real (ID 580):** "El municipio se compone de **tres elementos constitutivos**. Señale cuál NO es uno..." — esta tricotomía (territorio/población/organización) es doctrinal. El Art. 11 LRBRL menciona estos elementos pero no usa la expresión "tres elementos constitutivos".

**Regla:** Si usas una clasificación doctrinal, verifica que aparece LITERALMENTE en algún artículo. Si no, reformula la pregunta para referirse al contenido del artículo sin invocar la tricotomía:

- ❌ "Los tres elementos constitutivos del municipio son..."
- ✅ "Según el Art. 11 LRBRL, ¿cuál de los siguientes NO es un elemento del municipio?"

### 8. Distractor verdadero mal marcado como falso (DISTRACTOR_VERDADERO_MAL_MARCADO)

**Patrón:** una opción contiene una afirmación jurídicamente correcta (literalmente extraída del BOE) pero está marcada como `is_correct: false`. El opositor que estudia bien marcará esa opción y se le dirá que es "incorrecta". Destruye la confianza en el banco.

**Ejemplo real (ID 1184):** la pregunta "Las normas del Título X LBRL serán de aplicación a:" tenía la opción "Los municipios cuya población supere los 250.000 habitantes" marcada como `is_correct: false`, pero ese supuesto es **literalmente** el Art. 121.1.a LBRL. La respuesta correcta marcada (Cabildos Canarios Art. 121.2) también era correcta, pero la pregunta olvidaba precisar que pedía UN supuesto concreto.

**Causa raíz:** la pregunta está mal diseñada como "cuál de los siguientes es un supuesto del Art. 121" cuando hay varios supuestos verdaderos, y el formulador elige arbitrariamente uno como "correcto".

**Fix al reformular:** precisar el enunciado para que la respuesta correcta sea UNÍVOCA. Ej:
- ❌ "Serán de aplicación a:" (varios supuestos verdaderos, elegir uno es arbitrario)
- ✅ "En los supuestos de las letras c) y d) del Art. 121.1 LBRL, se exige adicionalmente que:" → una sola respuesta correcta

**Fix alternativo:** convertir a "señale la INCORRECTA" con 3 supuestos literales del BOE + 1 falso.

**Regla de detección:** tras construir una pregunta de tipo "cuál es un supuesto de…", verificar para cada distractor marcado como `is_correct:false`: **¿aparece literalmente en el BOE como supuesto válido?** Si sí → la pregunta está rota.

**Regla REFORZADA para artículos con ≥3 supuestos taxativos enumerados** (ej: Art. 10 TREBEP, Art. 47 LPAC, Art. 21/22 LO 3/1980, Art. 121.1 LBRL):

Cuando el artículo enumera ≥3 supuestos/causas/requisitos verdaderos a/b/c/d, **está PROHIBIDO** usar el patrón "¿cuál de los siguientes es un supuesto del Art. X?" con 3 opciones literales verdaderas + 1 inventada, marcando una de las verdaderas como correcta (eso es arbitrario y rompe la pregunta).

**Patrones permitidos para estos artículos:**

1. **Inversa con 1 distractor falso externo**: "¿cuál NO es un supuesto del Art. X?" — 3 opciones literales del artículo + 1 opción que cruza con artículo distinto (ej: Art. 10 TREBEP con distractor del Art. 12 — personal eventual). **Preferir esta opción**.

2. **Directa con requisito ADICIONAL**: en vez de preguntar "¿cuál es un supuesto?", preguntar por una condición que solo algunos supuestos comparten (ej: "En los supuestos c) y d) del Art. 121.1 se exige adicionalmente..."). Esto fuerza respuesta unívoca.

3. **Directa con DEFORMACIONES específicas**: construir una opción como supuesto literal correcto y tres opciones que son deformaciones del mismo supuesto (plazos cambiados, sujetos invertidos, adjetivos opuestos). Ej: si el supuesto c) dice "sustitución transitoria de titulares", distractores con "sustitución definitiva", "sustitución permanente", "reposición definitiva". **La opción correcta es el supuesto literal, los 3 distractores son deformaciones del mismo supuesto — NO otros supuestos del artículo**.

**Nota especial para Sonnet** (evidencia 2026-04-20): Sonnet tiende a caer en el patrón prohibido — marca un supuesto como correcto y pone los otros como distractores. Cuando veas un artículo con estructura de lista (a/b/c/d de supuestos), aplica el checklist:
1. ¿Cuántas opciones de mi pregunta son literales del artículo? Si ≥2 → pregunta rota.
2. Si solo UNA es literal correcta, ¿las otras 3 son deformaciones de esa misma (plazos cambiados, sujeto invertido) o son OTROS supuestos del artículo?
3. Si son otros supuestos del artículo → pregunta rota; usa inversa cruzando con artículo externo.

### 9. Explicación que se contradice con `is_correct` (EXPLANATION_MISMATCH)

**Patrón:** la explicación dice cosas que contradicen el marcado `is_correct` de las opciones. Ejemplos reales:
- "Las opciones b, c y d también son supuestos correctos del artículo 121, pero la pregunta pide uno de ellos" (ID 1184 reformulada) — si las 4 son correctas, la pregunta es ambigua y la explicación lo confiesa.
- "La respuesta es B porque es la única que…" cuando en realidad la marca es C.

**Regla (añadir al pipeline de reformulación):** tras reformular, el agente verificador DEBE leer la explicación y comprobar:
1. ¿La explicación afirma cuál es la respuesta correcta? → ¿coincide con `is_correct: true`?
2. ¿La explicación justifica por qué las demás son incorrectas? → ¿las demás tienen `is_correct: false`?
3. Si la explicación dice "también son correctas" / "todas son válidas" / "cualquiera de las anteriores" → **pregunta ambigua, NO publicar**.

## Pipeline de reformulación (4 agentes)

Los 3 agentes clásicos (Reformulador → Verificador → Cazador) no bastan cuando la pregunta original es Tier B/C: la reformulación pule estilo pero no eleva el tier. Añadir **Agente 4 (Elevador de Tier)** condicional:

| Agente | Modelo | Input | Output |
|---|---|---|---|
| 1. Reformulador | Sonnet | Pregunta original | Enunciado limpio + opciones pulidas (aplica P0-P6) |
| 2. Verificador lógico | Opus | Reformulada | Detecta EXPLANATION_MISMATCH, DISTRACTOR_VERDADERO_MAL_MARCADO, errores de cita |
| 3. Cazador discrepancias | Sonnet | Reformulada + BD | Contradicciones inter-preguntas, temas mal asignados |
| **4. Elevador de tier** | Opus | Reformulada si tier ≤ B | Rediseña introduciendo par confundible; devuelve Tier S o `rejected` |

**Criterio de activación del Agente 4:**
- Tras reformular, el Verificador (Agente 2) asigna tier preliminar.
- Si `tier ∈ {B, C}`, la pregunta se envía al Agente 4.
- El Agente 4 DEBE encontrar un par confundible (consultar tabla meta-heurística del skill). Si no lo encuentra → marca `rejected`.

**Por qué este agente es necesario (evidencia real 2026-04-20):** test con 4 preguntas de temas difíciles. Las reformuladas Q1-Q3 se quedaron Tier B (solo pulido de estilo), mientras que desde-0 con par confundible sacó las 4 a Tier S. El Agente 4 cierra esa brecha.

### Smoke test final del pipeline (OBLIGATORIO antes de firmar `auto_validated`)

**Evidencia 2026-04-20:** Sonnet cometió EXPLANATION_MISMATCH durante el flujo de reformulación (Q1 test ciego v3): en una primera pasada marcó `is_correct:true` una opción y en la explicación afirmó que la correcta era otra. Se auto-corrigió mid-flight, pero eso revela que el modelo puede generar incoherencias transitorias. Opus lo hace nativamente bien; Sonnet necesita verificación explícita.

**Smoke test (últimas 30 segundos antes de output final):**

```
1. LEER el YAML completo de la pregunta.
2. Identificar qué opción tiene `is_correct: true` → guardar letra (ej: "b").
3. LEER la explicación de principio a fin.
4. Buscar en la explicación frases como "la respuesta correcta es X", "la opción X es la correcta", "la X es la incorrecta" (si es pregunta inversa).
5. Verificar que la letra identificada en la explicación COINCIDE con la letra `is_correct:true` del paso 2.
6. Si NO coinciden → EXPLANATION_MISMATCH detectado → NO firmar auto_validated, rehacer la explicación.
7. Adicional: si la explicación contiene "también son correctas", "cualquiera de las anteriores", "todas son válidas" → pregunta ambigua → NO publicar.
```

**Regla de activación por modelo:**
- **Opus**: aplica el smoke test por defecto (pero es mayoritariamente fiable sin él).
- **Sonnet**: el smoke test es OBLIGATORIO antes de emitir cualquier YAML con `status: auto_validated`. Si por presión de output se omite, marcar `requires_boe_verification` como fallback.

**Por qué va al final del pipeline, no al principio:** el Agente 1 (Reformulador) puede reescribir opciones y cambiar la correcta; el Agente 4 (Elevador) puede rediseñar la pregunta por completo. Solo tras TODOS los agentes estabiliza el `is_correct`, y solo entonces tiene sentido verificar la coherencia con la explicación.

## Estados posibles de una pregunta

| Status | Cuándo usarlo | Siguiente paso |
|---|---|---|
| `auto_validated` | Cumple Condición A (fetch BOE) o B (cita canónica skill) | Publicable |
| `requires_boe_verification` | Sin fetch BOE — reformulación estructural OK pero cita pendiente | Verificador Opus con BOE |
| **`needs_correction`** | **Fetch BOE reveló que la respuesta original está MAL (no solo mal redactada)** | Humano + verificador legal |
| `rejected` | No se puede salvar — recrear desde cero | Descartar o flaggear para rewrite |

**`needs_correction` es distinto de `requires_boe_verification`**. El primero detecta un bug de fondo (respuesta incorrecta), el segundo es solo falta de verificación formal. Ejemplo real: ID 86 decía que el plazo era "2 meses" pero el BOE literal dice "10 días" — eso es `needs_correction`.

## Tabla de Confusiones Inter-Órgano (para distractores Tier S)

Muchos distractores efectivos se construyen confundiendo datos entre órganos constitucionales parecidos. Referencia rápida:

| Órgano | Miembros | Mandato | Renovable | Nombra |
|---|---|---|---|---|
| Gobierno | Variable | 4 años | — | Rey (a propuesta Congreso) |
| CGPJ | 20 + Presidente | 5 años | No | Rey (propuesta Cortes 3/5) |
| Tribunal Constitucional | 12 | 9 años | No | Rey (4 Congreso, 4 Senado, 2 Gobierno, 2 CGPJ) |
| Consejo de Estado | Variable | — | — | Rey / Gobierno |
| Fiscal General Estado | 1 | 4 años | No (salvo <2 años) | Rey (propuesta Gobierno, oído CGPJ) |
| Tribunal de Cuentas | 12 | 9 años | Sí | Cortes (6 Congreso, 6 Senado, 3/5) |
| Defensor del Pueblo | 1 | 5 años | Sí | Cortes (3/5 Congreso + 3/5 Senado) |

**Uso**: cuando crees distractores numéricos, toma valores de esta tabla de otro órgano para crear confusiones plausibles (ej: si la pregunta es sobre CGPJ con mandato 5 años, distractor con "9 años" es plausible porque confunde con TC).

## URLs BOE fiables

Para el fetch desde el skill:

- **Principal**: `https://www.boe.es/buscar/act.php?id=<BOE_ID>` — funciona para la mayoría
- **Alternativa 1**: `https://www.boe.es/buscar/doc.php?id=<BOE_ID>` — mejor para articulados extensos (LOPJ, TREBEP)
- **Alternativa 2 (ELI)**: `https://www.boe.es/eli/es/lo/YYYY/MM/DD/N/con` — versión consolidada, mejor para leyes con muchas reformas

Si `act.php` no devuelve el articulado, probar `doc.php` y después ELI.

### ⚠️ Leyes con truncamiento conocido (act.php falla)

**Constitución Española** se trunca en `act.php` antes del Art. 136 aprox. Para Arts. 137-169:
- **Fuente oficial alternativa (recomendada)**: `https://app.congreso.es/consti/constitucion/indice/titulos/articulos.jsp?ini=<N>&fin=<M>&tipo=2`
  - Ejemplo: `?ini=159&fin=165&tipo=2` devuelve Arts. 159-165
- Texto verbatim coincide con BOE oficial

**Ley 40/2015 LRJSP** se trunca antes del Art. 19 en todas las URLs BOE. Estrategias:
- PDF consolidado: `https://www.boe.es/buscar/pdf/2015/BOE-A-2015-10566-consolidado.pdf` (usar `pdftotext` vía Bash)
- Fuente secundaria fiable: `iberley.es` (reproduce texto literal del BOE — verificar cruzando con una segunda fuente)

**LBRL (Ley 7/1985)** se trunca en `act.php` después del Art. 56 aprox. Para Título X (Arts. 121-138 municipios de gran población): PDF consolidado `https://www.boe.es/buscar/pdf/1985/BOE-A-1985-5392-consolidado.pdf` + pdftotext.

**Para otras leyes con truncamiento**:
1. Intentar PDF consolidado del BOE + pdftotext
2. Si falla, usar fuente oficial (congreso.es para CE, sede electrónica del organismo para sus leyes)
3. Si todo falla: marcar `requires_boe_verification`

### 🛑 Cuidado con el WebFetch summarizer

El modelo resumidor de WebFetch **puede alucinar cuando la página está truncada**. Caso detectado real: WebFetch sobre Arts. 63-66 Ley 40/2015 devolvió contenido ficticio mezclando administración periférica y Delegados del Gobierno (que están en Arts. 69-77).

**Regla**: si WebFetch devuelve texto que suena correcto pero el artículo no aparece literalmente citado, **NO confiar**. Hacer fetch del PDF completo o usar fuente secundaria verificable (iberley, boe.es con pdftotext).

## IDs BOE Correctos (leyes más frecuentes)

| Ley | ID BOE | Notas |
|---|---|---|
| CE | `BOE-A-1978-31229` | Constitución Española 1978 |
| LOTC (LO 2/1979) | `BOE-A-1979-23709` | Tribunal Constitucional |
| LO 2/1980 (Referéndum) | `BOE-A-1980-2686` | Modalidades de referéndum |
| LO 3/1980 (Consejo Estado) | `BOE-A-1980-8682` | ⚠️ Texto no siempre disponible, usar ELI |
| LOPJ (LO 6/1985) | `BOE-A-1985-12666` | Poder Judicial |
| LBRL (Ley 7/1985) | `BOE-A-1985-5392` | Bases del Régimen Local |
| LOREG (LO 5/1985) | `BOE-A-1985-11672` | Régimen Electoral General |
| **EOMF (Ley 50/1981)** | `BOE-A-1982-837` | ⚠️ Corregido — no es 1981-2315 |
| Ley 50/1997 (Gobierno) | `BOE-A-1997-25336` | Gobierno |
| LPAC (Ley 39/2015) | `BOE-A-2015-10565` | Procedimiento Administrativo |
| LRJSP (Ley 40/2015) | `BOE-A-2015-10566` | Régimen Jurídico Sector Público |
| TREBEP (RDLeg 5/2015) | `BOE-A-2015-11719` | Empleado Público |
| Ley 19/2013 (Transparencia) | `BOE-A-2013-12887` | |
| LRSAL (Ley 27/2013) | `BOE-A-2013-13756` | Racionalización Admón. Local |

## Creación de preguntas desde 0 (no reformulación)

Si tu tarea es CREAR preguntas nuevas (no reformular una existente), sigue este protocolo:

### Paso 1 — Elige el artículo fuente

1. **Identifica el tema** y la ley principal que lo rige
2. **Haz fetch del BOE** del artículo específico (usa ID de la tabla de arriba)
3. **Copia el texto literal** del apartado que vas a convertir en pregunta

### Paso 2 — Identifica el "punto de trampa"

Lee el texto legal y busca qué detalle podría confundir:
- **Números/plazos**: "5 años" vs "4 años" vs "9 años" (usa tabla inter-órgano)
- **Palabras con similar significado pero distinto**: "ciudadanos" vs "españoles", "legalidad" vs "imparcialidad", "interés público" vs "interés social"
- **Órganos similares**: Pleno vs Permanente, Congreso vs Senado, Alcalde vs Pleno
- **Quórum/mayorías**: 3/5 vs 2/3 vs mayoría absoluta
- **Apartados del mismo artículo**: Art. X.1 vs X.2 (uno regula iniciativa, otro bloqueo)

### Paso 3 — Construye la pregunta

Sigue el patrón de los ejemplos canónicos:

**Plantilla:**
```
question_text: "Según el artículo X.Y de la [ley canónica], ¿[pregunta sobre detalle]?"
options:
  a) [correcta: texto literal del BOE]
  b) [distractor 1: cambia 1 palabra o número clave]
  c) [distractor 2: confusión con artículo/órgano relacionado]
  d) [distractor 3: otra confusión plausible]
explanation: 📖 Art. X.Y [ley]: «[cita verbatim del BOE]». [por qué los 3 distractores son incorrectos]
legal_reference: Art. X.Y [ley]
```

### Paso 4 — Auto-checklist

Antes de enviar, verifica:
- [ ] ¿La cita entre «...» es VERBATIM del BOE? (no paráfrasis)
- [ ] ¿Los 4 distractores son plausibles pero verificablemente incorrectos?
- [ ] ¿El enunciado cita el artículo específico?
- [ ] ¿La explicación dice por qué cada distractor está mal?
- [ ] ¿Respeta las 5 reglas anti-alucinación?

### Paso 5 — Output final

Incluye `status: auto_validated` solo si cumpliste el Paso 1 con fetch real. Si no, `requires_boe_verification`.

### Plantillas por tipo de artículo

**Artículo con número/plazo:**
```
"Según el Art. X de [ley], ¿durante cuántos [años/días] [acción]?"
→ Distractores: valores de órganos parecidos (tabla inter-órgano)
```

**Artículo con definición/misión:**
```
"Según el Art. X de [ley], [órgano] tiene por misión [acción] en defensa de:"
→ Distractores: cambiar UNA palabra clave por término similar (pero incorrecto)
```

**Artículo con competencia/órgano:**
```
"Según el Art. X de [ley], ¿a quién corresponde [función]?"
→ Distractores: órganos del mismo nivel (Pleno, Junta, Presidente, Secretaría)
```

**Artículo con porcentaje/fracción:**
```
"Según el Art. X de [ley], ¿qué fracción de [grupo] puede [acción]?"
→ Distractores: otras fracciones comunes (3/4, 2/3, 3/5, 2/5) — solo una es correcta
```

**Pregunta inversa (señale la INCORRECTA):**
```
"Según el Art. X de [ley], señale la afirmación INCORRECTA sobre [tema]:"
→ 3 opciones literales del artículo + 1 opción que invierte 1 dato clave
→ La opción correcta es la única INCORRECTA (la que no coincide con el BOE)
→ Muy efectiva para artículos con múltiples detalles (composición CGPJ, funciones MF)
```

### Meta-heurística: la mejor pregunta FUERZA a distinguir dos artículos confundibles

**Insight clave (validado por feedback real de opositor):** el "punto de trampa" más valioso **no es un detalle aislado de UN artículo**, sino **la CONFUSIÓN entre dos artículos similares**.

**Al crear una pregunta**, pregúntate:
1. ¿Hay OTRO artículo con el que el opositor pueda confundir este?
2. Si sí → la pregunta ideal es la que **fuerza a distinguir ambos**

**Ejemplos reales de pares confundibles:**

| Par confundible | Confusión típica | Pregunta ideal |
|---|---|---|
| Art. 161.1.a CE vs Art. 161.2 CE | Recurso inconstitucionalidad (NO suspende) vs impugnación gubernamental (SÍ suspende) | Escenario con ambos procedimientos simultáneos |
| Art. 21 LPAC vs Art. 30 LPAC | Plazo resolución (3-6 meses) vs cómputo plazos (días hábiles) | Pregunta que mezcla ambos |
| Art. 63 L40/2015 vs Art. 66 L40/2015 | Subsecretarios (requisito A1 estricto) vs Directores Generales (A1 con excepción motivada) | Escenario con RD de estructura afectando a ambos |
| Art. 122.3 CE vs Art. 159.3 CE | CGPJ (5 años) vs TC (9 años) | Pregunta con opciones cruzadas |
| Art. 16.1 vs 16.2 Ley 50/1997 | Gabinete Ministro (RD del CM) vs Gabinete Secretario Estado (OM) | Pregunta que distingue ambos casos |
| Art. 17 estado alarma CE vs Art. 17.2 CE | Derecho libertad vs detención preventiva (72h) | Pregunta que combina los 2 sentidos de Art. 17 |
| **Art. 47 vs 48 LPAC** | Nulidad pleno derecho (7 supuestos tasados) vs anulabilidad (defecto forma con indefensión) | Pregunta con causas mezcladas de ambos |
| **Art. 121 vs 123 LPAC** | Alzada (superior jerárquico) vs reposición (mismo órgano) | Pregunta que invierta ante quién se interpone |
| **Art. 25 vs 26 LBRL** | Competencia propia municipio ≠ servicio mínimo obligatorio | Escenario con municipio X hab: protección civil es competencia (Art. 25) pero solo obligatorio >20.000 hab (Art. 26) |
| **Art. 99 vs 113 CE** | Investidura (mayoría absoluta solo 1ª votación; 2ª vuelta simple) vs moción censura (absoluta siempre) | Pregunta inversa tipo "señale la INCORRECTA" con afirmación "ambos requieren absoluta siempre" |
| **Art. 99 CE vs Art. 112 CE** | Investidura (candidato propuesto Rey) vs cuestión de confianza (plantea Presidente Gobierno) | Pregunta sobre quién propone la votación |
| **Art. 116.2 vs 116.3 vs 116.4 CE** | Alarma (15 días, decreto Gobierno) vs excepción (30 días, previa autorización Congreso) vs sitio (mayoría absoluta Congreso) | Pregunta con los 3 estados mezclados |
| **Art. 121.2 LBRL (plazo adaptación 6 meses)** vs plazos genéricos LPAC (3 meses) | Municipio alcanza umbral gran población → nueva corporación dispone de **6 meses desde constitución** para adaptar organización. Dies a quo y referencia del padrón (1 enero año anterior al mandato) son trampas típicas | Escenario con municipio que cruza umbral y pregunta por el plazo + dies a quo |
| **Art. 127.1.b LBRL (JGL proyecto presupuesto)** vs **Art. 123.1.h LBRL (Pleno aprobación definitiva)** | En municipios gran población el reparto presupuestario se divide: JGL aprueba el **proyecto**, Pleno lo aprueba **definitivamente** | Pregunta que exige distinguir fase inicial vs definitiva y órgano aprobador |
| **Título X LBRL (Arts. 121-138 — municipios gran población)** vs **D.A. 14ª LBRL (cabildos insulares canarios)** | Los cabildos NO están en el Título X; tienen régimen propio en la D.A. 14ª. El opositor recuerda "hay algo de cabildos canarios" pero no ubica la norma | Pregunta inversa con 3 supuestos literales del Art. 121 + 1 distractor falso "cabildos canarios" para descartar |

**Ventaja**: las preguntas que explotan un par confundible **siempre son Tier S** porque obligan a conocimiento matizado, no solo memorístico.

### Heurística para identificar "puntos de trampa"

Al leer el texto legal, busca en este orden:

1. **Números concretos** → plazos, edades, porcentajes, fracciones, número de miembros
   - Buscar cada número en tabla inter-órgano para distractores

2. **Palabras absolutas** → "siempre", "en todo caso", "sin excepción", "exclusivamente"
   - Si el BOE las usa → distractor "salvo cuando...", "excepto...".
   - Si el BOE las evita → distractor que las introduce (trampa "en ningún caso").

3. **Sinónimos cercanos pero distintos** → legalidad/imparcialidad, ciudadanos/españoles, interés público/social, independencia/imparcialidad
   - Estos son los "falsos amigos" — cambios sutiles que confunden al opositor

4. **Excepciones tasadas** → "salvo si", "excepto cuando", "a menos que"
   - Distractor 1: omite la excepción (absoluta)
   - Distractor 2: altera el umbral de la excepción (<1 año en vez de <2)

5. **Órganos similares en el mismo sistema** → Pleno vs Permanente, Congreso vs Senado, Alcalde vs Pleno, Presidente vs Junta
   - Confusiones clásicas (ver tabla inter-órgano)

### Cómo crear 2+ preguntas distintas sobre el MISMO artículo

**Regla general:** identifica las cláusulas coordinadas independientes del artículo y crea 1 pregunta por cláusula.

**Ejemplo — Art. 122.3 CE tiene 3 cláusulas:**
1. Composición (Presidente + 20 vocales) → Pregunta 1 (directa, número)
2. Mandato (5 años) → Pregunta 2 (directa, plazo)
3. Origen (12 judiciales + 4 Congreso + 4 Senado, 3/5) → Pregunta 3 (inversa, estructura)

**Para artículos monocláusula:** usar la heurística de tipos (directa/inversa/contextual).

### Campos de BD al publicar

La plantilla de output para **creación desde 0** debe incluir:

```yaml
question_text: "..."
options: [...]
correct_answer: "b"
explanation: "..."
legal_reference: "Art. X.Y [ley]"
tema: [número según MASTER_OPOSICIONES.md]
origin: "ai_created"              # IMPORTANTE: marcar origen
validation_status: "ai_created_pending"  # pendiente revisión humana
source_text: "[texto literal BOE]"
verification_notes: "Creada desde cero vía skill question-crafting. Fetch: [URL]"
tier: "S" o "A" según cumplimiento
```

### Conflicto Condición A (fetch) vs Condición B (canónica skill)

Si el fetch del BOE devuelve texto **más corto o distinto** que la cita canónica del skill:

1. **La canónica del skill prevalece** (fue verificada previamente)
2. **Re-fetch con URL ELI** (`boe.es/eli/...`) para confirmar versión consolidada
3. **Si persiste la divergencia** → `needs_correction` y flagear para revisión humana
4. **Documentar en `verification_notes`** qué devolvió cada fuente

**Por qué:** `act.php` a veces devuelve versiones históricas recortadas (detectado con Art. 125 CE). ELI es la versión vigente consolidada.

### Asignación del campo `tema`

Consultar `.claude/oposiciones/MASTER_OPOSICIONES.md` para el mapping oficial tema → leyes. Referencia rápida AGE:

| Tema | Leyes principales |
|---|---|
| 1-3 | CE (Preliminar, Título I, Corona, Cortes) |
| 4 | CE (Gobierno, Poder Judicial, TC, MF) |
| 5-6 | Ley 50/1997, Ley 40/2015 Título II |
| 7-8 | Ley 40/2015 LRJSP |
| 9 | Régimen Local (LBRL, LOREG) + LPAC parcial |
| 10 | TREBEP/EBEP |
| 11 | Ley 40/2015 (sector público institucional) |
| 17-20 | Actividad administrativa, atención ciudadano |
| 21-28 | Ofimática (Windows, Office, Internet) |

Si dudas del tema, usa el `legal_reference` como guía y pregunta al humano.

## Niveles de tier

- **Tier S**: Escenario + cita artículo + distractores con mecánica clara + explicación con cita BOE. Los 4 ejemplos de arriba.
- **Tier A**: Cita artículo + distractores plausibles + explicación con cita. Sin escenario narrativo.
- **Tier B**: Pregunta directa + distractores correctos + explicación sin cita literal.
- **Tier C**: Pregunta genérica, distractores mejorables. Necesita rework.

Objetivo: todas las preguntas nuevas deben ser Tier A o S. Tier B solo si no hay más tiempo. Tier C → rechazar.
