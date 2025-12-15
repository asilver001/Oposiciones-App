-- ============================================================================
-- OPOSITA SMART - Schema de Base de Datos
-- ============================================================================
-- Migración inicial para app de preparación de oposiciones españolas
-- Target inicial: Auxiliar Administrativo AGE (C2)
-- Stack: React + Supabase + Netlify
-- ============================================================================

-- ============================================================================
-- PARTE 1: TIPOS ENUMERADOS Y EXTENSIONES
-- ============================================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para búsqueda de texto

-- Tipos enumerados para mejor integridad de datos
CREATE TYPE subscription_status AS ENUM ('free', 'premium', 'trial', 'cancelled');
CREATE TYPE validation_status AS ENUM ('auto_validated', 'human_pending', 'human_approved', 'rejected');
CREATE TYPE session_type AS ENUM ('practice', 'exam_simulation', 'hybrid_review', 'spaced_repetition');
CREATE TYPE question_source AS ENUM ('examen_oficial', 'elaboracion_propia', 'libro_texto', 'academia');
CREATE TYPE materia_type AS ENUM ('constitucion', 'procedimiento', 'ofimatica', 'organizacion', 'otras');

-- ============================================================================
-- PARTE 2: FUNCIÓN HELPER PARA updated_at
-- ============================================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PARTE 3: TABLA QUESTIONS (Banco de Preguntas)
-- ============================================================================

CREATE TABLE questions (
    -- Identificación
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Contenido de la pregunta
    question_text TEXT NOT NULL,
    options JSONB NOT NULL DEFAULT '[]',
    -- Estructura esperada de options:
    -- [
    --   {"id": "a", "text": "Opción A", "is_correct": false, "position": 0},
    --   {"id": "b", "text": "Opción B", "is_correct": true, "position": 1},
    --   {"id": "c", "text": "Opción C", "is_correct": false, "position": 2},
    --   {"id": "d", "text": "Opción D", "is_correct": false, "position": 3}
    -- ]
    explanation TEXT,
    legal_reference TEXT, -- ej: "Art. 23.1 CE", "Art. 14 Ley 39/2015"

    -- Clasificación temática
    tema INTEGER CHECK (tema >= 1 AND tema <= 100), -- Número del temario oficial
    subtema TEXT,
    materia materia_type,

    -- A qué cuerpos aplica esta pregunta
    cuerpos TEXT[] DEFAULT ARRAY['auxiliar_age'],
    -- Valores posibles: 'auxiliar_age', 'administrativo_age', 'auxiliar_ccaa', etc.

    -- Metadatos de dificultad y calidad
    difficulty INTEGER DEFAULT 3 CHECK (difficulty >= 1 AND difficulty <= 5),
    source question_source DEFAULT 'elaboracion_propia',
    source_year INTEGER CHECK (source_year >= 1978 AND source_year <= 2030),
    source_exam_name TEXT, -- ej: "AGE Auxiliar 2022 - Turno Libre"

    -- Estadísticas agregadas (se actualizan con triggers/funciones)
    times_shown INTEGER DEFAULT 0,
    times_correct INTEGER DEFAULT 0,
    global_success_rate DECIMAL(5,4) GENERATED ALWAYS AS (
        CASE WHEN times_shown > 0 THEN times_correct::DECIMAL / times_shown ELSE 0 END
    ) STORED,

    -- Validación y calidad
    validation_status validation_status DEFAULT 'auto_validated',
    validated_by UUID, -- referencia al admin que validó
    validated_at TIMESTAMPTZ,
    confidence_score DECIMAL(3,2) DEFAULT 0.5 CHECK (confidence_score >= 0 AND confidence_score <= 1),

    -- Control
    is_active BOOLEAN DEFAULT true,
    is_premium BOOLEAN DEFAULT false, -- Si requiere suscripción

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_options CHECK (jsonb_array_length(options) >= 2),
    CONSTRAINT question_text_not_empty CHECK (LENGTH(TRIM(question_text)) > 10)
);

-- Trigger para updated_at
CREATE TRIGGER update_questions_updated_at
    BEFORE UPDATE ON questions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comentarios de documentación
