import { useState } from 'react';
import { matchesSearch } from '../../utils/searchText.js';

/** Liste de cases à cocher avec recherche ; une sélection vide signifie « Tous ». */
export default function MultiSelect({
  label,
  options,
  selected,
  onChange,
  disabledValues = [],
  expandOptions = false,
}) {
  const [query, setQuery] = useState('');
  const visibleOptions = options.filter((option) => matchesSearch(option.label, query));

  function toggleOption(value, checked) {
    const nextSelection = checked
      ? [...selected, value]
      : selected.filter((item) => item !== value);
    onChange(nextSelection);
  }

  return (
    <details className={`multi${expandOptions ? ' multi-expanded-options' : ''}`}>
      <summary>
        {label}
        <span>{selected.length || 'Tous'} ▾</span>
      </summary>
      <div className="multi-body">
        <input
          aria-label={`Rechercher : ${label}`}
          placeholder="Rechercher…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button className="text-button" onClick={() => onChange([])}>
          Effacer la sélection
        </button>
        <div className="options">
          {visibleOptions.length === 0 && (
            <p role="status">Aucune option ne correspond à cette recherche.</p>
          )}
          {visibleOptions.map((option) => (
            <label key={option.value}>
              <input
                type="checkbox"
                checked={selected.includes(option.value)}
                disabled={disabledValues.includes(option.value)}
                onChange={(event) => toggleOption(option.value, event.target.checked)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>
    </details>
  );
}
