import React, { useRef, useEffect } from 'react';
import { motion, useDragControls, DragControls } from 'framer-motion';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import { useWindowStore, WindowState } from '@/stores/windowStore';
import { useThemeStore, themes } from '@/stores/themeStore';
import { cn } from '@/utils/cn';

interface WindowProps {
  window: WindowState;
  children: React.ReactNode;
}

const WindowTitleBar = ({ 
  window, 
  dragControls 
}: { 
  window: WindowState; 
  dragControls: DragControls 
}) => {
  const { closeWindow, minimizeWindow, toggleMaximize, focusWindow } = useWindowStore();
  const { currentTheme, isDarkMode } = useThemeStore();
  const theme = themes[currentTheme];
  const isRetro = currentTheme === 'retro';
  const isGlassy = currentTheme === 'glassy';

  const controlText = (() => {
    if (isRetro) return isDarkMode ? '!text-[#f5f5f5]' : '!text-[#111111]';
    return isDarkMode ? '!text-white' : '!text-[#111111]';
  })();

  const titleText = (() => {
    if (isRetro) return isDarkMode ? 'text-[#f5f5f5]' : 'text-[#111111]';
    return isDarkMode ? 'text-white' : 'text-[#111111]';
  })();

  const controlHoverBg = (() => {
    if (isRetro) return 'hover:bg-[#d0c8b6]/30';
    if (isGlassy) return isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5';
    return isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5';
  })();

  return (
    <div 
      onPointerDown={(e) => {
        focusWindow(window.id);
        if (!window.isMaximized) {
          dragControls.start(e);
        }
      }}
      style={{ touchAction: 'none' }}
      className={cn(
        "h-10 flex items-center justify-between px-4 select-none border-b transition-colors cursor-default",
        theme.colors.topBarBg,
        theme.colors.topBarText,
        theme.colors.windowBorder,
        isRetro && "font-[IBM_Plex_Sans]"
      )}
    >
      <div className="flex items-center gap-2">
         <span className={cn(
             "text-sm font-medium",
             titleText
         )}>{window.title}</span>
      </div>
      <div className="flex items-center gap-2" onPointerDown={(e) => e.stopPropagation()}>
        <button 
            onClick={() => minimizeWindow(window.id)} 
            className={cn(
                "p-1.5 rounded-md transition-colors",
                controlText,
                controlHoverBg
            )}
        >
            <Minus size={14} />
        </button>
        <button 
            onClick={() => toggleMaximize(window.id)} 
            className={cn(
                "p-1.5 rounded-md transition-colors",
                controlText,
                controlHoverBg
            )}
        >
            {window.isMaximized ? <Square size={12} /> : <Maximize2 size={12} />}
        </button>
        <button 
            onClick={() => closeWindow(window.id)} 
            className={cn(
                "p-1.5 rounded-md transition-colors",
                controlText,
                controlHoverBg,
                "hover:text-red-500"
            )}
        >
            <X size={14} />
        </button>
      </div>
    </div>
  )
}

