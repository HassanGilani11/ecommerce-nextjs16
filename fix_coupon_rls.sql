-- FIX COUPON RLS
-- Run this in your Supabase SQL Editor to allow admins to manage coupons.

-- 1. COUPONS
DROP POLICY IF EXISTS "Admins have full access to coupons" ON public.coupons;
CREATE POLICY "Admins have full access to coupons" ON public.coupons
FOR ALL TO authenticated USING (public.is_admin());

-- 2. COUPON_ASSIGNMENTS
DROP POLICY IF EXISTS "Admins have full access to coupon_assignments" ON public.coupon_assignments;
CREATE POLICY "Admins have full access to coupon_assignments" ON public.coupon_assignments
FOR ALL TO authenticated USING (public.is_admin());

-- Ensure RLS is enabled (just in case)
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_assignments ENABLE ROW LEVEL SECURITY;
