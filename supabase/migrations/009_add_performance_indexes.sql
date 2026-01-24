-- ============================================================================
-- MIGRATION 009: Add Performance Indexes
-- ============================================================================
-- This migration adds critical indexes for frequently queried columns
-- to improve query performance across the application
-- ============================================================================

-- ============================================================================
-- PART 1: QUESTIONS TABLE INDEXES
-- ============================================================================

-- Composite index for filtering questions by topic and difficulty
-- Used in: question selection for tests, study sessions
CREATE INDEX IF NOT EXISTS idx_questions_topic_difficulty
    ON questions (topic_id, difficulty)
    WHERE is_active = true;

-- Note: topic_id doesn't exist in current schema, it's 'tema'
-- Let's create the correct index for tema + difficulty
DROP INDEX IF EXISTS idx_questions_topic_difficulty;

CREATE INDEX IF NOT EXISTS idx_questions_tema_difficulty
    ON questions (tema, difficulty)
    WHERE is_active = true;

-- Additional useful composite indexes for questions
CREATE INDEX IF NOT EXISTS idx_questions_materia_difficulty
    ON questions (materia, difficulty)
    WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_questions_tema_materia
    ON questions (tema, materia)
    WHERE is_active = true;

-- Index for question validation workflow
CREATE INDEX IF NOT EXISTS idx_questions_validation_confidence
    ON questions (validation_status, confidence_score)
    WHERE is_active = true;

-- Index for premium question filtering
CREATE INDEX IF NOT EXISTS idx_questions_tier_active
    ON questions (tier, is_active)
    WHERE is_active = true;

-- Index for questions ordered by times_shown (used in question selection)
CREATE INDEX IF NOT EXISTS idx_questions_times_shown
    ON questions (times_shown ASC)
    WHERE is_active = true;

-- Index for finding questions by source
CREATE INDEX IF NOT EXISTS idx_questions_source_year
    ON questions (source, source_year)
    WHERE is_active = true;

COMMENT ON INDEX idx_questions_tema_difficulty IS 'Composite index for filtering questions by tema and difficulty';
COMMENT ON INDEX idx_questions_validation_confidence IS 'Index for admin validation workflow';

-- ============================================================================
-- PART 2: USER_QUESTION_PROGRESS TABLE INDEXES
-- ============================================================================

-- Critical composite index for spaced repetition queries
-- Used heavily in: getDueReviews, generateHybridSession
CREATE INDEX IF NOT EXISTS idx_uqp_user_question
    ON user_question_progress (user_id, question_id);

-- Composite index for finding due reviews efficiently
CREATE INDEX IF NOT EXISTS idx_uqp_user_next_review_new
    ON user_question_progress (user_id, next_review)
    WHERE next_review IS NOT NULL;

-- Index for progress state queries
CREATE INDEX IF NOT EXISTS idx_uqp_user_state_review
    ON user_question_progress (user_id, state, next_review);

-- Index for flagged questions
CREATE INDEX IF NOT EXISTS idx_uqp_flagged_user
    ON user_question_progress (user_id, is_flagged)
    WHERE is_flagged = true;

-- Index for favorite questions
CREATE INDEX IF NOT EXISTS idx_uqp_favorite_user
    ON user_question_progress (user_id, is_favorite)
    WHERE is_favorite = true;

-- Index for last review tracking
CREATE INDEX IF NOT EXISTS idx_uqp_last_review
    ON user_question_progress (user_id, last_reviewed)
    WHERE last_reviewed IS NOT NULL;

-- Note: 'last_reviewed' field name from service, check actual column name
-- If it's 'last_review' instead, we need to update
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_question_progress'
        AND column_name = 'last_review'
    ) THEN
        DROP INDEX IF EXISTS idx_uqp_last_review;
        CREATE INDEX idx_uqp_last_review
            ON user_question_progress (user_id, last_review)
            WHERE last_review IS NOT NULL;
    END IF;
END $$;

