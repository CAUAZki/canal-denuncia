import { pool } from '../db/pool.js';

export async function recordAudit({ user, action, reportId = null, protocol = null, detail = null }) {
  await pool.query(
    `INSERT INTO audit_logs (user_id, user_label, role, action, report_id, report_protocol, detail)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      user ? user.id : null,
      user ? user.name : 'Acesso público',
      user ? user.role : null,
      action,
      reportId,
      protocol,
      detail,
    ],
  );
}
