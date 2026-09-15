import { test, expect } from '@playwright/test';

test('Le badge reflète le profil validé et ne se comporte plus comme un raccourci', async ({
  page,
}) => {
  await page.goto('/#/recherche');
  const badge = page.getByRole('region', { name: 'Profil actif' });
  const select = page.getByRole('combobox', { name: 'Profil prédéfini par poste' });
  await expect(badge).toContainText('Recherche libre');
  await select.selectOption('GK');
  await expect(badge).toContainText('Recherche libre');
  await page.getByRole('button', { name: 'Appliquer ce profil' }).click();
  await expect(badge.locator('strong')).toHaveText('Gardien');
  await expect(badge.getByRole('button')).toHaveCount(0);
  await select.selectOption('ST');
  await expect(badge.locator('strong')).toHaveText('Gardien');
  await page.getByLabel('OVR minimum').fill('80');
  await expect(badge).toContainText('Personnalisé');
  await expect(badge).toContainText('OVR ≥ 80');
  await page
    .getByRole('navigation')
    .getByRole('link', { name: /Analyser la sélection/ })
    .click();
  await expect(badge.locator('strong')).toHaveText('Gardien');
  await page.getByRole('button', { name: 'Réinitialiser', exact: true }).click();
  await expect(badge.locator('strong')).toHaveText('Recherche libre');
  await page
    .getByRole('navigation')
    .getByRole('link', { name: /Profils métier/ })
    .click();
  await page.getByRole('button', { name: 'Rechercher : Défenseur relanceur' }).click();
  await expect(badge.locator('strong')).toHaveText('Défenseur relanceur');
  await page.screenshot({ path: 'test-results/active-profile.png', fullPage: true });
});
