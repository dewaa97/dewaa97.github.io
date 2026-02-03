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
  
  // Get all apps for positioning (including hidden ones)
  const allApps = useMemo(() => {
    return Object.values(apps).length > 0 ? Object.values(apps) : initialApps;
  }, [apps]);
  
  // Filter apps for display
  const desktopApps = useMemo(() => {
    return allApps;
  }, [allApps]);

  const { currentTheme } = useThemeStore();
  const theme = themes[currentTheme];
  const { openWindow } = useWindowStore();
  const { positions, setIconPosition } = useDesktopIconStore();
  const didAutoOpenRef = useRef(false);
  
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

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const defaultPositions = useMemo(() => {
    const startX = 16;
    const colWidth = 92;
    const rowHeight = 104;
    
    // Auto-detect perCol based on container height
    const availableHeight = containerSize.height || (typeof window !== 'undefined' ? window.innerHeight - 32 : 600);
    const perCol = Math.max(1, Math.floor((availableHeight - rowHeight) / rowHeight));
    
    const map: Record<string, { x: number; y: number }> = {};
    // Position apps from bottom to top based on allApps (including hidden ones)
    allApps.forEach((app, index) => {
      const col = Math.floor(index / perCol);
      const row = index % perCol;
      const startY = availableHeight - rowHeight - (row * rowHeight);
      map[app.id] = { x: startX + col * colWidth, y: startY };
    });
    return map;
  }, [allApps, containerSize.height]);

  useEffect(() => {
    if (!constraintsRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(constraintsRef.current);
    return () => observer.disconnect();
  }, []);

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

  useEffect(() => {
    const applyAppHeight = () => {
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    };

    applyAppHeight();
    window.addEventListener('resize', applyAppHeight);
    window.addEventListener('orientationchange', applyAppHeight);
    return () => {
      window.removeEventListener('resize', applyAppHeight);
      window.removeEventListener('orientationchange', applyAppHeight);
    };
  }, []);

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

  return (
    <div
      className={cn('relative w-screen overflow-hidden select-none', theme.colors.foreground, theme.font)}
      style={{ height: 'var(--app-height)' }}
    >
      <Wallpaper />
      <TopBar />
      
      {/* Desktop Content Area (below TopBar) */}
      <div 
        ref={constraintsRef} 
        className="absolute inset-0 top-8 z-10"
        onPointerMove={(e) => {
          if (!dragRef.current) return;
          if (dragRef.current.pointerId !== e.pointerId) return;
          const dx = e.clientX - dragRef.current.startPointerX;
          const dy = e.clientY - dragRef.current.startPointerY;
          if (!dragRef.current.moved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
            dragRef.current.moved = true;
          }
          updatePosition(dragRef.current.appId, dragRef.current.startX + dx, dragRef.current.startY + dy);
        }}
        onPointerUp={(e) => {
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
      </div>

      <div className="absolute top-8 left-0 right-0 bottom-0 z-20 pointer-events-none">
         <WindowManager />
      </div>
    </div>
  );
};
