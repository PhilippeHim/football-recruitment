import { NUMERIC_FILTERS } from '../src/constante/filters.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { POSITION_PRESETS } from '../src/constante/positionPresets.js';
import { parsePlayers } from '../src/services/parsePlayers.js';
import { filterPlayers } from '../src/utils/filterPlayers.js';

test('Les douze profils appliquent leurs minima par poste, tous ajustables', () => {
  const rows = parsePlayers(
    readFileSync(
      new URL('../public/all_players_with_market_value.csv', import.meta.url),
      'utf8',
    ),
  );
  assert.deepEqual(
    POSITION_PRESETS.map((preset) => preset.code),
    ['CM', 'GK', 'CB', 'RB', 'LB', 'CDM', 'RM', 'LM', 'CAM', 'RW', 'LW', 'ST'],
  );
  for (const preset of POSITION_PRESETS) {
    const result = filterPlayers(rows, preset.filters);
    assert.ok(result.length > 0);
    assert.equal(
      result.length,
      rows.filter(
        (player) =>
          player.Position === preset.code &&
          NUMERIC_FILTERS.every(({ key, short }) => player[short] >= preset.filters[key]),
      ).length,
    );
    assert.equal(
      filterPlayers(rows, {
        ...preset.filters,
        ...Object.fromEntries(NUMERIC_FILTERS.map(({ key }) => [key, 0])),
      }).length,
      rows.filter((player) => player.Position === preset.code).length,
    );
  }
});

test('Le défenseur central règle DEF et PHY sans conserver les seuils d’attaque', () => {
  const filters = POSITION_PRESETS.find(({ code }) => code === 'CB').filters;
  assert.equal(filters.def, 75);
  assert.equal(filters.phy, 75);
  assert.equal(filters.sho, 0);
  assert.equal(filters.pac, 0);
});
