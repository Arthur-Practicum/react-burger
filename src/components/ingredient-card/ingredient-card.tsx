import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';
import { useDrag } from 'react-dnd';

import { useAppSelector } from '@services/store.ts';

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
  const { bun, ingredients } = useAppSelector((state) => state.burgerConstructor);

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

  const count = useMemo(() => {
    if (ingredient.type === 'bun') {
      return bun?._id === ingredient._id ? 2 : 0;
    }

    return ingredients.filter((ing) => ing._id === ingredient._id).length;
  }, [bun, ingredients, ingredient]);

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
      {count ? <Counter count={count} size="default" /> : null}

      <img src={ingredient.image} alt="Картинка ингредиента" />

      <div className={styles.price_wrapper}>
        <span className="text text_type_digits-default">{ingredient.price}</span>

        <CurrencyIcon type="primary" />
      </div>

      <span>{ingredient.name}</span>
    </div>
  );
};
