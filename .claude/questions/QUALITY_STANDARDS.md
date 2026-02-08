# Estándar de Calidad de Preguntas - OpositaSmart

> Referencia para crear, revisar y mejorar preguntas que un profesor de oposiciones firmaría como suyas.

---

## Diagnóstico Actual (Feb 2026)

**1,368 preguntas activas** analizadas. Resultados:

| Problema | Cantidad | % del Total |
|----------|----------|-------------|
| Sin explicación | 1,107 | 81% |
| Enunciado < 50 caracteres (fragmento) | 188 | 14% |
| Enunciado < 80 caracteres | 557 | 41% |
| Usan abreviaciones sin expandir | ~200+ | ~15%+ |
| Dificultad media baja (2.0-2.6) | mayoría | — |

### Abreviaciones más frecuentes en preguntas

| Abreviación | Apariciones | Nombre completo |
|-------------|-------------|-----------------|
| CE | 112 | Constitución Española |
| LRJSP | 40 | Ley de Régimen Jurídico del Sector Público |
| CCAA | 14 | Comunidades Autónomas |
| AGE | 13 | Administración General del Estado |
| LOPJ | 13 | Ley Orgánica del Poder Judicial |
| CGPJ | 12 | Consejo General del Poder Judicial |
| CCGG | 6 | Cortes Generales |
| EBEP/TREBEP | 3 | Estatuto Básico del Empleado Público |

---

## Sistema de Tiers de Calidad

### Tier S — Nivel Examen Oficial (objetivo)

La pregunta podría aparecer en un examen real del BOE. Indicadores:

- [x] Enunciado autónomo y completo (≥80 caracteres)
- [x] Sin abreviaciones no expandidas (primera mención completa)
- [x] Explicación detallada con referencia legal específica (Art. + apartado)
- [x] Explica por qué las incorrectas son incorrectas
- [x] Distractores plausibles basados en errores reales de opositores
- [x] Dificultad calibrada (no todo nivel 2)
- [x] Contexto suficiente para que el enunciado se entienda solo

**Distribución actual: ~60 preguntas (4%)**

### Tier A — Calidad Profesional

Pregunta sólida que un profesor aprobaría. Indicadores:

- [x] Enunciado claro y completo (≥60 caracteres)
- [x] Abreviaciones aceptables si son estándar del campo (CE, CCAA) y contexto es claro
- [x] Explicación presente con referencia legal
- [x] Al menos menciona por qué la correcta es correcta
- [ ] Puede no explicar cada distractor individualmente

**Distribución actual: ~131 preguntas (10%)**

### Tier B — Necesita Mejora

Pregunta funcional pero con carencias visibles. Indicadores:

- Enunciado tipo fragmento ("El Rey es:", "Los Ministros:")
- Puede tener explicación pero sin referencia legal específica
- Abreviaciones sin expandir en contextos ambiguos
- Distractores pueden ser obvios o poco trabajados

**Distribución actual: ~1,076 preguntas (79%)**

### Tier C — Calidad Insuficiente

Pregunta que no debería estar en producción. Indicadores:

- Enunciado de <40 caracteres sin contexto
- Sin explicación
- Posibles errores ortográficos
- "Señale la falsa:" sin especificar sobre qué tema
- Opciones sin ninguna marcada como correcta

**Distribución actual: ~101 preguntas (7%)**

---

## Los 10 Anti-Patrones (qué NO hacer)

### 1. Enunciado Fragmento
```
❌ "El Rey es:"
❌ "Los Ministros:"
❌ "Señale la falsa:"
```
El enunciado no proporciona contexto. El estudiante no sabe sobre qué aspecto se pregunta hasta leer las opciones.

### 2. Abreviaciones sin Expandir
```
❌ "Según la CE, las CCAA podrán..."
❌ "El CGPJ nombra a los vocales del TC según la LOPJ..."
```
En un examen real, la primera mención es siempre el nombre completo.

### 3. Explicación Vacía
```
❌ explanation: ""
❌ explanation: null
```
Sin explicación, el estudiante no aprende de sus errores. Una pregunta sin explicación es una oportunidad de aprendizaje desperdiciada.

### 4. Referencia Legal Vaga
```
❌ "Según la Constitución..."
❌ "La ley establece que..."
✅ "El artículo 56.1 de la Constitución Española establece..."
```

### 5. Distractores Obviamente Falsos
```
❌ Opción D: "El Rey nombra libremente a todos los jueces" (absurdo)
✅ Opción D: "El Presidente del Gobierno refrenda el nombramiento" (plausible pero incorrecto)
```

