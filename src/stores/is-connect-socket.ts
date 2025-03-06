import { create } from 'zustand';

interface IsConnectSocketStore {
  isConnectSocket: boolean;
  setIsConnectSocket: (value: boolean) => void;
}

export const useIsConnectSocketStore = create<IsConnectSocketStore>((set) => ({
  isConnectSocket: false,
  setIsConnectSocket: (value: boolean) => set({ isConnectSocket: value }),
}));
