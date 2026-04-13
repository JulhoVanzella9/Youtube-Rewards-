-- Fix 1: Update trigger - new users start with $0
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, username, total_xp)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'display_name', 'Usuario'),
    COALESCE(new.raw_user_meta_data ->> 'username', 'usuario'),
    0
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.activity_history (user_id, activity_type, title, description, icon, color)
  VALUES (new.id, 'account', 'Conta Criada', 'Bem-vindo ao TikMoney!', '', '#25f4ee');

  RETURN new;
END;
$$;

-- Fix 2: Recreate increment_user_xp with correct parameter names
CREATE OR REPLACE FUNCTION increment_user_xp(p_user_id UUID, p_xp_amount INTEGER)
RETURNS INTEGER AS $$
DECLARE
  new_total INTEGER;
BEGIN
  UPDATE profiles
  SET
    total_xp = COALESCE(total_xp, 0) + p_xp_amount,
    updated_at = NOW()
  WHERE id = p_user_id
  RETURNING total_xp INTO new_total;

  IF new_total IS NULL THEN
    RETURN 0;
  END IF;

  RETURN new_total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION increment_user_xp(UUID, INTEGER) TO authenticated;