### 6. Todas las Preguntas Nivel 2
La dificultad real de oposiciones va de 1 a 5. Tener todas en 2 no prepara al opositor.

### 7. "Señale la falsa/correcta" sin Contexto
```
❌ "Señale la correcta:"
✅ "Señale la afirmación correcta respecto a las funciones del Defensor del Pueblo:"
```

### 8. Opciones sin Respuesta Marcada
Algunas preguntas tienen `is_correct: false` en todas las opciones. Esto es un bug de datos.

### 9. Dobles Formatos de Opciones
```
❌ Formato mixto: algunos con {text, is_correct} y otros con {id, text, position, is_correct}
✅ Formato unificado: siempre {id, text, position, is_correct}
```

### 10. Errores Ortográficos
```
❌ "liberta" → "libertad"
❌ "contine" → "contiene"
```

---

## 5 Ejemplos Antes/Después

### Ejemplo 1: Enunciado Fragmento → Enunciado Completo

**ANTES (ID 809, Tier C):**
```
Pregunta: "El Rey es:"
Opciones:
  a) el Jefe del Estado, símbolo de su integridad y permanencia.
  b) el Jefe del Gobierno, símbolo de su integridad y permanencia.
  c) el Jefe del Estado, símbolo de su unidad y permanencia.
  d) el Jefe del Gobierno, símbolo de su unidad y permanencia.
Explicación: (vacía)
Dificultad: 2
```

**DESPUÉS (Tier S):**
```
Pregunta: "Según el artículo 56 de la Constitución Española, ¿cuál de las
siguientes afirmaciones define correctamente la figura del Rey?"
Opciones:
  a) Es el Jefe del Estado, símbolo de su unidad y permanencia.
  b) Es el Jefe del Estado, símbolo de su integridad y permanencia.
  c) Es el Jefe del Gobierno, símbolo de su unidad y permanencia.
  d) Es el Jefe del Estado, garante de su soberanía y permanencia.
Explicación: "El artículo 56.1 de la Constitución Española establece
  literalmente que 'El Rey es el Jefe del Estado, símbolo de su unidad y
  permanencia'. La palabra clave es 'unidad' (no 'integridad' ni
  'soberanía'). El Rey es Jefe del Estado, no del Gobierno (el Presidente
  del Gobierno dirige la acción del Gobierno según el Art. 98 CE)."
Dificultad: 2
```

**Cambios:** Enunciado con contexto legal + explicación completa + distractores que juegan con palabras exactas del artículo.

---

### Ejemplo 2: "Señale la falsa" sin Contexto → Con Contexto

**ANTES (ID 790, Tier C):**
```
Pregunta: "Señale la falsa:"
Opciones:
  a) El nombramiento del Presidente del Gobierno es refrendado por el
     Presidente del Congreso.
  b) El nombramiento por el Rey de los miembros Civiles y Militares de
     su Casa no está sujeto a refrendo.
  c) La convocatoria de elecciones generales periódicas está refrendada
     por el Presidente del Congreso.
  d) El nombramiento del Presidente del Tribunal Supremo está refrendado
     por el Presidente del Gobierno.
Explicación: (vacía)
Dificultad: 2
```

**DESPUÉS (Tier S):**
```
Pregunta: "En relación con el refrendo de los actos del Rey regulado en
los artículos 56 y 64 de la Constitución Española, señale la afirmación
INCORRECTA:"
Opciones:
  a) El nombramiento del Presidente del Gobierno es refrendado por el
     Presidente del Congreso.
  b) El nombramiento de los miembros civiles y militares de la Casa del
     Rey no está sujeto a refrendo.
  c) La convocatoria de elecciones generales periódicas es refrendada
     por el Presidente del Congreso.
  d) El nombramiento del Presidente del Tribunal Supremo es refrendado
     por el Presidente del Gobierno.
Explicación: "La opción C es incorrecta. Según el artículo 64 CE, la
  convocatoria de elecciones generales periódicas es refrendada por el
  Presidente del Gobierno, no por el Presidente del Congreso. El Presidente
  del Congreso solo refrenda dos actos: la propuesta de candidato a
  Presidente del Gobierno y el nombramiento de éste (Art. 64.1 CE).
  La opción B es correcta: el Art. 65.2 CE establece que el Rey nombra
  y releva libremente a los miembros civiles y militares de su Casa,
  sin necesidad de refrendo (Art. 56.3 CE, como excepción)."
Dificultad: 4
```

