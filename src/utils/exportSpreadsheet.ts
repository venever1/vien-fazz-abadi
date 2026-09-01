interface SheetColumn<T> {
  header: string;
  getValue: (row: T) => string | number;
}

const escapeHtml = (raw: string | number): string => {
  const s = String(raw ?? '');
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

const buildTableHtml = <T,>(rows: T[], columns: SheetColumn<T>[]): string => {
  const head = columns.map((c) => `<th>${escapeHtml(c.header)}</th>`).join('');
  const body = rows
    .map(
      (row) =>
        `<tr>${columns.map((c) => `<td>${escapeHtml(c.getValue(row))}</td>`).join('')}</tr>`,
    )
    .join('');
  return `<table border="1" cellpadding="6" cellspacing="0">${head ? `<thead><tr>${head}</tr></thead>` : ''}${body ? `<tbody>${body}</tbody>` : ''}</table>`;
};

const triggerDownload = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToExcel = <T,>(
  rows: T[],
  columns: SheetColumn<T>[],
  title: string,
): void => {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title></head><body>${buildTableHtml(rows, columns)}</body></html>`;
  const blob = new Blob([`\ufeff${html}`], {
    type: 'application/vnd.ms-excel;charset=utf-8;',
  });
  const name = title.endsWith('.xls') ? title : `${title}.xls`;
  triggerDownload(blob, name);
};

export const exportToPdf = <T,>(
  rows: T[],
  columns: SheetColumn<T>[],
  title: string,
): void => {
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (!printWindow) return;

  printWindow.document.write(`<!doctype html><html lang="id"><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>
    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; margin: 24px; color: #111; }
    h1 { font-size: 16px; margin-bottom: 8px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #999; padding: 6px 8px; text-align: left; }
    th { background: #eee; }
  </style></head><body><h1>${escapeHtml(title)}</h1>${buildTableHtml(rows, columns)}</body></html>`);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};
