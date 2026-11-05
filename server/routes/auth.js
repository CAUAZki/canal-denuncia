import { Router } from 'express';
import { pool } from '../db/pool.js';
import {
  generateSessionToken,
  hashToken,
  SESSION_COOKIE,
  SESSION_TTL_MS,
  verifyPassword,
} from '../lib/auth.js';
import { requireAuth } from '../lib/session.js';
import { recordAudit } from '../lib/audit.js';
import { ROLES } from '../../shared/catalog.js';

export const authRouter = Router();

const attempts = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 12;

function tooManyAttempts(ip) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

function clearAttempts(ip) {
  attempts.delete(ip);
}

function serializeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    roleLabel: ROLES[user.role] || user.role,
    area: user.area_name || null,
  };
}

authRouter.post('/login', async (req, res, next) => {
  try {
    const ip = req.ip || 'desconhecido';
    if (tooManyAttempts(ip)) {
      return res.status(429).json({ error: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.' });
    }

    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    const fields = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fields.email = 'Informe um e-mail válido.';
    if (!password) fields.password = 'Informe sua senha.';
    if (Object.keys(fields).length > 0) {
      return res.status(400).json({ error: 'Preencha e-mail e senha.', fields });
    }

    const { rows } = await pool.query(
      `SELECT u.*, a.name AS area_name
         FROM users u
         LEFT JOIN areas a ON a.id = u.area_id
        WHERE lower(u.email) = $1`,
      [email],
    );

    const user = rows[0];
    if (!user || !verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    }

    clearAttempts(ip);

    const token = generateSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

    await pool.query(
      'INSERT INTO sessions (token_hash, user_id, expires_at) VALUES ($1, $2, $3)',
      [hashToken(token), user.id, expiresAt],
    );
    await pool.query('DELETE FROM sessions WHERE expires_at < now()');

    res.cookie(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
      maxAge: SESSION_TTL_MS,
    });

    await recordAudit({
      user: { id: user.id, name: user.name, role: user.role },
      action: 'Login no painel restrito',
    });

    return res.json({ user: serializeUser(user) });
  } catch (error) {
    return next(error);
  }
});

authRouter.post('/logout', async (req, res, next) => {
  try {
    const token = req.cookies?.[SESSION_COOKIE];
    if (token) {
      await pool.query('DELETE FROM sessions WHERE token_hash = $1', [hashToken(token)]);
    }
    res.clearCookie(SESSION_COOKIE, { path: '/' });
    return res.json({ ok: true });
  } catch (error) {
    return next(error);
  }
});

authRouter.get('/me', requireAuth, async (req, res, next) => {
  try {
    return res.json({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        roleLabel: ROLES[req.user.role] || req.user.role,
        area: req.user.areaName || null,
      },
    });
  } catch (error) {
    return next(error);
  }
});
