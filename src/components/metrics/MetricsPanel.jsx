import { mean } from '../../utils/mean.js';
import { formatCount, formatMean } from '../../utils/formatNumber.js';
import { filterScope } from '../../utils/filterScope.js';
import MetricCard from './MetricCard.jsx';

export default function MetricsPanel({ rows, totalCount, filters }) {
  return (
    <div className="metrics">
      <MetricCard
        label="Profils retenus"
        value={`${formatCount(rows.length)}/${formatCount(totalCount)} joueurs`}
        description={filterScope(filters)}
        primary
      />
      <MetricCard
        label="OVR moyen"
        value={formatMean(mean(rows, 'OVR'))}
        description="Note globale / 99"
      />
      <MetricCard
        label="PAC moyen"
        value={formatMean(mean(rows, 'PAC'))}
        description="Vitesse / 99"
      />
      <MetricCard
        label="DRI moyen"
        value={formatMean(mean(rows, 'DRI'))}
        description="Dribble / 99"
      />
    </div>
  );
}
