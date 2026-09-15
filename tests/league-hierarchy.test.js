import test from 'node:test';
import assert from 'node:assert/strict';
import { leagueHierarchy } from '../src/utils/leagueHierarchy.js';

test('Les joueurs restent rattachés à leur club et ligue, même avec des noms identiques', () => {
  const rows = [
    { id: 1, Name: 'Zoé', League: 'A', Team: 'United' },
    { id: 2, Name: 'Alice', League: 'A', Team: 'United' },
    { id: 3, Name: 'Bob', League: 'B', Team: 'United' },
  ];
  const tree = leagueHierarchy(rows);
  assert.deepEqual(
    tree[0].clubs[0].players.map((p) => p.id),
    [2, 1],
  );
  assert.equal(tree[0].clubs[0].count, 2);
  assert.deepEqual(
    tree[1].clubs[0].players.map((p) => p.id),
    [3],
  );
  assert.equal(leagueHierarchy(rows, 'United').length, 2);
  assert.deepEqual(
    rows.map((p) => p.id),
    [1, 2, 3],
  );
});
