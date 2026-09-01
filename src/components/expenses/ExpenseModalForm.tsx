import type { FormEvent } from 'react';
import type { Expense, ExpenseCategory } from '../../types';
import { ExpenseCategoryBadge } from './ExpenseCategoryBadge';
import { formatRupiah } from '../../utils/currency';

interface ExpenseModalFormProps {
  formData: Partial<Expense>;
  onChange: (field: keyof Expense, value: string | number) => void;
  errors: Record<string, string>;
  onSubmit: (e: FormEvent) => void;
  loading?: boolean;
}

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Bahan Baku Sabun',
  'Bahan Baku Shampo',
  'Bahan Baku Semir',
  'Kemasan & Botol',
  'Operasional',
  'Lainnya',
];

export const ExpenseModalForm = ({
  formData,
  onChange,
  errors,
  onSubmit,
}: ExpenseModalFormProps) => {
  const amountNum = typeof formData.amount === 'number' ? formData.amount : 0;

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="field">
        <label className="field__label" htmlFor="expense-description">
          Keterangan *
        </label>
        <input
          id="expense-description"
          className={`field__input ${errors.description ? 'field__input--error' : ''}`}
          placeholder="cth. Pembelian bahan baku sabun"
          value={formData.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
          required
        />
        {errors.description && <span className="field__error">{errors.description}</span>}
      </div>

      <div className="field">
        <label className="field__label" htmlFor="expense-category">
          Kategori *
        </label>
        <div className="field__select-wrapper">
          <select
            id="expense-category"
            className={`field__select ${errors.category ? 'field__select--error' : ''}`}
            value={formData.category || ''}
            onChange={(e) => onChange('category', e.target.value)}
            required
          >
            <option value="" disabled>Pilih kategori</option>
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                <ExpenseCategoryBadge category={cat} />
                <span style={{ color: 'inherit', textDecoration: 'none' }} className="badge-text">{cat}</span>
              </option>
            ))}
          </select>
        </div>
        {errors.category && <span className="field__error">{errors.category}</span>}
      </div>

      <div className="field">
        <label className="field__label" htmlFor="expense-date">
          Tanggal *
        </label>
        <input
          id="expense-date"
          type="date"
          className={`field__input ${errors.transaction_date ? 'field__input--error' : ''}`}
          value={formData.transaction_date || ''}
          onChange={(e) => onChange('transaction_date', e.target.value)}
          required
        />
        {errors.transaction_date && <span className="field__error">{errors.transaction_date}</span>}
      </div>

      <div className="field">
        <label className="field__label" htmlFor="expense-amount">
          Jumlah (Rp) *
        </label>
        <input
          id="expense-amount"
          type="number"
          className={`field__input ${errors.amount ? 'field__input--error' : ''}`}
          placeholder="cth. 5000000"
          value={formData.amount === undefined ? '' : String(formData.amount)}
          onChange={(e) => onChange('amount', Number(e.target.value))}
          required
        />
        {errors.amount && <span className="field__error">{errors.amount}</span>}
      </div>

      <div style={{ padding: '8px 12px', background: 'var(--panel-2)', borderRadius: '8px', fontSize: '13px' }}>
        <span style={{ color: 'var(--ink-dim)' }}>Total: </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{formatRupiah(amountNum)}</span>
      </div>
    </form>
  );
};
