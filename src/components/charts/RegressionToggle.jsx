export default function RegressionToggle({ checked, onChange, available }) {
  return (
    <div>
      <label className="median-toggle">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        Afficher la droite de régression
      </label>
      {checked && !available && (
        <p role="status">
          La régression nécessite au moins deux joueurs avec des valeurs PAC différentes.
        </p>
      )}
    </div>
  );
}
