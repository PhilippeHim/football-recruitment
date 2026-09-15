const HEADINGS = {
  mercato: {
    eyebrow: 'LE DÉFI DU RECRUTEUR',
    title: 'Votre budget. Votre onze.',
    description:
      'Construisez votre vivier, composez votre équipe et relevez vos objectifs.',
  },
  ligues: {
    eyebrow: 'EXPLORER LE VIVIER',
    title: 'Des ligues aux clubs.',
    description: 'Un organigramme pour repérer les championnats et leurs effectifs.',
  },
  profils: {
    eyebrow: '01 / DÉFINIR LE BESOIN',
    title: 'Quel rôle pour votre équipe ?',
    description:
      'Huit profils métier pour démarrer une recherche ciblée et compréhensible.',
  },
  recherche: {
    eyebrow: '02 / TROUVER LES BONS PROFILS',
    title: 'Votre prochain recrutement.',
    description:
      'Recherchez un joueur, affinez vos critères et retenez vos profils favoris.',
  },
  analyse: {
    eyebrow: '03 / COMPRENDRE LA SÉLECTION',
    title: 'Les qualités en perspective.',
    description: 'Explorez les niveaux, les tendances et les championnats représentés.',
  },
  comparaison: {
    eyebrow: '04 / COMPARER AVANT DE CHOISIR',
    title: 'Des profils, des différences.',
    description:
      'Une vue dédiée pour confronter les qualités de vos deux ou trois joueurs.',
  },
};

export default function PageHeading({ page }) {
  const heading = HEADINGS[page];
  return (
    <div className="page-heading journey-heading">
      <div>
        <span className="eyebrow">{heading.eyebrow}</span>
        <h1>{heading.title}</h1>
        <p>{heading.description}</p>
      </div>
    </div>
  );
}
