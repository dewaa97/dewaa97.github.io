import { FileText, Settings, BookOpen, Link } from 'lucide-react';
import { App } from '@/stores/appStore';
import { PortfolioApp } from '@/components/apps/PortfolioApp';
import { SettingsApp } from '@/components/apps/SettingsApp';
import { ReadmeApp } from '@/components/apps/ReadmeApp';
import { Web3App } from '@/components/apps/Web3App';

export const initialApps: App[] = [
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
  /* Hide Web3 for now
  {
    id: 'web3',
    title: 'Web3',
    icon: Link,
    component: Web3App,
    defaultSize: { width: 860, height: 560 },
    isResizable: true,
  },
  */
];
