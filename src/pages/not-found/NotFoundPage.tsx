import { ROUTES } from '@/router';
import { Link } from 'react-router-dom';

import styles from './not-found.module.css';

export const NotFoundPage = (): React.JSX.Element => {
  return (
    <section className={styles['not-found-page']}>
      <p className="text text_type_digits-large">404</p>

      <span className="text text_type_main-default text_color_inactive">
        Страница не найдена
      </span>

      <Link to={ROUTES.Home} className={styles['not-found-page__link']}>
        На главную
      </Link>
    </section>
  );
};
