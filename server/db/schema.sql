CREATE TABLE IF NOT EXISTS areas (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('compliance', 'gestor', 'auditoria')),
  area_id INTEGER REFERENCES areas(id),
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS report_protocol_seq START WITH 1;

CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  protocol TEXT NOT NULL UNIQUE,
  access_code_hash TEXT NOT NULL,
  modality TEXT NOT NULL CHECK (modality IN ('anonima', 'identificada')),
  reporter_name TEXT,
  contact_preference TEXT CHECK (contact_preference IN ('email', 'whatsapp')),
  contact_value TEXT,
  description TEXT NOT NULL,
  involved TEXT,
  category TEXT NOT NULL,
  urgency TEXT NOT NULL DEFAULT 'Médio',
  status TEXT NOT NULL DEFAULT 'Recebida'
    CHECK (status IN ('Recebida', 'Em triagem', 'Em análise', 'Encaminhada', 'Concluída', 'Arquivada')),
  area_id INTEGER REFERENCES areas(id),
  ai_category TEXT,
  ai_category_confidence INTEGER,
  ai_urgency TEXT,
  ai_area TEXT,
  ai_imminent_risk BOOLEAN NOT NULL DEFAULT false,
  ai_sensitive_flags JSONB NOT NULL DEFAULT '[]'::jsonb,
  ai_confirmed BOOLEAN NOT NULL DEFAULT false,
  ai_confirmed_by INTEGER REFERENCES users(id),
  ai_confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS attachments (
  id SERIAL PRIMARY KEY,
  report_id INTEGER NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  mimetype TEXT NOT NULL,
  size INTEGER NOT NULL,
  data BYTEA NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS report_events (
  id SERIAL PRIMARY KEY,
  report_id INTEGER NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('opened', 'status', 'message', 'note', 'ai', 'forward')),
  from_status TEXT,
  to_status TEXT,
  body TEXT,
  author_label TEXT NOT NULL,
  author_user_id INTEGER REFERENCES users(id),
  visibility TEXT NOT NULL DEFAULT 'internal' CHECK (visibility IN ('internal', 'reporter')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  user_label TEXT NOT NULL,
  role TEXT,
  action TEXT NOT NULL,
  report_id INTEGER,
  report_protocol TEXT,
  detail TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS reports_status_idx ON reports (status);
CREATE INDEX IF NOT EXISTS reports_category_idx ON reports (category);
CREATE INDEX IF NOT EXISTS reports_urgency_idx ON reports (urgency);
CREATE INDEX IF NOT EXISTS reports_area_idx ON reports (area_id);
CREATE INDEX IF NOT EXISTS report_events_report_idx ON report_events (report_id, created_at);
CREATE INDEX IF NOT EXISTS audit_logs_created_idx ON audit_logs (created_at DESC);
