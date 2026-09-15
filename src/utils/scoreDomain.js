import { SCORE_DOMAIN } from '../constante/charts.js';

/** Cadre les notes avec une marge de 5 points et des bornes arrondies. */
export function scoreDomain(rows, key) {
  let min = Infinity;
  let max = -Infinity;
  for (const row of rows) {
    if (!Number.isFinite(row[key])) continue;
    min = Math.min(min, row[key]);
    max = Math.max(max, row[key]);
  }
  if (min === Infinity) return [...SCORE_DOMAIN];
  return [
    Math.max(SCORE_DOMAIN[0], Math.floor((min - 5) / 5) * 5),
    Math.min(SCORE_DOMAIN[1], Math.ceil((max + 5) / 5) * 5),
  ];
}
