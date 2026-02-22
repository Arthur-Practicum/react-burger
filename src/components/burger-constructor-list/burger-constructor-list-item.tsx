import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { moveIngredient, removeIngredient } from '@services/burger-constructor';
import { useAppDispatch } from '@services/store.ts';

import type { DNDItem } from '@/types/dnd.ts';
import type { IngredientExtended } from '@/types/ingredient.ts';

import styles from './burger-constructor-list-item.module.css';

type BurgerConstructorListItemProps = {
  ingredient: IngredientExtended;
  isLocked?: boolean;
  type?: 'top' | 'bottom';
  index?: number;
};

export const BurgerConstructorListItem = ({
  ingredient,
  isLocked = false,
  type,
  index = -1,
}: BurgerConstructorListItemProps): React.JSX.Element | null => {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, dragTarget] = useDrag(() => ({
    type: 'constructor',
    item: {
      index,
      type: 'constructor',
    },
    collect: (monitor): { isDragging: boolean } => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !isLocked,
  }));

  const [, dropTarget] = useDrop(
    () => ({
      accept: 'constructor',
      hover: (item: DNDItem): void => {
        if (
          !ref.current ||
          item.index === undefined ||
          item.index === index ||
          index < 0 ||
          item.index < 0
        ) {
          return;
        }

        const dragIndex = item.index;
        const hoverIndex = index;

        if (dragIndex !== hoverIndex) {
          dispatch(moveIngredient({ fromIndex: dragIndex, toIndex: hoverIndex }));
          item.index = hoverIndex;
        }
      },
      collect: (monitor): { isOver: boolean } => ({
        isOver: monitor.isOver(),
      }),
    }),
    [index]
  );

  const totalPrice = useMemo(() => {
    return ingredient.count && ingredient.count > 1
      ? ingredient.price * ingredient.count
      : ingredient.price;
  }, [ingredient.count]);

  const getIngredientText = (): string => {
    let text = ingredient.name;

    if (!isLocked && ingredient.count && ingredient.count > 1) {
      text = `${text} x${ingredient.count}`;
    }

    if (type === 'top') {
      return `${text} (верх)`;
    }

    if (type === 'bottom') {
      return `${text} (низ)`;
    }

    return text;
  };

  const handleOnClose = (): void => {
    if (isLocked) return;

    const uniqueKey = ingredient.uniqueKey;
    if (uniqueKey) {
      dispatch(removeIngredient(uniqueKey));
    }
  };

  const setRefs = (element: HTMLDivElement | null): void => {
    ref.current = element;
    dragTarget(dropTarget(element));
  };

  return (
    <div
      ref={setRefs}
      className={styles.item_wrapper}
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <div className={styles.icon_container}>
        {isLocked ? null : <DragIcon type="primary" />}
      </div>
      {isLocked}
      <ConstructorElement
        isLocked={isLocked}
        text={getIngredientText()}
        thumbnail={ingredient.image}
        price={totalPrice}
        type={type}
        handleClose={handleOnClose}
      />
    </div>
  );
};