COMMENT ON TABLE questions IS 'Banco de preguntas para tests de oposiciones';
COMMENT ON COLUMN questions.options IS 'Array JSON con opciones: [{id, text, is_correct, position}]';
COMMENT ON COLUMN questions.cuerpos IS 'Array de cuerpos a los que aplica: auxiliar_age, administrativo_age, etc.';
COMMENT ON COLUMN questions.confidence_score IS 'Puntuación de confianza 0-1 basada en validación y rendimiento';

-- ============================================================================
-- PARTE 4: TABLA USER_PROFILES (Perfil de Usuario)
-- ============================================================================

CREATE TABLE user_profiles (
    -- Identificación (referencia a auth.users de Supabase)
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    display_name TEXT,
    avatar_url TEXT,

    -- Suscripción
    subscription_status subscription_status DEFAULT 'free',
    subscription_started_at TIMESTAMPTZ,
    subscription_expires_at TIMESTAMPTZ,
    stripe_customer_id TEXT, -- Para integración con Stripe

    -- Objetivos de estudio
    target_oposicion TEXT DEFAULT 'auxiliar_age',
    target_exam_date DATE,
    daily_goal_questions INTEGER DEFAULT 20 CHECK (daily_goal_questions >= 5 AND daily_goal_questions <= 200),
    preferred_study_time TEXT DEFAULT 'morning', -- 'morning', 'afternoon', 'evening', 'night'

    -- Estadísticas de racha
    current_streak INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    last_study_date DATE,
    total_study_days INTEGER DEFAULT 0,

    -- Estadísticas globales
    total_questions_answered INTEGER DEFAULT 0,
    total_correct_answers INTEGER DEFAULT 0,
    total_tests_completed INTEGER DEFAULT 0,
    total_study_time_minutes INTEGER DEFAULT 0,

    -- Onboarding y preferencias
    onboarding_completed BOOLEAN DEFAULT false,
    onboarding_step INTEGER DEFAULT 0,
    notifications_enabled BOOLEAN DEFAULT true,
    reminder_time TIME DEFAULT '09:00:00',

    -- Configuración de app
    theme_preference TEXT DEFAULT 'system', -- 'light', 'dark', 'system'
    sound_enabled BOOLEAN DEFAULT true,
    haptic_enabled BOOLEAN DEFAULT true,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE user_profiles IS 'Perfil extendido del usuario con preferencias y estadísticas';
COMMENT ON COLUMN user_profiles.target_oposicion IS 'Oposición objetivo: auxiliar_age, administrativo_age, etc.';

-- ============================================================================
-- PARTE 5: TABLA USER_QUESTION_PROGRESS (Spaced Repetition - FSRS)
-- ============================================================================

CREATE TABLE user_question_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Referencias
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,

    -- Parámetros FSRS (Free Spaced Repetition Scheduler)
    -- Basado en: https://github.com/open-spaced-repetition/fsrs4anki
    stability DECIMAL(10,4) DEFAULT 0.4, -- S: estabilidad de la memoria
    difficulty DECIMAL(10,4) DEFAULT 0.3, -- D: dificultad percibida (0-1)
    elapsed_days DECIMAL(10,4) DEFAULT 0, -- Días desde última revisión
    scheduled_days DECIMAL(10,4) DEFAULT 0, -- Días hasta próxima revisión
    reps INTEGER DEFAULT 0, -- Número de repeticiones
    lapses INTEGER DEFAULT 0, -- Veces que se olvidó (respuesta incorrecta después de correcta)
    state INTEGER DEFAULT 0, -- 0: New, 1: Learning, 2: Review, 3: Relearning

    -- Fechas de revisión
    last_review TIMESTAMPTZ,
    next_review TIMESTAMPTZ,

    -- Estadísticas del usuario para esta pregunta
    times_seen INTEGER DEFAULT 0,
    times_correct INTEGER DEFAULT 0,
    consecutive_correct INTEGER DEFAULT 0,
    consecutive_wrong INTEGER DEFAULT 0,
    last_answer_correct BOOLEAN,

    -- Tiempo promedio de respuesta (para detectar patrones)
    avg_response_time_ms INTEGER,

    -- Marcadores del usuario
    is_flagged BOOLEAN DEFAULT false, -- Marcada para revisar
    is_favorite BOOLEAN DEFAULT false, -- Pregunta favorita
    user_notes TEXT, -- Notas personales

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Constraint único: un usuario solo tiene un progreso por pregunta
    CONSTRAINT unique_user_question UNIQUE (user_id, question_id)
);

