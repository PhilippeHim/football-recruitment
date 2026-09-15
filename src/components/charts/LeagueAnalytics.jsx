import { useMemo, useState } from 'react';
import CategorySymbols from '../players/CategorySymbols.jsx';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { price } from '../../constante/mercato.js';
import { marketValue } from '../../utils/marketValue.js';

const VIEWS = {
  count: {
    title: 'Où sont les joueurs ?',
    description: 'Les ligues les plus représentées dans le fichier.',
    unit: 'joueurs',
  },
  level: {
    title: 'Quels clubs ont le meilleur niveau ?',
    description: 'Note OVR moyenne des joueurs de chaque club.',
    unit: 'OVR moyen',
  },
  value: {
    title: 'Où se concentre la valeur marchande ?',
    description:
      'Somme des valeurs connues par club, et non budget du club ou coût de transfert.',
    unit: 'Valeur cumulée',
  },
};

export default function LeagueAnalytics({ rows }) {
  const [view, setView] = useState('count');
  const [league, setLeague] = useState('');
  const [limit, setLimit] = useState(10);
  const options = useMemo(
    () =>
      [...new Set(rows.map((p) => p.League))].sort((a, b) => a.localeCompare(b, 'fr')),
    [rows],
  );
  const data = useMemo(() => {
    const groups = new Map();
    for (const player of rows) {
      if (view !== 'count' && league && player.League !== league) continue;
      const key = view === 'count' ? player.League : `${player.League}|${player.Team}`;
      if (!groups.has(key))
        groups.set(key, {
          id: key,
          genders: new Set(),
          name: view === 'count' ? player.League : player.Team,
          league: player.League,
          count: 0,
          sum: 0,
          value: 0,
          known: 0,
          approximate: 0,
        });
      const group = groups.get(key);
      group.count++;
      group.genders.add(player.gender);
      group.sum += player.OVR;
      const amount = price(player);
      if (amount !== null) {
        group.known++;
        group.value += amount;
        if (player.statut_match === 'ok_approximatif') group.approximate++;
      }
    }
    return [...groups.values()]
      .map((g) => ({
        ...g,
        score: view === 'count' ? g.count : view === 'level' ? g.sum / g.count : g.value,
      }))
      .filter((g) => view !== 'value' || g.known > 0)
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, 'fr'))
      .slice(0, limit);
  }, [rows, league, limit, view]);
  const format = (value) =>
    view === 'value'
      ? marketValue(value)
      : Number(value).toLocaleString('fr-FR', { maximumFractionDigits: 1 });
  return (
    <section className="card league-analytics" aria-label="Analyses des ligues et clubs">
      <h2>Le vivier en trois regards</h2>
      <div className="analytics-controls" role="group" aria-label="Choisir une analyse">
        {Object.entries(VIEWS).map(([key, config], index) => (
          <button key={key} aria-pressed={view === key} onClick={() => setView(key)}>
            {index + 1}. {config.unit}
          </button>
        ))}
      </div>
      <div className="analytics-controls">
        {view !== 'count' && (
          <label>
            Ligue analysée{' '}
            <select value={league} onChange={(event) => setLeague(event.target.value)}>
              <option value="">Toutes les ligues</option>
              {options.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </label>
        )}
        <label>
          Nombre de résultats{' '}
          <select
            value={limit}
            onChange={(event) => setLimit(Number(event.target.value))}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </label>
      </div>
      <h3>{VIEWS[view].title}</h3>
      <p>
        {VIEWS[view].description} Survolez une barre pour le détail. Ces analyses
        utilisent le dataset complet, indépendamment de la recherche ci-dessous.
      </p>
      {view === 'count' && (
        <p>
          Cliquez sur une barre pour analyser les clubs de cette ligue ; le sélecteur de
          ligue est aussi disponible dans les deux autres vues.
        </p>
      )}
      <p>♀ : catégorie féminine · ♂ : catégorie masculine.</p>
      {data.length ? (
        <>
          <div
            style={{
              height: Math.max(260, data.length * 36),
              width: '100%',
              minWidth: 0,
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ left: 0, right: 24, top: 8, bottom: 8 }}
                accessibilityLayer
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  domain={view === 'level' ? [0, 99] : [0, 'auto']}
                  tickFormatter={format}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  type="category"
                  dataKey="id"
                  width={145}
                  tick={({ x, y, payload }) => {
                    const item = data.find((group) => group.id === payload.value);
                    if (!item) return null;
                    const name =
                      item.name.length > 19 ? `${item.name.slice(0, 18)}…` : item.name;
                    return (
                      <text
                        x={x}
                        y={y}
                        dy={4}
                        textAnchor="end"
                        fontSize={10}
                        fill="#64736d"
                      >
                        <title>{item.name}</title>
                        {name}{' '}
                        {['F', 'M']
                          .filter((gender) => item.genders.has(gender))
                          .map((gender) => (
                            <tspan
                              key={gender}
                              fill={gender === 'F' ? '#d14f9b' : '#2386c0'}
                              fontWeight={700}
                            >
                              {gender === 'F' ? '♀' : '♂'}{' '}
                            </tspan>
                          ))}
                      </text>
                    );
                  }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    const item = payload?.[0]?.payload;
                    return active && item ? (
                      <div className="analytics-tooltip">
                        <strong>
                          {item.name} <CategorySymbols genders={item.genders} />
                        </strong>
                        <div>{item.league}</div>
                        <div>
                          {VIEWS[view].unit} : {format(item.score)}
                        </div>
                        <div>{item.count} joueurs</div>
                        {view === 'value' && (
                          <>
                            <div>
                              Valeurs disponibles : {item.known}/{item.count}
                            </div>
                            <div>{item.approximate} correspondances approximatives</div>
                          </>
                        )}
                      </div>
                    ) : null;
                  }}
                />
                <Bar
                  dataKey="score"
                  fill="#147c70"
                  radius={[0, 4, 4, 0]}
                  cursor={view === 'count' ? 'pointer' : 'default'}
                  onClick={(item) => {
                    if (view === 'count') {
                      setLeague(item.league);
                      setView('level');
                    }
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <details>
            <summary>Voir les chiffres du graphique</summary>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>{view === 'count' ? 'Ligue' : 'Club · Ligue'}</th>
                    <th>{VIEWS[view].unit}</th>
                    <th>Effectif</th>
                    {view === 'value' && <th>Couverture des valeurs</th>}
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={`${item.league}|${item.name}`}>
                      <td>
                        {item.name} <CategorySymbols genders={item.genders} />
                        {view !== 'count' && <small>{item.league}</small>}
                      </td>
                      <td>{format(item.score)}</td>
                      <td>{item.count}</td>
                      {view === 'value' && (
                        <td>
                          {item.known}/{item.count} · {item.approximate} approximatives
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      ) : (
        <p>Aucune valeur marchande disponible pour cette sélection.</p>
      )}
      {view === 'value' && (
        <p>
          Les valeurs manquantes ne valent pas zéro : les totaux sont partiels. La
          couverture et les rapprochements approximatifs sont indiqués dans les détails.
        </p>
      )}
    </section>
  );
}
