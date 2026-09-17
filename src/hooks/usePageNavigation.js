import { useEffect, useState } from 'react';
import { PAGES } from '../constante/navigation.js';

function readPage() {
  const requested = decodeURIComponent(window.location.hash)
    .replace(/^#\/?/, '')
    .split('?')[0];
  return PAGES.some((page) => page.id === requested) ? requested : 'accueil';
}

function hasValidPageHash() {
  const requested = decodeURIComponent(window.location.hash)
    .replace(/^#\/?/, '')
    .split('?')[0];
  return PAGES.some((page) => page.id === requested);
}

/** Des URL avec fragment permettent navigation, liens directs et retour navigateur sans serveur de routes. */
export function usePageNavigation() {
  const [page, setPage] = useState(readPage);

  useEffect(() => {
    function syncPage() {
      const next = readPage();
      if (!hasValidPageHash()) {
        window.history.replaceState(
          null,
          '',
          `${window.location.pathname}${window.location.search}#/${next}`,
        );
      }
      setPage(next);
    }
    syncPage();
    window.addEventListener('hashchange', syncPage);
    return () => window.removeEventListener('hashchange', syncPage);
  }, []);

  useEffect(() => {
    document.title = `${PAGES.find((item) => item.id === page).title} — Terrain`;
    document.getElementById('main')?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [page]);

  return page;
}
