/** Shared design tokens, so the same values aren't re-typed across components. */

/** Warm desert gradient used by the Contact section and the catalogue viewers. */
export const DESERT_GRADIENT =
  'linear-gradient(180deg, #5C2F18 0%, #6B4428 35%, #7A5C42 50%, #6B4428 65%, #4A2511 100%)';

/** Slow, heavy settle. The site's default entrance curve. */
export const LUXURY_EASING: [number, number, number, number] = [0.19, 1.0, 0.22, 1.0];

/** Gentler curve for text and secondary motion. */
export const SMOOTH_EASING: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
