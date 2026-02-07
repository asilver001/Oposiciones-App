-- ============================================================================
-- MIGRATION 011: Security Fixes, Missing Indices, and Storage Bucket
-- ============================================================================
-- Based on comprehensive security audit of all public tables.
-- Fixes:
--   1. Remove duplicate/conflicting RLS policies
--   2. Add WITH CHECK constraints on INSERT policies missing user_id checks
--   3. Tighten overly permissive write policies on insight tables
--   4. Add missing increment_question_shown RPC function
--   5. Add missing performance indices for newer tables
--   6. Create storage bucket for reference materials
-- ============================================================================

-- ============================================================================
-- PART 1: Fix Duplicate/Conflicting RLS Policies
-- ============================================================================

-- admin_users: Remove the old "deny all" policy that conflicts with the admin view policy
DROP POLICY IF EXISTS "admin_users_no_direct_access" ON admin_users;

-- question_reports: Remove duplicate policies from migration 006 (superseded by 008)
DROP POLICY IF EXISTS "Admins can update reports" ON question_reports;
DROP POLICY IF EXISTS "Admins can view all reports" ON question_reports;
DROP POLICY IF EXISTS "Users can create reports" ON question_reports;
DROP POLICY IF EXISTS "Users can view own reports" ON question_reports;

-- study_history: Remove duplicate policies from migration 002 (superseded by 008)
DROP POLICY IF EXISTS "Users can insert own history" ON study_history;
DROP POLICY IF EXISTS "Users can update own history" ON study_history;
DROP POLICY IF EXISTS "Users can view own history" ON study_history;

-- user_question_progress: Remove duplicate policies from migration 002 (superseded by 001)
DROP POLICY IF EXISTS "Users can view own progress" ON user_question_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_question_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_question_progress;

-- user_badges: Remove duplicate policies
DROP POLICY IF EXISTS "Users can insert own badges" ON user_badges;
DROP POLICY IF EXISTS "Users can view own badges" ON user_badges;

-- badges: Remove overly-permissive "Anyone can view badges" (keep the authenticated-only one)
DROP POLICY IF EXISTS "Anyone can view badges" ON badges;
-- Also remove the old ones and replace with a single clean policy
DROP POLICY IF EXISTS "Badges: Authenticated users can view badges" ON badges;
DROP POLICY IF EXISTS "Badges: Authenticated users can view active badges" ON badges;
CREATE POLICY "Badges: Authenticated users can view badges"
    ON badges FOR SELECT
    TO authenticated
    USING (true);

-- blocks: Remove duplicate read policies (keep one)
DROP POLICY IF EXISTS "Allow all users to read blocks" ON blocks;
DROP POLICY IF EXISTS "Allow public read access on blocks" ON blocks;
-- Keep blocks_read_all

-- subtopics: Remove duplicate read policies (keep one)
DROP POLICY IF EXISTS "Allow all users to read subtopics" ON subtopics;
DROP POLICY IF EXISTS "Allow public read access on subtopics" ON subtopics;
-- Keep subtopics_read_all

-- topics: Remove duplicate read policies (keep one)
DROP POLICY IF EXISTS "Allow all users to read topics" ON topics;
DROP POLICY IF EXISTS "Allow public read access on topics" ON topics;
-- Keep "Anyone can view topics"

-- waitlist: Remove duplicate insert policy
DROP POLICY IF EXISTS "Waitlist: Anyone can sign up" ON waitlist;
-- Keep "Enable insert for all"

-- materias: Remove old admin policy that uses JWT claims (superseded by is_admin())
DROP POLICY IF EXISTS "Materias: Admin full access" ON materias;
-- Keep "Materias: Admins can modify" which uses is_admin()

-- ============================================================================
-- PART 2: Fix INSERT Policies Missing user_id WITH CHECK
-- ============================================================================

-- retention_history: Add user_id check on INSERT
DROP POLICY IF EXISTS "Users can insert own retention" ON retention_history;
CREATE POLICY "Users can insert own retention"
    ON retention_history FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- test_answers: Add session ownership check on INSERT (no user_id column; check via session)
DROP POLICY IF EXISTS "Users can insert own test answers" ON test_answers;
CREATE POLICY "Users can insert own test answers"
    ON test_answers FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM test_sessions ts
            WHERE ts.id = session_id
            AND ts.user_id = auth.uid()
        )
    );

