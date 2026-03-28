import { ROUTES } from '@/router';
import { logout as logoutAction } from '@/services/auth-slice/authSlice.ts';
import { NavLink } from 'react-router-dom';

import { useLogoutMutation } from '@services/auth-api';
import { useAppDispatch, useAppSelector } from '@services/store.ts';

import styles from './profile-sidebar.module.css';

export const ProfileSideBar = (): React.JSX.Element => {
  const [logout] = useLogoutMutation();

  const refreshToken = useAppSelector((state) => state.auth.refreshToken);
  const dispatch = useAppDispatch();

  function handleLogout(): void {
    if (refreshToken) {
      logout({ token: refreshToken })
        .then(() => dispatch(logoutAction()))
        .catch((error) => console.error('Ошибка логаута:', error));
    }
  }

  const navItems = [
    { to: ROUTES.Profile, text: 'Профиль', end: true },
    { to: `${ROUTES.Profile}/orders`, text: 'История заказов', end: true },
  ];

  return (
    <aside className={styles['profile-sidebar']}>
      <nav>
        <ul className={styles['profile-sidebar__list']}>
          {navItems.map((item) => (
            <li key={item.to} className={styles['profile-sidebar__item']}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  isActive
                    ? `${styles['profile-sidebar__link']} ${styles['profile-sidebar__link_active']} text text_type_main-medium`
                    : `${styles['profile-sidebar__link']} text text_type_main-medium text_color_inactive`
                }
              >
                {item.text}
              </NavLink>
            </li>
          ))}

          <li
            className={`text text_type_main-medium text_color_inactive ${styles['profile-sidebar__item_logout']}`}
            onClick={handleLogout}
          >
            Выход
          </li>
        </ul>
      </nav>

      <p
        className={`text text_type_main-default text_color_inactive ${styles['profile-sidebar__footer-text']}`}
      >
        В этом разделе вы можете изменить свои персональные данные
      </p>
    </aside>
  );
};
