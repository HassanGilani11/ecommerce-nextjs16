-- FIX: Link Orders to Profiles for correct Join in Dashboard
-- Supabase select needs a direct FK to join public.profiles from public.orders

ALTER TABLE public.orders 
DROP CONSTRAINT IF EXISTS orders_user_id_profiles_fkey;

ALTER TABLE public.orders 
ADD CONSTRAINT orders_user_id_profiles_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.profiles(id) 
ON DELETE SET NULL;

COMMENT ON CONSTRAINT orders_user_id_profiles_fkey ON public.orders IS 'Enables automatic join with Profiles in Supabase queries';
