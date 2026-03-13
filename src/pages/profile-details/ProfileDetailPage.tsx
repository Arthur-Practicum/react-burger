import {
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import type { RegisterRequest } from '@/types/auth.ts';

import styles from './profile-detail.module.css';

export const ProfileDetailPage = (): React.JSX.Element => {
  const [formData, setFormData] = useState<RegisterRequest>({
    name: '',
    email: '',
    password: '',
  });

  const handleInputChange = (field: string, value: string): void => {
    setFormData((prev): RegisterRequest => ({ ...prev, [field]: value }));
  };

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
    </section>
  );
};
