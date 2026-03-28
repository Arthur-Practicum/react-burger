import { ROUTES } from '@/router';
import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { type FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useResetPasswordMutation } from '@services/auth-api';

import type { ResetPasswordRequest } from '@/types/auth.ts';

import styles from './reset-password.module.css';

export const ResetPasswordPage = (): React.JSX.Element => {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const navigate = useNavigate();

  const [formData, setFormData] = useState<ResetPasswordRequest>({
    password: '',
    token: '',
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    resetPassword(formData)
      .then((result) => {
        if (result.data) {
          localStorage.removeItem('passwordResetStep');
          setFormData({ password: '', token: '' });
          void navigate(ROUTES.Login);
        }
      })
      .catch((err) => console.error('Ошибка сброса пароля:', err));
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

  useEffect(() => {
    const passwordResetStep = localStorage.getItem('passwordResetStep');
    if (!passwordResetStep) {
      void navigate(ROUTES.ForgotPassword);
    }
  }, [navigate]);

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

        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
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
