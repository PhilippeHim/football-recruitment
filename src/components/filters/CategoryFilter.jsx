export default function CategoryFilter({ value, onChange }) {
  return (
    <label className="select-label">
      <span className="category-label">Catégorie</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Hommes et femmes</option>
        <option value="M">Hommes</option>
        <option value="F">Femmes</option>
      </select>
    </label>
  );
}
