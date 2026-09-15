import { test, expect } from '@playwright/test';

test('La régression se combine aux médianes et suit les filtres', async ({ page }) => {
  await page.goto('/#/analyse');
  const toggle = page.getByRole('checkbox', { name: 'Afficher la droite de régression' });
  await expect(toggle).not.toBeChecked();
  await toggle.check();
  await expect(page.locator('.recharts-reference-line-line')).toHaveCount(1);
  const caption = page.locator('.regression-caption');
  const initial = await caption.innerText();
  await page.getByRole('checkbox', { name: 'Afficher les médianes PAC et DRI' }).check();
  await expect(page.locator('.recharts-reference-line-line')).toHaveCount(3);
  await page
    .getByRole('navigation')
    .getByRole('link', { name: /Profils métier/ })
    .click();
  await page.getByRole('button', { name: /Ailier rapide/ }).click();
  await page
    .getByRole('navigation')
    .getByRole('link', { name: /Analyser la sélection/ })
    .click();
  await toggle.check();
  await page.getByRole('checkbox', { name: 'Afficher les médianes PAC et DRI' }).check();
  await expect(caption).not.toHaveText(initial);
  await expect(caption).toContainText('27 joueurs');
  await page.screenshot({ path: 'test-results/regression.png', fullPage: true });
  await toggle.uncheck();
  await expect(page.locator('.recharts-reference-line-line')).toHaveCount(2);
  await expect(caption).toHaveCount(0);
});
