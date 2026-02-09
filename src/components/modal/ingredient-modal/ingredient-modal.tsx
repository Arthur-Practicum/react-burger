import type { Ingredient } from '@/types/ingredient.ts';

import styles from './ingredient-modal.module.css';

type IngredientModalProps = {
  ingredient: Ingredient;
};

export const IngredientModal = ({
  ingredient,
}: IngredientModalProps): React.JSX.Element => {
  const details = [
    {
      title: 'Калории,ккал',
      value: ingredient.calories,
    },
    {
      title: 'Белки, г',
      value: ingredient.proteins,
    },
    {
      title: 'Жиры, г',
      value: ingredient.fat,
    },
    {
      title: 'Углеводы, г',
      value: ingredient.carbohydrates,
    },
  ];

  return (
    <div className={styles.ingredient_wrapper}>
      <img src={ingredient.image_large} alt={ingredient.name} />

      <h3 className="text text_type_main-medium">{ingredient.name}</h3>

      <div className={styles.details_wrapper}>
        {details.map((detail, index) => (
          <div key={index} className={styles.detail}>
            <span className="text text_type_main-default text_color_inactive">
              {detail.title}
            </span>

            <span className="text text_type_digits-default text_color_inactive">
              {detail.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
