# Workflow de Verificación contra BOE-435

> Verificación sistemática de las 1,365 preguntas activas contra el texto legal oficial del BOE-435.

---

## Fuente de Verdad

**Documento:** `BOE-435_Normativa_para_ingreso_en_el_Cuerpo_General_Auxiliar_de_la_Administracion_del_Estado.docx`
**Ubicación:** `.claude/questions/Temario/`
**Resolución:** 18 de diciembre de 2025
**Contenido:** Texto íntegro de todas las leyes del temario oficial (CE, LOTC, LOPJ, Ley 50/1997, Ley 40/2015, Ley 39/2015, TREBEP, LOPDGDD, etc.)

**Regla fundamental:** NO buscar en internet. Toda verificación se hace contra el texto del BOE-435.

---

## Problema PRIORITARIO: Alineación de Temas

El temario oficial (BOE-435) tiene **16 temas**, pero la BD actual usa **11 temas** (mapeo antiguo de otra convocatoria). Alinear con el temario oficial es **la primera prioridad** antes de verificar contenido.

### Mapeo Temas Antiguos (BD) → Temas Oficiales (BOE-435)

| BD actual | Contenido estimado | → Tema(s) Oficial(es) |
|-----------|-------------------|----------------------|
| 1 (257 q) | CE Título Preliminar, Arts 1-9 | → **1** (CE general, principios, derechos, garantías) |
| 2 (98 q) | CE Título I, Derechos fundamentales | → **1** (se fusiona con viejo T1) |
| 3 (234 q) | CE Corona + Cortes Generales | → **2** (Corona, TC, reforma) + **3** (Cortes, Defensor Pueblo) |
| 4 (23 q) | CE Gobierno + Poder Judicial + TC | → **2** (TC) + **4** (Poder Judicial) + **5** (Gobierno) |
| 5 (146 q) | Ley 40/2015 + Ley 50/1997 (organización) | → **5** (Gobierno) + **8** (AGE) |
| 6 (44 q) | Ley 50/1997 + Arts 97-107 CE | → **5** (Gobierno) |
| 7 (190 q) | Ley 40/2015 LRJSP (régimen jurídico) | → **8** (AGE) o **11** (LRJSP+LPAC) |
| 8 (142 q) | Ley 40/2015 (órganos colegiados) | → **8** (AGE) o **11** (LRJSP) |
| 9 (5 q) | LPAC (solo 5 preguntas) | → **11** (LPAC + procedimiento) |
| 10 (75 q) | TREBEP/EBEP | → **13** (personal) + **14** (derechos/deberes) |
| 11 (151 q) | Ley 40/2015 (sector público institucional) | → **8** o **11** |

### Temas Oficiales SIN cobertura (0 preguntas)

| Tema Oficial | Contenido | Acción necesaria |
|-------------|-----------|-----------------|
| **6** | Gobierno Abierto, Agenda 2030, ODS | CREAR preguntas nuevas |
| **7** | Ley 19/2013 Transparencia | CREAR preguntas nuevas |
| **9** | Organización territorial, CCAA, Administración local | Algunas pueden venir de reasignación + CREAR |
| **10** | Unión Europea (instituciones) | CREAR preguntas nuevas |
| **12** | Protección de datos (LOPDGDD) | CREAR preguntas nuevas |
| **15** | Presupuestos del Estado | CREAR preguntas nuevas |
| **16** | Igualdad, violencia género, LGTBI, discapacidad | CREAR preguntas nuevas |

### Proceso de reasignación

La reasignación NO se hace por número de tema antiguo sino por `legal_reference`:

