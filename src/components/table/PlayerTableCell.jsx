import { price } from '../../constante/mercato.js';
import { marketValue } from '../../utils/marketValue.js';

export default function PlayerTableCell({
  player,
  columnKey,
  minimum,
  onPreviewPlayer,
}) {
  if (columnKey === 'market_value_in_eur') {
    const value = price(player);
    return (
      <td className={value === null ? 'market-value-unavailable' : undefined}>
        {value === null ? 'Non disponible' : marketValue(value)}
      </td>
    );
  }
  if (minimum !== undefined)
    return (
      <td>
        <strong>{player[columnKey]}</strong>
        <small>min. {minimum}</small>
      </td>
    );
  if (columnKey === 'goalkeeper') {
    const isGoalkeeper = player.Position?.trim() === 'GK';
    return (
      <td className="goalkeeper-cell">
        {isGoalkeeper ? (
          <img
            className="table-goalkeeper-icon"
            src={`${import.meta.env.BASE_URL}glove_gk.png`}
            alt="Gardien"
            title="Gardien"
            width="24"
            height="24"
          />
        ) : (
          <span className="sr-only">Joueur de champ</span>
        )}
      </td>
    );
  }
  if (columnKey === 'Name') {
    return (
      <td>
        <button
          type="button"
          className="player-name-button"
          onPointerEnter={() => onPreviewPlayer?.(player)}
          onFocus={() => onPreviewPlayer?.(player)}
          onClick={() => onPreviewPlayer?.(player)}
          aria-label={`Afficher la fiche de ${player.Name}`}
        >
          <strong>{player.Name}</strong>
        </button>
        <small className="player-category">
          {player.Nation} ·{' '}
          <img
            src={`${import.meta.env.BASE_URL}${player.gender === 'F' ? 'female' : 'male'}.png`}
            alt=""
            width="16"
            height="16"
          />
          {player.gender === 'F' ? 'Femme' : 'Homme'}
        </small>
      </td>
    );
  }
  if (columnKey === 'OVR')
    return (
      <td>
        <b className="score">{player.OVR}</b>
      </td>
    );
  return <td>{player[columnKey]}</td>;
}
