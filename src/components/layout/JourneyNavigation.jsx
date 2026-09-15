import { PAGES } from '../../constante/navigation.js';

export default function JourneyNavigation({ activePage, comparisonCount }) {
  return (
    <nav className="journey-navigation" aria-label="Parcours de recrutement">
      {PAGES.map((page) => (
        <a
          key={page.id}
          href={`#/${page.id}`}
          aria-current={activePage === page.id ? 'page' : undefined}
        >
          <span className="journey-step">{page.step}</span>
          <span>
            <strong>
              {page.title}
              {page.id === 'comparaison' && (
                <span className="journey-count">{comparisonCount}/3</span>
              )}
            </strong>
            <small>{page.description}</small>
          </span>
        </a>
      ))}
    </nav>
  );
}
