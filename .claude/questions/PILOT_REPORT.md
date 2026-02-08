# Reporte Piloto de Calidad - 55 Preguntas

> Fecha: 2026-02-08 | Objetivo: Evaluar calidad real del banco y diseñar pipeline escalable

---

## Resumen Ejecutivo

| Tier | Cant. | % | Descripción |
|------|-------|---|-------------|
| **S** | 12 | 22% | Perfectas, nivel examen oficial |
| **A** | 19 | 35% | Buenas, problemas menores arreglables automáticamente |
| **B** | 18 | 33% | Problemas significativos, necesitan revisión humana |
| **C** | 6 | 11% | Rotas, deben corregirse urgentemente |

---

## Issues Críticos (Acción Inmediata)

### 1. ID 488 (Tema 1) - RESPUESTA INCORRECTA
- **Pregunta:** Reformas de la CE - dice que se ha reformado 3 veces (marcada como INCORRECTA)
- **Problema:** La CE SÍ se ha reformado 3 veces: 1992 (Art. 13.2), 2011 (Art. 135), 2024 (Art. 49)
- **Acción:** La opción c) ya no es incorrecta. Hay que cambiar la respuesta correcta o reformular opciones.

### 2. ID 1379 (Tema 7) - RESPUESTA DUDOSA
- **Pregunta:** Competencias que NO corresponden a Delegados del Gobierno
- **Marcada:** a) "Nombrar a los Subdelegados del Gobierno"
- **Problema:** Art. 69.3 Ley 40/2015 dice que los Subdelegados SÍ son nombrados por el Delegado. La explicación reconoce esto pero intenta distinguir "competencia del art. 73" vs "función orgánica". Distinción confusa para un opositor.
- **Acción:** Revisión humana - ¿es suficientemente clara la distinción?

### 3. ID 1426 (Tema 6) - RESPUESTA POSIBLEMENTE INCORRECTA
- **Pregunta:** Secretario General del Consejo de Estado se nombra a propuesta de...
- **Marcada:** a) "El Presidente del Consejo de Estado"
- **Problema:** Art. 12 LO 3/1980 podría decir "a propuesta de la Comisión Permanente aprobada por el Pleno" (según búsqueda web). Necesita verificación con texto vigente.
- **Acción:** Verificar texto vigente del Art. 12 LO 3/1980

### 4. IDs 765 vs 1007 - CONTRADICCIÓN ENTRE PREGUNTAS
- **ID 765 (Tema 5):** "Ministro de la Presidencia" → marcada como FALSA
- **ID 1007 (Tema 6):** "Ministro de la Presidencia" → marcada como VERDADERA
- Ambas sobre Art. 8.1 Ley 50/1997, presidencia de la Comisión General
- **Acción:** Verificar texto vigente. Una de las dos está mal.

### 5. IDs 224, 226, 228 (Tema 9) - TEMA INCORRECTO
- Son preguntas sobre el Tribunal Constitucional (CE Arts. 159, 161, 164)
- Asignadas a Tema 9 (que es LPAC - Ley 39/2015)
- Deberían estar en Tema 3 o 4
- **Acción:** Reasignar tema

### 6. Temas incorrectos masivos en Batch 5
- IDs 555, 1039, 1056, 1057, 1066 (Tema 10): Son sobre CE y LBRL, no TREBEP
- IDs 579, 588, 591, 1175, 1182 (Tema 11): Son sobre LBRL, no LRJSP
- **Acción:** Reasignación masiva de temas

---

## Análisis Detallado por Pregunta

### BATCH 1: Temas 1-2

#### ID 411 | Tema 1 | Tier: S
**Pregunta:** Señale la respuesta INCORRECTA en relación con el procedimiento de investigación ante el Defensor del Pueblo...
**Correcta:** b) Solo pueden presentarse por ciudadanos españoles
**Logic:** OK - Art. 10.1 LO 3/1981, cualquier persona natural o jurídica puede dirigir quejas
**Calidad:** Enunciado completo, explicación detallada, legal_reference limpia
**Issues:** Ninguno

