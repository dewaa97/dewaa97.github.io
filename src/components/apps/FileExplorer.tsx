import React, { useState } from 'react';
import { Folder, FileText, ChevronRight, Home, ArrowLeft, LucideIcon } from 'lucide-react';
import projectsData from '@/data/projects.json';
import { cn } from '@/utils/cn';

interface FileSystemItem {
    id: string;
    name: string;
    type: 'folder' | 'file';
    icon: LucideIcon;
    data?: unknown;
    content?: string;
    url?: string;
}

export const FileExplorer = () => {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const getItems = (): FileSystemItem[] => {
    if (currentPath.length === 0) {
        return [
            { id: 'projects', name: 'Projects', type: 'folder', icon: Folder },
            { id: 'documents', name: 'Documents', type: 'folder', icon: Folder },
            { id: 'resume.pdf', name: 'Resume.pdf', type: 'file', icon: FileText },
        ];
    }
    if (currentPath[0] === 'projects') {
        if (currentPath.length === 1) {
            return projectsData.map(p => ({
                id: p.id,
                name: p.name,
                type: 'folder',
                icon: Folder,
                data: p
            }));
        }
        // Inside a project folder
        const projectId = currentPath[1];
        const project = projectsData.find(p => p.id === projectId);
        if (project) {
            return [
                { id: 'readme', name: 'README.md', type: 'file', icon: FileText, content: project.description },
                { id: 'link', name: 'Website.url', type: 'file', icon: FileText, url: project.url },
            ];
        }
    }
    return [];
  };

  const handleItemClick = (item: FileSystemItem) => {
    setSelectedItem(item.id);
  };

  const handleItemDoubleClick = (item: FileSystemItem) => {
    if (item.type === 'folder') {
        if (item.id === 'projects') setCurrentPath(['projects']);
        else if (currentPath[0] === 'projects' && currentPath.length === 1) setCurrentPath(['projects', item.id]);
        else if (item.id === 'documents') setCurrentPath(['documents']);
        setSelectedItem(null);
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
        <button onClick={() => setCurrentPath(['projects'])} className={cn("flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-muted transition-colors", currentPath[0] === 'projects' && "bg-muted font-medium")}>
            <Folder size={16} /> Projects
        </button>
        <button onClick={() => setCurrentPath(['documents'])} className={cn("flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-muted transition-colors", currentPath[0] === 'documents' && "bg-muted font-medium")}>
            <Folder size={16} /> Documents
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
                        <span>{p === 'projects' ? 'Projects' : p === 'documents' ? 'Documents' : projectsData.find(x => x.id === p)?.name || p}</span>
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
    </div>
  );
};