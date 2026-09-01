export const normalizePhoneForWa = (phone: string): string => {
  const digits = phone.replace(/[^\d]/g, '');
  if (!digits) return '';
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;
  if (digits.startsWith('62')) return digits;
  return `62${digits}`;
};

export const buildWhatsAppLink = (phone: string, message: string): string => {
  const number = normalizePhoneForWa(phone);
  if (!number) return '';
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};
