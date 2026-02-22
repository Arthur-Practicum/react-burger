import { Button, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { nanoid } from '@reduxjs/toolkit';
import { useEffect, useMemo, useState } from 'react';
import { useDrop } from 'react-dnd';

import { BurgerConstructorListItem } from '@components/burger-constructor-list/burger-constructor-list-item.tsx';
import { EmptyConstructor } from '@components/empty-constructor/empty-constructor.tsx';
import { Modal } from '@components/modal/modal.tsx';
import { OrderModal } from '@components/modal/order-modal/order-modal.tsx';
import { addBun, addIngredient, clearConstructor } from '@services/burger-constructor';
import { useCreateOrderMutation } from '@services/order';
import { useAppDispatch, useAppSelector } from '@services/store.ts';

import type { DNDItem } from '@/types/dnd.ts';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = (): React.JSX.Element => {
  const [createOrder, { isLoading, isError, error, data }] = useCreateOrderMutation();

  const { bun, ingredients } = useAppSelector((state) => state.burgerConstructor);

  const [modalOpen, setModalOpen] = useState(false);
  const [order, setOrder] = useState<null | number>(null);

  const dispatch = useAppDispatch();
  const isEmpty = !bun && !ingredients.length;

  const totalPrice = useMemo(() => {
    return (
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce((sum, ing) => sum + ing.price * (ing.count ?? 1), 0)
    );
  }, [bun, ingredients]);

  const [{ isOver }, dropTarget] = useDrop({
    accept: 'ingredient',
    drop: (item: DNDItem) => {
      if (item.ingredient) {
        if (item.ingredient.type === 'bun') {
          dispatch(addBun(item.ingredient));
        } else {
          dispatch(
            addIngredient({
              ...item.ingredient,
              uniqueKey: nanoid(),
            })
          );
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const setRefs = (element: HTMLDivElement | null): void => {
    dropTarget(element);
  };

  const handleOnClick = (): void => {
    if (!bun || ingredients.length === 0) {
      return;
    }

    const ingredientIds: string[] = [bun._id];

    ingredients.forEach((ing) => {
      const count = ing.count ?? 1;
      for (let i = 0; i < count; i++) {
        ingredientIds.push(ing._id);
      }
    });

    ingredientIds.push(bun._id);

    createOrder({
      ingredients: ingredientIds,
    }).catch((error) => console.error('Не удалось создать заказ:', error));
  };

  useEffect(() => {
    if (error) console.error('Не удалось создать заказ:', error);
    if (data) {
      setOrder(data.order.number);
      setModalOpen(true);
      dispatch(clearConstructor());
    }
  }, [data, error]);

  return (
    <section
      ref={setRefs}
      className={styles.burger_constructor}
      style={{
        border: isOver ? '2px solid #4c4cff' : '2px solid transparent',
      }}
    >
      {isEmpty ? (
        <EmptyConstructor />
      ) : (
        <>
          <ul className={`${styles.list_wrapper}`}>
            {bun && (
              <li>
                <BurgerConstructorListItem ingredient={bun} isLocked type="top" />
              </li>
            )}

            <div className={`${styles.fillings_wrapper} custom-scroll`}>
              {ingredients.map((filling, index) => (
                <li key={filling._id}>
                  <BurgerConstructorListItem ingredient={filling} index={index} />
                </li>
              ))}
            </div>

            {bun && (
              <li>
                <BurgerConstructorListItem ingredient={bun} isLocked type="bottom" />
              </li>
            )}
          </ul>

          <div className={styles.order_wrapper}>
            <div className={styles.order_price}>
              <span className="text text_type_digits-medium">{totalPrice}</span>

              <CurrencyIcon type="primary" className={styles.icon} />
            </div>

            <Button
              htmlType="button"
              type="primary"
              size={'large'}
              onClick={handleOnClick}
            >
              {isLoading ? 'Подождите...' : 'Оформить заказ'}
            </Button>

            {isError && (
              <p className="text text_type_main-small mt-4" style={{ color: 'red' }}>
                Ошибка при создании заказа, повторите попытку.
              </p>
            )}
          </div>
        </>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <OrderModal order={order} />
      </Modal>
    </section>
  );
};
