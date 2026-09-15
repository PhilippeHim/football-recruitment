import { test, expect } from '@playwright/test';

test('Accueil par défaut, objectif explicite et exemple guidé', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/#\/accueil$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Des profils à comparer',
  );
  await expect(page.getByText(/Un projet pédagogique fondé/)).toBeVisible();
  await expect(page.locator('.sidebar')).toHaveCount(0);
  await expect(page.locator('.recharts-wrapper')).toHaveCount(0);
  await expect(
    page.getByText('286 profils correspondent dans le fichier actuel.'),
  ).toBeVisible();
  await page.screenshot({ path: 'test-results/home-desktop.png', fullPage: true });
  await page.getByRole('button', { name: 'Essayer cet exemple →' }).click();
  await expect(page).toHaveURL(/#\/recherche$/);
  await expect(page.locator('.metric.primary strong')).toHaveText('286');
  await page.getByRole('link', { name: 'Terrain — Accueil' }).click();
  await expect(page).toHaveURL(/#\/accueil$/);
  await page.getByRole('link', { name: 'Je cherche déjà un joueur' }).click();
  await expect(page.locator('.metric.primary strong')).toHaveText('286');
  await page.getByRole('link', { name: 'Terrain — Accueil' }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    .toBe(true);
  await page.screenshot({ path: 'test-results/home-mobile.png', fullPage: true });
  await page.getByRole('link', { name: 'Définir mon besoin →' }).click();
  await expect(page.locator('.role-card')).toHaveCount(8);
});

test('L’objectif du site reste lisible quand le dataset est indisponible', async ({
  page,
}) => {
  await page.route('**/all_players_clean.csv', (route) =>
    route.fulfill({ status: 500, body: 'Unavailable' }),
  );
  await page.goto('/#/accueil');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByText('Données indisponibles pour le moment.')).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Essayer cet exemple →' }),
  ).toBeDisabled();
});
