import { ROUTES } from '@/router';
import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import type { ResetPasswordRequest } from '@/types/auth.ts';

import styles from './reset-password.module.css';

export const ResetPasswordPage = (): React.JSX.Element => {
  const [formData, setFormData] = useState<ResetPasswordRequest>({
    password: '',
    token: '',
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    console.log('RegisterPage');
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(
      (prev): ResetPasswordRequest => ({
        ...prev,
        [name]: value,
      })
    );
  };

  return (
    <section className={styles['reset-page']}>
      <h2 className={`text text_type_main-medium ${styles['reset-page__title']}`}>
        Восстановление пароля
      </h2>

      <form onSubmit={handleSubmit} className={styles['reset-page__form']}>
        <PasswordInput
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Введите новый пароль"
        />

        <Input
          placeholder="Введите код из письма"
          name="token"
          value={formData.token}
          onChange={handleInputChange}
          required
        />

        <Button htmlType="submit" type="primary" size="medium">
          Сохранить
        </Button>
      </form>

      <div className={styles['reset-page__footer']}>
        <span className="text text_type_main-default text_color_inactive">
          Вспомнили пароль?
        </span>

        <Link to={ROUTES.Login} className={styles['reset-page__link']}>
          Войти
        </Link>
      </div>
    </section>
  );
};
