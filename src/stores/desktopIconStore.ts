import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DesktopIconPosition = {
  x: number;
  y: number;
};

interface DesktopIconState {
  positions: Record<string, DesktopIconPosition>;
  setIconPosition: (appId: string, position: DesktopIconPosition) => void;
  resetPositions: () => void;
}

export const useDesktopIconStore = create<DesktopIconState>()(
  persist(
    (set) => ({
      positions: {},
      setIconPosition: (appId, position) =>
        set((state) => ({
          positions: {
            ...state.positions,
            [appId]: { x: Math.round(position.x), y: Math.round(position.y) },
          },
        })),
      resetPositions: () => set({ positions: {} }),
    }),
    {
      name: 'desktop-icon-storage',
    }
  )
);

