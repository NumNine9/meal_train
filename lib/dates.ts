/**
 * Get today's date as YYYY-MM-DD (server timezone).
 * Kept in a non-component module so the React Compiler doesn't flag it.
 */
export function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Get today + N days as YYYY-MM-DD.
 */
export function getDateStringPlusDays(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
}