COMMENT ON INDEX idx_uqp_user_question IS 'Critical index for user progress lookups';
COMMENT ON INDEX idx_uqp_user_next_review_new IS 'Optimizes spaced repetition due date queries';

-- ============================================================================
-- PART 3: STUDY_SESSIONS (TEST_SESSIONS) TABLE INDEXES
-- ============================================================================

-- Composite index for user's recent sessions
CREATE INDEX IF NOT EXISTS idx_test_sessions_user_created
    ON test_sessions (user_id, created_at DESC);

-- Index for completed sessions by user
CREATE INDEX IF NOT EXISTS idx_test_sessions_user_completed_date
    ON test_sessions (user_id, is_completed, completed_at DESC)
    WHERE is_completed = true;

-- Index for session type analysis
CREATE INDEX IF NOT EXISTS idx_test_sessions_type_completed
    ON test_sessions (session_type, is_completed)
    WHERE is_completed = true;

-- Index for finding abandoned sessions
CREATE INDEX IF NOT EXISTS idx_test_sessions_abandoned
    ON test_sessions (user_id, was_abandoned)
    WHERE was_abandoned = true;

-- Composite index for time-based queries
CREATE INDEX IF NOT EXISTS idx_test_sessions_started_at
    ON test_sessions (started_at DESC);

COMMENT ON INDEX idx_test_sessions_user_created IS 'Optimizes user session history queries';
COMMENT ON INDEX idx_test_sessions_user_completed_date IS 'Optimizes completed session lookups';

-- ============================================================================
-- PART 4: STUDY_HISTORY TABLE INDEXES
-- ============================================================================

-- Composite index for user's daily history
CREATE INDEX IF NOT EXISTS idx_study_history_user_date
    ON study_history (user_id, date DESC);

-- Index for streak calculations
CREATE INDEX IF NOT EXISTS idx_study_history_user_date_asc
    ON study_history (user_id, date ASC);

-- Index for date range queries
CREATE INDEX IF NOT EXISTS idx_study_history_date
    ON study_history (date DESC);

COMMENT ON INDEX idx_study_history_user_date IS 'Optimizes weekly progress and streak queries';

-- ============================================================================
-- PART 5: ADMIN_USERS TABLE INDEXES
-- ============================================================================

-- Index for check_user_role function performance
CREATE INDEX IF NOT EXISTS idx_admin_users_email_active
    ON admin_users (email)
    WHERE is_active = true;

-- Composite index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id_active
    ON admin_users (user_id, is_active);

-- Index for role-based queries
CREATE INDEX IF NOT EXISTS idx_admin_users_role
    ON admin_users (role)
    WHERE is_active = true;

COMMENT ON INDEX idx_admin_users_email_active IS 'Optimizes admin authentication checks';

-- ============================================================================
-- PART 6: USER_PROFILES TABLE INDEXES
-- ============================================================================

-- Index for subscription status queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription_expires
    ON user_profiles (subscription_status, subscription_expires_at)
    WHERE subscription_status != 'free';

-- Index for streak leaderboards
CREATE INDEX IF NOT EXISTS idx_user_profiles_streak_best
    ON user_profiles (best_streak DESC, current_streak DESC);

-- Index for active users (studied recently)
CREATE INDEX IF NOT EXISTS idx_user_profiles_last_study
    ON user_profiles (last_study_date DESC)
    WHERE last_study_date IS NOT NULL;

-- Index for onboarding status
CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarding
    ON user_profiles (onboarding_completed, onboarding_step)
    WHERE onboarding_completed = false;

COMMENT ON INDEX idx_user_profiles_subscription_expires IS 'Optimizes subscription expiry checks';
COMMENT ON INDEX idx_user_profiles_streak_best IS 'Optimizes leaderboard queries';

-- ============================================================================
-- PART 7: TEST_ANSWERS TABLE INDEXES
-- ============================================================================

-- Composite index for session answers
CREATE INDEX IF NOT EXISTS idx_test_answers_session_order
    ON test_answers (session_id, question_order);

