-- Error logs table for lightweight client-side error tracking
CREATE TABLE IF NOT EXISTS error_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  level text NOT NULL DEFAULT 'error',
  message text NOT NULL,
  stack text,
  context text,
  url text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Index for querying recent errors
CREATE INDEX idx_error_logs_created_at ON error_logs (created_at DESC);
CREATE INDEX idx_error_logs_level ON error_logs (level);

-- Enable RLS
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert errors (write-only, no read)
CREATE POLICY "Users can insert error logs"
  ON error_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow anonymous users to insert errors too
CREATE POLICY "Anonymous users can insert error logs"
  ON error_logs FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only admins can read error logs
CREATE POLICY "Admins can read error logs"
  ON error_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = auth.jwt() ->> 'email'
      AND role = 'admin'
    )
  );

-- Auto-delete old error logs (older than 30 days) via pg_cron if available
-- This is a comment reminder to set up periodic cleanup
-- DELETE FROM error_logs WHERE created_at < now() - interval '30 days';
