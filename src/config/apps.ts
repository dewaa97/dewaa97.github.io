import { FileText, Settings, Link, BookOpen, FolderOpen, Lock } from 'lucide-react';
import { App } from '@/stores/appStore';
import { PortfolioApp } from '@/components/apps/PortfolioApp';
import { SettingsApp } from '@/components/apps/SettingsApp';
import { Web3App } from '@/components/apps/Web3App';
import { ReadmeApp } from '@/components/apps/ReadmeApp';
import { FileExplorer } from '@/components/apps/FileExplorer';
import { PersonalApp } from '@/components/apps/PersonalApp';

export const initialApps: App[] = [
  {
    id: 'personal',
    title: 'dewaa97',
    icon: Lock,
    component: PersonalApp,
    defaultSize: { width: 400, height: 380 },
    isResizable: false,
  },
  {
    id: 'explorer',
    title: 'Explorer',
    icon: FolderOpen,
    component: FileExplorer,
    defaultSize: { width: 920, height: 620 },
    isResizable: true,
  },
  {
    id: 'readme',
    title: 'Read Me',
    icon: BookOpen,
    component: ReadmeApp,
    defaultSize: { width: 760, height: 560 },
    isResizable: true,
  },
  {
    id: 'portfolio',
    title: 'Resume',
    icon: FileText,
    component: PortfolioApp,
    defaultSize: { width: 900, height: 600 },
    isResizable: true,
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: Settings,
    component: SettingsApp,
    defaultSize: { width: 600, height: 400 },
    isResizable: false,
  },
  {
    id: 'web3',
    title: 'Web3',
    icon: Link,
    component: Web3App,
    defaultSize: { width: 860, height: 560 },
    isResizable: true,
  },
];
