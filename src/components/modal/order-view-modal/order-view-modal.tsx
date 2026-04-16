import { ROUTES } from '@/router';
import { useGetIngredientsMap } from '@/services/ingredients';
import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { IngredientPreview } from '@components/ingredient-preview/ingredient-preview.tsx';
import {
  useGetOrderByIdQuery,
  useGetOrdersWithStatus,
  useGetUserOrdersWithStatus,
} from '@services/order';
import { useAppSelector } from '@services/store.ts';
import { STATUSES } from '@utils/constants.ts';

import type React from 'react';

import styles from './order-view-modal.module.css';

export const OrderViewModal = (): React.JSX.Element | null => {
  const { id } = useParams();
  const navigate = useNavigate();

  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const allIngredients = useGetIngredientsMap();

  const { orders: feedOrders, isLoading: isFeedLoading } = useGetOrdersWithStatus();
  const { orders: userOrders, isLoading: isUserOrdersLoading } =
    useGetUserOrdersWithStatus(accessToken ?? '');

  const cachedOrder = useMemo(() => {
    if (!id) return undefined;
    return feedOrders.find((o) => o._id === id) ?? userOrders.find((o) => o._id === id);
  }, [id, feedOrders, userOrders]);

  const {
    data: apiResponse,
    isLoading: isApiLoading,
    error: apiError,
  } = useGetOrderByIdQuery(id ?? '', { skip: !id || !!cachedOrder });

  const isLoading = isFeedLoading || isUserOrdersLoading || isApiLoading;

  const order = cachedOrder ?? apiResponse?.orders?.[0] ?? null;

  const isNotFound = !isLoading && !order && !!apiError;

  const orderIngredients = useMemo(() => {
    if (!order) return [];
    return order.ingredients
      .map((ingredientId) => allIngredients[ingredientId])
      .filter(Boolean);
  }, [order, allIngredients]);

  const groupedIngredients = useMemo(() => {
    const grouped = new Map<
      string,
      { ingredient: (typeof orderIngredients)[number]; count: number }
    >();

    orderIngredients.forEach((ingredient) => {
      const existing = grouped.get(ingredient._id);
      if (existing) {
        existing.count += 1;
      } else {
        grouped.set(ingredient._id, { ingredient, count: 1 });
      }
    });

    return Array.from(grouped.values());
  }, [orderIngredients]);

  const price = useMemo(() => {
    return groupedIngredients.reduce(
      (acc, item) => (acc += item.ingredient.price * item.count),
      0
    );
  }, [groupedIngredients]);

  useEffect(() => {
    if (isNotFound) {
      void navigate(ROUTES.Feed, { replace: true });
    }
  }, [isNotFound, navigate]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <p className="text text_type_main-medium text_color_inactive">
            Загрузка заказа...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className="mb-10">
          <p className="text text_type_digits-default"># {order.number}</p>
        </div>

        <div className="mb-3">
          <p className="text text_type_main-medium">{order.name}</p>
        </div>

        <div className={`status} mb-15`}>
          <p
            className={`text text_type_main-default ${
              order.status === 'done' ? styles.status_done : styles.status_pending
            }`}
          >
            {STATUSES[order.status]}
          </p>
        </div>

        <div className={`${styles.composition} mb-6`}>
          <p className="text text_type_main-medium">Состав:</p>

          <div className={styles.ingredients_list}>
            {groupedIngredients.map((item) => (
              <div key={item.ingredient._id} className={styles.ingredient_item}>
                <div className={styles.ingredient_info}>
                  <IngredientPreview
                    image={item.ingredient.image_mobile}
                    name={item.ingredient.name}
                  />

                  <span className="text text_type_main-default">
                    {item.ingredient.name}
                  </span>
                </div>

                <span className="text text_type_main-default">
                  {item.count} x
                  <div className={styles.order_price}>
                    <span className="text text_type_digits-medium">{price}</span>

                    <CurrencyIcon type="primary" className={styles.icon} />
                  </div>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.order_footer}>
          <p className="text text_type_main-default text_color_inactive">
            <FormattedDate date={new Date(order.createdAt)} />
          </p>

          <div className={styles.total_price}>
            <div className={styles.order_price}>
              <span className="text text_type_digits-medium">{price}</span>

              <CurrencyIcon type="primary" className={styles.icon} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
