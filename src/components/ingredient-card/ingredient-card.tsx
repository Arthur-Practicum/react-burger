import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';

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
  const [{ isDragging }, dragTarget] = useDrag(() => ({
    type: 'ingredient',
    item: {
      ingredient,
    },
    collect: (monitor): { isDragging: boolean } => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const setRefs = (element: HTMLDivElement | null): void => {
    dragTarget(element);
  };

  return (
    <div
      ref={setRefs}
      className={styles.card_wrapper}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
      }}
      onClick={() => onClick(ingredient)}
    >
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
