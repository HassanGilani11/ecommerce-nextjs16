-- Fix Table RLS Policies for Admin Access
-- The original schema only had SELECT policies. We need to allow Admins to Modify data.

-- 1. BRANDS Policies
DROP POLICY IF EXISTS "Admins can insert brands" ON public.brands;
DROP POLICY IF EXISTS "Admins can update brands" ON public.brands;
DROP POLICY IF EXISTS "Admins can delete brands" ON public.brands;

CREATE POLICY "Admins can insert brands" ON public.brands FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update brands" ON public.brands FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete brands" ON public.brands FOR DELETE TO authenticated USING (true);


-- 2. CATEGORIES Policies
DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can update categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories;

CREATE POLICY "Admins can insert categories" ON public.categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update categories" ON public.categories FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete categories" ON public.categories FOR DELETE TO authenticated USING (true);


-- 3. TAGS Policies (Just in case)
DROP POLICY IF EXISTS "Admins can insert tags" ON public.tags;
DROP POLICY IF EXISTS "Admins can update tags" ON public.tags;
DROP POLICY IF EXISTS "Admins can delete tags" ON public.tags;

CREATE POLICY "Admins can insert tags" ON public.tags FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update tags" ON public.tags FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete tags" ON public.tags FOR DELETE TO authenticated USING (true);

-- Note: We are using "TO authenticated" assuming all authenticated users are admins for now, 
-- consistent with the rest of the setup. If you implement roles later, update "USING (auth.jwt() ->> 'role' = 'admin')".
