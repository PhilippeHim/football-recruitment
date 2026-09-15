/** Une valeur absente n'est pas assimilée à une estimation de zéro euro. */
export function marketValue(value) {
  if (value == null || String(value).trim() === '') return 'Non renseignée';
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0) return 'Non renseignée';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
}
