import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeType = 'default' | 'retro' | 'glassy';

interface ThemeState {
  currentTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  wallpaper: string;
  setWallpaper: (url: string) => void;
  
  wallpaperPresets: string[];
  addWallpaperPreset: (url: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      currentTheme: 'default',
      setTheme: (theme) => set({ currentTheme: theme }),
      
      isDarkMode: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      
      wallpaper: 'radial-gradient(900px 700px at 20% 25%, rgba(111, 145, 255, 0.75), transparent 60%), radial-gradient(900px 700px at 80% 30%, rgba(255, 120, 203, 0.7), transparent 60%), radial-gradient(900px 700px at 60% 85%, rgba(95, 255, 198, 0.55), transparent 60%), linear-gradient(180deg, #0b1020, #0a0f18)',
      setWallpaper: (url) => set({ wallpaper: url }),
      
      wallpaperPresets: [
        'radial-gradient(900px 700px at 20% 25%, rgba(111, 145, 255, 0.75), transparent 60%), radial-gradient(900px 700px at 80% 30%, rgba(255, 120, 203, 0.7), transparent 60%), radial-gradient(900px 700px at 60% 85%, rgba(95, 255, 198, 0.55), transparent 60%), linear-gradient(180deg, #0b1020, #0a0f18)',
        'radial-gradient(1200px 800px at 20% 20%, rgba(255, 105, 180, 0.5), transparent 55%), radial-gradient(900px 700px at 75% 35%, rgba(255, 200, 87, 0.6), transparent 60%), radial-gradient(1000px 900px at 55% 85%, rgba(62, 180, 255, 0.5), transparent 65%), linear-gradient(180deg, #f7efe3, #efe3d0)',
        'linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.05)), repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1px, transparent 1px, transparent 6px), linear-gradient(135deg, #f4f1ea, #f9f6ef)',
        'repeating-conic-gradient(from 270deg at 50% 100%, #0b1f3a 0deg 12deg, #f6e6c8 12deg 24deg, #b8232a 24deg 36deg)',
      ],
      addWallpaperPreset: (url) => set((state) => ({ wallpaperPresets: [...state.wallpaperPresets, url] })),
    }),
    {
      name: 'theme-storage',
    }
  )
);

export const themes = {
  default: {
    name: 'Default',
    colors: {
      background: 'bg-background',
      foreground: 'text-foreground',
      windowBg: 'bg-background',
      windowBorder: 'border-border',
      topBarBg: 'bg-transparent',
      topBarText: 'text-white',
    },
    borderRadius: 'rounded-xl',
    font: 'font-sans',
    shadow: 'shadow-2xl',
    iconStyle: 'default',
  },
  retro: {
    name: 'Retro Paper',
    colors: {
      background: 'bg-[#f4f1ea] dark:bg-[#2c2c2c]',
      foreground: 'text-[#2d2d2d] dark:text-[#e0e0e0]',
      windowBg: 'bg-[#fcfbf9] dark:bg-[#1a1a1a]',
      windowBorder: 'border-[#d0c8b6] dark:border-[#4a4a4a]',
      topBarBg: 'bg-[#ebe7de] dark:bg-[#333333]',
      topBarText: 'text-[#5c5c5c] dark:text-[#e0e0e0]',
    },
    borderRadius: 'rounded-lg',
    font: 'font-[IBM_Plex_Sans]', 
    shadow: 'shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)]',
    wallpapers: [
      'repeating-conic-gradient(from 270deg at 50% 100%, #0b1f3a 0deg 12deg, #f6e6c8 12deg 24deg, #b8232a 24deg 36deg)',
      'radial-gradient(1200px 800px at 20% 20%, rgba(255, 105, 180, 0.55), transparent 55%), radial-gradient(900px 700px at 75% 35%, rgba(255, 200, 87, 0.65), transparent 60%), radial-gradient(1000px 900px at 55% 85%, rgba(62, 180, 255, 0.55), transparent 65%), linear-gradient(180deg, #f7efe3, #efe3d0)',
      'linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.05)), repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1px, transparent 1px, transparent 6px), linear-gradient(135deg, #f4f1ea, #f9f6ef)',
      'radial-gradient(500px 400px at 20% 30%, rgba(255, 99, 132, 0.45), transparent 60%), radial-gradient(600px 500px at 80% 20%, rgba(54, 162, 235, 0.45), transparent 65%), radial-gradient(600px 600px at 60% 80%, rgba(255, 206, 86, 0.5), transparent 65%), linear-gradient(180deg, #fbf7ee, #f3e9d7)',
    ],
    wallpaper: 'repeating-conic-gradient(from 270deg at 50% 100%, #0b1f3a 0deg 12deg, #f6e6c8 12deg 24deg, #b8232a 24deg 36deg)',
    iconStyle: 'retro',
  },
  glassy: {
    name: 'Glassy', 
    colors: {
      background: 'bg-transparent',
      foreground: 'text-foreground',
      windowBg: 'bg-white/40 dark:bg-black/40 backdrop-blur-2xl',
      windowBorder: 'border-white/20 dark:border-white/10',
      topBarBg: 'bg-white/20 backdrop-blur-xl border-b border-white/10',
      topBarText: 'text-foreground',
    },
    borderRadius: 'rounded-2xl',
    font: 'font-sans tracking-tight',
    shadow: 'shadow-xl shadow-black/5',
    wallpapers: [
      'radial-gradient(900px 700px at 20% 25%, rgba(111, 145, 255, 0.8), transparent 60%), radial-gradient(900px 700px at 80% 30%, rgba(255, 120, 203, 0.75), transparent 60%), radial-gradient(900px 700px at 60% 85%, rgba(95, 255, 198, 0.6), transparent 60%), linear-gradient(180deg, #0b1020, #0a0f18)',
      'radial-gradient(800px 600px at 30% 30%, rgba(255, 255, 255, 0.35), transparent 70%), radial-gradient(1200px 900px at 70% 70%, rgba(120, 200, 255, 0.55), transparent 60%), linear-gradient(135deg, #0a0f1a, #121a2a)',
      'radial-gradient(900px 700px at 40% 30%, rgba(255, 170, 120, 0.75), transparent 60%), radial-gradient(900px 700px at 75% 20%, rgba(170, 120, 255, 0.75), transparent 60%), radial-gradient(900px 700px at 60% 85%, rgba(120, 255, 220, 0.55), transparent 65%), linear-gradient(180deg, #0b1020, #0a0f18)',
    ],
    wallpaper: 'radial-gradient(900px 700px at 20% 25%, rgba(111, 145, 255, 0.8), transparent 60%), radial-gradient(900px 700px at 80% 30%, rgba(255, 120, 203, 0.75), transparent 60%), radial-gradient(900px 700px at 60% 85%, rgba(95, 255, 198, 0.6), transparent 60%), linear-gradient(180deg, #0b1020, #0a0f18)',
    iconStyle: 'glassy', 
  }
};
