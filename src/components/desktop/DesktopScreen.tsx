import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Wallpaper } from './Wallpaper';
import { WindowManager } from '../windows/WindowManager';
import { TopBar } from './TopBar';
import { DesktopIcon } from './DesktopIcon';
import { useAppStore } from '@/stores/appStore';
import { initialApps } from '@/config/apps';
import { useThemeStore, themes } from '@/stores/themeStore';
import { useWindowStore } from '@/stores/windowStore';
import { useDesktopIconStore } from '@/stores/desktopIconStore';
import { cn } from '@/utils/cn';

export const DesktopScreen = () => {
  const { apps } = useAppStore();
  const desktopApps = Object.values(apps).length > 0 ? Object.values(apps) : initialApps;
  const { currentTheme } = useThemeStore();
  const theme = themes[currentTheme];
  const { openWindow } = useWindowStore();
  const { positions, setIconPosition, resetPositions } = useDesktopIconStore();
  const didAutoOpenRef = useRef(false);

  const [contextMenu, setContextMenu] = useState<null | { x: number; y: number }> (null);
  const longPressRef = useRef<{
    timeoutId: number | null;
    pointerId: number | null;
    startX: number;
    startY: number;
    active: boolean;
  } | null>(null);
  
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragRef = useRef<{
    appId: string;
    pointerId: number;
    startPointerX: number;
    startPointerY: number;
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);

  const defaultPositions = useMemo(() => {
    const startX = 16;
    const startY = 16;
    const colWidth = 92;
    const rowHeight = 104;
    const perCol = 6;
    const map: Record<string, { x: number; y: number }> = {};
    desktopApps.forEach((app, index) => {
      const col = Math.floor(index / perCol);
      const row = index % perCol;
      map[app.id] = { x: startX + col * colWidth, y: startY + row * rowHeight };
    });
    return map;
  }, [desktopApps]);

  useEffect(() => {
    if (didAutoOpenRef.current) return;
    didAutoOpenRef.current = true;

    try {
      const key = 'dfs-readme-opened';
      const already = window.localStorage.getItem(key);
      if (already) return;
      window.localStorage.setItem(key, '1');
    } catch {
      // ignore
    }

    const hasReadme = desktopApps.some((a) => a.id === 'readme');
    if (!hasReadme) return;

    window.setTimeout(() => {
      openWindow('readme', 'Read Me');
    }, 0);
  }, [desktopApps, openWindow]);

  const getIconPosition = (appId: string) => positions[appId] ?? defaultPositions[appId] ?? { x: 16, y: 16 };

  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

  const snap = (v: number, step: number) => Math.round(v / step) * step;

  const updatePosition = (appId: string, x: number, y: number) => {
    const container = constraintsRef.current;
    if (!container) {
      setIconPosition(appId, { x, y });
      return;
    }

    const rect = container.getBoundingClientRect();
    const iconW = 84;
    const iconH = 96;
    const maxX = Math.max(0, rect.width - iconW);
    const maxY = Math.max(0, rect.height - iconH);
    const nextX = clamp(snap(x, 8), 0, maxX);
    const nextY = clamp(snap(y, 8), 0, maxY);
    setIconPosition(appId, { x: nextX, y: nextY });
  };

  const clampMenuPoint = (x: number, y: number) => {
    const padding = 8;
    const menuW = 220;
    const menuH = 100;
    const maxX = Math.max(padding, window.innerWidth - menuW - padding);
    const maxY = Math.max(padding, window.innerHeight - menuH - padding);
    return {
      x: Math.min(maxX, Math.max(padding, x)),
      y: Math.min(maxY, Math.max(padding, y)),
    };
  };

  const openContextMenuAt = (x: number, y: number) => {
    const pt = clampMenuPoint(x, y);
    setContextMenu(pt);
  };

  const cleanupIcons = () => {
    const container = constraintsRef.current;
    const rect = container?.getBoundingClientRect();

    const startX = 16;
    const startY = 16;
    const colWidth = 92;
    const rowHeight = 104;

    const iconW = 84;
    const iconH = 96;

    const maxX = rect ? Math.max(0, rect.width - iconW) : 0;
    const maxY = rect ? Math.max(0, rect.height - iconH) : 0;

    const perCol = rect
      ? Math.max(1, Math.floor((rect.height - startY) / rowHeight))
      : 6;

    desktopApps.forEach((app, index) => {
      const col = Math.floor(index / perCol);
      const row = index % perCol;
      const x = startX + col * colWidth;
      const y = startY + row * rowHeight;
      const nextX = rect ? clamp(snap(x, 8), 0, maxX) : x;
      const nextY = rect ? clamp(snap(y, 8), 0, maxY) : y;
      setIconPosition(app.id, { x: nextX, y: nextY });
    });

    setContextMenu(null);
  };

  const resetIconLayout = () => {
    resetPositions();
    setContextMenu(null);
  };

  useEffect(() => {
    if (!contextMenu) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setContextMenu(null);
    };
    const onPointerDown = () => setContextMenu(null);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [contextMenu]);

  return (
    <div className={cn('relative w-screen h-screen overflow-hidden select-none', theme.colors.foreground, theme.font)}>
      <Wallpaper />
      <TopBar />
      
      {/* Desktop Content Area (below TopBar) */}
      <div 
        ref={constraintsRef} 
        className="absolute inset-0 top-8 z-10"
        onContextMenu={(e) => {
          if ((e.target as HTMLElement).closest('[data-desktop-icon]')) return;
          e.preventDefault();
          openContextMenuAt(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (!dragRef.current) return;
          if (dragRef.current.pointerId !== e.pointerId) return;
          const dx = e.clientX - dragRef.current.startPointerX;
          const dy = e.clientY - dragRef.current.startPointerY;
          if (!dragRef.current.moved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
            dragRef.current.moved = true;
          }
          updatePosition(dragRef.current.appId, dragRef.current.startX + dx, dragRef.current.startY + dy);

          const lp = longPressRef.current;
          if (lp?.active && (Math.abs(e.clientX - lp.startX) > 8 || Math.abs(e.clientY - lp.startY) > 8)) {
            if (lp.timeoutId) window.clearTimeout(lp.timeoutId);
            longPressRef.current = { ...lp, active: false, timeoutId: null };
          }
        }}
        onPointerUp={(e) => {
          const lp = longPressRef.current;
          if (lp?.timeoutId) window.clearTimeout(lp.timeoutId);
          longPressRef.current = null;

          if (!dragRef.current) return;
          if (dragRef.current.pointerId !== e.pointerId) return;
          const wasMoved = dragRef.current.moved;
          const appId = dragRef.current.appId;
          dragRef.current = null;
          setDraggingId(null);
          if (!wasMoved) openWindow(appId, (desktopApps.find((a) => a.id === appId)?.title) ?? appId);
        }}
        onPointerCancel={(e) => {
          if (!dragRef.current) return;
          if (dragRef.current.pointerId !== e.pointerId) return;
          dragRef.current = null;
          setDraggingId(null);
          const lp = longPressRef.current;
          if (lp?.timeoutId) window.clearTimeout(lp.timeoutId);
          longPressRef.current = null;
        }}
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest('[data-desktop-icon]')) return;
          if (e.button !== 0) return;
          if (!e.isPrimary) return;
          if (e.pointerType !== 'touch') return;
          if (contextMenu) setContextMenu(null);

          const pointerId = e.pointerId;
          const timeoutId = window.setTimeout(() => {
            if (!longPressRef.current?.active) return;
            openContextMenuAt(e.clientX, e.clientY);
            longPressRef.current = null;
          }, 520);

          longPressRef.current = {
            timeoutId,
            pointerId,
            startX: e.clientX,
            startY: e.clientY,
            active: true,
          };
        }}
      >
        {desktopApps.map((app) => {
          const pos = getIconPosition(app.id);
          return (
            <div
              key={app.id}
              data-desktop-icon
              className={cn(
                'absolute rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50',
                draggingId === app.id && 'z-20'
              )}
              style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
              role="button"
              tabIndex={0}
              aria-label={app.title}
              onPointerDownCapture={(e) => {
                if ((e.target as HTMLElement).closest('a')) return;
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openWindow(app.id, app.title);
                }
              }}
              onPointerDown={(e) => {
                if (e.button !== 0) return;

                const lp = longPressRef.current;
                if (lp?.timeoutId) window.clearTimeout(lp.timeoutId);
                longPressRef.current = null;

                const current = getIconPosition(app.id);
                dragRef.current = {
                  appId: app.id,
                  pointerId: e.pointerId,
                  startPointerX: e.clientX,
                  startPointerY: e.clientY,
                  startX: current.x,
                  startY: current.y,
                  moved: false,
                };
                setDraggingId(app.id);
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
            >
              <DesktopIcon app={app} />
            </div>
          );
        })}

        {contextMenu && (
          <div
            className={cn(
              'fixed z-50 w-[220px] rounded-xl border border-border shadow-2xl overflow-hidden',
              currentTheme === 'retro'
                ? 'bg-[#fcfbf9] text-[#2d2d2d] border-[#d0c8b6] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)]'
                : currentTheme === 'glassy'
                  ? 'bg-white/60 dark:bg-black/60 backdrop-blur-xl text-foreground'
                  : 'bg-white dark:bg-zinc-900 text-foreground'
            )}
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              className={cn(
                'w-full text-left px-3 py-2 text-sm transition-colors',
                currentTheme === 'retro' ? 'hover:bg-[#d0c8b6]/20' : 'hover:bg-muted'
              )}
              onClick={cleanupIcons}
            >
              Clean Up Icons
            </button>
            <button
              className={cn(
                'w-full text-left px-3 py-2 text-sm transition-colors',
                currentTheme === 'retro' ? 'hover:bg-[#d0c8b6]/20' : 'hover:bg-muted'
              )}
              onClick={resetIconLayout}
            >
              Reset Icon Layout
            </button>
          </div>
        )}
      </div>

      <div className="absolute top-8 left-0 right-0 bottom-0 z-20 pointer-events-none">
         <WindowManager />
      </div>
    </div>
  );
};
