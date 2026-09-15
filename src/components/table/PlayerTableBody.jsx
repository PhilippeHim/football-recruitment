import { TABLE_COLUMNS } from '../../constante/table.js';
import PlayerTableCell from './PlayerTableCell.jsx';
import { MAX_COMPARISON_PLAYERS } from '../../constante/comparison.js';

export default function PlayerTableBody({
  rows,
  comparisonPlayers,
  onTogglePlayer,
  columns = TABLE_COLUMNS,
  roleMinimums = {},
}) {
  return (
    <tbody>
      {rows.map((player) => {
        const checked = comparisonPlayers.some((item) => item.id === player.id);
        const isGoalkeeper = player.Position === 'GK';
        const disabled =
          isGoalkeeper ||
          (!checked && comparisonPlayers.length >= MAX_COMPARISON_PLAYERS);
        return (
          <tr key={player.id} className={checked ? 'player-selected' : undefined}>
            <td className="compare-cell">
              <input
                type="checkbox"
                aria-label={`Comparer ${player.Name}`}
                checked={checked}
                disabled={disabled}
                onChange={() => onTogglePlayer(player)}
              />
              {isGoalkeeper && <small>Gardien</small>}
            </td>
            {columns.map((column) => (
              <PlayerTableCell
                key={column.key}
                player={player}
                columnKey={column.key}
                minimum={roleMinimums[column.key]}
              />
            ))}
          </tr>
        );
      })}
    </tbody>
  );
}
