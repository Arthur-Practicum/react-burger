import { OrderItem } from '@/components/order-item/order-item';
import { ROUTES } from '@/router';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { Modal } from '@components/modal/modal.tsx';
import { useGetUserOrdersWithStatus } from '@services/order';
import { useAppSelector } from '@services/store.ts';

import styles from './profile-order-page.module.css';

export const ProfileOrderPage = (): React.JSX.Element => {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const { orders } = useGetUserOrdersWithStatus(accessToken ?? '');
  const navigate = useNavigate();
  const { id } = useParams();

  const handleModalClose = (): void => {
    void navigate(`${ROUTES.Profile}/orders`);
  };

  return (
    <>
      <section className={styles.profile_orders_page}>
        {orders.map((order) => (
          <OrderItem showStatus order={order} key={order._id} />
        ))}
      </section>

      <Modal isOpen={!!id} onClose={handleModalClose}>
        <Outlet />
      </Modal>
    </>
  );
};
