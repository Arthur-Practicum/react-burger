import { createBrowserRouter } from 'react-router-dom';

import App from '@components/app/app.tsx';
import { Home } from '@pages/home';

export const ROUTES = {
  Home: '/',
};

export const router = createBrowserRouter([
  {
    path: ROUTES.Home,
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
]);
