import { COMPARISON_COLORS } from '../../constante/comparison.js';

export default function ComparisonValues({ players, stats }) {
  return (
    <div className="table-scroll comparison-values">
      <table>
        <caption>
          Les notes en détail · le gras indique le maximum par statistique
        </caption>
        <thead>
          <tr>
            <th scope="col">Qualité</th>
            {players.map((player, index) => (
              <th scope="col" key={player.id} style={{ color: COMPARISON_COLORS[index] }}>
                {player.Name}
              </th>
            ))}
            <th scope="col">Écart max.</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat) => (
            <tr key={stat.key}>
              <th scope="row">
                {stat.key}
                <small>{stat.label}</small>
              </th>
              {stat.values.map((value, index) => (
                <td key={players[index].id}>
                  {value === stat.maximum ? <strong>{value}</strong> : value}
                </td>
              ))}
              <td>{stat.gap} pts</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