#### ID 488 | Tema 1 | Tier: C
**Pregunta:** Respecto de las siguientes afirmaciones sobre la CE de 1978, indique la INCORRECTA:
**Correcta marcada:** c) Ha sido reformada en 3 ocasiones
**Logic:** INCORRECTO - Tras la reforma de 2024 (Art. 49), la CE SÍ ha sido reformada 3 veces
**Calidad:** Buena estructura, pero la respuesta ya no es válida
**Issues:** Respuesta desactualizada por reforma legal de 2024

#### ID 1112 | Tema 1 | Tier: B
**Pregunta:** En caso de reforma constitucional, respecto del referéndum señale la afirmación FALSA:
**Correcta:** d) Precisará de autorización por mayoría absoluta del Congreso
**Logic:** Correcto pero la explicación mezcla Art. 92 (referéndum consultivo) con reforma constitucional
**Calidad:** La referencia legal cita Art. 92 CE (LO 2/1980) pero la pregunta es sobre reforma constitucional (Arts. 167-168)
**Issues:** Referencia legal imprecisa, explicación confusa

#### ID 1132 | Tema 1 | Tier: A
**Pregunta:** Señale la falsa de acuerdo con lo dispuesto en el Título V de la CE:
**Correcta:** a) "tiempo mínimo mensual" (debería ser semanal)
**Logic:** OK - Art. 111.1 CE dice semanal, no mensual
**Calidad:** Buena pregunta
**Issues:** legal_reference contiene texto explicativo largo en vez de cita limpia

#### ID 1290 | Tema 1 | Tier: S
**Pregunta:** ¿Cuál de estas funciones no corresponden al Rey según la CE?
**Correcta:** a) Sancionar los decretos (debería ser "expedir")
**Logic:** OK - Art. 62.f CE: expedir decretos, sancionar leyes
**Calidad:** Buena explicación, referencia clara
**Issues:** Ninguno

#### ID 193 | Tema 2 | Tier: A
**Pregunta:** La igualdad regulada en el artículo 14 es objeto de las siguientes garantías (FALSA):
**Correcta:** b) Desarrollo por Ley ordinaria (debería ser LO)
**Logic:** OK
**Calidad:** Formato de opciones legacy (sin id/position). Buena explicación.
**Issues:** Formato de opciones inconsistente

#### ID 199 | Tema 2 | Tier: S
**Pregunta:** El artículo 24 de la CE recoge:
**Correcta:** a) Derecho a la tutela judicial efectiva
**Logic:** OK
**Calidad:** Clara, limpia
**Issues:** Ninguno

#### ID 284 | Tema 2 | Tier: A
**Pregunta:** ¿Quién designa al Defensor del Pueblo?
**Correcta:** c) Las Cortes Generales
**Logic:** OK - Art. 54 CE
**Calidad:** Enunciado corto (39 chars < 80). Explicación breve.
**Issues:** Enunciado debería tener más contexto

#### ID 286 | Tema 2 | Tier: A
**Pregunta:** El Tribunal de Cuentas depende directamente de:
**Correcta:** c) Las Cortes Generales
**Logic:** OK - Art. 136.1 CE
**Calidad:** Enunciado corto (46 chars < 80). Explicación con cita textual.
**Issues:** Enunciado debería tener más contexto

#### ID 613 | Tema 2 | Tier: S
**Pregunta:** Sobre el contenido de las Resoluciones del Defensor del Pueblo señale cuál no es correcta:
**Correcta:** a) "podrá obligar" (debería ser "sugerir")
**Logic:** OK - Art. 28.2 LO 3/1981
**Calidad:** Excelente pregunta, opciones largas y detalladas, buena explicación
**Issues:** Ninguno

---

### BATCH 2: Temas 3-4

#### ID 102 | Tema 3 | Tier: B
**Pregunta:** ¿Cuál de las siguientes competencias NO corresponde al Pleno del TC?
**Correcta:** b) Recurso de amparo
**Logic:** OK - Art. 11 LOTC, las Salas conocen del amparo
**Calidad:** Enunciado corto (69 chars). Explicación breve. Reformulación no mantiene semántica original.
**Issues:** Posible reformulación imprecisa, enunciado corto

