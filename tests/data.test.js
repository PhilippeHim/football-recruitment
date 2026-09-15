import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parsePlayers } from '../src/services/parsePlayers.js';
import { filterPlayers } from '../src/utils/filterPlayers.js';
import { histogram } from '../src/utils/histogram.js';
import { leagueCounts } from '../src/utils/leagueCounts.js';
import { mean } from '../src/utils/mean.js';
import { sortPlayers } from '../src/utils/sortPlayers.js';
import { DEFAULT_FILTERS, WINGER_FILTERS } from '../src/constante/filters.js';
import { BIG_FIVE } from '../src/constante/leagues.js';

const rows = parsePlayers(
  readFileSync(new URL('../public/all_players_with_market_value.csv', import.meta.url), 'utf8'),
);
test('Le CSV est complet, les noms sont nettoyés et les notes sont numériques', () => {
  assert.equal(rows.length, 17737);
  assert.equal(rows[0].Name, 'Kylian Mbappé');
  assert.equal(typeof rows[0].OVR, 'number');
  assert.equal(new Set(rows.map((p) => p.League)).size, 57);
});
test('Le préréglage applique conjointement poste, genre, notes et exclusion', () => {
  const selected = filterPlayers(rows, WINGER_FILTERS);
  assert.ok(selected.length > 0);
  assert.ok(
    selected.every(
      (p) =>
        p.OVR > 75 &&
        p.PAC >= 80 &&
        p.DRI >= 80 &&
        p.gender === 'M' &&
        ['LW', 'RW', 'LM', 'RM'].includes(p.Position) &&
        !BIG_FIVE.includes(p.League),
    ),
  );
});
test('Les filtres de ligue et de poste se combinent sans modifier les données', () => {
  const selected = filterPlayers(rows, {
    ...DEFAULT_FILTERS,
    leagues: ['MLS'],
    positions: ['ST'],
    gender: 'M',
    ovr: 0,
  });
  assert.ok(selected.length > 0);
  assert.ok(
    selected.every((p) => p.League === 'MLS' && p.Position === 'ST' && p.gender === 'M'),
  );
  assert.equal(rows.length, 17737);
});
test('Distribution et groupes comptent chaque résultat une seule fois', () => {
  for (const selected of [
    rows,
    filterPlayers(rows, DEFAULT_FILTERS),
    filterPlayers(rows, WINGER_FILTERS),
  ]) {
    assert.equal(
      histogram(selected).reduce((sum, b) => sum + b.count, 0),
      selected.length,
    );
    assert.equal(
      leagueCounts(selected).reduce((sum, b) => sum + b.count, 0),
      selected.length,
    );
  }
  assert.deepEqual(
    leagueCounts(rows)
      .slice(0, 3)
      .map((g) => g.league),
    ['Sudamericana', 'MLS', 'EFL Championship'],
  );
});
test('Une sélection vide ne produit pas de NaN dans les indicateurs', () => {
  const empty = filterPlayers(rows, { ...DEFAULT_FILTERS, ovr: 99 });
  assert.equal(empty.length, 0);
  assert.equal(mean(empty, 'OVR'), null);
  assert.deepEqual(leagueCounts(empty), []);
});
test('Tri numérique et alphabétique, sans mutation', () => {
  const desc = sortPlayers(rows, 'OVR', 'desc');
  assert.ok(desc.every((p, i) => i === 0 || desc[i - 1].OVR >= p.OVR));
  const asc = sortPlayers(rows, 'Name', 'asc');
  assert.ok(
    asc.every((p, i) => i === 0 || asc[i - 1].Name.localeCompare(p.Name, 'fr') <= 0),
  );
  assert.equal(rows[0].Name, 'Kylian Mbappé');
});
test('Un fichier incomplet est signalé explicitement', () => {
  assert.throws(() => parsePlayers('Name,OVR\nTest,80'), /colonnes/);
});
