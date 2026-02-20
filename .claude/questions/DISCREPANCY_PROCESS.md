# Proceso de Deteccion de Discrepancias — OpositaSmart

> Verificacion sistematica de que la logica de cada pregunta y respuesta refleja fielmente el articulo legal citado.

**Creado:** 2026-02-20
**Estado:** Disenado, pendiente de ejecucion

---

## Objetivo

Detectar y corregir discrepancias entre:
1. La **respuesta correcta** marcada y lo que el articulo legal realmente dice
2. Los **distractores** y la ley (un distractor podria ser correcto)
3. El **enunciado** de la pregunta y las premisas que establece
4. La **explicacion** y la pregunta/respuesta/ley
5. **Preguntas entre si** que citan el mismo articulo pero se contradicen

---

## Datos de Partida (Feb 2026)

| Metrica | Valor |
|---------|-------|
| Preguntas activas | 1,422 |
| Chapter-verified | 1,182 (83.1%) |
| Respuestas ya corregidas | 18 |
| Drift ya corregido | 30 |
| Articulos con 3+ preguntas | 116 (490 preguntas) |
| Articulos con 5+ preguntas | 32 (hotspots) |
| Preguntas sin correct answer | 0 |
| Preguntas con 2+ correct answers | 0 |

---

## Tipos de Discrepancia

### D1 — Respuesta Incorrecta
La opcion marcada como correcta NO coincide con lo que dice el articulo.

**Ejemplo real (ID 439):** Art. 122.3 CE — Opcion A decia que los vocales del CGPJ son nombrados por las Cortes Generales, pero el articulo dice que son nombrados por el Rey. Corregida a opcion D.

**Deteccion:** Agente lee articulo + pregunta + opciones. Compara opcion `is_correct=true` con texto legal literal.

### D2 — Distractor Accidentalmente Correcto
Una opcion marcada como incorrecta ES correcta segun la ley, o al menos es defensible.

**Ejemplo real (ID 1343):** Art. 72.2 Ley 40/2015 — La pregunta sobre suplencia de Delegados del Gobierno contradecia IDs 1217 y 1380 que dicen lo opuesto sobre el mismo articulo.

**Deteccion:** Agente verifica CADA opcion incorrecta contra el articulo. Si alguna es defensible, flag.

### D3 — Premisa Erronea
El enunciado de la pregunta afirma algo que no es cierto segun la ley.

**Ejemplo:** "La Comision General de Secretarios de Estado, presidida por el Ministro de la Presidencia..." — pero la ley dice "presidida por un Vicepresidente del Gobierno".

**Deteccion:** Agente analiza premisas implicitas del enunciado contra texto legal.

### D4 — Calificador Perdido (Drift)
La pregunta omite un calificador legal importante que cambia el significado.

**Ejemplo real (ID 1369):** Original decia "A efectos judiciales, el partido judicial es..." pero la reformulacion perdio "a efectos judiciales".

**Deteccion:** Comparar original_text vs question_text, buscar calificadores como:
- "en todo caso"
- "salvo lo dispuesto en..."
- "sin perjuicio de..."
- "a efectos de..."
- "cuando proceda"
- "con caracter excepcional"

### D5 — Contradiccion Inter-Pregunta
Dos preguntas sobre el mismo articulo dan informacion contradictoria.

**Ejemplo real (IDs 765 vs 1007):** Ambas sobre Art. 8.1 Ley 50/1997. Una decia que "Ministro de la Presidencia" es FALSO, la otra decia que es VERDADERO.

**Deteccion:** Agrupar preguntas por articulo, comparar afirmaciones y respuestas correctas.

### D6 — Explicacion Incoherente
La explicacion cita un articulo diferente al del enunciado, o dice algo que contradice la respuesta.

**Deteccion:** Verificar que explanation, question_text y legal_reference hablan del mismo articulo.

### D7 — Ley Reformada
El articulo fue reformado y la pregunta refleja la version antigua.

