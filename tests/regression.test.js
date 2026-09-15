import test from 'node:test';
import assert from 'node:assert/strict';
import { linearRegression } from '../src/utils/linearRegression.js';

test('Régression exacte, pente négative et absence de mutation', () => {
  const rows = [
    { x: 3, y: 7 },
    { x: 1, y: 3 },
    { x: 2, y: 5 },
  ];
  const result = linearRegression(rows, 'x', 'y');
  assert.equal(result.slope, 2);
  assert.equal(result.intercept, 1);
  assert.equal(result.rSquared, 1);
  assert.deepEqual(result.segment, [
    { x: 1, y: 3 },
    { x: 3, y: 7 },
  ]);
  assert.equal(rows[0].x, 3);
  assert.equal(
    linearRegression(
      [
        { x: 1, y: 5 },
        { x: 2, y: 3 },
      ],
      'x',
      'y',
    ).slope,
    -2,
  );
});
test('Régression impossible, valeurs invalides et ordonnées constantes', () => {
  assert.equal(linearRegression([], 'x', 'y'), null);
  assert.equal(linearRegression([{ x: 1, y: 3 }], 'x', 'y'), null);
  assert.equal(
    linearRegression(
      [
        { x: 1, y: 3 },
        { x: 1, y: 4 },
      ],
      'x',
      'y',
    ),
    null,
  );
  const result = linearRegression(
    [
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: null, y: 8 },
    ],
    'x',
    'y',
  );
  assert.equal(result.slope, 0);
  assert.equal(result.rSquared, null);
  assert.equal(result.count, 2);
});
