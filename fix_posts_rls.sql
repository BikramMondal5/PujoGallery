-- SIMPLE RLS FIX FOR POSTS TABLE
-- Run this in the Supabase SQL Editor

-- 1. Enable RLS on posts table
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 2. First remove any existing policies that might be conflicting
DROP POLICY IF EXISTS "Public Posts Access" ON posts;
DROP POLICY IF EXISTS "Public Posts Insert" ON posts;
DROP POLICY IF EXISTS "Public Posts Update" ON posts;
DROP POLICY IF EXISTS "Public Posts Delete" ON posts;
DROP POLICY IF EXISTS "Enable read access for all users" ON posts;
DROP POLICY IF EXISTS "Enable insert access for all users" ON posts;
DROP POLICY IF EXISTS "Enable update access for all users" ON posts;
DROP POLICY IF EXISTS "Enable delete access for all users" ON posts;

-- 3. Create simple open policies (for development/testing)
-- Policy to allow anyone to read posts
CREATE POLICY "Allow Select" 
ON posts FOR SELECT 
USING (true);

-- Policy to allow anyone to insert posts
CREATE POLICY "Allow Insert" 
ON posts FOR INSERT 
WITH CHECK (true);

-- Policy to allow anyone to update posts
CREATE POLICY "Allow Update" 
ON posts FOR UPDATE 
USING (true);

-- Policy to allow anyone to delete posts
CREATE POLICY "Allow Delete" 
ON posts FOR DELETE 
USING (true);

-- 4. Verify policies were created
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'posts';
