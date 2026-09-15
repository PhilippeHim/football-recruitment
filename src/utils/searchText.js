/** Recherche insensible aux accents, à la casse et à la ponctuation. */
export function normalizeSearch(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLocaleLowerCase('fr')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

export function matchesSearch(text, query) {
  const normalizedText = normalizeSearch(text);
  return normalizeSearch(query)
    .split(/\s+/)
    .every((word) => normalizedText.includes(word));
}
