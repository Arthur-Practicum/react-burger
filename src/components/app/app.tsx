import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { Outlet } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { Error } from '@components/error/error';
import { useGetIngredientsQuery } from '@services/ingredients';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const { isLoading: loading, isError: error, refetch } = useGetIngredientsQuery({});

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

      <Outlet />
    </div>
  );
};

export default App;
