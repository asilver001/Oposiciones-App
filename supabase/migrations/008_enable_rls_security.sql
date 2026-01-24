-- ============================================================================
-- MIGRATION 008: Enable RLS and Create Missing Tables
-- ============================================================================
-- This migration adds RLS policies for admin_users, question_reports, materias
-- and creates badges and waitlist tables with proper security
-- ============================================================================

-- ============================================================================
-- PART 1: CREATE MISSING TABLES (badges and waitlist)
-- ============================================================================

-- Badges table for gamification (alternative to achievements)
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Badge definition
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    tier TEXT DEFAULT 'bronze', -- bronze, silver, gold, platinum

    -- Requirements
    required_streak INTEGER,
    required_tests INTEGER,
    required_accuracy DECIMAL(3,2),
    required_questions INTEGER,

    -- Metadata
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User badges (many-to-many)
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,

    earned_at TIMESTAMPTZ DEFAULT NOW(),
    progress DECIMAL(5,2) DEFAULT 0, -- Percentage towards earning badge
    notified BOOLEAN DEFAULT false,

    CONSTRAINT unique_user_badge UNIQUE (user_id, badge_id)
);

-- Waitlist for users waiting for early access
CREATE TABLE IF NOT EXISTS waitlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- User info
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    phone TEXT,

    -- Oposición targeting
    target_oposicion TEXT DEFAULT 'auxiliar_age',
    target_year INTEGER,

    -- Referral tracking
    referral_code TEXT,
    referred_by TEXT,

    -- Status
    status TEXT DEFAULT 'pending', -- pending, invited, registered
    priority INTEGER DEFAULT 0, -- Higher = more priority

    -- UTM parameters
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,

    -- Metadata
    ip_address INET,
    user_agent TEXT,
    notes TEXT,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    invited_at TIMESTAMPTZ,
    registered_at TIMESTAMPTZ
);

-- Add updated_at triggers
CREATE TRIGGER update_badges_updated_at
    BEFORE UPDATE ON badges
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_waitlist_updated_at
    BEFORE UPDATE ON waitlist
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for performance
CREATE INDEX idx_badges_active ON badges (is_active) WHERE is_active = true;
CREATE INDEX idx_badges_tier ON badges (tier);
CREATE INDEX idx_user_badges_user ON user_badges (user_id);
CREATE INDEX idx_user_badges_badge ON user_badges (badge_id);
CREATE INDEX idx_waitlist_email ON waitlist (email);
CREATE INDEX idx_waitlist_status ON waitlist (status);
CREATE INDEX idx_waitlist_created ON waitlist (created_at DESC);

COMMENT ON TABLE badges IS 'Badge definitions for gamification';
COMMENT ON TABLE user_badges IS 'Badges earned by users';
COMMENT ON TABLE waitlist IS 'Email waitlist for early access users';

-- ============================================================================
-- PART 2: ENABLE RLS ON EXISTING TABLES (that don't have it yet)
-- ============================================================================

-- Enable RLS on admin_users if exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'admin_users') THEN
        ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Enable RLS on question_reports if exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'question_reports') THEN
        ALTER TABLE question_reports ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Enable RLS on materias if exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'materias') THEN
        ALTER TABLE materias ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Enable RLS on study_history if exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'study_history') THEN
        ALTER TABLE study_history ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Enable RLS on new tables
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PART 3: RLS POLICIES FOR QUESTIONS
-- ============================================================================
-- Note: questions already has RLS enabled and basic policies from 001_initial_schema.sql
-- We'll add admin-specific policies here

-- Drop existing service_role policy to replace with admin check
DROP POLICY IF EXISTS "Questions: Service role full access" ON questions;

-- Admin users can insert/update/delete questions
CREATE POLICY "Questions: Admins can manage all questions"
    ON questions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
            AND admin_users.is_active = true
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
            AND admin_users.is_active = true
        )
    );

-- Service role can still do everything (for migrations and admin operations)
CREATE POLICY "Questions: Service role full access"
    ON questions FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ============================================================================
