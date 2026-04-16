import { OrderItem } from '@components/order-item/order-item.tsx';
import { useGetOrdersWithStatus } from '@services/order';

import styles from './orders-list.module.css';

export const OrdersList = (): React.JSX.Element => {
  const { orders } = useGetOrdersWithStatus();

  return (
    <section className={styles.orders_list}>
      {orders?.map((order) => (
        <OrderItem order={order} key={order._id} />
      ))}
    </section>
  );
};
