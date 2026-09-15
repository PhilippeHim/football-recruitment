import { useMemo, useState } from 'react';
import { DEFAULT_FILTERS, RESET_FILTERS, WINGER_FILTERS } from '../constante/filters.js';
import { BIG_FIVE } from '../constante/leagues.js';
import { filterPlayers } from '../utils/filterPlayers.js';
import { createPositionFilters } from '../constante/positionPresets.js';
import { ROLE_PROFILES, createRoleFilters } from '../constante/roleProfiles.js';

/** Source unique des filtres et de la sélection pour toutes les vues. */
export function useRecruitment(rows) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const selectedPlayers = useMemo(() => filterPlayers(rows, filters), [rows, filters]);
  const leagueOptions = useMemo(() => {
    const leagues = [...new Set(rows.map((player) => player.League))];
    return leagues
      .sort((a, b) => a.localeCompare(b))
      .map((league) => ({ value: league, label: league }));
  }, [rows]);

  function updateFilter(key, value) {
    setFilters((current) =>
      key === 'positions' ? createPositionFilters(value) : { ...current, [key]: value },
    );
  }
  function toggleBigFive(excluded) {
    // Retirer les choix devenus interdits évite une combinaison de filtres contradictoire.
    setFilters((current) => ({
      ...current,
      excludeBigFive: excluded,
      leagues: excluded
        ? current.leagues.filter((league) => !BIG_FIVE.includes(league))
        : current.leagues,
    }));
  }
  function resetFilters() {
    setFilters(RESET_FILTERS);
  }
  function applyWingerPreset() {
    setFilters(WINGER_FILTERS);
    window.location.hash = '/recherche';
  }
  function applyRoleProfile(id) {
    const profile = ROLE_PROFILES.find((item) => item.id === id);
    if (profile) {
      setFilters(createRoleFilters(profile));
      window.location.hash = '/recherche';
    }
  }
  function updateRoleMinimum(key, value) {
    setFilters((current) => ({
      ...current,
      minimums: { ...current.minimums, [key]: value },
    }));
  }
  function removeRoleProfile() {
    setFilters((current) => ({ ...current, roleId: null, presetId: null, minimums: {} }));
  }

  return {
    filters,
    selectedPlayers,
    leagueOptions,
    updateFilter,
    toggleBigFive,
    resetFilters,
    applyWingerPreset,
    applyRoleProfile,
    updateRoleMinimum,
    removeRoleProfile,
  };
}
