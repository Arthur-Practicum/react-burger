import { createBrowserRouter } from 'react-router-dom';

import App from '@components/app/app.tsx';
import { IngredientModal } from '@components/modal/ingredient-modal/ingredient-modal.tsx';
import { FeedPage } from '@pages/feed/FeedPage.tsx';
import { ForgotPasswordPage } from '@pages/forgot-password/ForgotPasswordPage.tsx';
import { Home } from '@pages/home/HomaPage.tsx';
import { LoginPage } from '@pages/login/LoginPage.tsx';
import { NotFoundPage } from '@pages/not-found/NotFoundPage.tsx';
import { ProfileDetailPage } from '@pages/profile-details/ProfileDetailPage.tsx';
import { ProfileOrderPage } from '@pages/profile-orders/ProfileOrderPage.tsx';
import { ProfilePage } from '@pages/profile/ProfilePage.tsx';
import { RegisterPage } from '@pages/register/RegisterPage.tsx';
import { ResetPasswordPage } from '@pages/reset-password/ResetPasswordPage.tsx';

export const ROUTES = {
  Home: '/',
  Ingredients: '/ingredients',
  Register: '/register',
  Login: '/login',
  ForgotPassword: '/forgot-password',
  ResetPassword: '/reset-password',
  Profile: '/profile',
  Feed: '/feed',
};

export const router = createBrowserRouter([
  {
    path: ROUTES.Home,
    element: <App />,
    children: [
      {
        path: ROUTES.Home,
        element: <Home />,
        children: [
          {
            path: `${ROUTES.Ingredients}/:id`,
            element: <IngredientModal />,
          },
        ],
      },
      {
        path: ROUTES.Register,
        element: <RegisterPage />,
      },
      {
        path: ROUTES.Login,
        element: <LoginPage />,
      },
      {
        path: ROUTES.ForgotPassword,
        element: <ForgotPasswordPage />,
      },
      {
        path: ROUTES.ResetPassword,
        element: <ResetPasswordPage />,
      },
      {
        path: ROUTES.Profile,
        element: <ProfilePage />,
        children: [
          {
            index: true,
            element: <ProfileDetailPage />,
          },
          {
            path: `${ROUTES.Profile}/orders`,
            element: <ProfileOrderPage />,
          },
        ],
      },
      { path: ROUTES.Feed, element: <FeedPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
