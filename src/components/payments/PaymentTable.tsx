import type { PaymentRow } from '../../application/payments/getPaymentRows';
import { formatRupiah } from '../../utils/currency';
import { formatDateId } from '../../utils/date';
import { Button, ProgressBar, StatusBadge } from '../common';

interface PaymentTableProps {
  rows: PaymentRow[];
  onMarkAsPaid: (row: PaymentRow) => void;
  onDelete: (row: PaymentRow) => void;
  onViewHistory: (row: PaymentRow) => void;
  onViewDetail: (row: PaymentRow) => void;
  canDelete?: boolean;
}

export const PaymentTable = ({ rows, onMarkAsPaid, onDelete, onViewHistory, onViewDetail, canDelete = true }: PaymentTableProps) => {
  if (rows.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--ink-dim)' }}>
        Belum ada data perusahaan.
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Perusahaan</th>
            <th>Produk</th>
            <th>Tagihan</th>
            <th>Jatuh Tempo</th>
            <th>Progress Cicilan</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.invoiceId}>
              <td>
                <span className="table__cell--title">{row.companyName}</span>
                <span className="table__cell--subtitle">{row.businessDescription}</span>
              </td>
              <td>{row.productName}</td>
              <td className="table__cell--mono">{formatRupiah(row.totalAmount)}</td>
              <td>{formatDateId(row.dueDate)}</td>
              <td>
                <div style={{ width: '120px' }}>
                  <ProgressBar progress={row.progress} />
                </div>
              </td>
              <td>
                <StatusBadge status={row.status} />
              </td>
              <td>
                <div className="toolbar__group">
                  {row.status === 'Cicilan' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onMarkAsPaid(row)}
                    >
                      Bayar Cicilan
                    </Button>
                  )}
                  {row.status === 'Belum Bayar' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onMarkAsPaid(row)}
                    >
                      Catat Pembayaran
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onViewDetail(row)}
                  >
                    Detail
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onViewHistory(row)}
                  >
                    Riwayat
                  </Button>
                  {canDelete && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDelete(row)}
                    >
                      Hapus
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
