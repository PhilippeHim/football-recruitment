import { PITCH_LINES, compatible } from '../../constante/mercato.js';
export default function MercatoPitch({ lineup, players, selected, onAssign, onRemove }) {
  return (
    <section className="mercato-pitch" aria-label="Terrain à onze postes">
      <h2>Votre onze · 4–3–3</h2>
      <p>Glissez un joueur sur un poste, ou sélectionnez-le puis cliquez sur une case.</p>
      {PITCH_LINES.map((line) => (
        <div key={line.label} className="pitch-line">
          <h3>{line.label}</h3>
          <div>
            {line.slots.map((slot) => {
              const player = players.get(lineup[slot]);
              return (
                <div
                  key={slot}
                  className="pitch-slot"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    onAssign(slot, event.dataTransfer.getData('text/plain'));
                  }}
                >
                  <button
                    aria-label={`Placer au poste ${slot}`}
                    onClick={() => selected && onAssign(slot, selected)}
                  >
                    <strong>{slot.replace(/[12]/g, '')}</strong>
                    <span>{player?.Name || 'Poste libre'}</span>
                    {player && (
                      <small>
                        OVR {player.OVR}
                        {!compatible(player, slot) ? ' · Hors poste' : ''}
                      </small>
                    )}
                  </button>
                  {player && (
                    <button
                      className="pitch-remove"
                      aria-label={`Libérer ${slot}`}
                      onClick={() => onRemove(slot)}
                    >
                      Retirer
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
