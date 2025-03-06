/* eslint-disable no-unsafe-optional-chaining */
import { create } from 'zustand';

export interface IdAndTimeLine {
  id: string;
  timeline: Record<string, any>[] | string
}

interface TimelineStore {
  idWithData: IdAndTimeLine[];
  addMore: (event: IdAndTimeLine) => void;
}

export const useTimeLineStore = create<TimelineStore>((set) => ({
  idWithData: [],
  addMore: (event: IdAndTimeLine) =>
    set((state) => {
      const existingIndex = state?.idWithData.findIndex(
        (item) => item?.id === event?.id
      );

      if (existingIndex !== -1) {
        const data = [...state?.idWithData];
        data[existingIndex] = event;

        return { idWithData: data };
      } else {
        return { idWithData: [...state?.idWithData, event] };
      }
    }),
}));
