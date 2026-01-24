import React, { useEffect } from 'react';
import { DesktopScreen } from '@/components/desktop/DesktopScreen';
import { LoginScreen } from '@/components/auth/LoginScreen';
import { useAppStore } from '@/stores/appStore';
import { useThemeStore } from '@/stores/themeStore';
import { initialApps } from '@/config/apps';
import { useUserStore } from '@/stores/userStore';

function App() {
  const { registerApp } = useAppStore();
  const { isDarkMode } = useThemeStore();
  const { username } = useUserStore();

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
    username ? <DesktopScreen /> : <LoginScreen />
  );
}

export default App;
