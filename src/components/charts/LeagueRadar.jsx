import { useMemo, useState } from 'react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { leagueRadarProfiles, LEAGUE_RADAR_STATS } from '../../utils/leagueRadar.js';
import { COMPARISON_COLORS } from '../../constante/comparison.js';
import MultiSelect from '../filters/MultiSelect.jsx';

const format = (value) =>
  value == null
    ? 'Non disponible'
    : value.toLocaleString('fr-FR', { maximumFractionDigits: 1 });

export default function LeagueRadar({ rows }) {
  const profiles = useMemo(() => leagueRadarProfiles(rows), [rows]);
  const [selected, setSelected] = useState(() => profiles.slice(0, 3).map((p) => p.name));
  const chosen = profiles.filter((p) => selected.includes(p.name));
  const stats = LEAGUE_RADAR_STATS.map(({ key, label }) => ({
    key,
    label,
    ...Object.fromEntries(
      chosen.map((profile, index) => [`league${index}`, profile.scores[key]]),
    ),
  }));
  return (
    <section
      className="card league-radar"
      aria-label="Comparaison des profils moyens des ligues"
    >
      <h2>Comparer le profil moyen des ligues</h2>
      <p>
        Choisissez jusqu’à trois ligues pour comparer PAC, DRI, SHO, PAS, DEF, PHY et OVR.
        Les moyennes portent sur les joueurs de champ du vivier complet ; les gardiens
        sont exclus.
      </p>
      <MultiSelect
        label="Ligues à comparer (3 maximum)"
        options={profiles.map((p) => ({ value: p.name, label: p.name }))}
        selected={selected}
        onChange={(values) => setSelected(values.slice(0, 3))}
        disabledValues={
          selected.length >= 3
            ? profiles.filter((p) => !selected.includes(p.name)).map((p) => p.name)
            : []
        }
      />
      <p>
        Ordre de prestige indicatif : Premier League, Liga, Serie A, Bundesliga, Ligue 1,
        puis les autres ligues par ordre alphabétique. Cet ordre éditorial ne constitue
        pas un classement officiel.
      </p>
      {chosen.length ? (
        <>
          <div
            className="league-radar-chart"
            role="img"
            aria-label={`Profil moyen de ${chosen.map((p) => p.name).join(', ')} sur sept notes de 0 à 100. Valeurs dans le tableau ci-dessous.`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={stats} outerRadius="70%">
                <PolarGrid stroke="#dce3d8" />
                <PolarAngleAxis dataKey="key" tick={{ fill: '#334b40', fontSize: 12 }} />
                <PolarRadiusAxis
                  domain={[0, 100]}
                  ticks={[20, 40, 60, 80, 100]}
                  axisLine={false}
                />
                <Tooltip
                  formatter={format}
                  labelFormatter={(key) =>
                    LEAGUE_RADAR_STATS.find((s) => s.key === key)?.label || key
                  }
                />
                <Legend />
                {chosen.map((profile, index) => (
                  <Radar
                    key={profile.name}
                    name={profile.name}
                    dataKey={`league${index}`}
                    stroke={COMPARISON_COLORS[index]}
                    fill={COMPARISON_COLORS[index]}
                    fillOpacity={0.08}
                    strokeWidth={2.5}
                    strokeDasharray={
                      index === 1 ? '7 3' : index === 2 ? '2 3' : undefined
                    }
                    isAnimationActive={false}
                  />
                ))}
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <details>
            <summary>Voir les moyennes par ligue</summary>
            <div className="table-scroll">
              <table>
                <caption className="sr-only">Notes moyennes des joueurs de champ</caption>
                <thead>
                  <tr>
                    <th scope="col">Ligue</th>
                    <th scope="col">Joueurs de champ</th>
                    {LEAGUE_RADAR_STATS.map(({ key }) => (
                      <th scope="col" key={key}>
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {chosen.map((profile) => (
                    <tr key={profile.name}>
                      <th scope="row">{profile.name}</th>
                      <td>{profile.count}</td>
                      {LEAGUE_RADAR_STATS.map(({ key }) => (
                        <td key={key}>{format(profile.scores[key])}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      ) : (
        <p role="status">Sélectionnez une ligue pour afficher son profil moyen.</p>
      )}
    </section>
  );
}
