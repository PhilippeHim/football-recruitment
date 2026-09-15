import { NOTE_MIN, NOTE_MAX } from '../constante/players.js';
import { HISTOGRAM_BIN_WIDTH } from '../constante/charts.js';

/** Intervalles fixes et contigus, y compris ceux sans joueur. */
export function histogram(rows) {
  const binCount = Math.ceil((NOTE_MAX - NOTE_MIN + 1) / HISTOGRAM_BIN_WIDTH);
  const bins = Array.from({ length: binCount }, (_, index) => {
    const start = NOTE_MIN + index * HISTOGRAM_BIN_WIDTH;
    const end = Math.min(start + HISTOGRAM_BIN_WIDTH - 1, NOTE_MAX);
    return {
      label: `${start}–${end}`,
      // Une abscisse numérique place la médiane exacte, même entre deux notes.
      center: (start + end) / 2,
      count: 0,
    };
  });
  for (const player of rows) {
    if (player.OVR >= NOTE_MIN && player.OVR <= NOTE_MAX) {
      const binIndex = Math.floor((player.OVR - NOTE_MIN) / HISTOGRAM_BIN_WIDTH);
      bins[binIndex].count++;
    }
  }
  return bins;
}
