import { create } from 'zustand';

interface IEvent {
  id: string;
  minute: any;
}

interface MinuteMatchLiveStore {
  idAndMinutes: IEvent[];
  addMore: (event: IEvent) => void;
}

export const useMinuteMatchLiveStore = create<MinuteMatchLiveStore>((set) => ({
  idAndMinutes: [],
  addMore: (event: IEvent) =>
    set((state) => {
      // No need to use optional chaining here since state is guaranteed to exist
      const existingIndex = state.idAndMinutes.findIndex(
        (item) => item.id === event.id
      );

      // If event exists, update it in place
      if (existingIndex !== -1) {
        return {
          idAndMinutes: state.idAndMinutes.map((item, index) =>
            index === existingIndex ? event : item
          ),
        };
      }

      // Otherwise add new event
      return {
        idAndMinutes: [...state.idAndMinutes, event],
      };
    }),
}));
