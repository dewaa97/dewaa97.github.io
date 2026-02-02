-- Proper RLS Policies for Articles Table
-- Run this in Supabase SQL Editor

-- First, add user_id column to articles table (if not already there)
ALTER TABLE articles ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE articles ADD CONSTRAINT articles_user_id_fk FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_articles_user_id ON articles(user_id);

-- Enable RLS on articles table
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if any conflict)
DROP POLICY IF EXISTS "Allow anyone to create articles" ON articles;
DROP POLICY IF EXISTS "Allow users to update their own articles" ON articles;
DROP POLICY IF EXISTS "Allow users to delete their own articles" ON articles;
DROP POLICY IF EXISTS "Public articles are viewable by everyone" ON articles;
DROP POLICY IF EXISTS "Anyone can view all articles" ON articles;
DROP POLICY IF EXISTS "Public articles are viewable by everyone" ON articles;

-- Policy 1: Allow authenticated users to create articles
CREATE POLICY "Authenticated users can create articles"
  ON articles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy 2: Allow users to view their own articles
CREATE POLICY "Users can view own articles"
  ON articles FOR SELECT
  USING (auth.uid() = user_id);

-- Policy 3: Allow users to view published articles (public)
CREATE POLICY "Everyone can view published articles"
  ON articles FOR SELECT
  USING (status = 'published');

-- Policy 4: Allow users to update their own articles
CREATE POLICY "Users can update own articles"
  ON articles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy 5: Allow users to delete their own articles
CREATE POLICY "Users can delete own articles"
  ON articles FOR DELETE
  USING (auth.uid() = user_id);

-- Also add RLS policies for categories table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view categories" ON categories;
CREATE POLICY "Everyone can view categories"
  ON categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can create categories" ON categories;
CREATE POLICY "Authenticated users can create categories"
  ON categories FOR INSERT
  WITH CHECK (true);

-- RLS for article_categories junction table
ALTER TABLE article_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view article categories" ON article_categories;
CREATE POLICY "Everyone can view article categories"
  ON article_categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can manage their article categories" ON article_categories;
CREATE POLICY "Users can manage their article categories"
  ON article_categories FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM articles 
      WHERE articles.id = article_categories.article_id 
      AND articles.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete their article categories" ON article_categories;
CREATE POLICY "Users can delete their article categories"
  ON article_categories FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM articles 
      WHERE articles.id = article_categories.article_id 
      AND articles.user_id = auth.uid()
    )
  );
