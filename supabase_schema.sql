-- ====================================================================
-- SOWMIYAA BIRTHDAY WISHES SYSTEM - SUPABASE DATABASE & STORAGE SCHEMA
-- ====================================================================

-- 1. ENABLE UUID EXTENSION IF NOT EXISTS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE TABLE: birthday_wishes
CREATE TABLE IF NOT EXISTS public.birthday_wishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(trim(name)) >= 2 AND char_length(name) <= 80),
  email TEXT CHECK (email IS NULL OR char_length(email) <= 100),
  relationship TEXT CHECK (relationship IS NULL OR char_length(relationship) <= 50),
  message TEXT NOT NULL CHECK (char_length(trim(message)) >= 5 AND char_length(message) <= 1000),
  photo_path TEXT, -- Storage path inside 'birthday-wish-photos' bucket
  approved BOOLEAN NOT NULL DEFAULT false,
  featured BOOLEAN NOT NULL DEFAULT false,
  thank_you_sent BOOLEAN NOT NULL DEFAULT false,
  thank_you_sent_at TIMESTAMPTZ,
  thank_you_message TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Migrations for existing tables (safe to re-run on existing DB)
ALTER TABLE public.birthday_wishes ADD COLUMN IF NOT EXISTS email TEXT CHECK (email IS NULL OR char_length(email) <= 100);
ALTER TABLE public.birthday_wishes ADD COLUMN IF NOT EXISTS thank_you_sent BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.birthday_wishes ADD COLUMN IF NOT EXISTS thank_you_sent_at TIMESTAMPTZ;
ALTER TABLE public.birthday_wishes ADD COLUMN IF NOT EXISTS thank_you_message TEXT;
ALTER TABLE public.birthday_wishes ADD COLUMN IF NOT EXISTS is_read BOOLEAN NOT NULL DEFAULT false;

-- Index for public wall queries (approved & featured sorting)
CREATE INDEX IF NOT EXISTS idx_birthday_wishes_approved_featured_created 
ON public.birthday_wishes (approved, featured DESC, created_at DESC);

-- 3. CREATE TABLE: admin_users (for Database-Enforced Authorization)
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. ENABLE ROW LEVEL SECURITY (RLS) ON TABLES
ALTER TABLE public.birthday_wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 5. RLS POLICIES FOR birthday_wishes

-- Policy A: Anonymous Public can INSERT wishes (always defaults to approved = false)
DROP POLICY IF EXISTS "Public users can submit a wish" ON public.birthday_wishes;
CREATE POLICY "Public users can submit a wish" 
ON public.birthday_wishes
FOR INSERT 
WITH CHECK (true);

-- Policy B: Anonymous Public can SELECT ONLY approved wishes
DROP POLICY IF EXISTS "Public users can view approved wishes" ON public.birthday_wishes;
CREATE POLICY "Public users can view approved wishes" 
ON public.birthday_wishes
FOR SELECT 
USING (approved = true);

-- Policy C: Authenticated Admin users (in admin_users) can SELECT ALL wishes
DROP POLICY IF EXISTS "Admins can view all wishes" ON public.birthday_wishes;
CREATE POLICY "Admins can view all wishes" 
ON public.birthday_wishes
FOR SELECT 
USING (
  auth.role() = 'authenticated' AND 
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- Policy D: Authenticated Admin users (in admin_users) can UPDATE wishes
DROP POLICY IF EXISTS "Admins can update wishes" ON public.birthday_wishes;
CREATE POLICY "Admins can update wishes" 
ON public.birthday_wishes
FOR UPDATE 
USING (
  auth.role() = 'authenticated' AND 
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
)
WITH CHECK (
  auth.role() = 'authenticated' AND 
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- Policy E: Authenticated Admin users (in admin_users) can DELETE wishes
DROP POLICY IF EXISTS "Admins can delete wishes" ON public.birthday_wishes;
CREATE POLICY "Admins can delete wishes" 
ON public.birthday_wishes
FOR DELETE 
USING (
  auth.role() = 'authenticated' AND 
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- 6. RLS POLICIES FOR admin_users
DROP POLICY IF EXISTS "Admins can view admin_users list" ON public.admin_users;
CREATE POLICY "Admins can view admin_users list"
ON public.admin_users
FOR SELECT
USING (
  auth.role() = 'authenticated' AND 
  user_id = auth.uid()
);

-- 7. SUPABASE STORAGE BUCKET: birthday-wish-photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('birthday-wish-photos', 'birthday-wish-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy A: Anyone can upload a photo to birthday-wish-photos
DROP POLICY IF EXISTS "Public upload access for wish photos" ON storage.objects;
CREATE POLICY "Public upload access for wish photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'birthday-wish-photos');

-- Storage Policy B: Anyone can view wish photos
DROP POLICY IF EXISTS "Public view access for wish photos" ON storage.objects;
CREATE POLICY "Public view access for wish photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'birthday-wish-photos');

-- Storage Policy C: Admins can delete wish photos
DROP POLICY IF EXISTS "Admin delete access for wish photos" ON storage.objects;
CREATE POLICY "Admin delete access for wish photos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'birthday-wish-photos' AND
  auth.role() = 'authenticated' AND
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);
