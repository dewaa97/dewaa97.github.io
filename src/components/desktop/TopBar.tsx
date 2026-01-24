import React, { useMemo, useState, useEffect } from 'react';
import { useWindowStore } from '@/stores/windowStore';
import { useAppStore } from '@/stores/appStore';
import { useThemeStore, themes } from '@/stores/themeStore';
import { useUserStore } from '@/stores/userStore';
import { Check, Monitor } from 'lucide-react';
import { cn } from '@/utils/cn';
import {
  RetroBrowserIcon,
  RetroExplorerIcon,
  RetroPortfolioIcon,
  RetroSettingsIcon,
} from '@/components/icons/RetroLinealIcons';

export const TopBar = () => {
  const [time, setTime] = useState(new Date());
  const { windows, activeWindowId, focusWindow, minimizeWindow } = useWindowStore();
  const { apps } = useAppStore();
  const { currentTheme, isDarkMode } = useThemeStore();
  const { username, logout } = useUserStore();
  const [isWindowMenuOpen, setIsWindowMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [retroMenuIndex, setRetroMenuIndex] = useState<Record<string, number>>({});

  const theme = themes[currentTheme];
  const isRetro = currentTheme === 'retro';
  const isGlassy = currentTheme === 'glassy';

  const getRetroIcon = (appId: string) => {
    switch (appId) {
      case 'browser':
        return RetroBrowserIcon;
      case 'portfolio':
        return RetroPortfolioIcon;
      case 'explorer':
        return RetroExplorerIcon;
      case 'settings':
        return RetroSettingsIcon;
      default:
        return null;
    }
  };

  const retroMenuIconStyle = useMemo<React.CSSProperties>(() => {
    if (!isDarkMode) return {};
    return {
      filter:
        'drop-shadow(0 0 0 rgba(255,255,255,0.95)) drop-shadow(0 0 0 rgba(255,255,255,0.95))',
    };
  }, [isDarkMode]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setIsWindowMenuOpen(false);
      setIsUserMenuOpen(false);
    };
    if (isWindowMenuOpen || isUserMenuOpen) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isWindowMenuOpen, isUserMenuOpen]);

  return (
    <div className={cn(
        "fixed top-0 left-0 right-0 h-8 flex items-center justify-between px-4 text-sm font-medium z-[100] select-none transition-all duration-300",
        theme.colors.topBarBg,
        theme.colors.topBarText,
        isRetro ? "font-[IBM_Plex_Sans] border-b border-[#d0c8b6]" : ""
    )}>
      {/* Background gradient for visibility only in default theme */}
      {(!isRetro && !isGlassy) && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent -z-10 pointer-events-none" />
      )}
      
      <div className="flex items-center gap-4">
        <button
          className={cn(
            "font-bold flex items-center gap-2",
            (!isRetro && !isGlassy) && "drop-shadow-md"
          )}
          onClick={(e) => {
            e.stopPropagation();
            setIsUserMenuOpen((v) => !v);
          }}
        >
            <div className={cn(
                "w-4 h-4 rounded-full shadow-sm",
                isRetro ? "bg-[#2d2d2d]" : "bg-white"
            )} />
            {username || 'Guest'}
        </button>

        {isUserMenuOpen && (
          <div className={cn(
            "absolute top-8 left-4 mt-1 w-40 rounded-lg shadow-xl border p-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100",
            isRetro
              ? "bg-[#fcfbf9] border-[#d0c8b6] text-[#2d2d2d] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
              : isGlassy
                ? "bg-white/60 dark:bg-black/60 backdrop-blur-xl border-white/20 text-foreground"
                : "bg-white dark:bg-zinc-800 border-border text-foreground"
          )}>
            <button
              className={cn(
                "w-full text-left px-2 py-2 text-sm rounded-md",
                isRetro ? "hover:bg-[#d0c8b6]/20" : "hover:bg-muted"
              )}
              onClick={() => {
                logout();
                setIsUserMenuOpen(false);
              }}
            >
              Logout
            </button>
          </div>
        )}
        
        <div className={cn(
            "flex items-center gap-4 text-sm",
            (!isRetro && !isGlassy) && "drop-shadow-md"
        )}>
            <div className="relative">
                <button 
                    className={cn(
                        "px-2 py-0.5 rounded cursor-pointer transition-colors flex items-center gap-1",
                        isWindowMenuOpen && (isRetro ? "bg-[#d0c8b6]/30" : "bg-white/10"),
                        isRetro ? "hover:bg-[#d0c8b6]/30" : "hover:bg-white/10"
                    )}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsWindowMenuOpen(!isWindowMenuOpen);
                    }}
                >
                    Window
                </button>
                
                {/* Dropdown */}
                {isWindowMenuOpen && (
                    <div className={cn(
                        "absolute top-full left-0 mt-1 w-48 rounded-lg shadow-xl border p-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100",
                        isRetro 
                            ? "bg-[#fcfbf9] border-[#d0c8b6] text-[#2d2d2d] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]" 
                            : isGlassy
                                ? "bg-white/60 dark:bg-black/60 backdrop-blur-xl border-white/20 text-foreground"
                                : "bg-white dark:bg-zinc-800 border-border text-foreground"
                    )}>
                        <div className="px-2 py-1.5 text-xs font-semibold opacity-70 border-b border-border mb-1">
                            Open Applications
                        </div>
                        {windows.length === 0 ? (
                            <div className="px-2 py-2 text-xs opacity-70 text-center">No apps open</div>
                        ) : (
                            windows.map(window => {
                                const app = apps[window.appId];
                                return (
                                    <button
                                        key={window.id}
                                        onClick={() => focusWindow(window.id)}
                                        className={cn(
                                            "w-full text-left px-2 py-1.5 text-sm rounded-md flex items-center justify-between group",
                                            isRetro ? "hover:bg-[#d0c8b6]/20" : "hover:bg-muted",
                                            activeWindowId === window.id && (isRetro ? "bg-[#d0c8b6]/40 font-semibold" : "bg-primary/10 text-primary")
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            {app && (
                                              isRetro ? (() => {
                                                const idx = retroMenuIndex[window.appId] ?? 0;
                                                const sources = [
                                                  `/retro-icons/${window.appId}.png`,
                                                  `/retro-icons/${window.appId}.svg`,
                                                  `/retro-icons/${window.appId}.webp`,
                                                ];

                                                if (idx < sources.length) {
                                                  return (
                                                    <img
                                                      src={sources[idx]}
                                                      alt={window.title}
                                                      width={18}
                                                      height={18}
                                                      style={retroMenuIconStyle}
                                                      onError={() =>
                                                        setRetroMenuIndex((prev) => ({
                                                          ...prev,
                                                          [window.appId]: idx + 1,
                                                        }))
                                                      }
                                                    />
                                                  );
                                                }

                                                const Icon = getRetroIcon(window.appId);
                                                return Icon ? (
                                                  <Icon size={18} mode={isDarkMode ? 'dark' : 'light'} />
                                                ) : (
                                                  <app.icon size={16} className={cn(isDarkMode ? 'text-white' : 'text-[#111111]')} />
                                                );
                                              })() : (
                                                <app.icon size={14} />
                                              )
                                            )}
                                            <span className="truncate max-w-[120px]">{window.title}</span>
                                        </div>
                                        {activeWindowId === window.id && <Check size={12} />}
                                    </button>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </div>
      </div>
      
      <div className={cn(
          "flex items-center gap-4",
          (!isRetro && !isGlassy) && "drop-shadow-md"
      )}>
        {/* Active Window Title (Mac style) */}
        {activeWindowId && (
             <div className="hidden md:flex items-center gap-2 text-xs font-medium opacity-90">
                <Monitor size={12} />
                {windows.find(w => w.id === activeWindowId)?.title}
             </div>
        )}
        
        <div>
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};
