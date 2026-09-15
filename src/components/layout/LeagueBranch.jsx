import ClubBranch from './ClubBranch.jsx';

export default function LeagueBranch({ league, expanded, onSelectPlayer }) {
  return (
    <details className="league-branch" open={expanded || undefined}>
      <summary>
        <strong>{league.name}</strong>
        {league.genders.map((gender) => (
          <img
            key={gender}
            className="league-gender-icon"
            src={`${import.meta.env.BASE_URL}${gender === 'F' ? 'female' : 'male'}.png`}
            alt={gender === 'F' ? 'Femmes' : 'Hommes'}
            title={gender === 'F' ? 'Ligue féminine' : 'Ligue masculine'}
            width="24"
            height="24"
          />
        ))}
        <span>
          {league.clubs.length} clubs ·{' '}
          {league.clubs.reduce((sum, club) => sum + club.count, 0)} joueurs
        </span>
      </summary>
      <ul className="club-branches">
        {league.clubs.map((club) => (
          <li key={club.name}>
            <ClubBranch club={club} onSelectPlayer={onSelectPlayer} />
          </li>
        ))}
      </ul>
    </details>
  );
}
