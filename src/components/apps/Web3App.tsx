import React, { useMemo, useState } from 'react';
import { ExternalLink, ArrowLeft, Globe, Briefcase, Code, Info, ShieldCheck, Box, User, Terminal, ChevronRight, AlertCircle, BookOpen, Sparkles, LayoutGrid, LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

type Resource = {
  title: string;
  url: string;
  description: string;
};

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

const ProjectIcon = ({ url, title, size = 20 }: { url: string; title: string; size?: number }) => {
  const domain = useMemo(() => {
    try {
      return new URL(url).hostname;
    } catch {
      return '';
    }
  }, [url]);

  const faviconUrl = `https://unavatar.io/${domain}?fallback=https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  
  if (!domain) {
    return <Box size={size} />;
  }

  return (
    <img
      src={faviconUrl}
      alt={title}
      className={cn(
        "object-contain",
        size <= 24 ? "w-6 h-6" : "w-10 h-10"
      )}
      onError={(e) => {
        (e.target as HTMLImageElement).src = `https://unavatar.io/${domain}?fallback=https://api.dicebear.com/7.x/initials/svg?seed=${title}`;
      }}
    />
  );
};

export const Web3App = () => {
  const [activeTab, setActiveTab] = useState<'resources' | 'portfolio'>('resources');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'browser'>('list');
  const [browserUrl, setBrowserUrl] = useState<string>('');
  const [isBrowserLoading, setIsBrowserLoading] = useState(true);

  const resources: Resource[] = useMemo(
    () => [
      {
        title: 'MetaMask Blockchain Education',
        url: 'https://learn.metamask.io/',
        description: 'Interactive lessons that explain Web3 fundamentals and how to use MetaMask.',
      },
      {
        title: 'Web3 Roadmap',
        url: 'https://roadmap.sh/r/web3-project-management',
        description: 'A roadmap-style learning path for Web3 project management skills.',
      },
      {
        title: 'Crypto Career Hub',
        url: 'https://web3.career/',
        description: 'Job board to track roles and requirements across the Web3 ecosystem.',
      },
    ],
    []
  );

  const projects: Web3Project[] = useMemo(
    () => [
      {
        id: 'taylor-swift-tickets',
        title: 'Taylor Swift Ticket Concert Selling',
        url: 'https://web3-learning-ticket-concert-selling.pages.dev/',
        description: 'A technical simulation for learning Web3 development. This project demonstrates a complete end-to-end flow for decentralized ticket sales on the Ethereum Sepolia Testnet, featuring secure smart contracts and a modern responsive frontend.',
        role: 'Fullstack AI Orchestrator',
        product: 'Web3 Ticketing DApp',
        rule: 'AI-Powered Development',
        technologies: ['Solidity', 'Next.js 15', 'TypeScript', 'Tailwind CSS v4', 'Ethers.js v6', 'Hardhat', 'OpenZeppelin'],
        process: 'Developed entirely using AI orchestration, this project bridges on-chain logic with a production-ready frontend. The smart contracts handle ticket availability, secure payments, and reentrancy protection, while the frontend provides real-time data fetching and seamless wallet integration.',
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

  const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: LucideIcon }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setViewMode('list');
        setActiveProjectId(null);
      }}
      className={cn(
        'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all border-b-2',
        activeTab === id 
          ? 'border-primary text-foreground bg-primary/5' 
          : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
      )}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  if (viewMode === 'browser') {
    return (
      <div className="flex flex-col h-full bg-background overflow-hidden">
        <div className="flex items-center gap-3 p-2 border-b border-border bg-muted/30">
          <button 
            onClick={handleBack}
            className="p-1.5 hover:bg-muted rounded-md text-muted-foreground transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex-1 flex items-center gap-2 px-3 py-1 bg-muted/50 border border-transparent rounded-lg text-xs truncate">
            <Globe size={12} className="text-muted-foreground shrink-0" />
            <span className="truncate text-muted-foreground">{browserUrl}</span>
          </div>
          <button 
            onClick={() => window.open(browserUrl, '_blank', 'noopener,noreferrer')}
            className="p-1.5 hover:bg-muted rounded-md text-muted-foreground transition-colors"
          >
            <ExternalLink size={16} />
          </button>
        </div>

        <div className="flex-1 relative bg-white overflow-hidden">
          {isBrowserLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-20">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          )}
          
          <div className="absolute inset-0 flex flex-col items-center justify-center -z-0 text-muted-foreground p-8 text-center bg-background">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
              <AlertCircle size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">Display Restricted</h3>
            <p className="text-xs max-w-xs text-muted-foreground mb-6">
              This site cannot be embedded. Please open it in a new tab.
            </p>
            <button 
              onClick={() => window.open(browserUrl, '_blank', 'noopener,noreferrer')} 
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors shadow-sm text-xs font-medium"
            >
              <ExternalLink size={14} />
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
        <div className="max-w-2xl mx-auto p-4 sm:p-6 pb-10">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors mb-6 group"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            Back to Portfolio
          </button>

          <div className="flex items-start justify-between gap-4 mb-8">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary overflow-hidden shrink-0">
                <ProjectIcon url={activeProject.url} title={activeProject.title} size={32} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-wider">
                    {activeProject.status}
                  </span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight">{activeProject.title}</h1>
              </div>
            </div>
            <button 
              onClick={() => openInBrowser(activeProject.url)}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all text-xs font-semibold shadow-sm shrink-0"
            >
              <Globe size={14} />
              Open in Browser
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            <div className="p-3 rounded-2xl border border-border bg-card/50">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <Briefcase size={12} />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Product</span>
              </div>
              <p className="text-xs font-medium text-foreground">{activeProject.product}</p>
            </div>
            <div className="p-3 rounded-2xl border border-border bg-card/50">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <User size={12} />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Role</span>
              </div>
              <p className="text-xs font-medium text-foreground">{activeProject.role}</p>
            </div>
            <div className="p-3 rounded-2xl border border-border bg-card/50">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <ShieldCheck size={12} />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Rule</span>
              </div>
              <p className="text-xs font-medium text-foreground">{activeProject.rule}</p>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                <Info size={14} className="text-primary" />
                Overview
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {activeProject.description}
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                <Terminal size={14} className="text-primary" />
                Development Note
              </div>
              <div className="p-4 rounded-2xl border border-border bg-muted/30 text-sm text-foreground/80 leading-relaxed">
                {activeProject.process}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                <Code size={14} className="text-primary" />
                Technical Stack
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">On-chain</div>
                  <div className="flex flex-wrap gap-2">
                    {['Solidity', 'Hardhat', 'OpenZeppelin', 'Sepolia'].map(tech => (
                      <span key={tech} className="px-2 py-1 rounded-lg border border-border bg-card text-[10px] font-semibold text-muted-foreground uppercase">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Off-chain</div>
                  <div className="flex flex-wrap gap-2">
                    {['Next.js 15', 'TypeScript', 'Tailwind v4', 'Ethers.js v6'].map(tech => (
                      <span key={tech} className="px-2 py-1 rounded-lg border border-border bg-card text-[10px] font-semibold text-muted-foreground uppercase">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                <ShieldCheck size={14} className="text-primary" />
                Security & UI Features
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Reentrancy Protection',
                  'Ownership Control',
                  'Input Validation',
                  'Wallet Integration',
                  'Real-time Data',
                  'Responsive Design'
                ].map(feature => (
                  <div key={feature} className="flex items-center gap-2 p-2 rounded-xl border border-border bg-card/30 text-[11px] text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                    {feature}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-background flex flex-col">
      {/* Tabs Header */}
      <div className="flex items-center border-b border-border bg-muted/20 px-4">
        <TabButton id="resources" label="Resources" icon={BookOpen} />
        <TabButton id="portfolio" label="Portfolio" icon={LayoutGrid} />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-4 sm:p-6 pb-10">
          <div className="text-2xl font-bold tracking-tight">Web3</div>
          <div className="mt-2 text-sm text-foreground/90">
            {activeTab === 'resources' 
              ? 'A curated selection of learning materials and ecosystem tools.' 
              : 'Detailed case studies of Web3 projects I have managed, delivered, or created for learning and personal experiments.'}
          </div>

          <div className="mt-6">
            {activeTab === 'resources' ? (
              <section className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 text-sm font-semibold mb-4">
                  <Sparkles size={16} />
                  Learning Materials
                </div>
                <div className="grid gap-3">
                  {resources.map((r) => (
                    <div key={r.url} className="rounded-2xl border border-border bg-background/60 p-4 hover:bg-background transition-colors group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors overflow-hidden">
                            <ProjectIcon url={r.url} title={r.title} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{r.title}</div>
                            <div className="text-[10px] text-muted-foreground mt-0.5 truncate">{r.url}</div>
                            <div className="text-xs mt-3 text-muted-foreground leading-relaxed">{r.description}</div>
                          </div>
                        </div>
                        <button
                          className="h-8 px-3 rounded-lg text-[10px] font-semibold uppercase bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1.5 shrink-0"
                          onClick={() => openInBrowser(r.url)}
                        >
                          <ExternalLink size={12} />
                          Open
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : (
              <section className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 text-sm font-semibold mb-4">
                  <Briefcase size={16} />
                  Projects
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {projects.map((p) => (
                    <div 
                      key={p.id} 
                      className="group flex flex-col p-5 rounded-2xl border border-border bg-background/60 hover:bg-background transition-all cursor-pointer shadow-sm hover:shadow-md"
                      onClick={() => {
                        setActiveProjectId(p.id);
                        setViewMode('detail');
                      }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform overflow-hidden">
                          <ProjectIcon url={p.url} title={p.title} />
                        </div>
                        <div className="p-1.5 hover:bg-muted rounded-md text-muted-foreground transition-colors">
                          <ChevronRight size={16} className="group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>

                      <h3 className="text-sm font-semibold group-hover:text-primary transition-colors mb-2">{p.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1 leading-relaxed">
                        {p.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-auto">
                        {p.technologies.slice(0, 2).map(tech => (
                          <span key={tech} className="px-2 py-0.5 rounded-md bg-muted text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
