import { expect, test, type Locator, type Page } from '@playwright/test';

const mockBun = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  calories: 420,
  proteins: 80,
  price: 1255,
};

const mockMain = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  price: 424,
};

const mockSauce = {
  name: 'Соус Spicy-X',
};

const mockUser = { email: 'test@test.com', name: 'Тестовый пользователь' };
const mockAccessToken = 'Bearer mock-access-token-12345';
const mockRefreshToken = 'mock-refresh-token-12345';
const mockOrderNumber = 99999;

async function setAuthTokensInStorage(page: Page): Promise<void> {
  await page.evaluate(
    ({ user, accessToken, refreshToken }) => {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
    },
    { user: mockUser, accessToken: mockAccessToken, refreshToken: mockRefreshToken }
  );
}

function getIngredientCard(page: Page, name: string): Locator {
  return page.locator('[style*="grab"]').filter({ hasText: name });
}

async function dragToConstructor(page: Page, card: Locator): Promise<void> {
  const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
  const constructorSection = page.locator('section').last();

  await card.dispatchEvent('dragstart', { dataTransfer });
  await constructorSection.dispatchEvent('dragenter', { dataTransfer });
  await constructorSection.dispatchEvent('dragover', { dataTransfer });
  await constructorSection.dispatchEvent('drop', { dataTransfer });
  await card.dispatchEvent('dragend', { dataTransfer });
}

