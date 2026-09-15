import { useEffect, useState } from 'react';
import { loadPlayers } from '../services/loadPlayers.js';

/** Expose les trois états du chargement : attente, données, erreur. */
export function usePlayers() {
  const [state, setState] = useState({ rows: [], loading: true, error: '' });
  useEffect(() => {
    const controller = new AbortController();
    loadPlayers(controller.signal)
      .then((rows) => setState({ rows, loading: false, error: '' }))
      .catch((error) => {
        if (error.name !== 'AbortError')
          setState({ rows: [], loading: false, error: error.message });
      });
    return () => controller.abort();
  }, []);
  return state;
}
