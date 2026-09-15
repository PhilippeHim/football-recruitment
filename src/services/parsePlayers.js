import Papa from 'papaparse';
import { NUMERIC_COLUMNS, REQUIRED_COLUMNS } from '../constante/players.js';
import { ROLE_STAT_LABELS } from '../constante/roleProfiles.js';

/** Nettoie et valide le CSV avant qu’il entre dans l’application. */
export function parsePlayers(csv) {
  const parsed = Papa.parse(csv, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (header) => header.trim(),
    transform: (value) => value.trim(),
  });
  const hasMissingColumns = REQUIRED_COLUMNS.some(
    (column) => !parsed.meta.fields?.includes(column),
  );
  if (hasMissingColumns)
    throw new Error('Le CSV ne contient pas toutes les colonnes attendues.');
  if (parsed.errors.length) throw new Error('Le CSV contient des lignes mal formées.');

  const rows = parsed.data.map((row, id) => {
    const numericValues = NUMERIC_COLUMNS.map((column) => [
      column,
      row[column] === '' ? NaN : Number(row[column]),
    ]);
    // Une statistique détaillée absente reste inconnue, elle ne vaut pas zéro.
    const roleValues = Object.keys(ROLE_STAT_LABELS)
      .filter((column) => !NUMERIC_COLUMNS.includes(column))
      .map((column) => [
        column,
        row[column] == null || row[column] === '' ? null : Number(row[column]),
      ]);
    return {
      ...row,
      id,
      ...Object.fromEntries(numericValues),
      ...Object.fromEntries(roleValues),
    };
  });
  const hasInvalidNumbers = rows.some((row) =>
    NUMERIC_COLUMNS.some((column) => !Number.isFinite(row[column])),
  );
  if (hasInvalidNumbers)
    throw new Error('Certaines notes ou certains âges sont manquants ou invalides.');
  return rows;
}
