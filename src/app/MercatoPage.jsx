import { useMemo, useState } from 'react';
import { playerKey, price, compatible } from '../constante/mercato.js';
import { marketValue } from '../utils/marketValue.js';
import { matchesSearch } from '../utils/searchText.js';
import MercatoPitch from '../components/mercato/MercatoPitch.jsx';

export default function MercatoPage({ rows, mercato, comparisonPlayers }) {
  const { state, update, add, remove, assign } = mercato;
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('');
  const [notice, setNotice] = useState('');
  const players = useMemo(
    () => new Map(rows.map((player) => [playerKey(player), player])),
    [rows],
  );
  const shortlist = state.shortlist.map((key) => players.get(key)).filter(Boolean);
  const entries = Object.entries(state.lineup).filter(([, key]) => players.has(key));
  const team = entries.map(([, key]) => players.get(key));
  const knownCost = team.reduce((sum, player) => sum + (price(player) ?? 0), 0);
  const unknown = team.filter((player) => price(player) === null).length;
  const average = team.length
    ? team.reduce((sum, player) => sum + player.OVR, 0) / team.length
    : 0;
  const missions = [
    ['Constituer un onze', team.length === 11],
    ['Respecter le budget', team.length === 11 && !unknown && knownCost <= state.budget],
    [
      `Atteindre OVR ${state.target} en moyenne`,
      team.length === 11 && average >= state.target,
    ],
    [
      `Recruter ${state.youth} joueurs de 23 ans ou moins`,
      team.filter((player) => player.Age <= 23).length >= state.youth,
    ],
    [
      'Respecter les onze postes',
      entries.length === 11 &&
        entries.every(([slot, key]) => compatible(players.get(key), slot)),
    ],
  ];
  const results = query.trim()
    ? rows
        .filter((player) => matchesSearch(`${player.Name} ${player.Team}`, query))
        .slice(0, 20)
    : [];
  const prospect = players.get(selected);
  const base = price(prospect);
  function place(slot, key) {
    if (!state.shortlist.includes(key)) return;
    assign(slot, key);
    setNotice(`${players.get(key)?.Name} placé au poste ${slot.replace(/[12]/g, '')}.`);
  }
  return (
    <div className="mercato">
      <section className="mercato-settings">
        <label>
          Mon budget (€)
          <input
            type="number"
            min="0"
            step="1000000"
            value={state.budget}
            onChange={(event) =>
              update('budget', Math.max(0, Number(event.target.value)))
            }
          />
        </label>
        <label>
          Objectif OVR moyen
          <input
            type="number"
            min="0"
            max="99"
            value={state.target}
            onChange={(event) =>
              update('target', Math.min(99, Math.max(0, Number(event.target.value))))
            }
          />
        </label>
        <label>
          Objectif jeunes (≤ 23 ans)
          <input
            type="number"
            min="0"
            max="11"
            value={state.youth}
            onChange={(event) =>
              update('youth', Math.min(11, Math.max(0, Number(event.target.value))))
            }
          />
        </label>
      </section>
      <section className="mercato-score" aria-label="Bilan budgétaire">
        <div>
          <span>Valeurs connues du onze</span>
          <strong>{marketValue(knownCost)}</strong>
        </div>
        <div>
          <span>
            {knownCost > state.budget ? 'Dépassement' : 'Budget restant estimé'}
          </span>
          <strong>{marketValue(Math.abs(state.budget - knownCost))}</strong>
        </div>
        <div>
          <span>Effectif · OVR moyen</span>
          <strong>
            {team.length}/11 · {average.toFixed(1)}
          </strong>
        </div>
        <div>
          <span>Expérience mercato</span>
          <strong>{missions.filter(([, done]) => done).length * 100} XP / 500</strong>
        </div>
      </section>
      <p>
        Simulation basée sur les valeurs du fichier, pas sur des prix de transfert :
        salaires et frais exclus.{' '}
        {unknown > 0 && `${unknown} valeur(s) manquante(s) : budget incomplet.`}{' '}
        {team.some((player) => player.statut_match === 'ok_approximatif') &&
          'Certaines correspondances de noms sont à confirmer.'}
      </p>
      <ul className="mercato-missions">
        {missions.map(([title, done]) => (
          <li key={title}>
            {done ? '✓' : '○'} {title}
          </li>
        ))}
      </ul>
      <p role="status">{notice}</p>
      {mercato.storageError && (
        <p>La sauvegarde locale est indisponible dans ce navigateur.</p>
      )}
      <div className="mercato-board">
        <section className="mercato-pool">
          <h2>Mon vivier · {shortlist.length}</h2>
          <p>Retenez des joueurs ici ou depuis leur fiche dans « Ligues et clubs ».</p>
          <button
            onClick={() => comparisonPlayers.forEach(add)}
            disabled={!comparisonPlayers.length}
          >
            Importer les joueurs du comparateur
          </button>
          <label>
            Rechercher un joueur ou un club
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          {query.trim() && (
            <div className="mercato-results">
              <small>20 premiers résultats maximum</small>
              {results.length ? (
                results.map((player) => (
                  <button
                    key={playerKey(player)}
                    disabled={state.shortlist.includes(playerKey(player))}
                    onClick={() => add(player)}
                  >
                    {player.Name} · {player.Position} · {marketValue(price(player))} ＋
                  </button>
                ))
              ) : (
                <p>Aucun résultat.</p>
              )}
            </div>
          )}
          <div className="mercato-shortlist">
            {shortlist.map((player) => {
              const key = playerKey(player);
              return (
                <article
                  key={key}
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData('text/plain', key);
                    setSelected(key);
                  }}
                >
                  <button
                    aria-pressed={selected === key}
                    onClick={() => setSelected(key)}
                  >
                    {player.Name}
                    <small>
                      {player.Position} · OVR {player.OVR} · {marketValue(price(player))}
                    </small>
                  </button>
                  <button
                    aria-label={`Retirer ${player.Name} du vivier`}
                    onClick={() => {
                      remove(key);
                      if (selected === key) setSelected('');
                    }}
                  >
                    ×
                  </button>
                </article>
              );
            })}
          </div>
        </section>
        <MercatoPitch
          lineup={state.lineup}
          players={players}
          selected={selected}
          onAssign={place}
          onRemove={(slot) =>
            update(
              'lineup',
              Object.fromEntries(
                Object.entries(state.lineup).filter(([key]) => key !== slot),
              ),
            )
          }
        />
      </div>
      <section className="mercato-development">
        <h2>Laboratoire de progression</h2>
        <p>
          Sélectionnez un joueur du vivier puis testez une hypothèse de revalorisation. Ce
          scénario pédagogique ne prédit ni sa progression sportive ni sa valeur future.
        </p>
        {prospect ? (
          <>
            <h3>{prospect.Name}</h3>
            <p>
              Piste de travail :{' '}
              {prospect.Position === 'GK'
                ? 'réflexes et placement'
                : 'technique, préparation physique et temps de jeu'}
              . À adapter après observation.
            </p>
            <label>
              Hypothèse de hausse (%)
              <input
                type="number"
                min="0"
                max="100"
                value={state.growth}
                onChange={(event) =>
                  update('growth', Math.min(100, Math.max(0, Number(event.target.value))))
                }
              />
            </label>
            <label>
              Coût de développement simulé (€)
              <input
                type="number"
                min="0"
                value={state.development}
                onChange={(event) =>
                  update('development', Math.max(0, Number(event.target.value)))
                }
              />
            </label>
            {base !== null ? (
              <p>
                Valeur actuelle : {marketValue(base)} → Valeur hypothétique :{' '}
                {marketValue(base * (1 + state.growth / 100))}.{' '}
                {(base * state.growth) / 100 - state.development >= 0
                  ? 'Écart net positif'
                  : 'Écart net négatif'}{' '}
                : {marketValue(Math.abs((base * state.growth) / 100 - state.development))}
                , après coût de développement. Ce coût est indépendant du budget du onze.
              </p>
            ) : (
              <p>Valeur marchande absente : simulation financière indisponible.</p>
            )}
          </>
        ) : (
          <p>Choisissez un joueur dans « Mon vivier » pour commencer.</p>
        )}
      </section>
      <p>Votre projet est sauvegardé dans ce navigateur.</p>
    </div>
  );
}