test.describe('Страница «Конструктор»', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('e2e/hars/api.har', {
      url: /new-stellarburgers\.education-services\.ru\/api/,
      notFound: 'abort',
    });
    await page.goto('/');
    await page.waitForSelector(`text=${mockBun.name}`);
  });

  test.describe('Модальное окно ингредиента', () => {
    test('открывается при клике на карточку', async ({ page }) => {
      await getIngredientCard(page, mockBun.name).click();

      await expect(page.getByText('Детали ингредиента')).toBeVisible();
      await expect(page.locator('#modals')).toContainText(mockBun.name);
    });

    test('меняет URL на /ingredients/:id при открытии', async ({ page }) => {
      await getIngredientCard(page, mockBun.name).click();

      await expect(page).toHaveURL(new RegExp(`/ingredients/${mockBun._id}`));
    });

    test('отображает детали ингредиента', async ({ page }) => {
      await getIngredientCard(page, mockBun.name).click();

      const modal = page.locator('#modals');
      await expect(modal).toContainText('Калории,ккал');
      await expect(modal).toContainText('Белки, г');
      await expect(modal).toContainText('Жиры, г');
      await expect(modal).toContainText('Углеводы, г');

      await expect(modal).toContainText(String(mockBun.calories));
      await expect(modal).toContainText(String(mockBun.proteins));
    });

    test('закрывается кнопкой «Закрыть»', async ({ page }) => {
      await getIngredientCard(page, mockBun.name).click();
      await expect(page.getByText('Детали ингредиента')).toBeVisible();

      await page.locator('#modals svg').click();

      await expect(page.locator('#modals')).toBeEmpty();
      await expect(page).toHaveURL(/#\/$/);
    });

    test('закрывается кликом по оверлею', async ({ page }) => {
      await getIngredientCard(page, mockBun.name).click();
      await expect(page.getByText('Детали ингредиента')).toBeVisible();

      const overlay = page.locator('#modals > div');
      await overlay.click({ position: { x: 5, y: 5 } });

      await expect(page.locator('#modals')).toBeEmpty();
      await expect(page).toHaveURL(/#\/$/);
    });

    test('закрывается клавишей Escape', async ({ page }) => {
      await getIngredientCard(page, mockBun.name).click();
      await expect(page.getByText('Детали ингредиента')).toBeVisible();

      await page.keyboard.press('Escape');

      await expect(page.locator('#modals')).toBeEmpty();
      await expect(page).toHaveURL(/#\/$/);
    });
  });

  test.describe('Перетаскивание ингредиентов', () => {
    test('добавляет булку в конструктор', async ({ page }) => {
      await dragToConstructor(page, getIngredientCard(page, mockBun.name));

      const constructor = page.locator('section').last();
      await expect(constructor).toContainText(`${mockBun.name} (верх)`);
      await expect(constructor).toContainText(`${mockBun.name} (низ)`);
    });

    test('добавляет начинку в конструктор', async ({ page }) => {
      await dragToConstructor(page, getIngredientCard(page, mockBun.name));
      await dragToConstructor(page, getIngredientCard(page, mockMain.name));

      await expect(page.locator('section').last()).toContainText(mockMain.name);
    });

    test('добавляет соус в конструктор', async ({ page }) => {
      await dragToConstructor(page, getIngredientCard(page, mockBun.name));
      await dragToConstructor(page, getIngredientCard(page, mockSauce.name));

      await expect(page.locator('section').last()).toContainText(mockSauce.name);
    });

    test('обновляет счётчик ингредиента после добавления', async ({ page }) => {
      await dragToConstructor(page, getIngredientCard(page, mockBun.name));
      await expect(getIngredientCard(page, mockBun.name)).toContainText('2');
    });

    test('увеличивает счётчик при повторном добавлении начинки', async ({ page }) => {
      await dragToConstructor(page, getIngredientCard(page, mockBun.name));
      await dragToConstructor(page, getIngredientCard(page, mockMain.name));
      await dragToConstructor(page, getIngredientCard(page, mockMain.name));
      await expect(getIngredientCard(page, mockMain.name)).toContainText('2');
    });

    test('показывает сумму заказа после добавления ингредиентов', async ({ page }) => {
      await dragToConstructor(page, getIngredientCard(page, mockBun.name));
      await dragToConstructor(page, getIngredientCard(page, mockMain.name));
      const expectedTotal = mockBun.price * 2 + mockMain.price;
      await expect(page.locator('section').last()).toContainText(String(expectedTotal));
    });
  });

  test.describe('Создание заказа', () => {
    test('перенаправляет неавторизованного пользователя на /login', async ({ page }) => {
      await dragToConstructor(page, getIngredientCard(page, mockBun.name));
      await dragToConstructor(page, getIngredientCard(page, mockMain.name));

      await page.getByRole('button', { name: 'Оформить заказ' }).click();

      await expect(page).toHaveURL(/#\/login/);
    });

    test('создаёт заказ и открывает модальное окно с номером', async ({ page }) => {
      await setAuthTokensInStorage(page);
      await page.reload();
      await page.waitForSelector(`text=${mockBun.name}`);

      await dragToConstructor(page, getIngredientCard(page, mockBun.name));
      await dragToConstructor(page, getIngredientCard(page, mockMain.name));

      await page.getByRole('button', { name: 'Оформить заказ' }).click();

      const modal = page.locator('#modals');
      await expect(modal).toContainText(String(mockOrderNumber));
      await expect(modal).toContainText('идентификатор заказа');
      await expect(modal).toContainText('Ваш заказ начали готовить');
    });

    test('очищает конструктор после успешного оформления заказа', async ({ page }) => {
      await setAuthTokensInStorage(page);
      await page.reload();
      await page.waitForSelector(`text=${mockBun.name}`);

      await dragToConstructor(page, getIngredientCard(page, mockBun.name));
      await dragToConstructor(page, getIngredientCard(page, mockMain.name));

      await page.getByRole('button', { name: 'Оформить заказ' }).click();
      await expect(page.locator('#modals')).toContainText('идентификатор заказа');

      await page.locator('#modals svg').click();

      await expect(page.locator('section').last()).toContainText(
        'Выберите булки и ингредиенты'
      );
    });

    test('модальное окно заказа закрывается кнопкой «Закрыть»', async ({ page }) => {
      await setAuthTokensInStorage(page);
      await page.reload();
      await page.waitForSelector(`text=${mockBun.name}`);

      await dragToConstructor(page, getIngredientCard(page, mockBun.name));
      await dragToConstructor(page, getIngredientCard(page, mockMain.name));

      await page.getByRole('button', { name: 'Оформить заказ' }).click();
      await expect(page.locator('#modals')).toContainText('идентификатор заказа');

      await page.locator('#modals svg').click();

      await expect(page.locator('#modals')).toBeEmpty();
    });

    test('модальное окно заказа закрывается кликом по оверлею', async ({ page }) => {
      await setAuthTokensInStorage(page);
      await page.reload();
      await page.waitForSelector(`text=${mockBun.name}`);

      await dragToConstructor(page, getIngredientCard(page, mockBun.name));
      await dragToConstructor(page, getIngredientCard(page, mockMain.name));

      await page.getByRole('button', { name: 'Оформить заказ' }).click();
      await expect(page.locator('#modals')).toContainText('идентификатор заказа');

      const overlay = page.locator('#modals > div');
      await overlay.click({ position: { x: 5, y: 5 } });

      await expect(page.locator('#modals')).toBeEmpty();
    });

    test('полный путь пользователя: сборка бургера → заказ → подтверждение', async ({
      page,
    }) => {
      await setAuthTokensInStorage(page);
      await page.reload();
      await page.waitForSelector(`text=${mockBun.name}`);

      await dragToConstructor(page, getIngredientCard(page, mockBun.name));
      await expect(page.locator('section').last()).toContainText(
        `${mockBun.name} (верх)`
      );

      await dragToConstructor(page, getIngredientCard(page, mockMain.name));
      await expect(page.locator('section').last()).toContainText(mockMain.name);

      await dragToConstructor(page, getIngredientCard(page, mockSauce.name));
      await expect(page.locator('section').last()).toContainText(mockSauce.name);

      await page.getByRole('button', { name: 'Оформить заказ' }).click();

      const modal = page.locator('#modals');
      await expect(modal).toContainText(String(mockOrderNumber));
      await expect(modal).toContainText('идентификатор заказа');
      await expect(modal).toContainText('Ваш заказ начали готовить');
      await expect(modal).toContainText('Дождитесь готовности на орбитальной станции');

      await page.locator('#modals svg').click();
      await expect(modal).toBeEmpty();

      await expect(page.locator('section').last()).toContainText(
        'Выберите булки и ингредиенты'
      );
    });
  });
});