import { percentile } from '../../utils/percentile.js';
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
  MEDIAN_COLOR,
  REGRESSION_COLOR,
  SCATTER_SAMPLE_LIMIT,
} from '../../constante/charts.js';
import PlayerTooltip from './PlayerTooltip.jsx';
import MedianToggle from './MedianToggle.jsx';
import { median } from '../../utils/median.js';
import { formatMean } from '../../utils/formatNumber.js';
import { linearRegression } from '../../utils/linearRegression.js';
import RegressionToggle from './RegressionToggle.jsx';
import RegressionCaption from './RegressionCaption.jsx';
import { scoreDomain } from '../../utils/scoreDomain.js';
import { sampleRows } from '../../utils/sampleRows.js';

export default function PaceDribbleChart({ rows }) {
  const [zoom90, setZoom90] = useState(false);
  const [showP90, setShowP90] = useState(false);
  const scatterRows = useMemo(
    () => sampleRows(rows, SCATTER_SAMPLE_LIMIT),
    [rows],
  );
  const p90 = useMemo(
    () => ({ pac: percentile(rows, 'PAC'), dri: percentile(rows, 'DRI') }),
    [rows],
  );
  const [showMedian, setShowMedian] = useState(false);
  const [showRegression, setShowRegression] = useState(false);
  const domains = useMemo(
    () =>
      zoom90
        ? { pac: [p90.pac ?? 90, 100], dri: [p90.dri ?? 90, 100] }
        : { pac: scoreDomain(rows, 'PAC'), dri: scoreDomain(rows, 'DRI') },
    [rows, zoom90, p90],
  );
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
      <label className="median-toggle">
        <input
          type="checkbox"
          checked={showP90}
          onChange={(event) => setShowP90(event.target.checked)}
        />
        Afficher le P90 de PAC et DRI
      </label>
      <label className="median-toggle">
        <input
          type="checkbox"
          checked={zoom90}
          onChange={(event) => setZoom90(event.target.checked)}
        />
        Zoom du P90 à 100 sur les deux axes
      </label>
      {zoom90 && (
        <p>
          Le zoom cadre PAC de {formatMean(p90.pac)} à 100 et DRI de {formatMean(p90.dri)}{' '}
          à 100. Les médianes, P90 et la régression restent calculés sur toute la
          sélection.
        </p>
      )}
      <RegressionToggle
        checked={showRegression}
        onChange={setShowRegression}
        available={regression !== null}
      />
      <div
        className="chart-area"
        role="img"
        aria-label={`Nuage de ${rows.length} joueurs, dont ${scatterRows.length} affichés : vitesse PAC de ${domains.pac[0]} à ${domains.pac[1]}, dribble DRI de ${domains.dri[0]} à ${domains.dri[1]}. ${zoom90 ? 'Zoom du P90 à 100 sur les deux axes.' : 'Axes ajustés à la sélection.'}`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 16, right: 22, bottom: 24, left: 3 }}>
            <CartesianGrid stroke={CHART_GRID_COLOR} strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="PAC"
              name="Vitesse"
              domain={domains.pac}
              allowDataOverflow
              allowDecimals={false}
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
              domain={domains.dri}
              allowDataOverflow
              allowDecimals={false}
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
              data={scatterRows}
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
            {showP90 && p90.pac !== null && (
              <ReferenceLine
                x={p90.pac}
                stroke="#245caa"
                strokeWidth={2}
                strokeDasharray="10 3 2 3"
              />
            )}
            {showP90 && p90.dri !== null && (
              <ReferenceLine
                y={p90.dri}
                stroke="#245caa"
                strokeWidth={2}
                strokeDasharray="10 3 2 3"
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
        {scatterRows.length < rows.length &&
          ` · ${scatterRows.length.toLocaleString('fr-FR')} points affichés sur ${rows.length.toLocaleString('fr-FR')}`}
        <div>
          {zoom90 ? 'Zoom P90–100' : 'Axes ajustés à la sélection'} : PAC {domains.pac[0]}
          –{domains.pac[1]} · DRI {domains.dri[0]}–{domains.dri[1]}.
        </div>
        {showRegression && regression && <RegressionCaption regression={regression} />}
        {showP90 && (
          <div className="p90-caption" role="status">
            P90 : PAC {formatMean(p90.pac)} · DRI {formatMean(p90.dri)}. Les lignes bleues
            marquent le 90ᵉ percentile de chaque note dans la sélection.
          </div>
        )}
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
