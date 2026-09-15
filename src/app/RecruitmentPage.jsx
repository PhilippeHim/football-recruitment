import MercatoPage from './MercatoPage.jsx';
import { useMercato } from '../hooks/useMercato.js';
import Header from '../components/layout/Header.jsx';
import JourneyNavigation from '../components/layout/JourneyNavigation.jsx';
import PageHeading from '../components/layout/PageHeading.jsx';
import Footer from '../components/layout/Footer.jsx';
import FiltersSidebar from '../components/filters/FiltersSidebar.jsx';
import LoadingState from '../components/feedback/LoadingState.jsx';
import ErrorState from '../components/feedback/ErrorState.jsx';
import ComparisonTray from '../components/comparison/ComparisonTray.jsx';
import SearchPage from './SearchPage.jsx';
import AnalysisPage from './AnalysisPage.jsx';
import ComparisonPage from './ComparisonPage.jsx';
import RoleProfilesPage from './RoleProfilesPage.jsx';
import HomePage from './HomePage.jsx';
import LeaguesPage from './LeaguesPage.jsx';
import { usePlayers } from '../hooks/usePlayers.js';
import { useRecruitment } from '../hooks/useRecruitment.js';
import { useComparison } from '../hooks/useComparison.js';
import { usePlayerTable } from '../hooks/usePlayerTable.js';
import { usePageNavigation } from '../hooks/usePageNavigation.js';

/** Le cadre porte les états partagés ; chaque page affiche une étape du parcours. */
export default function RecruitmentPage() {
  const { rows, loading, error } = usePlayers();
  const recruitment = useRecruitment(rows);
  const comparison = useComparison();
  const mercato = useMercato();
  const page = usePageNavigation();
  const tableState = usePlayerTable(
    recruitment.selectedPlayers,
    JSON.stringify(recruitment.filters),
  );
  const isComparison = page === 'comparaison';
  const isCatalogue = page === 'profils';
  const isHome = page === 'accueil';
  const isLeagues = page === 'ligues';
  const isMercato = page === 'mercato';
  const showTray =
    comparison.players.length > 0 &&
    !isComparison &&
    !isCatalogue &&
    !isHome &&
    !isLeagues &&
    !isMercato;

  return (
    <div className="app">
      <Header playerCount={rows.length} loading={loading} />
      <JourneyNavigation activePage={page} comparisonCount={comparison.players.length} />
      <div
        className={`layout ${isComparison || isCatalogue || isHome || isLeagues || isMercato ? 'layout-comparison' : ''}`}
      >
        {!isComparison && !isCatalogue && !isHome && !isLeagues && !isMercato && (
          <FiltersSidebar
            hideSelectionFilters={page === 'recherche'}
            filters={recruitment.filters}
            leagueOptions={recruitment.leagueOptions}
            onFilterChange={recruitment.updateFilter}
            onToggleBigFive={recruitment.toggleBigFive}
            onReset={recruitment.resetFilters}
            onApplyPositionPreset={recruitment.applyPositionPreset}
            onRoleMinimumChange={recruitment.updateRoleMinimum}
            onRemoveRole={recruitment.removeRoleProfile}
          />
        )}
        <main
          id="main"
          tabIndex={-1}
          className={showTray ? 'comparison-active' : undefined}
        >
          {isHome ? (
            <HomePage
              rows={rows}
              loading={loading}
              error={error}
              onTryProfile={recruitment.applyRoleProfile}
            />
          ) : (
            <PageHeading page={page} />
          )}
          {!isHome && loading && <LoadingState />}
          {!isHome && !loading && error && <ErrorState message={error} />}
          {isHome && <Footer />}
          {!isHome && !loading && !error && (
            <>
              {isLeagues && <LeaguesPage rows={rows} mercato={mercato} />}
              {isMercato && (
                <MercatoPage
                  rows={rows}
                  mercato={mercato}
                  comparisonPlayers={comparison.players}
                />
              )}
              {isCatalogue && (
                <RoleProfilesPage
                  rows={rows}
                  onApply={recruitment.applyRoleProfile}
                  onApplyWinger={recruitment.applyWingerPreset}
                />
              )}
              {page === 'recherche' && (
                <SearchPage
                  onApplyPositionPreset={recruitment.applyPositionPreset}
                  rows={recruitment.selectedPlayers}
                  totalCount={rows.length}
                  comparison={comparison}
                  tableState={tableState}
                  onReset={recruitment.resetFilters}
                  filters={recruitment.filters}
                  leagueOptions={recruitment.leagueOptions}
                  onFilterChange={recruitment.updateFilter}
                />
              )}
              {page === 'analyse' && (
                <AnalysisPage
                  rows={recruitment.selectedPlayers}
                  totalCount={rows.length}
                  onReset={recruitment.resetFilters}
                />
              )}
              {isComparison && (
                <ComparisonPage
                  comparison={comparison}
                  filteredRows={recruitment.selectedPlayers}
                />
              )}
              {showTray && (
                <ComparisonTray
                  players={comparison.players}
                  onRemove={comparison.removePlayer}
                />
              )}
              <Footer />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