**Ejemplo real (ID 488):** Pregunta sobre reformas de la CE decia 2, pero tras Art. 49 (2024) son 3.

**Deteccion:** Lista de articulos reformados recientemente (CE Art. 49, 135, 13.2).

---

## Fases del Proceso

### Fase 0: Deteccion Automatica por SQL (sin agente)

Queries que detectan problemas estructurales sin necesidad de leer texto legal.

```sql
-- F0.1: Preguntas sin ninguna opcion correcta
SELECT id, legal_reference, LEFT(question_text, 100)
FROM questions
WHERE is_active = true
  AND NOT EXISTS (
    SELECT 1 FROM jsonb_array_elements(options) opt
    WHERE (opt->>'is_correct')::boolean = true
  );

-- F0.2: Preguntas con multiples opciones correctas
SELECT id, legal_reference, LEFT(question_text, 100)
FROM questions
WHERE is_active = true
  AND (SELECT COUNT(*) FROM jsonb_array_elements(options) opt
       WHERE (opt->>'is_correct')::boolean = true) > 1;

-- F0.3: Explanation vacia en preguntas verificadas
SELECT id, legal_reference
FROM questions
WHERE is_active = true AND review_comment LIKE '%CHAPTER_VERIFIED%'
  AND (explanation IS NULL OR explanation = '' OR LENGTH(explanation) < 20);

-- F0.4: legal_reference incoherente con tema
-- (ej: pregunta con legal_ref LOPJ en tema 9-LPAC)
SELECT id, tema, legal_reference, LEFT(question_text, 80)
FROM questions
WHERE is_active = true
  AND ((tema IN (9) AND legal_reference NOT ILIKE '%39/2015%' AND legal_reference NOT ILIKE '%LPAC%')
    OR (tema IN (10) AND legal_reference NOT ILIKE '%TREBEP%' AND legal_reference NOT ILIKE '%EBEP%' AND legal_reference NOT ILIKE '%7/2007%')
  )
LIMIT 30;
```

**Estado actual:** F0.1 y F0.2 ya ejecutados — 0 problemas detectados.

---

### Fase 1: Contradicciones Inter-Pregunta (hotspots)

**Alcance:** 116 articulos con 3+ preguntas (490 preguntas total).
**Prioridad:** Los 32 articulos con 5+ preguntas primero.

**Modelo:** Sonnet (comparacion sistematica, no requiere razonamiento legal profundo)

**Metodo:**
1. Query SQL agrupa preguntas por `legal_reference`
2. Para cada articulo con 3+ preguntas:
   a. Leer TODAS las preguntas de ese articulo (question_text + options + explanation)
   b. Extraer las afirmaciones que hace cada pregunta
   c. Verificar que no hay dos preguntas que afirmen cosas opuestas
   d. Si hay contradiccion: flag con `[CONTRADICTION]` + IDs afectados

**Query base:**
```sql
SELECT id, question_text, options, explanation, legal_reference, tema
FROM questions
WHERE is_active = true
  AND legal_reference = :article_ref
ORDER BY id;
```

**Output:** Para cada grupo de preguntas:
```
## Art. 122.3 CE (11 preguntas: IDs 439, 440, ...)
- Afirmaciones: [lista]
- Contradicciones: NINGUNA | IDs X vs Y: "afirmacion A" contradice "afirmacion B"
```

**Tag:** `[CONTRADICTION_CHECK_PASSED]` o `[CONTRADICTION_DETECTED] vs ID X`

---

### Fase 2: Verificacion Logica Pregunta-Respuesta-Ley

**Alcance:** Todas las 1,422 preguntas activas, priorizadas:
1. Las 490 de articulos hotspot (ya agrupadas por Fase 1)
2. Las ~930 restantes, agrupadas por ley

**Modelo:** Opus (requiere razonamiento juridico profundo)

