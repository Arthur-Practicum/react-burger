import { ROUTES } from '@/router';
import {
  Button,
  EmailInput,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { type FormEvent, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useLoginMutation } from '@services/auth-api';
import { setAuthTokens } from '@services/auth-slice/authSlice.ts';
import { useAppDispatch, useAppSelector } from '@services/store.ts';

import type { LoginRequest } from '@/types/auth.ts';

import styles from './login.module.css';

export const LoginPage = (): React.JSX.Element => {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    login(formData)
      .then((res) => {
        if (res.data) {
          dispatch(
            setAuthTokens({
              user: res.data.user,
              accessToken: res.data.accessToken,
              refreshToken: res.data.refreshToken,
            })
          );

          clearInputs();
        }
      })
      .catch((error) => console.error('Ошибка авторизации:', error));
  }

  const clearInputs = (): void => {
    setFormData({
      email: '',
      password: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(
      (prev): LoginRequest => ({
        ...prev,
        [name]: value,
      })
    );
  };

  useEffect(() => {
    if (isAuthenticated) {
      const state = location.state as { from?: { pathname: string } };
      const fromLocation = state?.from?.pathname ?? ROUTES.Home;
      void navigate(fromLocation, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  return (
    <section className={styles['login-page']}>
      <h2 className={`text text_type_main-medium ${styles['login-page__title']}`}>
        Вход
      </h2>

      <form onSubmit={handleSubmit} className={styles['login-page__form']}>
        <EmailInput value={formData.email} onChange={handleInputChange} name="email" />

        <PasswordInput
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />

        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          Войти
        </Button>
      </form>

      <div className={styles['login-page__footer']}>
        <span className="text text_type_main-default text_color_inactive">
          Вы — новый пользователь?
        </span>

        <Link to={ROUTES.Register} className={styles['login-page__link']}>
          Зарегистрироваться
        </Link>
      </div>

      <div className={`${styles['login-page__footer']} mt-4`}>
        <span className="text text_type_main-default text_color_inactive">
          Забыли пароль?
        </span>

        <Link to={ROUTES.ForgotPassword} className={styles['login-page__link']}>
          Восстановить пароль
        </Link>
      </div>
    </section>
  );
};
