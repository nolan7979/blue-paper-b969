import { create } from 'zustand';

interface TestStore {
  OddAsianHandicap: Map<string, string>;
  OddAsianHandicapHalf: Map<string, string>;
  OddEuropean: Map<string, string>;
  OddEuropeanHalf: Map<string, string>;
  OddOverUnder: Map<string, string>;
  OddOverUnderHalf: Map<string, string>;
  setOddAsianHandicap: (key: string, data: string) => void;
  setOddAsianHandicapHalf: (key: string, data: string) => void;
  setOddEuropeanHandicap: (key: string, data: string) => void;
  setOddEuropeanHandicapHalf: (key: string, data: string) => void;
  setOddOverUnder: (key: string, data: string) => void;
  setOddOverUnderHalf: (key: string, data: string) => void;
}

export const useTestStore = create<TestStore>((set) => ({
  OddAsianHandicap: new Map(),
  OddAsianHandicapHalf: new Map(),
  OddEuropean: new Map(),
  OddEuropeanHalf: new Map(),
  OddOverUnder: new Map(),
  OddOverUnderHalf: new Map(),
  setOddAsianHandicap: (key: string, data: string) =>
    set((state) => {
      state.OddAsianHandicap.set(key, data);
      return { OddAsianHandicap: state.OddAsianHandicap };
    }),
  setOddAsianHandicapHalf: (key: string, data: string) =>
    set((state) => {
      state.OddAsianHandicapHalf.set(key, data);
      return { OddAsianHandicapHalf: state.OddAsianHandicapHalf };
    }),
  setOddEuropeanHandicap: (key: string, data: string) =>
    set((state) => {
      state.OddEuropean.set(key, data);
      return { OddEuropean: state.OddEuropean };
    }),
  setOddEuropeanHandicapHalf: (key: string, data: string) =>
    set((state) => {
      state.OddEuropeanHalf.set(key, data);
      return { OddEuropeanHalf: state.OddEuropeanHalf };
    }),
  setOddOverUnder: (key: string, data: string) =>
    set((state) => {
      state.OddOverUnder.set(key, data);
      return { OddOverUnder: state.OddOverUnder };
    }),
  setOddOverUnderHalf: (key: string, data: string) =>
    set((state) => {
      state.OddOverUnderHalf.set(key, data);
      return { OddOverUnderHalf: state.OddOverUnderHalf };
    }),
}));
