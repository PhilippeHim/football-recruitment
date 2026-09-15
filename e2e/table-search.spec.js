import { test, expect } from '@playwright/test';

test('Recherche sur toutes les pages, sélection conservée et récupération après zéro résultat', async ({
  page,
}) => {
  await page.goto('/#/recherche');
  const table = page.locator('#players-table');
  await table.getByRole('button', { name: /Suivant/ }).click();
  const search = table.getByRole('searchbox', { name: 'Rechercher dans le tableau' });
  const initialCount = await page.locator('.metric.primary strong').innerText();
  await search.fill('mbappe');
  await expect(table.locator('tbody tr')).toHaveCount(1);
  await expect(table.locator('tbody')).toContainText('Kylian Mbappé');
  await expect(table.locator('.pagination')).toContainText('1–1');
  await table.getByRole('checkbox', { name: 'Comparer Kylian Mbappé' }).check();
  await search.fill('haaland');
  await table.getByRole('checkbox', { name: 'Comparer Erling Haaland' }).check();
  await page.getByRole('link', { name: 'Voir la comparaison →' }).click();
  await expect(page.locator('.recharts-radar')).toHaveCount(2);
  await page
    .getByRole('navigation')
    .getByRole('link', { name: /Rechercher/ })
    .click();
  await expect(search).toHaveValue('haaland');
  await expect(page.locator('.metric.primary strong')).toHaveText(initialCount);
  await search.fill('zzzznotfound');
  await expect(
    table.getByText(/Aucun joueur ne correspond dans le tableau/),
  ).toBeVisible();
  await expect(search).toBeFocused();
  await expect(table.locator('.pagination')).toHaveCount(0);
  await table.getByRole('button', { name: 'Effacer la recherche' }).click();
  await expect(search).toHaveValue('');
  await expect(
    table.getByRole('checkbox', { name: 'Comparer Kylian Mbappé' }),
  ).toBeChecked();
  await expect(
    table.getByRole('checkbox', { name: 'Comparer Erling Haaland' }),
  ).toBeChecked();
});
