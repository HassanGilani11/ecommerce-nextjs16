-- SQL MIGRATION: UPDATE USER ROLE CONSTRAINTS
-- This script updates the allowed roles in the profiles table to include Editor and Author.

-- 1. Drop the existing role check constraint
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('customer', 'admin', 'moderator', 'editor', 'author', 'shop_manager'));

-- Update any existing roles if needed (optional)
-- UPDATE profiles SET role = 'customer' WHERE role NOT IN ('customer', 'admin', 'moderator', 'editor', 'author', 'shop_manager');
-- UPDATE public.profiles SET role = 'customer' WHERE role = 'user';
