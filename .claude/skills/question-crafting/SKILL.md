---
name: question-crafting
description: Standards and verified examples for creating high-quality oposiciones questions. Use when generating new questions or reformulating existing ones.
---

# Question Crafting — Estándares de Calidad

Cómo crear preguntas de calidad tipo Tier S para OpositaSmart. Basado en feedback de opositores reales que verificaron las preguntas contra el BOE.

## Los 5 principios de una pregunta bien hecha

### 0. Preferir enunciado directo sobre narrativa artificial

**Regla (feedback real usuarios):** si puedes empezar la pregunta con "Según el artículo X de [ley]..." directo y funciona, hazlo. Los "escenarios narrativos" tipo "Un opositor estudia X y se pregunta Y..." suelen sentirse forzados cuando no aportan valor real.

**Cuándo SÍ usar narrativa:**
- Cuando el escenario añade un **dato concreto** que la pregunta necesita (ej: "Un municipio tiene 18.000 habitantes. ¿Qué servicios obligatorios debe prestar?")
- Cuando hay **dos supuestos de hecho distintos** que el opositor debe comparar (ej: "Un RD crea una Dirección General permitiendo titular no-funcionario y otro RD pretende hacer lo mismo con una Subsecretaría...")

**Cuándo NO usar narrativa:**
- Preguntas sobre definiciones, plazos, competencias, composición de órganos
- Cuando el "escenario" solo es decoración ("Un opositor estudia la composición del CGPJ...")
- Cuando la pregunta funciona mejor sin la narrativa

**Ejemplos:**

❌ Forzado:
> "Un opositor estudia la estructura de la AGE. Según el Art. 55.3 LRJSP, ¿cuál es órgano superior?"

✅ Directo:
> "Según el Art. 55.3 de la Ley 40/2015, ¿cuál de los siguientes es órgano SUPERIOR (no directivo)?"

❌ Forzado:
> "Un opositor estudia los efectos de la impugnación. Según el Art. 161.2 CE..."

✅ Directo:
> "Según el artículo 161.2 de la Constitución Española, cuando el Gobierno impugna..."

### 1. Contextualización narrativa (no preguntas secas)

❌ **Mal:**
> "¿Cuántos vocales tiene el CGPJ?"

✅ **Bien:**
> "Un opositor estudia la composición del CGPJ. ¿Cuál de los siguientes datos que ha anotado es INCORRECTO?"

❌ **Mal:**
> "¿Qué servicios son obligatorios en municipios?"

✅ **Bien:**
> "Un municipio tiene 18.000 habitantes. Según el artículo 26 de la LBRL, ¿cuál de los siguientes servicios NO tiene obligación de prestar?"

**Por qué funciona:** Las preguntas con escenario obligan al opositor a aplicar el conocimiento, no solo recordarlo. Además hacen la pregunta más memorable.

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