**Cambios:** Contexto temático en enunciado + "INCORRECTA" en mayúsculas + explicación que analiza cada opción + dificultad recalibrada a 4.

---

### Ejemplo 3: Abreviaciones → Nombres Completos

**ANTES (ID 898, Tier C):**
```
Pregunta: "Las CCAA designarán:"
Opciones:
  a) Un senador, y otro más por cada millón de habitantes.
  b) Dos senadores, y otro más por cada millón de habitantes.
  c) Un senador por cada millón de habitantes.
  d) Dos senadores por cada millón de habitantes.
Explicación: (vacía)
Dificultad: 2
```

**DESPUÉS (Tier S):**
```
Pregunta: "Según el artículo 69.5 de la Constitución Española, ¿cuántos
Senadores designan las Comunidades Autónomas?"
Opciones:
  a) Un Senador por cada Comunidad Autónoma, y otro más por cada millón
     de habitantes de su respectivo territorio.
  b) Dos Senadores por cada Comunidad Autónoma, y otro más por cada
     millón de habitantes de su respectivo territorio.
  c) Un Senador por cada millón de habitantes de su respectivo territorio.
  d) Dos Senadores por cada millón de habitantes de su respectivo
     territorio, sin un mínimo garantizado.
Explicación: "El artículo 69.5 de la Constitución Española establece
  que las Comunidades Autónomas designarán, además, un Senador y otro
  más por cada millón de habitantes de su respectivo territorio. La
  designación corresponde a la Asamblea legislativa de cada Comunidad
  Autónoma. La opción A es correcta: hay un Senador base (no dos) más
  uno adicional por cada millón. Es un error frecuente confundir este
  artículo con el 69.2 (Senadores provinciales)."
Dificultad: 3
```

**Cambios:** "CCAA" expandido + artículo específico en enunciado + explicación con referencia + error frecuente señalado.

---

### Ejemplo 4: Pregunta sin Explicación → Explicación Completa

**ANTES (ID 1366, Tier C):**
```
Pregunta: "Los vocales del CGPJ:"
Opciones:
  a) Tienen un mandato de 4 años y podrán ser reelegidos por una sola vez.
  b) Tienen un mandato de 4 años y no podrán ser nombrados vocales los
     vocales del Consejo saliente.
  c) Tienen un mandato de 5 años y podrán ser reelegidos por una sola vez.
  d) Tienen un mandato de 5 años y no podrán ser nombrados los vocales
     del Consejo saliente.
Explicación: (vacía)
Dificultad: 2
```

**DESPUÉS (Tier S):**
```
Pregunta: "Respecto al mandato de los vocales del Consejo General del
Poder Judicial (CGPJ), señale la afirmación correcta conforme a la Ley
Orgánica del Poder Judicial:"
Opciones:
  a) Tienen un mandato de 4 años y podrán ser reelegidos por una sola vez.
  b) Tienen un mandato de 4 años y no podrán ser nombrados vocales los
     vocales del Consejo saliente.
  c) Tienen un mandato de 5 años y podrán ser reelegidos por una sola vez.
  d) Tienen un mandato de 5 años y no podrán ser nombrados vocales del
     Consejo saliente.
Explicación: "La opción D es correcta. El artículo 568 de la Ley
  Orgánica 6/1985, del Poder Judicial, establece que el mandato de los
  vocales del CGPJ es de 5 años (no 4, como establece la CE para otras
  instituciones como el TC). Además, según el artículo 567 LOPJ, no
  podrán ser reelegidos los vocales del Consejo saliente. Este dato es
  clave: mandato de 5 años SIN posibilidad de reelección."
Dificultad: 3
```

**Cambios:** CGPJ expandido en primera mención + abreviado entre paréntesis + referencia legal precisa + explicación que resalta la trampa (5 años, no 4).

---

### Ejemplo 5: Pregunta Aceptable → Pregunta de Nivel Examen

**ANTES (ID 252, Tier B):**
```
Pregunta: "La mayoría de edad en España se alcanza a los:"
Opciones:
  a) 16 años
  b) 18 años
  c) 21 años
  d) Depende de cada Comunidad Autónoma
Explicación: "El artículo 12 de la Constitución establece que 'Los
  españoles son mayores de edad a los dieciocho años'."
Dificultad: 2
```