```
Para cada pregunta:
1. Leer legal_reference (ej: "Art. 56.1 CE")
2. Determinar la ley y sección:
   - CE Arts 1-9 (Título Preliminar) → Tema 1
   - CE Arts 10-55 (Título I, derechos) → Tema 1
   - CE Arts 56-65 (Título II, Corona) → Tema 2
   - CE Arts 159-165 (Título IX, TC) → Tema 2
   - CE Arts 166-169 (Título X, Reforma) → Tema 2
   - CE Arts 66-96 (Título III, Cortes) → Tema 3
   - CE Arts 117-127 (Título VI, Poder Judicial) → Tema 4
   - LOPJ → Tema 4
   - CE Arts 97-107 (Título IV, Gobierno) → Tema 5
   - Ley 50/1997 (Gobierno) → Tema 5
   - Ley 19/2013 (Transparencia) → Tema 7
   - Ley 40/2015 (AGE, órganos) → Tema 8
   - CE Arts 137-158 (Título VIII, territorial) → Tema 9
   - LBRL → Tema 9
   - Tratados UE → Tema 10
   - Ley 39/2015 (LPAC) → Tema 11
   - Ley 40/2015 (régimen jurídico, procedimiento) → Tema 11
   - LOPDGDD / RGPD → Tema 12
   - TREBEP (concepto, clases, selección) → Tema 13
   - TREBEP (derechos, deberes, carrera, retribuciones) → Tema 14
   - Ley 47/2003 (Presupuestos) → Tema 15
   - Leyes igualdad, género, LGTBI, discapacidad → Tema 16
3. Si tema actual ≠ tema correcto → UPDATE en BD
```

Este mapeo se aplica como **Paso 0 de la Fase 1** (antes de verificar contenido).

---

## Fase 0: Extracción de Textos de Referencia

### Objetivo
Extraer el texto legal completo de cada ley contenida en BOE-435 y guardarlo como archivos `.md` indexados por artículo. Estos archivos son la referencia que usan los agentes verificadores.

### Estructura de archivos de referencia

```
.claude/questions/Temario/leyes/
├── CE_titulo_preliminar.md       # Arts. 1-9
├── CE_titulo_I_cap1.md           # Arts. 10-14 (derechos generales)
├── CE_titulo_I_cap2_sec1.md      # Arts. 15-29 (derechos fundamentales)
├── CE_titulo_I_cap2_sec2.md      # Arts. 30-38 (derechos y deberes ciudadanos)
├── CE_titulo_I_cap3.md           # Arts. 39-52 (principios rectores)
├── CE_titulo_I_cap4.md           # Arts. 53-54 (garantías)
├── CE_titulo_II.md               # Arts. 56-65 (Corona)
├── CE_titulo_III.md              # Arts. 66-96 (Cortes Generales)
├── CE_titulo_IV.md               # Arts. 97-107 (Gobierno)
├── CE_titulo_V.md                # Arts. 108-116 (relaciones Gobierno-Cortes)
├── CE_titulo_VI.md               # Arts. 117-127 (Poder Judicial)
├── CE_titulo_VIII.md             # Arts. 137-158 (Organización territorial)
├── CE_titulo_IX.md               # Arts. 159-165 (Tribunal Constitucional)
├── CE_titulo_X.md                # Arts. 166-169 (Reforma constitucional)
├── LOTC.md                       # Ley Orgánica del Tribunal Constitucional
├── LOPJ.md                       # Ley Orgánica del Poder Judicial
├── Ley_50_1997_Gobierno.md       # Ley del Gobierno
├── Ley_40_2015_LRJSP.md          # Ley de Régimen Jurídico del Sector Público
├── Ley_39_2015_LPAC.md           # Ley del Procedimiento Administrativo Común
├── Ley_19_2013_Transparencia.md  # Ley de Transparencia
├── TREBEP.md                     # Estatuto Básico del Empleado Público
├── LOPDGDD.md                    # Protección de datos
├── Ley_47_2003_LGP.md            # Ley General Presupuestaria
└── Otras_leyes.md                # Ley Igualdad, Violencia género, LGTBI, etc.
```

### Proceso de extracción

