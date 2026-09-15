export default function PlayerTableCell({ player, columnKey, minimum }) {
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
        <small>
          {player.Nation} · {player.gender === 'F' ? 'Femme' : 'Homme'}
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