**DESPUÉS (Tier S):**
```
Pregunta: "Según la Constitución Española, ¿a qué edad se alcanza la
mayoría de edad en España y en qué artículo se regula?"
Opciones:
  a) A los 18 años, regulado en el artículo 12 de la Constitución.
  b) A los 18 años, regulado en el artículo 14 de la Constitución.
  c) A los 16 años, regulado en el artículo 12 de la Constitución.
  d) A los 18 años, pero las Comunidades Autónomas pueden establecer
     una edad diferente en sus Estatutos.
Explicación: "El artículo 12 de la Constitución Española establece
  textualmente: 'Los españoles son mayores de edad a los dieciocho años'.
  Este artículo se ubica en el Título I (Derechos y deberes
  fundamentales), antes del Capítulo I. La mayoría de edad es uniforme
  en todo el territorio nacional; las Comunidades Autónomas no pueden
  modificarla ya que es una materia constitucional. La opción B es
  incorrecta porque el Art. 14 regula la igualdad ante la ley, no la
  mayoría de edad."
Dificultad: 2
```

**Cambios:** Enunciado completo con doble dato + distractor que combina dato correcto con artículo incorrecto (trampa real de examen) + explicación que ubica el artículo en la estructura constitucional.

---

## Reglas de Reformulación

Cuando se reformula una pregunta (original del PDF → versión mejorada):

### NUNCA perder la referencia legal del original

Si el original dice "según el Art. 164 de la Constitución:", la reformulación **DEBE** mantener esa referencia:

```
❌ Original: "Las sentencias del TC, según el Art. 164 de la Constitución:"
❌ Reformulada: "¿Dónde se publican las sentencias del TC?"
   → Se perdió el artículo 164

✅ Reformulada: "Según el artículo 164 de la Constitución, ¿dónde se publican
   las sentencias del Tribunal Constitucional y qué deben incluir?"
   → Artículo preservado + abreviación expandida + pregunta completa
```

### Checklist de Reformulación

```
[ ] ¿Se preservó la referencia legal del original (artículo, ley)?
[ ] ¿Se expandieron las abreviaciones en primera mención?
[ ] ¿El enunciado es una pregunta completa (≥80 caracteres)?
[ ] ¿Se mantuvo la dificultad original o se justificó el cambio?
[ ] ¿El campo legal_reference está rellenado?
```

### Campo `legal_reference` (obligatorio)

Toda pregunta Tier S debe tener el campo `legal_reference` con la referencia
concisa al artículo: "Art. 164.1 CE", "Art. 21 LRBRL", etc. Este campo se
muestra en el panel de revisión y permite filtrar preguntas por artículo.

---

## Workflow de Creación de Preguntas Tier S

### Fase 1: Redacción del Enunciado

```
1. Empezar con referencia legal: "Según el artículo X de la [ley completa]..."
   o con contexto temático: "En relación con [tema específico]..."
2. Formular pregunta completa (≥80 caracteres)
3. Si se pide "señale la falsa/correcta", SIEMPRE especificar sobre qué
4. Primera mención de cualquier institución/ley = nombre completo
   - Después se puede abreviar entre paréntesis: "...del Consejo General
     del Poder Judicial (CGPJ)..."
```

### Fase 2: Diseño de Opciones

```
1. La opción correcta debe usar el texto legal exacto o muy cercano
2. Los distractores deben explotar errores reales de opositores:
   - Confundir artículos cercanos (Art. 23.1 vs 23.2)
   - Confundir instituciones similares (Congreso vs Cortes)
   - Cambiar un dato numérico (5 años vs 4 años, 3/5 vs 2/3)
   - Atribuir competencias al órgano equivocado
3. Longitud similar entre todas las opciones
4. Evitar que la correcta sea siempre la más larga
```

### Fase 3: Explicación

```
1. OBLIGATORIA - nunca dejar vacía
2. Estructura mínima:
   a) Citar artículo específico (Art. + apartado + Ley)
   b) Explicar por qué la correcta es correcta
   c) Explicar por qué al menos 1-2 incorrectas son incorrectas
   d) Señalar el error frecuente si aplica
3. Longitud objetivo: 80-250 caracteres
```

### Fase 4: Metadatos

```
1. Dificultad real (no todo nivel 2):
   - Nivel 1: Dato directo ("¿Cuántos artículos tiene la CE?")
   - Nivel 2: Memorización simple (un artículo concreto)
   - Nivel 3: Comprensión (relacionar artículo con concepto)
   - Nivel 4: Análisis (comparar procedimientos, detectar excepciones)
   - Nivel 5: Caso práctico o detalle muy específico
2. Legal reference: Siempre incluir
3. Materia y tema: Verificar que coinciden
```

