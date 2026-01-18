# Database Architecture Review - OpositaSmart

> Fecha de revision: 2026-01-18
> Proyecto Supabase: yutfgmiyndmhsjhzxkdr (Oposita Smart)
> Region: eu-central-2

---

## Resumen Ejecutivo

La base de datos actual tiene una arquitectura solida para las funcionalidades basicas (autenticacion, preguntas, progreso del usuario). Sin embargo, presenta varios problemas de seguridad (RLS deshabilitado en tablas criticas) y carece de estructuras necesarias para implementar funcionalidades futuras como **Simulacros**.

**Estado actual:**
- 158 preguntas activas (todas free, 0 premium)
- 28 tablas en schema public
- 7 problemas de seguridad criticos (RLS)
- 33 warnings de funciones sin search_path fijo

---

## Tablas Existentes

### Tablas Core de Contenido

| Tabla | Proposito | Columnas Clave | RLS |
|-------|-----------|----------------|-----|
| `questions` | Banco de preguntas | id, question_text, options (jsonb), tema, difficulty, tier, is_active | NO |
| `topics` | Temas del temario | id, number, name, code, block_id, is_available | SI |
| `subtopics` | Subtemas | id, topic_id, number, name | SI |
| `blocks` | Bloques del temario (I, II, III) | id, code, name, total_exam_questions | SI |
| `materias` | Catalogo alternativo de materias | id, tema_numero, codigo, nombre, bloque | SI |

### Tablas de Usuario

| Tabla | Proposito | Columnas Clave | RLS |
|-------|-----------|----------------|-----|
| `profiles` | Perfil basico usuario | id (FK auth.users), email, exam_date, daily_goal, onboarding_completed | SI |
| `user_profiles` | Perfil extendido (duplicado) | id (FK auth.users), subscription_status, target_oposicion, streaks | SI |
| `user_stats` | Estadisticas globales usuario | user_id, tests_completed, questions_answered, accuracy_rate, streaks | SI |
| `user_question_progress` | Progreso FSRS por pregunta | user_id, question_id, stability, difficulty, state, next_review | SI |
| `topic_progress` | Progreso por tema | user_id, topic_id, strength_level, consolidation_level | SI |

### Tablas de Sesiones y Tests

| Tabla | Proposito | Columnas Clave | RLS |
|-------|-----------|----------------|-----|
| `test_sessions` | Sesiones de test | id, user_id, topic_id, total_questions, test_type, final_score, status | SI |
| `test_answers` | Respuestas individuales | id, session_id, question_id, selected_option, is_correct | SI |
| `session_stats` | Stats por sesion (insights) | id, user_id, modo, total_preguntas, correctas, porcentaje | SI |
| `study_history` | Historial diario | id, user_id, date, questions_answered, time_spent_seconds | SI |
| `daily_goals` | Objetivos diarios | id, user_id, goal_date, target_questions, is_completed | SI |

### Tablas de Gamificacion

| Tabla | Proposito | Columnas Clave | RLS |
|-------|-----------|----------------|-----|
| `badges` | Definicion de insignias | id, name, requirement_type, requirement_value | NO |
| `user_badges` | Insignias ganadas | id, user_id, badge_id, earned_at | SI |
| `achievements` | Definicion de logros | id, code, name, requirements (jsonb), xp_reward | SI |
| `user_achievements` | Logros desbloqueados | id, user_id, achievement_id, unlocked_at | SI |
| `retention_history` | Historial de retencion | user_id, record_date, retention_percentage | SI |

### Tablas de Insights/Feedback

| Tabla | Proposito | Columnas Clave | RLS |
|-------|-----------|----------------|-----|
| `insight_templates` | Plantillas de insights | id, tipo, severidad, titulo, descripcion, min_fallos_para_activar | SI |
| `insight_question_links` | Vincula insights con preguntas | insight_template_id, question_id | SI |
| `user_triggered_insights` | Insights activados por usuario | user_id, insight_template_id, total_falladas, visto | SI |
| `question_reports` | Reportes de problemas | question_id, user_id, report_type, status | SI |

### Tablas Administrativas

| Tabla | Proposito | Columnas Clave | RLS |
|-------|-----------|----------------|-----|
| `admin_users` | Admins y revisores | id, email, role (admin/reviewer), pin_code | SI |
| `waitlist` | Lista de espera pre-launch | id, email, source | NO |

---

## Relaciones Entre Tablas

