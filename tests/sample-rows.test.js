import test from 'node:test';
import assert from 'node:assert/strict';
import { sampleRows } from '../src/utils/sampleRows.js';

test('L’échantillonnage est stable, plafonné et ne clone pas les lignes', () => {
  const rows = Array.from({ length: 20 }, (_, index) => ({
    Name: `Joueur ${index}`,
    Team: `Club ${index % 4}`,
    League: `Ligue ${index % 3}`,
    Position: index % 2 === 0 ? 'CM' : 'ST',
    gender: index % 2 === 0 ? 'M' : 'F',
  }));

  const first = sampleRows(rows, 5);
  const second = sampleRows(rows, 5);

  assert.equal(first.length, 5);
  assert.deepEqual(first, second);
  assert.ok(first.every((row) => rows.includes(row)));
  assert.equal(sampleRows(rows, rows.length), rows);
});
