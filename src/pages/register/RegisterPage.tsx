import { ROUTES } from '@/router';
import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import type { RegisterRequest } from '@/types/auth.ts';

import styles from './register.module.css';

export const RegisterPage = (): React.JSX.Element => {
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    name: '',
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    console.log('RegisterPage');
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(
      (prev): RegisterRequest => ({
        ...prev,
        [name]: value,
      })
    );
  };

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

        <Button htmlType="submit" type="primary" size="medium">
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
