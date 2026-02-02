import React, { useState, useEffect } from 'react';
import { Calendar, Tag } from 'lucide-react';
import { cn } from '@/utils/cn';
import { getPublicArticles, type Article } from '@/lib/articleService';

export const PublicArticles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getPublicArticles();
      setArticles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load articles');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (selectedArticle) {
    return (
      <div className="h-full flex flex-col bg-background">
        {/* Article header */}
        <div className="border-b border-border p-4 space-y-3">
          <button
            onClick={() => setSelectedArticle(null)}
            className="text-sm text-primary hover:underline"
          >
            ← Back to articles
          </button>
          <h1 className="text-2xl font-bold">{selectedArticle.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              {formatDate(selectedArticle.created_at)}
            </div>
          </div>
        </div>

        {/* Article content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {selectedArticle.image_url && (
            <img
              src={selectedArticle.image_url}
              alt={selectedArticle.title}
              className="w-full h-auto max-h-96 object-cover rounded-lg"
            />
          )}
          <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground">
            {selectedArticle.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-4">
        <h1 className="text-2xl font-bold mb-2">Articles</h1>
        <p className="text-sm text-muted-foreground">
          {articles.length} article{articles.length !== 1 ? 's' : ''} published
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Loading articles...</p>
          </div>
        )}

        {error && (
          <div className="p-4">
            <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
              {error}
            </div>
          </div>
        )}

        {!isLoading && articles.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No articles yet</p>
          </div>
        )}

        {!isLoading && articles.length > 0 && (
          <div className="grid gap-4 p-4">
            {articles.map(article => (
              <button
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="text-left p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div className="flex gap-4">
                  {article.image_url && (
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-32 h-32 object-cover rounded hidden sm:block"
                    />
                  )}
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {article.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(article.created_at)}
                      </div>
                    </div>
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
