import { useEffect, useState } from 'react';
import { playerKey } from '../constante/mercato.js';
const initial = {
  budget: 100000000,
  target: 80,
  youth: 3,
  shortlist: [],
  lineup: {},
  growth: 10,
  development: 1000000,
};
export function useMercato() {
  const [state, setState] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('terrain-mercato-v1'));
      return saved &&
        Array.isArray(saved.shortlist) &&
        saved.lineup &&
        typeof saved.lineup === 'object'
        ? { ...initial, ...saved }
        : initial;
    } catch {
      return initial;
    }
  });
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem('terrain-mercato-v1', JSON.stringify(state));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [state]);
  const update = (key, value) => setState((current) => ({ ...current, [key]: value }));
  function add(player) {
    const key = playerKey(player);
    setState((current) => ({
      ...current,
      shortlist: [...new Set([...current.shortlist, key])],
    }));
  }
  function remove(key) {
    setState((current) => ({
      ...current,
      shortlist: current.shortlist.filter((item) => item !== key),
      lineup: Object.fromEntries(
        Object.entries(current.lineup).filter(([, value]) => value !== key),
      ),
    }));
  }
  function assign(slot, key) {
    setState((current) =>
      current.shortlist.includes(key)
        ? {
            ...current,
            lineup: {
              ...Object.fromEntries(
                Object.entries(current.lineup).filter(([, value]) => value !== key),
              ),
              [slot]: key,
            },
          }
        : current,
    );
  }
  return { state, update, add, remove, assign, storageError };
}
