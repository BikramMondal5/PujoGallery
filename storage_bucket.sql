-- Create or replace the storage bucket
CREATE BUCKET IF NOT EXISTS pujo_gallery_media;

-- Set the bucket to public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'pujo_gallery_media';

-- Policy to allow anyone to read from the public bucket
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'pujo_gallery_media');

-- Policy to allow authenticated users to upload media
CREATE POLICY "Public Upload Access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'pujo_gallery_media');

-- Policy to allow anyone to update their own objects
CREATE POLICY "Public Update Access"
ON storage.objects FOR UPDATE
USING (bucket_id = 'pujo_gallery_media');

-- Policy to allow anyone to delete their own objects
CREATE POLICY "Public Delete Access"
ON storage.objects FOR DELETE
USING (bucket_id = 'pujo_gallery_media');