-- Trigger para updated_at
CREATE TRIGGER update_user_question_progress_updated_at
    BEFORE UPDATE ON user_question_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE user_question_progress IS 'Progreso del usuario por pregunta para spaced repetition (FSRS)';
COMMENT ON COLUMN user_question_progress.stability IS 'FSRS: Estabilidad de memoria. Mayor = recuerdo más duradero';
COMMENT ON COLUMN user_question_progress.difficulty IS 'FSRS: Dificultad percibida 0-1. Mayor = más difícil';
COMMENT ON COLUMN user_question_progress.state IS 'FSRS: 0=New, 1=Learning, 2=Review, 3=Relearning';

-- ============================================================================
-- PARTE 6: TABLA TEST_SESSIONS (Sesiones de Test)
-- ============================================================================

CREATE TABLE test_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Usuario
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Configuración del test
    session_type session_type DEFAULT 'practice',
    cuerpo TEXT DEFAULT 'auxiliar_age',
    tema_filter INTEGER[], -- Null = todos los temas
    materia_filter materia_type[],
    difficulty_filter INTEGER[], -- Null = todas las dificultades
    question_count_requested INTEGER NOT NULL,
    include_review_questions BOOLEAN DEFAULT false, -- Incluir preguntas de spaced repetition

    -- Resultados
    total_questions INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    wrong_answers INTEGER DEFAULT 0,
    blank_answers INTEGER DEFAULT 0,

    -- Puntuación
    score_raw DECIMAL(5,2), -- Porcentaje sin penalización
    score_with_penalty DECIMAL(5,2), -- Con penalización por errores
    penalty_factor DECIMAL(3,2) DEFAULT 0.33, -- Factor de penalización (AGE usa 1/3)

    -- Fórmula AGE: (Correctas - (Incorrectas * penalty_factor)) / Total * 10
    final_score DECIMAL(4,2) GENERATED ALWAYS AS (
        CASE
            WHEN total_questions > 0 THEN
                GREATEST(0, (correct_answers - (wrong_answers * penalty_factor)) / total_questions * 10)
            ELSE 0
        END
    ) STORED,

    -- Tiempo
    time_limit_seconds INTEGER, -- Null = sin límite
    time_spent_seconds INTEGER DEFAULT 0,
    avg_time_per_question DECIMAL(6,2) GENERATED ALWAYS AS (
        CASE WHEN total_questions > 0 THEN time_spent_seconds::DECIMAL / total_questions ELSE 0 END
    ) STORED,

    -- Estado
    is_completed BOOLEAN DEFAULT false,
    was_abandoned BOOLEAN DEFAULT false,

    -- Timestamps
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE test_sessions IS 'Sesiones de test completadas o en progreso';
COMMENT ON COLUMN test_sessions.penalty_factor IS 'Factor de penalización. AGE usa 0.33 (1 error anula 1/3 de acierto)';
COMMENT ON COLUMN test_sessions.final_score IS 'Nota final 0-10 con fórmula oficial AGE';

-- ============================================================================
-- PARTE 7: TABLA TEST_ANSWERS (Respuestas Individuales)
-- ============================================================================

CREATE TABLE test_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Referencias
    session_id UUID NOT NULL REFERENCES test_sessions(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Respuesta
    question_order INTEGER NOT NULL, -- Posición en el test (1-indexed)
    selected_option TEXT, -- 'a', 'b', 'c', 'd' o NULL si en blanco
    is_correct BOOLEAN,
    is_blank BOOLEAN GENERATED ALWAYS AS (selected_option IS NULL) STORED,

    -- Tiempo
    time_spent_seconds INTEGER DEFAULT 0,
    time_spent_ms INTEGER, -- Más precisión para analytics

    -- Contexto
    was_review_question BOOLEAN DEFAULT false, -- Era pregunta de spaced repetition
    was_flagged_during_test BOOLEAN DEFAULT false, -- Marcada durante el test
    confidence_level INTEGER CHECK (confidence_level >= 1 AND confidence_level <= 5), -- Auto-evaluación del usuario

    -- Timestamps
    answered_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Un usuario solo puede responder una vez por pregunta en una sesión
    CONSTRAINT unique_session_question UNIQUE (session_id, question_id)
);

