import React from 'react';
import { useThemeStore, themes } from '@/stores/themeStore';

export const Wallpaper = () => {
  const { wallpaper, currentTheme } = useThemeStore();

  const theme = themes[currentTheme];

  const activeWallpaper = wallpaper?.trim().length ? wallpaper : theme.wallpaper;

  const backgroundImage = (() => {
    const value = activeWallpaper.trim();
    if (value.startsWith('url(')) return value;
    if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) {
      return `url(${value})`;
    }
    return value;
  })();

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden transition-colors duration-500 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out"
          style={{ backgroundImage }}
        />
        <div className="absolute inset-0 bg-black/10 dark:bg-black/40 transition-colors duration-500" />
    </div>
  );
};
