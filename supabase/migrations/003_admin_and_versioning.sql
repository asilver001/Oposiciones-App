-- ============================================================================
-- OPOSITA SMART - Migración 003: Sistema de Admin/Revisor y Versionado
-- ============================================================================
-- Añade:
-- - Tabla admin_users con roles (admin, reviewer)
-- - Campos de versionado en questions
-- - Vista de versiones
-- - Función para crear nuevas versiones
-- - Políticas RLS actualizadas
-- ============================================================================

-- ============================================================================
-- PARTE 1: TABLA ADMIN_USERS
-- ============================================================================

CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'reviewer')),
    name TEXT,
    pin_code TEXT NOT NULL, -- código PIN para acceso rápido
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,

    -- Metadata adicional
    permissions JSONB DEFAULT '{}', -- permisos específicos si se necesitan
    notes TEXT -- notas internas sobre el usuario
);

-- Índices para admin_users
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active) WHERE is_active = true;

COMMENT ON TABLE admin_users IS 'Usuarios administradores y revisores del sistema';
COMMENT ON COLUMN admin_users.role IS 'Rol del usuario: admin (acceso total) o reviewer (solo revisar preguntas)';
COMMENT ON COLUMN admin_users.pin_code IS 'PIN de acceso rápido para el panel de admin';

-- ============================================================================
-- PARTE 2: INSERTAR USUARIOS INICIALES
-- ============================================================================

-- IMPORTANTE: Cambiar estos emails por los reales antes de ejecutar
INSERT INTO admin_users (email, role, name, pin_code) VALUES
    ('admin@opositasmart.com', 'admin', 'Administrador Principal', 'admin2025'),
    ('revisor@opositasmart.com', 'reviewer', 'Revisor Principal', 'revisor2025')
ON CONFLICT (email) DO UPDATE SET
    role = EXCLUDED.role,
    pin_code = EXCLUDED.pin_code,
    name = EXCLUDED.name;

-- ============================================================================
-- PARTE 3: MODIFICAR TABLA QUESTIONS - Campos de Versionado
-- ============================================================================

-- Campo: original_question_id (referencia a la pregunta original si es versión)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'questions' AND column_name = 'original_question_id'
    ) THEN
        ALTER TABLE questions ADD COLUMN original_question_id UUID REFERENCES questions(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Campo: version (número de versión)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'questions' AND column_name = 'version'
    ) THEN
        ALTER TABLE questions ADD COLUMN version INTEGER DEFAULT 1;
    END IF;
END $$;

-- Campo: is_current_version (indica si es la versión activa)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'questions' AND column_name = 'is_current_version'
    ) THEN
        ALTER TABLE questions ADD COLUMN is_current_version BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Campo: original_text (texto original antes de reformular)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'questions' AND column_name = 'original_text'
    ) THEN
        ALTER TABLE questions ADD COLUMN original_text TEXT;
    END IF;
END $$;

-- Campo: reformulated_by (quién/qué reformuló la pregunta)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'questions' AND column_name = 'reformulated_by'
    ) THEN
        ALTER TABLE questions ADD COLUMN reformulated_by TEXT CHECK (reformulated_by IN ('claude', 'manual', 'admin', 'import'));
    END IF;
END $$;

-- Campo: reviewed_by (FK a admin_users)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'questions' AND column_name = 'reviewed_by'
    ) THEN
        ALTER TABLE questions ADD COLUMN reviewed_by UUID REFERENCES admin_users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Campo: reviewed_at (cuándo se revisó)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'questions' AND column_name = 'reviewed_at'
    ) THEN
        ALTER TABLE questions ADD COLUMN reviewed_at TIMESTAMPTZ;
    END IF;
END $$;

-- Campo: review_comment (comentario del revisor)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'questions' AND column_name = 'review_comment'
    ) THEN
        ALTER TABLE questions ADD COLUMN review_comment TEXT;
    END IF;
END $$;

