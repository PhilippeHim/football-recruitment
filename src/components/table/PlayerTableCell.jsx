import { price } from '../../constante/mercato.js';
import { marketValue } from '../../utils/marketValue.js';

export default function PlayerTableCell({ player, columnKey, minimum }) {
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
  if (columnKey === 'Name') {
    return (
      <td>
        <strong>{player.Name}</strong>
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
