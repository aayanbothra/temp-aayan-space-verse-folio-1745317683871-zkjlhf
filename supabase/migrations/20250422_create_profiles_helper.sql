
-- Function to check if profiles table exists and create it if it doesn't
CREATE OR REPLACE FUNCTION public.create_profiles_table_if_not_exists()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if profiles table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'profiles'
  ) THEN
    -- Create the profiles table
    CREATE TABLE public.profiles (
      id UUID NOT NULL PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
      email TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
    );
    
    -- Create the trigger function if it doesn't exist
    IF NOT EXISTS (
      SELECT FROM pg_proc
      WHERE proname = 'handle_new_user'
      AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    ) THEN
      CREATE FUNCTION public.handle_new_user()
      RETURNS TRIGGER
      LANGUAGE plpgsql
      SECURITY DEFINER SET search_path = public
      AS $func$
      BEGIN
        INSERT INTO public.profiles (id, email)
        VALUES (NEW.id, NEW.email);
        RETURN NEW;
      END;
      $func$;
    END IF;
    
    -- Create the trigger if it doesn't exist
    IF NOT EXISTS (
      SELECT FROM pg_trigger
      WHERE tgname = 'on_auth_user_created'
      AND tgrelid = 'auth.users'::regclass
    ) THEN
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    END IF;
  END IF;
END;
$$;
