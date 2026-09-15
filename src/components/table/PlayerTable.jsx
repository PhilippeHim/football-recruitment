import { formatCount } from '../../utils/formatNumber.js';
import PlayerTableHead from './PlayerTableHead.jsx';
import PlayerTableBody from './PlayerTableBody.jsx';
import TablePagination from './TablePagination.jsx';
import PlayerSearch from '../filters/PlayerSearch.jsx';
import { TABLE_COLUMNS } from '../../constante/table.js';
import { ROLE_STAT_LABELS } from '../../constante/roleProfiles.js';

export default function PlayerTable({
  rows,
  comparisonPlayers,
  onTogglePlayer,
  tableState,
  roleMinimums = {},
}) {
  const hasRole = Object.keys(roleMinimums).length > 0;
  const baseColumns = hasRole
    ? TABLE_COLUMNS.filter((column) => !['PAC', 'DRI', 'SHO'].includes(column.key))
    : TABLE_COLUMNS;
  const columns = [
    ...baseColumns,
    ...Object.keys(roleMinimums)
      .filter((key) => !baseColumns.some((column) => column.key === key))
      .map((key) => ({ key, label: ROLE_STAT_LABELS[key] })),
  ];
  const {
    sort,
    changeSort,
    currentPage,
    pageCount,
    setPage,
    visiblePlayers,
    query,
    changeQuery,
    matchingCount,
  } = tableState;
  return (
    <section id="players-table" className="card table-card">
      <div className="table-title">
        <div>
          <span className="eyebrow">LA SÉLECTION</span>
          <h2>Les profils à suivre</h2>
        </div>
        <span className="tag" aria-live="polite">
          {formatCount(matchingCount)} joueurs
          {query && ` sur ${formatCount(rows.length)}`}
        </span>
      </div>
      <p>
        Cliquez sur un en-tête pour trier.{' '}
        {hasRole
          ? 'Les colonnes de qualités suivent votre profil métier : chaque note est accompagnée du seuil demandé.'
          : 'OVR : note globale · PAC : vitesse · DRI : dribble · SHO : tir.'}
      </p>
      <p className="compare-instruction" aria-live="polite">
        Choisissez 2 ou 3 joueurs de champ avec les cases « Comparer » pour confronter
        leurs qualités.{' '}
        {comparisonPlayers.length === 3 &&
          'Trois profils sélectionnés : retirez-en un pour en ajouter un autre.'}
      </p>
      <PlayerSearch
        value={query}
        onChange={changeQuery}
        label="Rechercher dans le tableau"
        help="Nom de joueur ou club · recherche sur toutes les pages des résultats filtrés. Les graphiques et les joueurs cochés sont conservés."
      />
      {matchingCount === 0 ? (
        <p role="status">
          Aucun joueur ne correspond dans le tableau. Modifiez ou effacez cette recherche.
        </p>
      ) : (
        <>
          <div className="table-scroll">
            <table>
              <caption className="sr-only">
                Profils correspondant aux filtres, tableau triable
              </caption>
              <PlayerTableHead sort={sort} onSort={changeSort} columns={columns} />
              <PlayerTableBody
                rows={visiblePlayers}
                comparisonPlayers={comparisonPlayers}
                onTogglePlayer={onTogglePlayer}
                columns={columns}
                roleMinimums={roleMinimums}
              />
            </table>
          </div>
          <TablePagination
            currentPage={currentPage}
            pageCount={pageCount}
            totalCount={matchingCount}
            onPageChange={setPage}
          />
        </>
      )}
    </section>
  );
}
