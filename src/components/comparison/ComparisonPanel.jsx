import { price } from '../../constante/mercato.js';
import { COMPARISON_COLORS } from '../../constante/comparison.js';
import { comparePlayers } from '../../utils/comparePlayers.js';
import ComparisonRadar from './ComparisonRadar.jsx';
import ComparisonValues from './ComparisonValues.jsx';

export default function ComparisonPanel({ players, filteredRows, onRemove, onClear }) {
  const stats = comparePlayers(players);
  const largestGap = stats.reduce(
    (largest, stat) => (stat.gap > largest.gap ? stat : largest),
    stats[0],
  );
  const visibleIds = new Set(filteredRows.map((player) => player.id));

  return (
    <section
      id="player-comparison"
      className="card player-comparison"
      tabIndex={-1}
      aria-labelledby="comparison-title"
    >
      <div className="table-title">
        <div>
          <span className="eyebrow">COMPARER / DÉCIDER</span>
          <h2 id="comparison-title">Quel profil pour votre équipe ?</h2>
        </div>
        <button onClick={onClear}>Vider la comparaison</button>
      </div>
      <p>
        À niveau global proche, les qualités peuvent différer. Comparez la forme des
        profils, puis les notes exactes selon le poste recherché.
      </p>
      <div className="comparison-player-cards">
        {players.map((player, index) => (
          <article
            key={player.id}
            className="comparison-player"
            style={{ borderTopColor: COMPARISON_COLORS[index] }}
          >
            <div>
              <strong style={{ color: COMPARISON_COLORS[index] }}>
                {index + 1}. {player.Name}
              </strong>
              <button
                onClick={() => onRemove(player.id)}
                aria-label={`Retirer ${player.Name} de la comparaison`}
              >
                ×
              </button>
            </div>
            <span>
              {player.Position} · {player.Age} ans · OVR {player.OVR}
            </span>
            <small>
              {player.Team} · {player.League}
            </small>
            <span
              className={price(player) === null ? 'market-value-unavailable' : undefined}
            >
              Valeur marchande :{' '}
              {price(player) === null
                ? 'Non disponible'
                : `${(price(player) / 1000000).toLocaleString('fr-FR', { maximumFractionDigits: 3 })} M€`}
            </span>
            {!visibleIds.has(player.id) && (
              <span className="outside-filters">
                Hors des filtres actuels · conservé pour comparer
              </span>
            )}
          </article>
        ))}
      </div>
      {players.length < 2 ? (
        <div className="comparison-placeholder">
          <strong>Un premier profil retenu.</strong>
          <p>
            Cochez encore un joueur dans le tableau pour faire apparaître le radar et
            identifier leurs différences.
          </p>
          <a href="#/recherche">Choisir un deuxième joueur →</a>
        </div>
      ) : (
        <>
          <div className="radar-layout">
            <ComparisonRadar players={players} stats={stats} />
            <div className="comparison-reading">
              <span className="eyebrow">CE QUI LES DISTINGUE</span>
              <h3>
                {largestGap.gap > 0
                  ? `${largestGap.label} : ${largestGap.gap} points d’écart`
                  : 'Des notes identiques sur les six qualités'}
              </h3>
              <p>
                {largestGap.gap > 0
                  ? 'C’est le plus grand écart observé entre ces profils. Consultez les valeurs ci-dessous pour choisir selon vos besoins.'
                  : 'Le poste, l’âge et le contexte du joueur peuvent aider à affiner le choix.'}
              </p>
              <p>
                Plus la courbe s’éloigne du centre, plus la note est élevée. Les six axes
                gardent la même échelle de 0 à 100.
              </p>
              <small>
                Les couleurs et les tracés distinguent les joueurs dans l’ordre des
                cartes. Une plus grande surface ne désigne pas automatiquement le meilleur
                recrutement.
              </small>
            </div>
          </div>
          <ComparisonValues players={players} stats={stats} />
        </>
      )}
    </section>
  );
}
