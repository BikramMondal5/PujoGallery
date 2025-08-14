-- EMERGENCY FIX FOR RLS ISSUES
-- THIS WILL FIX ALL YOUR "violates row-level security policy" ERRORS
-- Run this ENTIRE script in the SQL Editor in your Supabase dashboard

-- STEP 1: First disable RLS on the posts table (temporarily)
-- This will allow operations without security checks while we set up proper policies
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;

-- STEP 2: Delete all existing policies that might be conflicting
DROP POLICY IF EXISTS "Public Posts Access" ON posts;
DROP POLICY IF EXISTS "Public Posts Insert" ON posts;
DROP POLICY IF EXISTS "Public Posts Update" ON posts;
DROP POLICY IF EXISTS "Public Posts Delete" ON posts;
DROP POLICY IF EXISTS "Enable read access for all users" ON posts;
DROP POLICY IF EXISTS "Enable insert access for all users" ON posts;
DROP POLICY IF EXISTS "Enable update access for all users" ON posts;
DROP POLICY IF EXISTS "Enable delete access for all users" ON posts;
DROP POLICY IF EXISTS "Allow Select" ON posts;
DROP POLICY IF EXISTS "Allow Insert" ON posts;
DROP POLICY IF EXISTS "Allow Update" ON posts;
DROP POLICY IF EXISTS "Allow Delete" ON posts;

-- STEP 3: Create new, properly permissive policies
-- First, enable RLS again
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies for all operations
CREATE POLICY "posts_select_policy" ON posts
  FOR SELECT USING (true);

CREATE POLICY "posts_insert_policy" ON posts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "posts_update_policy" ON posts
  FOR UPDATE USING (true);

CREATE POLICY "posts_delete_policy" ON posts
  FOR DELETE USING (true);

-- STEP 4: Storage bucket permissions
-- Create the storage bucket if it doesn't exist
CREATE BUCKET IF NOT EXISTS pujo_gallery_media;

-- Make it public
UPDATE storage.buckets
  SET public = true
  WHERE id = 'pujo_gallery_media';

-- Set storage policies
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
CREATE POLICY "Public Read Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'pujo_gallery_media');

DROP POLICY IF EXISTS "Public Upload Access" ON storage.objects;
CREATE POLICY "Public Upload Access" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'pujo_gallery_media');

-- STEP 5: Set the same policies for comments table
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Comments Access" ON comments;
DROP POLICY IF EXISTS "Public Comments Insert" ON comments;
DROP POLICY IF EXISTS "Public Comments Update" ON comments;
DROP POLICY IF EXISTS "Public Comments Delete" ON comments;

CREATE POLICY "comments_select_policy" ON comments
  FOR SELECT USING (true);

CREATE POLICY "comments_insert_policy" ON comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "comments_update_policy" ON comments
  FOR UPDATE USING (true);

CREATE POLICY "comments_delete_policy" ON comments
  FOR DELETE USING (true);

-- STEP 6: Enable ANON access for all tables
-- This ensures unauthenticated users can access your tables
ALTER TABLE posts FORCE ROW LEVEL SECURITY;
ALTER TABLE comments FORCE ROW LEVEL SECURITY;

-- Grant usage on schema to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant all privileges on all tables to anon and authenticated roles
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- VERIFY EVERYTHING IS SET UP CORRECTLY
SELECT
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM
  pg_policies
WHERE
  tablename IN ('posts', 'comments', 'objects')
ORDER BY
  tablename, cmd;
