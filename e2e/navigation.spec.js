import { test, expect } from '@playwright/test';

test('Pages distinctes, liens directs et retour navigateur', async ({ page }) => {
  await page.goto('/#/comparaison');
  await expect(
    page.getByRole('heading', { name: 'Quels profils souhaitez-vous comparer ?' }),
  ).toBeVisible();
  await expect(page.locator('.sidebar')).toHaveCount(0);
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Des profils, des différences.' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Rechercher des joueurs →' }).click();
  await page
    .getByRole('navigation')
    .getByRole('link', { name: /Profils métier/ })
    .click();
  await page.getByRole('button', { name: /Ailier rapide/ }).click();
  const table = page.locator('#players-table');
  await table.getByRole('button', { name: /Suivant/ }).click();
  await expect(table.locator('.pagination')).toContainText('21–27');
  await page
    .getByRole('navigation')
    .getByRole('link', { name: /Analyser la sélection/ })
    .click();
  await expect(page).toHaveURL(/#\/analyse$/);
  await expect(page.locator('.recharts-wrapper')).toHaveCount(3);
  await expect(page.locator('#players-table')).toHaveCount(0);
  await expect(page.getByLabel('PAC minimum')).toHaveValue('80');
  await page.goBack();
  await expect(table.locator('.pagination')).toContainText('21–27');
  await expect(page.locator('.recharts-wrapper')).toHaveCount(0);
  await page.goForward();
  await expect(page.locator('.recharts-wrapper')).toHaveCount(3);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    .toBe(true);
  await page.screenshot({ path: 'test-results/navigation-mobile.png', fullPage: true });
});
