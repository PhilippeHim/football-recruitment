import { BIG_FIVE } from '../constante/leagues.js';
import { COMPARISON_STATS } from '../constante/comparison.js';

export const LEAGUE_RADAR_STATS = ['PAC', 'DRI', 'SHO', 'PAS', 'DEF', 'PHY', 'OVR'].map(
  (key) =>
    key === 'OVR'
      ? { key, label: 'Note globale' }
      : COMPARISON_STATS.find((stat) => stat.key === key),
);

/** Priorité éditoriale indicative ; les autres ligues sont classées par nom. */
export function leagueRadarProfiles(rows) {
  const groups = new Map();
  for (const player of rows) {
    if (!player.League || player.Position === 'GK') continue;
    if (!groups.has(player.League)) groups.set(player.League, []);
    groups.get(player.League).push(player);
  }
  const rank = (name) =>
    BIG_FIVE.includes(name) ? BIG_FIVE.indexOf(name) : BIG_FIVE.length;
  return [...groups]
    .map(([name, players]) => ({
      name,
      count: players.length,
      scores: Object.fromEntries(
        LEAGUE_RADAR_STATS.map(({ key }) => {
          const values = players.map((p) => p[key]).filter(Number.isFinite);
          return [
            key,
            values.length
              ? values.reduce((sum, value) => sum + value, 0) / values.length
              : null,
          ];
        }),
      ),
    }))
    .sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name, 'fr'));
}
