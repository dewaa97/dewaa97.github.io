import React, { useMemo, useState, useEffect } from 'react';
import { useWindowStore } from '@/stores/windowStore';
import { useAppStore } from '@/stores/appStore';
import { useThemeStore, themes } from '@/stores/themeStore';
import { Check, Monitor, LayoutGrid, Lock } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useDesktopIconStore } from '@/stores/desktopIconStore';
import { useUserStore } from '@/stores/userStore';
import { initialApps } from '@/config/apps';
import { LoginDialog } from '@/components/apps/PersonalApp';
import {
  RetroBrowserIcon,
  RetroExplorerIcon,
  RetroPortfolioIcon,
  RetroSettingsIcon,
  RetroPersonalIcon,
} from '@/components/icons/RetroLinealIcons';

export const TopBar = () => {
  const [time, setTime] = useState(new Date());
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const { windows, activeWindowId, focusWindow, minimizeWindow, closeWindow, closeAllWindows } = useWindowStore();
  const { apps } = useAppStore();
  const { currentTheme, isDarkMode } = useThemeStore();
  const { isPersonalMode, setPersonalMode } = useUserStore();
  const { cleanUpIcons } = useDesktopIconStore();
  const [isWindowMenuOpen, setIsWindowMenuOpen] = useState(false);
  const [isIconMenuOpen, setIsIconMenuOpen] = useState(false);
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
      case 'personal':
        return RetroPersonalIcon;
      case 'articles':
      case 'myarticles':
      case 'readme':
      case 'web3':
        // These use PNG icons from retro-icons folder
        return null;
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
      setIsIconMenuOpen(false);
      setIsUserMenuOpen(false);
    };
    if (isWindowMenuOpen || isIconMenuOpen || isUserMenuOpen) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isWindowMenuOpen, isIconMenuOpen, isUserMenuOpen]);

  const desktopApps = useMemo(() => {
    const allApps = Object.values(apps).length > 0 ? Object.values(apps) : initialApps;
    return allApps.filter(app => {
      if (app.id === 'explorer') {
        return isPersonalMode;
      }
      return true;
    });
  }, [apps, isPersonalMode]);

  const showDesktop = () => {
    windows.forEach((w) => minimizeWindow(w.id));
  };

  const closePersonal = () => {
    // Close all personal windows first
    windows.forEach(w => {
      if (['explorer', 'filemanager'].includes(w.appId)) {
        closeWindow(w.id);
      }
    });
    // Then set personal mode to false
    setPersonalMode(false);
  };

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
        <div className="relative">
          <div
            onClick={(e) => {
              e.stopPropagation();
              setIsWindowMenuOpen(false);
              setIsIconMenuOpen(false);
              setIsUserMenuOpen(!isUserMenuOpen);
            }}
            className={cn(
              'font-bold flex items-center gap-2 cursor-pointer px-2 py-0.5 rounded transition-colors',
              isUserMenuOpen && (isRetro ? "bg-[#d0c8b6]/30" : "bg-white/10"),
              isRetro ? "hover:bg-[#d0c8b6]/30" : "hover:bg-white/10",
              (!isRetro && !isGlassy) && 'drop-shadow-md'
            )}
          >
            <div className={cn('w-4 h-4 rounded-full shadow-sm', isRetro ? 'bg-[#2d2d2d]' : 'bg-white')} />
            dewaa97
          </div>

          {isUserMenuOpen && (
            <div className={cn(
              "absolute top-full left-0 mt-1 w-56 rounded-lg shadow-xl border p-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100",
              isRetro 
                  ? "bg-[#fcfbf9] border-[#d0c8b6] text-[#2d2d2d] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]" 
                  : isGlassy
                      ? "bg-white/60 dark:bg-black/60 backdrop-blur-xl border-white/20 text-foreground"
                      : "bg-white dark:bg-zinc-800 border-border text-foreground"
            )}>
              <div className="px-2 py-1.5 text-xs font-semibold opacity-70 border-b border-border mb-1">
                User Session
              </div>
              
              <div className="px-2 py-1.5 text-sm">
                Status: <span className={cn("font-semibold", isPersonalMode ? "text-success" : "text-muted-foreground")}>
                  {isPersonalMode ? "Personal Mode Active" : "Public Mode"}
                </span>
              </div>

              <div className={cn('my-1 border-t', isRetro ? 'border-[#d0c8b6]/60' : 'border-border')} />

              {!isPersonalMode ? (
                <button
                  onClick={() => {
                    setIsLoginDialogOpen(true);
                    setIsUserMenuOpen(false);
                  }}
                  className={cn(
                    'w-full text-left px-2 py-1.5 text-sm rounded-md flex items-center gap-2 text-primary hover:bg-primary/10',
                    isRetro ? 'hover:bg-blue-50' : ''
                  )}
                >
                  <Lock size={14} />
                  <span>Login</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    closePersonal();
                    setIsUserMenuOpen(false);
                  }}
                  className={cn(
                    'w-full text-left px-2 py-1.5 text-sm rounded-md flex items-center justify-between text-destructive hover:bg-destructive/10',
                    isRetro ? 'hover:bg-red-50' : ''
                  )}
                >
                  <span>Logout</span>
                </button>
              )}
            </div>
          )}
        </div>
        
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
                        setIsIconMenuOpen(false);
                        setIsWindowMenuOpen(!isWindowMenuOpen);
                    }}
                >
                    <Monitor size={14} />
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

                        <button
                          onClick={() => {
                            showDesktop();
                            setIsWindowMenuOpen(false);
                          }}
                          className={cn(
                            'w-full text-left px-2 py-1.5 text-sm rounded-md flex items-center justify-between group',
                            isRetro ? 'hover:bg-[#d0c8b6]/20' : 'hover:bg-muted'
                          )}
                        >
                          <span>Show Desktop</span>
                        </button>

                        <button
                          onClick={() => {
                            closeAllWindows();
                            setIsWindowMenuOpen(false);
                          }}
                          className={cn(
                            'w-full text-left px-2 py-1.5 text-sm rounded-md flex items-center justify-between group text-destructive hover:bg-destructive/10',
                            isRetro ? 'hover:bg-red-50' : ''
                          )}
                        >
                          <span>Close All Apps</span>
                        </button>

                        <div className={cn('my-1 border-t', isRetro ? 'border-[#d0c8b6]/60' : 'border-border')} />

                        {windows.length === 0 ? (
                            <div className="px-2 py-2 text-xs opacity-70 text-center">No apps open</div>
                        ) : (
                            windows.map(window => {
                                const app = apps[window.appId];
                                return (
                                    <button
                                        key={window.id}
                                        onClick={() => {
                                          focusWindow(window.id);
                                          setIsWindowMenuOpen(false);
                                        }}
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

            <div className="relative">
              <button
                className={cn(
                  'px-2 py-0.5 rounded cursor-pointer transition-colors flex items-center gap-1',
                  isIconMenuOpen && (isRetro ? 'bg-[#d0c8b6]/30' : 'bg-white/10'),
                  isRetro ? 'hover:bg-[#d0c8b6]/30' : 'hover:bg-white/10'
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsWindowMenuOpen(false);
                  setIsIconMenuOpen((v) => !v);
                }}
              >
                <LayoutGrid size={14} />
                Icons
              </button>

              {isIconMenuOpen && (
                <div
                  className={cn(
                    'absolute top-full left-0 mt-1 w-52 rounded-lg shadow-xl border p-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100',
                    isRetro
                      ? 'bg-[#fcfbf9] border-[#d0c8b6] text-[#2d2d2d] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]'
                      : isGlassy
                        ? 'bg-white/60 dark:bg-black/60 backdrop-blur-xl border-white/20 text-foreground'
                        : 'bg-white dark:bg-zinc-800 border-border text-foreground'
                  )}
                >
                  <div className="px-2 py-1.5 text-xs font-semibold opacity-70 border-b border-border mb-1">
                    Desktop Icons
                  </div>
                  <button
                    className={cn(
                      'w-full text-left px-2 py-2 text-sm rounded-md',
                      isRetro ? 'hover:bg-[#d0c8b6]/20' : 'hover:bg-muted'
                    )}
                    onClick={() => {
                      cleanUpIcons(desktopApps.map((a) => a.id), {
                        width: window.innerWidth,
                        height: window.innerHeight,
                        topOffset: 32,
                      });
                      setIsIconMenuOpen(false);
                    }}
                  >
                    Clean Up Icons
                  </button>
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

      <LoginDialog 
        isOpen={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
        onLogin={() => {
          setPersonalMode(true);
          setIsLoginDialogOpen(false);
        }}
      />
    </div>
  );
};
