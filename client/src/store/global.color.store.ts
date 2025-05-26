import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const DEFAULT_COLORS = [
  "#E9EC89",
  "#489FFA",
  "#C88FCF",
  "#D84F68",
  "#4DBE95",
  "#F6C86A",
  "#8085FF",
];

interface ColorState {
  fixedColors: string[];
  setFixedColors: (colors: string[]) => void;
  assignFixedColors: (numberOfSeries: number) => string[];
};

export const useColorStore = create<ColorState>()(
  persist(
    (set, get) => ({

      fixedColors: DEFAULT_COLORS,

      setFixedColors: (colors) => set({ fixedColors: colors }),

      assignFixedColors: (numberOfSeries: number): string[] => {
        const currentColors = get().fixedColors;
        const colors: string[] = [];
        for (let i = 0; i < numberOfSeries; i++) {
          colors.push(currentColors[i % currentColors.length]);
        }
        return colors;
      },

    }),

    {
      name: 'color-storage',
      storage: createJSONStorage(() => localStorage),
    },
  )
);
