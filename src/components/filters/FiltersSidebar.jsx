import SelectionFilters from './SelectionFilters.jsx';
import { NUMERIC_FILTERS } from '../../constante/filters.js';
import ScoreSlider from './ScoreSlider.jsx';
import ActiveProfileBadge from './ActiveProfileBadge.jsx';
import BigFiveFilter from './BigFiveFilter.jsx';
import RoleCriteria from './RoleCriteria.jsx';

export default function FiltersSidebar({
  hideSelectionFilters = false,
  filters,
  leagueOptions,
  onFilterChange,
  onToggleBigFive,
  onReset,
  onRoleMinimumChange,
  onRemoveRole,
}) {
  return (
    <aside className="sidebar" aria-label="Filtres de recrutement">
      <div className="side-title">
        <button className="text-button" onClick={onReset}>
          Réinitialiser
        </button>
      </div>
      <ActiveProfileBadge filters={filters} />
      <RoleCriteria
        filters={filters}
        onChange={onRoleMinimumChange}
        onRemove={onRemoveRole}
      />
      <div className="filter-group">
        <span className="eyebrow">TERRAIN DE RECHERCHE</span>
        {!hideSelectionFilters && (
          <SelectionFilters
            filters={filters}
            leagueOptions={leagueOptions}
            onFilterChange={onFilterChange}
          />
        )}
        <BigFiveFilter checked={filters.excludeBigFive} onChange={onToggleBigFive} />
      </div>
      <div className="filter-group">
        <span className="eyebrow">NOTES MINIMALES</span>
        {NUMERIC_FILTERS.map((filter) => (
          <ScoreSlider
            key={filter.key}
            short={filter.short}
            label={filter.label}
            value={filters[filter.key]}
            onChange={(value) => onFilterChange(filter.key, value)}
          />
        ))}
      </div>
      <div className="side-note">
        Tous les graphiques et le tableau suivent vos filtres. Les postes secondaires ne
        sont pas inclus.
      </div>
    </aside>
  );
}
