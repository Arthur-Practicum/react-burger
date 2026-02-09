import { Button, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import { BurgerConstructorListItem } from '@components/burger-constructor-list/burger-constructor-list-item.tsx';
import { Modal } from '@components/modal/modal.tsx';
import { OrderModal } from '@components/modal/order-modal/order-modal.tsx';

import type { Ingredient } from '@/types/ingredient.ts';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: Ingredient[];
};

type ReturnType = 'top' | 'bottom' | undefined;

export const BurgerConstructor = ({
  ingredients,
}: TBurgerConstructorProps): React.JSX.Element => {
  const [modalOpen, setModalOpen] = useState(false);

  const getType = (index: number): ReturnType => {
    if (index === 0) return 'top';
    else if (index === ingredients.length - 1) return 'bottom';
    else return undefined;
  };

  return (
    <section className={styles.burger_constructor}>
      <ul className={`${styles.list_wrapper} custom-scroll`}>
        {ingredients.map((ingredient, index) => (
          <li key={ingredient._id}>
            <BurgerConstructorListItem
              ingredient={ingredient}
              isLocked={index === 0 || index === ingredients.length - 1}
              type={getType(index)}
            />
          </li>
        ))}
      </ul>

      <div className={styles.order_wrapper}>
        <div className={styles.order_price}>
          <span className="text text_type_digits-medium">300</span>

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