```python
# Pseudocódigo — se ejecuta una vez con un agente Bash
1. Abrir BOE-435.docx con zipfile
2. Leer document.xml por chunks (1-2 MB)
3. Extraer texto de tags <w:t>
4. Buscar delimitadores de ley (§ sections, "CONSTITUCIÓN ESPAÑOLA", etc.)
5. Para cada ley/sección:
   a. Identificar artículos con regex: r'Art[íi]culo\s+(\d+)'
   b. Extraer texto completo de cada artículo
   c. Guardar en el archivo .md correspondiente
6. Formato de cada archivo .md:
```

### Formato de archivo de referencia

```markdown
# Constitución Española — Título Preliminar

## Artículo 1
1. España se constituye en un Estado social y democrático de Derecho, que propugna
   como valores superiores de su ordenamiento jurídico la libertad, la justicia,
   la igualdad y el pluralismo político.
2. La soberanía nacional reside en el pueblo español, del que emanan los poderes
   del Estado.
3. La forma política del Estado español es la Monarquía parlamentaria.

## Artículo 2
La Constitución se fundamenta en la indisoluble unidad de la Nación española,
patria común e indivisible de todos los españoles, y reconoce y garantiza el
derecho a la autonomía de las nacionalidades y regiones que la integran y la
solidaridad entre todas ellas.

[...]
```

### Ejecución

- **Modelo:** Haiku (solo es extracción de texto, tarea mecánica)
- **Tiempo estimado:** 30-60 min para todo el BOE-435
- **Output:** ~20 archivos .md con todos los artículos indexados
- **Verificación:** Contar artículos extraídos vs artículos esperados por ley

---

## Fase 1: Verificación por Pregunta

### Agente Verificador BOE (Sonnet)

Para cada pregunta activa, el agente ejecuta estos 5 pasos:

#### Paso 1: Localizar el texto legal de referencia

```
Input:  question.legal_reference (ej: "Art. 56.1 CE")
Output: Texto exacto del artículo desde el archivo de referencia

1. Parsear legal_reference → ley + artículo + apartado
2. Abrir el archivo .md correspondiente
3. Buscar el artículo exacto
4. Si no se encuentra → FLAG: "legal_reference no encontrada en BOE-435"
```

#### Paso 2: Verificar la respuesta correcta

```
Input:  Texto del artículo + opción marcada como correcta
Output: VERIFIED | ERROR | AMBIGUOUS

1. Comparar la opción correcta con el texto literal del artículo
2. ¿La opción correcta refleja fielmente lo que dice el artículo?
   - SÍ exacto o paráfrasis fiel → VERIFIED
   - NO, contradice el texto → ERROR (con cita del texto real)
   - Parcialmente correcto / interpretable → AMBIGUOUS (con explicación)
```

#### Paso 3: Verificar los distractores

```
Input:  Texto del artículo + opciones incorrectas
Output: OK | DOUBLE_CORRECT | AMBIGUOUS_DISTRACTOR

1. Para cada distractor:
   a. ¿Es definitivamente INCORRECTO según el texto legal?
   b. ¿Podría interpretarse como correcto en algún contexto?
   c. ¿Confunde con otro artículo de la misma ley?
2. Si un distractor es correcto → DOUBLE_CORRECT (con cita)
3. Si es ambiguo → AMBIGUOUS_DISTRACTOR (con explicación)
```

#### Paso 4: Verificar coherencia de la reformulación

```
Input:  question_text + original_text (si existe)
Output: COHERENT | DRIFT | TOPIC_CHANGE

Solo aplica a preguntas con origin = 'reformulated':
1. ¿El enunciado reformulado pregunta sobre el MISMO concepto legal que el original?
2. ¿Las opciones siguen correspondiendo al artículo citado?
3. ¿La explicación es coherente con el enunciado y las opciones?
   - TODO coherente → COHERENT
   - Enunciado cambiado pero opciones no actualizadas → DRIFT
   - Enunciado habla de un artículo, explicación de otro → TOPIC_CHANGE
```

