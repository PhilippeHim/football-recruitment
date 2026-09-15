import { price } from '../constante/mercato.js';

// Copie avant tri pour ne pas modifier la sélection utilisée par les graphiques.
export function sortPlayers(rows, key = 'OVR', direction = 'desc') {
  return [...rows].sort((a, b) => {
    if (key === 'market_value_in_eur') {
      const left = price(a);
      const right = price(b);
      // Les valeurs absentes restent en fin de tableau dans les deux sens.
      if (left === null && right !== null) return 1;
      if (right === null && left !== null) return -1;
      return (
        (direction === 'asc' ? 1 : -1) * ((left ?? 0) - (right ?? 0)) ||
        a.Name.localeCompare(b.Name, 'fr') ||
        a.id - b.id
      );
    }
    const compared =
      typeof a[key] === 'number' ? a[key] - b[key] : a[key].localeCompare(b[key], 'fr');
    return (
      (direction === 'asc' ? compared : -compared) ||
      a.Name.localeCompare(b.Name, 'fr') ||
      a.id - b.id
    );
  });
}
