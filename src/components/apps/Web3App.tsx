import React, { useMemo, useState } from 'react';
import { ExternalLink, ArrowLeft, Globe, Briefcase, Code, Info, ShieldCheck, Box, User, Terminal, ChevronRight, AlertCircle, Search, RotateCw, ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';

type Web3Project = {
  id: string;
  title: string;
  url: string;
  description: string;
  role: string;
  product: string;
  rule: string;
  technologies: string[];
  process: string;
  status: 'live' | 'prototype' | 'internal';
};

export const Web3App = () => {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'browser'>('list');
  const [browserUrl, setBrowserUrl] = useState<string>('');
  const [isBrowserLoading, setIsBrowserLoading] = useState(true);

  const projects: Web3Project[] = useMemo(
    () => [
      {
        id: 'project-1',
        title: 'MetaMask Blockchain Education',
        url: 'https://learn.metamask.io/',
        description: 'Interactive lessons that explain Web3 fundamentals and how to use MetaMask.',
        role: 'Project Manager Transition',
        product: 'Educational Platform',
        rule: 'Learning & Documentation',
        technologies: ['React', 'Ethers.js', 'Web3.js'],
        process: 'Developing educational content and interactive simulations for blockchain beginners.',
        status: 'live'
      },
      {
        id: 'project-2',
        title: 'Web3 Roadmap',
        url: 'https://roadmap.sh/r/web3-project-management',
        description: 'A roadmap-style learning path for Web3 project management skills.',
        role: 'Curator',
        product: 'Learning Path',
        rule: 'Strategy & Execution',
        technologies: ['Roadmap.sh', 'Community Resources'],
        process: 'Mapping out essential skills and tools for PMs in the decentralized space.',
        status: 'live'
      },
      {
        id: 'project-3',
        title: 'Crypto Career Hub',
        url: 'https://web3.career/',
        description: 'Job board to track roles and requirements across the Web3 ecosystem.',
        role: 'Market Researcher',
        product: 'Job Board',
        rule: 'Market Analysis',
        technologies: ['Web Scraping', 'API Integration'],
        process: 'Analyzing job trends and skill requirements to build a better career platform.',
        status: 'live'
      }
    ],
    []
  );

  const activeProject = useMemo(
    () => projects.find(p => p.id === activeProjectId),
    [projects, activeProjectId]
  );

  const openInBrowser = (url: string) => {
    setBrowserUrl(url);
    setViewMode('browser');
    setIsBrowserLoading(true);
  };

  const handleBack = () => {
    if (viewMode === 'browser') {
      setViewMode('detail');
    } else if (viewMode === 'detail') {
      setViewMode('list');
      setActiveProjectId(null);
    }
  };

  if (viewMode === 'browser') {
    return (
      <div className="flex flex-col h-full bg-background overflow-hidden">
        {/* Browser Header */}
        <div className="flex items-center gap-3 p-3 border-b border-border bg-muted/30">
          <button 
            onClick={handleBack}
            className="p-1.5 hover:bg-muted rounded-md text-muted-foreground transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex-1 flex items-center gap-2 px-3 py-1.5 bg-muted/50 border border-transparent rounded-lg text-sm truncate">
            <Globe size={14} className="text-muted-foreground shrink-0" />
            <span className="truncate text-muted-foreground">{browserUrl}</span>
          </div>
          <button 
            onClick={() => window.open(browserUrl, '_blank', 'noopener,noreferrer')}
            className="p-1.5 hover:bg-muted rounded-md text-muted-foreground transition-colors"
            title="Open in real browser"
          >
            <ExternalLink size={16} />
          </button>
        </div>

        {/* Browser Content */}
        <div className="flex-1 relative bg-white overflow-hidden">
          {isBrowserLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          
          <div className="absolute inset-0 flex flex-col items-center justify-center -z-0 text-muted-foreground p-8 text-center bg-background">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <AlertCircle size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Can't display this website here</h3>
            <p className="text-sm max-w-md text-muted-foreground mb-6">
              Security restrictions prevent this website from loading in an iframe. Click the button below to open it in a new tab.
            </p>
            <button 
              onClick={() => window.open(browserUrl, '_blank', 'noopener,noreferrer')} 
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors shadow-sm text-sm font-medium"
            >
              <ExternalLink size={16} />
              Open in new tab
            </button>
          </div>

          <iframe 
            src={browserUrl} 
            className="w-full h-full border-0 relative z-10"
            onLoad={() => setIsBrowserLoading(false)}
            title="Web3 Browser"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    );
  }

  if (viewMode === 'detail' && activeProject) {
    return (
      <div className="h-full w-full bg-background overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to projects
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                  {activeProject.status}
                </span>
                <span className="text-xs text-muted-foreground">• Web3 Project</span>
              </div>
              <h1 className="text-3xl font-bold">{activeProject.title}</h1>
            </div>
            <button 
              onClick={() => openInBrowser(activeProject.url)}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 font-semibold"
            >
              <Globe size={18} />
              Launch Website
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-4 rounded-2xl border border-border bg-card/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Briefcase size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider">Product</span>
              </div>
              <p className="text-sm font-medium">{activeProject.product}</p>
            </div>
            <div className="p-4 rounded-2xl border border-border bg-card/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <User size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider">Role</span>
              </div>
              <p className="text-sm font-medium">{activeProject.role}</p>
            </div>
            <div className="p-4 rounded-2xl border border-border bg-card/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <ShieldCheck size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider">Rule</span>
              </div>
              <p className="text-sm font-medium">{activeProject.rule}</p>
            </div>
          </div>

          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-2 text-lg font-bold mb-4">
                <Info size={20} className="text-primary" />
                Overview
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {activeProject.description}
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 text-lg font-bold mb-4">
                <Terminal size={20} className="text-primary" />
                Process & Execution
              </div>
              <div className="p-6 rounded-2xl border border-border bg-muted/30 leading-relaxed italic text-foreground/80">
                "{activeProject.process}"
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 text-lg font-bold mb-4">
                <Code size={20} className="text-primary" />
                Technologies
              </div>
              <div className="flex flex-wrap gap-2">
                {activeProject.technologies.map(tech => (
                  <span key={tech} className="px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-background overflow-y-auto">
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-black mb-4 tracking-tight">Web3 Portfolio</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A curated selection of Web3 projects and experiments where I apply product management principles to the decentralized ecosystem.
            </p>
          </div>
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-2xl border border-border">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center text-[10px] font-bold">
                  {i}
                </div>
              ))}
            </div>
            <span className="text-xs font-bold px-2">{projects.length} Projects</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div 
              key={p.id} 
              className="group relative flex flex-col p-6 rounded-[2rem] border border-border bg-card hover:bg-muted/30 transition-all duration-500 cursor-pointer overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1"
              onClick={() => {
                setActiveProjectId(p.id);
                setViewMode('detail');
              }}
            >
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight size={20} className="text-primary" />
              </div>

              <div className="mb-6 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                <Box size={24} />
              </div>

              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{p.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1 leading-relaxed">
                {p.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-auto">
                {p.technologies.slice(0, 2).map(tech => (
                  <span key={tech} className="px-2.5 py-1 rounded-lg bg-muted/50 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    {tech}
                  </span>
                ))}
                {p.technologies.length > 2 && (
                  <span className="px-2.5 py-1 rounded-lg bg-muted/50 text-[10px] font-bold text-muted-foreground">
                    +{p.technologies.length - 2}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
