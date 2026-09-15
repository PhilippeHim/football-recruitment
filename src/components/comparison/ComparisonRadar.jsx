import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { COMPARISON_COLORS } from '../../constante/comparison.js';

export default function ComparisonRadar({ players, stats }) {
  return (
    <div
      className="comparison-radar"
      role="img"
      aria-label={`Radar comparant ${players.map((player) => player.Name).join(', ')} sur six notes, de 0 à 100. Valeurs détaillées dans le tableau suivant.`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={stats} outerRadius="72%">
          <PolarGrid stroke="#dce3d8" />
          <PolarAngleAxis dataKey="key" tick={{ fill: '#334b40', fontSize: 12 }} />
          <PolarRadiusAxis
            domain={[0, 100]}
            ticks={[20, 40, 60, 80, 100]}
            tick={{ fill: '#75816e', fontSize: 10 }}
            axisLine={false}
          />
          <Tooltip
            labelFormatter={(key) => stats.find((stat) => stat.key === key)?.label ?? key}
          />
          {players.map((player, index) => (
            <Radar
              key={player.id}
              name={player.Name}
              dataKey={`player${index}`}
              stroke={COMPARISON_COLORS[index]}
              fill={COMPARISON_COLORS[index]}
              fillOpacity={0.06}
              strokeWidth={2.5}
              strokeDasharray={index === 1 ? '7 3' : index === 2 ? '2 3' : undefined}
              isAnimationActive={false}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