-- Campo: needs_refresh (marcar para reformular)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'questions' AND column_name = 'needs_refresh'
    ) THEN
        ALTER TABLE questions ADD COLUMN needs_refresh BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Campo: refresh_reason (por qué necesita reformularse)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'questions' AND column_name = 'refresh_reason'
    ) THEN
        ALTER TABLE questions ADD COLUMN refresh_reason TEXT;
    END IF;
END $$;

-- Índices para los nuevos campos
CREATE INDEX IF NOT EXISTS idx_questions_original_id ON questions(original_question_id);
CREATE INDEX IF NOT EXISTS idx_questions_version ON questions(version);
CREATE INDEX IF NOT EXISTS idx_questions_current_version ON questions(is_current_version) WHERE is_current_version = true;
CREATE INDEX IF NOT EXISTS idx_questions_reviewed_by ON questions(reviewed_by);
CREATE INDEX IF NOT EXISTS idx_questions_needs_refresh ON questions(needs_refresh) WHERE needs_refresh = true;

-- ============================================================================
-- PARTE 4: VISTA DE VERSIONES DE PREGUNTAS
-- ============================================================================

CREATE OR REPLACE VIEW question_versions_view AS
WITH question_groups AS (
    SELECT
        COALESCE(q.original_question_id, q.id) AS root_question_id,
        q.id,
        q.question_text,
        q.version,
        q.is_current_version,
        q.validation_status,
        q.created_at,
        q.updated_at,
        q.reviewed_by,
        q.reviewed_at,
        q.review_comment,
        q.reformulated_by,
        q.needs_refresh,
        au.name AS reviewer_name,
        au.role AS reviewer_role
    FROM questions q
    LEFT JOIN admin_users au ON q.reviewed_by = au.id
)
SELECT
    qg.*,
    (SELECT COUNT(*) FROM question_groups qg2 WHERE qg2.root_question_id = qg.root_question_id) AS total_versions,
    (SELECT MAX(version) FROM question_groups qg3 WHERE qg3.root_question_id = qg.root_question_id) AS latest_version
FROM question_groups qg
ORDER BY qg.root_question_id, qg.version DESC;

COMMENT ON VIEW question_versions_view IS 'Vista de todas las versiones de preguntas agrupadas por pregunta original';

-- ============================================================================
-- PARTE 5: VISTA DE PREGUNTAS PENDIENTES DE REVISIÓN
-- ============================================================================

CREATE OR REPLACE VIEW questions_pending_review AS
SELECT
    q.id,
    q.question_text,
    q.options,
    q.explanation,
    q.tema,
    q.materia,
    q.difficulty,
    q.version,
    q.validation_status,
    q.created_at,
    q.original_text,
    q.reformulated_by,
    q.needs_refresh,
    q.refresh_reason,
    COALESCE(q.original_question_id, q.id) AS root_question_id
FROM questions q
WHERE q.is_current_version = true
  AND (q.validation_status = 'human_pending' OR q.needs_refresh = true)
ORDER BY q.created_at ASC;

COMMENT ON VIEW questions_pending_review IS 'Preguntas que necesitan revisión humana o reformulación';

-- ============================================================================
-- PARTE 6: FUNCIÓN PARA CREAR NUEVA VERSIÓN DE PREGUNTA
-- ============================================================================

