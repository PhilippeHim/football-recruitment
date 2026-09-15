import { useState } from 'react';
import { MAX_COMPARISON_PLAYERS } from '../constante/comparison.js';

/** Conserve les profils choisis pendant les changements de filtre, de tri et de page. */
export function useComparison() {
  const [players, setPlayers] = useState([]);

  function togglePlayer(player) {
    setPlayers((current) => {
      if (current.some((item) => item.id === player.id)) {
        return current.filter((item) => item.id !== player.id);
      }
      if (current.length === MAX_COMPARISON_PLAYERS || player.Position === 'GK')
        return current;
      return [...current, player];
    });
  }

  function removePlayer(id) {
    setPlayers((current) => current.filter((player) => player.id !== id));
  }

  function clearComparison() {
    setPlayers([]);
  }

  return { players, togglePlayer, removePlayer, clearComparison };
}
