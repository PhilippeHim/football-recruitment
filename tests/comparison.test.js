import test from 'node:test';
import assert from 'node:assert/strict';
import { comparePlayers } from '../src/utils/comparePlayers.js';

test('Le comparateur conserve les notes brutes et calcule les écarts par qualité', () => {
  const players = [
    { PAC: 80, SHO: 70, PAS: 60, DRI: 90, DEF: 30, PHY: 75 },
    { PAC: 85, SHO: 60, PAS: 70, DRI: 90, DEF: 50, PHY: 65 },
  ];
  const result = comparePlayers(players);
  assert.deepEqual(
    result.map((stat) => stat.key),
    ['PAC', 'SHO', 'PAS', 'DRI', 'DEF', 'PHY'],
  );
  assert.equal(result[0].player0, 80);
  assert.equal(result[0].player1, 85);
  assert.equal(result[0].gap, 5);
  assert.equal(result[3].gap, 0);
  assert.equal(result[4].gap, 20);
  assert.ok(comparePlayers([]).every((stat) => stat.gap === 0 && stat.maximum === null));
});
