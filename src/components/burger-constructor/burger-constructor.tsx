import { Button, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useMemo, useState } from 'react';

import { BurgerConstructorListItem } from '@components/burger-constructor-list/burger-constructor-list-item.tsx';
import { Modal } from '@components/modal/modal.tsx';
import { OrderModal } from '@components/modal/order-modal/order-modal.tsx';

import type { Ingredient } from '@/types/ingredient.ts';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: Ingredient[];
};

export const BurgerConstructor = ({
  ingredients,
}: TBurgerConstructorProps): React.JSX.Element => {
  const [modalOpen, setModalOpen] = useState(false);

  const { bun, fillings } = useMemo(() => {
    const bun = ingredients.find((ingredient) => ingredient.type === 'bun');
    const fillings = ingredients.filter((ingredient) => ingredient.type !== 'bun');

    return { bun, fillings };
  }, [ingredients]);

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

        <Button
          htmlType="button"
          type="primary"
          size={'large'}
          onClick={() => setModalOpen(true)}
        >
          Оформить заказ
        </Button>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <OrderModal />
      </Modal>
    </section>
  );
};