#### ID 110 | Tema 3 | Tier: A
**Pregunta:** Según el artículo 164 CE, ¿desde cuándo producen efectos de cosa juzgada...?
**Correcta:** a) día siguiente de su publicación, sin recurso
**Logic:** OK - Art. 164.1 CE
**Calidad:** Buena pregunta con artículo en enunciado
**Issues:** Menor - opciones podrían ser más distintas

#### ID 664 | Tema 3 | Tier: S
**Pregunta:** De las siguientes afirmaciones sobre el Rey según la CE, señale la INCORRECTA:
**Correcta:** c) "no pudiendo utilizar ningún otro" (sí puede)
**Logic:** OK - Art. 56.2 CE
**Calidad:** Buena pregunta, buena explicación con cita textual
**Issues:** legal_reference contiene texto explicativo

#### ID 682 | Tema 3 | Tier: A
**Pregunta:** Señale la afirmación FALSA respecto al juramento previsto en el artículo 61 CE:
**Correcta:** d) La regulación no está en el Art. 61 (sí está)
**Logic:** OK
**Calidad:** Buena pregunta
**Issues:** legal_reference contiene texto explicativo

#### ID 692 | Tema 3 | Tier: A
**Pregunta:** ¿Cuál de las siguientes afirmaciones sobre el TC es FALSA?
**Correcta:** a) "plazo de 3 días" (debería ser 2)
**Logic:** OK - Art. 93.2 LOTC
**Calidad:** Buena pregunta de detalle numérico
**Issues:** Menor

#### ID 789 | Tema 4 | Tier: B
**Pregunta:** Funciones de nombramiento del Rey, señale la FALSA:
**Correcta:** c) Nombrar al Defensor del Pueblo
**Logic:** OK - Art. 54 CE, es designado por las Cortes
**Calidad:** Distinción técnica entre "designar" (Cortes) y "nombrar" (Rey)
**Issues:** legal_reference tiene texto explicativo. Distinción designar/nombrar ambigua - el Defensor del Pueblo técnicamente es nombrado por el Presidente del Congreso tras ser elegido por las Cortes.

#### ID 790 | Tema 4 | Tier: S
**Pregunta:** En relación con el refrendo de los actos del Rey, señale la FALSA:
**Correcta:** c) Convocatoria de elecciones refrendada por Presidente del Congreso (es por PM)
**Logic:** OK - Art. 64.1 CE
**Calidad:** Excelente pregunta tipo examen real
**Issues:** legal_reference contiene texto explicativo

#### ID 804 | Tema 4 | Tier: S
**Pregunta:** Según el artículo 57 de la CE, la Corona es hereditaria:
**Correcta:** c) En los sucesores de Don Juan Carlos I de Borbón
**Logic:** OK - Art. 57.1 CE
**Calidad:** Buena pregunta con cita textual en explicación
**Issues:** legal_reference truncada

#### ID 811 | Tema 4 | Tier: B
**Pregunta:** Según la CE, es competencia del Rey:
**Correcta:** d) Sancionar en 15 días las leyes
**Logic:** OK - Art. 91 CE
**Calidad:** Buena explicación de cada distractor
**Issues:** legal_reference contiene texto explicativo largo

#### ID 1417 | Tema 4 | Tier: S
**Pregunta:** ¿Cuál es la respuesta correcta respecto al orden de sucesión a la Corona?
**Correcta:** c) Primogenitura con preferencia del varón sobre la mujer en el mismo grado
**Logic:** OK - Art. 57.1 CE
**Calidad:** Buena pregunta con distractores plausibles
**Issues:** legal_reference contiene texto explicativo

---

### BATCH 3: Temas 5-6

#### ID 741 | Tema 5 | Tier: A
**Pregunta:** Señale la afirmación incorrecta en relación con las Cortes Generales:
**Correcta:** d) Recursos distribuidos por el Senado (debería ser Cortes Generales)
**Logic:** OK - Art. 158.2 CE
**Calidad:** Buena pregunta, opciones largas y detalladas
**Issues:** legal_reference contiene texto explicativo largo. Typo "en competente" (opción a).

