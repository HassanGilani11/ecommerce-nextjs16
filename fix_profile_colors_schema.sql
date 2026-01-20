-- Add the color_scheme column to the profiles table
-- Run this in the Supabase SQL Editor if you see the "schema cache" error

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS color_scheme TEXT DEFAULT 'default';

-- Force a PostgREST schema reload to ensure the new column is visible to the API
NOTIFY pgrst, 'reload schema';
