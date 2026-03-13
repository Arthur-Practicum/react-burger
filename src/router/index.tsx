import { createBrowserRouter } from 'react-router-dom';

import App from '@components/app/app.tsx';
import { IngredientModal } from '@components/modal/ingredient-modal/ingredient-modal.tsx';
import { Home } from '@pages/home';

export const ROUTES = {
  Home: '/',
  Ingredients: '/ingredients',
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
    ],
  },
]);
