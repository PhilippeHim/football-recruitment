import test from 'node:test';
import assert from 'node:assert/strict';
import { activeProfile } from '../src/utils/activeProfile.js';
import {
  DEFAULT_FILTERS,
  RESET_FILTERS,
  WINGER_FILTERS,
} from '../src/constante/filters.js';
import { POSITION_PRESETS } from '../src/constante/positionPresets.js';
import { ROLE_PROFILES, createRoleFilters } from '../src/constante/roleProfiles.js';

test('Le badge suit le profil appliqué, sa personnalisation et la réinitialisation', () => {
  assert.equal(activeProfile(DEFAULT_FILTERS).title, 'Recherche libre');
  const goalkeeper = POSITION_PRESETS.find((item) => item.code === 'GK').filters;
  assert.deepEqual(activeProfile(goalkeeper), {
    title: 'Gardien',
    customized: false,
    applied: true,
  });
  assert.equal(activeProfile({ ...goalkeeper, ovr: 80 }).customized, true);
  assert.equal(activeProfile({ ...goalkeeper, leagues: ['MLS'] }).customized, true);
  assert.equal(activeProfile({ ...goalkeeper, query: 'test' }).customized, true);
  assert.equal(activeProfile(RESET_FILTERS).applied, false);
  assert.equal(activeProfile(WINGER_FILTERS).title, 'Ailier rapide');
  assert.equal(
    activeProfile({
      ...WINGER_FILTERS,
      positions: [...WINGER_FILTERS.positions].reverse(),
    }).customized,
    false,
  );
  const role = createRoleFilters(ROLE_PROFILES[0]);
  assert.equal(activeProfile(role).title, 'Défenseur relanceur');
  assert.equal(
    activeProfile({ ...role, minimums: { ...role.minimums, DEF: 80 } }).customized,
    true,
  );
});
