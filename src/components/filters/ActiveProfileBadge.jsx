import { NUMERIC_FILTERS } from '../../constante/filters.js';
import { activeProfile } from '../../utils/activeProfile.js';
import { POSITIONS } from '../../constante/players.js';
import { ROLE_STAT_LABELS } from '../../constante/roleProfiles.js';

export default function ActiveProfileBadge({ filters }) {
  const profile = activeProfile(filters);
  const scores = NUMERIC_FILTERS.map(({ key, short }) => [short, filters[key]])
    .filter(([, value]) => value > 0)
    .map(([key, value]) => `${key} ≥ ${value}`);
  const criteria = Object.entries(filters.minimums ?? {}).map(
    ([key, value]) => `${ROLE_STAT_LABELS[key]} ≥ ${value}`,
  );
  return (
    <section
      className="preset active-profile"
      aria-label="Profil actif"
      aria-live="polite"
    >
      <span>{profile.applied ? '✓ PROFIL APPLIQUÉ' : 'VOTRE RECHERCHE'}</span>
      <strong>{profile.title}</strong>
      {profile.customized && <span className="profile-customized">Personnalisé</span>}
      <small>
        {filters.positions.length
          ? filters.positions.map((code) => POSITIONS[code]).join(' · ')
          : 'Tous les postes'}
      </small>
      <small>{[...scores, ...criteria].join(' · ') || 'Aucun seuil de note'}</small>
      <small>
        {filters.leagues.length ? filters.leagues.join(' · ') : 'Tous les championnats'}
        {' · '}
        {filters.nations?.length ? filters.nations.join(' · ') : 'Toutes nationalités'}
        {filters.teams?.length ? ` · ${filters.teams.join(' · ')}` : ''}
        {filters.ages?.length
          ? ` · ${filters.ages.map((age) => `${age} ans`).join(' · ')}`
          : ''}
        {filters.excludeBigFive ? ' · Hors des 5 grands masculins' : ''} ·{' '}
        {filters.gender === 'M'
          ? 'Hommes'
          : filters.gender === 'F'
            ? 'Femmes'
            : 'Hommes et femmes'}
      </small>
      {filters.query && <small>Recherche : « {filters.query} »</small>}
    </section>
  );
}
