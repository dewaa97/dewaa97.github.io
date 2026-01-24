import { create } from 'zustand';
import { LucideIcon } from 'lucide-react';

export interface App {
  id: string;
  title: string;
  icon: LucideIcon;
  component: React.ComponentType;
  defaultSize?: { width: number; height: number };
  isResizable?: boolean;
}

interface AppStore {
  apps: Record<string, App>;
  registerApp: (app: App) => void;
  getApp: (id: string) => App | undefined;
}

export const useAppStore = create<AppStore>((set, get) => ({
  apps: {},
  registerApp: (app) => set((state) => ({ apps: { ...state.apps, [app.id]: app } })),
  getApp: (id) => get().apps[id],
}));