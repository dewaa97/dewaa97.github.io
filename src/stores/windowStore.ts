import { create } from 'zustand';

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

interface WindowStore {
  windows: WindowState[];
  activeWindowId: string | null;
  zIndexCounter: number;

  openWindow: (appId: string, title: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  closeAllWindows: () => void;
  toggleMaximize: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;
}

export const useWindowStore = create<WindowStore>((set) => ({
  windows: [],
  activeWindowId: null,
  zIndexCounter: 100,

  openWindow: (appId, title) => set((state) => {
    const existing = state.windows.find((w) => w.appId === appId);
    if (existing) {
      const nextZ = state.zIndexCounter + 1;
      return {
        activeWindowId: existing.id,
        zIndexCounter: nextZ,
        windows: state.windows.map((w) =>
          w.id === existing.id ? { ...w, isMinimized: false, zIndex: nextZ } : w
        ),
      };
    }

    const id = `${appId}-${Date.now()}`;

    const isSmallScreen =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(max-width: 767px)').matches;

    const newWindow: WindowState = {
      id,
      appId,
      title,
      position: isSmallScreen
        ? { x: 0, y: 0 }
        : { x: 50 + (state.windows.length * 30), y: 50 + (state.windows.length * 30) },
      size: { width: 900, height: 600 },
      isMinimized: false,
      isMaximized: isSmallScreen,
      zIndex: state.zIndexCounter + 1,
    };
    return {
      windows: [...state.windows, newWindow],
      activeWindowId: id,
      zIndexCounter: state.zIndexCounter + 1,
    };
  }),

  closeWindow: (id) => set((state) => ({
    windows: state.windows.filter((w) => w.id !== id),
    activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
  })),

  minimizeWindow: (id) => set((state) => ({
    windows: state.windows.map((w) => w.id === id ? { ...w, isMinimized: true } : w),
    activeWindowId: null,
  })),

  closeAllWindows: () => set({
    windows: [],
    activeWindowId: null,
    zIndexCounter: 100,
  }),

  toggleMaximize: (id) => set((state) => ({
    windows: state.windows.map((w) => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w),
  })),

  focusWindow: (id) => set((state) => {
    if (state.activeWindowId === id) return state;
    return {
      activeWindowId: id,
      zIndexCounter: state.zIndexCounter + 1,
      windows: state.windows.map((w) => w.id === id ? { ...w, zIndex: state.zIndexCounter + 1, isMinimized: false } : w),
    };
  }),

  updateWindowPosition: (id, position) => set((state) => ({
    windows: state.windows.map((w) => w.id === id ? { ...w, position } : w),
  })),
  
  updateWindowSize: (id, size) => set((state) => ({
    windows: state.windows.map((w) => w.id === id ? { ...w, size } : w),
  })),
}));
