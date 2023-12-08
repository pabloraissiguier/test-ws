import { create } from "zustand";

interface UserState {
  user: string;
  setUser: (user: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: "",
  setUser: (user) => set({ user }),
}));
