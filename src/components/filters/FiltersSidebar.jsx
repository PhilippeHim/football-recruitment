import { BIG_FIVE } from '../../constante/leagues.js';
import { POSITION_OPTIONS } from '../../constante/players.js';
import { NUMERIC_FILTERS } from '../../constante/filters.js';
import MultiSelect from './MultiSelect.jsx';
import ScoreSlider from './ScoreSlider.jsx';
import ActiveProfileBadge from './ActiveProfileBadge.jsx';
import CategoryFilter from './CategoryFilter.jsx';
import BigFiveFilter from './BigFiveFilter.jsx';
import PlayerSearch from './PlayerSearch.jsx';
import PositionPresets from './PositionPresets.jsx';
import RoleCriteria from './RoleCriteria.jsx';

export default function FiltersSidebar({
  filters,
  leagueOptions,
  onFilterChange,
  onToggleBigFive,
  onReset,
  onApplyPositionPreset,
  onRoleMinimumChange,
  onRemoveRole,
}) {
  return (
    <aside className="sidebar" aria-label="Filtres de recrutement">
      <div className="side-title">
        <h2>Votre recherche</h2>
        <button className="text-button" onClick={onReset}>
          Réinitialiser
        </button>
      </div>
      <p className="side-intro">Définissez le profil qui manque à votre équipe.</p>
      <a className="role-shortcut" href="#/profils">
        Choisir un profil métier →
      </a>
      <PlayerSearch
        value={filters.query}
        onChange={(value) => onFilterChange('query', value)}
      />
      <ActiveProfileBadge filters={filters} />
      <PositionPresets onApply={onApplyPositionPreset} />
      <RoleCriteria
        filters={filters}
        onChange={onRoleMinimumChange}
        onRemove={onRemoveRole}
      />
      <div className="filter-group">
        <span className="eyebrow">TERRAIN DE RECHERCHE</span>
        <MultiSelect
          label="Championnats"
          options={leagueOptions}
          selected={filters.leagues}
          disabledValues={filters.excludeBigFive ? BIG_FIVE : []}
          onChange={(value) => onFilterChange('leagues', value)}
        />
        <MultiSelect
          label="Postes principaux"
          options={POSITION_OPTIONS}
          selected={filters.positions}
          onChange={(value) => onFilterChange('positions', value)}
        />
        <CategoryFilter
          value={filters.gender}
          onChange={(value) => onFilterChange('gender', value)}
        />
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
