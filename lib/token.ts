import { randomBytes } from 'crypto';

/**
 * Generate a 32-character URL-safe random token for share links.
 * Uses base64url encoding (no padding, no unsafe characters).
 */
export function generateShareToken(): string {
  return randomBytes(24).toString('base64url');
}