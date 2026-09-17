import { NUMERIC_FILTERS } from '../constante/filters.js';
import { POSITIONS } from '../constante/players.js';
import { ROLE_STAT_LABELS } from '../constante/roleProfiles.js';

function listSummary(values, emptyLabel, singular, plural) {
  if (!values.length) return emptyLabel;
  if (values.length <= 2) return values.join(' · ');
  return `${values.length} ${plural ?? singular}`;
}

export function filterScope(filters) {
  if (!filters) return 'Tous les joueurs du fichier';

  const positions = filters.positions.map((code) => POSITIONS[code] ?? code);
  const scores = NUMERIC_FILTERS.map(({ key, short }) => [short, filters[key]])
    .filter(([, value]) => value > 0)
    .map(([short, value]) => `${short} ≥ ${value}`);
  const criteria = Object.entries(filters.minimums ?? {}).map(
    ([key, value]) => `${ROLE_STAT_LABELS[key] ?? key} ≥ ${value}`,
  );
  const gender =
    filters.gender === 'M'
      ? 'Hommes'
      : filters.gender === 'F'
        ? 'Femmes'
        : 'Hommes et femmes';

  return [
    listSummary(positions, 'Tous postes', 'poste', 'postes'),
    listSummary(filters.leagues, 'Tous championnats', 'championnat', 'championnats'),
    listSummary(filters.nations ?? [], 'Toutes nationalités', 'nationalité', 'nationalités'),
    (filters.teams ?? []).length
      ? listSummary(filters.teams, 'Tous clubs', 'club', 'clubs')
      : null,
    (filters.ages ?? []).length
      ? listSummary(
          filters.ages.map((age) => `${age} ans`),
          'Tous âges',
          'âge',
          'âges',
        )
      : null,
    gender,
    filters.excludeBigFive ? 'Hors 5 grands masculins' : null,
    [...scores, ...criteria].join(' · ') || null,
    filters.query ? `Recherche : ${filters.query}` : null,
  ]
    .filter(Boolean)
    .join(' · ');
}
