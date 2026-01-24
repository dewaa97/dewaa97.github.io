import { Globe, FileText, FolderOpen, Settings, Link, MessageCircle } from 'lucide-react';
import { App } from '@/stores/appStore';
import { BrowserApp } from '@/components/apps/BrowserApp';
import { PortfolioApp } from '@/components/apps/PortfolioApp';
import { FileExplorer } from '@/components/apps/FileExplorer';
import { SettingsApp } from '@/components/apps/SettingsApp';
import { Web3App } from '@/components/apps/Web3App';
import { ConnectApp } from '@/components/apps/ConnectApp';

export const initialApps: App[] = [
  {
    id: 'browser',
    title: 'Browser',
    icon: Globe,
    component: BrowserApp,
    defaultSize: { width: 1024, height: 768 },
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
    id: 'explorer',
    title: 'Explorer',
    icon: FolderOpen,
    component: FileExplorer,
    defaultSize: { width: 800, height: 500 },
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
  {
    id: 'hi',
    title: 'Say Hi!',
    icon: MessageCircle,
    component: ConnectApp,
    defaultSize: { width: 560, height: 560 },
    isResizable: true,
  },
];
