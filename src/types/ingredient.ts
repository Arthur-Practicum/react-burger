export type Ingredient = {
  _id: string;
  name: string;
  type: IngredientsVariants;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
};

export type IngredientsVariants = 'bun' | 'main' | 'sauce';

export type GroupedIngredients = {
  type: IngredientsVariants;
  ingredients: Ingredient[];
};
