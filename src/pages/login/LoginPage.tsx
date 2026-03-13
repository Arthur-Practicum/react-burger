import { ROUTES } from '@/router';
import {
  Button,
  EmailInput,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import type { LoginRequest } from '@/types/auth.ts';

import styles from './login.module.css';

export const LoginPage = (): React.JSX.Element => {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    console.log('RegisterPage');
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(
      (prev): LoginRequest => ({
        ...prev,
        [name]: value,
      })
    );
  };

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

        <Button htmlType="submit" type="primary" size="medium">
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
