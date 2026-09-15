import ComparisonPanel from '../components/comparison/ComparisonPanel.jsx';

export default function ComparisonPage({ comparison, filteredRows }) {
  return (
    <>
      <div className="page-next">
        <p>Vos profils restent disponibles lorsque vous changez de page ou de filtres.</p>
        <a href="#/recherche">← Choisir d’autres joueurs</a>
      </div>
      {comparison.players.length > 0 ? (
        <ComparisonPanel
          players={comparison.players}
          filteredRows={filteredRows}
          onRemove={comparison.removePlayer}
          onClear={comparison.clearComparison}
        />
      ) : (
        <section className="comparison-welcome card">
          <span className="eyebrow">VOTRE LISTE EST PRÊTE À ÊTRE CRÉÉE</span>
          <h2>Quels profils souhaitez-vous comparer ?</h2>
          <p>
            Retenez deux ou trois joueurs dans la page Rechercher. Vous retrouverez ici
            leur radar, leurs notes détaillées et les écarts qui les distinguent.
          </p>
          <ol>
            <li>Définissez le poste et les qualités recherchées.</li>
            <li>Cochez « Comparer » à côté des joueurs retenus.</li>
            <li>Revenez ici pour confronter leurs profils.</li>
          </ol>
          <a className="action-link" href="#/recherche">
            Rechercher des joueurs →
          </a>
        </section>
      )}
    </>
  );
}
