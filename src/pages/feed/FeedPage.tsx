import { OrdersStats } from '@/components/orders-stats/orders-stats';
import { ROUTES } from '@/router';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { Modal } from '@components/modal/modal.tsx';
import { OrdersList } from '@components/orders-list/orders-list.tsx';

import styles from './feed-page.module.css';

export const FeedPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isOrderViewModalOpen = !!id;

  const handleModalClose = (): void => {
    void navigate(ROUTES.Feed);
  };

  return (
    <>
      <h1 className={`${styles.title} text mt-10 mb-5 pl-5 text_type_main-large`}>
        Лента заказов
      </h1>

      <main className={`${styles.container} pr-5 pl-5`}>
        <OrdersList />

        <OrdersStats />
      </main>

      <Modal isOpen={isOrderViewModalOpen} onClose={handleModalClose}>
        <Outlet />
      </Modal>
    </>
  );
};
