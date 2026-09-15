import test from 'node:test';
import assert from 'node:assert/strict';
import { median } from '../src/utils/median.js';

test('Médiane impaire, paire, ex æquo et sélection vide', () => {
  const rows = [90, 50, 70].map((OVR) => ({ OVR }));
  assert.equal(median(rows, 'OVR'), 70);
  assert.deepEqual(
    rows.map((row) => row.OVR),
    [90, 50, 70],
  );
  assert.equal(median([{ OVR: 75 }, { OVR: 76 }], 'OVR'), 75.5);
  assert.equal(median([{ OVR: 80 }, { OVR: 80 }], 'OVR'), 80);
  assert.equal(median([], 'OVR'), null);
  assert.equal(median([{ OVR: null }, { OVR: NaN }, { OVR: 70 }], 'OVR'), 70);
});
