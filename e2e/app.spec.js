import { test } from '@playwright/test';
import assert from 'node:assert/strict';
test('Recherche, graphiques, tableau et affichage mobile', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/#/recherche');
  await page.getByRole('heading', { name: 'Les profils à suivre' }).waitFor();
  await page.screenshot({ path: 'test-results/desktop.png', fullPage: true });
  assert.equal(await page.locator('.recharts-wrapper').count(), 0);
  await page
    .getByRole('navigation')
    .getByRole('link', { name: /Analyser la sélection/ })
    .click();
  await page.locator('.recharts-wrapper').first().waitFor();
  assert.equal(await page.locator('.recharts-wrapper').count(), 3);
  await page
    .getByRole('navigation')
    .getByRole('link', { name: /Rechercher/ })
    .click();
  const initial = await page.locator('.metric.primary strong').innerText();
  await page
    .getByRole('navigation')
    .getByRole('link', { name: /Profils métier/ })
    .click();
  await page.getByRole('button', { name: /Ailier rapide/ }).click();
  await page.waitForTimeout(500);
  const count = await page.locator('.metric.primary strong').innerText();
  assert.notEqual(count, initial);
  assert.ok(Number(count) > 0);
  assert.equal(await page.getByLabel('OVR minimum').inputValue(), '76');
  assert.equal(await page.getByLabel('PAC minimum').inputValue(), '80');
  assert.equal(await page.getByLabel('DRI minimum').inputValue(), '80');
  await page.getByLabel('OVR minimum').fill('99');
  await page.getByRole('heading', { name: 'Aucun profil ne correspond' }).waitFor();
  assert.equal(await page.locator('.metric.primary strong').innerText(), '0');
  assert.equal(await page.locator('.recharts-wrapper').count(), 0);
  assert.equal(await page.locator('.metric').nth(1).locator('strong').innerText(), '—');
  await page.getByRole('button', { name: 'Afficher tous les joueurs' }).click();
  await page.getByRole('heading', { name: 'Les profils à suivre' }).waitFor();
  assert.equal(
    (await page.locator('.metric.primary strong').innerText()).replace(/\s/g, ''),
    '17737',
  );
  await page.getByRole('button', { name: /Suivant/ }).click();
  assert.match(await page.locator('.pagination').innerText(), /21–40/);
  await page.getByRole('button', { name: /Âge/ }).click();
  assert.match(await page.locator('.pagination').innerText(), /1–20/);
  await page
    .getByRole('navigation')
    .getByRole('link', { name: /Profils métier/ })
    .click();
  await page.getByRole('button', { name: /Ailier rapide/ }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  assert.ok(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  );
  await page.screenshot({ path: 'test-results/mobile.png', fullPage: true });
  assert.deepEqual(errors, []);
  console.log(
    JSON.stringify({
      initial,
      wingerCount: count,
      charts: 3,
      checks: 'preset, empty, reset, pagination, sorting, mobile overflow',
      errors,
    }),
  );
});
