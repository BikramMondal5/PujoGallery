-- Create or update RLS policies for posts table

-- Enable Row Level Security for posts table if not already enabled
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- First, drop any existing policies to ensure clean creation
DROP POLICY IF EXISTS "Public Posts Access" ON posts;
DROP POLICY IF EXISTS "Public Posts Insert" ON posts;
DROP POLICY IF EXISTS "Public Posts Update" ON posts;
DROP POLICY IF EXISTS "Public Posts Delete" ON posts;

-- Policy to allow anyone to read posts
CREATE POLICY "Public Posts Access"
ON posts FOR SELECT
USING (true);

-- Policy to allow anyone to insert posts (simplified for all users)
CREATE POLICY "Public Posts Insert"
ON posts FOR INSERT
WITH CHECK (true);

-- Policy to allow anyone to update posts
CREATE POLICY "Public Posts Update"
ON posts FOR UPDATE
USING (true);

-- Policy to allow anyone to delete posts
CREATE POLICY "Public Posts Delete"
ON posts FOR DELETE
USING (true);

-- Enable Row Level Security for comments table if not already enabled
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to read comments
CREATE POLICY IF NOT EXISTS "Public Comments Access"
ON comments FOR SELECT
USING (true);

-- Policy to allow anyone to insert comments
CREATE POLICY IF NOT EXISTS "Public Comments Insert"
ON comments FOR INSERT
WITH CHECK (true);

-- Policy to allow anyone to update comments
CREATE POLICY IF NOT EXISTS "Public Comments Update"
ON comments FOR UPDATE
USING (true)
WITH CHECK (true);

-- Policy to allow anyone to delete comments
CREATE POLICY IF NOT EXISTS "Public Comments Delete"
ON comments FOR DELETE
USING (true);