-- Index for user answer history
CREATE INDEX IF NOT EXISTS idx_test_answers_user_answered
    ON test_answers (user_id, answered_at DESC);

-- Index for question performance analysis
CREATE INDEX IF NOT EXISTS idx_test_answers_question_correct
    ON test_answers (question_id, is_correct);

-- Index for flagged answers during tests
CREATE INDEX IF NOT EXISTS idx_test_answers_flagged
    ON test_answers (session_id, was_flagged_during_test)
    WHERE was_flagged_during_test = true;

COMMENT ON INDEX idx_test_answers_session_order IS 'Optimizes answer retrieval for session review';

-- ============================================================================
-- PART 8: QUESTION_REPORTS TABLE INDEXES
-- ============================================================================

-- Index for pending reports (admin workflow)
CREATE INDEX IF NOT EXISTS idx_question_reports_status
    ON question_reports (status, created_at DESC);

-- Index for reports by question
CREATE INDEX IF NOT EXISTS idx_question_reports_question
    ON question_reports (question_id, status);

-- Index for user's reports
CREATE INDEX IF NOT EXISTS idx_question_reports_user
    ON question_reports (user_id, created_at DESC);

-- Index for report type analysis
CREATE INDEX IF NOT EXISTS idx_question_reports_type_status
    ON question_reports (report_type, status);

COMMENT ON INDEX idx_question_reports_status IS 'Optimizes admin report queue';

-- ============================================================================
-- PART 9: MATERIAS TABLE INDEXES
-- ============================================================================

-- Index for active materias
CREATE INDEX IF NOT EXISTS idx_materias_active_order
    ON materias (is_active, sort_order)
    WHERE is_active = true;

-- Index for materia code lookups
CREATE INDEX IF NOT EXISTS idx_materias_code
    ON materias (code)
    WHERE is_active = true;

COMMENT ON INDEX idx_materias_active_order IS 'Optimizes materia selection dropdowns';

-- ============================================================================
-- PART 10: ACHIEVEMENTS/BADGES INDEXES
-- ============================================================================

-- Index for active achievements
CREATE INDEX IF NOT EXISTS idx_achievements_active_category
    ON achievements (is_active, category)
    WHERE is_active = true;

-- Index for user achievements by date
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_unlocked
    ON user_achievements (user_id, unlocked_at DESC);

-- Index for unnotified achievements
CREATE INDEX IF NOT EXISTS idx_user_achievements_unnotified
    ON user_achievements (user_id, notified)
    WHERE notified = false;

COMMENT ON INDEX idx_user_achievements_unnotified IS 'Optimizes achievement notification queries';

-- ============================================================================
-- PART 11: GIN INDEXES FOR JSONB AND ARRAY COLUMNS
-- ============================================================================

-- GIN index for question options (JSONB)
CREATE INDEX IF NOT EXISTS idx_questions_options_gin
    ON questions USING GIN (options);

-- GIN index for question cuerpos array (if not already exists)
CREATE INDEX IF NOT EXISTS idx_questions_cuerpos_gin
    ON questions USING GIN (cuerpos);

-- GIN index for achievement requirements (JSONB)
CREATE INDEX IF NOT EXISTS idx_achievements_requirements_gin
    ON achievements USING GIN (requirements);

COMMENT ON INDEX idx_questions_options_gin IS 'Enables efficient JSONB queries on question options';

-- ============================================================================
-- PART 12: VACUUM AND ANALYZE
-- ============================================================================

-- Analyze tables to update query planner statistics
ANALYZE questions;
ANALYZE user_question_progress;
ANALYZE test_sessions;
ANALYZE test_answers;
ANALYZE study_history;
ANALYZE user_profiles;
ANALYZE admin_users;
ANALYZE question_reports;
ANALYZE materias;
ANALYZE achievements;
ANALYZE user_achievements;

-- ============================================================================
-- END OF MIGRATION 009
-- ============================================================================

COMMENT ON SCHEMA public IS 'Performance indexes added for all critical query paths';
