-- ============================================================================
-- MIGRATION 010: Add Admin Login Rate Limiting
-- ============================================================================
-- This migration adds rate limiting for admin login attempts to prevent
-- brute force attacks
-- ============================================================================

-- ============================================================================
-- PART 1: CREATE ADMIN LOGIN ATTEMPTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS admin_login_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Attempt details
    email TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,

    -- Result
    was_successful BOOLEAN DEFAULT false,
    failure_reason TEXT, -- 'invalid_credentials', 'not_admin', 'rate_limited', etc.

    -- Metadata
    attempt_time TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_admin_login_attempts_email_time
    ON admin_login_attempts (email, attempt_time DESC);

CREATE INDEX idx_admin_login_attempts_ip_time
    ON admin_login_attempts (ip_address, attempt_time DESC);

CREATE INDEX idx_admin_login_attempts_time
    ON admin_login_attempts (attempt_time DESC);

-- Automatically delete old attempts after 30 days
CREATE INDEX idx_admin_login_attempts_cleanup
    ON admin_login_attempts (created_at)
    WHERE created_at < NOW() - INTERVAL '30 days';

COMMENT ON TABLE admin_login_attempts IS 'Tracks admin login attempts for rate limiting and security auditing';
COMMENT ON INDEX idx_admin_login_attempts_email_time IS 'Optimizes rate limit checks by email';

-- ============================================================================
-- PART 2: ENABLE RLS ON ADMIN_LOGIN_ATTEMPTS
-- ============================================================================

ALTER TABLE admin_login_attempts ENABLE ROW LEVEL SECURITY;

-- Only admins and service role can view login attempts
CREATE POLICY "Admin login attempts: Admins can view"
    ON admin_login_attempts FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
            AND admin_users.is_active = true
        )
    );

-- Service role can insert (used by login function)
CREATE POLICY "Admin login attempts: Service role can insert"
    ON admin_login_attempts FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Anyone authenticated can insert their own attempt (for logging)
CREATE POLICY "Admin login attempts: Users can log own attempts"
    ON admin_login_attempts FOR INSERT
    TO authenticated, anon
    WITH CHECK (true);

-- ============================================================================
-- PART 3: RATE LIMITING FUNCTIONS
-- ============================================================================

-- Function to check if user is rate limited
CREATE OR REPLACE FUNCTION check_admin_rate_limit(
    p_email TEXT,
    p_ip_address INET DEFAULT NULL,
    p_window_minutes INTEGER DEFAULT 15,
    p_max_attempts INTEGER DEFAULT 5
)
RETURNS TABLE (
    is_rate_limited BOOLEAN,
    attempts_count INTEGER,
    window_start TIMESTAMPTZ,
    retry_after_seconds INTEGER
) AS $$
DECLARE
    v_window_start TIMESTAMPTZ;
    v_attempts_count INTEGER;
    v_is_rate_limited BOOLEAN;
    v_retry_after_seconds INTEGER;
BEGIN
    -- Calculate window start time
    v_window_start := NOW() - (p_window_minutes || ' minutes')::INTERVAL;

    -- Count failed attempts in the window
    SELECT COUNT(*)
    INTO v_attempts_count
    FROM admin_login_attempts
    WHERE email = p_email
      AND attempt_time >= v_window_start
      AND was_successful = false;

    -- Also count by IP if provided
    IF p_ip_address IS NOT NULL THEN
        SELECT COUNT(*)
        INTO v_attempts_count
        FROM admin_login_attempts
        WHERE (email = p_email OR ip_address = p_ip_address)
          AND attempt_time >= v_window_start
          AND was_successful = false;
    END IF;

    -- Check if rate limited
    v_is_rate_limited := v_attempts_count >= p_max_attempts;

    -- Calculate retry after time
    IF v_is_rate_limited THEN
        -- Find the oldest attempt in the window
        SELECT EXTRACT(EPOCH FROM (
            attempt_time + (p_window_minutes || ' minutes')::INTERVAL - NOW()
        ))::INTEGER
        INTO v_retry_after_seconds
        FROM admin_login_attempts
        WHERE email = p_email
          AND attempt_time >= v_window_start
          AND was_successful = false
        ORDER BY attempt_time ASC
        LIMIT 1;

        -- Ensure it's at least 0
        v_retry_after_seconds := GREATEST(0, v_retry_after_seconds);
    ELSE
        v_retry_after_seconds := 0;
    END IF;

    -- Return result
    RETURN QUERY SELECT
        v_is_rate_limited,
        v_attempts_count,
        v_window_start,
        v_retry_after_seconds;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record login attempt
