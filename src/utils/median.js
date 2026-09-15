/** Calcule la médiane des valeurs valides sans modifier l’ordre des joueurs. */
export function median(rows, key) {
  const values = rows.map((player) => player[key]).filter(Number.isFinite);
  if (values.length === 0) return null;

  values.sort((a, b) => a - b);
  const middle = Math.floor(values.length / 2);
  return values.length % 2 === 0
    ? (values[middle - 1] + values[middle]) / 2
    : values[middle];
}
