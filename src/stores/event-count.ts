import { create } from 'zustand';

interface EventCountStore {
  eventNumber: number;
  setEventNumber: (event: number) => void;
}

export const useEventCountStore = create<EventCountStore>((set) => ({
  eventNumber: -1,
  setEventNumber: (event: number) => set({ eventNumber: event }),
}));
