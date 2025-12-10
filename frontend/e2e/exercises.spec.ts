import { test, expect } from '@playwright/test';

test.describe('Counting Exercise', () => {
  test('completes counting exercise', async ({ page }) => {
    await page.goto('/exercise/counting');

    await expect(page.locator('h1')).toContainText('Счёт вслух');

    await page.click('text=СТАРТ');

    // Ждём 1 секунду
    await page.waitForTimeout(1000);

    await page.click('text=ГОТОВО');

    await expect(page.getByText('Отлично!')).toBeVisible();
  });
});

test.describe('Arithmetic Exercise', () => {
  test('displays math problem', async ({ page }) => {
    await page.goto('/exercise/arithmetic');

    await expect(page.locator('text=Арифметика')).toBeVisible();
    await expect(page.locator('text=/\\d+ \\+ \\d+ = \\?/')).toBeVisible();
  });

  test('shows feedback on answer', async ({ page }) => {
    await page.goto('/exercise/arithmetic');

    // Ждём загрузки
    await page.waitForSelector('text=Арифметика');

    // Кликаем на первый вариант ответа
    const buttons = await page.locator('button').all();
    const answerButtons = buttons.filter(async (b) => {
      const text = await b.textContent();
      return /^\d+$/.test(text || '');
    });

    if (answerButtons.length > 0) {
      await answerButtons[0].click();
    }

    // Проверяем что прогресс обновился
    await expect(page.locator('text=/2 из/')).toBeVisible();
  });
});

test.describe('Stroop Exercise', () => {
  test('displays stroop test correctly', async ({ page }) => {
    await page.goto('/exercise/stroop');

    await expect(page.locator('h1')).toContainText('Тест Струпа');
    await expect(page.getByText(/ЦВЕТ букв/)).toBeVisible();
  });
});
