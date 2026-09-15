import { RESET_FILTERS } from './filters.js';

// Hypothèses pédagogiques de recrutement : seuils explicites et modifiables.
export const ROLE_STAT_LABELS = {
  DEF: 'Défense',
  PAC: 'Vitesse',
  DRI: 'Dribble',
  'Short.Passing': 'Passes courtes',
  'Long.Passing': 'Passes longues',
  'Standing.Tackle': 'Tacle debout',
  Strength: 'Force',
  'Heading.Accuracy': 'Précision de la tête',
  Stamina: 'Endurance',
  Crossing: 'Centres',
  Interceptions: 'Interceptions',
  'Ball.Control': 'Contrôle du ballon',
  Vision: 'Vision',
  Finishing: 'Finition',
  Positioning: 'Placement offensif',
  'Shot.Power': 'Puissance de tir',
};

export const ROLE_PROFILES = [
  {
    id: 'relanceur',
    title: 'Défenseur relanceur',
    family: 'Défense',
    positions: ['CB'],
    description: 'Sécuriser la défense et ressortir le ballon par la passe.',
    criteria: { DEF: 75, 'Short.Passing': 70, 'Long.Passing': 65 },
  },
  {
    id: 'stoppeur',
    title: 'Défenseur de duel',
    family: 'Défense',
    positions: ['CB'],
    description: 'Cibler la force, le tacle et le jeu de tête pour les duels défensifs.',
    criteria: { 'Standing.Tackle': 75, Strength: 75, 'Heading.Accuracy': 70 },
  },
  {
    id: 'lateral',
    title: 'Latéral offensif',
    family: 'Défense',
    positions: ['RB', 'LB'],
    description:
      'Apporter de la vitesse, répéter les courses et centrer depuis les côtés.',
    criteria: { PAC: 78, Stamina: 75, Crossing: 70 },
  },
  {
    id: 'recuperateur',
    title: 'Milieu récupérateur',
    family: 'Milieu',
    positions: ['CDM', 'CM'],
    description:
      'Rechercher la récupération du ballon et la capacité à soutenir les efforts.',
    criteria: { Interceptions: 75, 'Standing.Tackle': 72, Stamina: 75 },
  },
  {
    id: 'relayeur',
    title: 'Milieu relayeur',
    family: 'Milieu',
    positions: ['CM'],
    description:
      'Relier les lignes avec des passes courtes, du contrôle et de l’endurance.',
    criteria: { 'Short.Passing': 75, Stamina: 78, 'Ball.Control': 75 },
  },
  {
    id: 'meneur',
    title: 'Meneur de jeu',
    family: 'Milieu',
    positions: ['CAM', 'CM'],
    description: 'Créer des occasions par la vision du jeu, la passe et le dribble.',
    criteria: { Vision: 78, 'Short.Passing': 78, DRI: 78 },
  },
  {
    id: 'ailier',
    title: 'Ailier créateur',
    family: 'Attaque',
    positions: ['RW', 'LW', 'RM', 'LM'],
    description: 'Déborder, éliminer et alimenter les attaquants grâce aux centres.',
    criteria: { PAC: 82, DRI: 80, Crossing: 70 },
  },
  {
    id: 'finisseur',
    title: 'Attaquant finisseur',
    family: 'Attaque',
    positions: ['ST'],
    description: 'Privilégier la finition, le placement offensif et la puissance de tir.',
    criteria: { Finishing: 80, Positioning: 78, 'Shot.Power': 75 },
  },
];

export function createRoleFilters(profile) {
  return {
    ...RESET_FILTERS,
    presetId: `role:${profile.id}`,
    roleId: profile.id,
    ovr: 75,
    positions: [...profile.positions],
    minimums: { ...profile.criteria },
  };
}
