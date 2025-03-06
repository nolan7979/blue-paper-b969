import { create } from 'zustand';

interface ConnectionState {
  isConnected: boolean;
  topicSocket: string | null;
  setIsConnected: (value: boolean) => void;
  setTopicSocket: (value: string | null) => void;
}

export const useConnectionStore = create<ConnectionState>((set) => ({
  isConnected: false,
  setIsConnected: (value: boolean) => set({ isConnected: value }),

  topicSocket: null,
  setTopicSocket: (value: string | null) => set({ topicSocket: value }),
}));
