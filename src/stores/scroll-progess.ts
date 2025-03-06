import { create } from 'zustand';

interface ScrollStore {
  scrollProgress: number;
  isScrolling: boolean;
  setScrollProgress: (progress: number) => void;
  setIsScrolling: (isScrolling: boolean) => void;
}

export const useScrollStore = create<ScrollStore>((set) => ({
  scrollProgress: 0,
  isScrolling: false,
  setScrollProgress: (progress: number) => set(() => ({ scrollProgress: progress })),
  setIsScrolling: (isScrolling: boolean) => set(() => ({ isScrolling })),
}));