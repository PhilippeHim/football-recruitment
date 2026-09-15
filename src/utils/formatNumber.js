const integerFormatter = new Intl.NumberFormat('fr-FR');
const decimalFormatter = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 });
export function formatCount(value) {
  return integerFormatter.format(value);
}
// Une sélection vide s’affiche avec un tiret, jamais avec NaN.
export function formatMean(value) {
  return value === null ? '—' : decimalFormatter.format(value);
}
