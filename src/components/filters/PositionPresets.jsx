import { useId, useState } from 'react';
import { POSITION_OVR_MIN, POSITION_PRESETS } from '../../constante/positionPresets.js';

export default function PositionPresets({ onApply }) {
  const [code, setCode] = useState(POSITION_PRESETS[0].code);
  const id = useId();
  return (
    <div className="position-presets">
      <label className="select-label" htmlFor={id}>
        Profil prédéfini par poste
      </label>
      <select id={id} value={code} onChange={(event) => setCode(event.target.value)}>
        {POSITION_PRESETS.map((preset) => (
          <option key={preset.code} value={preset.code}>
            {preset.code} · {preset.label}
          </option>
        ))}
      </select>
      <button onClick={() => onApply(code)}>Appliquer ce profil</button>
      <small>
        Affiche ce poste principal avec OVR ≥ {POSITION_OVR_MIN}, tous championnats. Ce
        seuil indicatif est ajustable avec le curseur OVR. Réinitialise les autres
        filtres.
      </small>
    </div>
  );
}