### Fase 5: Verificación Pre-Publicación

```
Checklist Tier S:
[ ] ¿El enunciado se entiende sin leer las opciones?
[ ] ¿Todas las abreviaciones están expandidas en primera mención?
[ ] ¿La explicación cita un artículo específico?
[ ] ¿Los distractores son plausibles (no absurdos)?
[ ] ¿La dificultad refleja la complejidad real?
[ ] ¿Hay exactamente una opción correcta?
[ ] ¿La explicación explica por qué las incorrectas son incorrectas?
[ ] ¿Un opositor entendería qué se pregunta sin contexto adicional?
```

---

## Reglas de Abreviaciones

### Tabla de Referencia

| Abreviación | Nombre Completo | Usar en primera mención |
|-------------|-----------------|------------------------|
| CE | Constitución Española | Sí, siempre expandir |
| CCAA | Comunidades Autónomas | Sí |
| CCGG | Cortes Generales | Sí |
| CGPJ | Consejo General del Poder Judicial | Sí |
| TC | Tribunal Constitucional | Sí |
| TS | Tribunal Supremo | Sí |
| LOPJ | Ley Orgánica del Poder Judicial | Sí |
| LOTC | Ley Orgánica del Tribunal Constitucional | Sí |
| LRJSP | Ley 40/2015, de Régimen Jurídico del Sector Público | Sí |
| LPAC | Ley 39/2015, del Procedimiento Administrativo Común | Sí |
| EBEP/TREBEP | Texto Refundido del Estatuto Básico del Empleado Público | Sí |
| AGE | Administración General del Estado | Sí |
| BOE | Boletín Oficial del Estado | Sí |
| LOFCS | Ley Orgánica de Fuerzas y Cuerpos de Seguridad | Sí |
| LRBRL | Ley Reguladora de las Bases del Régimen Local | Sí |
| LGP | Ley General Presupuestaria | Sí |
| OOAA | Organismos Autónomos | Sí |
| EELL | Entidades Locales | Sí |

### Regla

> **Primera mención** en enunciado Y en opciones: nombre completo.
> **Menciones siguientes** en el mismo texto: abreviación aceptable.
> **En explicaciones**: abreviación aceptable (el contexto ya está claro).

### Excepción

En opciones de respuesta, si el nombre completo haría la opción excesivamente larga (>150 caracteres), se permite la abreviación si el enunciado ya menciona el nombre completo.

---

## Plan de Mejora Masiva

### Prioridad 1 — Crítica (1,107 preguntas sin explicación)

Añadir explicaciones a todas las preguntas que no las tienen. Cada explicación debe incluir:
- Artículo específico
- Por qué la correcta es correcta
- Al menos un distractor explicado

### Prioridad 2 — Alta (188 preguntas fragmento)

Reescribir enunciados de <50 caracteres para que sean autónomos y contextualizados.

### Prioridad 3 — Media (~200 preguntas con abreviaciones)

Expandir abreviaciones en primera mención. Mantener abreviación entre paréntesis para referencia.

### Prioridad 4 — Baja (recalibrar dificultad)

Revisar dificultad de todas las preguntas. La distribución actual está sesgada hacia nivel 2.

---

---

## Lecciones del Piloto de Calidad (Feb 2026, 55 preguntas)

### Resultados del Piloto

| Tier | Cantidad | % |
|------|----------|---|
| S | 12 | 22% |
| A | 19 | 35% |
| B | 18 | 33% |
| C | 6 | 11% |

### Anti-Patrón 11: `legal_reference` con Texto Explicativo

El campo `legal_reference` debe contener SOLO la cita legal, no una explicación.

```
❌ "artículo 158.2 de la Constitución Española, los recursos del Fondo de Compensación serán distribuidos por las Cortes Generales (no solo por el Senado) entre las Comunidades Autónomas y provincias, en su caso"
✅ "Art. 158.2 CE"
```

**Frecuencia detectada:** ~30% de preguntas del piloto.

### Anti-Patrón 12: Contradicciones Entre Preguntas

Dos preguntas sobre el mismo artículo legal pueden tener respuestas que se contradicen mutuamente.

**Ejemplo real detectado (IDs 765 vs 1007):**
- ID 765: "Ministro de la Presidencia" marcado como FALSO (dice que debería ser "Ministro que determine el Presidente")
- ID 1007: "Ministro de la Presidencia" marcado como VERDADERO
- Ambas citan Art. 8.1 Ley 50/1997