#### Paso 5: Generar explicación enriquecida

```
Input:  Texto del artículo + pregunta completa + resultado de verificación
Output: Explicación con cita textual del BOE

Formato de la explicación enriquecida:

"[Respuesta] La opción [X] es correcta. El artículo [N] de [Ley] establece
textualmente: «[CITA EXACTA DEL BOE-435]». [Por qué las incorrectas son
incorrectas]. [Referencia: Art. X.Y Ley Z]"

Reglas:
- La cita entre «» DEBE ser textual del archivo de referencia
- Máximo 2 frases del artículo citadas (las más relevantes)
- Explicar por qué al menos 2 distractores son incorrectos
- Si hay un error frecuente de opositores, mencionarlo
- Longitud: 150-400 caracteres
```

### Campos a actualizar en la BD

Para cada pregunta verificada:

| Campo | Valor | Cuándo |
|-------|-------|--------|
| `explanation` | Explicación enriquecida con cita BOE | Siempre (sobrescribe la existente) |
| `legal_reference` | Cita limpia: "Art. X.Y Ley" | Si estaba sucia o vacía |
| `needs_refresh` | `true` | Si se detectó ERROR o DOUBLE_CORRECT |
| `refresh_reason` | Descripción del problema | Si needs_refresh = true |
| `review_comment` | Resultado de la verificación + cita BOE | Siempre |
| `validation_status` | `'human_pending'` | Si se detectó error |

### Formato de `review_comment` (para ReviewerPanel)

```
[VERIFIED] ✓ Respuesta correcta verificada contra Art. 56.1 CE.
Texto BOE: «El Rey es el Jefe del Estado, símbolo de su unidad y permanencia»

[ERROR] ✗ La opción correcta contradice el Art. 28.1 CE.
Texto BOE: «Todos tienen derecho a sindicarse libremente»
La pregunta dice que Art. 28 se reforma por Art. 167, pero Art. 28 está en
Sección 1ª (Arts 15-29), protegida por Art. 168 (procedimiento agravado).

[AMBIGUOUS] ⚠ Dos opciones podrían ser correctas.
Opción A cita Art. 8.1 Ley 50/1997 (versión original).
Opción C cita Art. 8.1 Ley 50/1997 (versión reformada).
Texto BOE actual: «[cita]»
```

---

## Fase 2: Cazador de Discrepancias (post-verificación)

Después de verificar todas las preguntas individualmente, ejecutar una pasada global:

### 2.1 Contradicciones inter-preguntas

```sql
-- Agrupar preguntas por artículo legal
SELECT legal_reference, array_agg(id) as question_ids, COUNT(*) as total
FROM questions
WHERE is_active = true AND legal_reference IS NOT NULL
GROUP BY legal_reference
HAVING COUNT(*) > 1
ORDER BY total DESC;
```

Para cada grupo con >1 pregunta sobre el mismo artículo:
- ¿Las respuestas son mutuamente consistentes?
- ¿Alguna pregunta dice X es verdad y otra dice X es falso?

### 2.2 Verificación post-reasignación de temas

```
Después de la reasignación del Paso 1.2, verificar:
1. ¿Todas las preguntas tienen tema asignado entre 1-16?
2. ¿La legal_reference de cada pregunta corresponde al tema asignado?
3. Si queda alguna pregunta sin legal_reference → asignar tema por contenido
   del enunciado (buscar leyes mencionadas en question_text)
4. FLAG: UNRESOLVED si no se puede determinar el tema correcto
```

### 2.3 Duplicados

```
Para cada par de preguntas del mismo artículo:
1. Calcular similitud de texto (Jaccard sobre tokens)
2. Si similitud > 0.8 → FLAG: DUPLICATE
3. Si similitud > 0.6 → FLAG: NEAR_DUPLICATE
```

---

## Fase 3: Ejecución

