import { TABLE_COLUMNS } from '../../constante/table.js';

export default function PlayerTableHead({ sort, onSort, columns = TABLE_COLUMNS }) {
  return (
    <thead>
      <tr>
        <th scope="col">Comparer</th>
        {columns.map((column) => {
          const isSorted = sort.key === column.key;
          const ariaSort = isSorted
            ? sort.direction === 'asc'
              ? 'ascending'
              : 'descending'
            : 'none';
          const arrow = isSorted ? (sort.direction === 'asc' ? '↑' : '↓') : '↕';
          return (
            <th key={column.key} aria-sort={ariaSort}>
              {column.sortable === false ? (
                <span className="static-column-label">{column.label}</span>
              ) : (
                <button onClick={() => onSort(column.key)}>
                  {column.label} <span>{arrow}</span>
                </button>
              )}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
