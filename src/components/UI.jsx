import { useState } from 'react';
import { AlertTriangleIcon, CheckIcon, CopyIcon, InfoIcon, ShieldAlertIcon } from './Icons';

export function Badge({ tone = 'slate', children }) {
  return <span className="badge" data-tone={tone}>{children}</span>;
}

export function Alert({ tone = 'info', title, children }) {
  const icons = {
    info: <InfoIcon size={18} />,
    success: <CheckIcon size={18} />,
    warn: <AlertTriangleIcon size={18} />,
    danger: <ShieldAlertIcon size={18} />,
    neutral: <InfoIcon size={18} />,
  };
  return (
    <div className="alert" data-tone={tone} role={tone === 'danger' ? 'alert' : undefined}>
      <span style={{ marginTop: 1 }}>{icons[tone] || icons.info}</span>
      <div>
        {title ? <strong>{title}</strong> : null}
        {children}
      </div>
    </div>
  );
}

export function Field({ label, htmlFor, hint, error, children }) {
  return (
    <div className="field">
      {label ? <label htmlFor={htmlFor}>{label}</label> : null}
      {children}
      {error ? <span className="error-text">{error}</span> : hint ? <span className="hint">{hint}</span> : null}
    </div>
  );
}

export function Loading({ label = 'Carregando…' }) {
  return (
    <div className="loading-block">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({ title, children }) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      {children}
    </div>
  );
}

export function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button type="button" className="copy-btn" onClick={copy} aria-label={`${label} ${value}`}>
      {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
      {copied ? 'Copiado' : label}
    </button>
  );
}

export function BarChart({ title, note, data, maxOverride }) {
  const max = maxOverride || Math.max(1, ...data.map((item) => item.value));
  return (
    <div className="chart-card">
      <h2>{title}</h2>
      {note ? <p>{note}</p> : null}
      {data.length === 0 ? (
        <p className="chart-empty">Sem dados para exibir.</p>
      ) : (
        <div className="bar-rows">
          {data.map((item) => (
            <div className="bar-row" key={item.label}>
              <span className="bar-label" title={item.label}>{item.label}</span>
              <span className="bar-track">
                <span
                  className="bar-fill"
                  data-tone={item.tone || 'navy'}
                  style={{ width: `${Math.round((item.value / max) * 100)}%` }}
                />
              </span>
              <span className="bar-count">{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
