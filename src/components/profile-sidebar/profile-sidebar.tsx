import { ROUTES } from '@/router';
import { NavLink } from 'react-router-dom';

import styles from './profile-sidebar.module.css';

export const ProfileSideBar = (): React.JSX.Element => {
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
