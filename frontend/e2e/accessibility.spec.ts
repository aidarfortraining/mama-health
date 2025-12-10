import { test, expect } from '@playwright/test';

test.describe('Accessibility for Elderly Users', () => {
  test('buttons have minimum 60px height', async ({ page }) => {
    await page.goto('/');

    const buttons = await page.locator('button').all();

    for (const button of buttons) {
      const box = await button.boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(60);
      }
    }
  });

  test('text is readable (minimum 20px)', async ({ page }) => {
    await page.goto('/');

    const body = page.locator('body');
    const fontSize = await body.evaluate(el =>
      parseFloat(window.getComputedStyle(el).fontSize)
    );

    expect(fontSize).toBeGreaterThanOrEqual(20);
  });

  test('high contrast text', async ({ page }) => {
    await page.goto('/');

    // Проверяем основной текст
    const heading = page.locator('h1').first();
    const color = await heading.evaluate(el =>
      window.getComputedStyle(el).color
    );

    // Должен быть тёмный цвет (не серый)
    expect(color).not.toBe('rgb(128, 128, 128)');
  });

  test('touch targets are accessible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone size
    await page.goto('/');

    const buttons = await page.locator('button').all();

    for (const button of buttons) {
      const box = await button.boundingBox();
      if (box) {
        // WCAG рекомендует минимум 44x44px
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });
});
