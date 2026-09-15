import { COMPARISON_STATS } from '../constante/comparison.js';

/** Données communes au radar et au tableau : notes brutes, jamais normalisées par joueur. */
export function comparePlayers(players) {
  return COMPARISON_STATS.map(({ key, label }) => {
    const values = players.map((player) => player[key]);
    const maximum = values.length ? Math.max(...values) : null;
    const minimum = values.length ? Math.min(...values) : null;
    return {
      key,
      label,
      values,
      maximum,
      gap: values.length ? maximum - minimum : 0,
      ...Object.fromEntries(values.map((value, index) => [`player${index}`, value])),
    };
  });
}
