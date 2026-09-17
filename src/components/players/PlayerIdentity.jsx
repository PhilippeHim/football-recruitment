import { playerKey } from '../../constante/mercato.js';
import { marketValue } from '../../utils/marketValue.js';
import { useEffect, useRef } from 'react';
import { POSITIONS } from '../../constante/players.js';

const FIELD_STATS = {
  OVR: 'Note globale',
  PAC: 'Vitesse',
  DRI: 'Dribble',
  SHO: 'Tir',
  PAS: 'Passes',
  DEF: 'Défense',
  PHY: 'Physique',
};
const GOALKEEPER_STATS = {
  OVR: 'Note globale',
  'GK.Diving': 'Plongeon',
  'GK.Handling': 'Prise de balle',
  'GK.Kicking': 'Jeu au pied',
  'GK.Positioning': 'Placement',
  'GK.Reflexes': 'Réflexes',
};

export default function PlayerIdentity({
  player,
  onClose,
  mercato,
  closeOnPointerLeave = false,
}) {
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current;
    const trigger = document.activeElement;
    element.showModal();
    return () => {
      element.close();
      trigger?.focus();
    };
  }, []);
  const identity = {
    Club: player.Team,
    Ligue: player.League,
    Nationalité: player.Nation,
    Âge: `${player.Age} ans`,
    Poste: POSITIONS[player.Position] || player.Position,
    Catégorie:
      player.gender === 'M'
        ? 'Homme'
        : player.gender === 'F'
          ? 'Femme'
          : 'Non renseignée',
    'Pied préféré':
      { Right: 'Droit', Left: 'Gauche' }[player['Preferred.foot']] ||
      player['Preferred.foot'],
  };
  return (
    <dialog
      ref={dialog}
      className="player-identity"
      aria-labelledby="identity-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onPointerLeave={closeOnPointerLeave ? onClose : undefined}
    >
      <header>
        <div>
          <span className="eyebrow">FICHE JOUEUR</span>
          <h2 id="identity-title">{player.Name}</h2>
        </div>
        <button autoFocus onClick={onClose} aria-label="Fermer la fiche">
          Fermer ×
        </button>
      </header>
      {mercato && (
        <button
          disabled={mercato.state.shortlist.includes(playerKey(player))}
          onClick={() => mercato.add(player)}
        >
          {mercato.state.shortlist.includes(playerKey(player))
            ? 'Dans mon vivier mercato ✓'
            : 'Ajouter à mon vivier mercato'}
        </button>
      )}
      <dl className="identity-details">
        {Object.entries(identity).map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value || 'Non renseigné'}</dd>
          </div>
        ))}
      </dl>
      <h3>Statistiques</h3>
      <div className="identity-stats">
        {Object.entries(player.Position === 'GK' ? GOALKEEPER_STATS : FIELD_STATS).map(
          ([key, label]) => (
            <div key={key}>
              <span>{label}</span>
              <strong>{player[key] ?? '—'}</strong>
            </div>
          ),
        )}
      </div>
      <section className="identity-value" aria-label="Valeur marchande">
        <h3>Valeur marchande</h3>
        <p>{marketValue(player.market_value_in_eur)}</p>
        <small>
          Valeur issue du dataset. Une estimation ne constitue pas un prix de transfert.
        </small>
      </section>
    </dialog>
  );
}
