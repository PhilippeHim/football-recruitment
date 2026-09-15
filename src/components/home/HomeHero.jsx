export default function HomeHero() {
  return (
    <section className="home-hero">
      <span className="eyebrow">FOOTBALL · EXPLORATION DE DONNÉES</span>
      <h1>
        Un besoin sur le terrain.
        <br />
        <em>Des profils à comparer.</em>
      </h1>
      <p>
        Terrain vous aide à préparer une présélection de joueurs : définissez le rôle
        recherché, trouvez les profils qui répondent à vos critères et comparez leurs
        qualités.
      </p>
      <div className="home-actions">
        <a className="action-link home-primary" href="#/profils">
          Définir mon besoin →
        </a>
        <a className="action-link" href="#/recherche">
          Je cherche déjà un joueur
        </a>
      </div>
      <small>
        Un projet pédagogique fondé sur les notes EA Sports FC, pour apprendre à
        argumenter une sélection à partir de données.
      </small>
    </section>
  );
}
