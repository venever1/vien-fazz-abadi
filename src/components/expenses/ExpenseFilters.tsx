import type { ExpenseCategory } from '../../types';
import { Button } from '../common';

interface ExpenseFiltersProps {
  search: string;
  category: ExpenseCategory | 'Semua';
  month: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: ExpenseCategory | 'Semua') => void;
  onMonthChange: (value: string) => void;
  onAdd?: () => void;
  onExport: () => void;
  onExportExcel?: () => void;
  onExportPdf?: () => void;
}

export const ExpenseFilters = ({
  search,
  category,
  month,
  onSearchChange,
  onCategoryChange,
  onMonthChange,
  onAdd,
  onExport,
  onExportExcel,
  onExportPdf,
}: ExpenseFiltersProps) => {
  const categories: ExpenseCategory[] = [
    'Bahan Baku Sabun',
    'Bahan Baku Shampo',
    'Bahan Baku Semir',
    'Kemasan & Botol',
    'Operasional',
    'Lainnya',
  ];

  return (
    <div className="toolbar">
      <input
        className="toolbar__search"
        placeholder="Cari pengeluaran..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <div className="toolbar__group">
        <select
          className="field__input"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value as any)}
        >
          <option value="Semua">Semua Kategori</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          type="month"
          className="field__input"
          value={month === 'Semua' ? '' : month}
          onChange={(e) => onMonthChange(e.target.value || 'Semua')}
          style={{ width: 'auto' }}
        />
        <Button variant="secondary" size="sm" onClick={onExport}>CSV</Button>
        {onExportExcel && <Button variant="secondary" size="sm" onClick={onExportExcel}>Excel</Button>}
        {onExportPdf && <Button variant="secondary" size="sm" onClick={onExportPdf}>PDF</Button>}
        {onAdd && <Button variant="primary" size="sm" onClick={onAdd}>+ Tambah Pengeluaran</Button>}
      </div>
    </div>
  );
};
