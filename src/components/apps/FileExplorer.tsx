import React, { useMemo, useState } from 'react';
import { Folder, ChevronRight, Home, ArrowLeft, LucideIcon, ExternalLink, X, Route } from 'lucide-react';
import { cn } from '@/utils/cn';

interface FileSystemItem {
    id: string;
    name: string;
    type: 'folder' | 'file';
    icon: LucideIcon;
    data?: unknown;
    content?: string;
    url?: string;
    embedUrl?: string;
}

export const FileExplorer = () => {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [activeEmbed, setActiveEmbed] = useState<null | { title: string; url: string; embedUrl: string }>(null);

  const nodes = useMemo<Record<string, FileSystemItem>>(
    () => ({
      learning: { id: 'learning', name: 'Learning', type: 'folder', icon: Folder },
      projectManagement: { id: 'project-management', name: 'Project Management', type: 'folder', icon: Folder },
      itProjectManagement: {
        id: 'it-project-management',
        name: 'IT Project Management.roadmap',
        type: 'file',
        icon: Route,
        url: 'https://roadmap.sh/r/it-project-management-jwmbm',
        embedUrl: 'https://roadmap.sh/r/it-project-management-jwmbm',
      },
    }),
    []
  );

  const getItems = (): FileSystemItem[] => {
    if (currentPath.length === 0) return [nodes.learning];
    if (currentPath[0] === 'learning') {
      if (currentPath.length === 1) return [nodes.projectManagement];
      if (currentPath.length === 2 && currentPath[1] === 'project-management') return [nodes.itProjectManagement];
    }
    return [];
  };

  const handleItemClick = (item: FileSystemItem) => {
    setSelectedItem(item.id);
  };

  const handleItemDoubleClick = (item: FileSystemItem) => {
    if (item.type === 'folder') {
        if (item.id === 'learning') setCurrentPath(['learning']);
        else if (currentPath[0] === 'learning' && currentPath.length === 1 && item.id === 'project-management') setCurrentPath(['learning', 'project-management']);
        setSelectedItem(null);
    } else {
      if (item.embedUrl && item.url) {
        setActiveEmbed({ title: item.name, url: item.url, embedUrl: item.embedUrl });
      } else if (item.url) {
        window.open(item.url, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const items = getItems();

  return (
    <div className="flex h-full bg-background text-foreground select-none">
      {/* Sidebar */}
      <div className="w-48 bg-muted/30 border-r border-border p-2 flex flex-col gap-1">
        <button onClick={() => setCurrentPath([])} className={cn("flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-muted transition-colors", currentPath.length === 0 && "bg-muted font-medium")}>
            <Home size={16} /> Home
        </button>
        <button onClick={() => setCurrentPath(['learning'])} className={cn("flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-muted transition-colors", currentPath[0] === 'learning' && "bg-muted font-medium")}>
            <Folder size={16} /> Learning
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Breadcrumb / Toolbar */}
        <div className="h-10 border-b border-border flex items-center px-4 gap-2 bg-muted/10">
            <button 
                onClick={() => setCurrentPath(prev => prev.slice(0, -1))}
                disabled={currentPath.length === 0}
                className="p-1 hover:bg-muted rounded-md disabled:opacity-30 transition-colors"
            >
                <ArrowLeft size={16} />
            </button>
            <div className="flex items-center text-sm text-muted-foreground">
                <Home size={14} className="mr-1" />
                {currentPath.map((p, i) => (
                    <React.Fragment key={i}>
                        <ChevronRight size={14} className="mx-1" />
                        <span>{p === 'learning' ? 'Learning' : p === 'project-management' ? 'Project Management' : p}</span>
                    </React.Fragment>
                ))}
            </div>
        </div>

        {/* Grid */}
        <div className="flex-1 p-4 grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] grid-rows-[min-content] gap-4 content-start overflow-y-auto bg-card">
            {items.map(item => (
                <div 
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    onDoubleClick={() => handleItemDoubleClick(item)}
                    className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors border border-transparent group",
                        selectedItem === item.id && "bg-accent/10 border-accent/20"
                    )}
                >
                    <item.icon size={48} className={cn("text-muted-foreground transition-colors", item.type === 'folder' ? "text-blue-400 group-hover:text-blue-500" : "text-gray-400 group-hover:text-gray-500")} strokeWidth={1} />
                    <span className="text-sm text-center line-clamp-2 w-full break-words text-foreground/90">{item.name}</span>
                </div>
            ))}
            {items.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground mt-10">This folder is empty.</div>
            )}
        </div>
      </div>

      {activeEmbed && (
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
              <div className="text-sm font-semibold truncate">{activeEmbed.title}</div>
              <button
                className={cn('h-8 w-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center')}
                onClick={() => setActiveEmbed(null)}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4">
              <div className="text-xs text-muted-foreground">
                If this page can’t be displayed inside the app (some sites block embeds), use “Open full page”.
              </div>
              <iframe
                src={activeEmbed.embedUrl}
                title={activeEmbed.title}
                width="100%"
                frameBorder={0}
                className="mt-3 w-full rounded-xl border border-border bg-white"
                style={{ height: 'min(560px, 65vh)' }}
              />

              <div className="mt-3 flex items-center justify-end gap-2">
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
