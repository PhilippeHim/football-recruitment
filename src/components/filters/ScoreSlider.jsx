import { NOTE_MIN, NOTE_MAX } from '../../constante/players.js';

export default function ScoreSlider({ short, label, value, onChange }) {
  return (
    <label className="slider">
      <span>
        <b>{short}</b> {label}
        <output>{value}</output>
      </span>
      <input
        aria-label={`${short || label} minimum`}
        type="range"
        min={NOTE_MIN}
        max={NOTE_MAX}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <span className="range-label">
        <small>{NOTE_MIN}</small>
        <small>{NOTE_MAX}</small>
      </span>
    </label>
  );
}
