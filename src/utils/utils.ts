import type {
  GroupedIngredients,
  Ingredient,
  IngredientsVariants,
} from '@/types/ingredient.ts';

export const groupByIngredientsType = (
  ingredients: Ingredient[]
): GroupedIngredients[] => {
  const grouped = ingredients.reduce(
    (acc, ingredient) => {
      if (!acc[ingredient.type]) {
        acc[ingredient.type] = [];
      }

      acc[ingredient.type].push(ingredient);
      return acc;
    },
    {} as Record<IngredientsVariants, Ingredient[]>
  );

  return Object.entries(grouped).map(([type, ingredients]) => ({
    type: type as IngredientsVariants,
    ingredients,
  }));
};
