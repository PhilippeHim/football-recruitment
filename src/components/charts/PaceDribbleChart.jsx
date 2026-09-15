import { useMemo, useState } from 'react';
import {
  ReferenceLine,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from 'recharts';
import {
  CHART_COLOR,
  CHART_GRID_COLOR,
  CHART_AXIS_STYLE,
  SCORE_DOMAIN,
  MEDIAN_COLOR,
  REGRESSION_COLOR,
} from '../../constante/charts.js';
import PlayerTooltip from './PlayerTooltip.jsx';
import MedianToggle from './MedianToggle.jsx';
import { median } from '../../utils/median.js';
import { formatMean } from '../../utils/formatNumber.js';
import { linearRegression } from '../../utils/linearRegression.js';
import RegressionToggle from './RegressionToggle.jsx';
import RegressionCaption from './RegressionCaption.jsx';

export default function PaceDribbleChart({ rows }) {
  const [showMedian, setShowMedian] = useState(false);
  const [showRegression, setShowRegression] = useState(false);
  const regression = useMemo(() => linearRegression(rows, 'PAC', 'DRI'), [rows]);
  const medians = useMemo(
    () => ({ pac: median(rows, 'PAC'), dri: median(rows, 'DRI') }),
    [rows],
  );
  return (
    <section className="card relation">
      <div className="chart-heading">
        <span className="eyebrow">01 / RELATION</span>
        <span className="tag">Tous les profils retenus</span>
      </div>
      <h2>Repérer la vitesse et la maîtrise</h2>
      <p>
        Le nuage situe chaque joueur selon sa vitesse et son dribble : les profils
        combinant les deux se trouvent en haut à droite.
      </p>
      <MedianToggle
        checked={showMedian}
        onChange={setShowMedian}
        label="Afficher les médianes PAC et DRI"
      />
      <RegressionToggle
        checked={showRegression}
        onChange={setShowRegression}
        available={regression !== null}
      />
      <div
        className="chart-area"
        role="img"
        aria-label={`Nuage de ${rows.length} joueurs : vitesse PAC et dribble DRI, notes de 0 à 100.`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 16, right: 22, bottom: 24, left: 3 }}>
            <CartesianGrid stroke={CHART_GRID_COLOR} strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="PAC"
              name="Vitesse"
              domain={SCORE_DOMAIN}
              tick={CHART_AXIS_STYLE}
              label={{
                value: 'PAC · Vitesse',
                position: 'bottom',
                offset: 5,
                ...CHART_AXIS_STYLE,
              }}
            />
            <YAxis
              type="number"
              dataKey="DRI"
              name="Dribble"
              domain={SCORE_DOMAIN}
              tick={CHART_AXIS_STYLE}
              width={42}
              label={{
                value: 'DRI · Dribble',
                angle: -90,
                position: 'insideLeft',
                ...CHART_AXIS_STYLE,
              }}
            />
            <Tooltip content={<PlayerTooltip />} />
            <Scatter
              data={rows}
              fill={CHART_COLOR}
              fillOpacity={0.35}
              isAnimationActive={false}
            />
            {showMedian && medians.pac !== null && (
              <ReferenceLine
                x={medians.pac}
                stroke={MEDIAN_COLOR}
                strokeWidth={2}
                strokeDasharray="6 4"
              />
            )}
            {showMedian && medians.dri !== null && (
              <ReferenceLine
                y={medians.dri}
                stroke={MEDIAN_COLOR}
                strokeWidth={2}
                strokeDasharray="6 4"
              />
            )}
            {showRegression && regression && (
              <ReferenceLine
                segment={regression.segment}
                stroke={REGRESSION_COLOR}
                strokeWidth={2.5}
                ifOverflow="hidden"
              />
            )}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-foot">
        <span className="dot" /> Un point = un joueur · Survolez pour voir son profil
        {showRegression && regression && <RegressionCaption regression={regression} />}
        {showMedian && (
          <div className="median-caption" role="status">
            Médianes : PAC {formatMean(medians.pac)} · DRI {formatMean(medians.dri)}. Les
            pointillés séparent les valeurs basses et hautes de la sélection.
          </div>
        )}
      </div>
    </section>
  );
}
