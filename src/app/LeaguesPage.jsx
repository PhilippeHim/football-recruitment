import LeagueRadar from '../components/charts/LeagueRadar.jsx';
import LeagueBoxplot from '../components/charts/LeagueBoxplot.jsx';
import LeagueAnalytics from '../components/charts/LeagueAnalytics.jsx';
import { useEffect, useMemo, useState } from 'react';
import { leagueHierarchy } from '../utils/leagueHierarchy.js';
import LeagueBranch from '../components/layout/LeagueBranch.jsx';
import PlayerIdentity from '../components/players/PlayerIdentity.jsx';

function readLeagueTarget() {
  const [, queryString = ''] = window.location.hash.split('?');
  const params = new URLSearchParams(queryString);
  return {
    league: params.get('league') || '',
    club: params.get('club') || '',
  };
}

export default function LeaguesPage({ rows, mercato }) {
  const [query, setQuery] = useState('');
  const [gender, setGender] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [target, setTarget] = useState(readLeagueTarget);
  const leagues = useMemo(
    () =>
      leagueHierarchy(
        gender ? rows.filter((player) => player.gender === gender) : rows,
        query,
      ),
    [rows, query, gender],
  );
  useEffect(() => {
    function syncTarget() {
      setTarget(readLeagueTarget());
    }

    syncTarget();
    window.addEventListener('hashchange', syncTarget);
    return () => window.removeEventListener('hashchange', syncTarget);
  }, []);
  useEffect(() => {
    if (!target.league) return;
    setQuery('');
    setGender('');
  }, [target.league, target.club]);
  useEffect(() => {
    if (!target.league) return;

    let innerFrame = 0;
    const frame = requestAnimationFrame(() => {
      innerFrame = requestAnimationFrame(() => {
        const leagueElement = [...document.querySelectorAll('.league-branch')].find(
          (candidate) => candidate.dataset.league === target.league,
        );
        const clubElement =
          target.club && leagueElement
            ? [...leagueElement.querySelectorAll('.club-branch')].find(
                (candidate) => candidate.dataset.club === target.club,
              )
            : null;
        (clubElement || leagueElement)?.scrollIntoView({ block: 'center' });
      });
    });
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(innerFrame);
    };
  }, [leagues, target.league, target.club]);
  return (
    <section className="league-directory" aria-label="Organigramme des ligues et clubs">
      {selectedPlayer && (
        <PlayerIdentity
          player={selectedPlayer}
          mercato={mercato}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
      <LeagueAnalytics rows={rows} />
      <LeagueBoxplot rows={rows} />
      <LeagueRadar rows={rows} />
      <div className="league-directory-tools">
        <label htmlFor="league-search">Rechercher une ligue ou un club</label>
        <input
          id="league-search"
          type="search"
          value={query}
          placeholder="Ex. Premier League, Real Madrid…"
          onChange={(event) => setQuery(event.target.value)}
        />
        <p>
          Les ligues sont classées par OVR médian décroissant. Dépliez une ligue, puis un
          club pour découvrir ses joueurs, leur poste et leur note globale. Les effectifs
          suivent la catégorie choisie dans la barre du vivier, indépendamment des filtres
          de recrutement.
        </p>
      </div>
      <div className="hierarchy-root">
        <span role="status">
          Vivier · {leagues.length} ligues ·{' '}
          {leagues.reduce((sum, league) => sum + league.clubs.length, 0)} clubs affichés
        </span>
        <select
          aria-label="Catégorie du vivier"
          value={gender}
          onChange={(event) => setGender(event.target.value)}
        >
          <option value="">Hommes et femmes</option>
          <option value="M">Hommes</option>
          <option value="F">Femmes</option>
        </select>
      </div>
      {leagues.length ? (
        <div className="league-tree">
          {leagues.map((league) => (
            <LeagueBranch
              key={`${query}:${league.name}`}
              league={league}
              expanded={Boolean(query.trim()) || league.name === target.league}
              targetClub={league.name === target.league ? target.club : ''}
              onSelectPlayer={setSelectedPlayer}
            />
          ))}
        </div>
      ) : (
        <p className="league-empty">
          Aucune ligue ni aucun club ne correspond à cette recherche.
        </p>
      )}
    </section>
  );
}
