# URGENT: Fix RLS Policy Issues in Supabase

You're encountering Row-Level Security (RLS) policy errors that prevent users from creating posts. Follow these quick steps to fix them:

## SIMPLE FIX: Run This SQL

1. Log in to your Supabase dashboard
2. Go to "SQL Editor" in the sidebar
3. Create a new query
4. Copy and paste this ENTIRE code block:

```sql
-- SIMPLE RLS FIX FOR POSTS TABLE

-- 1. Enable RLS on posts table (if not already enabled)
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
DROP POLICY IF EXISTS "Allow Select" ON posts;
DROP POLICY IF EXISTS "Allow Insert" ON posts;
DROP POLICY IF EXISTS "Allow Update" ON posts;
DROP POLICY IF EXISTS "Allow Delete" ON posts;

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

-- 4. Create Storage Bucket if it doesn't exist
-- Create bucket if it doesn't exist
CREATE BUCKET IF NOT EXISTS pujo_gallery_media;

-- Set the bucket to public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'pujo_gallery_media';

-- Policy to allow anyone to read from the public bucket
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'pujo_gallery_media');

-- Policy to allow authenticated users to upload media
DROP POLICY IF EXISTS "Public Upload Access" ON storage.objects;
CREATE POLICY "Public Upload Access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'pujo_gallery_media');

-- 5. Verify policies were created
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'posts';

SELECT tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'objects';
```

5. Click "Run" to execute the SQL

## How To Verify It Worked

1. After running the SQL, go back to your PujoGallery app
2. Try to create a post with text
3. If it works, the RLS issue is fixed!

## Storage Bucket Fix

If you're still having issues with image uploads ("Bucket not found" error):

1. Go to "Storage" in the Supabase sidebar
2. Click "Create a new bucket"
3. Enter "pujo_gallery_media" as the bucket name
4. Check "Public bucket" to allow public access to files
5. Click "Create bucket"

## Testing

To verify that everything is working correctly, you can:

1. Run the testSupabaseConnection function from the supabase-test.ts file
2. This will check both the connection and RLS policies
3. It will tell you exactly what's working and what's not

If you still have issues, please check:
- That the SQL commands ran without errors
- The bucket exists in the Storage section
- Your API keys are correct in the environment variables
