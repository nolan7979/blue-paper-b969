import { create } from "zustand";
import { persist } from "zustand/middleware";


interface SportBefore {
  sportName: string;
  setSportName: (name: string) => void;
}

export const useSportBefore = create<SportBefore>()(
  persist(
    (set) => ({
      sportName: "",
      setSportName: (name: string) => set(() => ({ sportName: name })),
    }),
    {
      name: "sport-storage", 
    }
  )
);
