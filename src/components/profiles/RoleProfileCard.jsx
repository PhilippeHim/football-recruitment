import { ROLE_STAT_LABELS } from '../../constante/roleProfiles.js';
import { formatCount } from '../../utils/formatNumber.js';

export default function RoleProfileCard({ profile, count, onApply }) {
  return (
    <article className="card role-card">
      <span className="eyebrow">
        {profile.family} · {profile.positions.join(' / ')}
      </span>
      <h2>{profile.title}</h2>
      <p>{profile.description}</p>
      <ul>
        <li>Note globale OVR ≥ 75</li>
        {Object.entries(profile.criteria).map(([key, value]) => (
          <li key={key}>
            {ROLE_STAT_LABELS[key]} <strong>≥ {value}</strong>
          </li>
        ))}
      </ul>
      <div className="role-card-action">
        <span>{formatCount(count)} profils dans le dataset</span>
        <button
          onClick={() => onApply(profile.id)}
          aria-label={`Rechercher : ${profile.title}`}
        >
          Utiliser ce profil →
        </button>
      </div>
    </article>
  );
}