-- test_sessions: Add user_id check on INSERT
DROP POLICY IF EXISTS "Users can insert own test sessions" ON test_sessions;
CREATE POLICY "Users can insert own test sessions"
    ON test_sessions FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- test_sessions: Add UPDATE policy so users can update own sessions (mark as completed)
DROP POLICY IF EXISTS "Users can update own test sessions" ON test_sessions;
CREATE POLICY "Users can update own test sessions"
    ON test_sessions FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- user_stats: Add user_id check on INSERT
DROP POLICY IF EXISTS "Users can insert own stats" ON user_stats;
CREATE POLICY "Users can insert own stats"
    ON user_stats FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- admin_login_attempts: Restrict INSERT to require authenticated context
-- (keep existing policy for anon login attempt logging)

-- ============================================================================
-- PART 3: Tighten Overly Permissive Write Policies
-- ============================================================================

-- insight_templates: Only admins should be able to write
DROP POLICY IF EXISTS "insight_templates_write" ON insight_templates;
CREATE POLICY "insight_templates_admin_write"
    ON insight_templates FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- insight_question_links: Only admins should be able to write
DROP POLICY IF EXISTS "insight_links_write" ON insight_question_links;
CREATE POLICY "insight_links_admin_write"
    ON insight_question_links FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- ============================================================================
-- PART 4: Add Missing RPC Function (increment_question_shown)
-- ============================================================================

-- questionsService.js calls this but it doesn't exist
CREATE OR REPLACE FUNCTION increment_question_shown(question_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE questions
    SET times_shown = COALESCE(times_shown, 0) + 1,
        last_shown_at = NOW(),
        updated_at = NOW()
    WHERE id = question_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION increment_question_shown(UUID) TO authenticated;

COMMENT ON FUNCTION increment_question_shown IS 'Increments the times_shown counter for a question (used by questionsService)';

-- ============================================================================
-- PART 5: Add Missing Performance Indices
-- ============================================================================

-- questions: composite index for tema + is_active (most common filter)
CREATE INDEX IF NOT EXISTS idx_questions_tema_active
    ON questions (tema, is_active)
    WHERE is_active = true;

-- questions: index for topic_id + is_active (feature-based architecture)
CREATE INDEX IF NOT EXISTS idx_questions_topic_active
    ON questions (topic_id, is_active)
    WHERE is_active = true;

-- questions: index for subtopic_id + is_active
CREATE INDEX IF NOT EXISTS idx_questions_subtopic_active
    ON questions (subtopic_id, is_active)
    WHERE is_active = true;

-- daily_goals: index for user_id + goal_date (most common query)
CREATE INDEX IF NOT EXISTS idx_daily_goals_user_completed
    ON daily_goals (user_id, is_completed)
    WHERE is_completed = false;

-- topic_progress: composite index for user + last studied
CREATE INDEX IF NOT EXISTS idx_topic_progress_user_studied
    ON topic_progress (user_id, last_studied_at DESC);

-- session_stats: index for user_id + tema
CREATE INDEX IF NOT EXISTS idx_session_stats_user_tema
    ON session_stats (user_id, tema_id);

-- retention_history: index for user + date (common query for charts)
CREATE INDEX IF NOT EXISTS idx_retention_user_recent
    ON retention_history (user_id, record_date DESC);

-- user_triggered_insights: index for unread insights
CREATE INDEX IF NOT EXISTS idx_user_insights_unread
    ON user_triggered_insights (user_id, visto)
    WHERE visto = false;

-- ============================================================================
-- PART 6: Create Storage Bucket for Reference Materials
-- ============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'reference_materials',
    'reference_materials',
    false,
    52428800, -- 50MB limit
    ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- RLS policy: Only admins can access reference materials
-- Drop if exists first to be idempotent
DO $$
BEGIN
    DROP POLICY IF EXISTS "Admin access to reference materials" ON storage.objects;
EXCEPTION WHEN undefined_table THEN
    NULL;
END $$;

CREATE POLICY "Admin access to reference materials"
    ON storage.objects
    FOR ALL
    USING (
        bucket_id = 'reference_materials'
        AND is_admin()
    )
    WITH CHECK (
        bucket_id = 'reference_materials'
        AND is_admin()
    );

-- ============================================================================
-- PART 7: Verify All Tables Have RLS (safety check)
-- ============================================================================

-- These should already be enabled, but ensure they are
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE insight_question_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE insight_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE retention_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtopics ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_triggered_insights ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- END OF MIGRATION 011
-- ============================================================================

COMMENT ON SCHEMA public IS 'Security audit fixes applied: duplicate policies removed, INSERT policies tightened, storage bucket created';
