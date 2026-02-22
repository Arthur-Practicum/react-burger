import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Ingredient } from '@/types/ingredient.ts';

type IngredientModal = {
  selectedIngredient: Ingredient | null;
};

const initialState: IngredientModal = {
  selectedIngredient: null,
};

const ingredientModalSlice = createSlice({
  name: 'ingredientModal',
  initialState,
  reducers: {
    setIngredient: (state, action: PayloadAction<Ingredient>) => {
      state.selectedIngredient = action.payload;
    },
    clearIngredient: (state) => {
      state.selectedIngredient = null;
    },
  },
});

export const { setIngredient, clearIngredient } = ingredientModalSlice.actions;
export default ingredientModalSlice.reducer;
