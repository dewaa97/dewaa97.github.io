import { supabase } from '@/lib/supabase';
import { compressImage } from '@/lib/imageCompression';

export interface Article {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  status: 'draft' | 'published';
  category_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

/**
 * Get or create category by name
 */
export async function getOrCreateCategory(name: string): Promise<Category> {
  const slug = name.toLowerCase().replace(/\s+/g, '-');

  // Try to get existing category
  const { data: existing, error: getError } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (existing) return existing;
  if (getError && getError.code !== 'PGRST116') throw getError; // Not "not found" error

  // Create new category if not exists
  const { data: created, error: createError } = await supabase
    .from('categories')
    .insert([{ name, slug }])
    .select()
    .single();

  if (createError) throw createError;
  return created;
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
}

/**
 * Delete category (only if no articles use it)
 */
export async function deleteCategory(id: string): Promise<void> {
  // Check if category has articles
  const { count, error: countError } = await supabase
    .from('article_categories')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', id);

  if (countError) throw countError;
  if (count && count > 0) {
    throw new Error('Cannot delete category with articles');
  }

  // Delete category
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * Create new article with categories
 */
export async function createArticle(
  title: string,
  content: string,
  categoryIds: string[],
  imageFile: File | null,
  status: 'draft' | 'published' = 'draft'
): Promise<Article> {
  let imageUrl: string | undefined;

  // Upload and compress image if provided
  if (imageFile) {
    const compressedBlob = await compressImage(imageFile);
    const fileName = `${Date.now()}_${imageFile.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase()}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('article-images')
      .upload(fileName, compressedBlob, {
        contentType: 'image/webp',
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('article-images')
      .getPublicUrl(uploadData.path);
    
    imageUrl = data.publicUrl;
  }

  // Insert article into database
  const { data, error } = await supabase
    .from('articles')
    .insert([
      {
        title,
        content,
        image_url: imageUrl,
        status,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  // Add categories (optional)
  if (categoryIds.length > 0) {
    const { error: categoryError } = await supabase
      .from('article_categories')
      .insert(
        categoryIds.map(catId => ({
          article_id: data.id,
          category_id: catId,
        }))
      );

    if (categoryError) {
      console.error('Warning: Failed to add categories:', categoryError);
      // Don't throw - categories are optional
    }
  }

  return data;
}

/**
 * Get all published articles with categories
 */
export async function getPublicArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Get all articles (for personal mode)
 */
export async function getAllArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Get single article by ID
 */
export async function getArticle(id: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  return data;
}

/**
 * Update article with categories
 */
export async function updateArticle(
  id: string,
  updates: Partial<Article> & { categoryIds?: string[] }
): Promise<Article> {
  const { categoryIds, ...articleUpdates } = updates;

  // Update article
  const { data, error } = await supabase
    .from('articles')
    .update({
      ...articleUpdates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  // Update categories if provided
  if (categoryIds !== undefined) {
    // Delete existing categories
    await supabase
      .from('article_categories')
      .delete()
      .eq('article_id', id);

    // Add new categories
    if (categoryIds.length > 0) {
      const { error: categoryError } = await supabase
        .from('article_categories')
        .insert(
          categoryIds.map(catId => ({
            article_id: id,
            category_id: catId,
          }))
        );

      if (categoryError) throw categoryError;
    }
  }

  return data;
}

/**
 * Delete article and its image
 */
export async function deleteArticle(id: string, imageUrl?: string): Promise<void> {
  // Delete image from storage if exists
  if (imageUrl) {
    const fileName = imageUrl.split('/').pop();
    if (fileName) {
      await supabase.storage
        .from('article-images')
        .remove([fileName])
        .catch(() => {
          // Ignore error if image doesn't exist
        });
    }
  }

  // Delete article categories
  await supabase
    .from('article_categories')
    .delete()
    .eq('article_id', id);

  // Delete article from database
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * Toggle article status between draft and published
 */
export async function toggleArticleStatus(id: string, status: 'draft' | 'published'): Promise<Article> {
  return updateArticle(id, { status });
}
