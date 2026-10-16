-- ============================================================================
-- Meal Train SA — User Sync Trigger
-- Migration: 0002_user_sync_trigger
-- Description: Auto-create public.users row when auth.users row is created
-- ============================================================================

-- Make `name` nullable so phone-only signups work
ALTER TABLE users ALTER COLUMN name SET DEFAULT '';
ALTER TABLE users ALTER COLUMN name DROP NOT NULL;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, phone, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    'organizer'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();