#### ID 765 | Tema 5 | Tier: B (CONTRADICCIÓN con ID 1007)
**Pregunta:** Art. 8 Ley 50/1997, Comisión General. Señale la incorrecta:
**Correcta marcada:** a) "al Ministro de la Presidencia"
**Logic:** DUDOSA - la explicación dice que debería ser "Ministro que determine el Presidente del Gobierno", pero ID 1007 marca la misma afirmación como VERDADERA
**Calidad:** Buena estructura de pregunta
**Issues:** CONTRADICCIÓN con ID 1007. Necesita verificación del texto vigente.

#### ID 770 | Tema 5 | Tier: A
**Pregunta:** Señale la falsa en relación con el Consejo de Estado:
**Correcta:** b) Dictámenes vinculantes (son NO vinculantes)
**Logic:** OK - Art. 2.2 LO 3/1980
**Calidad:** Buena pregunta, inversión sutil del texto legal
**Issues:** legal_reference contiene texto explicativo largo

#### ID 782 | Tema 5 | Tier: A
**Pregunta:** La normativa reguladora del Consejo de Estado dispone que (falsa):
**Correcta:** a) Supremo órgano consultivo de las Cortes Generales (es del Gobierno)
**Logic:** OK - Art. 107 CE
**Calidad:** Buena pregunta
**Issues:** legal_reference contiene texto explicativo. Typo en opción d "Palacio de los Consejo" (debería ser "Consejos")

#### ID 914 | Tema 5 | Tier: A
**Pregunta:** Señale la respuesta falsa:
**Correcta:** b) "máximo de veintiún miembros" (es mínimo)
**Logic:** OK - Art. 78.1 CE
**Calidad:** Enunciado MUY corto (26 chars). Sin contexto.
**Issues:** Enunciado fragmento. legal_reference contiene texto explicativo.

#### ID 211 | Tema 6 | Tier: A
**Pregunta:** ¿Quién propone el candidato a la Presidencia del Gobierno?
**Correcta:** c) El Rey
**Logic:** OK - Art. 99.1 CE
**Calidad:** Enunciado corto (56 chars). Opciones sin id/position (formato legacy).
**Issues:** Enunciado corto, formato legacy

#### ID 1007 | Tema 6 | Tier: B (CONTRADICCIÓN con ID 765)
**Pregunta:** Señale la FALSA sobre la Comisión General según Ley 50/1997:
**Correcta:** d) La Comisión podrá adoptar decisiones por delegación del Gobierno
**Logic:** OK para la respuesta marcada - Art. 8.3
**Calidad:** Buena pregunta
**Issues:** Opción a) dice "Ministro de la Presidencia" y está marcada como VERDADERA, pero ID 765 la marca como FALSA. CONTRADICCIÓN.

#### ID 1016 | Tema 6 | Tier: A
**Pregunta:** Señale la FALSA sobre órganos de colaboración según Ley 50/1997:
**Correcta:** c) Gabinetes incluyen Subsecretarios (no incluyen)
**Logic:** OK - Art. 10.1
**Calidad:** Buena pregunta
**Issues:** Opción d) repite la afirmación disputada "Ministro de la Presidencia" (misma que 765/1007)

#### ID 1024 | Tema 6 | Tier: S
**Pregunta:** El Gabinete de la Presidencia del Gobierno se regulará por:
**Correcta:** a) Real Decreto del Presidente del Gobierno
**Logic:** OK - Art. 10.2 Ley 50/1997
**Calidad:** Limpia, referencia correcta, explicación clara
**Issues:** Ninguno

#### ID 1426 | Tema 6 | Tier: B (posible C)
**Pregunta:** Secretario General del Consejo de Estado se nombra a propuesta de:
**Correcta marcada:** a) El Presidente del Consejo de Estado
**Logic:** DUDOSA - búsqueda web sugiere "a propuesta de la Comisión Permanente aprobada por el Pleno" según Art. 12 LO 3/1980. Necesita verificación.
**Calidad:** Buena estructura
**Issues:** Posible respuesta incorrecta. Requiere verificación con texto vigente.

