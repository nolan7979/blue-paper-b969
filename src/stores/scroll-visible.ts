import { create } from 'zustand';

interface ScrollStore {
  scrollVisible: boolean;
  setScrollVisible: (visible: boolean) => void;
  targetRef: React.RefObject<HTMLDivElement>;
  setTargetRef: (ref: React.RefObject<HTMLDivElement>) => void;
}

export const useScrollVisible = create<ScrollStore>((set) => ({
  scrollVisible: true,
  setScrollVisible: (visible: boolean) => set(() => ({ scrollVisible: visible })),
   targetRef: { current: null }, 
  setTargetRef: (ref) => set({ targetRef: ref }),
}));