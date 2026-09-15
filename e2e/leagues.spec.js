import { test, expect } from '@playwright/test';

test('Organigramme, recherche de club et affichage mobile', async ({ page }) => {
  await page.goto('/#/ligues');
  await expect(
    page.getByRole('heading', { name: 'Des ligues aux clubs.' }),
  ).toBeVisible();
  await expect(page.locator('.league-branch').first()).toBeVisible();
  await expect(page.locator('.sidebar')).toHaveCount(0);
  const search = page.getByRole('searchbox', { name: 'Rechercher une ligue ou un club' });
  await search.fill('real madrid');
  await expect(page.locator('.club-branches').first()).toContainText('Real Madrid');
  await expect(page.locator('.league-branch').first()).toHaveAttribute('open', '');
  const club = page.locator('.club-branch').first();
  await club.locator('summary').click();
  await expect(club.locator('.roster-branches li')).toHaveCount(25);
  await expect(club.locator('.roster-branches')).toContainText('OVR');
  const playerButton = club.locator('.player-identity-link').first();
  await playerButton.click();
  const identity = page.getByRole('dialog');
  await expect(identity).toBeVisible();
  await expect(identity).toContainText('Nationalité');
  await expect(identity).toContainText('Valeur marchande');
  await expect(identity).toContainText('Valeur issue du dataset');
  await page.keyboard.press('Escape');
  await expect(identity).toHaveCount(0);
  await expect(playerButton).toBeFocused();
  await club.locator('summary').click();
  await expect(club.locator('.roster-branches')).toHaveCount(0);
  await search.fill('zzzzinexistant');
  await expect(
    page.getByText('Aucune ligue ni aucun club ne correspond à cette recherche.'),
  ).toBeVisible();
  await search.fill('');
  await page.locator('.league-branch summary').first().click();
  await expect(page.locator('.club-branches').first()).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    .toBe(true);
  await page.screenshot({ path: 'test-results/leagues-mobile.png', fullPage: true });
});
