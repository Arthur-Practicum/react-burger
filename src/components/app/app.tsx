import { useFetch } from '@/hooks/useFetch';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { Error } from '@components/error/error';
import { API_DOMAIN } from '@utils/constants.ts';

import type { Ingredient } from '@/types/ingredient.ts';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const { data, loading, error, refetch } = useFetch<{ data: Ingredient[] }>(
    `${API_DOMAIN}/ingredients`
  );

  if (loading) {
    return (
      <div className={styles.app}>
        <AppHeader />

        <div className={styles.loader_wrapper}>
          <Preloader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.app}>
        <AppHeader />

        <div className={styles.error_wrapper}>
          <Error onRetry={() => void refetch()} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />

      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>

      <main className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients ingredients={data?.data ?? []} />

        <BurgerConstructor ingredients={data?.data ?? []} />
      </main>
    </div>
  );
};

export default App;
