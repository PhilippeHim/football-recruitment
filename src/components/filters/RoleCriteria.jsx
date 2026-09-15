import { ROLE_PROFILES, ROLE_STAT_LABELS } from '../../constante/roleProfiles.js';
import ScoreSlider from './ScoreSlider.jsx';

export default function RoleCriteria({ filters, onChange, onRemove }) {
  const profile = ROLE_PROFILES.find((item) => item.id === filters.roleId);
  if (!profile) return null;
  const customized =
    filters.ovr !== 75 ||
    JSON.stringify(filters.positions) !== JSON.stringify(profile.positions) ||
    Object.entries(profile.criteria).some(
      ([key, value]) => filters.minimums[key] !== value,
    );
  return (
    <section className="role-criteria">
      <span className="eyebrow">PROFIL MÉTIER ACTIF</span>
      <strong>
        {profile.title}
        {customized ? ' · personnalisé' : ''}
      </strong>
      <p>Ces seuils s’ajoutent aux notes minimales et aux autres filtres.</p>
      {Object.entries(filters.minimums).map(([key, value]) => (
        <ScoreSlider
          key={key}
          short=""
          label={ROLE_STAT_LABELS[key]}
          value={value}
          onChange={(next) => onChange(key, next)}
        />
      ))}
      <button className="text-button" onClick={onRemove}>
        Retirer les critères métier
      </button>
    </section>
  );
}
