import crypto from 'node:crypto';

const SCRYPT_KEYLEN = 64;

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, SCRYPT_KEYLEN).toString('hex');
  return `scrypt:${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  if (typeof stored !== 'string') return false;
  const [scheme, salt, hash] = stored.split(':');
  if (scheme !== 'scrypt' || !salt || !hash) return false;
  const computed = crypto.scryptSync(password, salt, SCRYPT_KEYLEN);
  const expected = Buffer.from(hash, 'hex');
  if (expected.length !== computed.length) return false;
  return crypto.timingSafeEqual(expected, computed);
}

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function hashAccessCode(code) {
  const normalized = String(code).replace(/[^a-z0-9]/gi, '').toUpperCase();
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateAccessCode() {
  const bytes = crypto.randomBytes(8);
  let raw = '';
  for (let i = 0; i < 8; i += 1) raw += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  return `${raw.slice(0, 4)}-${raw.slice(4)}`;
}

export function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

export const SESSION_COOKIE = 'cs_session';
export const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