**Regla:** Al crear/revisar una pregunta sobre un artículo, SIEMPRE buscar otras preguntas sobre el mismo artículo y verificar coherencia:
```sql
SELECT id, question_text, legal_reference
FROM questions
WHERE legal_reference ILIKE '%art. 8%' AND legal_reference ILIKE '%50/1997%';
```

### Anti-Patrón 13: Tema Mal Asignado

Preguntas asignadas a un tema que no corresponde con su contenido legal.

**Ejemplo real:** 12/15 preguntas en batch 5 tenían tema incorrecto:
- Preguntas de Tribunal Constitucional asignadas a Tema 9 (LPAC)
- Preguntas de LBRL asignadas a Tema 11 (LRJSP)

**Checklist de verificación de tema:**
```
[ ] ¿La ley citada en legal_reference corresponde al tema asignado?
[ ] ¿El contenido de la pregunta encaja en la materia del tema?
```

**Mapeo Tema → Leyes principales:**
| Tema | Leyes |
|------|-------|
| 1 | CE Título Preliminar, Art. 1-9 |
| 2 | CE Título I, Derechos fundamentales |
| 3 | CE Título II (Corona), III (Cortes) |
| 4 | CE Título IV (Gobierno), VI (Poder Judicial), IX (TC) |
| 5 | Ley 40/2015 LRJSP Título II, Ley 50/1997 (organización) |
| 6 | Ley 50/1997 (Gobierno), Art. 97-107 CE |
| 7 | Ley 40/2015 LRJSP (régimen jurídico) |
| 8 | Ley 40/2015 LRJSP (órganos colegiados, convenios) |
| 9 | Ley 39/2015 LPAC |
| 10 | TREBEP/EBEP |
| 11 | Ley 40/2015 LRJSP (sector público institucional) |

### Anti-Patrón 14: Respuestas Desactualizadas por Reformas Legales

Preguntas cuya respuesta era correcta cuando se crearon pero ya no lo es por reformas posteriores.

**Ejemplo real (ID 488):** Pregunta sobre cuántas veces se ha reformado la CE. Respuesta marcaba 2, pero tras la reforma del Art. 49 en 2024, la respuesta correcta es 3.

**Artículos susceptibles de cambio reciente:**
- Art. 49 CE (reforma 2024 - discapacidad)
- Art. 135 CE (reforma 2011 - estabilidad presupuestaria)
- Art. 13.2 CE (reforma 1992 - Maastricht)

### Criterio Adicional para Tier S: Coherencia Inter-Preguntas

Una pregunta no puede ser Tier S si contradice otra pregunta del banco sobre el mismo artículo legal. La coherencia entre preguntas es obligatoria.

```
Checklist ampliado Tier S:
[ ] Todos los criterios anteriores
[ ] No contradice ninguna otra pregunta sobre el mismo artículo
[ ] La ley citada no ha sido reformada después de la creación de la pregunta
[ ] El tema asignado corresponde con la materia legal de la pregunta
```

---

## Pipeline de Calidad Multi-Agente (diseñado Feb 2026)

### Agente 1: Reformulador/Limpiador (automático)
- Limpiar `legal_reference` (solo cita, sin explicación)
- Expandir abreviaturas en primera mención
- Enriquecer enunciados cortos (<80 chars) con contexto
- Normalizar formato de opciones
- **Resuelve:** ~55% de issues (Tier A → S)

### Agente 2: Verificador Lógico (automático, flagea dudas)
- Verificar que la "incorrecta" sea realmente incorrecta
- Detectar inversiones de lógica en reformulaciones
- Verificar artículos legales citados contra fuentes
- Si confianza < 0.90 → flag para humano
- **Resuelve:** errores lógicos silenciosos

### Agente 3: Cazador de Discrepancias (automático, flagea todo)
- Buscar contradicciones entre preguntas sobre mismo artículo
- Verificar asignación de tema vs contenido real
- Detectar preguntas afectadas por reformas legales recientes
- Todo lo que encuentre → flag para humano
- **Resuelve:** problemas sistémicos inter-preguntas

### Resultado esperado
- ~55-60% arreglable automáticamente (Agente 1)
- ~30% revisión rápida humana (Agentes 2-3 flagean)
- ~10% decisión humana (contradicciones, reformas, ambigüedades legales)

---

*Documento creado: 2026-02-07*
*Última actualización: 2026-02-08*
