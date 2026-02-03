import React, { useMemo, useState } from 'react';
import { App } from '@/stores/appStore';
import { useThemeStore } from '@/stores/themeStore';
import { cn } from '@/utils/cn';
import {
  RetroBrowserIcon,
  RetroExplorerIcon,
  RetroPortfolioIcon,
  RetroSettingsIcon,
  RetroPersonalIcon,
} from '@/components/icons/RetroLinealIcons';

interface DesktopIconProps {
  app: App;
}

const getIconFileName = (appId: string) => {
  // Map app IDs to their icon file names
  const iconMap: Record<string, string> = {};
  return iconMap[appId] || appId;
};

export const DesktopIcon = ({ app }: DesktopIconProps) => {
  const { currentTheme, isDarkMode } = useThemeStore();
  const isRetro = currentTheme === 'retro';
  const isGlassy = currentTheme === 'glassy';

  const [retroImgIndex, setRetroImgIndex] = useState(0);

  const retroAssetSrc = useMemo(() => {
    if (!isRetro) return null;
    const iconFileName = getIconFileName(app.id);
    return [`/retro-icons/${iconFileName}.png`, `/retro-icons/${iconFileName}.svg`, `/retro-icons/${iconFileName}.webp`];
  }, [app.id, isRetro]);

  const retroImgStyle = useMemo<React.CSSProperties>(() => {
    if (!isDarkMode) return {};
    return {
      filter:
        'drop-shadow(0 0 0 rgba(255,255,255,0.95)) drop-shadow(0 0 0 rgba(255,255,255,0.95)) drop-shadow(0 0 0 rgba(255,255,255,0.95))',
    };
  }, [isDarkMode]);

  const RetroIcon = (() => {
    switch (app.id) {
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
      default:
        return null;
    }
  })();

  return (
    <div
      className={cn(
        'group flex flex-col items-center gap-1.5 w-[84px] p-2 rounded-lg transition-all',
        isRetro ? 'hover:bg-[#d0c8b6]/20' : 'hover:bg-white/10 hover:backdrop-blur-sm'
      )}
    >
      {isRetro ? (
        <div className="transition-transform duration-200 group-hover:scale-105">
          {retroAssetSrc && retroImgIndex < retroAssetSrc.length ? (
            <img
              src={retroAssetSrc[retroImgIndex]}
              alt={app.title}
              width={56}
              height={56}
              draggable={false}
              style={retroImgStyle}
              onError={() => setRetroImgIndex((i) => i + 1)}
            />
          ) : RetroIcon ? (
            <RetroIcon size={56} mode={isDarkMode ? 'dark' : 'light'} />
          ) : (
            <app.icon
              size={44}
              strokeWidth={1.75}
              className={cn(isDarkMode ? 'text-white' : 'text-[#111111]')}
            />
          )}
        </div>
      ) : (
        <div
          className={cn(
            'w-12 h-12 flex items-center justify-center transition-transform duration-200 group-hover:scale-105',
            isGlassy
              ? 'bg-white/20 backdrop-blur-xl border border-white/30 rounded-[18px] shadow-lg'
              : 'bg-white dark:bg-zinc-800 rounded-xl shadow-md text-foreground'
          )}
        >
          <app.icon
            size={isGlassy ? 30 : 28}
            strokeWidth={isGlassy ? 1 : 1.5}
            className={cn(
              isGlassy
                ? 'text-white drop-shadow-md'
                : 'text-blue-500 dark:text-blue-400'
            )}
          />
        </div>
      )}
      <span className={cn(
          'text-xs font-medium text-center line-clamp-2 px-1 rounded-sm transition-colors',
          isRetro
            ? (isDarkMode
                ? 'text-white font-[IBM_Plex_Sans] font-semibold drop-shadow-sm'
                : 'text-[#111111] font-[IBM_Plex_Sans] font-semibold drop-shadow-sm')
            : 'text-white drop-shadow-md bg-black/20 group-hover:bg-black/40'
      )}>
        {app.title}
      </span>
    </div>
  );
};
