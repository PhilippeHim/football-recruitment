import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_SORT, PAGE_SIZE } from '../constante/table.js';
import { sortPlayers } from '../utils/sortPlayers.js';
import { matchesSearch } from '../utils/searchText.js';

/** Le tri porte sur toute la sélection, puis on extrait la page à afficher. */
export function usePlayerTable(rows, filtersKey) {
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState('');
  // Changer les filtres réinitialise le tableau ; naviguer entre pages le conserve.
  useEffect(() => {
    setSort(DEFAULT_SORT);
    setPage(0);
    setQuery('');
  }, [filtersKey]);
  // Chercher dans toute la sélection avant de trier et de paginer.
  const matchingPlayers = useMemo(
    () => rows.filter((player) => matchesSearch(`${player.Name} ${player.Team}`, query)),
    [rows, query],
  );
  const sortedPlayers = useMemo(
    () => sortPlayers(matchingPlayers, sort.key, sort.direction),
    [matchingPlayers, sort],
  );
  const pageCount = Math.max(1, Math.ceil(matchingPlayers.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const firstIndex = currentPage * PAGE_SIZE;
  const visiblePlayers = sortedPlayers.slice(firstIndex, firstIndex + PAGE_SIZE);

  function changeSort(key) {
    const direction = sort.key === key && sort.direction === 'desc' ? 'asc' : 'desc';
    setSort({ key, direction });
    setPage(0);
  }
  function changeQuery(value) {
    setQuery(value);
    setPage(0);
  }
  return {
    query,
    changeQuery,
    matchingCount: matchingPlayers.length,
    sort,
    changeSort,
    currentPage,
    pageCount,
    setPage,
    visiblePlayers,
  };
}
