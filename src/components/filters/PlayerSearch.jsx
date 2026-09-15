import { useId, useRef } from 'react';

export default function PlayerSearch({
  value,
  onChange,
  label = 'Joueur ou club',
  help = 'Recherche par nom ou club, combinée aux filtres actifs.',
}) {
  const id = useId();
  const input = useRef(null);
  function clear() {
    onChange('');
    input.current?.focus();
  }

  return (
    <div className="player-search" role="search" aria-label={label}>
      <label htmlFor={id}>{label}</label>
      <div className="search-field">
        <input
          ref={input}
          id={id}
          type="search"
          value={value}
          placeholder="Ex. Mbappé, Real Madrid…"
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') clear();
          }}
          aria-describedby={help ? `${id}-help` : undefined}
        />
        {value && (
          <button type="button" onClick={clear} aria-label="Effacer la recherche">
            ×
          </button>
        )}
      </div>
      {help && <small id={`${id}-help`}>{help}</small>}
    </div>
  );
}
