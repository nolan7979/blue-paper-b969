import { create } from 'zustand';

interface MatchNotifyStore {
  matches: string[];
  addMore: (id: string) => void;
  removeId: (id: string) => void;
}

const matchesData: string[] = [];
if (typeof window !== 'undefined') {
  const initialData = localStorage.getItem('matchesNotify');
  if (initialData) {
    Object.assign(matchesData, JSON.parse(initialData));
  }
}
export const useMatchNotify = create<MatchNotifyStore>((set) => ({
  matches: matchesData,
  addMore: (id: string) =>
    set((state) => {
      const existingIndex = state.matches.findIndex((item) => item === id);

      if (existingIndex !== -1) {
        const matches = [...state.matches];
        matches[existingIndex] = id;

        localStorage.setItem('matchesNotify', JSON.stringify(matches));
        return { matches };
      } else {
        const matches = [...state.matches, id];
        localStorage.setItem('matchesNotify', JSON.stringify(matches));
        return { matches };
      }
    }),
  removeId: (id: string) =>
    set((state) => {
      const existingIndex = state.matches.findIndex((item) => item === id);

      if (existingIndex !== -1) {
        const matches = [...state.matches];
        matches.splice(existingIndex, 1);
        localStorage.setItem('matchesNotify', JSON.stringify(matches));
        return { matches };
      } else {
        return { matches: state.matches };
      }
    }),
}));