COMMENT ON TABLE test_answers IS 'Respuestas individuales de cada pregunta en una sesión';
COMMENT ON COLUMN test_answers.confidence_level IS 'Auto-evaluación 1-5 de confianza en la respuesta';

-- ============================================================================
-- PARTE 8: TABLA ACHIEVEMENTS (Logros/Gamificación)
-- ============================================================================

CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Definición del logro
    code TEXT UNIQUE NOT NULL, -- 'streak_7', 'tests_100', etc.
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT, -- Emoji o URL del icono
    category TEXT, -- 'streak', 'accuracy', 'volume', 'special'

    -- Requisitos (JSON flexible para diferentes tipos)
    requirements JSONB NOT NULL,
    -- Ejemplos:
    -- {"type": "streak", "days": 7}
    -- {"type": "tests_completed", "count": 100}
    -- {"type": "accuracy", "percentage": 90, "min_questions": 50}

    -- Recompensa
    xp_reward INTEGER DEFAULT 0,
    is_secret BOOLEAN DEFAULT false, -- Logro oculto hasta conseguirlo

    -- Control
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,

    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    notified BOOLEAN DEFAULT false, -- Si ya se mostró la notificación

    CONSTRAINT unique_user_achievement UNIQUE (user_id, achievement_id)
);

COMMENT ON TABLE achievements IS 'Definición de logros disponibles';
COMMENT ON TABLE user_achievements IS 'Logros desbloqueados por usuario';

-- ============================================================================
-- PARTE 9: ÍNDICES PARA PERFORMANCE
-- ============================================================================

-- Índices en questions
CREATE INDEX idx_questions_cuerpos ON questions USING GIN (cuerpos);
CREATE INDEX idx_questions_tema ON questions (tema) WHERE is_active = true;
CREATE INDEX idx_questions_materia ON questions (materia) WHERE is_active = true;
CREATE INDEX idx_questions_difficulty ON questions (difficulty) WHERE is_active = true;
CREATE INDEX idx_questions_active ON questions (is_active) WHERE is_active = true;
CREATE INDEX idx_questions_validation ON questions (validation_status);
CREATE INDEX idx_questions_premium ON questions (is_premium) WHERE is_active = true;

-- Índice para búsqueda de texto
CREATE INDEX idx_questions_text_search ON questions USING GIN (
    to_tsvector('spanish', question_text || ' ' || COALESCE(explanation, ''))
);

-- Índices en user_profiles
CREATE INDEX idx_user_profiles_subscription ON user_profiles (subscription_status);
CREATE INDEX idx_user_profiles_target ON user_profiles (target_oposicion);
CREATE INDEX idx_user_profiles_streak ON user_profiles (current_streak DESC);

-- Índices en user_question_progress (CRÍTICOS para spaced repetition)
CREATE INDEX idx_uqp_user_next_review ON user_question_progress (user_id, next_review);
CREATE INDEX idx_uqp_user_state ON user_question_progress (user_id, state);
CREATE INDEX idx_uqp_user_flagged ON user_question_progress (user_id) WHERE is_flagged = true;
CREATE INDEX idx_uqp_user_favorite ON user_question_progress (user_id) WHERE is_favorite = true;
CREATE INDEX idx_uqp_question ON user_question_progress (question_id);

-- Índices en test_sessions
CREATE INDEX idx_test_sessions_user_date ON test_sessions (user_id, started_at DESC);
CREATE INDEX idx_test_sessions_user_completed ON test_sessions (user_id, is_completed);
CREATE INDEX idx_test_sessions_type ON test_sessions (session_type);

-- Índices en test_answers
CREATE INDEX idx_test_answers_session ON test_answers (session_id);
CREATE INDEX idx_test_answers_user ON test_answers (user_id);
CREATE INDEX idx_test_answers_question ON test_answers (question_id);

