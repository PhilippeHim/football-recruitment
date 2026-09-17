import { useMemo, useState } from 'react';
import { ROLE_PROFILES, createRoleFilters } from '../constante/roleProfiles.js';
import { filterPlayers } from '../utils/filterPlayers.js';
import RoleProfileCard from '../components/profiles/RoleProfileCard.jsx';

export default function RoleProfilesPage({ rows, onApply, onApplyWinger }) {
  const [family, setFamily] = useState('Tous');
  const counts = useMemo(
    () =>
      Object.fromEntries(
        ROLE_PROFILES.map((profile) => [
          profile.id,
          filterPlayers(rows, createRoleFilters(profile)).length,
        ]),
      ),
    [rows],
  );
  return (
    <>
      <div className="role-intro">
        <p>
          Partez d’une mission sur le terrain. Chaque profil propose des critères
          explicites que vous pourrez ajuster dans la recherche.
        </p>
        <small>
          Seuils de démonstration, sans valeur de norme sportive. L’application remplace
          les filtres actuels : tous championnats, hommes et femmes, puis les postes et
          notes indiqués. Une donnée manquante ne satisfait pas le critère.
        </small>
      </div>
      <div className="role-families" role="group" aria-label="Famille de profils">
        {['Tous', 'Défense', 'Milieu', 'Attaque'].map((value) => (
          <button
            key={value}
            aria-pressed={family === value}
            onClick={() => setFamily(value)}
          >
            {value}
          </button>
        ))}
      </div>
      <div className="role-catalogue">
        {ROLE_PROFILES.filter(
          (profile) => family === 'Tous' || profile.family === family,
        ).map((profile) => (
          <RoleProfileCard
            key={profile.id}
            profile={profile}
            count={counts[profile.id]}
            onApply={onApply}
          />
        ))}
      </div>
      <p className="role-note">
        Vous cherchez uniquement un poste, notamment un gardien ? Les douze raccourcis par
        poste restent accessibles sur la page <a href="#/recherche">Les joueurs</a>.
      </p>
      <section className="card winger-example">
        <span className="eyebrow">EXEMPLE DU MINI-PROJET</span>
        <h2>Ailier rapide</h2>
        <p>
          Ailiers et milieux de côté, hommes, OVR &gt; 75, PAC et DRI ≥ 80, hors des cinq
          grands championnats masculins.
        </p>
        <button onClick={onApplyWinger}>Essayer : Ailier rapide</button>
      </section>
    </>
  );
}
