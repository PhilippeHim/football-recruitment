import LeagueAnalytics from '../components/charts/LeagueAnalytics.jsx';
import { useMemo, useState } from 'react';
import { leagueHierarchy } from '../utils/leagueHierarchy.js';
import LeagueBranch from '../components/layout/LeagueBranch.jsx';
import PlayerIdentity from '../components/players/PlayerIdentity.jsx';

export default function LeaguesPage({ rows, mercato }) {
  const [query, setQuery] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const leagues = useMemo(() => leagueHierarchy(rows, query), [rows, query]);
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
          Dépliez une ligue, puis un club pour découvrir ses joueurs, leur poste et leur
          note globale. Les effectifs correspondent au dataset complet, indépendamment des
          filtres de recrutement.
        </p>
      </div>
      <div className="hierarchy-root" role="status">
        Vivier · {leagues.length} ligues ·{' '}
        {leagues.reduce((sum, league) => sum + league.clubs.length, 0)} clubs affichés
      </div>
      {leagues.length ? (
        <div className="league-tree">
          {leagues.map((league) => (
            <LeagueBranch
              key={`${query}:${league.name}`}
              league={league}
              expanded={Boolean(query.trim())}
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
