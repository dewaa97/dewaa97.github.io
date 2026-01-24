import React from 'react';
import { useWindowStore } from '@/stores/windowStore';
import { useAppStore } from '@/stores/appStore';
import { Window } from './Window';

export const WindowManager = () => {
  const { windows } = useWindowStore();
  const { apps } = useAppStore();

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {windows.map((window) => {
        const AppComp = apps[window.appId]?.component;
        if (!AppComp) return null;

        return (
            <div key={window.id} className="pointer-events-auto">
                <Window window={window}>
                    <AppComp />
                </Window>
            </div>
        );
      })}
    </div>
  );
};