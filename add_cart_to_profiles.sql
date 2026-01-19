-- Add cart column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cart JSONB DEFAULT '[]'::jsonb;

-- Update RLS policies to allow users to update their own cart
-- (Existing update policy for profiles should already allow this, but let's be explicit if needed)
-- CREATE POLICY "Users can update their own cart" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
