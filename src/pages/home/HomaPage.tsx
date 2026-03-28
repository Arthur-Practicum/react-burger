import { ROUTES } from '@/router';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { BurgerConstructor } from '@components/burger-constructor/burger-constructor.tsx';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients.tsx';
import { Modal } from '@components/modal/modal.tsx';

import styles from './index.module.css';

export const Home = (): React.JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const isIngredientModalOpen = location.pathname.includes(ROUTES.Ingredients);

  const handleModalClose = (): void => {
    void navigate(ROUTES.Home);
  };

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
          Соберите бургер
        </h1>

        <main className={`${styles.main} pl-5 pr-5`}>
          <BurgerIngredients />

          <BurgerConstructor />
        </main>
      </DndProvider>

      <Modal
        title="Детали ингредиента"
        isOpen={isIngredientModalOpen}
        onClose={handleModalClose}
      >
        <Outlet />
      </Modal>
    </>
  );
};