-- ============================================================================
-- PARTE 10: ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_question_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- ==================== POLICIES: QUESTIONS ====================
-- Cualquiera puede leer preguntas activas
CREATE POLICY "Questions: Public read access for active questions"
    ON questions FOR SELECT
    USING (is_active = true);

-- Solo usuarios premium pueden ver preguntas premium (o admins)
CREATE POLICY "Questions: Premium questions for premium users"
    ON questions FOR SELECT
    USING (
        is_premium = false
        OR EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.subscription_status = 'premium'
        )
    );

-- Solo service_role puede modificar preguntas
CREATE POLICY "Questions: Service role full access"
    ON questions FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- ==================== POLICIES: USER_PROFILES ====================
-- Usuarios solo pueden ver su propio perfil
CREATE POLICY "User profiles: Users can view own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);

-- Usuarios solo pueden actualizar su propio perfil
CREATE POLICY "User profiles: Users can update own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Usuarios pueden insertar su propio perfil (o el trigger lo hace)
CREATE POLICY "User profiles: Users can insert own profile"
    ON user_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ==================== POLICIES: USER_QUESTION_PROGRESS ====================
-- Usuarios solo pueden ver su propio progreso
CREATE POLICY "User progress: Users can view own progress"
    ON user_question_progress FOR SELECT
    USING (auth.uid() = user_id);

-- Usuarios solo pueden modificar su propio progreso
CREATE POLICY "User progress: Users can modify own progress"
    ON user_question_progress FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ==================== POLICIES: TEST_SESSIONS ====================
-- Usuarios solo pueden ver sus propias sesiones
CREATE POLICY "Test sessions: Users can view own sessions"
    ON test_sessions FOR SELECT
    USING (auth.uid() = user_id);

-- Usuarios solo pueden crear/modificar sus propias sesiones
CREATE POLICY "Test sessions: Users can manage own sessions"
    ON test_sessions FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ==================== POLICIES: TEST_ANSWERS ====================
-- Usuarios solo pueden ver sus propias respuestas
CREATE POLICY "Test answers: Users can view own answers"
    ON test_answers FOR SELECT
    USING (auth.uid() = user_id);

-- Usuarios solo pueden crear sus propias respuestas
CREATE POLICY "Test answers: Users can create own answers"
    ON test_answers FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ==================== POLICIES: ACHIEVEMENTS ====================
-- Todos pueden ver los logros públicos
CREATE POLICY "Achievements: Public read access"
    ON achievements FOR SELECT
    USING (is_active = true AND is_secret = false);

-- Usuarios pueden ver sus propios logros (incluso secretos ya desbloqueados)
CREATE POLICY "User achievements: Users can view own achievements"
    ON user_achievements FOR SELECT
    USING (auth.uid() = user_id);

-- ============================================================================
-- PARTE 11: FUNCIONES AUXILIARES
-- ============================================================================

-- Función para actualizar racha del usuario
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID)
RETURNS void AS $$
DECLARE
    v_last_study_date DATE;
    v_current_streak INTEGER;
    v_best_streak INTEGER;
    v_today DATE := CURRENT_DATE;
