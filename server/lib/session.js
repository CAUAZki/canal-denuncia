import { pool } from '../db/pool.js';
import { hashToken, SESSION_COOKIE } from './auth.js';

export async function attachUser(req, res, next) {
  try {
    const token = req.cookies?.[SESSION_COOKIE];
    if (!token) return next();

    const { rows } = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, u.area_id, a.name AS area_name, s.expires_at
         FROM sessions s
         JOIN users u ON u.id = s.user_id
         LEFT JOIN areas a ON a.id = u.area_id
        WHERE s.token_hash = $1`,
      [hashToken(token)],
    );

    const row = rows[0];
    if (!row) return next();

    if (new Date(row.expires_at).getTime() < Date.now()) {
      await pool.query('DELETE FROM sessions WHERE token_hash = $1', [hashToken(token)]);
      return next();
    }

    req.user = {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      areaId: row.area_id,
      areaName: row.area_name,
    };
    return next();
  } catch (error) {
    return next(error);
  }
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Sessão expirada. Entre novamente para continuar.' });
  }
  return next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Sessão expirada. Entre novamente para continuar.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Seu perfil de acesso não permite esta ação.' });
    }
    return next();
  };
}
