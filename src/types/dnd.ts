import type { Ingredient } from '@/types/ingredient.ts';

export type DNDItem = {
  ingredient?: Ingredient;
  type?: string;
  index?: number;
};
