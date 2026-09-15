import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { POSITION_PRESETS } from '../src/constante/positionPresets.js';
import { parsePlayers } from '../src/services/parsePlayers.js';
import { filterPlayers } from '../src/utils/filterPlayers.js';

test('Les douze profils appliquent un seuil OVR de 75 qui peut être retiré', () => {
  const rows = parsePlayers(
    readFileSync(new URL('../public/all_players_with_market_value.csv', import.meta.url), 'utf8'),
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
      rows.filter((player) => player.Position === preset.code && player.OVR >= 75).length,
    );
    assert.equal(
      filterPlayers(rows, { ...preset.filters, ovr: 0 }).length,
      rows.filter((player) => player.Position === preset.code).length,
    );
  }
});
