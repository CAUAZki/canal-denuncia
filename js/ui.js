// Utilitários de tela: formatação, componentes pequenos e gráficos.
window.UI = (function () {
  function esc(value) {
    return String(value === null || value === undefined ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function fmtDateTime(value) {
    if (!value) return '—';
    const date = new Date(value);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  }

  function fmtDate(value) {
    if (!value) return '—';
    const date = new Date(value);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  function fmtBytes(bytes) {
    if (!bytes && bytes !== 0) return '—';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  const urgencyTone = { 'Baixo': 'slate', 'Médio': 'amber', 'Alto': 'orange', 'Prioridade Máxima': 'solid-red' };
  const statusTone = {
    'Recebida': 'blue', 'Em triagem': 'slate', 'Em análise': 'amber',
    'Encaminhada': 'blue', 'Concluída': 'green', 'Arquivada': 'slate',
  };

  function badge(text, tone) {
    return '<span class="badge" data-tone="' + esc(tone || 'slate') + '">' + esc(text) + '</span>';
  }

  function alertBox(tone, title, body) {
    const icons = {
      info: 'info', success: 'check', warn: 'alertTriangle', danger: 'shieldAlert', neutral: 'info',
    };
    return '<div class="alert" data-tone="' + esc(tone || 'info') + '"' +
      (tone === 'danger' ? ' role="alert"' : '') + '>' +
      '<span style="margin-top:1px">' + Icons.svg(icons[tone] || 'info', 18) + '</span>' +
      '<div>' + (title ? '<strong>' + esc(title) + '</strong>' : '') + (body || '') + '</div>' +
      '</div>';
  }

  function barChart(title, note, rows) {
    const max = Math.max(1, Math.max.apply(null, rows.map(function (row) { return row.value; })));
    const body = rows.length === 0
      ? '<p class="chart-empty">Sem dados para exibir.</p>'
      : '<div class="bar-rows">' + rows.map(function (row) {
        const width = Math.round((row.value / max) * 100);
        return '<div class="bar-row">' +
          '<span class="bar-label" title="' + esc(row.label) + '">' + esc(row.label) + '</span>' +
          '<span class="bar-track"><span class="bar-fill" data-tone="' + esc(row.tone || 'navy') + '" style="width:' + width + '%"></span></span>' +
          '<span class="bar-count">' + row.value + '</span>' +
          '</div>';
      }).join('') + '</div>';

    return '<div class="chart-card"><h2>' + esc(title) + '</h2>' +
      (note ? '<p>' + esc(note) + '</p>' : '') + body + '</div>';
  }

  function copyButton(value, label) {
    return '<button type="button" class="copy-btn" data-copy="' + esc(value) + '" aria-label="' + esc(label + ' ' + value) + '">' +
      '<span data-copy-icon>' + Icons.svg('copy', 14) + '</span><span data-copy-label>' + esc(label) + '</span></button>';
  }

  function emptyState(title, body) {
    return '<div class="empty-state"><strong>' + esc(title) + '</strong>' + (body || '') + '</div>';
  }

  function errorText(message) {
    return message ? '<span class="error-text">' + esc(message) + '</span>' : '';
  }

  function onClick(root, selector, handler) {
    root.querySelectorAll(selector).forEach(function (element) {
      element.addEventListener('click', function (event) {
        handler(element, event);
      });
    });
  }

  return {
    esc: esc,
    fmtDateTime: fmtDateTime,
    fmtDate: fmtDate,
    fmtBytes: fmtBytes,
    urgencyTone: urgencyTone,
    statusTone: statusTone,
    badge: badge,
    alertBox: alertBox,
    barChart: barChart,
    copyButton: copyButton,
    emptyState: emptyState,
    errorText: errorText,
    onClick: onClick,
  };
})();