CREATE OR REPLACE FUNCTION record_admin_login_attempt(
    p_email TEXT,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_was_successful BOOLEAN DEFAULT false,
    p_failure_reason TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_attempt_id UUID;
BEGIN
    -- Insert the attempt record
    INSERT INTO admin_login_attempts (
        email,
        ip_address,
        user_agent,
        was_successful,
        failure_reason
    ) VALUES (
        p_email,
        p_ip_address,
        p_user_agent,
        p_was_successful,
        p_failure_reason
    )
    RETURNING id INTO v_attempt_id;

    RETURN v_attempt_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old login attempts (run periodically)
CREATE OR REPLACE FUNCTION cleanup_old_admin_login_attempts(
    p_days_to_keep INTEGER DEFAULT 30
)
RETURNS INTEGER AS $$
DECLARE
    v_deleted_count INTEGER;
BEGIN
    -- Delete attempts older than specified days
    WITH deleted AS (
        DELETE FROM admin_login_attempts
        WHERE created_at < NOW() - (p_days_to_keep || ' days')::INTERVAL
        RETURNING id
    )
    SELECT COUNT(*) INTO v_deleted_count FROM deleted;

    RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get recent failed attempts for admin dashboard
CREATE OR REPLACE FUNCTION get_recent_failed_login_attempts(
    p_limit INTEGER DEFAULT 100,
    p_hours INTEGER DEFAULT 24
)
RETURNS TABLE (
    email TEXT,
    ip_address INET,
    user_agent TEXT,
    failure_reason TEXT,
    attempt_time TIMESTAMPTZ,
    attempts_from_email BIGINT,
    attempts_from_ip BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ala.email,
        ala.ip_address,
        ala.user_agent,
        ala.failure_reason,
        ala.attempt_time,
        (
            SELECT COUNT(*)
            FROM admin_login_attempts
            WHERE email = ala.email
              AND attempt_time >= NOW() - (p_hours || ' hours')::INTERVAL
              AND was_successful = false
        ) AS attempts_from_email,
        (
            SELECT COUNT(*)
            FROM admin_login_attempts
            WHERE ip_address = ala.ip_address
              AND attempt_time >= NOW() - (p_hours || ' hours')::INTERVAL
              AND was_successful = false
        ) AS attempts_from_ip
    FROM admin_login_attempts ala
    WHERE ala.was_successful = false
      AND ala.attempt_time >= NOW() - (p_hours || ' hours')::INTERVAL
    ORDER BY ala.attempt_time DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset rate limit for a specific email (admin use)
CREATE OR REPLACE FUNCTION reset_admin_rate_limit(p_email TEXT)
RETURNS INTEGER AS $$
DECLARE
    v_deleted_count INTEGER;
BEGIN
    -- Delete recent failed attempts for this email
    WITH deleted AS (
        DELETE FROM admin_login_attempts
        WHERE email = p_email
          AND was_successful = false
          AND attempt_time >= NOW() - INTERVAL '1 hour'
        RETURNING id
    )
    SELECT COUNT(*) INTO v_deleted_count FROM deleted;

    RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION check_admin_rate_limit IS 'Check if an email/IP is currently rate limited';
COMMENT ON FUNCTION record_admin_login_attempt IS 'Record a login attempt for auditing and rate limiting';
COMMENT ON FUNCTION cleanup_old_admin_login_attempts IS 'Remove login attempts older than specified days';
COMMENT ON FUNCTION get_recent_failed_login_attempts IS 'Get recent failed login attempts for admin dashboard';
COMMENT ON FUNCTION reset_admin_rate_limit IS 'Reset rate limit for a specific email (admin only)';

-- ============================================================================
-- PART 4: CREATE AUTOMATIC CLEANUP JOB (using pg_cron if available)
-- ============================================================================

-- Note: pg_cron extension needs to be enabled by Supabase admin
-- This is commented out - enable manually in Supabase dashboard if needed

-- DO $$
-- BEGIN
--     IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
--         -- Schedule cleanup job to run daily at 3 AM
--         PERFORM cron.schedule(
--             'cleanup-admin-login-attempts',
--             '0 3 * * *',
--             $$SELECT cleanup_old_admin_login_attempts(30);$$
--         );
--     END IF;
-- END $$;

-- ============================================================================
-- PART 5: GRANT PERMISSIONS
-- ============================================================================

-- Grant execute permissions on functions to authenticated users
GRANT EXECUTE ON FUNCTION check_admin_rate_limit TO authenticated, anon;
GRANT EXECUTE ON FUNCTION record_admin_login_attempt TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION cleanup_old_admin_login_attempts TO service_role;
GRANT EXECUTE ON FUNCTION get_recent_failed_login_attempts TO authenticated;
GRANT EXECUTE ON FUNCTION reset_admin_rate_limit TO service_role;

-- ============================================================================
-- END OF MIGRATION 010
-- ============================================================================

COMMENT ON SCHEMA public IS 'Admin login rate limiting implemented with 5 attempts per 15 minutes';
