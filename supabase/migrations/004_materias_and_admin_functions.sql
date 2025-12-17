-- ============================================================================
-- OPOSITA SMART - Migración 004: Tabla Materias y Funciones Admin
-- ============================================================================

-- ============================================================================
-- PARTE 1: FUNCIÓN PARA LEER ADMIN_USERS (soluciona bug RLS)
-- ============================================================================

-- Función para obtener lista de admins (bypassea RLS)
CREATE OR REPLACE FUNCTION get_admin_users()
RETURNS TABLE (
    id UUID,
    email TEXT,
    role TEXT,
    name TEXT,
    is_active BOOLEAN,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        au.id,
        au.email,
        au.role,
        au.name,
        au.is_active,
        au.last_login_at,
        au.created_at
    FROM admin_users au
    WHERE au.is_active = true
    ORDER BY au.role, au.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_admin_users IS 'Obtiene lista de administradores activos (bypassea RLS)';

-- ============================================================================
-- PARTE 2: TABLA MATERIAS
-- ============================================================================

CREATE TABLE IF NOT EXISTS materias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tema_numero DECIMAL(4,1) NOT NULL, -- permite 8.1, 8.2, etc
    codigo TEXT UNIQUE NOT NULL, -- 'tribunal_constitucional'
    nombre TEXT NOT NULL, -- 'Tribunal Constitucional'
    descripcion TEXT,
    bloque TEXT CHECK (bloque IN ('I', 'II', 'III', 'IV')), -- Bloque del temario
    orden INTEGER DEFAULT 0, -- para ordenar en UI
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para materias
CREATE INDEX IF NOT EXISTS idx_materias_tema ON materias(tema_numero);
CREATE INDEX IF NOT EXISTS idx_materias_bloque ON materias(bloque);
CREATE INDEX IF NOT EXISTS idx_materias_active ON materias(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_materias_codigo ON materias(codigo);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_materias_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_materias_updated_at ON materias;
CREATE TRIGGER update_materias_updated_at
    BEFORE UPDATE ON materias
    FOR EACH ROW
    EXECUTE FUNCTION update_materias_updated_at();

COMMENT ON TABLE materias IS 'Catálogo de materias/temas del temario de oposiciones';
COMMENT ON COLUMN materias.tema_numero IS 'Número del tema (puede ser decimal: 8.1, 8.2)';
COMMENT ON COLUMN materias.codigo IS 'Código único para referencia interna';
COMMENT ON COLUMN materias.bloque IS 'Bloque del temario: I, II, III, IV';

-- ============================================================================
-- PARTE 3: INSERTAR MATERIAS INICIALES (Auxiliar AGE)
-- ============================================================================

INSERT INTO materias (tema_numero, codigo, nombre, descripcion, bloque, orden) VALUES
-- Bloque I: Organización del Estado
(1, 'constitucion_principios', 'La Constitución Española de 1978', 'Características, estructura y principios generales', 'I', 1),
(2, 'derechos_deberes', 'Derechos y Deberes Fundamentales', 'Derechos fundamentales y libertades públicas', 'I', 2),
(3, 'tribunal_constitucional', 'El Tribunal Constitucional', 'Composición, organización y funciones', 'I', 3),
(4, 'la_corona', 'La Corona', 'Funciones constitucionales del Rey', 'I', 4),
(5, 'cortes_generales', 'Las Cortes Generales', 'Congreso y Senado, composición y funciones', 'I', 5),
(6, 'gobierno', 'El Gobierno', 'Composición, funciones y Administración', 'I', 6),
(7, 'poder_judicial', 'El Poder Judicial', 'Principios constitucionales y organización', 'I', 7),
(8.1, 'age_central', 'AGE - Organización Central', 'Ministerios, Secretarías de Estado, órganos centrales', 'I', 8),
(8.2, 'age_periferica', 'AGE - Organización Periférica', 'Delegados y Subdelegados del Gobierno', 'I', 9),
(9, 'sector_publico', 'El Sector Público Institucional', 'Organismos públicos, empresas y fundaciones', 'I', 10),
(10, 'comunidades_autonomas', 'Comunidades Autónomas', 'Organización y competencias', 'I', 11),
(11, 'administracion_local', 'La Administración Local', 'Municipios, provincias y otros entes locales', 'I', 12),
(12, 'union_europea', 'La Unión Europea', 'Instituciones y derecho comunitario', 'I', 13),

-- Bloque II: Procedimiento Administrativo
(13, 'ley_39_2015', 'Ley 39/2015 del Procedimiento Administrativo', 'Procedimiento administrativo común', 'II', 14),
(14, 'acto_administrativo', 'El Acto Administrativo', 'Concepto, elementos y eficacia', 'II', 15),
(15, 'recursos_administrativos', 'Recursos Administrativos', 'Alzada, reposición y extraordinario de revisión', 'II', 16),
(16, 'ley_40_2015', 'Ley 40/2015 de Régimen Jurídico', 'Régimen jurídico del sector público', 'II', 17),
(17, 'contratos_sector_publico', 'Contratos del Sector Público', 'Tipos, procedimientos y ejecución', 'II', 18),
(18, 'responsabilidad_patrimonial', 'Responsabilidad Patrimonial', 'Responsabilidad de las Administraciones', 'II', 19),

-- Bloque III: Función Pública
(19, 'ebep', 'Estatuto Básico del Empleado Público', 'TREBEP: clases de personal y derechos', 'III', 20),
(20, 'adquisicion_perdida', 'Adquisición y Pérdida Condición Funcionario', 'Selección, provisión y situaciones administrativas', 'III', 21),
(21, 'derechos_funcionarios', 'Derechos de los Funcionarios', 'Retribuciones, permisos y vacaciones', 'III', 22),
(22, 'deberes_funcionarios', 'Deberes de los Funcionarios', 'Código de conducta y régimen disciplinario', 'III', 23),
(23, 'igualdad_genero', 'Igualdad de Género', 'Ley de Igualdad y políticas de igualdad', 'III', 24),
(24, 'prevencion_riesgos', 'Prevención de Riesgos Laborales', 'Ley 31/1995 y adaptación a la AGE', 'III', 25),

-- Bloque IV: Informática y Administración Electrónica
(25, 'informatica_basica', 'Informática Básica', 'Hardware, software y redes', 'IV', 26),
(26, 'sistemas_operativos', 'Sistemas Operativos', 'Windows y conceptos básicos', 'IV', 27),
(27, 'ofimatica', 'Ofimática', 'Word, Excel, correo electrónico', 'IV', 28),
(28, 'admin_electronica', 'Administración Electrónica', 'Sede electrónica, firma y notificaciones', 'IV', 29),
(29, 'proteccion_datos', 'Protección de Datos', 'RGPD y LOPDGDD', 'IV', 30)
ON CONFLICT (codigo) DO UPDATE SET
    tema_numero = EXCLUDED.tema_numero,
    nombre = EXCLUDED.nombre,
    descripcion = EXCLUDED.descripcion,
    bloque = EXCLUDED.bloque,
    orden = EXCLUDED.orden;

-- ============================================================================
-- PARTE 4: RLS PARA MATERIAS
-- ============================================================================

ALTER TABLE materias ENABLE ROW LEVEL SECURITY;

-- Todos pueden leer materias activas
CREATE POLICY "Materias: Public read access"
    ON materias FOR SELECT
    USING (is_active = true);

-- Solo admins pueden modificar
CREATE POLICY "Materias: Admin full access"
    ON materias FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.email = current_setting('request.jwt.claims', true)::json->>'email'
              AND admin_users.role = 'admin'
              AND admin_users.is_active = true
        )
    );

