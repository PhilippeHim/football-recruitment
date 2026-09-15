import { POSITIONS } from './players.js';
import { RESET_FILTERS } from './filters.js';

// Point de départ indicatif, ajustable dans les filtres.
export const POSITION_OVR_MIN = 75;

// Hypothèses pédagogiques, sans valeur de standard sportif.
// Les notes générales de joueurs de champ ne sont pas adaptées aux gardiens.
const POSITION_MINIMUMS = {
  GK: {},
  CB: { def: 75, phy: 75 },
  RB: { pac: 75, def: 70, phy: 65 },
  LB: { pac: 75, def: 70, phy: 65 },
  CDM: { pas: 70, def: 75, phy: 70 },
  CM: { pas: 75, dri: 70, phy: 65 },
  CAM: { pas: 75, dri: 75, sho: 65 },
  RM: { pac: 75, dri: 75, pas: 70 },
  LM: { pac: 75, dri: 75, pas: 70 },
  RW: { pac: 80, dri: 75, sho: 70 },
  LW: { pac: 80, dri: 75, sho: 70 },
  ST: { sho: 75, phy: 70 },
};

export const POSITION_PRESETS = Object.entries(POSITIONS).map(([code, label]) => ({
  code,
  label,
  filters: {
    ...RESET_FILTERS,
    presetId: `position:${code}`,
    positions: [code],
    ovr: POSITION_OVR_MIN,
    ...POSITION_MINIMUMS[code],
  },
}));
