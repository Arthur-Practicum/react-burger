import { OrderItem } from '@/components/order-item/order-item';

import { useGetUserOrdersWithStatus } from '@services/order';
import { useAppSelector } from '@services/store.ts';

import styles from './profile-order-page.module.css';

export const ProfileOrderPage = (): React.JSX.Element => {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const { orders } = useGetUserOrdersWithStatus(accessToken ?? '');

  return (
    <section className={styles.profile_orders_page}>
      {orders.map((order) => (
        <OrderItem showStatus order={order} key={order._id} />
      ))}
    </section>
  );
};
