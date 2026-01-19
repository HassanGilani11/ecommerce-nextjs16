-- Create the settings table
CREATE TABLE IF NOT EXISTS public.settings (
    id BIGINT PRIMARY KEY DEFAULT 1,
    site_title TEXT DEFAULT 'AVANT-GARDE',
    site_tagline TEXT DEFAULT 'Premium Minimalist Ecommerce',
    admin_email TEXT DEFAULT 'admin@avantgarde.com',
    default_role TEXT DEFAULT 'customer',
    timezone TEXT DEFAULT 'utc-0',
    date_format TEXT DEFAULT 'f1',
    time_format TEXT DEFAULT 't1',
    favicon_url TEXT,
    meta_title TEXT,
    meta_description TEXT,
    meta_keywords TEXT,
    facebook_url TEXT,
    twitter_url TEXT,
    instagram_url TEXT,
    linkedin_url TEXT,
    maintenance_mode BOOLEAN DEFAULT FALSE,
    enable_registration BOOLEAN DEFAULT TRUE,
    store_notifications BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT one_row_only CHECK (id = 1)
);

-- Seed initial settings if table is empty
INSERT INTO public.settings (id)
SELECT 1 WHERE NOT EXISTS (SELECT 1 FROM public.settings WHERE id = 1);

-- Standard permissions (Update these based on your security model if needed)
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
ON public.settings FOR SELECT
USING (true);

CREATE POLICY "Allow admin insert"
ON public.settings FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow admin update"
ON public.settings FOR UPDATE
USING (true)
WITH CHECK (true);
