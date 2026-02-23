-- Migration 014: Fix question_id type mismatch (UUID → INTEGER)
--
-- Problem: user_question_progress.question_id and test_answers.question_id
-- are UUID, but questions.id is INTEGER. This breaks FK joins and blocks
-- all FSRS progress writes (UUID guard in code silently skips integer IDs).
--
-- Safe to truncate: user_question_progress has 0 real user data (all writes
-- were blocked by the UUID guard). test_answers similarly empty/useless.

BEGIN;

-- 1. Drop FK constraints (names may vary — use information_schema to be safe)
ALTER TABLE user_question_progress
  DROP CONSTRAINT IF EXISTS user_question_progress_question_id_fkey;

ALTER TABLE test_answers
  DROP CONSTRAINT IF EXISTS test_answers_question_id_fkey;

-- 2. Drop indexes that reference question_id
DROP INDEX IF EXISTS idx_user_question_progress_question;
DROP INDEX IF EXISTS idx_user_question_progress_user_question;
DROP INDEX IF EXISTS idx_test_answers_question;

-- 3. Truncate tables (no real data — all writes were blocked)
TRUNCATE TABLE user_question_progress;
TRUNCATE TABLE test_answers;

-- 4. ALTER COLUMN question_id from UUID to INTEGER
ALTER TABLE user_question_progress
  ALTER COLUMN question_id TYPE INTEGER USING NULL;

ALTER TABLE test_answers
  ALTER COLUMN question_id TYPE INTEGER USING NULL;

-- 5. Recreate FK constraints pointing to questions(id) as INTEGER
ALTER TABLE user_question_progress
  ADD CONSTRAINT user_question_progress_question_id_fkey
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE;

ALTER TABLE test_answers
  ADD CONSTRAINT test_answers_question_id_fkey
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE SET NULL;

-- 6. Recreate indexes
CREATE INDEX IF NOT EXISTS idx_user_question_progress_question
  ON user_question_progress(question_id);

CREATE INDEX IF NOT EXISTS idx_user_question_progress_user_question
  ON user_question_progress(user_id, question_id);

CREATE INDEX IF NOT EXISTS idx_test_answers_question
  ON test_answers(question_id);

COMMIT;
