import { Outlet } from 'react-router-dom';

import { ProfileSideBar } from '@components/profile-sidebar/profile-sidebar.tsx';

import styles from './profile.module.css';

export const ProfilePage = (): React.JSX.Element => {
  return (
    <section className={styles.profile}>
      <ProfileSideBar />

      <Outlet />
    </section>
  );
};
