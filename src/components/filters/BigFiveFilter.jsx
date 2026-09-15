import { BIG_FIVE } from '../../constante/leagues.js';

export default function BigFiveFilter({ checked, onChange }) {
  return (
    <>
      <label className="check">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span>Exclure les 5 grands championnats masculins</span>
      </label>
      <details className="definition">
        <summary>Quels championnats ?</summary>
        <p>{BIG_FIVE.join(', ')}.</p>
      </details>
    </>
  );
}
