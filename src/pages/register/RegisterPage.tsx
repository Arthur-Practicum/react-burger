import { ROUTES } from '@/router';
import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { type FormEvent, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from 'src/services/auth-api';

import { setAuthTokens } from '@services/auth-slice/authSlice.ts';
import { useAppDispatch, useAppSelector } from '@services/store.ts';

import type { RegisterRequest } from '@/types/auth.ts';

import styles from './register.module.css';

export const RegisterPage = (): React.JSX.Element => {
  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    name: '',
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    register(formData)
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
      .catch((error) => console.error('Ошибка регистрации:', error));
  }

  const clearInputs = (): void => {
    setFormData({
      email: '',
      password: '',
      name: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(
      (prev): RegisterRequest => ({
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
    <section className={styles['register-page']}>
      <h2 className={`text text_type_main-medium ${styles['register-page__title']}`}>
        Регистрация
      </h2>

      <form onSubmit={handleSubmit} className={styles['register-page__form']}>
        <Input
          placeholder="Имя"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />

        <EmailInput value={formData.email} onChange={handleInputChange} name="email" />

        <PasswordInput
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />

        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          Зарегистрироваться
        </Button>
      </form>

      <div className={styles['register-page__footer']}>
        <span className="text text_type_main-default text_color_inactive">
          Уже зарегистрированы?
        </span>

        <Link to={ROUTES.Login} className={styles['register-page__link']}>
          Войти
        </Link>
      </div>
    </section>
  );
};
