# PujoGallery - Supabase Integration

This guide explains how to set up your Supabase database to work with the PujoGallery application.

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up or log in
2. Create a new project
3. Note down your project URL and anon key (found in Project Settings > API)

### 2. Set Up Environment Variables

1. Copy the `.env.local` file in the project root
2. Replace the placeholder values with your actual Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
```

### 3. Create the Database Schema

1. Go to your Supabase project dashboard
2. Go to the SQL Editor
3. Copy the contents of `schema.sql` from this project
4. Paste and run the SQL in the Supabase SQL Editor

### 4. Create Storage Bucket

1. In your Supabase dashboard, go to Storage
2. Create a new bucket called `pujo_gallery_media`
3. Make sure the bucket has public access enabled

### 5. Run the Application

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Store user posts in Supabase database
- Upload images and videos to Supabase storage
- Store and retrieve comments
- Track likes and shares
- User verification with different badge types

## Database Structure

### Tables

1. **posts** - Stores all user posts
   - Contains user information, post content, media links, and engagement metrics

2. **comments** - Stores comments on posts
   - Links to posts via post_id foreign key

### Storage

- **pujo_gallery_media** - Bucket for storing images and videos
  - /images/ - For post images
  - /videos/ - For post videos
