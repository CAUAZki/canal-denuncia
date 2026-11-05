import { Router } from 'express';
import { pool } from '../db/pool.js';
import { requireAuth, requireRole } from '../lib/session.js';
import { recordAudit } from '../lib/audit.js';
import {
  AREAS,
  OCCURRENCE_LABELS,
  ROLES,
  STATUSES,
  URGENCIES,
} from '../../shared/catalog.js';

export const panelRouter = Router();
panelRouter.use(requireAuth);

const openStatuses = ['Recebida', 'Em triagem', 'Em análise', 'Encaminhada'];

function canAccessContent(user, report) {
  if (user.role === 'compliance') return true;
  if (user.role === 'gestor') return report.area_id === user.areaId;
  return false;
}

async function loadReport(id) {
  const { rows } = await pool.query(
    `SELECT r.*, a.name AS area_name,
            EXISTS (SELECT 1 FROM attachments at WHERE at.report_id = r.id) AS has_attachment
       FROM reports r
       LEFT JOIN areas a ON a.id = r.area_id
      WHERE r.id = $1`,
    [id],
  );
  return rows[0] || null;
}

function baseReportSummary(report) {
  return {
    id: report.id,
    protocol: report.protocol,
    category: report.category,
    urgency: report.urgency,
    status: report.status,
    area: report.area_name || null,
    aiConfirmed: report.ai_confirmed,
    hasAttachment: Boolean(report.has_attachment),
    createdAt: report.created_at,
    updatedAt: report.updated_at,
  };
}

