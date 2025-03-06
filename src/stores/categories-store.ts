
import { CategoryDto } from '@/constant/interface';
import { create } from 'zustand';

interface CategoriesStore {
  categories: CategoryDto[];
  setCategories: (data: CategoryDto[]) => void;
}

export const useCategoriesStore = create<CategoriesStore>((set) => ({
  categories: [],
  setCategories: (data: CategoryDto[]) => set({ categories: data }),
}));
