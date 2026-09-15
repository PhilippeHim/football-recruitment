import { formatCount } from '../../utils/formatNumber.js';

export default function Header({ playerCount, loading }) {
  return (
    <header className="topbar">
      <a className="brand" href="#/accueil" aria-label="Terrain — Accueil">
        <span className="brand-mark">T</span>terrain<span className="brand-point">.</span>
      </a>
      <span className="top-label">CELLULE DE RECRUTEMENT</span>
      <span className="dataset-badge">
        <i />
        {loading ? 'Chargement…' : `${formatCount(playerCount)} profils`}
        <span>· EA Sports FC</span>
      </span>
    </header>
  );
}