async function saveEvent(client, reportId, { kind, fromStatus = null, toStatus = null, body = null, author, authorId = null, visibility = 'internal' }) {
  await client.query(
    `INSERT INTO report_events (report_id, kind, from_status, to_status, body, author_label, author_user_id, visibility)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [reportId, kind, fromStatus, toStatus, body, author, authorId, visibility],
  );
}

panelRouter.get('/summary', async (req, res, next) => {
  try {
    const user = req.user;
    const params = user.role === 'gestor' ? [user.areaId] : [];
    const where = user.role === 'gestor' ? 'WHERE r.area_id = $1' : '';

    const byStatusRows = await pool.query(
      `SELECT r.status, count(*)::int AS count FROM reports r ${where} GROUP BY r.status`,
      params,
    );
    const byCategoryRows = await pool.query(
      `SELECT r.category, count(*)::int AS count FROM reports r ${where} GROUP BY r.category`,
      params,
    );
    const byUrgencyRows = await pool.query(
      `SELECT r.urgency, count(*)::int AS count FROM reports r ${where} GROUP BY r.urgency`,
      params,
    );

    const byStatus = Object.fromEntries(STATUSES.map((status) => [status, 0]));
    for (const row of byStatusRows.rows) byStatus[row.status] = row.count;

    const byCategory = Object.fromEntries(OCCURRENCE_LABELS.map((label) => [label, 0]));
    for (const row of byCategoryRows.rows) byCategory[row.category] = row.count;

    const byUrgency = Object.fromEntries(URGENCIES.map((label) => [label, 0]));
    for (const row of byUrgencyRows.rows) byUrgency[row.urgency] = row.count;

    const total = Object.values(byStatus).reduce((sum, value) => sum + value, 0);
    const active = openStatuses.reduce((sum, status) => sum + (byStatus[status] || 0), 0);

    const maxPriorityResult = await pool.query(
      `SELECT count(*)::int AS count
         FROM reports r
        WHERE r.urgency = 'Prioridade Máxima'
          AND r.status NOT IN ('Concluída', 'Arquivada')
          ${user.role === 'gestor' ? 'AND r.area_id = $1' : ''}`,
      user.role === 'gestor' ? [user.areaId] : [],
    );

    const alertParams = user.role === 'gestor' ? [user.areaId] : [];
    const alertWhere = user.role === 'gestor' ? 'AND r.area_id = $1' : '';
    const alerts = await pool.query(
      `SELECT r.id, r.protocol, r.category, r.urgency, r.status, r.created_at, a.name AS area_name
         FROM reports r
         LEFT JOIN areas a ON a.id = r.area_id
        WHERE r.urgency = 'Prioridade Máxima'
          AND r.status NOT IN ('Concluída', 'Arquivada')
          ${alertWhere}
        ORDER BY r.created_at DESC
        LIMIT 8`,
      alertParams,
    );

    return res.json({
      role: user.role,
      roleLabel: ROLES[user.role],
      total,
      active,
      concluded: byStatus['Concluída'] || 0,
      maxPriorityOpen: maxPriorityResult.rows[0].count,
      byStatus,
      byCategory,
      byUrgency,
      alerts: alerts.rows.map((row) => ({
        id: row.id,
        protocol: row.protocol,
        category: row.category,
        urgency: row.urgency,
        status: row.status,
        area: row.area_name,
        createdAt: row.created_at,
      })),
    });
  } catch (error) {
    return next(error);
  }
});

panelRouter.get('/reports', async (req, res, next) => {
  try {
    const user = req.user;
    const conditions = [];
    const params = [];

    if (user.role === 'gestor') {
      params.push(user.areaId);
      conditions.push(`r.area_id = $${params.length}`);
    }

    const { status, category, urgency, from, to } = req.query;

    if (status && STATUSES.includes(status)) {
      params.push(status);
      conditions.push(`r.status = $${params.length}`);
    }
    if (category && OCCURRENCE_LABELS.includes(category)) {
      params.push(category);
      conditions.push(`r.category = $${params.length}`);
    }
    if (urgency && URGENCIES.includes(urgency)) {
      params.push(urgency);
      conditions.push(`r.urgency = $${params.length}`);
    }
    if (from && /^\d{4}-\d{2}-\d{2}$/.test(from)) {
      params.push(from);
      conditions.push(`r.created_at >= $${params.length}::date`);
    }
    if (to && /^\d{4}-\d{2}-\d{2}$/.test(to)) {
      params.push(to);
      conditions.push(`r.created_at < ($${params.length}::date + interval '1 day')`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const { rows } = await pool.query(
      `SELECT r.id, r.protocol, r.modality, r.category, r.urgency, r.status,
              r.ai_confirmed, r.created_at, r.updated_at, a.name AS area_name,
              EXISTS (SELECT 1 FROM attachments at WHERE at.report_id = r.id) AS has_attachment
         FROM reports r
         LEFT JOIN areas a ON a.id = r.area_id
         ${where}
        ORDER BY CASE r.urgency
                   WHEN 'Prioridade Máxima' THEN 0
                   WHEN 'Alto' THEN 1
                   WHEN 'Médio' THEN 2
                   ELSE 3
                 END,
                 r.created_at DESC
        LIMIT 200`,
      params,
    );

    return res.json({
      reports: rows.map((row) => ({
        ...baseReportSummary(row),
        protocol: row.protocol,
        modality: row.modality,
      })),
    });
  } catch (error) {
    return next(error);
  }
});

panelRouter.get('/reports/:id', async (req, res, next) => {
  try {
    const user = req.user;
    const report = await loadReport(req.params.id);
    if (!report) return res.status(404).json({ error: 'Denúncia não encontrada.' });

    const id = Number(req.params.id);

    if (user.role === 'auditoria') {
      const events = await pool.query(
        `SELECT kind, from_status, to_status, author_label, visibility, created_at
           FROM report_events WHERE report_id = $1 ORDER BY created_at ASC, id ASC`,
        [id],
      );
      const logs = await pool.query(
        `SELECT user_label, role, action, detail, created_at
           FROM audit_logs WHERE report_id = $1 ORDER BY created_at DESC, id DESC LIMIT 100`,
        [id],
      );

      await recordAudit({
        user,
        action: 'Visualizou metadados da denúncia',
        reportId: id,
        protocol: report.protocol,
      });

      return res.json({
        restricted: true,
        report: {
          protocol: report.protocol,
          modality: report.modality,
          category: report.category,
          urgency: report.urgency,
          status: report.status,
          area: report.area_name,
          aiConfirmed: report.ai_confirmed,
          hasAttachment: Boolean(report.has_attachment),
          createdAt: report.created_at,
          updatedAt: report.updated_at,
        },
        events: events.rows.map((event) => ({
          kind: event.kind,
          fromStatus: event.from_status,
          toStatus: event.to_status,
          author: event.author_label,
          visibility: event.visibility,
          at: event.created_at,
        })),
        auditLogs: logs.rows.map((log) => ({
          user: log.user_label,
          role: log.role ? ROLES[log.role] : null,
          action: log.action,
          detail: log.detail,
          at: log.created_at,
        })),
      });
    }

    if (!canAccessContent(user, report)) {
      return res.status(403).json({
        error: 'Este perfil acessa apenas denúncias encaminhadas à sua área.',
      });
    }

    const events = await pool.query(
      `SELECT kind, from_status, to_status, body, author_label, visibility, created_at
         FROM report_events WHERE report_id = $1 ORDER BY created_at ASC, id ASC`,
      [id],
    );
    const logs = await pool.query(
      `SELECT user_label, role, action, detail, created_at
         FROM audit_logs WHERE report_id = $1 ORDER BY created_at DESC, id DESC LIMIT 100`,
      [id],
    );

    const attachment = await pool.query(
      'SELECT filename, mimetype, size FROM attachments WHERE report_id = $1 ORDER BY id DESC LIMIT 1',
      [id],
    );

    await recordAudit({
      user,
      action: 'Visualizou a denúncia',
      reportId: id,
      protocol: report.protocol,
    });

    return res.json({
      restricted: false,
      report: {
        ...baseReportSummary(report),
        modality: report.modality,
        reporter: report.modality === 'identificada'
          ? {
              name: report.reporter_name,
              contactPreference: report.contact_preference,
              contactValue: report.contact_value,
            }
          : null,
        description: report.description,
        involved: report.involved,
        ai: {
          category: report.ai_category,
          confidence: report.ai_category_confidence,
          urgency: report.ai_urgency,
          area: report.ai_area,
          imminentRisk: report.ai_imminent_risk,
          sensitiveAlerts: report.ai_sensitive_flags || [],
          confirmed: report.ai_confirmed,
          confirmedAt: report.ai_confirmed_at,
        },
        attachment: attachment.rows[0] || null,
      },
      events: events.rows.map((event) => ({
        kind: event.kind,
        fromStatus: event.from_status,
        toStatus: event.to_status,
        body: event.body,
        author: event.author_label,
        visibility: event.visibility,
        at: event.created_at,
      })),
      auditLogs: logs.rows.map((log) => ({
        user: log.user_label,
        role: log.role ? ROLES[log.role] : null,
        action: log.action,
        detail: log.detail,
        at: log.created_at,
      })),
    });
  } catch (error) {
    return next(error);
  }
});

panelRouter.post('/reports/:id/ai-decision', requireRole('compliance', 'gestor'), async (req, res, next) => {
  const client = await pool.connect();
  try {
    const user = req.user;
    const report = await loadReport(req.params.id);
    if (!report) return res.status(404).json({ error: 'Denúncia não encontrada.' });
    if (!canAccessContent(user, report)) {
      return res.status(403).json({ error: 'Este perfil acessa apenas denúncias da sua área.' });
    }

    const accept = Boolean(req.body.accept);
    const category = accept ? report.ai_category : req.body.category;
    const urgency = accept ? report.ai_urgency : req.body.urgency;
    const areaName = accept ? report.ai_area : req.body.area;

    const fields = {};
    if (!OCCURRENCE_LABELS.includes(category)) fields.category = 'Selecione um tipo válido.';
    if (!URGENCIES.includes(urgency)) fields.urgency = 'Selecione uma urgência válida.';
    if (areaName && !AREAS.includes(areaName)) fields.area = 'Selecione uma área válida.';
    if (Object.keys(fields).length > 0) {
      return res.status(400).json({ error: 'Revise a classificação.', fields });
    }

    let areaId = report.area_id;
    if (areaName) {
      const areaResult = await client.query('SELECT id FROM areas WHERE name = $1', [areaName]);
      areaId = areaResult.rows[0] ? areaResult.rows[0].id : null;
    }

    await client.query('BEGIN');
    await client.query(
      `UPDATE reports
          SET category = $2, urgency = $3, area_id = $4, updated_at = now(),
              ai_confirmed = true, ai_confirmed_by = $5, ai_confirmed_at = now()
        WHERE id = $1`,
      [report.id, category, urgency, areaId, user.id],
    );

    await saveEvent(client, report.id, {
      kind: 'ai',
      body:
        `Classificação revisada por ${user.name}: tipo “${category}”, urgência “${urgency}”, ` +
        `área “${areaName || report.area_name || 'não definida'}”. ` +
        (accept ? 'Sugestão da IA confirmada pelo responsável humano.' : 'Sugestão da IA alterada pelo responsável humano.'),
      author: user.name,
      authorId: user.id,
    });

    await client.query('COMMIT');

    await recordAudit({
      user,
      action: accept ? 'Confirmou a sugestão da IA' : 'Alterou a classificação sugerida pela IA',
      reportId: report.id,
      protocol: report.protocol,
      detail: `Tipo: ${category}; urgência: ${urgency}; área: ${areaName || 'não definida'}`,
    });

    return res.json({ ok: true, category, urgency, area: areaName || report.area_name });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    return next(error);
  } finally {
    client.release();
  }
});

panelRouter.post('/reports/:id/status', requireRole('compliance', 'gestor'), async (req, res, next) => {
  const client = await pool.connect();
  try {
    const user = req.user;
    const report = await loadReport(req.params.id);
    if (!report) return res.status(404).json({ error: 'Denúncia não encontrada.' });
    if (!canAccessContent(user, report)) {
      return res.status(403).json({ error: 'Este perfil acessa apenas denúncias da sua área.' });
    }

    const status = String(req.body.status || '');
    const note = String(req.body.note || '').trim();
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Selecione um status válido.', fields: { status: 'Status inválido.' } });
    }
    if (note.length > 2000) {
      return res.status(400).json({ error: 'A observação deve ter no máximo 2.000 caracteres.' });
    }

    await client.query('BEGIN');
    await client.query('UPDATE reports SET status = $2, updated_at = now() WHERE id = $1', [report.id, status]);
    await saveEvent(client, report.id, {
      kind: 'status',
      fromStatus: report.status,
      toStatus: status,
      author: user.name,
      authorId: user.id,
      visibility: 'reporter',
    });
    if (note) {
      await saveEvent(client, report.id, {
        kind: 'note',
        body: note,
        author: user.name,
        authorId: user.id,
      });
    }
    await client.query('COMMIT');

    await recordAudit({
      user,
      action: 'Alterou o status',
      reportId: report.id,
      protocol: report.protocol,
      detail: `De “${report.status}” para “${status}”`,
    });

    return res.json({ ok: true, status });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    return next(error);
  } finally {
    client.release();
  }
});

panelRouter.post('/reports/:id/forward', requireRole('compliance', 'gestor'), async (req, res, next) => {
  const client = await pool.connect();
  try {
    const user = req.user;
    const report = await loadReport(req.params.id);
    if (!report) return res.status(404).json({ error: 'Denúncia não encontrada.' });
    if (!canAccessContent(user, report)) {
      return res.status(403).json({ error: 'Este perfil acessa apenas denúncias da sua área.' });
    }

    const areaName = String(req.body.area || '');
    const note = String(req.body.note || '').trim();
    if (!AREAS.includes(areaName)) {
      return res.status(400).json({ error: 'Selecione a área responsável.', fields: { area: 'Área inválida.' } });
    }

    const areaResult = await client.query('SELECT id FROM areas WHERE name = $1', [areaName]);
    if (!areaResult.rows[0]) {
      return res.status(400).json({ error: 'Área responsável não encontrada.' });
    }

    await client.query('BEGIN');
    await client.query(
      `UPDATE reports SET area_id = $2, status = 'Encaminhada', updated_at = now() WHERE id = $1`,
      [report.id, areaResult.rows[0].id],
    );
    await saveEvent(client, report.id, {
      kind: 'forward',
      fromStatus: report.status,
      toStatus: 'Encaminhada',
      body: `Denúncia encaminhada para a área ${areaName}.`,
      author: user.name,
      authorId: user.id,
      visibility: 'reporter',
    });
    if (note) {
      await saveEvent(client, report.id, {
        kind: 'note',
        body: note,
        author: user.name,
        authorId: user.id,
      });
    }
    await client.query('COMMIT');

    await recordAudit({
      user,
      action: 'Encaminhou a denúncia',
      reportId: report.id,
      protocol: report.protocol,
      detail: `Área: ${areaName}`,
    });

    return res.json({ ok: true, area: areaName, status: 'Encaminhada' });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    return next(error);
  } finally {
    client.release();
  }
});

panelRouter.post('/reports/:id/messages', requireRole('compliance', 'gestor'), async (req, res, next) => {
  try {
    const user = req.user;
    const report = await loadReport(req.params.id);
    if (!report) return res.status(404).json({ error: 'Denúncia não encontrada.' });
    if (!canAccessContent(user, report)) {
      return res.status(403).json({ error: 'Este perfil acessa apenas denúncias da sua área.' });
    }

    const body = String(req.body.body || '').trim();
    if (body.length < 2) {
      return res.status(400).json({ error: 'Escreva a resposta ao denunciante.', fields: { body: 'Resposta obrigatória.' } });
    }
    if (body.length > 4000) {
      return res.status(400).json({ error: 'A resposta deve ter no máximo 4.000 caracteres.' });
    }

    await pool.query(
      `INSERT INTO report_events (report_id, kind, body, author_label, author_user_id, visibility)
       VALUES ($1, 'message', $2, $3, $4, 'reporter')`,
      [report.id, body, user.name, user.id],
    );
    await pool.query('UPDATE reports SET updated_at = now() WHERE id = $1', [report.id]);

    await recordAudit({
      user,
      action: 'Respondeu ao denunciante',
      reportId: report.id,
      protocol: report.protocol,
    });

    return res.json({ ok: true });
  } catch (error) {
    return next(error);
  }
});

panelRouter.post('/reports/:id/notes', requireRole('compliance', 'gestor'), async (req, res, next) => {
  try {
    const user = req.user;
    const report = await loadReport(req.params.id);
    if (!report) return res.status(404).json({ error: 'Denúncia não encontrada.' });
    if (!canAccessContent(user, report)) {
      return res.status(403).json({ error: 'Este perfil acessa apenas denúncias da sua área.' });
    }

    const body = String(req.body.body || '').trim();
    if (body.length < 2) {
      return res.status(400).json({ error: 'Escreva a observação interna.', fields: { body: 'Observação obrigatória.' } });
    }
    if (body.length > 4000) {
      return res.status(400).json({ error: 'A observação deve ter no máximo 4.000 caracteres.' });
    }

    await pool.query(
      `INSERT INTO report_events (report_id, kind, body, author_label, author_user_id, visibility)
       VALUES ($1, 'note', $2, $3, $4, 'internal')`,
      [report.id, body, user.name, user.id],
    );
    await pool.query('UPDATE reports SET updated_at = now() WHERE id = $1', [report.id]);

    await recordAudit({
      user,
      action: 'Registrou observação interna',
      reportId: report.id,
      protocol: report.protocol,
    });

    return res.json({ ok: true });
  } catch (error) {
    return next(error);
  }
});

panelRouter.get('/reports/:id/attachment', async (req, res, next) => {
  try {
    const user = req.user;
    if (user.role === 'auditoria') {
      return res.status(403).json({ error: 'O perfil de auditoria não acessa o conteúdo da denúncia.' });
    }
    const report = await loadReport(req.params.id);
    if (!report) return res.status(404).json({ error: 'Denúncia não encontrada.' });
    if (!canAccessContent(user, report)) {
      return res.status(403).json({ error: 'Este perfil acessa apenas denúncias da sua área.' });
    }

    const { rows } = await pool.query(
      'SELECT filename, mimetype, data FROM attachments WHERE report_id = $1 ORDER BY id DESC LIMIT 1',
      [report.id],
    );
    if (!rows[0]) return res.status(404).json({ error: 'Esta denúncia não possui anexo.' });

    await recordAudit({
      user,
      action: 'Baixou o anexo da denúncia',
      reportId: report.id,
      protocol: report.protocol,
    });

    res.setHeader('Content-Type', rows[0].mimetype);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(rows[0].filename)}"`);
    return res.send(rows[0].data);
  } catch (error) {
    return next(error);
  }
});

panelRouter.get('/logs', requireRole('compliance', 'auditoria'), async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 200, 500);
    const { rows } = await pool.query(
      `SELECT user_label, role, action, report_protocol, detail, created_at
         FROM audit_logs
        ORDER BY created_at DESC, id DESC
        LIMIT $1`,
      [limit],
    );

    return res.json({
      logs: rows.map((row) => ({
        user: row.user_label,
        role: row.role ? ROLES[row.role] : null,
        action: row.action,
        protocol: row.report_protocol,
        detail: row.detail,
        at: row.created_at,
      })),
    });
  } catch (error) {
    return next(error);
  }
});
