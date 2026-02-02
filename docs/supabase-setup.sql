-- Copy and paste this SQL into Supabase SQL Editor to setup the database schema

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_articles_is_public ON articles(is_public);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);

-- Enable Row Level Security (optional, for added security)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Allow public read on public articles
CREATE POLICY "Public articles are viewable by everyone" 
  ON articles FOR SELECT 
  USING (is_public = true);

-- Create storage bucket for images (do this in Supabase dashboard: Storage > Create Bucket)
-- Name: article-images
-- Public: true
-- File size limit: 5MB recommended
