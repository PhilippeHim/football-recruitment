import PaceDribbleChart from './PaceDribbleChart.jsx';
import OvrHistogram from './OvrHistogram.jsx';
import LeagueComparisonChart from './LeagueComparisonChart.jsx';

export default function ChartsPanel({ rows }) {
  return (
    <div className="charts">
      <PaceDribbleChart rows={rows} />
      <OvrHistogram rows={rows} />
      <LeagueComparisonChart rows={rows} />
    </div>
  );
}
