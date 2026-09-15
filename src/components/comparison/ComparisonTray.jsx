import { MAX_COMPARISON_PLAYERS } from '../../constante/comparison.js';

export default function ComparisonTray({ players, onRemove }) {
  return (
    <aside className="comparison-tray" aria-label="Joueurs à comparer">
      <div>
        <strong aria-live="polite">
          {players.length}/{MAX_COMPARISON_PLAYERS} profils
        </strong>
        <span>
          {players.length === 1 ? 'Ajoutez un deuxième joueur' : 'Prêts à comparer'}
        </span>
      </div>
      <div className="comparison-chips">
        {players.map((player) => (
          <button
            key={player.id}
            onClick={() => onRemove(player.id)}
            aria-label={`Enlever ${player.Name}`}
          >
            {player.Name} ×
          </button>
        ))}
      </div>
      <a className="open-comparison action-link" href="#/comparaison">
        Voir la comparaison →
      </a>
    </aside>
  );
}
