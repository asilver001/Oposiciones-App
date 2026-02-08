# QUESTION TRACKER - Estado del Banco de Preguntas

> Última actualización: 2026-02-08

---

## Resumen General

| Métrica | Valor |
|---------|-------|
| **Total preguntas en Supabase** | 1,368 |
| **Con respuesta correcta marcada** | 955 (70%) |
| **Sin respuesta correcta** | 413 (30%) |
| **Con explicación** | 955 (70%) |
| **Sin explicación** | 413 (30%) |
| **Temas cubiertos** | 1-11 |

---

## Estado por Tema

### Calidad Tier S (respuesta correcta + explicación)

| Tema | Materia | Total | Tier S | Pendientes | Progreso |
|------|---------|-------|--------|------------|----------|
| 1 | Constitución Española | 331 | 319 | 12 | 96% |
| 2 | Derechos y Deberes Fundamentales | 62 | 52 | 10 | 84% |
| 3 | Corona, Cortes Generales | 153 | 153 | 0 | 100% |
| 4 | Gobierno, Poder Judicial | 42 | 42 | 0 | 100% |
| 5 | AGE: Organización central | 146 | 44 | 102 | 30% |
| 6 | AGE: Organización periférica | 44 | 44 | 0 | 100% |
| 7 | Comunidades Autónomas | 190 | 118 | 72 | 62% |
| 8 | Administración Local | 142 | 6 | 136 | 4% |
| 9 | EBEP: Empleados públicos | 93 | 93 | 0 | 100% |
| 10 | Ley 39/2015: Procedimiento | 77 | 77 | 0 | 100% |
| 11 | Ley 40/2015: Régimen jurídico | 88 | 7 | 81 | 8% |
| **TOTAL** | | **1,368** | **955** | **413** | **70%** |

```
Progreso calidad Tier S:

████████████████░░░░░░ 70%
```

### Temas completados al 100%
- Tema 3: Corona, Cortes Generales (153 preguntas)
- Tema 4: Gobierno, Poder Judicial (42 preguntas)
- Tema 6: AGE Organización periférica (44 preguntas)
- Tema 9: EBEP Empleados públicos (93 preguntas)
- Tema 10: Ley 39/2015 Procedimiento (77 preguntas)

### Temas en progreso
- Tema 1: Constitución (96% - faltan 12)
- Tema 2: Derechos Fundamentales (84% - faltan 10)
- Tema 7: CCAA (62% - faltan 72)

### Temas con mayor trabajo pendiente
- Tema 8: Administración Local (4% - faltan 136)
- Tema 11: Ley 40/2015 (8% - faltan 81)
- Tema 5: AGE Central (30% - faltan 102)

---

## Definición de Calidad Tier S

Una pregunta es Tier S cuando cumple **todos** estos criterios:
1. Tiene una respuesta correcta marcada (`is_correct: true`)
2. Tiene explicación con referencia legal (>10 caracteres)
3. Enunciado completo (no fragmento <50 chars)
4. Sin abreviaciones no expandidas en texto

Ver [QUALITY_STANDARDS.md](./QUALITY_STANDARDS.md) para el sistema completo de tiers y anti-patrones.

---

## Mejora en curso (Feb 2026)

### Problema detectado
- 1,001 preguntas (73%) importadas de Word sin respuesta correcta marcada (`correct_index: null`)
- 1,107 preguntas sin explicación
- 188 enunciados fragmentados (<50 chars)

### Proceso de mejora
- Revisión manual pregunta por pregunta con verificación legal
- Agentes paralelos procesando por tema
- Cada pregunta recibe: respuesta correcta verificada + explicación con artículo de referencia

### Progreso de la mejora
| Fecha | Sin respuesta | Sin explicación | Notas |
|-------|--------------|-----------------|-------|
| 08/02 inicio | 1,001 | 1,107 | Estado inicial |
| 08/02 actual | 413 | 413 | 588 preguntas corregidas |

---

## Esquema de la tabla `questions`

```javascript
{
  id: number,
  question_text: "¿Texto de la pregunta?",
  options: [
    { id: "a", text: "Opción A", position: 0, is_correct: false },
    { id: "b", text: "Opción B", position: 1, is_correct: true },
    { id: "c", text: "Opción C", position: 2, is_correct: false },
    { id: "d", text: "Opción D", position: 3, is_correct: false }
  ],
  correct_answer: "b",         // Letra de la opción correcta
  explanation: "Según el Art...", // Explicación legal
  tema: 1,                     // Número de tema (1-11)
  difficulty: 3,               // Dificultad (1-5)
  is_active: true
}
```

**Nota:** El campo `options` es JSONB. Dos formatos coexisten:
- Nuevo: `{id, text, position, is_correct}` (preferido)
- Legacy: `{text, is_correct}` (algunas preguntas antiguas)

---

## Historial de Actualizaciones

| Fecha | Acción | Cantidad |
|-------|--------|----------|
| 2025-01-14 | Documento creado | - |
| 2026-02-05 | Importación masiva desde PDFs de Word | +1,368 preguntas |
| 2026-02-08 | Inicio mejora calidad Tier S | 588 preguntas corregidas |
| 2026-02-08 | Temas 3,4,6,9,10 completados al 100% | 409 preguntas Tier S |
