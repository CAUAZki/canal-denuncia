import { Router } from 'express';
import multer from 'multer';
import crypto from 'node:crypto';
import { pool } from '../db/pool.js';
import { generateAccessCode, hashAccessCode } from '../lib/auth.js';
import { analyzeReport } from '../ai/analyzer.js';
import { OCCURRENCE_LABELS } from '../../shared/catalog.js';

export const publicRouter = Router();

const ALLOWED_MIME = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME.includes(file.mimetype)) {
      const error = new Error('Formato de anexo não aceito. Envie PDF, imagem, DOCX ou TXT.');
      error.code = 'INVALID_FILE_TYPE';
      return cb(error);
    }
    return cb(null, true);
  },
});

function normalizeProtocol(value) {
  return String(value || '').trim().toUpperCase();
}

function safeEqualHex(a, b) {
  const bufA = Buffer.from(String(a), 'hex');
  const bufB = Buffer.from(String(b), 'hex');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

publicRouter.post('/reports/analyze', async (req, res, next) => {
  try {
    const description = String(req.body.description || '').slice(0, 8000);
    const involved = String(req.body.involved || '').slice(0, 2000);
    const category = String(req.body.category || '');

    if (description.trim().length < 20) {
      return res.json({ sensitiveAlerts: [] });
    }

    const analysis = analyzeReport({ description, involved, selectedCategory: category });
    return res.json({ sensitiveAlerts: analysis.sensitiveAlerts });
  } catch (error) {
    return next(error);
  }
});

publicRouter.post('/reports', (req, res, next) => {
  upload.single('attachment')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'O anexo deve ter no máximo 5 MB.' });
      }
      if (err.code === 'INVALID_FILE_TYPE') {
        return res.status(400).json({ error: err.message });
      }
      return next(err);
    }
    return next();
  });
}, async (req, res, next) => {
  const client = await pool.connect();
  try {
    const consent = String(req.body.consent) === 'true';
    const modality = String(req.body.modality || '').trim();
    const description = String(req.body.description || '').trim();
    const involved = String(req.body.involved || '').trim();
    const category = String(req.body.category || '').trim();
    const reporterName = String(req.body.reporterName || '').trim();
    const contactPreference = String(req.body.contactPreference || '').trim();
    const contactValue = String(req.body.contactValue || '').trim();

    const fields = {};
    if (!consent) fields.consent = 'É necessário aceitar o termo de consentimento informado.';
    if (!['anonima', 'identificada'].includes(modality)) {
      fields.modality = 'Escolha a modalidade da denúncia.';
    }
    if (description.length < 40) {
      fields.description = 'Descreva o relato com pelo menos 40 caracteres (o que, quando, onde e como).';
    } else if (description.length > 8000) {
      fields.description = 'O relato deve ter no máximo 8.000 caracteres.';
    }
    if (involved.length > 2000) {
      fields.involved = 'O campo de pessoas envolvidas deve ter no máximo 2.000 caracteres.';
    }
    if (!OCCURRENCE_LABELS.includes(category)) {
      fields.category = 'Selecione o tipo de ocorrência.';
    }
    if (reporterName.length > 120) {
      fields.reporterName = 'O nome deve ter no máximo 120 caracteres.';
    }

    let contactPreferenceValue = null;
    let contactValueValue = null;
    if (modality === 'identificada' && contactPreference) {
      if (!['email', 'whatsapp'].includes(contactPreference)) {
        fields.contactPreference = 'Escolha e-mail ou WhatsApp como preferência de contato.';
      } else if (!contactValue) {
        fields.contactValue = 'Informe o contato correspondente à preferência escolhida.';
      } else if (contactPreference === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactValue)) {
        fields.contactValue = 'Informe um e-mail válido.';
      } else if (contactPreference === 'whatsapp' && !/^\d{10,13}$/.test(contactValue.replace(/\D/g, ''))) {
        fields.contactValue = 'Informe um WhatsApp válido com DDD.';
      } else {
        contactPreferenceValue = contactPreference;
        contactValueValue = contactValue;
      }
    }

    if (Object.keys(fields).length > 0) {
      return res.status(400).json({ error: 'Revise os campos indicados antes de enviar.', fields });
    }

    const analysis = analyzeReport({ description, involved, selectedCategory: category });

    await client.query('BEGIN');

    const seq = await client.query("SELECT nextval('report_protocol_seq') AS n");
    const protocol = `CS-${new Date().getFullYear()}-${String(seq.rows[0].n).padStart(5, '0')}`;
    const accessCode = generateAccessCode();

    const inserted = await client.query(
      `INSERT INTO reports (
         protocol, access_code_hash, modality, reporter_name, contact_preference, contact_value,
         description, involved, category, urgency, status,
         ai_category, ai_category_confidence, ai_urgency, ai_area, ai_imminent_risk, ai_sensitive_flags
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'Recebida', $11, $12, $13, $14, $15, $16)
       RETURNING id, protocol, status, urgency, category, created_at`,
      [
        protocol,
        hashAccessCode(accessCode),
        modality,
        modality === 'identificada' ? reporterName || null : null,
        contactPreferenceValue,
        contactValueValue,
        description,
        involved || null,
        category,
        analysis.urgency,
        analysis.suggestedCategory,
        analysis.confidence,
        analysis.urgency,
        analysis.area,
        analysis.imminentRisk,
        JSON.stringify(analysis.sensitiveAlerts),
      ],
    );

    const report = inserted.rows[0];

    if (req.file) {
      await client.query(
        `INSERT INTO attachments (report_id, filename, mimetype, size, data)
         VALUES ($1, $2, $3, $4, $5)`,
        [report.id, req.file.originalname.slice(0, 200), req.file.mimetype, req.file.size, req.file.buffer],
      );
    }

    await client.query(
      `INSERT INTO report_events (report_id, kind, to_status, body, author_label, visibility)
       VALUES ($1, 'opened', 'Recebida', $2, 'Denunciante', 'reporter')`,
      [report.id, 'Denúncia registrada com sucesso. Protocolo gerado automaticamente.'],
    );

    await client.query(
      `INSERT INTO report_events (report_id, kind, body, author_label, visibility)
       VALUES ($1, 'ai', $2, 'Apoio de IA', 'internal')`,
      [
        report.id,
        `Sugestão gerada: tipo “${analysis.suggestedCategory}” (${analysis.confidence}% de confiança), ` +
          `urgência “${analysis.urgency}”, área sugerida “${analysis.area}”. ` +
          `Sinais de dados sensíveis: ${analysis.sensitiveAlerts.length}. ` +
          `Linguagem de risco iminente: ${analysis.imminentRisk ? 'sim' : 'não'}.`,
      ],
    );

    await client.query('COMMIT');

    return res.status(201).json({
      protocol: report.protocol,
      accessCode,
      status: report.status,
      category: report.category,
      urgency: report.urgency,
      ai: {
        suggestedCategory: analysis.suggestedCategory,
        confidence: analysis.confidence,
        urgency: analysis.urgency,
        area: analysis.area,
        imminentRisk: analysis.imminentRisk,
        sensitiveAlerts: analysis.sensitiveAlerts,
      },
      createdAt: report.created_at,
    });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    return next(error);
  } finally {
    client.release();
  }
});

