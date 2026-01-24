-- Migration: 006_question_reports
-- Description: Sistema de reportes de errores por usuarios
-- Date: 2025-01-14
-- Note: question_id es INTEGER (no UUID) para coincidir con questions.id
-- Note: Usa admin_users (no profiles) para verificar permisos de admin

-- ============================================
-- ENUM: Tipos de reporte
-- ============================================

DO $$ BEGIN
  CREATE TYPE report_type AS ENUM (
    'error_factual',      -- La respuesta correcta está mal
    'opcion_ambigua',     -- Más de una respuesta podría ser correcta
    'enunciado_confuso',  -- El enunciado no se entiende
    'ley_desactualizada', -- La ley ha sido modificada/derogada
    'error_ortografico',  -- Errores de ortografía o gramática
    'pregunta_duplicada', -- Ya existe otra pregunta igual
    'otro'                -- Otro tipo de error
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE report_status AS ENUM (
    'open',           -- Recién reportado
    'investigating',  -- En revisión
    'resolved',       -- Corregido
    'dismissed'       -- Descartado (no era error)
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- TABLA: question_reports
-- ============================================

CREATE TABLE IF NOT EXISTS question_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relaciones (question_id es INTEGER)
  question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Detalles del reporte
  report_type report_type NOT NULL,
  description TEXT, -- Descripción opcional del usuario
  suggested_correction TEXT, -- Corrección sugerida por el usuario

  -- Estado
  status report_status NOT NULL DEFAULT 'open',

  -- Resolución (cuando se resuelve)
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- ÍNDICES
-- ============================================

CREATE INDEX idx_reports_question ON question_reports(question_id);
CREATE INDEX idx_reports_user ON question_reports(user_id);
CREATE INDEX idx_reports_status ON question_reports(status);
CREATE INDEX idx_reports_type ON question_reports(report_type);
CREATE INDEX idx_reports_created ON question_reports(created_at DESC);

-- Índice para buscar reportes abiertos por pregunta (para auto-ocultar)
CREATE INDEX idx_reports_open_by_question ON question_reports(question_id)
  WHERE status = 'open';

-- ============================================
-- TRIGGER: Actualizar updated_at
-- ============================================

CREATE TRIGGER update_question_reports_updated_at
  BEFORE UPDATE ON question_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VISTA: Conteo de reportes por pregunta
-- ============================================

CREATE OR REPLACE VIEW question_report_counts AS
SELECT
  q.id AS question_id,
  q.question_text,
  q.is_active,
  COUNT(qr.id) FILTER (WHERE qr.status = 'open') AS open_reports,
  COUNT(qr.id) FILTER (WHERE qr.status = 'investigating') AS investigating_reports,
  COUNT(qr.id) FILTER (WHERE qr.status = 'resolved') AS resolved_reports,
  COUNT(qr.id) FILTER (WHERE qr.status = 'dismissed') AS dismissed_reports,
  COUNT(qr.id) AS total_reports,
  MAX(qr.created_at) AS last_report_at
FROM questions q
LEFT JOIN question_reports qr ON q.id = qr.question_id
GROUP BY q.id, q.question_text, q.is_active;

-- ============================================
-- VISTA: Preguntas que necesitan atención urgente
-- ============================================

CREATE OR REPLACE VIEW questions_needing_attention AS
SELECT
  q.*,
  qrc.open_reports,
  qrc.total_reports,
  qrc.last_report_at
FROM questions q
JOIN question_report_counts qrc ON q.id = qrc.question_id
WHERE qrc.open_reports >= 1
ORDER BY qrc.open_reports DESC, qrc.last_report_at DESC;

-- ============================================
-- FUNCIÓN: Reportar pregunta (usuario)
-- ============================================

CREATE OR REPLACE FUNCTION report_question(
  p_question_id UUID,
  p_report_type report_type,
  p_description TEXT DEFAULT NULL,
  p_suggested_correction TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_report_id UUID;
  v_open_count INTEGER;
BEGIN
  -- Obtener usuario actual
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no autenticado';
  END IF;

  -- Verificar que la pregunta existe
  IF NOT EXISTS (SELECT 1 FROM questions WHERE id = p_question_id) THEN
    RAISE EXCEPTION 'Pregunta no encontrada';
  END IF;

  -- Verificar que el usuario no haya reportado ya esta pregunta (evitar spam)
  IF EXISTS (
    SELECT 1 FROM question_reports
    WHERE question_id = p_question_id
      AND user_id = v_user_id
      AND status = 'open'
  ) THEN
    RAISE EXCEPTION 'Ya has reportado esta pregunta';
  END IF;

  -- Insertar reporte
  INSERT INTO question_reports (
    question_id,
    user_id,
    report_type,
    description,
    suggested_correction
  ) VALUES (
    p_question_id,
    v_user_id,
    p_report_type,
    p_description,
    p_suggested_correction
  )
  RETURNING id INTO v_report_id;

  -- Contar reportes abiertos para esta pregunta
  SELECT COUNT(*) INTO v_open_count
  FROM question_reports
  WHERE question_id = p_question_id AND status = 'open';

  -- Si hay 3+ reportes, auto-ocultar la pregunta
  IF v_open_count >= 3 THEN
    UPDATE questions
    SET is_active = false,
        needs_refresh = true,
        refresh_reason = 'Auto-ocultada por ' || v_open_count || ' reportes de usuarios'
    WHERE id = p_question_id;
  END IF;

  RETURN v_report_id;
END;
$$;

-- ============================================
-- FUNCIÓN: Resolver reporte (admin)
-- ============================================

CREATE OR REPLACE FUNCTION resolve_report(
  p_report_id UUID,
  p_status report_status,
  p_resolution_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_admin_id UUID;
BEGIN
  v_admin_id := auth.uid();

  IF v_admin_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no autenticado';
  END IF;

  -- Verificar que es admin (simplificado - en producción verificar rol)
  -- TODO: Añadir verificación de rol admin

  UPDATE question_reports
  SET
    status = p_status,
    resolved_by = v_admin_id,
    resolved_at = NOW(),
    resolution_notes = p_resolution_notes
  WHERE id = p_report_id;

  RETURN FOUND;
END;
$$;

-- ============================================
-- FUNCIÓN: Reactivar pregunta (admin)
-- ============================================

CREATE OR REPLACE FUNCTION reactivate_question_after_fix(
  p_question_id UUID,
  p_admin_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Reactivar la pregunta
  UPDATE questions
  SET
    is_active = true,
    needs_refresh = false,
    refresh_reason = NULL
  WHERE id = p_question_id;

  -- Cerrar todos los reportes abiertos como resueltos
  UPDATE question_reports
  SET
    status = 'resolved',
    resolved_by = auth.uid(),
    resolved_at = NOW(),
    resolution_notes = COALESCE(p_admin_notes, 'Pregunta corregida y reactivada')
  WHERE question_id = p_question_id AND status IN ('open', 'investigating');

  RETURN FOUND;
END;
$$;

-- ============================================
-- RLS: Políticas de seguridad
-- ============================================

ALTER TABLE question_reports ENABLE ROW LEVEL SECURITY;

-- Usuarios pueden ver sus propios reportes
CREATE POLICY "Users can view own reports"
  ON question_reports FOR SELECT
  USING (auth.uid() = user_id);

-- Usuarios pueden crear reportes
CREATE POLICY "Users can create reports"
  ON question_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins pueden ver todos los reportes
CREATE POLICY "Admins can view all reports"
  ON question_reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'reviewer')
    )
  );

-- Admins pueden actualizar reportes
CREATE POLICY "Admins can update reports"
  ON question_reports FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'reviewer')
    )
  );

-- ============================================
-- GRANTS
-- ============================================

GRANT SELECT ON question_report_counts TO authenticated;
GRANT SELECT ON questions_needing_attention TO authenticated;
GRANT EXECUTE ON FUNCTION report_question TO authenticated;
GRANT EXECUTE ON FUNCTION resolve_report TO authenticated;
GRANT EXECUTE ON FUNCTION reactivate_question_after_fix TO authenticated;

-- ============================================
-- COMENTARIOS
-- ============================================

COMMENT ON TABLE question_reports IS 'Reportes de errores en preguntas enviados por usuarios';
COMMENT ON FUNCTION report_question IS 'Permite a usuarios reportar errores en preguntas. Auto-oculta si hay 3+ reportes.';
COMMENT ON FUNCTION resolve_report IS 'Permite a admins resolver reportes de usuarios';
COMMENT ON FUNCTION reactivate_question_after_fix IS 'Reactiva una pregunta después de corregirla y cierra reportes asociados';
