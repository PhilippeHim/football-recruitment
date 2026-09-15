/** Moindres carrés : DRI = pente × PAC + constante, sur les seuls couples valides. */
export function linearRegression(rows, xKey, yKey) {
  const points = rows.filter(
    (row) => Number.isFinite(row[xKey]) && Number.isFinite(row[yKey]),
  );
  if (points.length < 2) return null;

  const meanX = points.reduce((sum, row) => sum + row[xKey], 0) / points.length;
  const meanY = points.reduce((sum, row) => sum + row[yKey], 0) / points.length;
  let varianceX = 0;
  let varianceY = 0;
  let covariance = 0;
  for (const row of points) {
    const dx = row[xKey] - meanX;
    const dy = row[yKey] - meanY;
    varianceX += dx * dx;
    varianceY += dy * dy;
    covariance += dx * dy;
  }
  // Une abscisse constante ne permet pas d’estimer une pente.
  if (varianceX === 0) return null;
  const slope = covariance / varianceX;
  const intercept = meanY - slope * meanX;
  const xs = points.map((row) => row[xKey]);
  return {
    slope,
    intercept,
    count: points.length,
    rSquared:
      varianceY === 0
        ? null
        : Math.min(1, Math.max(0, covariance ** 2 / (varianceX * varianceY))),
    // Ne pas extrapoler au-delà des vitesses observées.
    segment: [Math.min(...xs), Math.max(...xs)].map((x) => ({
      x,
      y: slope * x + intercept,
    })),
  };
}
