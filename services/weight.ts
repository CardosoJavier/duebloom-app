/**
 * Weight unit conversion utilities.
 * All functions are pure with no side effects.
 */

/** Converts kilograms to pounds, rounded to 2 decimal places. */
export function kgToLbs(kg: number): number {
  return +(kg * 2.20462).toFixed(2);
}

/** Converts pounds to kilograms, rounded to 2 decimal places. */
export function lbsToKg(lbs: number): number {
  return +(lbs / 2.20462).toFixed(2);
}

/** Converts centimeters to total inches, rounded to 2 decimal places. */
export function cmToInches(cm: number): number {
  return +(cm / 2.54).toFixed(2);
}

/** Converts total inches to centimeters, rounded to 2 decimal places. */
export function inchesToCm(inches: number): number {
  return +(inches * 2.54).toFixed(2);
}

/**
 * Converts a height in feet + inches to total centimeters.
 * @param feet   Whole feet (e.g. 5)
 * @param inches Remaining inches (e.g. 11)
 */
export function feetInchesToCm(feet: number, inches: number): number {
  return +((feet * 12 + inches) * 2.54).toFixed(1);
}

/**
 * Converts centimeters to a { feet, inches } object.
 * Inches are rounded to the nearest integer.
 */
export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

/**
 * Formats a cm value as an imperial height string, e.g. "5'11\"".
 */
export function formatImperialHeight(cm: number): string {
  const { feet, inches } = cmToFeetInches(cm);
  return `${feet}'${inches}"`;
}

/**
 * Parses a "feet'inches" string (e.g. "5'10") to centimeters.
 * Used when the height input stores a formatted string.
 */
export function parseFeetInchesString(value: string): number {
  const [feetPart, inchesPart] = value.split("'");
  const feet = Number.parseInt(feetPart, 10) || 0;
  const inches = Number.parseInt(inchesPart ?? "0", 10) || 0;
  return feet * 30.48 + inches * 2.54;
}

/**
 * Auto-formats raw digit input into a feet'inches display string.
 * e.g. "510" → "5'10"
 */
export function formatImperialHeightInput(raw: string): string {
  const digits = raw.replaceAll(/\D/g, "");
  if (digits.length <= 1) return digits;
  return digits[0] + "'" + digits.slice(1, 3);
}