---

### BATCH 4: Temas 7-8

#### ID 825 | Tema 7 | Tier: B
**Pregunta:** Sala de lo Penal del TS conocerá de... señale la FALSA:
**Correcta:** d) Causas contra miembros de la Familia Real
**Logic:** Ambigua - LO 4/2014 añadió un régimen específico para estos aforados
**Calidad:** Explicación vaga sobre la distinción
**Issues:** La explicación no deja claro por qué d) es falsa. Art. 55 bis LOPJ sí contempla aforamiento de familia real.

#### ID 884 | Tema 7 | Tier: A
**Pregunta:** Tribunales de Instancia, secciones. Señale la FALSA:
**Correcta:** d) Violencia contra la Juventud y la Tercera Edad (no existe)
**Logic:** OK - Lo que existe es Violencia sobre la Mujer
**Calidad:** Buena pregunta, distractor creíble
**Issues:** Menor

#### ID 1150 | Tema 7 | Tier: S
**Pregunta:** Sobre el Tribunal Supremo, señale la FALSA:
**Correcta:** c) Su Presidente lo es también de la Audiencia Nacional (es del CGPJ)
**Logic:** OK - Art. 122.3 CE
**Calidad:** Buena pregunta
**Issues:** legal_reference contiene texto explicativo

#### ID 1371 | Tema 7 | Tier: S
**Pregunta:** Composición del CGPJ, una es incorrecta:
**Correcta:** b) Vocales por periodo de 4 años (es 5)
**Logic:** OK - Art. 122.3 CE
**Calidad:** Buena pregunta de dato numérico
**Issues:** Ninguno

#### ID 1379 | Tema 7 | Tier: C
**Pregunta:** ¿Cuál NO corresponde a Delegados del Gobierno?
**Correcta marcada:** a) Nombrar a los Subdelegados del Gobierno
**Logic:** PROBLEMÁTICA - Art. 69.3 Ley 40/2015 dice que los Subdelegados SÍ son nombrados por el Delegado. La explicación intenta distinguir art. 73 (competencias) vs art. 69.3 (función orgánica) pero es confusa.
**Calidad:** La distinción es demasiado sutil para un examen de auxiliar administrativo
**Issues:** Respuesta confusa, explicación contradictoria

#### ID 930 | Tema 8 | Tier: B
**Pregunta:** Áreas funcionales de las Delegaciones del Gobierno (falsa):
**Correcta:** d) Área de Interior
**Logic:** OK
**Calidad:** Sin legal_reference (null). Explicación genérica sin citar artículo.
**Issues:** Sin referencia legal, explicación débil

#### ID 932 | Tema 8 | Tier: A
**Pregunta:** Gestión de servicios comunes en Delegaciones corresponde a:
**Correcta:** a) La Secretaría General
**Logic:** OK - Art. 76.1 Ley 40/2015
**Calidad:** Buena pregunta
**Issues:** legal_reference contiene texto explicativo. Typo "Secretaria" sin tilde.

#### ID 949 | Tema 8 | Tier: A
**Pregunta:** Sujetos de la acción exterior (falsa):
**Correcta:** d) El Consejo de Estado
**Logic:** OK - Art. 5 Ley 2/2014
**Calidad:** Buena pregunta
**Issues:** legal_reference contiene texto explicativo

#### ID 1266 | Tema 8 | Tier: A
**Pregunta:** Señale qué afirmación es incorrecta (sobre SGT):
**Correcta:** d) El SGT no tiene condición de alto cargo (sí la tiene)
**Logic:** OK - Art. 55.5 Ley 40/2015
**Calidad:** Enunciado genérico "Señale qué afirmación es incorrecta:" sin contexto
**Issues:** Enunciado sin contexto temático, legal_reference largo, typo (espacio extra al final de opción d)

