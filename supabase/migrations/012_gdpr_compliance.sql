-- ============================================================================
-- MIGRATION 012: GDPR Compliance - Account Deletion & Privacy Consent
-- ============================================================================
-- Adds:
--   1. delete_own_account RPC function (deletes all user data + auth account)
--   2. consent_accepted_at and consent_version columns on user_profiles
--   3. Removes PIN-based admin auth (verify_admin_login function)
-- ============================================================================

-- ============================================================================
-- PART 1: Add Privacy Consent Columns to user_profiles
-- ============================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles' AND column_name = 'consent_accepted_at'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN consent_accepted_at TIMESTAMPTZ;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles' AND column_name = 'consent_version'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN consent_version TEXT;
    END IF;
END $$;

COMMENT ON COLUMN user_profiles.consent_accepted_at IS 'When user accepted the privacy policy';
COMMENT ON COLUMN user_profiles.consent_version IS 'Version of privacy policy accepted (e.g. 1.0)';

-- ============================================================================
-- PART 2: Delete Own Account RPC Function
-- ============================================================================
-- This function deletes all user data from all tables, then deletes the
-- auth.users entry. Must be called by the authenticated user themselves.
-- Uses SECURITY DEFINER to access auth.users table.

CREATE OR REPLACE FUNCTION delete_own_account()
RETURNS BOOLEAN AS $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Get the authenticated user's ID
    v_user_id := auth.uid();

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Delete from all user-related tables (order matters due to FK constraints)
    -- test_answers references test_sessions, so delete answers first
    DELETE FROM test_answers WHERE user_id = v_user_id;
    DELETE FROM test_sessions WHERE user_id = v_user_id;

    -- Delete user progress and history
    DELETE FROM user_question_progress WHERE user_id = v_user_id;
    DELETE FROM study_history WHERE user_id = v_user_id;

    -- Delete achievements/badges
    DELETE FROM user_achievements WHERE user_id = v_user_id;

    -- Delete badges (user_badges table)
    BEGIN
        DELETE FROM user_badges WHERE user_id = v_user_id;
    EXCEPTION WHEN undefined_table THEN
        NULL; -- Table might not exist
    END;

    -- Delete session stats
    BEGIN
        DELETE FROM session_stats WHERE user_id = v_user_id;
    EXCEPTION WHEN undefined_table THEN
        NULL;
    END;

    -- Delete daily goals
    BEGIN
        DELETE FROM daily_goals WHERE user_id = v_user_id;
    EXCEPTION WHEN undefined_table THEN
        NULL;
    END;

    -- Delete topic progress
    BEGIN
        DELETE FROM topic_progress WHERE user_id = v_user_id;
    EXCEPTION WHEN undefined_table THEN
        NULL;
    END;

    -- Delete retention history
    BEGIN
        DELETE FROM retention_history WHERE user_id = v_user_id;
    EXCEPTION WHEN undefined_table THEN
        NULL;
    END;

    -- Delete user insights
    BEGIN
        DELETE FROM user_triggered_insights WHERE user_id = v_user_id;
    EXCEPTION WHEN undefined_table THEN
        NULL;
    END;

    -- Delete user stats
    BEGIN
        DELETE FROM user_stats WHERE user_id = v_user_id;
    EXCEPTION WHEN undefined_table THEN
        NULL;
    END;

    -- Delete question reports
    BEGIN
        DELETE FROM question_reports WHERE user_id = v_user_id;
    EXCEPTION WHEN undefined_table THEN
        NULL;
    END;

    -- Delete user profile (this should also cascade from auth.users deletion,
    -- but we do it explicitly for clarity)
    DELETE FROM user_profiles WHERE id = v_user_id;

    -- Delete the auth user entry itself
    -- This requires SECURITY DEFINER since normal users can't access auth.users
    DELETE FROM auth.users WHERE id = v_user_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Grant execute to authenticated users only
GRANT EXECUTE ON FUNCTION delete_own_account() TO authenticated;

COMMENT ON FUNCTION delete_own_account IS 'GDPR: Allows a user to delete all their data and their account. Must be called by the authenticated user.';

-- ============================================================================
-- PART 3: Drop Legacy PIN-based Admin Auth Functions
-- ============================================================================

-- Drop the PIN verification function (no longer used - admin auth now uses Supabase Auth)
DROP FUNCTION IF EXISTS verify_admin_login(TEXT, TEXT);

-- ============================================================================
-- END OF MIGRATION 012
-- ============================================================================

COMMENT ON SCHEMA public IS 'GDPR compliance: account deletion RPC, privacy consent tracking, PIN auth removed';
