-- ============================================================================
-- OPOSITA SMART - Migración 005: Función RPC para Importar Preguntas
-- ============================================================================
-- Soluciona el error RLS al importar preguntas desde el Admin Panel

-- ============================================================================
-- FUNCIÓN PARA IMPORTAR UNA PREGUNTA (bypasses RLS)
-- ============================================================================

CREATE OR REPLACE FUNCTION import_question(
    p_question_text TEXT,
    p_options JSONB,
    p_explanation TEXT DEFAULT NULL,
    p_legal_reference TEXT DEFAULT NULL,
    p_tema INTEGER DEFAULT NULL,
    p_materia TEXT DEFAULT 'otras',
    p_difficulty INTEGER DEFAULT 3,
    p_source TEXT DEFAULT 'elaboracion_propia',
    p_source_year INTEGER DEFAULT NULL,
    p_confidence_score DECIMAL DEFAULT 0.8,
    p_tier TEXT DEFAULT 'free',
    p_original_text TEXT DEFAULT NULL,
    p_reformulated_by TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_id UUID;
    v_materia materia_type;
BEGIN
    -- Cast materia to enum (with fallback)
    BEGIN
        v_materia := p_materia::materia_type;
    EXCEPTION WHEN invalid_text_representation THEN
        v_materia := 'otras'::materia_type;
    END;

    INSERT INTO questions (
        question_text,
        options,
        explanation,
        legal_reference,
        tema,
        materia,
        difficulty,
        source,
        source_year,
        confidence_score,
        tier,
        original_text,
        reformulated_by,
        validation_status,
        is_active,
        times_shown,
        times_correct,
        version,
        is_current_version
    ) VALUES (
        p_question_text,
        p_options,
        p_explanation,
        p_legal_reference,
        p_tema,
        v_materia,
        p_difficulty,
        p_source::question_source,
        p_source_year,
        p_confidence_score,
        p_tier,
        p_original_text,
        p_reformulated_by,
        'human_pending'::validation_status,
        true,
        0,
        0,
        1,
        true
    )
    RETURNING id INTO v_id;

    RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION import_question IS 'Importa una pregunta al banco de preguntas (bypasses RLS para admins)';

-- ============================================================================
-- FUNCIÓN PARA IMPORTAR MÚLTIPLES PREGUNTAS EN BATCH
-- ============================================================================

CREATE OR REPLACE FUNCTION import_questions_batch(p_questions JSONB)
RETURNS TABLE (
    index INTEGER,
    id UUID,
    success BOOLEAN,
    error TEXT
) AS $$
DECLARE
    v_question JSONB;
    v_index INTEGER := 0;
    v_id UUID;
    v_materia materia_type;
BEGIN
    FOR v_question IN SELECT * FROM jsonb_array_elements(p_questions)
    LOOP
        BEGIN
            -- Cast materia to enum (with fallback)
            BEGIN
                v_materia := (v_question->>'materia')::materia_type;
            EXCEPTION WHEN invalid_text_representation THEN
                v_materia := 'otras'::materia_type;
            END;

            INSERT INTO questions (
                question_text,
                options,
                explanation,
                legal_reference,
                tema,
                materia,
                difficulty,
                source,
                source_year,
                confidence_score,
                tier,
                original_text,
                reformulated_by,
                validation_status,
                is_active,
                times_shown,
                times_correct,
                version,
                is_current_version
            ) VALUES (
                v_question->>'question_text',
                (v_question->'options')::JSONB,
                v_question->>'explanation',
                v_question->>'legal_reference',
                (v_question->>'tema')::INTEGER,
                v_materia,
                COALESCE((v_question->>'difficulty')::INTEGER, 3),
                COALESCE(v_question->>'source', 'elaboracion_propia')::question_source,
                (v_question->>'source_year')::INTEGER,
                COALESCE((v_question->>'confidence_score')::DECIMAL, 0.8),
                COALESCE(v_question->>'tier', 'free'),
                v_question->>'original_text',
                v_question->>'reformulated_by',
                'human_pending'::validation_status,
                true,
                0,
                0,
                1,
                true
            )
            RETURNING questions.id INTO v_id;

            RETURN QUERY SELECT v_index, v_id, true, NULL::TEXT;

        EXCEPTION WHEN OTHERS THEN
            RETURN QUERY SELECT v_index, NULL::UUID, false, SQLERRM;
        END;

        v_index := v_index + 1;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION import_questions_batch IS 'Importa múltiples preguntas en batch (bypasses RLS)';

-- ============================================================================
-- GRANT EXECUTE A USUARIOS AUTENTICADOS
-- ============================================================================

GRANT EXECUTE ON FUNCTION import_question TO authenticated;
GRANT EXECUTE ON FUNCTION import_questions_batch TO authenticated;

-- ============================================================================
-- FIN DE LA MIGRACIÓN 005
-- ============================================================================
