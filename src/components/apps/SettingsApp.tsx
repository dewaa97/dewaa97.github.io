import React, { useMemo, useRef, useState } from 'react';
import { useThemeStore, themes } from '@/stores/themeStore';
import { Moon, Sun, Upload, Monitor, Box, Smartphone, Info, Terminal } from 'lucide-react';
import { cn } from '@/utils/cn';
import dfsLogo from '@/assets/dfs-logo.svg';

export const SettingsApp = () => {
  const { 
    currentTheme, 
    setTheme, 
    isDarkMode, 
    toggleDarkMode, 
    wallpaper, 
    setWallpaper, 
    wallpaperPresets, 
    addWallpaperPreset 
  } = useThemeStore();
  
  const [activeTab, setActiveTab] = useState<'appearance' | 'about'>('appearance');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      addWallpaperPreset(url);
    }
  };

  const availableWallpapers = useMemo(() => {
    const themeData = themes[currentTheme] as unknown as { wallpapers?: string[]; wallpaper?: string };
    const baseList = themeData.wallpapers?.length ? themeData.wallpapers : wallpaperPresets;
    const normalized = baseList.map((x) => x.trim());

    const current = wallpaper?.trim();
    if (current && !normalized.includes(current)) return [current, ...normalized];
    const themeDefault = themeData.wallpaper?.trim();
    if (themeDefault && !normalized.includes(themeDefault)) return [themeDefault, ...normalized];
    return normalized;
  }, [currentTheme, wallpaperPresets, wallpaper]);

  const getWallpaperBackgroundImage = (value: string) => {
    const v = value.trim();
    if (v.startsWith('url(')) return v;
    if (v.startsWith('http://') || v.startsWith('https://') || v.startsWith('data:')) return `url(${v})`;
    return v;
  };

  const getWallpaperImageSrc = (value: string) => {
    const v = value.trim();
    if (v.startsWith('url(')) {
      const inner = v.replace(/^url\(/i, '').replace(/\)$/, '').trim();
      return inner.replace(/^['"]|['"]$/g, '');
    }
    return v;
  };

  return (
    <div className="h-full bg-background text-foreground flex">
      {/* Sidebar */}
      <div className="w-48 bg-muted/30 border-r border-border p-4">
        <h2 className="font-bold mb-4 px-2">Settings</h2>
        <div className="space-y-1">
            <button 
                onClick={() => setActiveTab('appearance')}
                className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    activeTab === 'appearance' ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground"
                )}
            >
                Appearance
            </button>
            <button 
                onClick={() => setActiveTab('about')}
                className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    activeTab === 'about' ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground"
                )}
            >
                About
            </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'appearance' && (
            <>
                <h3 className="text-xl font-bold mb-6">Appearance</h3>
                
                <div className="space-y-8">
                    {/* Theme Style Selection */}
                    <section>
                        <h4 className="text-sm font-medium mb-3 text-muted-foreground">Theme Style</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl">
                            <button 
                                onClick={() => setTheme('default')}
                                className={cn(
                                    "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                                    currentTheme === 'default' ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                                )}
                            >
                                <div className="w-full aspect-video bg-zinc-100 dark:bg-zinc-800 border border-border rounded-lg shadow-sm mb-2 flex items-center justify-center relative overflow-hidden">
                                     {/* Preview of Default Style */}
                                     <div className="absolute inset-x-4 top-4 bottom-0 bg-white dark:bg-black rounded-t-lg border border-border shadow-md" />
                                     <Monitor className="relative z-10 text-muted-foreground" />
                                </div>
                                <span className="text-sm font-medium flex items-center gap-2">Default</span>
                            </button>
                            
                            <button 
                                onClick={() => setTheme('retro')}
                                className={cn(
                                    "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                                    currentTheme === 'retro' ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                                )}
                            >
                                <div className="w-full aspect-video bg-[#f4f1ea] border border-[#d0c8b6] rounded-lg shadow-sm mb-2 flex items-center justify-center relative overflow-hidden">
                                     {/* Preview of Retro Style */}
                                     <div className="absolute inset-x-4 top-4 bottom-0 bg-[#fcfbf9] rounded-t-lg border border-[#d0c8b6] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]" />
                                     <Box className="relative z-10 text-[#5c5c5c]" />
                                </div>
                                <span className="text-sm font-medium flex items-center gap-2">Retro Paper</span>
                            </button>

                            <button 
                                onClick={() => setTheme('glassy')}
                                className={cn(
                                    "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                                    currentTheme === 'glassy' ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                                )}
                            >
                                <div className="w-full aspect-video bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg shadow-sm mb-2 flex items-center justify-center relative overflow-hidden">
                                     {/* Preview of Glassy Style */}
                                     <div className="absolute inset-x-4 top-4 bottom-0 bg-white/30 backdrop-blur-md rounded-t-xl border border-white/40 shadow-lg" />
                                     <Smartphone className="relative z-10 text-white drop-shadow-md" />
                                </div>
                                <span className="text-sm font-medium flex items-center gap-2">Glassy</span>
                            </button>
                        </div>
                    </section>

                    {/* Dark Mode Toggle (Visible for ALL themes now, since Glassy supports it, and maybe Retro can too technically) */}
                    {/* Retro theme might look weird in dark mode if colors are hardcoded, but Glassy needs it. */}
                    {/* Let's allow it generally, user can decide. */}
                    <section>
                        <h4 className="text-sm font-medium mb-3 text-muted-foreground">Color Mode</h4>
                        <div className="grid grid-cols-2 gap-4 max-w-sm">
                            <button 
                                onClick={() => isDarkMode && toggleDarkMode()}
                                disabled={!isDarkMode}
                                className={cn(
                                    "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                                    !isDarkMode ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                                )}
                            >
                                <div className="w-full aspect-video bg-[#F9FAFB] border border-gray-200 rounded-md shadow-sm mb-2 flex items-center justify-center">
                                    <Sun className="text-orange-500" />
                                </div>
                                <span className="text-sm font-medium flex items-center gap-2">Light</span>
                            </button>
                            
                            <button 
                                onClick={() => !isDarkMode && toggleDarkMode()}
                                disabled={isDarkMode}
                                className={cn(
                                    "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                                    isDarkMode ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                                )}
                            >
                                <div className="w-full aspect-video bg-[#111827] border border-gray-800 rounded-md shadow-sm mb-2 flex items-center justify-center">
                                    <Moon className="text-blue-400" />
                                </div>
                                <span className="text-sm font-medium flex items-center gap-2">Dark</span>
                            </button>
                        </div>
                    </section>

                    <section>
                        <h4 className="text-sm font-medium mb-3 text-muted-foreground">Wallpaper</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {availableWallpapers.map((wp: string, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => setWallpaper(wp)}
                                    className={cn(
                                        "relative group aspect-video rounded-lg overflow-hidden border-2 transition-all",
                                        wallpaper === wp ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-primary/50"
                                    )}
                                >
                                    {wp.trim().startsWith('http://') ||
                                    wp.trim().startsWith('https://') ||
                                    wp.trim().startsWith('data:') ||
                                    wp.trim().startsWith('url(') ? (
                                      <img src={getWallpaperImageSrc(wp)} alt={`Wallpaper ${i + 1}`} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full" style={{ backgroundImage: getWallpaperBackgroundImage(wp), backgroundSize: 'cover', backgroundPosition: 'center' }} />
                                    )}
                                    {wallpaper === wp && (
                                        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full shadow-lg" />
                                        </div>
                                    )}
                                </button>
                            ))}
                            
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="aspect-video rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 flex flex-col items-center justify-center gap-2 transition-colors"
                            >
                                <Upload size={20} className="text-muted-foreground" />
                                <span className="text-xs font-medium text-muted-foreground">Upload Image</span>
                            </button>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleFileUpload}
                            />
                        </div>
                    </section>
                </div>
            </>
        )}

        {activeTab === 'about' && (
            <div className="flex flex-col items-center text-center max-w-lg mx-auto py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <img src={dfsLogo} alt="DFS" className="w-20 h-20 mb-6" />
                
                <h3 className="text-2xl font-bold mb-2">Dewa Fakha Shiva</h3>
                <p className="text-xs text-muted-foreground mb-8">Version 1.0.0</p>
                
                <div className="bg-muted/30 border border-border rounded-xl p-6 text-left space-y-4 shadow-sm w-full">
                    <div className="flex items-start gap-3">
                        <div className="mt-1 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                            <Terminal size={20} />
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1">Built with AI</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                This project is fully built using AI technology ("Vibe Code"). 
                                I don't write code manually; I use AI to bring my vision to life.
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                        <div className="mt-1 bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg text-purple-600 dark:text-purple-400">
                            <Info size={20} />
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1">Purpose</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                A centralized hub to showcase my work, projects, and digital presence. 
                                It serves as a public portfolio gathering everything I want to share with the world.
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="mt-8 text-xs text-muted-foreground">
                    © {new Date().getFullYear()} Dewa Fakha Shiva. All rights reserved.
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
