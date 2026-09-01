const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const compactFormatter = new Intl.NumberFormat('id-ID', {
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 1,
});

export const formatRupiah = (value: number): string => rupiahFormatter.format(value);

export const formatRupiahCompact = (value: number): string => {
  if (!Number.isFinite(value)) return rupiahFormatter.format(0);
  if (Math.abs(value) < 1000) return rupiahFormatter.format(value);
  const compact = compactFormatter.format(value);
  return `Rp ${compact.replace(/\s/g, '')}`;
};

export const parseRupiahInput = (raw: string): number => {
  if (!raw) return 0;
  const cleaned = raw.replace(/[^0-9,-]/g, '').replace(',', '.');
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : 0;
};