**Metodo por pregunta:**
1. Leer el articulo citado en `legal_reference` del archivo de ley
2. Analizar la opcion marcada como correcta:
   - ¿Es EXACTAMENTE lo que dice el articulo?
   - ¿Falta algun calificador?
   - ¿Anade algo que el articulo no dice?
3. Analizar CADA opcion marcada como incorrecta:
   - ¿Es REALMENTE incorrecta segun el articulo?
   - ¿Podria ser parcialmente correcta?
   - ¿Es absurdamente incorrecta (distractor pobre)?
4. Analizar el enunciado:
   - ¿Las premisas son correctas?
   - ¿Hay calificadores perdidos vs original_text?
5. Analizar la explicacion:
   - ¿Cita el mismo articulo que legal_reference?
   - ¿Es coherente con la respuesta?

**Prompt del agente:**
```
VERIFICACION LOGICA — Ley [X], Capitulo [Y]

Para CADA pregunta del bloque:

1. Lee el articulo [ref] del archivo de ley
2. RESPUESTA: ¿La opcion is_correct=true es fiel al texto legal?
   - SI exacta → [LOGIC_OK]
   - SI con matiz → [LOGIC_MINOR] + explicar
   - NO → [LOGIC_ERROR] + corregir
3. DISTRACTORES: Para cada opcion is_correct=false:
   - ¿Es definitivamente incorrecta? → OK
   - ¿Es ambigua o parcialmente correcta? → [DISTRACTOR_WEAK]
   - ¿Es correcta segun la ley? → [DISTRACTOR_CORRECT] (critico)
4. PREMISA: ¿El enunciado afirma algo falso? → [PREMISE_ERROR]
5. EXPLICACION: ¿Es coherente con todo lo anterior? → [EXPLANATION_MISMATCH]

Output: UPDATE SQL solo para preguntas con problemas.
```

**Tags:**
| Tag | Gravedad | Significado |
|-----|----------|-------------|
| `[LOGIC_OK]` | Info | Pregunta logicamente correcta |
| `[LOGIC_ERROR]` | Critica | Respuesta marcada es incorrecta segun ley |
| `[DISTRACTOR_CORRECT]` | Critica | Un distractor es realmente correcto |
| `[DISTRACTOR_WEAK]` | Menor | Distractor ambiguo o demasiado obvio |
| `[PREMISE_ERROR]` | Mayor | Enunciado afirma algo falso |
| `[EXPLANATION_MISMATCH]` | Mayor | Explicacion contradice pregunta/respuesta/ley |
| `[QUALIFIER_MISSING]` | Mayor | Calificador legal perdido en reformulacion |
| `[CONTRADICTION_DETECTED]` | Critica | Contradice otra pregunta sobre mismo articulo |

---

### Fase 3: Verificacion de Reformas Legales

**Alcance:** Preguntas que citan articulos reformados.

**Articulos con reformas conocidas:**
| Articulo | Reforma | Impacto |
|----------|---------|---------|
| Art. 49 CE | 2024 (discapacidad) | Texto actualizado |
| Art. 135 CE | 2011 (estabilidad presupuestaria) | Nuevo contenido |
| Art. 13.2 CE | 1992 (Maastricht) | Derecho sufragio pasivo |
| CE general | 3 reformas total (no 2) | Preguntas sobre numero de reformas |

**Query:**
```sql
SELECT id, question_text, options, explanation, legal_reference
FROM questions
WHERE is_active = true
  AND (legal_reference ILIKE '%art. 49%CE%'
    OR legal_reference ILIKE '%art. 135%CE%'
    OR legal_reference ILIKE '%art. 13.2%CE%'
    OR question_text ILIKE '%reform%constituc%'
    OR question_text ILIKE '%cuantas veces%reform%'
    OR question_text ILIKE '%numero de reform%');
```

---

## Plan de Ejecucion

### Ronda 1: Contradicciones Inter-Pregunta (Fase 1)

