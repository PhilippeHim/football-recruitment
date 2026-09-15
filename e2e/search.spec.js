import { test, expect } from '@playwright/test';

test('Recherche joueur, club, effacement, filtres et listes sans accents', async ({
  page,
}) => {
  await page.goto('/#/recherche');
  const search = page.getByRole('searchbox', { name: 'Joueur ou club' });
  await search.fill('mbappe');
  await expect(page.locator('.metric.primary strong')).toHaveText('1');
  await expect(page.locator('#players-table tbody')).toContainText('Kylian Mbappé');
  await search.fill('real madrid');
  await expect(page.locator('#players-table tbody tr').first()).toContainText(
    'Real Madrid',
  );
  await search.fill('zzzznotfound');
  await expect(
    page.getByRole('heading', { name: 'Aucun profil ne correspond' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Effacer la recherche' }).click();
  await expect(search).toHaveValue('');
  await expect(search).toBeFocused();
  await page
    .getByRole('navigation')
    .getByRole('link', { name: /Profils métier/ })
    .click();
  await page.getByRole('button', { name: /Ailier rapide/ }).click();
  await search.fill('mbappe');
  await expect(
    page.getByRole('heading', { name: 'Aucun profil ne correspond' }),
  ).toBeVisible();
  await search.press('Escape');
  await expect(page.locator('.metric.primary strong')).toHaveText('27');
  await page.locator('.multi > summary').filter({ hasText: 'Championnats' }).click();
  await page.getByLabel('Rechercher : Championnats').fill('ceska');
  await expect(
    page.getByRole('checkbox', { name: 'Česká Liga', exact: true }),
  ).toBeVisible();
  await page.getByLabel('Rechercher : Championnats').fill('zzzznotfound');
  await expect(
    page.getByText('Aucune option ne correspond à cette recherche.'),
  ).toBeVisible();
});
