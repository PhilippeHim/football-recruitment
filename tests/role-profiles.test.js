import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ROLE_PROFILES, createRoleFilters } from '../src/constante/roleProfiles.js';
import { parsePlayers } from '../src/services/parsePlayers.js';
import { filterPlayers } from '../src/utils/filterPlayers.js';

const rows = parsePlayers(
  readFileSync(new URL('../public/all_players_with_market_value.csv', import.meta.url), 'utf8'),
);

test('Chaque profil métier propose des résultats conformes aux seuils annoncés', () => {
  assert.equal(ROLE_PROFILES.length, 8);
  for (const profile of ROLE_PROFILES) {
    const result = filterPlayers(rows, createRoleFilters(profile));
    assert.ok(result.length > 0, profile.id);
    assert.ok(
      result.every(
        (player) => profile.positions.includes(player.Position) && player.OVR >= 75,
      ),
    );
    for (const [key, minimum] of Object.entries(profile.criteria)) {
      assert.ok(
        result.every((player) => Number.isFinite(player[key]) && player[key] >= minimum),
      );
    }
  }
});
test('Ajuster les critères ne modifie pas le modèle et les inconnues restent exclues', () => {
  const profile = ROLE_PROFILES.find((item) => item.id === 'relanceur');
  const filters = createRoleFilters(profile);
  assert.equal(filterPlayers(rows, filters).length, 286);
  filters.minimums['Short.Passing'] = 80;
  assert.equal(profile.criteria['Short.Passing'], 70);
  assert.ok(filterPlayers(rows, filters).length < 286);
  const reference = filterPlayers(rows, createRoleFilters(profile))[0];
  for (const missing of [null, undefined, NaN]) {
    assert.equal(
      filterPlayers([{ ...reference, 'Short.Passing': missing }], filters).length,
      0,
    );
  }
});
