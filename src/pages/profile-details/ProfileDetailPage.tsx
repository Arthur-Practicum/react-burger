import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';

import { useUpdateUserMutation } from '@services/auth-api';
import { useAppSelector } from '@services/store.ts';

import type { RegisterRequest } from '@/types/auth.ts';

import styles from './profile-detail.module.css';

export const ProfileDetailPage = (): React.JSX.Element => {
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const user = useAppSelector((state) => state.auth.user);
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const [formData, setFormData] = useState<RegisterRequest>({
    name: '',
    email: '',
    password: '',
  });

  const [initialData, setInitialData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field: string, value: string): void => {
    setFormData((prev): RegisterRequest => ({ ...prev, [field]: value }));
  };

  const onReset = (): void => {
    setFormData(initialData);
  };

  const onSave = (): void => {
    if (accessToken) {
      updateUser({
        body: {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
        accessToken,
      })
        .then((res) => {
          if (res.data) {
            setInitialData({ name: formData.name, email: formData.email, password: '' });
            setFormData({ ...formData, password: '' });
          }
        })
        .catch((error) => console.error('Ошибка редактирования профиля:', error));
    }
  };

  useEffect(() => {
    if (user) {
      const userData = { name: user.name, email: user.email, password: '' };
      setFormData(userData);
      setInitialData(userData);
    }
  }, [user]);

  useEffect(() => {
    const changed =
      formData.name !== initialData.name ||
      formData.email !== initialData.email ||
      formData.password !== initialData.password;
    setHasChanges(changed);
  }, [formData, initialData]);

  return (
    <section className={styles['profile-detail-page']}>
      <Input
        value={formData.name}
        placeholder="Имя"
        onChange={(e) => handleInputChange('name', e.target.value)}
        icon="EditIcon"
      />

      <EmailInput
        value={formData.email}
        placeholder="Логин"
        onChange={(e) => handleInputChange('email', e.target.value)}
        isIcon={true}
      />

      <PasswordInput
        value={formData.password}
        placeholder="Пароль"
        onChange={(e) => handleInputChange('password', e.target.value)}
        icon="EditIcon"
      />

      {hasChanges && (
        <div className={styles['profile-detail-page__actions']}>
          <Button
            htmlType="button"
            type="secondary"
            onClick={onReset}
            disabled={isLoading}
          >
            Отмена
          </Button>

          <Button htmlType="button" type="primary" onClick={onSave} disabled={isLoading}>
            Сохранить
          </Button>
        </div>
      )}
    </section>
  );
};
