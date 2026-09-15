import { useMemo } from 'react';
import HomeHero from '../components/home/HomeHero.jsx';
import HomeJourney from '../components/home/HomeJourney.jsx';
import HomePurpose from '../components/home/HomePurpose.jsx';
import {
  ROLE_PROFILES,
  createRoleFilters,
  ROLE_STAT_LABELS,
} from '../constante/roleProfiles.js';
import { filterPlayers } from '../utils/filterPlayers.js';
import { formatCount } from '../utils/formatNumber.js';

export default function HomePage({ rows, loading, error, onTryProfile }) {
  const example = ROLE_PROFILES.find((profile) => profile.id === 'relanceur');
  const count = useMemo(
    () => filterPlayers(rows, createRoleFilters(example)).length,
    [rows, example],
  );
  return (
    <div className="home-page">
      <HomeHero />
      <section className="home-example" aria-labelledby="home-example-title">
        <div>
          <span className="eyebrow">UN CAS CONCRET</span>
          <h2 id="home-example-title">« Je cherche un défenseur qui sait relancer. »</h2>
          <p>
            Commencez par le profil Défenseur relanceur, ajustez les seuils à votre
            besoin, puis comparez deux ou trois joueurs de la liste obtenue.
          </p>
          <button
            onClick={() => onTryProfile(example.id)}
            disabled={loading || Boolean(error)}
          >
            Essayer cet exemple →
          </button>
        </div>
        <div className="home-example-criteria">
          <strong>Défenseur central · OVR ≥ 75</strong>
          <ul>
            {Object.entries(example.criteria).map(([key, value]) => (
              <li key={key}>
                {ROLE_STAT_LABELS[key]} <b>≥ {value}</b>
              </li>
            ))}
          </ul>
          <span role="status">
            {loading
              ? 'Chargement des données…'
              : error
                ? 'Données indisponibles pour le moment.'
                : `${formatCount(count)} profils correspondent dans le fichier actuel.`}
          </span>
          <small>
            Exemple sur tous les championnats, hommes et femmes. Appliquer cet exemple
            remplace les filtres de votre recherche.
          </small>
        </div>
      </section>
      <HomeJourney />
      <HomePurpose />
      <section className="home-start">
        <div>
          <h2>Quel profil manque à votre équipe ?</h2>
          <p>Choisissez une mission, puis adaptez les critères à votre recherche.</p>
        </div>
        <a className="action-link home-primary" href="#/profils">
          Explorer les profils métier →
        </a>
      </section>
    </div>
  );
}