publicRouter.post('/reports/track', async (req, res, next) => {
  try {
    const protocol = normalizeProtocol(req.body.protocol);
    const code = String(req.body.code || '');

    if (!protocol || !code) {
      return res.status(400).json({ error: 'Informe o protocolo e o código de acesso.' });
    }

    const { rows } = await pool.query(
      `SELECT r.*, a.name AS area_name
         FROM reports r
         LEFT JOIN areas a ON a.id = r.area_id
        WHERE r.protocol = $1`,
      [protocol],
    );

    const report = rows[0];
    if (!report || !safeEqualHex(report.access_code_hash, hashAccessCode(code))) {
      return res.status(404).json({
        error: 'Protocolo ou código de acesso inválidos. Confira os dados e tente novamente.',
      });
    }

    const events = await pool.query(
      `SELECT kind, from_status, to_status, body, created_at
         FROM report_events
        WHERE report_id = $1 AND visibility = 'reporter'
        ORDER BY created_at ASC, id ASC`,
      [report.id],
    );

    return res.json({
      protocol: report.protocol,
      status: report.status,
      category: report.category,
      urgency: report.urgency,
      area: report.area_name,
      createdAt: report.created_at,
      updatedAt: report.updated_at,
      timeline: events.rows.map((event) => ({
        kind: event.kind,
        fromStatus: event.from_status,
        toStatus: event.to_status,
        body: event.body,
        at: event.created_at,
      })),
    });
  } catch (error) {
    return next(error);
  }
});

publicRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'canal-seguro-ia' });
});
