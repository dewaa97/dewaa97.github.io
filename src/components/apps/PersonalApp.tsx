import React, { useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import { Lock, AlertCircle, LogOut } from 'lucide-react';
import { cn } from '@/utils/cn';

const LoginDialog = ({ isOpen, onClose, onLogin }: { isOpen: boolean; onClose: () => void; onLogin: () => void }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Salviohexia123!@#') {
      setError(false);
      setPassword('');
      onLogin();
    } else {
      setError(true);
      setPassword('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-background border-2 border-border rounded-2xl shadow-2xl w-full max-w-sm p-8 space-y-6">
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

        <button
          onClick={onClose}
          className="w-full py-2 bg-muted text-foreground rounded-xl font-medium hover:opacity-70 transition-opacity"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export const PersonalApp = () => {
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const { isPersonalMode, setPersonalMode } = useUserStore();

  const handleLogin = () => {
    setPersonalMode(true);
    setIsLoginDialogOpen(false);
  };

  const handleLogout = () => {
    setPersonalMode(false);
  };

  return (
    <>
      <LoginDialog 
        isOpen={isLoginDialogOpen} 
        onClose={() => setIsLoginDialogOpen(false)}
        onLogin={handleLogin}
      />
      <div className="h-full flex flex-col items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center space-y-4">
            <div className="text-3xl font-bold">dewaa97</div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Status:</p>
              <div className={cn(
                "inline-block px-4 py-2 rounded-lg font-semibold text-sm",
                isPersonalMode 
                  ? "bg-success/10 text-success" 
                  : "bg-muted text-muted-foreground"
              )}>
                {isPersonalMode ? "Personal Mode Active" : "Public Mode"}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {!isPersonalMode ? (
              <button
                onClick={() => setIsLoginDialogOpen(true)}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-opacity active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Lock size={18} />
                Login
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full py-3 bg-destructive/10 text-destructive rounded-xl font-bold hover:opacity-90 transition-opacity active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            )}
          </div>

          {isPersonalMode && (
            <div className="text-center text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg">
              You have access to personal apps. Close any open windows before logging out.
            </div>
          )}
        </div>
      </div>
    </>
  );
};