```
auth.users
    |
    +-- profiles (1:1) ----------------+
    |                                  |
    +-- user_profiles (1:1)            |
    |                                  |
    +-- user_stats (1:1)               |
    |                                  |
    +-- user_question_progress (1:N) --+-- questions
    |                                  |       |
    +-- topic_progress (1:N) ----------+-- topics
    |                                  |       |
    +-- test_sessions (1:N) -----------+       +-- blocks
    |       |                                  |
    |       +-- test_answers (1:N)             +-- subtopics
    |
    +-- session_stats (1:N)
    |
    +-- daily_goals (1:N)
    |
    +-- study_history (1:N)
    |
    +-- user_badges (1:N) ------------ badges
    |
    +-- user_achievements (1:N) ------ achievements
    |
    +-- user_triggered_insights (1:N) - insight_templates
    |                                         |
    +-- question_reports (1:N) --------+      +-- insight_question_links
                                       |             |
                                       +-------------+-- questions
```

---

## Estado de RLS Policies

### CRITICO - RLS Deshabilitado en Tablas Publicas

| Tabla | Problema | Riesgo | Accion Requerida |
|-------|----------|--------|------------------|
| `questions` | RLS disabled pero tiene policies | ALTO | Habilitar RLS |
| `badges` | RLS disabled pero tiene policies | MEDIO | Habilitar RLS |
| `waitlist` | RLS disabled pero tiene policies | BAJO | Habilitar RLS |

### Vistas con SECURITY DEFINER

| Vista | Problema |
|-------|----------|
| `questions_needing_attention` | Ejecuta con permisos del creador |
| `user_summary` | Ejecuta con permisos del creador |
| `question_report_counts` | Ejecuta con permisos del creador |
| `fortress_view` | Ejecuta con permisos del creador |

**Recomendacion:** Cambiar a SECURITY INVOKER o revisar que no expongan datos sensibles.

### Funciones sin search_path fijo (33 warnings)

Funciones afectadas incluyen:
- `update_updated_at_column`
- `handle_new_user`
- `update_user_streak`
- `verify_admin_login`
- `report_question`
- ... y 28 mas

**Recomendacion:** Agregar `SET search_path = public, pg_temp` a todas las funciones.

---

## Conteo de Preguntas por Tema

| Tema # | Nombre | Preguntas Activas | % del Total |
|--------|--------|-------------------|-------------|
| 1 | La Constitucion Espanola | 40 | 25.3% |
| 2 | TC y Corona / Derechos | 38 | 24.1% |
| 3 | Cortes Generales | 40 | 25.3% |
| 4 | Poder Judicial / Gobierno | 5 | 3.2% |
| 5 | Gobierno y Administracion | 5 | 3.2% |
| 6 | AGE / Gobierno Abierto | 5 | 3.2% |
| 7 | AGE Territorial / Transparencia | 5 | 3.2% |
| 8 | CCAA / AGE | 5 | 3.2% |
| 9 | Admin Local / Org Territorial | 5 | 3.2% |
| 10 | UE | 5 | 3.2% |
| 11 | EBEP / Proc. Administrativo | 5 | 3.2% |
| 12-16 | Resto de temas | 0 | 0% |
| **TOTAL** | | **158** | **100%** |

### Analisis de Cobertura

- **Temas con buena cobertura (35+ preguntas):** 3 temas (1, 2, 3)
- **Temas con cobertura minima (5 preguntas):** 8 temas
- **Temas sin preguntas:** 5+ temas (12-16 y mas)

**Objetivo para Simulacros:**
- Examen real AGE: 100 preguntas
- Minimo recomendado: 500+ preguntas para variedad
- Estado actual: 158 preguntas (31.6% del minimo)

---

## Gaps Identificados para Nuevas Funcionalidades

### 1. Simulacros (Examenes Cronometrados)

**Tablas faltantes:**

