// Quartiles par interpolation linéaire entre deux notes consécutives.
function quantile(values, fraction) {
  const index = (values.length - 1) * fraction;
  const lower = Math.floor(index);
  return values[lower] + (values[Math.ceil(index)] - values[lower]) * (index - lower);
}

export function leagueBoxplots(rows) {
  const groups = new Map();
  for (const player of rows) {
    if (!player.League || !Number.isFinite(player.OVR)) continue;
    if (!groups.has(player.League)) groups.set(player.League, []);
    groups.get(player.League).push(player.OVR);
  }
  return [...groups]
    .map(([name, values]) => {
      values.sort((a, b) => a - b);
      const q1 = quantile(values, 0.25);
      const median = quantile(values, 0.5);
      const q3 = quantile(values, 0.75);
      const spread = 1.5 * (q3 - q1);
      const regular = values.filter(
        (value) => value >= q1 - spread && value <= q3 + spread,
      );
      return {
        name,
        count: values.length,
        mean: values.reduce((sum, value) => sum + value, 0) / values.length,
        q1,
        median,
        q3,
        low: regular[0],
        high: regular[regular.length - 1],
        outliers: values.filter((value) => value < q1 - spread || value > q3 + spread),
        min: values[0],
        max: values[values.length - 1],
      };
    })
    .sort((a, b) => b.median - a.median || a.name.localeCompare(b.name, 'fr'));
}

/** Références calculées sur les joueurs représentés, sans moyenner les ligues. */
export function globalOvrQuartiles(rows) {
  const values = rows
    .filter((player) => player.League && Number.isFinite(player.OVR))
    .map((player) => player.OVR)
    .sort((a, b) => a - b);
  if (!values.length) return null;
  return {
    q1: quantile(values, 0.25),
    median: quantile(values, 0.5),
    q3: quantile(values, 0.75),
  };
}
