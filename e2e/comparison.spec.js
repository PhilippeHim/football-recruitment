import { test, expect } from '@playwright/test';

test('Sélection, limite de trois, conservation des profils et radar mobile', async ({
  page,
}) => {
  await page.goto('/#/recherche');
  await page
    .getByRole('navigation')
    .getByRole('link', { name: /Profils métier/ })
    .click();
  await page.getByRole('button', { name: /Ailier rapide/ }).click();
  const choices = page.getByRole('checkbox', { name: /^Comparer / });
  await choices.nth(0).check();
  await page.getByRole('link', { name: 'Voir la comparaison →' }).click();
  await expect(page.getByText('Un premier profil retenu.')).toBeVisible();
  await page.goBack();
  await expect(choices.nth(0)).toBeChecked();
  await choices.nth(1).check();
  await choices.nth(2).check();
  await expect(choices.nth(3)).toBeDisabled();
  await page.getByRole('link', { name: 'Voir la comparaison →' }).click();
  await expect(page.locator('.recharts-radar')).toHaveCount(3);
  await expect(page.locator('#main')).toBeFocused();
  await page.screenshot({ path: 'test-results/comparison-desktop.png', fullPage: true });
  await page
    .getByRole('navigation')
    .getByRole('link', { name: /Rechercher/ })
    .click();
  await page.getByLabel('OVR minimum').fill('99');
  await expect(
    page.getByRole('heading', { name: 'Aucun profil ne correspond' }),
  ).toBeVisible();
  await page
    .getByRole('navigation')
    .getByRole('link', { name: /Comparer les joueurs/ })
    .click();
  await expect(page.locator('.outside-filters')).toHaveCount(3);
  await expect(page.locator('.recharts-radar')).toHaveCount(3);
  await page
    .getByRole('button', { name: /^Retirer .* de la comparaison$/ })
    .first()
    .click();
  await expect(page.locator('.recharts-radar')).toHaveCount(2);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    .toBe(true);
  await page.screenshot({ path: 'test-results/comparison-mobile.png', fullPage: true });
  await page.getByRole('button', { name: 'Vider la comparaison' }).click();
  await expect(page.locator('.comparison-tray')).toHaveCount(0);
  await expect(page.locator('#player-comparison')).toHaveCount(0);
});
