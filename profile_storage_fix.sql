-- 1. Create the 'profile' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile', 'profile', true) 
ON CONFLICT (id) DO NOTHING;

-- 2. Drop existing policies for the 'profile' bucket to avoid conflicts
DROP POLICY IF EXISTS "Public Access to Profiles" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete avatars" ON storage.objects;

-- 3. SELECT: Anyone can view profile pictures (since it's a public bucket)
CREATE POLICY "Public Access to Profiles"
ON storage.objects FOR SELECT
USING ( bucket_id = 'profile' );

-- 4. INSERT: Allow authenticated users to upload to the 'profile' bucket
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'profile' );

-- 5. UPDATE: Allow authenticated users to update avatars in the 'profile' bucket
CREATE POLICY "Authenticated users can update avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'profile' );

-- 6. DELETE: Allow authenticated users to delete avatars in the 'profile' bucket
CREATE POLICY "Authenticated users can delete avatars"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'profile' );
