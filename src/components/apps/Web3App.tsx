import React, { useMemo, useState } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { cn } from '@/utils/cn';

type Resource = {
  title: string;
  url: string;
  description: string;
  embedUrl?: string;
  embedButtonLabel?: string;
};

export const Web3App = () => {
  const [activeEmbed, setActiveEmbed] = useState<Resource | null>(null);

  const resources: Resource[] = useMemo(
    () => [
      {
        title: 'MetaMask Blockchain Education',
        url: 'https://learn.metamask.io/',
        description: 'Interactive lessons that explain Web3 fundamentals and how to use MetaMask.',
      },
      {
        title: 'Project Manager for Web3',
        url: 'https://roadmap.sh/r/web3-project-management',
        embedUrl: 'https://roadmap.sh/r/embed?id=697520d65c049b2765ac2554',
        embedButtonLabel: 'View learning path',
        description: 'A roadmap-style learning path for Web3 project management skills.',
      },
      {
        title: 'Crypto Jobs',
        url: 'https://web3.career/',
        description: 'Job board to track roles and requirements across the Web3 ecosystem.',
      },
    ],
    []
  );

  return (
    <div className="h-full w-full bg-background text-foreground">
      <div className="h-full w-full max-w-3xl mx-auto p-4 md:p-6">
        <div className="mb-6">
          <div className="text-xl font-bold">Web3</div>
          <div className="text-sm text-muted-foreground mt-1">
            A small collection of websites I use to learn Web3 as a Project Manager transitioning into the space.
          </div>
        </div>

        <div className="grid gap-4">
          {resources.map((r) => (
            <div key={r.url} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{r.title}</div>
                  <div className="text-xs text-muted-foreground mt-1 break-all">{r.url}</div>
                  <div className="text-sm mt-3 text-foreground/90">{r.description}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {r.embedUrl && (
                    <button
                      className={cn(
                        'h-9 px-3 rounded-xl text-sm font-semibold bg-muted text-foreground hover:bg-muted/70 transition-colors',
                        'flex items-center gap-2'
                      )}
                      onClick={() => setActiveEmbed(r)}
                    >
                      {r.embedButtonLabel ?? 'View'}
                    </button>
                  )}
                  <button
                    className={cn(
                      'h-9 px-3 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors',
                      'flex items-center gap-2'
                    )}
                    onClick={() => window.open(r.url, '_blank', 'noopener,noreferrer')}
                  >
                    <ExternalLink size={16} />
                    Open
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeEmbed?.embedUrl && (
        <div
          className={cn(
            'fixed inset-0 z-[200] flex items-center justify-center p-4',
            'bg-black/50 backdrop-blur-sm'
          )}
          onClick={() => setActiveEmbed(null)}
        >
          <div
            className="w-full max-w-5xl rounded-2xl border border-border bg-background text-foreground shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-12 px-4 flex items-center justify-between border-b border-border">
              <div className="text-sm font-semibold truncate">{activeEmbed.title} — Learning Path</div>
              <button
                className={cn(
                  'h-8 w-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center'
                )}
                onClick={() => setActiveEmbed(null)}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4">
              <iframe
                src={activeEmbed.embedUrl}
                title={`${activeEmbed.title} learning path`}
                width="100%"
                frameBorder={0}
                className="w-full rounded-xl border border-border bg-white"
                style={{ height: 'min(500px, 60vh)' }}
              />

              <div className="mt-3 flex items-center justify-end">
                <button
                  className={cn(
                    'h-9 px-3 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors',
                    'flex items-center gap-2'
                  )}
                  onClick={() => window.open(activeEmbed.url, '_blank', 'noopener,noreferrer')}
                >
                  <ExternalLink size={16} />
                  Open full page
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