-- PART 4: RLS POLICIES FOR BADGES
-- ============================================================================

-- Anyone authenticated can view active badges
CREATE POLICY "Badges: Authenticated users can view active badges"
    ON badges FOR SELECT
    TO authenticated
    USING (is_active = true);

-- Only admins can manage badges
CREATE POLICY "Badges: Admins can manage badges"
    ON badges FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
            AND admin_users.is_active = true
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
            AND admin_users.is_active = true
        )
    );

-- Users can view their own badges
CREATE POLICY "User badges: Users can view own badges"
    ON user_badges FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- System can insert badges for users (via triggers/functions)
CREATE POLICY "User badges: System can insert badges"
    ON user_badges FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Admins can manage all user badges
CREATE POLICY "User badges: Admins can manage all badges"
    ON user_badges FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
            AND admin_users.is_active = true
        )
    );

-- ============================================================================
-- PART 5: RLS POLICIES FOR WAITLIST
-- ============================================================================

-- Anyone can insert into waitlist (public signup)
CREATE POLICY "Waitlist: Anyone can sign up"
    ON waitlist FOR INSERT
    WITH CHECK (true);

-- Users can view their own waitlist entry by email
CREATE POLICY "Waitlist: Users can view own entry"
    ON waitlist FOR SELECT
    TO authenticated
    USING (
        email = (SELECT email FROM auth.users WHERE id = auth.uid())
    );

-- Admins can view and manage all waitlist entries
CREATE POLICY "Waitlist: Admins can view all"
    ON waitlist FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
            AND admin_users.is_active = true
        )
    );

CREATE POLICY "Waitlist: Admins can update"
    ON waitlist FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
            AND admin_users.is_active = true
        )
    );

CREATE POLICY "Waitlist: Admins can delete"
    ON waitlist FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
            AND admin_users.is_active = true
        )
    );

-- ============================================================================
-- PART 6: RLS POLICIES FOR ADMIN_USERS
-- ============================================================================

-- Only admins can view other admins
CREATE POLICY "Admin users: Admins can view all admins"
    ON admin_users FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admin_users au
            WHERE au.user_id = auth.uid()
            AND au.is_active = true
        )
    );

-- Only super admins can modify admin_users
CREATE POLICY "Admin users: Only service role can modify"
    ON admin_users FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ============================================================================
-- PART 7: RLS POLICIES FOR QUESTION_REPORTS
-- ============================================================================

-- Users can report questions (insert)
CREATE POLICY "Question reports: Users can report questions"
    ON question_reports FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Users can view their own reports
CREATE POLICY "Question reports: Users can view own reports"
    ON question_reports FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Admins can view all reports
CREATE POLICY "Question reports: Admins can view all reports"
    ON question_reports FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
            AND admin_users.is_active = true
        )
    );

-- Admins can update reports (mark as resolved)
CREATE POLICY "Question reports: Admins can update reports"
    ON question_reports FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
            AND admin_users.is_active = true
        )
    );

-- ============================================================================
-- PART 8: RLS POLICIES FOR MATERIAS
-- ============================================================================

-- Everyone can read materias (public data)
CREATE POLICY "Materias: Public read access"
    ON materias FOR SELECT
    TO authenticated, anon
    USING (true);

-- Only admins can modify materias
CREATE POLICY "Materias: Admins can modify"
    ON materias FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
            AND admin_users.is_active = true
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
            AND admin_users.is_active = true
        )
    );

-- ============================================================================
-- PART 9: RLS POLICIES FOR STUDY_HISTORY
-- ============================================================================

-- Users can view their own study history
CREATE POLICY "Study history: Users can view own history"
    ON study_history FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Users can insert/update their own study history
CREATE POLICY "Study history: Users can manage own history"
    ON study_history FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Admins can view all study history
CREATE POLICY "Study history: Admins can view all"
    ON study_history FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
            AND admin_users.is_active = true
        )
    );

-- ============================================================================
-- END OF MIGRATION 008
-- ============================================================================

COMMENT ON SCHEMA public IS 'RLS enabled on all tables with proper admin and user policies';
