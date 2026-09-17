import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_FILTERS, RESET_FILTERS } from '../src/constante/filters.js';
import { filterScope } from '../src/utils/filterScope.js';

test('Le résumé du périmètre décrit les filtres actifs', () => {
  assert.equal(
    filterScope(DEFAULT_FILTERS),
    'Tous postes · Tous championnats · Hommes et femmes · OVR ≥ 75',
  );
  assert.equal(
    filterScope({
      ...RESET_FILTERS,
      positions: ['CB'],
      leagues: ['Ligue 1 McDonald’s', 'Premier League', 'Bundesliga'],
      gender: 'M',
      excludeBigFive: true,
      def: 75,
      minimums: { 'Short.Passing': 70 },
      query: 'psg',
    }),
    'Défenseur central · 3 championnats · Hommes · Hors 5 grands masculins · DEF ≥ 75 · Passes courtes ≥ 70 · Recherche : psg',
  );
});
