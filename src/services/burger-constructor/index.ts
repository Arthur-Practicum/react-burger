import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Ingredient, IngredientExtended } from '@/types/ingredient.ts';

type BurgerConstructor = {
  ingredients: IngredientExtended[]; // Здесь будут уникальные ингредиенты с count
  bun: IngredientExtended | null;
};

const initialState: BurgerConstructor = {
  ingredients: [],
  bun: null,
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<IngredientExtended>) => {
      const existingIngredient = state.ingredients.find(
        (ing) => ing._id === action.payload._id
      );

      if (existingIngredient) {
        existingIngredient.count = (existingIngredient.count ?? 1) + 1;
      } else {
        state.ingredients.push({
          ...action.payload,
          count: 1,
        });
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      const ingredientIndex = state.ingredients.findIndex(
        (ing) => ing.uniqueKey === action.payload
      );

      if (ingredientIndex !== -1) {
        const ingredient = state.ingredients[ingredientIndex];

        if (ingredient.count && ingredient.count > 1) {
          ingredient.count -= 1;
        } else {
          state.ingredients.splice(ingredientIndex, 1);
        }
      }
    },
    addBun: (state, action: PayloadAction<Ingredient>) => {
      state.bun = {
        ...action.payload,
        count: 1,
      };
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const [movedItem] = state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, movedItem);
    },
    clearConstructor: (state) => {
      state.ingredients = [];
      state.bun = null;
    },
  },
});

export const {
  addIngredient,
  removeIngredient,
  addBun,
  moveIngredient,
  clearConstructor,
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
