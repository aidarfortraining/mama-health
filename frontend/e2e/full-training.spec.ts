import { test, expect } from '@playwright/test';

test.describe('Full Training Session', () => {
  test('completes all exercises in sequence', async ({ page }) => {
    await page.goto('/');

    // Начинаем тренировку
    await page.click('text=Начать полную тренировку');

    // 1. Счёт вслух
    await expect(page.locator('h1')).toContainText('Счёт вслух');
    await page.click('text=СТАРТ');
    await page.waitForTimeout(500);
    await page.click('text=ГОТОВО');

    // Ждём перехода
    await page.waitForTimeout(2500);

    // 2. Арифметика
    await expect(page.locator('h1')).toContainText('Арифметика');
    // Отвечаем на несколько вопросов
    for (let i = 0; i < 3; i++) {
      const answerButton = page.locator('button').filter({ hasText: /^\d+$/ }).first();
      if (await answerButton.isVisible()) {
        await answerButton.click();
        await page.waitForTimeout(400);
      }
    }

    // Проверяем что тренировка работает
    await expect(page.getByText(/Правильных/)).toBeVisible();
  });
});
