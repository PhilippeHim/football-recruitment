export default function ErrorState({ message }) {
  return (
    <div className="state" role="alert">
      <h2>Chargement impossible</h2>
      <p>{message}</p>
      <button onClick={() => window.location.reload()}>Réessayer</button>
    </div>
  );
}
