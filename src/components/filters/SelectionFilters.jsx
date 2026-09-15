import { BIG_FIVE } from '../../constante/leagues.js';
import { POSITION_OPTIONS } from '../../constante/players.js';
import MultiSelect from './MultiSelect.jsx';
import CategoryFilter from './CategoryFilter.jsx';

export default function SelectionFilters({ filters, leagueOptions, onFilterChange }) {
  return (
    <>
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
    </>
  );
}
