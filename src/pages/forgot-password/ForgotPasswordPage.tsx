import { ROUTES } from '@/router';
import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useForgotPasswordMutation } from '@services/auth-api';

import type { ForgotPasswordRequest } from '@/types/auth.ts';

import styles from './forgot-password.module.css';

export const ForgotPasswordPage = (): React.JSX.Element => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ForgotPasswordRequest>({
    email: '',
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    forgotPassword(formData)
      .then((res) => {
        if (res.data) {
          localStorage.setItem('passwordResetStep', 'true');
          setFormData({ email: '' });
          void navigate(ROUTES.ResetPassword);
        }
      })
      .catch((err) => console.error('Ошибка востановления пароля:', err));
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(
      (prev): ForgotPasswordRequest => ({
        ...prev,
        [name]: value,
      })
    );
  };

  return (
    <section className={styles['forgot-page']}>
      <h2 className={`text text_type_main-medium ${styles['forgot-page__title']}`}>
        Восстановление пароля
      </h2>

      <form onSubmit={handleSubmit} className={styles['forgot-page__form']}>
        <EmailInput
          value={formData.email}
          onChange={handleInputChange}
          name="email"
          placeholder="Укажите e-mail"
        />

        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          Восстановить
        </Button>
      </form>

      <div className={styles['forgot-page__footer']}>
        <span className="text text_type_main-default text_color_inactive">
          Вспомнили пароль?
        </span>

        <Link to={ROUTES.Login} className={styles['forgot-page__link']}>
          Войти
        </Link>
      </div>
    </section>
  );
};
