-- Fix RLS policies for article creation
-- Run this in Supabase SQL Editor if articles can't be created

-- Allow anyone to INSERT articles (for MVP/testing - use auth later)
CREATE POLICY "Allow anyone to create articles"
  ON articles FOR INSERT
  WITH CHECK (true);

-- Allow anyone to UPDATE their own articles (when auth added)
CREATE POLICY "Allow users to update their own articles"
  ON articles FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow anyone to DELETE their own articles (when auth added)
CREATE POLICY "Allow users to delete their own articles"
  ON articles FOR DELETE
  USING (true);

-- Keep public read policy
CREATE POLICY "Public articles are viewable by everyone"
  ON articles FOR SELECT
  USING (status = 'published');

-- Allow anyone to view draft articles (for testing)
CREATE POLICY "Anyone can view all articles"
  ON articles FOR SELECT
  USING (true);