CREATE OR REPLACE FUNCTION create_question_version(
    p_question_id UUID,
    p_new_text TEXT,
    p_new_options JSONB,
    p_new_explanation TEXT DEFAULT NULL,
    p_reformulated_by TEXT DEFAULT 'manual',
    p_admin_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_original_question RECORD;
    v_root_id UUID;
    v_new_version INTEGER;
    v_new_id UUID;
BEGIN
    -- Obtener la pregunta actual
    SELECT * INTO v_original_question
    FROM questions
    WHERE id = p_question_id AND is_current_version = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Pregunta no encontrada o no es la versión actual: %', p_question_id;
    END IF;

    -- Determinar el root_id (original_question_id o el id actual si es la original)
    v_root_id := COALESCE(v_original_question.original_question_id, p_question_id);

    -- Calcular nueva versión
    SELECT COALESCE(MAX(version), 0) + 1 INTO v_new_version
    FROM questions
    WHERE id = v_root_id OR original_question_id = v_root_id;

    -- Marcar versión actual como no actual
    UPDATE questions
    SET is_current_version = false,
        updated_at = NOW()
    WHERE id = p_question_id;

    -- Crear nueva versión
    INSERT INTO questions (
        question_text,
        options,
        explanation,
        legal_reference,
        tema,
        subtema,
        materia,
        cuerpos,
        difficulty,
        source,
        source_year,
        source_exam_name,
        validation_status,
        is_active,
        is_premium,
        tier,
        original_question_id,
        version,
        is_current_version,
        original_text,
        reformulated_by,
        reviewed_by,
        needs_refresh
    )
    VALUES (
        p_new_text,
        p_new_options,
        COALESCE(p_new_explanation, v_original_question.explanation),
        v_original_question.legal_reference,
        v_original_question.tema,
        v_original_question.subtema,
        v_original_question.materia,
        v_original_question.cuerpos,
        v_original_question.difficulty,
        v_original_question.source,
        v_original_question.source_year,
        v_original_question.source_exam_name,
        'human_pending', -- Nueva versión siempre pending
        true,
        v_original_question.is_premium,
        v_original_question.tier,
        v_root_id,
        v_new_version,
        true,
        v_original_question.question_text, -- Guardar texto anterior como original
        p_reformulated_by,
        p_admin_id,
        false
    )
    RETURNING id INTO v_new_id;

    RETURN v_new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION create_question_version IS 'Crea una nueva versión de una pregunta existente';

-- ============================================================================
-- PARTE 7: FUNCIÓN PARA APROBAR/RECHAZAR PREGUNTA
-- ============================================================================

CREATE OR REPLACE FUNCTION review_question(
    p_question_id UUID,
    p_admin_id UUID,
    p_status TEXT, -- 'human_approved' o 'rejected'
    p_comment TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_admin_role TEXT;
BEGIN
    -- Verificar que el admin existe y está activo
    SELECT role INTO v_admin_role
    FROM admin_users
    WHERE id = p_admin_id AND is_active = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Admin no encontrado o inactivo: %', p_admin_id;
    END IF;

    -- Verificar status válido
    IF p_status NOT IN ('human_approved', 'rejected', 'human_pending') THEN
        RAISE EXCEPTION 'Status inválido: %. Use human_approved, rejected, o human_pending', p_status;
    END IF;

    -- Actualizar la pregunta
    UPDATE questions
    SET
        validation_status = p_status::validation_status,
        reviewed_by = p_admin_id,
        reviewed_at = NOW(),
        review_comment = p_comment,
        needs_refresh = CASE WHEN p_status = 'rejected' THEN true ELSE false END,
        refresh_reason = CASE WHEN p_status = 'rejected' THEN p_comment ELSE NULL END,
        updated_at = NOW()
    WHERE id = p_question_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Pregunta no encontrada: %', p_question_id;
    END IF;

    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION review_question IS 'Permite a un admin/reviewer aprobar o rechazar una pregunta';

-- ============================================================================
-- PARTE 8: FUNCIÓN PARA VERIFICAR LOGIN DE ADMIN
-- ============================================================================

CREATE OR REPLACE FUNCTION verify_admin_login(
    p_email TEXT,
    p_pin TEXT
)
RETURNS TABLE (
    id UUID,
    email TEXT,
    role TEXT,
    name TEXT,
    is_valid BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        au.id,
        au.email,
        au.role,
        au.name,
        true AS is_valid
    FROM admin_users au
    WHERE au.email = p_email
      AND au.pin_code = p_pin
      AND au.is_active = true;

    -- Si encontró el usuario, actualizar last_login
    IF FOUND THEN
        UPDATE admin_users
        SET last_login_at = NOW()
        WHERE admin_users.email = p_email;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION verify_admin_login IS 'Verifica credenciales de admin y actualiza último login';

-- ============================================================================
-- PARTE 9: FUNCIÓN PARA MARCAR PREGUNTA PARA REFRESH
-- ============================================================================

CREATE OR REPLACE FUNCTION mark_question_for_refresh(
    p_question_id UUID,
    p_reason TEXT,
    p_admin_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE questions
    SET
        needs_refresh = true,
        refresh_reason = p_reason,
        reviewed_by = p_admin_id,
        reviewed_at = NOW(),
        updated_at = NOW()
    WHERE id = p_question_id AND is_current_version = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Pregunta no encontrada o no es versión actual: %', p_question_id;
    END IF;

    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION mark_question_for_refresh IS 'Marca una pregunta para ser reformulada';

-- ============================================================================
-- PARTE 10: RLS POLICIES
-- ============================================================================

-- Habilitar RLS en admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Cualquiera puede verificar credenciales (a través de la función)
-- pero no leer la tabla directamente
CREATE POLICY "admin_users_no_direct_access"
    ON admin_users
    FOR SELECT
    USING (false); -- Nadie puede leer directamente, solo via funciones SECURITY DEFINER

-- Policy alternativa si quieres permitir lectura a admins autenticados
-- CREATE POLICY "admin_users_self_read"
--     ON admin_users
--     FOR SELECT
--     USING (
--         EXISTS (
--             SELECT 1 FROM admin_users au
--             WHERE au.id = auth.uid() AND au.is_active = true
--         )
--     );

-- Actualizar policies de questions para permitir acceso a admins
-- Primero eliminar policies conflictivas si existen
DROP POLICY IF EXISTS "Questions: Admin full access" ON questions;
DROP POLICY IF EXISTS "Questions: Reviewer can update status" ON questions;

-- Policy: Admins tienen acceso total a questions
CREATE POLICY "Questions: Admin full access"
    ON questions
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.email = current_setting('request.jwt.claims', true)::json->>'email'
              AND admin_users.role = 'admin'
              AND admin_users.is_active = true
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.email = current_setting('request.jwt.claims', true)::json->>'email'
              AND admin_users.role = 'admin'
              AND admin_users.is_active = true
        )
    );

-- Policy: Reviewers pueden actualizar campos de revisión
CREATE POLICY "Questions: Reviewer can update review fields"
    ON questions
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.email = current_setting('request.jwt.claims', true)::json->>'email'
              AND admin_users.role IN ('admin', 'reviewer')
              AND admin_users.is_active = true
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.email = current_setting('request.jwt.claims', true)::json->>'email'
              AND admin_users.role IN ('admin', 'reviewer')
              AND admin_users.is_active = true
        )
    );

