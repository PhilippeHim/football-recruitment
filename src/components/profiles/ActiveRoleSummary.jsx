import { ROLE_PROFILES, ROLE_STAT_LABELS } from '../../constante/roleProfiles.js';

export default function ActiveRoleSummary({ filters, count }) {
  const profile = ROLE_PROFILES.find((item) => item.id === filters.roleId);
  if (!profile) return null;
  return (
    <section className="role-summary" aria-live="polite">
      <strong>
        {profile.title} · {count} profils correspondent
      </strong>
      <span>{profile.description}</span>
      <span>
        Critères actifs :{' '}
        {Object.entries(filters.minimums)
          .map(([key, value]) => `${ROLE_STAT_LABELS[key]} ≥ ${value}`)
          .join(' · ')}
        . Ajustez-les dans les filtres.
      </span>
      <span>
        Chaque résultat satisfait tous ces seuils et vos autres filtres. Les colonnes
        métier du tableau permettent de vérifier ses notes.
      </span>
    </section>
  );
}
