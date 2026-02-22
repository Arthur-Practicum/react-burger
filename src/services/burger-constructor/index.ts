import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

import type { Ingredient, IngredientExtended } from '@/types/ingredient.ts';

type BurgerConstructor = {
  ingredients: IngredientExtended[];
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
    addIngredient: {
      prepare: (ingredient: Ingredient) => ({
        payload: {
          ...ingredient,
          uniqueKey: nanoid(),
        },
      }),
      reducer: (state, action: PayloadAction<IngredientExtended>) => {
        state.ingredients.push(action.payload);
      },
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ing) => ing.uniqueKey !== action.payload
      );
    },
    addBun: (state, action: PayloadAction<Ingredient>) => {
      state.bun = action.payload;
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
