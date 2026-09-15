import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import {
  CHART_COLOR,
  CHART_GRID_COLOR,
  CHART_AXIS_STYLE,
} from '../../constante/charts.js';
import { leagueCounts } from '../../utils/leagueCounts.js';
import { TOP_LEAGUES_LIMIT } from '../../constante/charts.js';

export default function LeagueComparisonChart({ rows }) {
  const groups = leagueCounts(rows);
  const top = groups.slice(0, TOP_LEAGUES_LIMIT);
  return (
    <section className="card comparison">
      <div>
        <span className="eyebrow">03 / COMPARAISON</span>
        <h2>Où trouver ces profils ?</h2>
        <p>
          Les barres classent les six ligues les plus représentées dans la sélection pour
          orienter la recherche.
        </p>
        <div className="insight">
          <strong>{top[0]?.league}</strong>
          <span>arrive en tête avec {top[0]?.count} profils correspondants.</span>
        </div>
        <small>
          {groups.length > TOP_LEAGUES_LIMIT
            ? `${groups.length - TOP_LEAGUES_LIMIT} autres ligues restent présentes dans le tableau et les autres graphiques.`
            : `${groups.length} ligue(s) dans la sélection.`}
        </small>
      </div>
      <div
        className="chart-area groups"
        role="img"
        aria-label={top.map((g) => `${g.league} : ${g.count} joueurs`).join(', ')}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={top}
            layout="vertical"
            margin={{ top: 4, right: 28, bottom: 24, left: 0 }}
          >
            <CartesianGrid stroke={CHART_GRID_COLOR} horizontal={false} />
            <XAxis
              type="number"
              allowDecimals={false}
              domain={[0, 'auto']}
              tick={CHART_AXIS_STYLE}
              label={{
                value: 'Nombre de joueurs',
                position: 'bottom',
                ...CHART_AXIS_STYLE,
              }}
            />
            <YAxis
              type="category"
              dataKey="league"
              width={180}
              tick={CHART_AXIS_STYLE}
              interval={0}
            />
            <Tooltip formatter={(v) => [v, 'Joueurs']} />
            <Bar
              dataKey="count"
              fill={CHART_COLOR}
              radius={[0, 4, 4, 0]}
              barSize={20}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
