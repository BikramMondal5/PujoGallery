# Emergency Fix for RLS Policy Errors in PujoGallery

## The Problem

You're encountering Row-Level Security (RLS) errors that prevent users from creating posts:
- "Error: RLS check error"
- "Error: Error creating post"
- "Error: RLS policy is preventing INSERT"
- "Error: new row violates row-level security policy for table posts"

These all point to **incorrectly configured RLS policies** in your Supabase database.

## Quick Fix Solution

### Method 1: Using the SQL Script (Recommended)

1. **Open your Supabase dashboard**
   - Log in to your Supabase project

2. **Go to the SQL Editor**
   - Click on "SQL Editor" in the left sidebar

3. **Run the SQL Script**
   - Create a new query
   - Open the file `complete_rls_fix.sql` from your project
   - Copy and paste the entire script into the SQL Editor
   - Click "Run" to execute it

4. **Verify the Fix**
   - Go to "Authentication" > "Policies" in the sidebar
   - Check that the "posts" table has SELECT, INSERT, UPDATE, and DELETE policies
   - All should be set to `true` (allowing all operations)

### Method 2: Manual Configuration

If you prefer to make the changes manually:

1. **Go to Authentication > Policies in Supabase**

2. **For the "posts" table:**
   - Delete any existing policies
   - Click "New Policy"
   - Select "Create a policy from scratch"
   - For Policy Name, enter "Allow all operations"
   - For Operations, select ALL
   - For Target roles, select "authenticated" and "anon"
   - For Using expression, enter: `true`
   - For With check expression, enter: `true`
   - Click "Save Policy"

3. **For the "storage.objects" table:**
   - Create a policy that allows operations when `bucket_id = 'pujo_gallery_media'`

## Testing the Fix

1. **Use the built-in test page**
   - Visit `/supabase-test` in your application
   - Click "Run Full Supabase Test" to verify everything works

2. **Try creating a post**
   - Go back to the main app
   - Try creating a text post
   - If it works, the fix was successful

## Need More Help?

If you're still having issues:

1. **Run the comprehensive test**
   - Use the `finalRLSTest()` function
   - Check the console for detailed diagnostics

2. **Common issues:**
   - Make sure your Supabase URL and API key are correct
   - Check that all tables have proper RLS policies
   - Verify the storage bucket exists and is public

## Security Note

The current RLS policies allow all operations without restrictions. For a production environment, you should implement proper authentication and restrict operations based on user roles and ownership.
