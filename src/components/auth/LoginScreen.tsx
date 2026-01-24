import React, { useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import { cn } from '@/utils/cn';

export const LoginScreen = () => {
  const { setUsername } = useUserStore();
  const [value, setValue] = useState('');
  const trimmed = value.trim();

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl p-8">
        <div className="text-center mb-6">
          <div className="text-2xl font-bold">Welcome</div>
          <div className="text-sm text-muted-foreground mt-1">Enter a username to continue</div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!trimmed) return;
            setUsername(trimmed);
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="dewaa97"
              className={cn(
                'w-full h-11 rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-primary/40'
              )}
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={!trimmed}
            className={cn(
              'w-full h-11 rounded-lg font-semibold transition-colors',
              trimmed ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-muted-foreground cursor-not-allowed'
            )}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};
