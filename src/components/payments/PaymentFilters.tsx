import type { PaymentStatus } from '../../types';
import { Button } from '../common';

type PaymentStatusFilter = PaymentStatus | 'Semua';

interface PaymentFiltersProps {
  search: string;
  statusFilter: PaymentStatusFilter;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (status: PaymentStatusFilter) => void;
  onExport?: () => void;
  onExportExcel?: () => void;
  onExportPdf?: () => void;
}

export const PaymentFilters = ({
  search,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onExport,
  onExportExcel,
  onExportPdf,
}: PaymentFiltersProps) => {
  return (
    <div className="toolbar">
      <input
        className="toolbar__search"
        placeholder="Cari perusahaan..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Cari perusahaan"
      />
      <div className="toolbar__group">
        <select
          className="field__input"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as PaymentStatusFilter)}
          aria-label="Filter status pembayaran"
          style={{ width: 'auto', padding: '8px 12px' }}
        >
          <option value="Semua">Semua Status</option>
          <option value="Belum Bayar">Belum Bayar</option>
          <option value="Cicilan">Cicilan</option>
          <option value="Lunas">Lunas</option>
        </select>
        {onExport && (
          <Button variant="secondary" size="sm" onClick={onExport}>
            Export CSV
          </Button>
        )}
        {onExportExcel && (
          <Button variant="secondary" size="sm" onClick={onExportExcel}>
            Export Excel
          </Button>
        )}
        {onExportPdf && (
          <Button variant="secondary" size="sm" onClick={onExportPdf}>
            Export PDF
          </Button>
        )}
      </div>
    </div>
  );
};