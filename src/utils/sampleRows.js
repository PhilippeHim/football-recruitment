function hashText(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function rowKey(row) {
  return [row.Name, row.Team, row.League, row.Position, row.gender].join('|');
}

export function sampleRows(rows, limit) {
  if (rows.length <= limit) return rows;
  return rows
    .map((row, index) => ({ row, rank: hashText(`${rowKey(row)}|${index}`) }))
    .sort((a, b) => a.rank - b.rank)
    .slice(0, limit)
    .map(({ row }) => row);
}
