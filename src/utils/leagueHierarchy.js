import { median } from './median.js';
import { matchesSearch } from './searchText.js';

/** Les clubs restent rattachés à leur ligue, même si un nom existe ailleurs. */
export function leagueHierarchy(rows, query = '') {
  const leagues = new Map();
  for (const player of rows) {
    const league = player.League || 'Ligue non renseignée';
    const club = player.Team || 'Club non renseigné';
    if (!leagues.has(league)) leagues.set(league, new Map());
    const clubs = leagues.get(league);
    if (!clubs.has(club)) clubs.set(club, []);
    clubs.get(club).push(player);
  }
  return [...leagues]
    .map(([name, clubs]) => ({
      name,
      medianOvr: median([...clubs.values()].flat(), 'OVR'),
      genders: ['F', 'M'].filter((gender) =>
        [...clubs.values()].some((players) =>
          players.some((player) => player.gender === gender),
        ),
      ),
      clubs: [...clubs]
        .map(([name, players]) => ({
          name,
          count: players.length,
          players: [...players].sort((a, b) => a.Name.localeCompare(b.Name, 'fr')),
        }))
        .filter((club) => matchesSearch(`${name} ${club.name}`, query))
        .sort((a, b) => a.name.localeCompare(b.name, 'fr')),
    }))
    .filter((league) => league.clubs.length)
    .sort(
      (a, b) =>
        (b.medianOvr ?? -1) - (a.medianOvr ?? -1) || a.name.localeCompare(b.name, 'fr'),
    );
}
