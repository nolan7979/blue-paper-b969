import { LOCAL_STORAGE } from '@/constant/common';
import { getItemSession, setItemSession } from '@/utils/localStorageUtils';
import { create } from 'zustand';

interface MenuFooter {
  menuData: Record<string, any>[];
  setMenuData: (event: Record<string, any>[]) => void;
}
interface SuggestionsDownloadProps {
  isDisplayed: boolean;
  handleClose: () => void;
}
interface MenuFooter {
  menuData: Record<string, any>[];
  setMenuData: (event: Record<string, any>[]) => void;
}

interface SuggestionsDownloadProps {
  isDisplayed: boolean;
  handleClose: () => void;
}

interface HamburgerMenu {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

// Utility function to set an item in sessionStorage
const setSessionStorage = (key: string, value: any) => {
  setItemSession(key, JSON.stringify(value));
};

// Utility function to get an item from sessionStorage
const getSessionStorage = (key: string) => {
  const item = getItemSession(key);
  return item ? JSON.parse(item) : null;
};

// Initialize the state based on sessionStorage
const initializeIsDisplayed = () => {
  const isDisplayed = getSessionStorage(LOCAL_STORAGE.getApp);
  return isDisplayed !== null ? isDisplayed : true;
};

export const useMenuFooter = create<MenuFooter>((set) => ({
  menuData: [],
  setMenuData: (event: Record<string, any>[]) => set({ menuData: event }),
}));

export const useSuggestionsDownload = create<SuggestionsDownloadProps>((set) => ({
  isDisplayed: initializeIsDisplayed(),
  handleClose: () => {
    setSessionStorage(LOCAL_STORAGE.getApp, false);
    set({ isDisplayed: false });
  },
}));

export const useHamburgerMenu = create<HamburgerMenu>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));
