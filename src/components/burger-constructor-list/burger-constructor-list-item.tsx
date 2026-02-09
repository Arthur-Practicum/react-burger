import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';

import type { Ingredient } from '@/types/ingredient.ts';

import styles from './burger-constructor-list-item.module.css';

type BurgerConstructorListItemProps = {
  ingredient: Ingredient;
  isLocked: boolean;
  type?: 'top' | 'bottom';
};

export const BurgerConstructorListItem = ({
  ingredient,
  isLocked,
  type,
}: BurgerConstructorListItemProps): React.JSX.Element => {
  return (
    <div className={styles.item_wrapper}>
      <div className={styles.icon_container}>
        {isLocked ? null : <DragIcon type="primary" />}
      </div>

      <ConstructorElement
        isLocked={isLocked}
        text={ingredient.name}
        thumbnail={ingredient.image}
        price={ingredient.price}
        type={type}
      />
    </div>
  );
};
