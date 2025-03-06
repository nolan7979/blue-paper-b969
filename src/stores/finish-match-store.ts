import { create, SetState } from 'zustand';

interface FinishMatchState {
  matches: { id: string }[];
  addMatch: (id: string) => void;
  removeAllMatches: () => void;
}
export const useFinshMatch = create<FinishMatchState>(
  (set: SetState<FinishMatchState>) => ({
    matches: [],
    addMatch: (id: string) => {
      set((state) => {
        // Check if a match with the given id already exists
        const matchExists = state.matches.some((match) => match?.id === id);

        // If the match doesn't exist, add it
        if (!matchExists) {
          const newMatch = {
            id: id,
          };
          return {
            matches: [...state.matches, newMatch],
          };
        }

        // If the match already exists, return the current state
        return state;
      });
    },
    removeAllMatches: () => {
      set({
        matches: [],
      });
    },
  })
);
