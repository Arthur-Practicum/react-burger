import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { IngredientsPreview } from '@components/ingredients-preview/ingredients-preview.tsx';
import { useGetIngredientsMap } from '@services/ingredients';
import { STATUSES } from '@utils/constants.ts';

import type { WSOrder } from '@/types/order.ts';
import type React from 'react';

import styles from './order-item.module.css';

type OrderItemProps = {
  order: WSOrder;
  showStatus?: boolean;
};

export const OrderItem = ({ order, showStatus }: OrderItemProps): React.JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const allIngredients = useGetIngredientsMap();

  const orderIngredients = useMemo(() => {
    return order.ingredients
      .map((ingredientId) => {
        return allIngredients[ingredientId];
      })
      .filter(Boolean);
  }, [allIngredients, order.ingredients]);

  const price = useMemo(() => {
    return orderIngredients.reduce((acc, curr) => (acc += curr.price), 0);
  }, [orderIngredients]);

  const handleOrderClick = (): void => {
    const basePath = location.pathname.includes('/profile')
      ? '/profile/orders'
      : '/feed';
    void navigate(`${basePath}/${order._id}`, {
      state: { background: location },
    });
  };

  return (
    <section className={styles.order_item} onClick={handleOrderClick}>
      <div className={styles.order_item_header}>
        <div className="text text_type_digits-default"># {order.number}</div>

        <FormattedDate
          className="text text_type_main-default text_color_inactive"
          date={new Date(order.createdAt)}
        />
      </div>

      <div className="text text_type_main-medium">{order.name}</div>

      {showStatus && (
        <div
          className={`text text_type_main-default ${
            order.status === 'done' ? styles.status_done : styles.status_pending
          }`}
        >
          {STATUSES[order.status]}
        </div>
      )}

      <div className={styles.order_item_footer}>
        <IngredientsPreview ingredients={orderIngredients} />

        <div className={styles.order_price}>
          <span className="text text_type_digits-medium">{price}</span>

          <CurrencyIcon type="primary" className={styles.icon} />
        </div>
      </div>
    </section>
  );
};
