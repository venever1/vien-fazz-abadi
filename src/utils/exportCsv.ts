interface CsvColumn<T> {
  header: string;
  getValue: (row: T) => string | number;
}

const escapeCsv = (raw: string | number): string => {
  const s = String(raw ?? '');
  if (/[",\n;]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
};

export const exportToCsv = <T,>(
  rows: T[],
  columns: CsvColumn<T>[],
  filename: string,
): void => {
  const headerLine = columns.map((c) => escapeCsv(c.header)).join(',');
  const bodyLines = rows
    .map((row) => columns.map((c) => escapeCsv(c.getValue(row))).join(','))
    .join('\r\n');

  const csv = headerLine + '\r\n' + bodyLines;

  const bom = '﻿';
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
