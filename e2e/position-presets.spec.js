import { test, expect } from '@playwright/test';

test('Les profils par poste remplacent les filtres précédents et restent modifiables', async ({
  page,
}) => {
  await page.goto('/#/recherche');
  await page
    .getByRole('navigation')
    .getByRole('link', { name: /Profils métier/ })
    .click();
  await page.getByRole('button', { name: /Ailier rapide/ }).click();
  await page.getByRole('searchbox', { name: 'Joueur ou club' }).fill('mbappe');
  const presets = page.getByRole('combobox', { name: 'Profil prédéfini par poste' });
  await expect(presets.locator('option')).toHaveCount(12);
  await presets.selectOption('GK');
  await page.getByRole('button', { name: 'Appliquer ce profil' }).click();
  await expect(page.locator('.metric.primary strong')).toHaveText('231');
  await expect(page.getByLabel('OVR minimum')).toHaveValue('75');
  await expect(page.getByRole('region', { name: 'Profil actif' })).toContainText(
    'OVR ≥ 75',
  );
  await expect(page.getByRole('searchbox', { name: 'Joueur ou club' })).toHaveValue('');
  await expect(page.getByLabel('PAC minimum')).toHaveValue('0');
  await expect(
    page.getByLabel('Exclure les 5 grands championnats masculins'),
  ).not.toBeChecked();
  await presets.selectOption('ST');
  await page.getByRole('button', { name: 'Appliquer ce profil' }).click();
  await expect(page.getByLabel('SHO minimum')).toHaveValue('75');
  await expect(page.getByLabel('PHY minimum')).toHaveValue('70');
  await page
    .getByRole('navigation')
    .getByRole('link', { name: /Analyser la sélection/ })
    .click();
  await expect(page.getByLabel('SHO minimum')).toHaveValue('75');
  await expect(page.getByLabel('PHY minimum')).toHaveValue('70');
  await page.getByLabel('OVR minimum').fill('99');
  await expect(
    page.getByRole('heading', { name: 'Aucun profil ne correspond' }),
  ).toBeVisible();
});
