import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  username: string | null;
  isPersonalMode: boolean;
  setUsername: (username: string) => void;
  logout: () => void;
  setPersonalMode: (active: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      username: null,
      isPersonalMode: false,
      setUsername: (username) => set({ username: username.trim() }),
      logout: () => set({ username: null, isPersonalMode: false }),
      setPersonalMode: (active) => set({ isPersonalMode: active }),
    }),
    {
      name: 'user-storage',
    }
  )
);

