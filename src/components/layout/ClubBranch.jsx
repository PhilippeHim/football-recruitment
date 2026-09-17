import { useEffect, useState } from 'react';
import { POSITIONS } from '../../constante/players.js';
import { marketValue } from '../../utils/marketValue.js';

/** Les effectifs sont rendus à l'ouverture pour alléger les grandes ligues. */
export default function ClubBranch({ club, expanded = false, onSelectPlayer }) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  useEffect(() => {
    if (expanded) setIsExpanded(true);
  }, [expanded]);
  return (
    <details
      className="club-branch"
      open={isExpanded || undefined}
      data-club={club.name}
      onToggle={(event) => setIsExpanded(event.currentTarget.open)}
    >
      <summary>
        <strong>{club.name}</strong>
        <span>{club.count} joueurs</span>
      </summary>
      {isExpanded && (
        <ul className="roster-branches" aria-label={`Effectif de ${club.name}`}>
          {club.players.map((player) => (
            <li key={player.id}>
              <div className="player-portrait-icons">
                {['F', 'M'].includes(player.gender) && (
                  <img
                    className="player-avatar"
                    src={`${import.meta.env.BASE_URL}pers_${player.gender.toLowerCase()}.png`}
                    alt={player.gender === 'F' ? 'Femme' : 'Homme'}
                    width="40"
                    height="40"
                  />
                )}
                {player.Position === 'GK' && (
                  <img
                    className="goalkeeper-icon"
                    src={`${import.meta.env.BASE_URL}glove_gk.png`}
                    alt={player.gender === 'F' ? 'Gardienne' : 'Gardien'}
                    title={player.gender === 'F' ? 'Gardienne' : 'Gardien'}
                    width="24"
                    height="24"
                  />
                )}
              </div>
              <button
                className="player-identity-link"
                onClick={() => onSelectPlayer(player)}
              >
                {player.Name}
              </button>
              <span>
                {POSITIONS[player.Position] || player.Position} · {player.Age} ans
              </span>
              <span>
                {player.Nation} · OVR {player.OVR}
              </span>
              <span className="player-market-value">
                Valeur marchande : {marketValue(player.market_value_in_eur)}
              </span>
              {player.statut_match === 'ok_approximatif' && (
                <span>Correspondance du nom à confirmer</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </details>
  );
}
