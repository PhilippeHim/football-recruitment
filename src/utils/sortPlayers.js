// Copie avant tri pour ne pas modifier la sélection utilisée par les graphiques.
export function sortPlayers(rows, key = 'OVR', direction = 'desc') {
  return [...rows].sort((a, b) => {
    const compared =
      typeof a[key] === 'number' ? a[key] - b[key] : a[key].localeCompare(b[key], 'fr');
    return (
      (direction === 'asc' ? compared : -compared) ||
      a.Name.localeCompare(b.Name, 'fr') ||
      a.id - b.id
    );
  });
}
