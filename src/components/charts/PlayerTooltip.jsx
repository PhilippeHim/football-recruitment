export default function PlayerTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const player = payload[0].payload;
  return (
    <div className="tooltip">
      <strong>{player.Name}</strong>
      <span>
        {player.Team} · {player.Position}
      </span>
      <span>{player.League}</span>
      <b>
        PAC {player.PAC} · DRI {player.DRI} · OVR {player.OVR}
      </b>
    </div>
  );
}
