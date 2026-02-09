import { IngredientCard } from '@components/ingredient-card/ingredient-card.tsx';
import { TABS } from '@utils/constants.ts';

import type { Ingredient, IngredientsVariants } from '@/types/ingredient.ts';

import styles from './burger-ingredients-list.module.css';

type BurgerIngredientsListProps = {
  ref: React.Ref<HTMLElement>;
  ingredients: Ingredient[];
  type: IngredientsVariants;
  onCardClick: (ingredient: Ingredient) => void;
};

export const BurgerIngredientsList = ({
  ref,
  ingredients,
  type,
  onCardClick,
}: BurgerIngredientsListProps): React.JSX.Element => {
  return (
    <article ref={ref}>
      <h3>{TABS.find((tab) => tab.value === type)?.label}</h3>

      <ul className={styles.cards_list}>
        {ingredients.map((ingredient) => (
          <IngredientCard
            key={ingredient._id}
            ingredient={ingredient}
            onClick={onCardClick}
          />
        ))}
      </ul>
    </article>
  );
};
