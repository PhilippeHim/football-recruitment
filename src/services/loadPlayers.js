import { DATASET_FILENAME } from '../constante/players.js';
import { parsePlayers } from './parsePlayers.js';

/** Le signal permet d’annuler la requête quand le composant est démonté. */
export async function loadPlayers(signal) {
  const response = await fetch(`${import.meta.env.BASE_URL}${DATASET_FILENAME}`, {
    signal,
  });
  if (!response.ok) throw new Error('Impossible de charger le fichier des joueurs.');
  return parsePlayers(await response.text());
}