### Paso 1: Alineación de temas (PRIMERO)

```
1.1 EXTRAER texto legal (Fase 0)
    └─ Ejecutar una vez → archivos .md de referencia

1.2 REASIGNAR temas de las 1,365 preguntas existentes
    a. Consultar todas las preguntas con su legal_reference
    b. Para cada una, determinar tema correcto según mapeo ley → tema oficial
    c. UPDATE masivo en BD (con backup previo)
    d. Verificar distribución resultante:
       SELECT tema, COUNT(*) FROM questions WHERE is_active = true GROUP BY tema ORDER BY tema;
    e. Identificar temas con 0 o pocas preguntas → cola de creación

1.3 ACTUALIZAR la app
    a. Cambiar selector de temas de 1-11 → 1-16
    b. Actualizar títulos de temas en la UI con los nombres oficiales de temario.json
    c. Actualizar ReviewerPanel para filtrar por 1-16
```

### Paso 2: Verificación de contenido

```
2.1 Para cada tema oficial (1-16), en orden de más a menos preguntas:
    a. Cargar preguntas del tema desde Supabase
    b. Cargar archivos .md de las leyes relevantes para ese tema
    c. Ejecutar Verificador BOE sobre cada pregunta (Fase 1)
    d. Actualizar explanation + review_comment en BD
    e. Marcar preguntas con errores: needs_refresh = true
    f. Verificar progreso con query:
       SELECT COUNT(*) FROM questions WHERE tema = X AND review_comment LIKE '[VERIFIED]%';

2.2 Ejecutar Cazador de Discrepancias sobre todo el banco (Fase 2)
    └─ Contradicciones, duplicados
```

### Paso 3: Creación de preguntas para temas vacíos

```
3.1 Para cada tema con <20 preguntas:
    a. Identificar artículos/secciones de ley que debe cubrir el tema
    b. Ejecutar pipeline de creación (ver QUALITY_STANDARDS.md → Pipeline de Creación)
    c. Objetivo mínimo: 30-50 preguntas por tema
    d. Verificar con Verificador BOE antes de publicar

3.2 Temas a crear (estimación de preguntas necesarias):
    - Tema 6 (Gobierno Abierto): ~40 preguntas
    - Tema 7 (Transparencia): ~40 preguntas
    - Tema 9 (Territorial + CCAA): ~50 preguntas (algunas vendrán de reasignación)
    - Tema 10 (UE): ~40 preguntas
    - Tema 12 (Protección datos): ~40 preguntas
    - Tema 15 (Presupuestos): ~30 preguntas
    - Tema 16 (Igualdad): ~40 preguntas
    Total estimado: ~280 preguntas nuevas
```

### Paso 4: Revisión humana

```
4.1 Revisión en ReviewerPanel
    └─ Filtrar por needs_refresh = true (errores de verificación)
    └─ Filtrar por validation_status = 'ai_created_pending' (preguntas nuevas)
    └─ Ver review_comment con cita BOE
    └─ Aprobar / rechazar / editar

4.2 Criterio de completitud:
    └─ Cada tema tiene ≥30 preguntas con validation_status = 'human_approved'
    └─ 0 preguntas con needs_refresh = true sin resolver
```

### Configuración de agentes

| Paso | Agente | Modelo | Batch size | Concurrencia |
|------|--------|--------|------------|--------------|
| 1.1 | Extractor de texto | Haiku | N/A | 1 |
| 1.2 | Reasignador de temas | Sonnet | Todas | 1 |
| 2.1 | Verificador BOE | Sonnet | 25-30 preguntas | 3-4 paralelos |
| 2.2 | Cazador de Discrepancias | Sonnet | Todo el banco | 1 |
| 3.1 | Creador de preguntas | Sonnet | 10-15 por artículo | 1 por tema |
| 3.1b | Verificador BOE (nuevas) | Sonnet | Todo el batch nuevo | 1 |

