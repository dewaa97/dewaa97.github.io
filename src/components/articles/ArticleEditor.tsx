import React, { useState, useEffect } from 'react';
import { Plus, X, Save, Trash2, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/utils/cn';
import { RichTextEditor } from '@/components/articles/RichTextEditor';
import {
  createArticle,
  updateArticle,
  deleteArticle,
  getCategories,
  getOrCreateCategory,
  type Article,
  type Category,
} from '@/lib/articleService';
import { formatFileSize } from '@/lib/imageCompression';

interface ArticleEditorProps {
  article?: Article | null;
  onSave?: (article: Article) => void;
  onCancel?: () => void;
}

export const ArticleEditor: React.FC<ArticleEditorProps> = ({ article, onSave, onCancel }) => {
  const [title, setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(article?.content || '');
  const [status, setStatus] = useState<'draft' | 'published'>(article?.status || 'draft');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(article?.image_url || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    setImageFile(file);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const cat = await getOrCreateCategory(newCategoryName);
      setCategories([...categories, cat]);
      setSelectedCategories([...selectedCategories, cat.id]);
      setNewCategoryName('');
    } catch (err) {
      setError('Failed to create category');
      console.error(err);
    }
  };

  const toggleCategory = (catId: string) => {
    setSelectedCategories(prev =>
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    if (selectedCategories.length === 0) {
      setError('Please select at least one category');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (article) {
        // Update existing article
        await updateArticle(article.id, {
          title,
          content,
          status,
          categoryIds: selectedCategories,
        });
      } else {
        // Create new article
        const newArticle = await createArticle(
          title,
          content,
          selectedCategories,
          imageFile,
          status
        );
        if (onSave) onSave(newArticle);
      }

      // Reset form
      setTitle('');
      setContent('');
      setStatus('draft');
      setSelectedCategories([]);
      setImageFile(null);
      setImagePreview('');

      if (onSave && article) {
        onSave(article);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save article');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!article) return;
    if (!confirm('Are you sure you want to delete this article?')) return;

    setIsLoading(true);
    try {
      await deleteArticle(article.id, article.image_url);
      if (onCancel) onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete article');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{article ? 'Edit Article' : 'New Article'}</h2>
        {article && (
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Content area - scrollable */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article title..."
            className="w-full px-3 py-2 rounded-lg bg-muted border border-border outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Status</label>
          <div className="flex gap-3">
            <button
              onClick={() => setStatus('draft')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium',
                status === 'draft'
                  ? 'bg-muted text-foreground'
                  : 'bg-transparent border border-border text-muted-foreground hover:bg-muted'
              )}
            >
              <EyeOff size={16} />
              Draft
            </button>
            <button
              onClick={() => setStatus('published')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium',
                status === 'published'
                  ? 'bg-success/10 text-success'
                  : 'bg-transparent border border-border text-muted-foreground hover:bg-muted'
              )}
            >
              <Eye size={16} />
              Published
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Categories</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={cn(
                  'px-3 py-1 rounded-full text-sm transition-colors',
                  selectedCategories.includes(cat.id)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/70'
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Add new category */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleAddCategory();
              }}
              placeholder="New category..."
              className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border outline-none focus:border-primary transition-colors text-sm"
            />
            <button
              onClick={handleAddCategory}
              disabled={!newCategoryName.trim()}
              className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Image upload */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Image</label>
          <div className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-input"
            />
            <label htmlFor="image-input" className="cursor-pointer block">
              {imagePreview ? (
                <div className="space-y-2">
                  <img src={imagePreview} alt="Preview" className="max-h-40 mx-auto rounded" />
                  <p className="text-xs text-muted-foreground">Click to change</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm">Click to upload image</p>
                  <p className="text-xs text-muted-foreground">Max 2MB (auto-compressed to WebP)</p>
                </div>
              )}
            </label>
          </div>
          {imageFile && (
            <p className="text-xs text-muted-foreground">
              File: {formatFileSize(imageFile.size)}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2 flex-1 flex flex-col min-h-0">
          <label className="text-sm font-semibold">Content</label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 pt-4 border-t border-border">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 font-medium"
        >
          <Save size={16} />
          {article ? 'Update' : 'Create'} Article
        </button>
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/70 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
