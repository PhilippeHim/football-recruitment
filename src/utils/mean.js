/** Renvoie null quand aucune moyenne ne peut être calculée. */
export function mean(rows, key) {
  if (rows.length === 0) return null;

  const total = rows.reduce((sum, player) => sum + player[key], 0);
  return total / rows.length;
}
