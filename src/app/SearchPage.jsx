import PositionPresets from '../components/filters/PositionPresets.jsx';
import { activeProfile } from '../utils/activeProfile.js';
import MetricsPanel from '../components/metrics/MetricsPanel.jsx';
import PlayerTable from '../components/table/PlayerTable.jsx';
import SelectionFilters from '../components/filters/SelectionFilters.jsx';
import ActiveRoleSummary from '../components/profiles/ActiveRoleSummary.jsx';

export default function SearchPage({
  rows,
  totalCount,
  comparison,
  tableState,
  filters,
  leagueOptions,
  onFilterChange,
  onApplyPositionPreset,
  onReset,
}) {
  return (
    <>
      <ActiveRoleSummary filters={filters} count={rows.length} />
      <MetricsPanel rows={rows} totalCount={totalCount} />
      <div className="page-next">
        <p>Filtrez les profils, puis cochez jusqu’à trois joueurs pour les comparer.</p>
        <a href="#/analyse">Explorer cette sélection →</a>
      </div>
      <PlayerTable
        profile={activeProfile(filters)}
        filters={
          <>
            <PositionPresets
              onApply={onApplyPositionPreset}
              onReset={onReset}
              presetId={filters.presetId}
            />
            <div
              className="table-selection-filters"
              role="group"
              aria-label="Filtres des résultats"
            >
              <SelectionFilters
                filters={filters}
                leagueOptions={leagueOptions}
                onFilterChange={onFilterChange}
              />
            </div>
          </>
        }
        rows={rows}
        comparisonPlayers={comparison.players}
        onTogglePlayer={comparison.togglePlayer}
        tableState={tableState}
        roleMinimums={filters.minimums}
      />
    </>
  );
}
