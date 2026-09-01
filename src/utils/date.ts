const MONTH_NAMES_ID = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
] as const;

const FULL_MONTH_NAMES_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
] as const;

const padTwo = (value: number): string => value.toString().padStart(2, '0');

export const formatDateId = (input: string | Date): string => {
  const date = input instanceof Date ? input : parseIsoDate(input);
  if (!date) return '';
  const day = padTwo(date.getDate());
  const month = MONTH_NAMES_ID[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

export const formatMonthYearId = (input: string | Date): string => {
  const date = input instanceof Date ? input : parseIsoDate(input);
  if (!date) return '';
  const month = FULL_MONTH_NAMES_ID[date.getMonth()];
  return `${month} ${date.getFullYear()}`;
};

export const parseIsoDate = (value: string): Date | null => {
  if (!value) return null;
  const [year, month, day] = value.split('-').map((part) => Number(part));
  if (!year || !month || !day) return null;
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
};

export const toIsoDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = padTwo(date.getMonth() + 1);
  const day = padTwo(date.getDate());
  return `${year}-${month}-${day}`;
};

export const getYearMonth = (value: string | Date): string => {
  const date = value instanceof Date ? value : parseIsoDate(value);
  if (!date) return '';
  return `${date.getFullYear()}-${padTwo(date.getMonth() + 1)}`;
};

export const isWithinPeriod = (
  value: string | Date,
  start: string,
  end: string,
): boolean => {
  const date = value instanceof Date ? value : parseIsoDate(value);
  const startDate = parseIsoDate(start);
  const endDate = parseIsoDate(end);
  if (!date || !startDate || !endDate) return false;
  return date.getTime() >= startDate.getTime() && date.getTime() <= endDate.getTime();
};

export const getMonthsRange = (
  endInput: string | Date,
  monthsBack: number,
): { start: string; end: string } => {
  const endDate =
    endInput instanceof Date ? new Date(endInput) : parseIsoDate(endInput) ?? new Date();
  const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - (monthsBack - 1), 1);
  return {
    start: toIsoDate(startDate),
    end: toIsoDate(endDate),
  };
};

export const isOverdue = (
  dueDate: string | Date,
  referenceDate: string | Date = new Date(),
): boolean => {
  const due = dueDate instanceof Date ? dueDate : parseIsoDate(dueDate);
  const ref =
    referenceDate instanceof Date
      ? referenceDate
      : parseIsoDate(referenceDate) ?? new Date();
  if (!due) return false;
  return due.getTime() < ref.getTime();
};
