import { create } from "zustand";

type BadgeState = {
  count: number;
  setCount: (n: number) => void;
};

export const useBadgeStore = create<BadgeState>((set) => ({
  count: 0,
  setCount: (n) => set({ count: n }),
}));