/** Percentile par interpolation linéaire sur les notes valides triées. */
export function percentile(rows, key, fraction = 0.9) {
  const values = rows
    .map((row) => row[key])
    .filter(Number.isFinite)
    .sort((a, b) => a - b);
  if (!values.length) return null;
  const index = (values.length - 1) * fraction;
  const lower = Math.floor(index);
  return values[lower] + (values[Math.ceil(index)] - values[lower]) * (index - lower);
}
