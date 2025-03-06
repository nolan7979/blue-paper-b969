import { create } from 'zustand';

interface VolleyState {
  isSocketVolleyBall: boolean;
  setIsSocketVolleyBall: (value: boolean) => void;
}
interface TennisState {
  isSocketTennis: boolean;
  setIsSocketTennis: (value: boolean) => void;
}
interface BasketballState {
  isSocketBasketBall: boolean;
  setIsSocketBasketBall: (value: boolean) => void;
}

interface FootBallState {
  isSocketFootball: boolean;
  setIsSocketFootball: (value: boolean) => void;
}

export const useVolleyStore = create<VolleyState>((set) => ({
  isSocketVolleyBall: false,
  setIsSocketVolleyBall: (value: boolean) => {
    set({ isSocketVolleyBall: value });
  },
}));

export const useTennisStore = create<TennisState>((set) => ({
  isSocketTennis: false,
  setIsSocketTennis: (value: boolean) => {
    set({ isSocketTennis: value });
  },
}));

export const useBasketballStore = create<BasketballState>((set) => ({
  isSocketBasketBall: false,
  setIsSocketBasketBall: (value: boolean) => {
    set({ isSocketBasketBall: value });
  },
}));

export const useFootballStore = create<FootBallState>((set) => ({
  isSocketFootball: false,
  setIsSocketFootball: (value: boolean) => {
    set({ isSocketFootball: value });
  },
}));
