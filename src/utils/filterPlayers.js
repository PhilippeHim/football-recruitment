import { NUMERIC_FILTERS } from '../constante/filters.js';
import { BIG_FIVE } from '../constante/leagues.js';
import { normalizeSearch } from './searchText.js';

/** Les catégories s’additionnent par ET ; plusieurs valeurs d’un filtre par OU. */
export function filterPlayers(rows, filters) {
  const words = normalizeSearch(filters.query).split(/\s+/).filter(Boolean);
  return rows.filter((player) => {
    const searchText = words.length
      ? normalizeSearch(`${player.Name} ${player.Team}`)
      : '';
    const matchesQuery = words.every((word) => searchText.includes(word));
    const matchesScores = NUMERIC_FILTERS.every(({ key, short }) => {
      const minimum = filters[key] ?? 0;
      return (
        minimum === 0 || (Number.isFinite(player[short]) && player[short] >= minimum)
      );
    });
    const matchesLeague =
      !filters.leagues.length || filters.leagues.includes(player.League);
    const matchesPosition =
      !filters.positions.length || filters.positions.includes(player.Position);
    const matchesGender = !filters.gender || player.gender === filters.gender;
    const matchesExclusion = !filters.excludeBigFive || !BIG_FIVE.includes(player.League);
    const matchesRole = Object.entries(filters.minimums ?? {}).every(
      ([key, minimum]) => Number.isFinite(player[key]) && player[key] >= minimum,
    );
    return (
      matchesRole &&
      matchesQuery &&
      matchesScores &&
      matchesLeague &&
      matchesPosition &&
      matchesGender &&
      matchesExclusion
    );
  });
}