### Monitoreo de progreso

```sql
-- Estado de verificación por tema
SELECT tema,
  COUNT(*) as total,
  COUNT(CASE WHEN review_comment LIKE '[VERIFIED]%' THEN 1 END) as verified,
  COUNT(CASE WHEN review_comment LIKE '[ERROR]%' THEN 1 END) as errors,
  COUNT(CASE WHEN review_comment LIKE '[AMBIGUOUS]%' THEN 1 END) as ambiguous,
  COUNT(CASE WHEN needs_refresh THEN 1 END) as pending_review
FROM questions
WHERE is_active = true
GROUP BY tema
ORDER BY tema;
```

---

## Requisitos para ReviewerPanel

### Visualización de la verificación BOE

El ReviewerPanel debe mostrar para cada pregunta:

1. **Estado de verificación** (badge):
   - `[VERIFIED]` → verde "Verificada BOE"
   - `[ERROR]` → rojo "Error detectado"
   - `[AMBIGUOUS]` → amarillo "Requiere revisión"
   - Sin verificar → gris "Pendiente"

2. **Cita textual del BOE** (nuevo bloque):
   ```
   ┌─────────────────────────────────────────┐
   │ 📖 Texto BOE-435                        │
   │                                          │
   │ Art. 56.1 CE:                            │
   │ «El Rey es el Jefe del Estado, símbolo   │
   │ de su unidad y permanencia, arbitra y    │
   │ modera el funcionamiento regular de las  │
   │ instituciones [...]»                      │
   │                                          │
   │ Fuente: BOE-435, §2 Constitución        │
   └─────────────────────────────────────────┘
   ```

3. **Resultado de verificación** (expandible):
   - Qué se verificó
   - Si la respuesta correcta coincide con el BOE
   - Qué distractores se analizaron
   - Si hay coherencia con la reformulación

4. **Botón de aprobar** (FUNCIONAL):
   - "Aprobar verificación" → `validation_status = 'human_approved'`, `needs_refresh = false`
   - "Rechazar / editar" → abre editor de la pregunta
   - "Marcar para revisión" → `needs_refresh = true` con razón

### Filtros necesarios

- Por estado de verificación: Verificada / Error / Ambigua / Pendiente
- Por tema (1-16, con títulos oficiales de temario.json)
- Por origen: imported / reformulated / ai_created
- Por estado de aprobación: human_pending / human_approved / auto_validated

---

## Resultados Esperados

### Reasignación de temas

| Métrica | Estimación |
|---------|-----------|
| Preguntas reasignadas de tema | ~30-50% (400-680) |
| Temas oficiales con preguntas existentes post-reasignación | 9-12 de 16 |
| Temas que requieren creación desde cero | 5-7 |
| Preguntas nuevas a crear | ~280 |

### Verificación de contenido

| Métrica | Estimación |
|---------|-----------|
| Preguntas verificadas sin errores | ~75-80% (1,020-1,090) |
| Errores de respuesta correcta | ~3-5% (40-70) |
| Distractores ambiguos | ~5-8% (70-110) |
| Drift en reformulación | ~5-8% (70-110) |
| Contradicciones inter-preguntas | ~1-2% (15-25 pares) |
| Duplicados | ~2-3% (25-40 pares) |

### Objetivo final

