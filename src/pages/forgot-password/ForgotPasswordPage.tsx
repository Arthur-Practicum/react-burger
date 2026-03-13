import { ROUTES } from '@/router';
import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import type { ForgotPasswordRequest } from '@/types/auth.ts';

import styles from './forgot-password.module.css';

export const ForgotPasswordPage = (): React.JSX.Element => {
  const [formData, setFormData] = useState<ForgotPasswordRequest>({
    email: '',
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    console.log('RegisterPage');
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

        <Button htmlType="submit" type="primary" size="medium">
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
