import { useMemo, useState } from 'react';
import { leagueBoxplots, globalOvrQuartiles } from '../../utils/leagueBoxplots.js';

const REFERENCES = [
  { key: 'median', label: 'Médiane globale', color: '#9b4d0b', dash: '8 4' },
  { key: 'q1', label: 'Quartile global Q1 (25 %)', color: '#245caa', dash: '3 4' },
  { key: 'q3', label: 'Quartile global Q3 (75 %)', color: '#7d3c98', dash: '12 4 3 4' },
];
const NATIONALITIES = [
  { value: 'France', label: 'France', flag: 'drp_france.png' },
  { value: 'England', label: 'Angleterre', flag: 'drp_angleterre.png' },
  { value: 'Germany', label: 'Allemagne', flag: 'drp_allemagne.png' },
  { value: 'Italy', label: 'Italie', flag: 'drp_italie.png' },
  { value: 'Spain', label: 'Espagne', flag: 'drp_espagne.png' },
];
const COLORS = ['#147c70', '#c18b28', '#387ca0', '#9b6597', '#6e8550'];
const format = (value) => value.toLocaleString('fr-FR', { maximumFractionDigits: 2 });

export default function LeagueBoxplot({ rows }) {
  const [nation, setNation] = useState('');
  const selectedNation = NATIONALITIES.find((item) => item.value === nation);
  const nationLabel = selectedNation?.label || 'Toutes les nationalités';
  const [gender, setGender] = useState('');
  const selectedRows = useMemo(
    () =>
      rows.filter(
        (player) =>
          (!gender || player.gender === gender) && (!nation || player.Nation === nation),
      ),
    [rows, gender, nation],
  );
  const [sortBy, setSortBy] = useState('median');
  const [direction, setDirection] = useState('desc');
  const statistics = useMemo(() => leagueBoxplots(selectedRows), [selectedRows]);
  const leagueCategories = useMemo(() => {
    const categories = new Map();
    for (const player of selectedRows) {
      if (!Number.isFinite(player.OVR)) continue;
      if (!categories.has(player.League)) categories.set(player.League, new Set());
      categories.get(player.League).add(player.gender);
    }
    return new Map(
      [...categories].map(([league, genders]) => [
        league,
        [genders.has('F') ? '♀' : '', genders.has('M') ? '♂' : '']
          .filter(Boolean)
          .join(' '),
      ]),
    );
  }, [selectedRows]);
  const groups = useMemo(
    () =>
      [...statistics].sort(
        (a, b) =>
          (direction === 'asc' ? 1 : -1) * (a[sortBy] - b[sortBy]) ||
          a.name.localeCompare(b.name, 'fr'),
      ),
    [statistics, sortBy, direction],
  );
  const quartiles = useMemo(() => globalOvrQuartiles(selectedRows), [selectedRows]);
  const [visible, setVisible] = useState({ median: false, q1: false, q3: false });
  const width = Math.max(800, groups.length * 48 + 100);
  const left = 65;
  const right = width - 25;
  const top = 25;
  const bottom = 345;
  const min = !groups.length
    ? 0
    : Math.max(0, Math.floor((Math.min(...groups.map((g) => g.min)) - 5) / 5) * 5);
  const max = !groups.length
    ? 100
    : Math.min(100, Math.ceil((Math.max(...groups.map((g) => g.max)) + 5) / 5) * 5);
  const y = (value) => bottom - ((value - min) / (max - min)) * (bottom - top);
  const step = (right - left) / groups.length;
  const ticks = Array.from(
    { length: Math.floor((max - min) / 5) + 1 },
    (_, i) => min + i * 5,
  );
  return (
    <section
      className="card league-boxplot"
      aria-label={
        nation
          ? 'Distribution OVR par nationalité et championnat'
          : 'Distribution OVR par championnat'
      }
    >
      <h2>Le niveau des joueurs par championnat</h2>
      <div className="nationality-control">
        <label className="select-label">
          Nationalité représentée
          <select value={nation} onChange={(event) => setNation(event.target.value)}>
            <option value="">Toutes les nationalités</option>
            {NATIONALITIES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        {selectedNation && (
          <img
            src={`${import.meta.env.BASE_URL}${selectedNation.flag}`}
            alt={`Drapeau : ${nationLabel}`}
            width="32"
            height="24"
          />
        )}
      </div>
      {nation && (
        <p>
          Nationalité : {nationLabel} · {selectedRows.length} joueurs · {groups.length}{' '}
          ligues représentées. Les boîtes et les repères globaux portent uniquement sur
          cette nationalité et la catégorie choisie.
        </p>
      )}
      <div className="analytics-controls" role="group" aria-label="Classement des ligues">
        <label>
          Catégorie{' '}
          <select value={gender} onChange={(event) => setGender(event.target.value)}>
            <option value="">Hommes et femmes</option>
            <option value="M">Hommes</option>
            <option value="F">Femmes</option>
          </select>
        </label>
        <label>
          Classer les ligues par{' '}
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="mean">OVR moyen</option>
            <option value="median">OVR médian</option>
          </select>
        </label>
        <label>
          Ordre{' '}
          <select
            value={direction}
            onChange={(event) => setDirection(event.target.value)}
          >
            <option value="desc">Du plus élevé au plus faible</option>
            <option value="asc">Du plus faible au plus élevé</option>
          </select>
        </label>
      </div>
      <p>
        La médiane globale et les quartiles globaux portent sur tous les joueurs de cette
        catégorie, toutes ligues confondues.
      </p>
      {groups.length > 0 ? (
        <>
          <div role="group" aria-label="Repères globaux OVR">
            {REFERENCES.map(({ key, label }) => (
              <label className="median-toggle" key={key}>
                <input
                  type="checkbox"
                  checked={visible[key]}
                  onChange={(event) =>
                    setVisible((current) => ({ ...current, [key]: event.target.checked }))
                  }
                />
                Afficher : {label}
              </label>
            ))}
          </div>
          <div className="boxplot-references" role="status">
            {REFERENCES.filter(({ key }) => visible[key]).map(
              ({ key, label, color, dash }) => (
                <span key={key}>
                  <svg width="36" height="12" aria-hidden="true">
                    <line
                      x1="0"
                      x2="36"
                      y1="6"
                      y2="6"
                      stroke={color}
                      strokeWidth="2"
                      strokeDasharray={dash}
                    />
                  </svg>
                  {label} : {format(quartiles[key])} OVR
                </span>
              ),
            )}
          </div>
          <div
            className="boxplot-scroll"
            tabIndex={0}
            role="region"
            aria-label="Graphique des ligues, défilement horizontal"
          >
            <svg
              viewBox={`0 0 ${width} 550`}
              style={{ width, height: 550 }}
              role="img"
              aria-label="Boîtes à moustaches des notes OVR par ligue ; chiffres disponibles dans le tableau ci-dessous."
            >
              {ticks.map((tick) => (
                <g key={tick}>
                  <line x1={left} x2={right} y1={y(tick)} y2={y(tick)} stroke="#e1e6dc" />
                  <text x={left - 10} y={y(tick) + 4} textAnchor="end">
                    {tick}
                  </text>
                </g>
              ))}
              <text
                transform={`translate(18 ${(top + bottom) / 2}) rotate(-90)`}
                textAnchor="middle"
              >
                OVR
              </text>
              {groups.map((group, index) => {
                const x = left + step * (index + 0.5);
                const half = Math.min(15, step * 0.32);
                return (
                  <g key={group.name}>
                    <title>{`${group.name} ${leagueCategories.get(group.name)} · ${group.count} joueurs\nOVR moyen : ${format(group.mean)}\nMédiane : ${format(group.median)}\nQ1 : ${format(group.q1)} · Q3 : ${format(group.q3)}\nMoustaches : ${group.low}–${group.high}\nNotes atypiques : ${group.outliers.length}`}</title>
                    <line
                      x1={x}
                      x2={x}
                      y1={y(group.low)}
                      y2={y(group.high)}
                      stroke="#344b44"
                    />
                    {[group.low, group.high].map((value, i) => (
                      <line
                        key={i}
                        x1={x - half / 2}
                        x2={x + half / 2}
                        y1={y(value)}
                        y2={y(value)}
                        stroke="#344b44"
                      />
                    ))}
                    <rect
                      x={x - half}
                      y={y(group.q3)}
                      width={half * 2}
                      height={Math.max(1, y(group.q1) - y(group.q3))}
                      fill={nation ? '#2386c0' : COLORS[index % COLORS.length]}
                      fillOpacity={0.8}
                      stroke="#344b44"
                    />
                    <line
                      x1={x - half}
                      x2={x + half}
                      y1={y(group.median)}
                      y2={y(group.median)}
                      stroke="#203c36"
                      strokeWidth={2}
                    />
                    {[...new Set(group.outliers)].map((value) => (
                      <circle
                        key={value}
                        cx={x}
                        cy={y(value)}
                        r={3}
                        fill="white"
                        stroke="#344b44"
                      />
                    ))}
                    <text
                      transform={`translate(${x + 3} ${bottom + 18}) rotate(-50)`}
                      textAnchor="end"
                    >
                      {group.name}{' '}
                      {(leagueCategories.get(group.name) || '')
                        .split(' ')
                        .filter(Boolean)
                        .map((symbol) => (
                          <tspan
                            key={symbol}
                            fill={symbol === '♀' ? '#d14f9b' : '#2386c0'}
                            fontWeight="700"
                          >
                            {symbol}{' '}
                          </tspan>
                        ))}
                    </text>
                  </g>
                );
              })}
              {REFERENCES.filter(({ key }) => visible[key]).map(
                ({ key, label, color, dash }) => (
                  <line
                    key={key}
                    x1={left}
                    x2={right}
                    y1={y(quartiles[key])}
                    y2={y(quartiles[key])}
                    stroke={color}
                    strokeWidth={2}
                    strokeDasharray={dash}
                    pointerEvents="none"
                  >
                    <title>
                      {label} : {format(quartiles[key])} OVR
                    </title>
                  </line>
                ),
              )}
              <text x={(left + right) / 2} y={535} textAnchor="middle">
                Championnats
              </text>
            </svg>
          </div>
          <details>
            <summary>Voir les chiffres du graphique</summary>
            <div className="table-scroll">
              <table>
                <caption className="sr-only">
                  Distribution des notes OVR par championnat
                  {nation ? ` · ${nationLabel}` : ''}
                </caption>
                <thead>
                  <tr>
                    {[
                      'Championnat',
                      'Joueurs',
                      'OVR moyen',
                      'Moustache basse',
                      'Q1',
                      'Médiane',
                      'Q3',
                      'Moustache haute',
                      'Joueurs atypiques',
                    ].map((label) => (
                      <th scope="col" key={label}>
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {groups.map((group) => (
                    <tr key={group.name}>
                      <th scope="row">
                        {group.name}{' '}
                        {(leagueCategories.get(group.name) || '')
                          .split(' ')
                          .filter(Boolean)
                          .map((symbol) => (
                            <span
                              key={symbol}
                              style={{
                                color: symbol === '♀' ? '#d14f9b' : '#2386c0',
                                fontWeight: 700,
                              }}
                            >
                              {symbol}{' '}
                            </span>
                          ))}
                      </th>
                      {[
                        group.count,
                        group.mean,
                        group.low,
                        group.q1,
                        group.median,
                        group.q3,
                        group.high,
                        group.outliers.length,
                      ].map((value, index) => (
                        <td key={index}>{format(value)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
          <p>
            ♀ : ligue féminine · ♂ : ligue masculine. Les cercles ayant la même note se
            superposent. Les couleurs distinguent les boîtes sans indiquer un classement
            de qualité.
          </p>
        </>
      ) : (
        <p role="status">
          Aucune note OVR disponible pour cette catégorie. Choisissez une autre catégorie.
        </p>
      )}
    </section>
  );
}
