import { NUMERIC_FILTERS } from '../../constante/filters.js';
import { useMemo, useState } from 'react';
import {
  ReferenceLine,
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
  MEDIAN_COLOR,
} from '../../constante/charts.js';
import { histogram } from '../../utils/histogram.js';
import { median } from '../../utils/median.js';
import { formatMean } from '../../utils/formatNumber.js';
import { NOTE_MIN, NOTE_MAX } from '../../constante/players.js';
import MedianToggle from './MedianToggle.jsx';

export default function OvrHistogram({ rows }) {
  const [stat, setStat] = useState('OVR');
  const [showMedian, setShowMedian] = useState(false);
  const medianOvr = useMemo(() => median(rows, stat), [rows, stat]);
  const bins = useMemo(() => histogram(rows, stat), [rows, stat]);
  const peak = bins.reduce(
    (largest, bin) => (bin.count > largest.count ? bin : largest),
    bins[0],
  );
  return (
    <section className="card">
      <span className="eyebrow">02 / DISTRIBUTION</span>
      <h2>Quel niveau dans la sélection ?</h2>
      <p>
        L’histogramme compte les joueurs par intervalle de cinq notes {stat} pour montrer
        la répartition des niveaux.
      </p>
      <label className="select-label">
        Note à analyser
        <select value={stat} onChange={(event) => setStat(event.target.value)}>
          {NUMERIC_FILTERS.map(({ short, label }) => (
            <option key={short} value={short}>
              {short} · {label}
            </option>
          ))}
        </select>
      </label>
      <MedianToggle
        checked={showMedian}
        onChange={setShowMedian}
        label={`Afficher la médiane ${stat}`}
      />
      <div
        className="chart-area"
        role="img"
        aria-label={`Histogramme ${stat} : intervalle le plus fréquent ${peak.label}, ${peak.count} joueurs.`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={bins}
            barCategoryGap={0}
            margin={{ top: 16, right: 10, bottom: 40, left: 0 }}
          >
            <CartesianGrid stroke={CHART_GRID_COLOR} vertical={false} />
            <XAxis
              type="number"
              dataKey="center"
              domain={[NOTE_MIN - 0.5, NOTE_MAX + 0.5]}
              ticks={bins.map((bin) => bin.center)}
              tickFormatter={(value) =>
                bins.find((bin) => bin.center === value)?.label ?? value
              }
              tick={{ ...CHART_AXIS_STYLE, fontSize: 10 }}
              angle={-60}
              textAnchor="end"
              interval={1}
              height={45}
              label={{
                value: `${stat} · Intervalles de 5 points`,
                position: 'bottom',
                ...CHART_AXIS_STYLE,
              }}
            />
            <YAxis
              allowDecimals={false}
              domain={[0, 'auto']}
              width={35}
              tick={CHART_AXIS_STYLE}
            />
            <Tooltip
              formatter={(v) => [v, 'Joueurs']}
              labelFormatter={(value) =>
                `${stat} ${bins.find((bin) => bin.center === value)?.label ?? value}`
              }
            />
            <Bar
              dataKey="count"
              fill={CHART_COLOR}
              stroke="#fafcf9"
              isAnimationActive={false}
            />
            {showMedian && medianOvr !== null && (
              <ReferenceLine
                x={medianOvr}
                stroke={MEDIAN_COLOR}
                strokeWidth={2}
                strokeDasharray="6 4"
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-foot">
        Intervalle le plus fréquent : <strong>{peak.label}</strong> · {peak.count} joueurs
        {showMedian && (
          <div className="median-caption" role="status">
            Médiane {stat} : {formatMean(medianOvr)}. Au moins la moitié des joueurs ont
            une note inférieure ou égale à cette valeur, et au moins la moitié une note
            supérieure ou égale.
          </div>
        )}
      </div>
    </section>
  );
}