#### ID 1358 | Tema 8 | Tier: S
**Pregunta:** Señale la falsa sobre nombramiento de Subdelegados del Gobierno:
**Correcta:** b) Real Decreto del Consejo de Ministros (es por el Delegado)
**Logic:** OK - Art. 74.1 Ley 40/2015
**Calidad:** Buena pregunta con opciones detalladas
**Issues:** legal_reference contiene texto explicativo

---

### BATCH 5: Temas 9-11

#### ID 224 | Tema 9 → debería ser Tema 3/4 | Tier: C (TEMA INCORRECTO)
**Pregunta:** El TC se compone de:
**Correcta:** 12 miembros nombrados por el Rey
**Logic:** OK - Art. 159.1 CE
**Calidad:** Tema 9 es LPAC, esta pregunta es sobre TC (CE Art. 159)
**Issues:** TEMA INCORRECTO. Formato opciones legacy.

#### ID 226 | Tema 9 → debería ser Tema 3/4 | Tier: C (TEMA INCORRECTO)
**Pregunta:** El TC tiene jurisdicción:
**Correcta:** En todo el territorio español
**Logic:** OK
**Calidad:** Tema incorrecto
**Issues:** TEMA INCORRECTO. Formato opciones legacy.

#### ID 228 | Tema 9 → debería ser Tema 3/4 | Tier: C (TEMA INCORRECTO)
**Pregunta:** Las sentencias del TC:
**Correcta:** Se publican en BOE, cosa juzgada desde día siguiente
**Logic:** OK - Art. 164.1 CE
**Calidad:** Tema incorrecto
**Issues:** TEMA INCORRECTO. Formato opciones legacy.

#### ID 1082 | Tema 9 | Tier: B
**Pregunta:** Comisión consultiva para sedes del sector público (INCORRECTA):
**Correcta:** a) Adscrita al Ministerio de Política Territorial (es Hacienda)
**Logic:** OK
**Calidad:** Pregunta sobre RD 209/2022, muy específica
**Issues:** Sin legal_reference (null). Pregunta sobre RD específico, puede quedar obsoleta.

#### ID 1089 | Tema 9 → debería ser Tema 10 o CE | Tier: B (TEMA INCORRECTO)
**Pregunta:** Recursos de las CCAA según la CE (incorrecta):
**Correcta:** a) Recargos sobre impuestos municipales (son estatales)
**Logic:** OK - Art. 157.1 CE
**Issues:** TEMA INCORRECTO - Art. 157 CE no es LPAC

#### ID 555 | Tema 10 → debería ser Tema 2 o CE | Tier: B (TEMA INCORRECTO)
**Pregunta:** Competencia exclusiva del Estado (falsa):
**Correcta:** c) Montes y aprovechamientos forestales (es competencia CCAA)
**Logic:** OK - Art. 148.1.8ª vs Art. 149
**Issues:** TEMA INCORRECTO - Art. 148-149 CE no es TREBEP

#### ID 1039 | Tema 10 → debería ser Tema 2 o CE | Tier: A (TEMA INCORRECTO)
**Pregunta:** La incorrecta sobre Estatutos de Autonomía:
**Correcta:** d) Referéndum siempre obligatorio (solo vía Art. 151)
**Logic:** OK - Art. 147.3 CE
**Issues:** TEMA INCORRECTO. Buena pregunta.

#### ID 1056 | Tema 10 → debería ser Tema 11 (LBRL) | Tier: B (TEMA INCORRECTO)
**Pregunta:** Cómo se crea un Área Metropolitana:
**Correcta:** d) Por Ley de la Comunidad Autónoma
**Logic:** OK - Art. 43 LBRL
**Issues:** TEMA INCORRECTO - LBRL no es TREBEP

#### ID 1057 | Tema 10 → debería ser Tema 11 (LBRL) | Tier: A (TEMA INCORRECTO)
**Pregunta:** ¿Cuál no es una entidad local?
**Correcta:** b) Consorcios
**Logic:** OK - Art. 3 LBRL
**Issues:** TEMA INCORRECTO

