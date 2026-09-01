import type { ExpenseCategory } from '../../types';

interface ExpenseCategoryBadgeProps {
  category: ExpenseCategory;
}

const CATEGORY_CLASSES: Record<ExpenseCategory, string> = {
  'Bahan Baku Sabun': 'badge--ok',
  'Bahan Baku Shampo': 'badge--teal',
  'Bahan Baku Semir': 'badge--amber',
  'Kemasan & Botol': 'badge--muted',
  Operasional: 'badge--danger',
  Lainnya: 'badge--purple',
};

export const ExpenseCategoryBadge = ({ category }: ExpenseCategoryBadgeProps) => {
  const badgeClass = CATEGORY_CLASSES[category] || 'badge--muted';

  return (
    <span className={`badge ${badgeClass}`}>
      <span className="badge__dot" aria-hidden="true" />
      <span>{category}</span>
    </span>
  );
};