-- ============================================================================
-- PARTE 5: FUNCIONES PARA ESTADÍSTICAS DE MATERIAS
-- ============================================================================

-- Función para obtener estadísticas por tema
CREATE OR REPLACE FUNCTION get_questions_stats_by_tema()
RETURNS TABLE (
    tema INTEGER,
    total_questions BIGINT,
    approved_questions BIGINT,
    pending_questions BIGINT,
    rejected_questions BIGINT,
    needs_refresh BIGINT,
    approval_rate DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        q.tema,
        COUNT(*)::BIGINT AS total_questions,
        COUNT(*) FILTER (WHERE q.validation_status = 'human_approved')::BIGINT AS approved_questions,
        COUNT(*) FILTER (WHERE q.validation_status = 'human_pending')::BIGINT AS pending_questions,
        COUNT(*) FILTER (WHERE q.validation_status = 'rejected')::BIGINT AS rejected_questions,
        COUNT(*) FILTER (WHERE q.needs_refresh = true)::BIGINT AS needs_refresh,
        CASE
            WHEN COUNT(*) > 0 THEN ROUND(COUNT(*) FILTER (WHERE q.validation_status = 'human_approved')::DECIMAL / COUNT(*) * 100, 1)
            ELSE 0
        END AS approval_rate
    FROM questions q
    WHERE q.is_active = true
      AND q.is_current_version = true
      AND q.tema IS NOT NULL
    GROUP BY q.tema
    ORDER BY q.tema;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener preguntas candidatas a refresh (más vistas)
CREATE OR REPLACE FUNCTION get_refresh_candidates(p_min_views INTEGER DEFAULT 100, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
    id UUID,
    question_text TEXT,
    tema INTEGER,
    times_shown INTEGER,
    validation_status validation_status,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        q.id,
        q.question_text,
        q.tema,
        q.times_shown,
        q.validation_status,
        q.created_at
    FROM questions q
    WHERE q.is_active = true
      AND q.is_current_version = true
      AND q.times_shown >= p_min_views
      AND q.needs_refresh = false
    ORDER BY q.times_shown DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener materias con estadísticas
CREATE OR REPLACE FUNCTION get_materias_with_stats()
RETURNS TABLE (
    id UUID,
    tema_numero DECIMAL,
    codigo TEXT,
    nombre TEXT,
    descripcion TEXT,
    bloque TEXT,
    orden INTEGER,
    total_questions BIGINT,
    approved_questions BIGINT,
    pending_questions BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        m.id,
        m.tema_numero,
        m.codigo,
        m.nombre,
        m.descripcion,
        m.bloque,
        m.orden,
        COALESCE(COUNT(q.id), 0)::BIGINT AS total_questions,
        COALESCE(COUNT(q.id) FILTER (WHERE q.validation_status = 'human_approved'), 0)::BIGINT AS approved_questions,
        COALESCE(COUNT(q.id) FILTER (WHERE q.validation_status = 'human_pending'), 0)::BIGINT AS pending_questions
    FROM materias m
    LEFT JOIN questions q ON q.tema = FLOOR(m.tema_numero)::INTEGER
        AND q.is_active = true
        AND q.is_current_version = true
    WHERE m.is_active = true
    GROUP BY m.id, m.tema_numero, m.codigo, m.nombre, m.descripcion, m.bloque, m.orden
    ORDER BY m.orden, m.tema_numero;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PARTE 6: FUNCIONES CRUD PARA MATERIAS
-- ============================================================================

-- Crear materia
CREATE OR REPLACE FUNCTION create_materia(
    p_tema_numero DECIMAL,
    p_codigo TEXT,
    p_nombre TEXT,
    p_descripcion TEXT DEFAULT NULL,
    p_bloque TEXT DEFAULT NULL,
    p_orden INTEGER DEFAULT 0
)
RETURNS UUID AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO materias (tema_numero, codigo, nombre, descripcion, bloque, orden)
    VALUES (p_tema_numero, p_codigo, p_nombre, p_descripcion, p_bloque, p_orden)
    RETURNING id INTO v_id;

    RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Actualizar materia
CREATE OR REPLACE FUNCTION update_materia(
    p_id UUID,
    p_tema_numero DECIMAL,
    p_codigo TEXT,
    p_nombre TEXT,
    p_descripcion TEXT DEFAULT NULL,
    p_bloque TEXT DEFAULT NULL,
    p_orden INTEGER DEFAULT 0
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE materias
    SET
        tema_numero = p_tema_numero,
        codigo = p_codigo,
        nombre = p_nombre,
        descripcion = p_descripcion,
        bloque = p_bloque,
        orden = p_orden,
        updated_at = NOW()
    WHERE id = p_id;

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar materia (soft delete)
CREATE OR REPLACE FUNCTION delete_materia(p_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE materias
    SET is_active = false, updated_at = NOW()
    WHERE id = p_id;

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PARTE 7: FUNCIÓN PARA OBTENER PREGUNTAS CON PAGINACIÓN
-- ============================================================================

CREATE OR REPLACE FUNCTION get_questions_paginated(
    p_page INTEGER DEFAULT 1,
    p_per_page INTEGER DEFAULT 20,
    p_tema INTEGER DEFAULT NULL,
    p_status TEXT DEFAULT NULL,
    p_tier TEXT DEFAULT NULL,
    p_search TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    question_text TEXT,
    options JSONB,
    explanation TEXT,
    tema INTEGER,
    validation_status validation_status,
    tier TEXT,
    times_shown INTEGER,
    version INTEGER,
    is_current_version BOOLEAN,
    original_text TEXT,
    created_at TIMESTAMPTZ,
    total_count BIGINT
) AS $$
DECLARE
    v_offset INTEGER;
    v_total BIGINT;
BEGIN
    v_offset := (p_page - 1) * p_per_page;

    -- Get total count
    SELECT COUNT(*) INTO v_total
    FROM questions q
    WHERE q.is_active = true
      AND q.is_current_version = true
      AND (p_tema IS NULL OR q.tema = p_tema)
      AND (p_status IS NULL OR q.validation_status::TEXT = p_status)
      AND (p_tier IS NULL OR q.tier = p_tier)
      AND (p_search IS NULL OR q.question_text ILIKE '%' || p_search || '%');

    RETURN QUERY
    SELECT
        q.id,
        q.question_text,
        q.options,
        q.explanation,
        q.tema,
        q.validation_status,
        q.tier,
        q.times_shown,
        q.version,
        q.is_current_version,
        q.original_text,
        q.created_at,
        v_total AS total_count
    FROM questions q
    WHERE q.is_active = true
      AND q.is_current_version = true
      AND (p_tema IS NULL OR q.tema = p_tema)
      AND (p_status IS NULL OR q.validation_status::TEXT = p_status)
      AND (p_tier IS NULL OR q.tier = p_tier)
      AND (p_search IS NULL OR q.question_text ILIKE '%' || p_search || '%')
    ORDER BY q.created_at DESC
    LIMIT p_per_page
    OFFSET v_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PARTE 8: FUNCIÓN PARA OBTENER HISTORIAL DE VERSIONES
-- ============================================================================

CREATE OR REPLACE FUNCTION get_question_versions(p_question_id UUID)
RETURNS TABLE (
    id UUID,
    question_text TEXT,
    options JSONB,
    explanation TEXT,
    version INTEGER,
    is_current_version BOOLEAN,
    validation_status validation_status,
    reformulated_by TEXT,
    reviewed_by UUID,
    reviewer_name TEXT,
    reviewed_at TIMESTAMPTZ,
    review_comment TEXT,
    created_at TIMESTAMPTZ
) AS $$
DECLARE
    v_root_id UUID;
BEGIN
    -- Find root question id
    SELECT COALESCE(q.original_question_id, q.id) INTO v_root_id
    FROM questions q
    WHERE q.id = p_question_id;

    RETURN QUERY
    SELECT
        q.id,
        q.question_text,
        q.options,
        q.explanation,
        q.version,
        q.is_current_version,
        q.validation_status,
        q.reformulated_by,
        q.reviewed_by,
        au.name AS reviewer_name,
        q.reviewed_at,
        q.review_comment,
        q.created_at
    FROM questions q
    LEFT JOIN admin_users au ON q.reviewed_by = au.id
    WHERE q.id = v_root_id OR q.original_question_id = v_root_id
    ORDER BY q.version DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PARTE 9: FUNCIÓN PARA ACTUALIZAR PREGUNTA
-- ============================================================================

CREATE OR REPLACE FUNCTION update_question(
    p_question_id UUID,
    p_question_text TEXT DEFAULT NULL,
    p_options JSONB DEFAULT NULL,
    p_explanation TEXT DEFAULT NULL,
    p_tema INTEGER DEFAULT NULL,
    p_tier TEXT DEFAULT NULL,
    p_validation_status TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE questions
    SET
        question_text = COALESCE(p_question_text, question_text),
        options = COALESCE(p_options, options),
        explanation = COALESCE(p_explanation, explanation),
        tema = COALESCE(p_tema, tema),
        tier = COALESCE(p_tier, tier),
        validation_status = COALESCE(p_validation_status::validation_status, validation_status),
        updated_at = NOW()
    WHERE id = p_question_id;

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FIN DE LA MIGRACIÓN 004
-- ============================================================================
