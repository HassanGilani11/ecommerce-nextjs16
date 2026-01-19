-- PROPER ADMIN RLS FIX
-- Run this in your Supabase SQL Editor to ensure admins have full access regardless of JWT claims.

-- First, drop the old problematic policies if they exist (adjust names if necessary)
DROP POLICY IF EXISTS "Admins have full access" ON public.orders;
DROP POLICY IF EXISTS "Admins have full access" ON public.order_items;
DROP POLICY IF EXISTS "Admins have full access" ON public.profiles;
DROP POLICY IF EXISTS "Admins have full access" ON public.products;
DROP POLICY IF EXISTS "Admins have full access" ON public.categories;
DROP POLICY IF EXISTS "Admins have full access" ON public.brands;
DROP POLICY IF EXISTS "Admins have full access" ON public.tags;

-- Helper function to check if a user is an admin (more efficient than repeating EXISTS in every policy)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. ORDERS
CREATE POLICY "Admins have full access to orders" ON public.orders
FOR ALL TO authenticated USING (public.is_admin());

-- 2. ORDER_ITEMS
CREATE POLICY "Admins have full access to order_items" ON public.order_items
FOR ALL TO authenticated USING (public.is_admin());

-- 3. PROFILES
CREATE POLICY "Admins have full access to profiles" ON public.profiles
FOR ALL TO authenticated USING (public.is_admin());

-- 4. PRODUCTS
CREATE POLICY "Admins have full access to products" ON public.products
FOR ALL TO authenticated USING (public.is_admin());

-- 5. CATEGORIES
CREATE POLICY "Admins have full access to categories" ON public.categories
FOR ALL TO authenticated USING (public.is_admin());

-- 6. BRANDS
CREATE POLICY "Admins have full access to brands" ON public.brands
FOR ALL TO authenticated USING (public.is_admin());

-- 7. TAGS
CREATE POLICY "Admins have full access to tags" ON public.tags
FOR ALL TO authenticated USING (public.is_admin());

-- Ensure RLS is enabled
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
