import { PAGES } from '../../constante/navigation.js';

const OUTCOMES = {
  profils:
    'Traduisez une mission — relancer, récupérer, finir — en critères visibles et ajustables.',
  recherche:
    'Réduisez la liste par poste, qualités ou championnat. Retrouvez un joueur ou un club et retenez jusqu’à trois profils.',
  analyse:
    'Examinez la répartition des notes, les ligues représentées et les relations entre qualités.',
  comparaison:
    'Confrontez les joueurs retenus sur un radar et vérifiez les écarts dans le tableau de notes.',
};

export default function HomeJourney() {
  return (
    <section className="home-journey" aria-labelledby="home-journey-title">
      <span className="eyebrow">COMMENT L’UTILISER</span>
      <h2 id="home-journey-title">Un parcours pour construire votre choix</h2>
      <div className="home-steps">
        {PAGES.filter((page) => page.id !== 'accueil').map((page) => (
          <a key={page.id} href={`#/${page.id}`}>
            <span className="eyebrow">ÉTAPE {page.step}</span>
            <h3>{page.title} →</h3>
            <p>{OUTCOMES[page.id]}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
