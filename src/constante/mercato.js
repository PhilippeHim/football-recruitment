export const PITCH_LINES = [
  { label: 'Attaque', slots: ['LW', 'ST', 'RW'] },
  { label: 'Milieu', slots: ['CM1', 'CDM', 'CM2'] },
  { label: 'Défense', slots: ['LB', 'CB1', 'CB2', 'RB'] },
  { label: 'Gardien', slots: ['GK'] },
];
export const playerKey = (player) =>
  player.url || `${player.Name}|${player.Team}|${player.Nation}|${player.gender}`;
export function price(player) {
  const raw = player?.market_value_in_eur;
  return raw != null &&
    String(raw).trim() !== '' &&
    Number.isFinite(Number(raw)) &&
    Number(raw) >= 0
    ? Number(raw)
    : null;
}
export function compatible(player, slot) {
  const position = slot.replace(/[12]/g, '');
  return [
    player.Position,
    ...(player['Alternative.positions'] || '').split(/[,;\s]+/),
  ].includes(position);
}
