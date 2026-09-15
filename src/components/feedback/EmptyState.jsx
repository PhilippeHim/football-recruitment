export default function EmptyState({ onReset }) {
  return (
    <div className="state">
      <span className="empty-icon">⌕</span>
      <h2>Aucun profil ne correspond</h2>
      <p>
        Vérifiez le nom du joueur ou du club, effacez la recherche ou élargissez les
        filtres de notes, championnats et postes.
      </p>
      <button onClick={onReset}>Afficher tous les joueurs</button>
    </div>
  );
}
