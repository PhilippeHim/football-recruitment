/** Compte les profils par ligue, puis classe les ligues par effectif décroissant. */
export function leagueCounts(rows) {
  const counts = new Map();

  for (const player of rows) {
    const previousCount = counts.get(player.League) || 0;
    counts.set(player.League, previousCount + 1);
  }

  return [...counts]
    .map(([league, count]) => ({ league, count }))
    .sort((a, b) => b.count - a.count || a.league.localeCompare(b.league));
}
