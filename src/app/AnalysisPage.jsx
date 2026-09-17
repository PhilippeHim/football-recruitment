import ChartsPanel from '../components/charts/ChartsPanel.jsx';
import MetricsPanel from '../components/metrics/MetricsPanel.jsx';
import EmptyState from '../components/feedback/EmptyState.jsx';

export default function AnalysisPage({ rows, totalCount, filters, onReset }) {
  return (
    <>
      <MetricsPanel rows={rows} totalCount={totalCount} filters={filters} />
      <div className="page-next">
        <a href="#/recherche">Retrouver les joueurs →</a>
      </div>
      {rows.length > 0 ? <ChartsPanel rows={rows} /> : <EmptyState onReset={onReset} />}
    </>
  );
}
