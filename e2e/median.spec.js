import { test, expect } from '@playwright/test';

test('Les médianes sont activables et suivent la sélection', async ({ page }) => {
  await page.goto('/#/analyse');
  const pac = page.getByRole('checkbox', { name: 'Afficher les médianes PAC et DRI' });
  const ovr = page.getByRole('checkbox', { name: 'Afficher la médiane OVR' });
  await expect(pac).toBeVisible();
  await expect(pac).not.toBeChecked();
  await pac.check();
  await ovr.check();
  await expect(page.locator('.recharts-reference-line-line')).toHaveCount(3);
  const initialText = await page.locator('.median-caption').allTextContents();
  await page
    .getByRole('navigation')
    .getByRole('link', { name: /Profils métier/ })
    .click();
  await page.getByRole('button', { name: /Ailier rapide/ }).click();
  await page
    .getByRole('navigation')
    .getByRole('link', { name: /Analyser la sélection/ })
    .click();
  await pac.check();
  await ovr.check();
  await expect(page.locator('.median-caption').first()).not.toHaveText(initialText[0]);
  await expect(page.locator('.recharts-reference-line-line')).toHaveCount(3);
  await page.screenshot({ path: 'test-results/medians.png', fullPage: true });
  await ovr.uncheck();
  await pac.uncheck();
  await expect(page.locator('.recharts-reference-line-line')).toHaveCount(0);
});
