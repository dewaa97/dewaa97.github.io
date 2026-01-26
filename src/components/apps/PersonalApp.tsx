import React, { useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import { useWindowStore } from '@/stores/windowStore';
import { Lock, Unlock, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

export const PersonalApp = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { isPersonalMode, setPersonalMode } = useUserStore();
  const { closeWindow } = useWindowStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Salviohexia123!@#') {
      setPersonalMode(true);
      setError(false);
      // Close this window after successful login
      // We need to find the window id for this app
    } else {
      setError(true);
      setPassword('');
    }
  };

  if (isPersonalMode) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6 bg-background">
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center text-success animate-in zoom-in duration-300">
          <Unlock size={40} />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Personal Mode Active</h2>
          <p className="text-muted-foreground max-w-xs mx-auto">
            You now have access to your personal apps. You can find them on the desktop.
          </p>
        </div>
        <button
          onClick={() => {
            // Find and close this window
            const win = document.querySelector('[data-appid="personal"]');
            if (win) {
              const closeBtn = win.querySelector('button[aria-label="Close"]');
              if (closeBtn instanceof HTMLElement) closeBtn.click();
            }
          }}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity"
        >
          Got it
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-background">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold">Access Personal Space</h2>
          <p className="text-muted-foreground">Please enter your password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(false);
              }}
              placeholder="Enter password"
              className={cn(
                "w-full px-4 py-3 rounded-xl bg-muted border-2 transition-all outline-none",
                error ? "border-destructive focus:border-destructive" : "border-transparent focus:border-primary"
              )}
              autoFocus
            />
            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm px-1 animate-in slide-in-from-top-1">
                <AlertCircle size={14} />
                <span>Incorrect password. Please try again.</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-opacity active:scale-[0.98]"
          >
            Unlock
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground pt-4">
          Your personal data is protected and encrypted.
        </p>
      </div>
    </div>
  );
};