```sql
-- simulacros: Definicion de tipos de simulacro
CREATE TABLE simulacros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  num_preguntas INTEGER NOT NULL, -- 5, 10, 20, 60, 100
  tiempo_limite_minutos INTEGER, -- null = sin limite
  modo_tiempo TEXT CHECK (modo_tiempo IN ('sin_limite', 'por_pregunta', 'total')),
  segundos_por_pregunta INTEGER, -- 60, 36 (real AGE)
  penalizacion_errores BOOLEAN DEFAULT true, -- -0.25 por error
  permite_dejar_blanco BOOLEAN DEFAULT true,
  orden_aleatorio BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- simulacro_sessions: Sesiones de simulacro realizadas
CREATE TABLE simulacro_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  simulacro_id UUID REFERENCES simulacros(id),

  -- Configuracion usada
  num_preguntas INTEGER NOT NULL,
  tiempo_limite_minutos INTEGER,

  -- Resultados
  preguntas_respondidas INTEGER DEFAULT 0,
  correctas INTEGER DEFAULT 0,
  incorrectas INTEGER DEFAULT 0,
  en_blanco INTEGER DEFAULT 0,

  -- Puntuacion AGE (correctas - 0.25*incorrectas)
  puntuacion_bruta DECIMAL(5,2),
  puntuacion_sobre_10 DECIMAL(3,1),

  -- Tiempo
  tiempo_usado_segundos INTEGER,
  started_at TIMESTAMPTZ DEFAULT now(),
  finished_at TIMESTAMPTZ,

  -- Estado
  status TEXT CHECK (status IN ('in_progress', 'completed', 'abandoned', 'timeout')) DEFAULT 'in_progress'
);

-- simulacro_answers: Respuestas del simulacro
CREATE TABLE simulacro_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES simulacro_sessions(id) ON DELETE CASCADE,
  question_id INTEGER REFERENCES questions(id),
  orden INTEGER NOT NULL, -- Orden en el examen
  respuesta_seleccionada TEXT, -- null = en blanco
  es_correcta BOOLEAN,
  tiempo_respuesta_segundos INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 2. Comparativa con Examen Real AGE

**Datos necesarios:**

```sql
-- exam_history: Registro de examenes reales pasados
CREATE TABLE exam_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL,
  convocatoria TEXT, -- 'OEP 2023', 'Estabilizacion 2024'
  fecha_examen DATE,
  num_preguntas INTEGER DEFAULT 100,
  tiempo_minutos INTEGER DEFAULT 60,
  nota_corte DECIMAL(4,2),
  nota_media DECIMAL(4,2),
  num_aprobados INTEGER,
  num_presentados INTEGER
);
```

### 3. Sistema de Suscripcion Premium

La tabla `user_profiles` ya tiene campos para suscripcion:
- `subscription_status`: enum (free, premium, trial, cancelled)
- `subscription_started_at`, `subscription_expires_at`
- `stripe_customer_id`

**Falta:** Integracion real con Stripe y logica de acceso por tier.

### 4. Banco de Preguntas Insuficiente

Para un sistema de simulacros robusto necesitamos:

| Tipo | Actual | Minimo Recomendado | Ideal |
|------|--------|-------------------|-------|
| Bloque I (Org. Publica) | ~118 | 300 | 500 |
| Bloque II (Ofimatica) | ~40 | 200 | 400 |
| Bloque III (Psicotecnicos) | 0 | 150 | 300 |
| **TOTAL** | **158** | **650** | **1200** |

---

## Recomendaciones Prioritarias

### Seguridad (URGENTE)

1. **Habilitar RLS en `questions`:**
   ```sql
   ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
   ```

2. **Habilitar RLS en `badges`:**
   ```sql
   ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
   ```

3. **Habilitar RLS en `waitlist`:**
   ```sql
   ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
   ```

4. **Revisar vistas SECURITY DEFINER** - Evaluar si deben ser INVOKER

5. **Fijar search_path en funciones** - Crear migracion para todas las funciones afectadas

### Arquitectura

1. **Consolidar tablas de perfil:** `profiles` y `user_profiles` duplican funcionalidad. Migrar a una sola tabla.

2. **Crear tablas para Simulacros** antes de implementar la feature.

3. **Agregar indices** para queries frecuentes:
   ```sql
   CREATE INDEX idx_questions_tema ON questions(tema) WHERE is_active = true;
   CREATE INDEX idx_user_progress_next_review ON user_question_progress(user_id, next_review);
   ```

### Contenido

1. **Prioridad maxima:** Completar preguntas de temas 4-11 (actualmente solo 5 cada uno)

2. **Crear preguntas de Bloque II** (Ofimatica) - actualmente 0 en la BD

3. **Importar preguntas del pipeline** (263 en draft segun PROJECT_STATUS.md)

---

## Metricas de la Base de Datos

| Metrica | Valor |
|---------|-------|
| Total de tablas | 28 |
| Tablas con RLS habilitado | 25 |
| Tablas sin RLS (problema) | 3 |
| Total de preguntas | 158 |
| Preguntas activas | 158 |
| Preguntas premium | 0 |
| Version PostgreSQL | 17.6.1.054 |
| Migraciones aplicadas | 1 (question_reports_v3) |

---

## Proximos Pasos

1. [ ] Crear migracion para habilitar RLS en tablas criticas
2. [ ] Crear migracion con tablas de Simulacros
3. [ ] Consolidar `profiles` y `user_profiles`
4. [ ] Importar preguntas del pipeline draft
5. [ ] Crear mas preguntas para temas con poca cobertura
6. [ ] Implementar logica de acceso premium/free por tier

---

*Documento generado por Agent 5 - Revision de Arquitectura*