-- ============================================================================
-- PARTE 11: ESTADÍSTICAS DE REVISIÓN
-- ============================================================================

CREATE OR REPLACE VIEW admin_review_stats AS
SELECT
    au.id AS admin_id,
    au.name AS admin_name,
    au.role,
    COUNT(q.id) AS total_reviewed,
    COUNT(q.id) FILTER (WHERE q.validation_status = 'human_approved') AS approved_count,
    COUNT(q.id) FILTER (WHERE q.validation_status = 'rejected') AS rejected_count,
    MAX(q.reviewed_at) AS last_review_at
FROM admin_users au
LEFT JOIN questions q ON q.reviewed_by = au.id
WHERE au.is_active = true
GROUP BY au.id, au.name, au.role
ORDER BY total_reviewed DESC;

COMMENT ON VIEW admin_review_stats IS 'Estadísticas de revisión por admin/reviewer';

-- ============================================================================
-- PARTE 12: RESUMEN DE PREGUNTAS POR STATUS
-- ============================================================================

CREATE OR REPLACE VIEW questions_status_summary AS
SELECT
    validation_status,
    COUNT(*) AS count,
    COUNT(*) FILTER (WHERE is_current_version = true) AS current_version_count,
    COUNT(*) FILTER (WHERE needs_refresh = true) AS needs_refresh_count
FROM questions
WHERE is_active = true
GROUP BY validation_status
ORDER BY count DESC;

COMMENT ON VIEW questions_status_summary IS 'Resumen de preguntas por estado de validación';

-- ============================================================================
-- FIN DE LA MIGRACIÓN 003
-- ============================================================================
