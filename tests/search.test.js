import test from 'node:test';
import assert from 'node:assert/strict';
import { matchesSearch } from '../src/utils/searchText.js';
import { filterPlayers } from '../src/utils/filterPlayers.js';
import { DEFAULT_FILTERS } from '../src/constante/filters.js';

test('La recherche ignore accents, casse, espaces et ponctuation', () => {
  assert.ok(matchesSearch('Kylian Mbappé Real Madrid', '  MBAPPE madrid  '));
  assert.ok(matchesSearch('Allan Saint-Maximin', 'saint maximin'));
  assert.ok(matchesSearch('Česká Liga', 'ceska'));
  assert.ok(matchesSearch('Défenseur central', 'defenseur'));
  assert.ok(matchesSearch('MLS', ''));
  assert.equal(matchesSearch('Real Madrid', 'Real Paris'), false);
});
test('La recherche se combine aux seuils et aux ligues sans modifier les lignes', () => {
  const rows = [
    {
      Name: 'Kylian Mbappé',
      Team: 'Real Madrid',
      OVR: 91,
      PAC: 97,
      DRI: 92,
      League: 'LALIGA EA SPORTS',
      Position: 'ST',
      gender: 'M',
    },
  ];
  assert.equal(filterPlayers(rows, { ...DEFAULT_FILTERS, query: 'mbappe' }).length, 1);
  assert.equal(
    filterPlayers(rows, { ...DEFAULT_FILTERS, query: 'real madrid' }).length,
    1,
  );
  assert.equal(
    filterPlayers(rows, { ...DEFAULT_FILTERS, query: 'mbappe', leagues: ['MLS'] }).length,
    0,
  );
  assert.equal(
    filterPlayers(rows, { ...DEFAULT_FILTERS, query: 'mbappe', ovr: 99 }).length,
    0,
  );
  assert.equal(rows.length, 1);
});