```
[ ] ¿Tiene escenario narrativo o cita explícita del artículo?
[ ] ¿Los 4 distractores son plausibles (no obviamente falsos)?
[ ] ¿La explicación incluye cita literal del BOE con comillas?
[ ] ¿La explicación dice por qué las incorrectas están mal?
[ ] ¿El artículo citado existe realmente? (fetch del BOE)
[ ] ¿La respuesta correcta aparece LITERALMENTE en el texto legal?
[ ] Si es "señale la incorrecta", ¿la marcada es realmente la incorrecta?
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

### Archivos locales disponibles

Carpeta: `c:\Users\alber\OpositaSmart\.claude\questions\Temario\leyes\`

| Archivo | Ley | Artículos |
|---|---|---|
| `CE_Constitucion_Espanola.md` | Constitución Española 1978 | Arts. 1-169 completos |
| `LRJSP_Ley_40_2015.md` | Ley 40/2015 LRJSP | Arts. 1-158 completos (consolidado BOE 02/08/2024) |

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

### 2. Terminología doctrinal no presente en el BOE

**Patrón:** El enunciado usa una expresión ("órgano colegiado", "ejecutividad mediata", etc.) que no aparece en el artículo citado. Fuerza una interpretación doctrinal.

**Ejemplo real (ID 289):** "¿cuál es el órgano colegiado encargado...?" — el Art. 140 CE no dice "órgano colegiado", dice "gobierno y administración... corresponde a sus Ayuntamientos".

**Regla:** Usa la terminología literal del BOE. Si el artículo dice "corresponde a X", la pregunta debe ser "¿a quién corresponde X?", no "¿qué órgano es X?".

### 3. Distractor que parece errata (typo-looking)

**Patrón:** El distractor cambia una letra o palabra del artículo real (ej: "competente" vs "incompetente"). Aunque sea intencional como trampa, crea ambigüedad: ¿es trampa o typo del creador?

**Ejemplo real (ID 307):** Distractor "órgano manifiestamente competente" vs Art. 47.1.b que dice "manifiestamente INcompetente". El opositor duda si es trampa o error.

**Regla:** Si quieres trampa por una palabra, usa confusión entre conceptos distintos (nulidad vs anulabilidad, Pleno vs Permanente), no cambios de letras que parezcan erratas.

### 4. Explicaciones telegráficas (<80 chars)

**Patrón:** Explicación de una sola línea sin cita del BOE ni justificación de los distractores.

**Ejemplos reales:** ID 311 ("Preferencia electrónica no implica siempre exclusividad."), ID 314 ("No hay arresto como medio de ejecución forzosa."), ID 315 ("El silencio no elimina el deber de resolver.").

**Regla:** Mínimo 150 chars. Debe incluir: (1) cita literal del BOE entre «...», (2) por qué los distractores son incorrectos.

### 5. Frases meta en el enunciado

**Patrón:** El enunciado hace referencia al propio examen o al opositor.

**Ejemplo real (ID 317):** "...señale el medio correcto de acreditación **que suele plantear el examen**".

**Regla:** Enunciado neutro sobre el contenido. Nunca meta-referencias ("que suele caer", "que más confunde", "fácil de recordar").

### 6. Paréntesis explicativos en opciones

**Patrón:** Una opción incluye entre paréntesis el dato que verificaría la respuesta.

**Ejemplo real (ID 139, 1061):** "El Título I (Arts. 10-55, 46 artículos)" — el opositor no necesita saber nada, solo contar.

**Regla:** Los paréntesis explicativos van en la explicación. Las opciones son limpias.

### 7. Plazos atribuidos a la CE que están en leyes de desarrollo

**Patrón:** El enunciado atribuye un plazo concreto a la Constitución, pero el plazo realmente está en una LO o ley ordinaria de desarrollo. La CE solo remite a "ley orgánica".

**Ejemplo real (ID 560):** "En el procedimiento del Art. 151 CE, ¿en qué plazo debe convocarse el referéndum?" — respuesta: 2 meses. Pero ese plazo está en la LO 2/1980, no en la CE. El Art. 151.1 CE solo dice "en los términos que establezca una ley orgánica".

**Regla:** Si el plazo o requisito concreto está en la ley de desarrollo, el enunciado debe mencionarlo ("según su ley orgánica de desarrollo") y el `legal_reference` debe apuntar a la ley de desarrollo, no a la CE.

**Vigilar especialmente:** plazos autonómicos (LO 2/1980), electorales (LOREG), procedimentales (LPAC, LRJSP), presupuestarios (LGP).

### 7bis. Artículo correcto, apartado equivocado (WRONG_ARTICLE_SUBSECTION)

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

### 9. Desfase por jurisprudencia del TC (OUTDATED_BY_CONSTITUTIONAL_COURT_RULING)

**Patrón:** La explicación cita un requisito del texto literal del BOE que ha sido declarado inconstitucional o modificado por jurisprudencia del TC, aunque el BOE no haya actualizado el texto publicado. Es distinto de `ANSWER_NOT_IN_BOE` porque el texto SÍ aparece en el BOE literal, pero ya no es derecho vigente.

**Ejemplo real (ID 590):** La explicación afirma que el Concejo Abierto (Art. 29.1 LRBRL) aplica a municipios con menos de 100 habitantes que tradicionalmente tuvieran ese régimen. La **STC 103/2013** declaró inconstitucional ese umbral de 100 habitantes, pero el texto del BOE no se actualizó.

**Regla:** Al citar preceptos de LRBRL, LRSAL y leyes orgánicas con jurisprudencia abundante, verificar si el artículo ha sido afectado por alguna STC. Si hay afectación, la explicación debe mencionarlo: "Nota: el requisito de X fue declarado inconstitucional por la STC Y/Z."

**Preceptos conocidos con jurisprudencia relevante:**
- Art. 29.1 LRBRL (umbral Concejo Abierto) — STC 103/2013
- Art. 57 bis LRBRL (creación entes instrumentales) — STC 41/2016
- Varios preceptos de LRSAL (Ley 27/2013) afectados por STC 41/2016

### 8. Tricotomías y clasificaciones doctrinales sin anclaje BOE

**Patrón:** La pregunta se basa en una clasificación académica de manual ("los X elementos constitutivos de Y", "las N notas características de Z") que no aparece literalmente en ningún artículo del BOE.

**Ejemplo real (ID 580):** "El municipio se compone de **tres elementos constitutivos**. Señale cuál NO es uno..." — esta tricotomía (territorio/población/organización) es doctrinal. El Art. 11 LRBRL menciona estos elementos pero no usa la expresión "tres elementos constitutivos".

**Regla:** Si usas una clasificación doctrinal, verifica que aparece LITERALMENTE en algún artículo. Si no, reformula la pregunta para referirse al contenido del artículo sin invocar la tricotomía:

- ❌ "Los tres elementos constitutivos del municipio son..."
- ✅ "Según el Art. 11 LRBRL, ¿cuál de los siguientes NO es un elemento del municipio?"

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
