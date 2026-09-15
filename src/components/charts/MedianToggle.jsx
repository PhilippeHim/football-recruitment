export default function MedianToggle({ checked, onChange, label }) {
  return (
    <label className="median-toggle">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        aria-label={label}
      />
      Afficher la médiane
    </label>
  );
}
