-- Create atomic function to safely increment XP without race conditions
CREATE OR REPLACE FUNCTION increment_user_xp(p_user_id UUID, p_xp_amount INTEGER)
RETURNS INTEGER AS $$
DECLARE
  new_total INTEGER;
BEGIN
  -- Atomically update and return the new total
  UPDATE profiles 
  SET 
    total_xp = COALESCE(total_xp, 0) + p_xp_amount,
    updated_at = NOW()
  WHERE id = p_user_id
  RETURNING total_xp INTO new_total;
  
  -- If no row was updated, return 0
  IF new_total IS NULL THEN
    RETURN 0;
  END IF;
  
  RETURN new_total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_user_xp(UUID, INTEGER) TO authenticated;
