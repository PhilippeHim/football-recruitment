import { test, expect } from '@playwright/test';

test('Vivier, budget, placement sans doublon et sauvegarde', async ({ page }) => {
  await page.goto('/#/mercato');
  await page.getByRole('searchbox').fill('mbappe');
  await page.getByRole('button', { name: /Kylian.*＋/ }).click();
  const card = page.locator('.mercato-shortlist article').first();
  await card.locator('button').first().click();
  await page.getByRole('button', { name: 'Placer au poste ST', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Bilan budgétaire' })).toContainText('Dépassement');
  await expect(page.getByRole('region', { name: 'Bilan budgétaire' })).toContainText('1/11');
  await card.dragTo(page.getByRole('button', { name: 'Placer au poste LW', exact: true }));
  await expect(page.getByRole('button', { name: 'Placer au poste LW', exact: true })).toContainText('Mbappé');
  await expect(page.getByRole('button', { name: 'Placer au poste ST', exact: true })).toContainText('Poste libre');
  await page.getByLabel('Mon budget (€)').fill('250000000');
  await page.reload();
  await expect(page.getByLabel('Mon budget (€)')).toHaveValue('250000000');
  await expect(page.getByRole('button', { name: 'Placer au poste LW', exact: true })).toContainText('Mbappé');
  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: /Retirer Kylian.*du vivier/ }).click();
  await expect(page.getByRole('region', { name: 'Bilan budgétaire' })).toContainText('0/11');
});
