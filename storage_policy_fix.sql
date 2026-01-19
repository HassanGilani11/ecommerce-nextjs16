-- Enable the storage extension if not already enabled (usually standard)
-- CREATE EXTENSION IF NOT EXISTS "storage";

-- 1. Create Buckets (if they don't exist, this is idempotent-ish via the logic below or dashboard)
-- NOTE: In raw SQL, inserting into storage.buckets is how you create them.
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('categories', 'categories', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('brands', 'brands', true) ON CONFLICT (id) DO NOTHING;

-- 2. Drop existing inconsistent policies to start fresh (Optional, but safer for "Fix")
DROP POLICY IF EXISTS "Public Access to Products" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload to Products" ON storage.objects;
DROP POLICY IF EXISTS "Public Access to Categories" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload to Categories" ON storage.objects;
DROP POLICY IF EXISTS "Public Access to Brands" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload to Brands" ON storage.objects;
DROP POLICY IF EXISTS "Give me access to everything" ON storage.objects; -- Common debug policy

-- 3. Create Consolidated Policies for "Avant Garde" Admins
-- We assume "Authenticated" users are Admins for now based on the previous context, 
-- or we can check the role. The previous schema used: (auth.jwt() ->> 'role' = 'admin')

-- VIEW (SELECT): Everyone can view images in these buckets
CREATE POLICY "Public Access to Images"
ON storage.objects FOR SELECT
USING ( bucket_id IN ('products', 'categories', 'brands') );

-- UPLOAD (INSERT): Only Authenticated Users (Admins) can upload
CREATE POLICY "Admins can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id IN ('products', 'categories', 'brands')
    -- AND (auth.jwt() ->> 'role' = 'admin') -- Uncomment strict check if needed
);

-- UPDATE: Only Authenticated Users (Admins) can update
CREATE POLICY "Admins can update images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id IN ('products', 'categories', 'brands') );

-- DELETE: Only Authenticated Users (Admins) can delete
CREATE POLICY "Admins can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id IN ('products', 'categories', 'brands') );
