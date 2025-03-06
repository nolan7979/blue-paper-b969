import { LOCAL_STORAGE } from '@/constant/common';
import { create } from 'zustand';
interface SettingsStore {
  showHdp: boolean;
  setShowHdp: (showHdp: boolean) => void;

  show1x2: boolean;
  setShow1x2: (show1x2: boolean) => void;

  showTX: boolean;
  setShowTX: (showTX: boolean) => void;

  showFavorite: boolean;
  setShowFavorite: (showFavorite: boolean) => void;

  goalPrompt: boolean;
  setGoalPrompt: (goalPrompt: boolean) => void;

  showYellowCard: boolean;
  setShowYellowCard: (showYellowCard: boolean) => void;

  showRedCard: boolean;
  setShowRedCard: (showRedCard: boolean) => void;

  homeSound: string;
  setHomeSound: (homeSound: string) => void;

  awaySound: string;
  setAwaySound: (awaySound: string) => void;
}

// Check if localStorage is available
const isLocalStorageAvailable =
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const useSettingsStore = create<SettingsStore>((set) => {
  // Initialize the values from localStorage if available
  const initialShowHdp = isLocalStorageAvailable
    ? JSON.parse(localStorage.getItem(LOCAL_STORAGE.showHdp) || 'true')
    : true;

  const initialShow1x2 = isLocalStorageAvailable
    ? JSON.parse(localStorage.getItem(LOCAL_STORAGE.show1x2) || 'false')
    : false;

  const initialShowTX = isLocalStorageAvailable
    ? JSON.parse(localStorage.getItem(LOCAL_STORAGE.showTX) || 'true')
    : true;

  const initialShowFavorite = isLocalStorageAvailable
    ? JSON.parse(localStorage.getItem('showFavorite') || 'false')
    : false;

  const initialGoalPrompt = isLocalStorageAvailable
    ? JSON.parse(localStorage.getItem('goalPrompt') || 'false')
    : false;

  const initialShowYellowCard = isLocalStorageAvailable
    ? JSON.parse(localStorage.getItem(LOCAL_STORAGE.showYellowCard) || 'false')
    : false;
  const initialShowRedCard = isLocalStorageAvailable
    ? JSON.parse(localStorage.getItem(LOCAL_STORAGE.showRedCard) || 'false')
    : false;

  const initialHomeSound = isLocalStorageAvailable
    ? localStorage.getItem('homeSound') || 'Off'
    : 'Off';

  const initialAwaySound = isLocalStorageAvailable
    ? localStorage.getItem('awaySound') || 'Off'
    : 'Off';

  return {
    showHdp: initialShowHdp,
    setShowHdp: (showHdp: boolean) => {
      set({ showHdp });
      if (isLocalStorageAvailable) {
        localStorage.setItem(LOCAL_STORAGE.showHdp, JSON.stringify(showHdp));
      }
    },

    show1x2: initialShow1x2,
    setShow1x2: (show1x2: boolean) => {
      set({ show1x2 });
      if (isLocalStorageAvailable) {
        localStorage.setItem(LOCAL_STORAGE.show1x2, JSON.stringify(show1x2));
      }
    },

    showTX: initialShowTX,
    setShowTX: (showTX: boolean) => {
      set({ showTX });
      if (isLocalStorageAvailable) {
        localStorage.setItem(LOCAL_STORAGE.showTX, JSON.stringify(showTX));
      }
    },

    showFavorite: initialShowFavorite,
    setShowFavorite: (showFavorite: boolean) => {
      set({ showFavorite });
      if (isLocalStorageAvailable) {
        localStorage.setItem('showFavorite', JSON.stringify(showFavorite));
      }
    },

    goalPrompt: initialGoalPrompt,
    setGoalPrompt: (goalPrompt: boolean) => {
      set({ goalPrompt });
      if (isLocalStorageAvailable) {
        localStorage.setItem('goalPrompt', JSON.stringify(goalPrompt));
      }
    },

    showYellowCard: initialShowYellowCard,
    setShowYellowCard: (showYellowCard: boolean) => {
      set({ showYellowCard });
      if (isLocalStorageAvailable) {
        localStorage.setItem(
          LOCAL_STORAGE.showYellowCard,
          JSON.stringify(showYellowCard)
        );
      }
    },
    showRedCard: initialShowRedCard,
    setShowRedCard: (showRedCard: boolean) => {
      set({ showRedCard });
      if (isLocalStorageAvailable) {
        localStorage.setItem(
          LOCAL_STORAGE.showRedCard,
          JSON.stringify(showRedCard)
        );
      }
    },

    homeSound: initialHomeSound,
    setHomeSound: (homeSound: string) => {
      set({ homeSound });
      if (isLocalStorageAvailable) {
        localStorage.setItem('homeSound', homeSound);
      }
    },

    awaySound: initialAwaySound,
    setAwaySound: (awaySound: string) => {
      set({ awaySound });
      if (isLocalStorageAvailable) {
        localStorage.setItem('awaySound', awaySound);
      }
    },
  };
});
