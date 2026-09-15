// Noms des colonnes du CSV : conserver leur orthographe d’origine.
export const STATS = ['OVR', 'PAC', 'DRI', 'SHO', 'PAS', 'DEF', 'PHY'];
export const NUMERIC_COLUMNS = [...STATS, 'Age'];
export const REQUIRED_COLUMNS = [
  'Name',
  'League',
  'Position',
  'Team',
  'Nation',
  'gender',
  ...NUMERIC_COLUMNS,
];
export const DATASET_FILENAME = 'all_players_with_market_value.csv';
export const NOTE_MIN = 0;
export const NOTE_MAX = 99;
export const POSITIONS = {
  CM: 'Milieu central',
  GK: 'Gardien',
  CB: 'Défenseur central',
  RB: 'Arrière droit',
  LB: 'Arrière gauche',
  CDM: 'Milieu défensif',
  RM: 'Milieu droit',
  LM: 'Milieu gauche',
  CAM: 'Milieu offensif',
  RW: 'Ailier droit',
  LW: 'Ailier gauche',
  ST: 'Attaquant',
};
export const POSITION_OPTIONS = Object.entries(POSITIONS).map(([value, label]) => ({
  value,
  label: `${value} · ${label}`,
}));
