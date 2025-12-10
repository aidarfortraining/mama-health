import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('displays app title', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Тренировка мозга');
  });

  test('shows all exercise options', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Счёт вслух')).toBeVisible();
    await expect(page.getByText('Арифметика')).toBeVisible();
    await expect(page.getByText('Чтение вслух')).toBeVisible();
    await expect(page.getByText('Тест Струпа')).toBeVisible();
    await expect(page.getByText('Память')).toBeVisible();
  });

  test('start training button navigates to first exercise', async ({ page }) => {
    await page.goto('/');

    await page.click('text=Начать полную тренировку');

    await expect(page).toHaveURL(/\/exercise\/counting/);
  });
});
