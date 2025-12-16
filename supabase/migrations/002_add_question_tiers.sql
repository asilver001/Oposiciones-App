-- Migration: Add question tier system for free/premium differentiation
-- Run this migration on your Supabase database

-- Add tier column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'questions' AND column_name = 'tier'
  ) THEN
    ALTER TABLE questions ADD COLUMN tier TEXT DEFAULT 'premium';
  END IF;
END $$;

-- Add tracking columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'questions' AND column_name = 'times_shown'
  ) THEN
    ALTER TABLE questions ADD COLUMN times_shown INTEGER DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'questions' AND column_name = 'last_shown_at'
  ) THEN
    ALTER TABLE questions ADD COLUMN last_shown_at TIMESTAMPTZ;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'questions' AND column_name = 'rotation_priority'
  ) THEN
    ALTER TABLE questions ADD COLUMN rotation_priority INTEGER DEFAULT 0;
  END IF;
END $$;

-- Add constraint for tier values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE constraint_name = 'questions_tier_check'
  ) THEN
    ALTER TABLE questions
    ADD CONSTRAINT questions_tier_check
    CHECK (tier IN ('free', 'premium'));
  END IF;
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
END $$;

-- Create index for tier queries
CREATE INDEX IF NOT EXISTS idx_questions_tier ON questions(tier);
CREATE INDEX IF NOT EXISTS idx_questions_times_shown ON questions(times_shown);
CREATE INDEX IF NOT EXISTS idx_questions_tier_times_shown ON questions(tier, times_shown);

-- Create user_question_progress table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_question_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  times_seen INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  interval INTEGER DEFAULT 0,
  ease_factor DECIMAL(3,2) DEFAULT 2.50,
  next_review TIMESTAMPTZ,
  last_reviewed TIMESTAMPTZ,
  state TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Create index for progress queries
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_question_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_next_review ON user_question_progress(next_review);
CREATE INDEX IF NOT EXISTS idx_user_progress_state ON user_question_progress(state);

-- Create study_history table for tracking daily progress
CREATE TABLE IF NOT EXISTS study_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  questions_answered INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_study_history_user_date ON study_history(user_id, date DESC);

-- Enable RLS
ALTER TABLE user_question_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_question_progress
DROP POLICY IF EXISTS "Users can view own progress" ON user_question_progress;
CREATE POLICY "Users can view own progress"
  ON user_question_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own progress" ON user_question_progress;
CREATE POLICY "Users can insert own progress"
  ON user_question_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON user_question_progress;
CREATE POLICY "Users can update own progress"
  ON user_question_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for study_history
DROP POLICY IF EXISTS "Users can view own history" ON study_history;
CREATE POLICY "Users can view own history"
  ON study_history FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own history" ON study_history;
CREATE POLICY "Users can insert own history"
  ON study_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own history" ON study_history;
CREATE POLICY "Users can update own history"
  ON study_history FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for user_question_progress
DROP TRIGGER IF EXISTS update_user_question_progress_updated_at ON user_question_progress;
CREATE TRIGGER update_user_question_progress_updated_at
    BEFORE UPDATE ON user_question_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Initialize some questions as free (first 100 by id)
-- This is optional and can be customized
-- UPDATE questions
-- SET tier = 'free'
-- WHERE id IN (
--   SELECT id FROM questions
--   WHERE is_active = true
--   ORDER BY created_at ASC
--   LIMIT 100
-- );

COMMENT ON COLUMN questions.tier IS 'Question tier: free or premium. Free questions are available to all users.';
COMMENT ON COLUMN questions.times_shown IS 'Number of times this question has been shown to any user.';
COMMENT ON COLUMN questions.last_shown_at IS 'Last time this question was shown to any user.';
COMMENT ON COLUMN questions.rotation_priority IS 'Priority for tier rotation. Higher = more priority to become free.';
