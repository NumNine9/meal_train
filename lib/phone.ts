/**
 * Normalize a South African phone number to E.164 format (+27XXXXXXXXX).
 *
 * Accepts:
 *   "0821234567"       → "+27821234567"
 *   "27821234567"      → "+27821234567"
 *   "+27821234567"     → "+27821234567"
 *   "082 123 4567"     → "+27821234567"
 *   "082-123-4567"     → "+27821234567"
 */
export function normalizePhone(input: string): string | null {
  const digits = input.replace(/[^\d+]/g, '');

  // Already E.164
  if (/^\+27\d{9}$/.test(digits)) return digits;

  // Local format: 0821234567 (10 digits starting with 0)
  if (/^0\d{9}$/.test(digits)) return '+27' + digits.slice(1);

  // Country code without plus: 27821234567
  if (/^27\d{9}$/.test(digits)) return '+' + digits;

  // International (other country) — accept as-is if +XX...
  if (/^\+\d{10,15}$/.test(digits)) return digits;

  return null;
}

/**
 * Format a phone number for display: "+27 82 123 4567"
 */
export function formatPhone(e164: string): string {
  if (!e164.startsWith('+27') || e164.length !== 12) return e164;
  const rest = e164.slice(3);
  return `+27 ${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(5)}`;
}
