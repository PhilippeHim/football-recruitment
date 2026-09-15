import MetricsPanel from '../components/metrics/MetricsPanel.jsx';
import PlayerTable from '../components/table/PlayerTable.jsx';
import EmptyState from '../components/feedback/EmptyState.jsx';
import ActiveRoleSummary from '../components/profiles/ActiveRoleSummary.jsx';

export default function SearchPage({
  rows,
  totalCount,
  comparison,
  tableState,
  onReset,
  filters,
}) {
  return (
    <>
      <ActiveRoleSummary filters={filters} count={rows.length} />
      <MetricsPanel rows={rows} totalCount={totalCount} />
      <div className="page-next">
        <p>Filtrez les profils, puis cochez jusqu’à trois joueurs pour les comparer.</p>
        <a href="#/analyse">Explorer cette sélection →</a>
      </div>
      {rows.length > 0 ? (
        <PlayerTable
          rows={rows}
          comparisonPlayers={comparison.players}
          onTogglePlayer={comparison.togglePlayer}
          tableState={tableState}
          roleMinimums={filters.minimums}
        />
      ) : (
        <EmptyState onReset={onReset} />
      )}
    </>
  );
}
