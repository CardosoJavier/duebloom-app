/**
 * Converts kilograms to pounds, rounded to 2 decimal places.
 */
export function kgToLbs(kg: number): number {
  return +(kg * 2.20462).toFixed(2);
}

/**
 * Converts pounds to kilograms, rounded to 2 decimal places.
 */
export function lbsToKg(lbs: number): number {
  return +(lbs / 2.20462).toFixed(2);
}
