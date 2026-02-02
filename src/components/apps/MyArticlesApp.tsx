import React, { useState, useEffect } from 'react';
import { Plus, FileText } from 'lucide-react';
import { cn } from '@/utils/cn';
import { ArticleEditor } from '@/components/articles/ArticleEditor';
import { getAllArticles, type Article } from '@/lib/articleService';

export const MyArticlesApp: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setIsLoading(true);
    try {
      const data = await getAllArticles();
      setArticles(data);
    } catch (err) {
      console.error('Failed to load articles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    setIsCreating(false);
    setSelectedArticle(null);
    loadArticles();
  };

  const handleCancel = () => {
    setIsCreating(false);
    setSelectedArticle(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isCreating) {
    return <ArticleEditor onSave={handleSave} onCancel={handleCancel} />;
  }

  if (selectedArticle) {
    return (
      <ArticleEditor
        article={selectedArticle}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Articles</h1>
          <p className="text-sm text-muted-foreground">
            {articles.length} article{articles.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          <Plus size={18} />
          New Article
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Loading articles...</p>
          </div>
        )}

        {!isLoading && articles.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <FileText size={48} className="text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No articles yet</p>
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              Create your first article
            </button>
          </div>
        )}

        {!isLoading && articles.length > 0 && (
          <div className="grid gap-3 p-4">
            {articles.map(article => (
              <button
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="text-left p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors group text-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {article.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(article.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'px-2 py-1 rounded text-xs font-medium whitespace-nowrap',
                        article.status === 'published'
                          ? 'bg-success/10 text-success'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {article.status}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
