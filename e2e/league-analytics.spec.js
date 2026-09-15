import { test, expect } from '@playwright/test';
test('Trois analyses, filtre de ligue et lecture mobile', async ({ page }) => {
  await page.goto('/#/ligues');
  const analytics = page.getByRole('region', { name: 'Analyses des ligues et clubs' });
  await expect(
    analytics.getByRole('heading', { name: 'Où sont les joueurs ?' }),
  ).toBeVisible();
  await analytics.getByRole('button', { name: '2. OVR moyen' }).click();
  await analytics.getByLabel('Ligue analysée').selectOption('Premier League');
  await analytics.getByLabel('Nombre de résultats').selectOption('5');
  await analytics.locator('summary').click();
  await expect(analytics.locator('tbody tr')).toHaveCount(5);
  await expect(analytics.locator('tbody tr').first()).toContainText('Premier League');
  await analytics.getByRole('button', { name: '3. Valeur cumulée' }).click();
  await expect(analytics.locator('table')).toContainText('Couverture des valeurs');
  await page.setViewportSize({ width: 390, height: 844 });
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    .toBe(true);
});
