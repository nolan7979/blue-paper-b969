import { produce } from 'immer';
import { create } from 'zustand';

// Assuming you have a type definition for a livescore event
interface LivescoreEvent {
  id: string;
  [key: string]: any; // Additional properties of the event
}

interface LivescoreStore {
  // liveScores: Record<string, LivescoreEvent>;
  liveScoresSocket: any;
  setLivescoreSocket: (newEvent: LivescoreEvent) => void;
  updateLivescoreEvent: (id: string, data: Partial<LivescoreEvent>) => void;
  removeAllLivescore: () => void;
}

const useLivescoreStore = create<LivescoreStore>((set) => ({
  liveScoresSocket: {},
  setLivescoreSocket: (newEvent) =>
    set({
      liveScoresSocket: { ...newEvent },
    }),
  updateLivescoreEvent: (id, data) =>
    set(
      produce((state: LivescoreStore) => {
        if (state.liveScoresSocket[id]) {
          state.liveScoresSocket[id] = {
            ...state.liveScoresSocket[id],
            ...data,
          };
        }
      })
    ),
  removeAllLivescore: () => {
    set({ liveScoresSocket: {} });
  },
}));

export { useLivescoreStore };
