import { test, expect } from '@e2e/fixtures';

test.describe('Access - User and password', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should log in', async ({ accessPage, page }) => {
    await expect(page).toBeOnTheLogin();

    await accessPage.login({
      username: process.env.MAIN_USER_USERNAME,
      password: process.env.MAIN_USER_PASSWORD,
    });

    await expect(page).toBeOnTheHome();
  });
});
