import React from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/utils/cn';

type Resource = {
  title: string;
  url: string;
  description: string;
};

export const Web3App = () => {
  const resources: Resource[] = [
    {
      title: 'MetaMask Blockchain Education',
      url: 'https://learn.metamask.io/',
      description: 'Interactive lessons that explain Web3 fundamentals and how to use MetaMask.',
    },
    {
      title: 'Project Manager for Web3',
      url: 'https://roadmap.sh/ai/roadmap/web3-project-management-o4b4p',
      description: 'A roadmap-style learning path focused on Web3 project management skills.',
    },
    {
      title: 'Crypto Jobs',
      url: 'https://web3.career/',
      description: 'Job board to track roles and requirements across the Web3 ecosystem.',
    },
  ];

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
                <button
                  className={cn(
                    'h-9 px-3 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shrink-0',
                    'flex items-center gap-2'
                  )}
                  onClick={() => window.open(r.url, '_blank', 'noopener,noreferrer')}
                >
                  <ExternalLink size={16} />
                  Open
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
