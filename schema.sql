-- Schema for PujoGallery Supabase Database

-- Posts table
CREATE TABLE posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_name VARCHAR NOT NULL,
  user_image VARCHAR NOT NULL,
  user_verified BOOLEAN DEFAULT FALSE,
  user_badge_type VARCHAR DEFAULT 'standard',
  content TEXT NOT NULL,
  image VARCHAR,
  video VARCHAR,
  type VARCHAR DEFAULT 'regular',
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  is_own_post BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_name VARCHAR NOT NULL,
  user_image VARCHAR NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX comments_post_id_idx ON comments(post_id);
CREATE INDEX posts_type_idx ON posts(type);
CREATE INDEX posts_created_at_idx ON posts(created_at DESC);

-- Storage Policies
-- Enable public access to uploaded files in the pujo_gallery_media bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('pujo_gallery_media', 'pujo_gallery_media', true);

-- Policy to allow anyone to read from the public bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'pujo_gallery_media');

-- Policy to allow authenticated users to upload media
CREATE POLICY "Auth Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'pujo_gallery_media');

-- Row Level Security for posts and comments
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to read posts
CREATE POLICY "Public Posts Access" ON posts FOR SELECT USING (true);

-- Policy to allow anyone to read comments
CREATE POLICY "Public Comments Access" ON comments FOR SELECT USING (true);
