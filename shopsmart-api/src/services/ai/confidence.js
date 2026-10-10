export const HIGH_THRESHOLD = 0.80;
export const MEDIUM_THRESHOLD = 0.65;

export const confidenceFromScore = (bestScore) => {
  if (bestScore >= HIGH_THRESHOLD) return 'HIGH';
  if (bestScore >= MEDIUM_THRESHOLD) return 'MEDIUM';
  return 'LOW';
};
