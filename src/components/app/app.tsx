import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { Error } from '@components/error/error';
import { checkAuth } from '@services/auth-slice/authSlice.ts';
import { useGetIngredientsQuery } from '@services/ingredients';
import { useAppDispatch, useAppSelector } from '@services/store.ts';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const { isLoading: loading, isError: error, refetch } = useGetIngredientsQuery({});
  const dispatch = useAppDispatch();
  const { isInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    void dispatch(checkAuth());
  }, [dispatch]);

  if (loading || !isInitialized) {
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
