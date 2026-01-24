import React, { useEffect } from 'react';
import { DesktopScreen } from '@/components/desktop/DesktopScreen';
import { useAppStore } from '@/stores/appStore';
import { useThemeStore } from '@/stores/themeStore';
import { initialApps } from '@/config/apps';

function App() {
  const { registerApp } = useAppStore();
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    initialApps.forEach(app => registerApp(app));
  }, [registerApp]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <DesktopScreen />
  );
}

export default App;
