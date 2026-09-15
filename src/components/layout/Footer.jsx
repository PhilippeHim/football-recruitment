import { DATASET_FILENAME } from '../../constante/players.js';

export default function Footer() {
  return (
    <footer>
      Source : {DATASET_FILENAME} · Les effectifs reflètent ce fichier, pas l’intégralité
      du marché.
    </footer>
  );
}
