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

test('La fiche joueur renvoie vers la ligue et le club déployés', async ({ page }) => {
  await page.goto('/#ligues?league=Liga+F&club=FC+Barcelona');
  await expect(page).toHaveTitle(/Ligues et clubs/);

  await page.goto('/#/recherche');
  const table = page.locator('#players-table');
  await table.getByRole('searchbox', { name: 'Rechercher dans le tableau' }).fill(
    'Aitana Bonmatí',
  );
  await table.getByRole('button', { name: 'Afficher la fiche de Aitana Bonmatí' }).click();
  await page.getByRole('dialog').getByRole('link', { name: 'FC Barcelona' }).click();

  await expect(page).toHaveURL(/#\/ligues\?league=Liga\+F&club=FC\+Barcelona$/);
  const league = page.locator('.league-branch[data-league="Liga F"]');
  await expect(league).toHaveAttribute('open', '');
  const club = league.locator('.club-branch[data-club="FC Barcelona"]');
  await expect(club).toHaveAttribute('open', '');
  await expect(club.locator('.roster-branches')).toContainText('Aitana Bonmatí');
});