**Ejecucion:** 2-3 agentes Sonnet en paralelo, agrupados por ley:

| Agente | Ley | Articulos hotspot | Preguntas |
|--------|-----|-------------------|-----------|
| D-CE | CE | ~80 articulos con 3+ qs | ~350 |
| D-L40 | Ley 40/2015 | ~25 articulos con 3+ qs | ~100 |
| D-OTRAS | LOTC+LOPJ+L50+TREBEP | ~11 articulos con 3+ qs | ~40 |

**Input por agente:** Lista de articulos + todas las preguntas por articulo.
**Output:** Reporte de contradicciones + tags SQL.
**Duracion estimada:** ~30 min (los agentes solo comparan, no leen ley).

### Ronda 2: Verificacion Logica (Fase 2)

**Ejecucion:** Agentes Opus agrupados por ley (como chapter verification):

| Agente | Ley | Preguntas | Capitulos |
|--------|-----|-----------|-----------|
| L-CE | CE | ~690 | ~12 titulos |
| L-L40 | Ley 40/2015 | ~220 | ~15 caps |
| L-LOTC | LOTC | ~80 | ~6 caps |
| L-LOPJ | LOPJ | ~67 | ~8 caps |
| L-L50 | Ley 50/1997 | ~47 | ~5 caps |
| L-TREBEP | TREBEP | ~24 | ~5 caps |
| L-OTRAS | L39+LBRL+L19+LGP+LOPDGDD | ~50 | varios |

**NOTA:** Esta ronda REUTILIZA la agrupacion por capitulo del pipeline Rev.2.
La diferencia es que el foco esta en la logica (no en drift/citas), y el agente
usa el checklist de 5 puntos de la Fase 2.

**Duracion estimada:** ~2-3 horas (1,422 preguntas con Opus).

### Ronda 3: Reformas Legales (Fase 3)

**Ejecucion:** 1 agente Sonnet con query especifica.
**Duracion estimada:** ~10 min (pocas preguntas afectadas).

---

## Metricas de Exito

Al finalizar el proceso, medir:

```sql
-- Resumen de discrepancias encontradas
SELECT
  COUNT(*) FILTER (WHERE review_comment LIKE '%LOGIC_ERROR%') as logic_errors,
  COUNT(*) FILTER (WHERE review_comment LIKE '%DISTRACTOR_CORRECT%') as distractor_correct,
  COUNT(*) FILTER (WHERE review_comment LIKE '%PREMISE_ERROR%') as premise_errors,
  COUNT(*) FILTER (WHERE review_comment LIKE '%EXPLANATION_MISMATCH%') as explanation_mismatch,
  COUNT(*) FILTER (WHERE review_comment LIKE '%CONTRADICTION_DETECTED%') as contradictions,
  COUNT(*) FILTER (WHERE review_comment LIKE '%QUALIFIER_MISSING%') as qualifier_missing,
  COUNT(*) FILTER (WHERE review_comment LIKE '%LOGIC_OK%') as logic_ok,
  COUNT(*) as total_active
FROM questions WHERE is_active = true;

-- Preguntas que necesitan atencion humana
SELECT id, legal_reference, LEFT(question_text, 80), review_comment
FROM questions
WHERE is_active = true
  AND (review_comment LIKE '%LOGIC_ERROR%'
    OR review_comment LIKE '%DISTRACTOR_CORRECT%'
    OR review_comment LIKE '%CONTRADICTION_DETECTED%')
ORDER BY id;
```

**Objetivo:** <2% de preguntas con discrepancias criticas (LOGIC_ERROR + DISTRACTOR_CORRECT + CONTRADICTION).

---

## Regla de Oro

> **Si hay duda sobre si una respuesta es correcta, la ley manda.**
>
> No importa cuantas preguntas anteriores digan X. Si el articulo dice Y,
> la respuesta es Y. Corregir todas las preguntas que digan X.
