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
  cleanUpIcons: (appIds: string[], options: { width: number; height: number; topOffset?: number }) => void;
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
      cleanUpIcons: (appIds, options) =>
        set((state) => {
          const startX = 16;
          const startY = 16;
          const colWidth = 92;
          const rowHeight = 104;
          const iconW = 84;
          const iconH = 96;
          const snapSize = 8;

          const width = Math.max(0, options.width);
          const height = Math.max(0, options.height - (options.topOffset ?? 0));

          const maxX = Math.max(0, width - iconW);
          const maxY = Math.max(0, height - iconH);

          const perCol = Math.max(1, Math.floor((height - startY) / rowHeight));

          const snap = (value: number) => Math.round(value / snapSize) * snapSize;
          const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

          const nextPositions = { ...state.positions };

          appIds.forEach((appId, index) => {
            const col = Math.floor(index / perCol);
            const row = index % perCol;
            const x = startX + col * colWidth;
            const y = startY + row * rowHeight;

            nextPositions[appId] = {
              x: Math.round(clamp(snap(x), 0, maxX)),
              y: Math.round(clamp(snap(y), 0, maxY)),
            };
          });

          return { positions: nextPositions };
        }),
    }),
    {
      name: 'desktop-icon-storage',
    }
  )
);