| Tema | Título oficial | Mín. preguntas | Estado actual |
|------|---------------|----------------|---------------|
| 1 | CE: principios, derechos, garantías | 80 | ~355 (T1+T2 fusionados) |
| 2 | TC, reforma CE, Corona | 50 | ~120 (parte de T3+T4) |
| 3 | Cortes Generales, Defensor del Pueblo | 50 | ~120 (parte de T3) |
| 4 | Poder Judicial, CGPJ, TS | 40 | ~15 (parte de T4) |
| 5 | Gobierno, Presidente, Consejo Ministros | 50 | ~190 (T5+T6) |
| 6 | Gobierno Abierto, Agenda 2030 | 30 | **0 → CREAR** |
| 7 | Transparencia (Ley 19/2013) | 30 | **0 → CREAR** |
| 8 | AGE: órganos centrales y territoriales | 60 | ~200 (parte de T7+T8+T11) |
| 9 | CCAA, Administración local | 40 | ~10 (por reasignar) |
| 10 | Unión Europea | 30 | **0 → CREAR** |
| 11 | LPAC + LRJSP, procedimiento, recursos | 60 | ~180 (parte de T7+T8+T9+T11) |
| 12 | Protección de datos (LOPDGDD) | 30 | **0 → CREAR** |
| 13 | Personal funcionario (concepto, selección) | 40 | ~40 (parte de T10) |
| 14 | Derechos y deberes funcionarios | 40 | ~35 (parte de T10) |
| 15 | Presupuestos del Estado | 30 | **0 → CREAR** |
| 16 | Igualdad, género, LGTBI, discapacidad | 30 | **0 → CREAR** |

### Criterio de éxito

Una pregunta está **lista para producción** cuando:
1. `tema` corresponde al tema oficial correcto (1-16)
2. `review_comment` empieza con `[VERIFIED]`
3. `explanation` contiene cita textual entre «»
4. `legal_reference` es cita limpia
5. `needs_refresh = false`
6. `validation_status = 'human_approved'`

El banco está **listo para producción** cuando:
- Cada tema tiene ≥30 preguntas verificadas y aprobadas
- 0 preguntas con `needs_refresh = true` sin resolver
- 0 contradicciones inter-preguntas pendientes

---

## Errores Conocidos (Tema 1, ya detectados)

| ID | Error | Tipo | Corrección |
|----|-------|------|------------|
| 143 | Dice Art. 28 se reforma por Art. 167, pero Art. 28 está en Arts 15-29 (Art. 168) | ERROR | Cambiar respuesta correcta |
| 150 | Dice Art. 21 NO está en Arts 15-29, pero 15 ≤ 21 ≤ 29 | ERROR | Cambiar respuesta correcta |
| 1377 | Incluye subdelegados como altos cargos (contradice Ley 3/2015 Art. 1.2) | ERROR | Corregir respuesta |
| 139 | Dice Título VIII es el más extenso, pero Título I tiene 46 arts vs 22 | AMBIGUOUS | Verificar criterio (artículos vs secciones) |
| 135/136 | Preguntas duplicadas idénticas | DUPLICATE | Desactivar una |

---

## Notas Técnicas

### Extracción de texto del docx

```python
import zipfile, re

def extract_docx_text(path, start_marker, end_marker, chunk_size=2*1024*1024):
    """Extrae texto entre marcadores del document.xml de un docx"""
    with zipfile.ZipFile(path) as z:
        with z.open('word/document.xml') as f:
            buffer = ''
            while True:
                chunk = f.read(chunk_size).decode('utf-8', errors='ignore')
                if not chunk:
                    break
                buffer += chunk
                # Buscar marcadores en el buffer
                # Extraer texto de <w:t> tags
                texts = re.findall(r'<w:t[^>]*>([^<]+)</w:t>', buffer)
                # Procesar...
                buffer = buffer[-10000:]  # Mantener overlap
```

### Parsing de legal_reference

```
Patrones soportados:
- "Art. 56.1 CE"           → ley=CE, art=56, apartado=1
- "Art. 8.1 Ley 50/1997"   → ley=Ley_50_1997, art=8, apartado=1
- "Arts. 15-29 CE"         → ley=CE, arts=15-29 (rango)
- "Art. 568 LOPJ"          → ley=LOPJ, art=568
- "Art. 1.2.d Ley 3/2015"  → ley=Ley_3_2015, art=1, apartado=2, letra=d
```

---

*Documento creado: 2026-02-14*
*Basado en: BOE-435, Resolución 18/12/2025*
