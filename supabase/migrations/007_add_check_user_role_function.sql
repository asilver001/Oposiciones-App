-- Migration: Add check_user_role function for unified auth
-- Description: Allows AuthContext to detect if a logged-in user is admin/reviewer
-- Created: 2026-01-24

-- Function to check if user has admin/reviewer role
CREATE OR REPLACE FUNCTION check_user_role(p_email TEXT)
RETURNS TABLE (
  "isAdmin" BOOLEAN,
  "isReviewer" BOOLEAN,
  role TEXT,
  name TEXT,
  id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    (admin_users.role = 'admin') AS "isAdmin",
    (admin_users.role IN ('admin', 'reviewer')) AS "isReviewer",
    admin_users.role,
    admin_users.name,
    admin_users.id
  FROM admin_users
  WHERE LOWER(admin_users.email) = LOWER(p_email)
  LIMIT 1;

  -- If no rows found, return NULL values (user is not admin/reviewer)
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, FALSE, NULL::TEXT, NULL::TEXT, NULL::UUID;
  END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION check_user_role(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION check_user_role(TEXT) TO anon;

-- Add comment
COMMENT ON FUNCTION check_user_role(TEXT) IS 'Check if a user email belongs to an admin or reviewer. Returns role information or null values if not found.';
