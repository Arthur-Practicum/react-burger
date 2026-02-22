import styles from './order-modal.module.css';

type OrderModalProps = {
  order: number | null;
};

export const OrderModal = ({ order }: OrderModalProps): React.JSX.Element => {
  return (
    <div className={styles.order_wrapper}>
      <span className={`${styles.text_shadow} text text_type_digits-large`}>
        {order ?? 'Пусто'}
      </span>

      <span className="text text_type_main-medium mt-8 mb-15">идентификатор заказа</span>

      <img src="/done.svg" alt="done" />

      <span className="text text_type_main-default mt-15 mb-2">
        Ваш заказ начали готовить
      </span>

      <span className="text text_type_main-default text_color_inactive">
        Дождитесь готовности на орбитальной станции
      </span>
    </div>
  );
};