#### ID 1066 | Tema 10 → debería ser Tema 11 (LBRL) | Tier: A
**Pregunta:** Municipios de gran población, señale la falsa:
**Correcta:** c) Miembros de la JGL son órganos directivos (son superiores)
**Logic:** OK - Art. 130.1 LBRL
**Issues:** TEMA INCORRECTO

#### ID 579 | Tema 11 | Tier: B (LBRL, no LRJSP)
**Pregunta:** Competencias del Alcalde (falsa):
**Correcta:** d) Aprobación del Reglamento Orgánico (es del Pleno)
**Logic:** OK - Art. 22.2.d LBRL
**Issues:** Tema 11 es LRJSP pero pregunta es sobre LBRL (Art. 22)

#### ID 588 | Tema 11 | Tier: B (LBRL, no LRJSP)
**Pregunta:** Órganos necesarios en todos los ayuntamientos:
**Correcta:** c) Alcalde, tenientes de alcalde y Pleno
**Logic:** OK - Art. 20.1 LBRL
**Issues:** Tema 11 es LRJSP pero pregunta es sobre LBRL. legal_reference largo.

#### ID 591 | Tema 11 | Tier: B (LBRL, no LRJSP)
**Pregunta:** Son Entidades Locales Territoriales:
**Correcta:** b) Municipio, provincia e islas
**Logic:** OK - Art. 3.1 LBRL
**Issues:** Tema 11 es LRJSP pero pregunta es LBRL. legal_reference largo.

#### ID 1175 | Tema 11 | Tier: A (LBRL, no LRJSP)
**Pregunta:** En relación al municipio, la LBRL establece (falsa):
**Correcta:** c) Fusión entre municipios de distintas provincias (debe ser misma)
**Logic:** OK - Art. 13.4 LBRL
**Issues:** Tema 11 es LRJSP pero pregunta es LBRL

#### ID 1182 | Tema 11 | Tier: A (LBRL, no LRJSP)
**Pregunta:** Existen en todos los ayuntamientos (falsa):
**Correcta:** b) Comisión Especial de Sugerencias y Reclamaciones (solo gran población)
**Logic:** OK - Art. 132 LBRL
**Issues:** Tema 11 es LRJSP pero pregunta es LBRL

---

## Patrones Sistémicos

### 1. `legal_reference` sucia (~30%)
IDs afectados: 741, 765, 770, 782, 914, 1132, 664, 789, 790, 804, 811, 1417, 932, 949, 1266, 1358, 588, 591, 1175, 1182

**Patrón:** El campo contiene la explicación completa en vez de una cita limpia:
```
❌ "artículo 158.2 de la Constitución Española, los recursos del Fondo de Compensación serán distribuidos por las Cortes Generales..."
✅ "Art. 158.2 CE"
```

### 2. Enunciados cortos sin contexto (~25%)
IDs afectados: 211, 284, 286, 914, 1266
**Patrón:** Enunciados de <80 chars que no se entienden sin las opciones

### 3. Temas mal asignados (~27% del piloto, 15/55)
IDs afectados: 224, 226, 228, 1089, 555, 1039, 1056, 1057, 1066, 579, 588, 591, 1175, 1182, (posiblemente 1082)

### 4. Formato de opciones inconsistente (~10%)
IDs afectados: 193, 199, 211, 224, 226, 228
**Patrón:** Formato `{text, is_correct}` sin `id` ni `position` (legacy)

### 5. Typos menores
- ID 741: "en competente" → "es competente"
- ID 782: "Palacio de los Consejo" → "Palacio de los Consejos"
- ID 932: "Secretaria" → "Secretaría"
- ID 1266: Espacio extra al final de opción d

---

## Próximos Pasos

1. **Inmediato:** Corregir los 6 issues críticos (Tier C)
2. **Agente 1 (automático):** Limpiar legal_reference + expandir abreviaturas + enriquecer enunciados en las ~1,368 preguntas
3. **Agente 3:** Verificar asignación de temas en TODAS las preguntas (no solo el piloto)
4. **Agente 2:** Verificar lógica de preguntas con reformulaciones y preguntas negativas
5. **Escalar:** 150 preguntas → 500 → todas

---

*Generado: 2026-02-08*