export const Window: React.FC<WindowProps> = ({ window: windowState, children }) => {
  const { 
    focusWindow, 
    updateWindowPosition,
    updateWindowSize
  } = useWindowStore();
  
  const { currentTheme } = useThemeStore();
  const theme = themes[currentTheme];
  const isRetro = currentTheme === 'retro';
  const isGlassy = currentTheme === 'glassy';
  
  const dragControls = useDragControls();
  const resizingRef = useRef<{
    active: boolean;
    direction: string;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    startLeft: number;
    startTop: number;
  } | null>(null);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
        if (!resizingRef.current?.active) return;

        const { direction, startX, startY, startWidth, startHeight, startLeft, startTop } = resizingRef.current;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        let newWidth = startWidth;
        let newHeight = startHeight;
        let newLeft = startLeft;
        let newTop = startTop;

        const minWidth = 300;
        const minHeight = 200;

        if (direction.includes('e')) {
            newWidth = Math.max(minWidth, startWidth + deltaX);
        }
        if (direction.includes('s')) {
            newHeight = Math.max(minHeight, startHeight + deltaY);
        }
        if (direction.includes('w')) {
            if (startWidth - deltaX >= minWidth) {
                newWidth = startWidth - deltaX;
                newLeft = startLeft + deltaX;
            } else {
                newWidth = minWidth;
                newLeft = startLeft + (startWidth - minWidth);
            }
        }
        if (direction.includes('n')) {
            if (startHeight - deltaY >= minHeight) {
                newHeight = startHeight - deltaY;
                newTop = startTop + deltaY;
            } else {
                newHeight = minHeight;
                newTop = startTop + (startHeight - minHeight);
            }
        }

        updateWindowSize(windowState.id, { width: newWidth, height: newHeight });
        if (newLeft !== startLeft || newTop !== startTop) {
            updateWindowPosition(windowState.id, { x: newLeft, y: newTop });
        }
    };

    const handlePointerUp = () => {
        if (resizingRef.current?.active) {
            resizingRef.current = { ...resizingRef.current, active: false };
            document.body.style.cursor = '';
            const overlay = document.getElementById('resize-overlay');
            if (overlay) overlay.remove();
        }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [windowState.id, updateWindowSize, updateWindowPosition]);

  const startResize = (e: React.PointerEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    resizingRef.current = {
        active: true,
        direction,
        startX: e.clientX,
        startY: e.clientY,
        startWidth: windowState.size.width,
        startHeight: windowState.size.height,
        startLeft: windowState.position.x,
        startTop: windowState.position.y
    };
    
    const overlay = document.createElement('div');
    overlay.id = 'resize-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.zIndex = '9999';
    overlay.style.cursor = getCursor(direction);
    document.body.appendChild(overlay);
  };

  const getCursor = (dir: string) => {
    switch(dir) {
        case 'n': return 'n-resize';
        case 's': return 's-resize';
        case 'e': return 'e-resize';
        case 'w': return 'w-resize';
        case 'ne': return 'ne-resize';
        case 'nw': return 'nw-resize';
        case 'se': return 'se-resize';
        case 'sw': return 'sw-resize';
        default: return 'default';
    }
  }

  if (windowState.isMinimized) return null;

  return (
    <motion.div
      drag={!windowState.isMaximized}
      dragMomentum={false}
      dragListener={false} 
      dragControls={dragControls}
      dragElastic={0}
      style={{
        position: 'absolute',
        touchAction: 'none',
      }}
      initial={{ 
        x: windowState.position.x, 
        y: windowState.position.y, 
        opacity: 0, 
        scale: 0.95 
      }}
      animate={{ 
        x: windowState.isMaximized ? 0 : windowState.position.x,
        y: windowState.isMaximized ? 0 : windowState.position.y,
        width: windowState.isMaximized ? '100%' : windowState.size.width,
        height: windowState.isMaximized ? '100%' : windowState.size.height,
        opacity: 1, 
        scale: 1,
        zIndex: windowState.zIndex 
      }}
      transition={{
        opacity: { duration: 0.15 },
        scale: { duration: 0.15 },
        x: { duration: 0 },
        y: { duration: 0 },
        width: { duration: 0.1 },
        height: { duration: 0.1 }
      }}
      onDragEnd={(_, info) => {
        if (!windowState.isMaximized) {
            updateWindowPosition(windowState.id, { 
                x: windowState.position.x + info.offset.x, 
                y: windowState.position.y + info.offset.y 
            });
        }
      }}
      className={cn(
        "flex flex-col overflow-hidden transition-colors duration-200",
        theme.colors.windowBg,
        theme.colors.foreground,
        !windowState.isMaximized && theme.borderRadius,
        windowState.isMaximized ? "rounded-none border-0" : `border ${theme.colors.windowBorder}`,
        !windowState.isMaximized && theme.shadow,
        isGlassy && !windowState.isMaximized && "border-opacity-50"
      )}
    >
      <WindowTitleBar window={windowState} dragControls={dragControls} />
      <div className={cn(
          "flex-1 overflow-hidden relative",
          isRetro ? "bg-[#fcfbf9]" : isGlassy ? "bg-white/50 dark:bg-black/50" : "bg-card"
      )} onPointerDown={() => focusWindow(windowState.id)}>
         {children}
      </div>

      {/* Resize Handles */}
      {!windowState.isMaximized && (
        <>
            {/* Edges */}
            <div onPointerDown={(e) => startResize(e, 'n')} className="absolute top-0 left-2 right-2 h-1 cursor-n-resize z-50" />
            <div onPointerDown={(e) => startResize(e, 's')} className="absolute bottom-0 left-2 right-2 h-1 cursor-s-resize z-50" />
            <div onPointerDown={(e) => startResize(e, 'w')} className="absolute left-0 top-2 bottom-2 w-1 cursor-w-resize z-50" />
            <div onPointerDown={(e) => startResize(e, 'e')} className="absolute right-0 top-2 bottom-2 w-1 cursor-e-resize z-50" />
            
            {/* Corners */}
            <div onPointerDown={(e) => startResize(e, 'nw')} className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize z-50" />
            <div onPointerDown={(e) => startResize(e, 'ne')} className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize z-50" />
            <div onPointerDown={(e) => startResize(e, 'sw')} className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize z-50" />
            <div onPointerDown={(e) => startResize(e, 'se')} className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize z-50" />
        </>
      )}
    </motion.div>
  );
};
