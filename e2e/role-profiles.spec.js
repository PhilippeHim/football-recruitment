import { test, expect } from '@playwright/test';

test('Catalogue métier, critères ajustables, colonnes explicatives et navigation', async ({
  page,
}) => {
  await page.goto('/#/profils');
  await expect(page.locator('.role-card')).toHaveCount(8);
  await page.getByRole('button', { name: 'Défense', exact: true }).click();
  await expect(page.locator('.role-card')).toHaveCount(3);
  await page.screenshot({ path: 'test-results/role-catalogue.png', fullPage: true });
  await page.getByRole('button', { name: 'Rechercher : Défenseur relanceur' }).click();
  await expect(page).toHaveURL(/#\/recherche$/);
  await expect(page.locator('.metric.primary strong')).toHaveText('286');
  await expect(page.locator('#players-table thead')).toContainText('Passes courtes');
  await expect(page.locator('#players-table tbody tr').first()).toContainText('min. 70');
  await page.getByLabel('Passes courtes minimum').fill('80');
  await expect
    .poll(async () => Number(await page.locator('.metric.primary strong').innerText()))
    .toBeLessThan(286);
  await expect(page.locator('.role-criteria')).toContainText('personnalisé');
  await page
    .getByRole('navigation')
    .getByRole('link', { name: /Analyser la sélection/ })
    .click();
  await expect(page.getByLabel('Passes courtes minimum')).toHaveValue('80');
  await page
    .getByRole('navigation')
    .getByRole('link', { name: /Rechercher/ })
    .click();
  await page.screenshot({ path: 'test-results/role-results.png', fullPage: true });
  await page.getByRole('button', { name: 'Retirer les critères métier' }).click();
  await expect(page.locator('.role-criteria')).toHaveCount(0);
  await expect(page.locator('#players-table thead')).not.toContainText('Passes courtes');
  await page
    .getByRole('navigation')
    .getByRole('link', { name: /Profils métier/ })
    .click();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    .toBe(true);
  await page.getByRole('button', { name: 'Rechercher : Attaquant finisseur' }).click();
  await expect(page.locator('.metric.primary strong')).toHaveText('153');
});
