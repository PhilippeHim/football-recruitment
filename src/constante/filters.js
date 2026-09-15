// À l’ouverture, on présente les joueurs de niveau OVR ≥ 75.
export const DEFAULT_FILTERS = {
  presetId: null,
  roleId: null,
  minimums: {},
  query: '',
  leagues: [],
  positions: [],
  gender: '',
  ovr: 75,
  pac: 0,
  dri: 0,
  sho: 0,
  pas: 0,
  def: 0,
  phy: 0,
  excludeBigFive: false,
};
// Réinitialiser signifie élargir la recherche à tous les joueurs.
export const RESET_FILTERS = { ...DEFAULT_FILTERS, ovr: 0 };
// OVR est entier : « supérieur à 75 » correspond à un minimum de 76.
export const WINGER_FILTERS = {
  ...RESET_FILTERS,
  presetId: 'winger',
  roleId: null,
  minimums: {},
  query: '',
  leagues: [],
  positions: ['LW', 'RW', 'LM', 'RM'],
  gender: 'M',
  ovr: 76,
  pac: 80,
  dri: 80,
  excludeBigFive: true,
};
export const NUMERIC_FILTERS = [
  { key: 'ovr', short: 'OVR', label: 'Note globale' },
  { key: 'pac', short: 'PAC', label: 'Vitesse' },
  { key: 'dri', short: 'DRI', label: 'Dribble' },
  { key: 'sho', short: 'SHO', label: 'Tir' },
  { key: 'pas', short: 'PAS', label: 'Passes' },
  { key: 'def', short: 'DEF', label: 'Défense' },
  { key: 'phy', short: 'PHY', label: 'Physique' },
];
