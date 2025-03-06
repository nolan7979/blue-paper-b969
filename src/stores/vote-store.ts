import { create } from 'zustand';

interface VoteStoreState {
  votes: Map<string, string>;
  setVote: (matchId: string, selection: string) => void;
  initializeVotes: () => void;
}

const useVoteStore = create<VoteStoreState>((set) => ({
  votes: new Map(),
  setVote: (matchId: string, selection: string) =>
    set((state) => {
      const newVotes = new Map(state.votes);
      newVotes.set(matchId, selection);
      localStorage.setItem(
        'votes',
        JSON.stringify(Array.from(newVotes.entries()))
      );
      return { votes: newVotes };
    }),
  initializeVotes: () => {
    const storedVotes = localStorage.getItem('votes');
    if (storedVotes) {
      const parsedVotes = new Map<string, string>(JSON.parse(storedVotes));
      set({ votes: parsedVotes });
    }
  },
}));

export default useVoteStore;
