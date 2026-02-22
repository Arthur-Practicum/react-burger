import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';

import type { Ingredient } from '@/types/ingredient.ts';

import styles from './burger-constructor-list-item.module.css';

type BurgerConstructorListItemProps = {
  ingredient: Ingredient | undefined;
  isLocked: boolean;
  type?: 'top' | 'bottom';
};

export const BurgerConstructorListItem = ({
  ingredient,
  isLocked,
  type,
}: BurgerConstructorListItemProps): React.JSX.Element | null => {
  if (!ingredient) {
    return null;
  }

  const getIngredientText = (): string => {
    if (type === 'top') {
      return `${ingredient.name} (верх)`;
    }

    if (type === 'bottom') {
      return `${ingredient.name} (низ)`;
    }

    return ingredient.name;
  };
  return (
    <div className={styles.item_wrapper}>
      <div className={styles.icon_container}>
        {isLocked ? null : <DragIcon type="primary" />}
      </div>

      <ConstructorElement
        isLocked={isLocked}
        text={getIngredientText()}
        thumbnail={ingredient.image}
        price={ingredient.price}
        type={type}
      />
    </div>
  );
};
