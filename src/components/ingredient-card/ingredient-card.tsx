import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';

import type { Ingredient } from '@/types/ingredient.ts';

import styles from './ingredient.module.css';

type IngredientCardprops = {
  ingredient: Ingredient;
  onClick: (ingredient: Ingredient) => void;
};

export const IngredientCard = ({
  ingredient,
  onClick,
}: IngredientCardprops): React.JSX.Element => {
  return (
    <div className={styles.card_wrapper} onClick={() => onClick(ingredient)}>
      <Counter count={1} size="default" />

      <img src={ingredient.image} alt="Картинка ингредиента" />

      <div className={styles.price_wrapper}>
        <span className="text text_type_digits-default">{ingredient.price}</span>

        <CurrencyIcon type="primary" />
      </div>

      <span>{ingredient.name}</span>
    </div>
  );
};
