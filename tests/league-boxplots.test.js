import test from 'node:test';
import assert from 'node:assert/strict';
import { leagueBoxplots, globalOvrQuartiles } from '../src/utils/leagueBoxplots.js';

test('Quartiles interpolés, moustaches et notes atypiques sans modifier les données', () => {
  const rows = [60, 61, 62, 63, 64, 65, 99].map((OVR) => ({ League: 'A', OVR }));
  const original = structuredClone(rows);
  const [group] = leagueBoxplots(rows);
  assert.equal(group.mean, 474 / 7);
  assert.equal(group.q1, 61.5);
  assert.equal(group.median, 63);
  assert.equal(group.q3, 64.5);
  assert.equal(group.low, 60);
  assert.equal(group.high, 65);
  assert.deepEqual(group.outliers, [99]);
  assert.deepEqual(rows, original);
});

test('Ligues triées par médiane, effectifs unitaires et notes absentes', () => {
  const result = leagueBoxplots([
    { League: 'A', OVR: 60 },
    { League: 'B', OVR: 80 },
    { League: 'B', OVR: 80 },
    { League: 'C', OVR: null },
  ]);
  assert.deepEqual(
    result.map(({ name }) => name),
    ['B', 'A'],
  );
  assert.equal(result[1].q1, 60);
  assert.equal(result[1].high, 60);
  assert.deepEqual(result[0].outliers, []);
  assert.deepEqual(leagueBoxplots([]), []);
});

test('Les repères globaux pondèrent chaque joueur et ignorent les notes invalides', () => {
  const rows = [60, 60, 60, 60].map((OVR) => ({ League: 'A', OVR }));
  rows.push({ League: 'B', OVR: 90 }, { League: 'B', OVR: null });
  assert.deepEqual(globalOvrQuartiles(rows), { q1: 60, median: 60, q3: 60 });
  assert.deepEqual(
    globalOvrQuartiles([60, 70, 80, 90].map((OVR) => ({ League: 'A', OVR }))),
    { q1: 67.5, median: 75, q3: 82.5 },
  );
  assert.equal(globalOvrQuartiles([]), null);
});
