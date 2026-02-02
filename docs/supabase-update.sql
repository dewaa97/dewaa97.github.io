-- Update database schema untuk categories, tags, dan status

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index untuk category lookups
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Update articles table dengan status dan category_id
ALTER TABLE articles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published'));
ALTER TABLE articles ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL;

-- Create junction table untuk article-category relationships (many-to-many)
CREATE TABLE IF NOT EXISTS article_categories (
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, category_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_article_categories_article ON article_categories(article_id);
CREATE INDEX IF NOT EXISTS idx_article_categories_category ON article_categories(category_id);

-- Update RLS policies
DROP POLICY IF EXISTS "Public articles are viewable by everyone" ON articles;

CREATE POLICY "Public articles are viewable by everyone" 
  ON articles FOR SELECT 
  USING (status = 'published');

-- Allow viewing categories
CREATE TABLE IF NOT EXISTS public_categories AS SELECT * FROM categories;
ALTER TABLE public_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are public" 
  ON public_categories FOR SELECT 
  USING (true);
