import { WINGER_FILTERS, NUMERIC_FILTERS } from '../constante/filters.js';
import { POSITION_PRESETS, createPositionFilters } from '../constante/positionPresets.js';
import { ROLE_PROFILES, createRoleFilters } from '../constante/roleProfiles.js';

function signature(filters) {
  return JSON.stringify({
    positions: [...filters.positions].sort(),
    leagues: [...filters.leagues].sort(),
    gender: filters.gender,
    query: filters.query.trim(),
    scores: NUMERIC_FILTERS.map(({ key }) => filters[key] ?? 0),
    excludeBigFive: filters.excludeBigFive,
    minimums: Object.entries(filters.minimums ?? {}).sort(([a], [b]) =>
      a.localeCompare(b),
    ),
  });
}

/** Le profil appliqué reste distinct du choix non encore validé dans la liste. */
export function activeProfile(filters) {
  let reference;
  let title = 'Recherche libre';
  if (filters.presetId === 'winger') {
    reference = WINGER_FILTERS;
    title = 'Ailier rapide';
  }
  if (filters.presetId === 'positions') {
    reference = createPositionFilters(filters.positions);
    title = POSITION_PRESETS.filter((preset) => filters.positions.includes(preset.code))
      .map((preset) => preset.label)
      .join(' · ');
  }
  const position = POSITION_PRESETS.find(
    (item) => `position:${item.code}` === filters.presetId,
  );
  if (position) {
    reference = position.filters;
    title = position.label;
  }
  const role = ROLE_PROFILES.find((item) => `role:${item.id}` === filters.presetId);
  if (role) {
    reference = createRoleFilters(role);
    title = role.title;
  }
  return {
    title,
    customized: Boolean(reference && signature(filters) !== signature(reference)),
    applied: Boolean(reference),
  };
}
