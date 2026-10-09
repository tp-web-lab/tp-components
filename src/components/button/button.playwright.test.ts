import { test, expect } from '@playwright/test';

test.describe('tp-button', () => {
  test.beforeEach(async ({ page }) => {
    await page.setContent(`
      <tp-button id="button-default">Run</tp-button>
      <tp-button id="button-brand" type="brand">Brand</tp-button>
      <tp-button id="button-outlined" type="brand" outlined>Outlined</tp-button>
      <tp-button id="button-link" href="/docs">Docs</tp-button>
      <tp-button id="button-disabled-link" href="/docs" disabled>Disabled link</tp-button>
    `);

    await page.waitForFunction(() => customElements.get('tp-button') !== undefined);
  });

  test('rend un button sans href', async ({ page }) => {
    await expect(page.locator('#button-default > button')).toHaveCount(1);
    await expect(page.locator('#button-default > a')).toHaveCount(0);
  });

  test('rend un lien avec href', async ({ page }) => {
    await expect(page.locator('#button-link > a')).toHaveCount(1);
    await expect(page.locator('#button-link > button')).toHaveCount(0);
  });

  test('désactive un lien', async ({ page }) => {
    const link = page.locator('#button-disabled-link > a');

    await expect(link).toHaveAttribute('aria-disabled', 'true');
    await expect(link).toHaveAttribute('tabindex', '-1');
  });

  test('reçoit le focus clavier', async ({ page }) => {
    await page.locator('#button-default > button').focus();
    await expect(page.locator('#button-default > button')).toBeFocused();
  });

  test('garde la variante outlined sur le host', async ({ page }) => {
    await expect(page.locator('#button-outlined')).toHaveAttribute('outlined', '');
  });

  test('garde la variante brand sur le host', async ({ page }) => {
    await expect(page.locator('#button-brand')).toHaveAttribute('type', 'brand');
  });
});