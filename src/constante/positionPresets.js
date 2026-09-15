import { POSITIONS } from './players.js';
import { RESET_FILTERS } from './filters.js';

// Point de départ indicatif, ajustable dans les filtres.
export const POSITION_OVR_MIN = 75;

export const POSITION_PRESETS = Object.entries(POSITIONS).map(([code, label]) => ({
  code,
  label,
  filters: {
    ...RESET_FILTERS,
    presetId: `position:${code}`,
    positions: [code],
    ovr: POSITION_OVR_MIN,
  },
}));