BEGIN
    -- Obtener datos actuales
    SELECT last_study_date, current_streak, best_streak
    INTO v_last_study_date, v_current_streak, v_best_streak
    FROM user_profiles
    WHERE id = p_user_id;

    -- Si no existe el perfil, salir
    IF NOT FOUND THEN
        RETURN;
    END IF;

    -- Calcular nueva racha
    IF v_last_study_date IS NULL THEN
        -- Primera vez estudiando
        v_current_streak := 1;
    ELSIF v_last_study_date = v_today THEN
        -- Ya estudió hoy, no cambiar nada
        RETURN;
    ELSIF v_last_study_date = v_today - INTERVAL '1 day' THEN
        -- Estudió ayer, incrementar racha
        v_current_streak := v_current_streak + 1;
    ELSE
        -- Perdió la racha, reiniciar
        v_current_streak := 1;
    END IF;

    -- Actualizar best_streak si corresponde
    IF v_current_streak > v_best_streak THEN
        v_best_streak := v_current_streak;
    END IF;

    -- Guardar cambios
    UPDATE user_profiles
    SET
        current_streak = v_current_streak,
        best_streak = v_best_streak,
        last_study_date = v_today,
        total_study_days = total_study_days + 1,
        updated_at = NOW()
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar si la racha está en riesgo (no ha estudiado hoy)
CREATE OR REPLACE FUNCTION check_streak_status(p_user_id UUID)
RETURNS TABLE (
    current_streak INTEGER,
    streak_at_risk BOOLEAN,
    days_until_lost INTEGER,
    last_study_date DATE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        up.current_streak,
        (up.last_study_date < CURRENT_DATE) AS streak_at_risk,
        CASE
            WHEN up.last_study_date IS NULL THEN 0
            WHEN up.last_study_date >= CURRENT_DATE THEN 1
            ELSE 0
        END AS days_until_lost,
        up.last_study_date
    FROM user_profiles up
    WHERE up.id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener preguntas para revisión (spaced repetition)
CREATE OR REPLACE FUNCTION get_due_review_questions(
    p_user_id UUID,
    p_limit INTEGER DEFAULT 20,
    p_cuerpo TEXT DEFAULT 'auxiliar_age'
)
RETURNS TABLE (
    question_id UUID,
    priority_score DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        uqp.question_id,
        -- Prioridad: preguntas más atrasadas y más difíciles primero
        (EXTRACT(EPOCH FROM (NOW() - uqp.next_review)) / 86400.0 + uqp.difficulty * 10) AS priority_score
    FROM user_question_progress uqp
    JOIN questions q ON q.id = uqp.question_id
    WHERE uqp.user_id = p_user_id
      AND uqp.next_review <= NOW()
      AND q.is_active = true
      AND p_cuerpo = ANY(q.cuerpos)
    ORDER BY priority_score DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para actualizar estadísticas de pregunta (llamar después de cada respuesta)
CREATE OR REPLACE FUNCTION update_question_stats(p_question_id UUID, p_was_correct BOOLEAN)
RETURNS void AS $$
BEGIN
    UPDATE questions
    SET
        times_shown = times_shown + 1,
        times_correct = times_correct + CASE WHEN p_was_correct THEN 1 ELSE 0 END,
        updated_at = NOW()
    WHERE id = p_question_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener estadísticas del usuario
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id UUID)
RETURNS TABLE (
    total_questions_answered BIGINT,
    total_correct BIGINT,
    accuracy_rate DECIMAL,
    total_tests BIGINT,
    avg_score DECIMAL,
    current_streak INTEGER,
    best_streak INTEGER,
    questions_due_review BIGINT,
    favorite_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(SUM(ta.question_count), 0)::BIGINT AS total_questions_answered,
        COALESCE(SUM(ta.correct_count), 0)::BIGINT AS total_correct,
        CASE
            WHEN SUM(ta.question_count) > 0
            THEN ROUND(SUM(ta.correct_count)::DECIMAL / SUM(ta.question_count) * 100, 2)
            ELSE 0
        END AS accuracy_rate,
        COUNT(DISTINCT ts.id)::BIGINT AS total_tests,
        ROUND(AVG(ts.final_score), 2) AS avg_score,
        up.current_streak,
        up.best_streak,
        (SELECT COUNT(*) FROM user_question_progress WHERE user_id = p_user_id AND next_review <= NOW())::BIGINT AS questions_due_review,
        (SELECT COUNT(*) FROM user_question_progress WHERE user_id = p_user_id AND is_favorite = true)::BIGINT AS favorite_count
    FROM user_profiles up
    LEFT JOIN test_sessions ts ON ts.user_id = up.id AND ts.is_completed = true
    LEFT JOIN LATERAL (
        SELECT
            COUNT(*) AS question_count,
            COUNT(*) FILTER (WHERE is_correct = true) AS correct_count
        FROM test_answers
        WHERE session_id = ts.id
    ) ta ON true
    WHERE up.id = p_user_id
    GROUP BY up.id, up.current_streak, up.best_streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PARTE 12: TRIGGERS ADICIONALES
-- ============================================================================

-- Trigger para crear perfil automáticamente cuando se registra usuario
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, email, display_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear trigger en auth.users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Trigger para actualizar estadísticas del usuario después de completar un test
CREATE OR REPLACE FUNCTION update_user_stats_after_test()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo ejecutar si el test se completó
    IF NEW.is_completed = true AND (OLD.is_completed = false OR OLD IS NULL) THEN
        -- Actualizar estadísticas en user_profiles
        UPDATE user_profiles
        SET
            total_questions_answered = total_questions_answered + NEW.total_questions,
            total_correct_answers = total_correct_answers + NEW.correct_answers,
            total_tests_completed = total_tests_completed + 1,
            updated_at = NOW()
        WHERE id = NEW.user_id;

        -- Actualizar racha
        PERFORM update_user_streak(NEW.user_id);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_test_session_completed
    AFTER INSERT OR UPDATE ON test_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_stats_after_test();

-- ============================================================================
-- PARTE 13: DATOS INICIALES
-- ============================================================================

-- Insertar logros predefinidos
INSERT INTO achievements (code, name, description, icon, category, requirements, xp_reward) VALUES
    ('streak_3', 'Constancia', 'Estudia 3 días seguidos', '🔥', 'streak', '{"type": "streak", "days": 3}', 50),
    ('streak_7', 'Semana perfecta', 'Estudia 7 días seguidos', '💪', 'streak', '{"type": "streak", "days": 7}', 100),
    ('streak_30', 'Mes de hierro', 'Estudia 30 días seguidos', '🏆', 'streak', '{"type": "streak", "days": 30}', 500),
    ('streak_100', 'Leyenda', 'Estudia 100 días seguidos', '👑', 'streak', '{"type": "streak", "days": 100}', 2000),
    ('tests_10', 'Primeros pasos', 'Completa 10 tests', '📝', 'volume', '{"type": "tests_completed", "count": 10}', 30),
    ('tests_50', 'En marcha', 'Completa 50 tests', '📚', 'volume', '{"type": "tests_completed", "count": 50}', 150),
    ('tests_100', 'Centurión', 'Completa 100 tests', '💯', 'volume', '{"type": "tests_completed", "count": 100}', 300),
    ('accuracy_80', 'Precisión', '80% de aciertos en 50+ preguntas', '🎯', 'accuracy', '{"type": "accuracy", "percentage": 80, "min_questions": 50}', 100),
    ('accuracy_90', 'Experto', '90% de aciertos en 100+ preguntas', '⭐', 'accuracy', '{"type": "accuracy", "percentage": 90, "min_questions": 100}', 250),
    ('perfect_test', 'Test perfecto', 'Completa un test sin errores (10+ preguntas)', '✨', 'special', '{"type": "perfect_test", "min_questions": 10}', 200),
    ('first_favorite', 'Coleccionista', 'Añade tu primera pregunta favorita', '❤️', 'special', '{"type": "favorites", "count": 1}', 10),
    ('night_owl', 'Búho nocturno', 'Estudia después de las 23:00', '🦉', 'special', '{"type": "time_based", "after": "23:00"}', 25)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- PARTE 14: VISTAS ÚTILES
-- ============================================================================

-- Vista de leaderboard semanal
CREATE OR REPLACE VIEW weekly_leaderboard AS
SELECT
    up.display_name,
    up.current_streak,
    COUNT(DISTINCT ts.id) AS tests_this_week,
    COALESCE(SUM(ts.correct_answers), 0) AS correct_this_week,
    ROUND(AVG(ts.final_score), 2) AS avg_score_this_week
FROM user_profiles up
LEFT JOIN test_sessions ts ON ts.user_id = up.id
    AND ts.is_completed = true
    AND ts.completed_at >= DATE_TRUNC('week', CURRENT_DATE)
GROUP BY up.id, up.display_name, up.current_streak
ORDER BY correct_this_week DESC, avg_score_this_week DESC
LIMIT 100;

-- Vista de preguntas más difíciles
CREATE OR REPLACE VIEW hardest_questions AS
SELECT
    q.id,
    q.question_text,
    q.tema,
    q.materia,
    q.times_shown,
    q.global_success_rate,
    q.difficulty
FROM questions q
WHERE q.is_active = true
  AND q.times_shown >= 10
ORDER BY q.global_success_rate ASC
LIMIT 50;

-- ============================================================================
-- FIN DE LA MIGRACIÓN
-- ============================================================================

COMMENT ON DATABASE postgres IS 'Oposita Smart - Base de datos para preparación de oposiciones españolas';
