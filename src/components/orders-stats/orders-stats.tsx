import { useGetOrdersWithStatus } from '@services/order';

import styles from './orders-stats.module.css';

export const OrdersStats = (): React.JSX.Element => {
  const { orders, total, totalToday } = useGetOrdersWithStatus();

  const readyOrders = orders?.filter((order) => order.status === 'done') ?? [];
  const inProgressOrders = orders?.filter((order) => order.status === 'pending') ?? [];

  return (
    <section className={styles.orders_stats}>
      <div className={styles.statuses}>
        {readyOrders.length > 0 && (
          <div className={styles.status_column}>
            <p className="text text_type_main-medium mb-6">Готовы:</p>

            <ul className={styles.ready_orders_list}>
              {readyOrders.map((order) => (
                <li key={order._id} className="text text_type_digits-small">
                  {order.number}
                </li>
              ))}
            </ul>
          </div>
        )}

        {inProgressOrders.length > 0 && (
          <div className={styles.status_column}>
            <p className="text text_type_main-medium mb-6">В работе:</p>

            <ul className={styles.inprogress_orders_list}>
              {inProgressOrders.map((order) => (
                <li key={order._id} className="text text_type_digits-small">
                  {order.number}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>
        <p className="text text_type_main-medium">Выполнено за все время:</p>

        <p className="text text_type_digits-large">{total}</p>
      </div>

      {totalToday && (
        <div>
          <p className="text text_type_main-medium">Выполнено за сегодня:</p>

          <p className="text text_type_digits-large">{totalToday}</p>
        </div>
      )}
    </section>
  );
};
