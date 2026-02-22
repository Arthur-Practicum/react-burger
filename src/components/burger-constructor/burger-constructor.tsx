import { Button, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo, useState } from 'react';

import { BurgerConstructorListItem } from '@components/burger-constructor-list/burger-constructor-list-item.tsx';
import { Modal } from '@components/modal/modal.tsx';
import { OrderModal } from '@components/modal/order-modal/order-modal.tsx';
import { useGetIngredientsQuery } from '@services/ingredients';
import { useCreateOrderMutation } from '@services/order';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = (): React.JSX.Element => {
  const { data: ingredients = [] } = useGetIngredientsQuery({});
  const [createOrder, { isLoading, isError, error, data }] = useCreateOrderMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [order, setOrder] = useState<null | number>(null);

  const { bun, fillings } = useMemo(() => {
    const bun = ingredients.find((ingredient) => ingredient.type === 'bun');
    const fillings = ingredients.filter((ingredient) => ingredient.type !== 'bun');

    return { bun, fillings };
  }, [ingredients]);

  const handleOnClick = (): void => {
    // TODO
    createOrder({
      ingredients: [
        '692889f16bf770001bfeb4cc',
        '692889f16bf770001bfeb4d6',
        '692889f16bf770001bfeb4cc',
      ],
    }).catch((error) => console.error('Не удалось создать заказ:', error));
  };

  useEffect(() => {
    if (error) console.error('Не удалось создать заказ:', error);
    if (data) {
      setOrder(data.order.number);
      setModalOpen(true);
    }
  }, [data, error]);

  return (
    <section className={styles.burger_constructor}>
      <ul className={`${styles.list_wrapper}`}>
        <li>
          <BurgerConstructorListItem ingredient={bun} isLocked={true} type="top" />
        </li>

        <div className={`${styles.fillings_wrapper} custom-scroll`}>
          {fillings.map((filling) => (
            <li key={filling._id}>
              <BurgerConstructorListItem ingredient={filling} isLocked={false} />
            </li>
          ))}
        </div>

        <li>
          <BurgerConstructorListItem ingredient={bun} isLocked={true} type="bottom" />
        </li>
      </ul>
      <div className={styles.order_wrapper}>
        <div className={styles.order_price}>
          <span className="text text_type_digits-medium">610</span>

          <CurrencyIcon type="primary" className={styles.icon} />
        </div>

        <Button htmlType="button" type="primary" size={'large'} onClick={handleOnClick}>
          {isLoading ? 'Подождите...' : 'Оформить заказ'}
        </Button>

        {isError && (
          <p className="text text_type_main-small mt-4" style={{ color: 'red' }}>
            Ошибка при создании заказа, повторите попытку.
          </p>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <OrderModal order={order} />
      </Modal>
    </section>
  );
};
