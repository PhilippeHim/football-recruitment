import test from 'node:test';
import assert from 'node:assert/strict';
import { filterPlayers } from '../src/utils/filterPlayers.js';
import { RESET_FILTERS, WINGER_FILTERS } from '../src/constante/filters.js';
import { activeProfile } from '../src/utils/activeProfile.js';

test('Les nouveaux minima sont inclusifs, cumulés et réinitialisables', () => {
  const player = { SHO: 80, PAS: 80, DEF: 80, PHY: 80 };
  for (const key of ['sho', 'pas', 'def', 'phy']) {
    assert.equal(filterPlayers([player], { ...RESET_FILTERS, [key]: 80 }).length, 1);
    assert.equal(filterPlayers([player], { ...RESET_FILTERS, [key]: 81 }).length, 0);
    assert.equal(filterPlayers([{}], { ...RESET_FILTERS, [key]: 80 }).length, 0);
    assert.equal(activeProfile({ ...WINGER_FILTERS, [key]: 80 }).customized, true);
    assert.equal(WINGER_FILTERS[key], 0);
  }
  assert.equal(filterPlayers([player], { ...RESET_FILTERS, sho: 80, pas: 81 }).length, 0);
  assert.equal(filterPlayers([player], RESET_FILTERS).length, 1);
});
