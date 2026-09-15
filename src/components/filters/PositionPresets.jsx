import { useId } from 'react';
import { POSITION_PRESETS } from '../../constante/positionPresets.js';

export default function PositionPresets({ onApply, onReset, presetId }) {
  const id = useId();
  const code =
    POSITION_PRESETS.find((preset) => `position:${preset.code}` === presetId)?.code || '';
  return (
    <div className="position-presets">
      <label className="sr-only" htmlFor={id}>
        Profil prédéfini par poste
      </label>
      <div className="position-presets-controls">
        <select id={id} value={code} onChange={(event) => onApply(event.target.value)}>
          <option value="" disabled>
            Choisir un profil par poste
          </option>
          {POSITION_PRESETS.map((preset) => (
            <option key={preset.code} value={preset.code}>
              {preset.code} · {preset.label}
            </option>
          ))}
        </select>
        <button onClick={onReset}>Initialiser</button>
      </div>
    </div>
  );
}
