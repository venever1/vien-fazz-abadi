import { useEffect, useState } from 'react';
import type { Payment } from '../../types';
import { getPaymentsByInvoiceId } from '../../services/repositories/paymentRepository';
import { formatRupiah } from '../../utils/currency';
import { formatDateId } from '../../utils/date';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface PaymentHistoryProps {
  open: boolean;
  invoiceId: string | null;
  onClose: () => void;
}

interface PaymentHistoryState {
  payments: Payment[];
  loading: boolean;
  error: string | null;
}

export const PaymentHistory = ({ open, invoiceId, onClose }: PaymentHistoryProps) => {
  const [state, setState] = useState<PaymentHistoryState>({
    payments: [],
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!open || !invoiceId) return;

    const load = async () => {
      setState({ payments: [], loading: true, error: null });
      try {
        const payments = await getPaymentsByInvoiceId(invoiceId);
        setState({ payments, loading: false, error: null });
      } catch (e) {
        setState({ payments: [], loading: false, error: 'Gagal memuat riwayat pembayaran.' });
      }
    };
    load();
  }, [open, invoiceId]);

  if (!open || !invoiceId) return null;

  return (
    <Modal
      open={open}
      title="Histori Pembayaran"
      onClose={onClose}
      hint="Riwayat pembayaran untuk invoice ini"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Tutup
        </Button>
      }
    >
      {state.loading ? (
        <div>Loading...</div>
      ) : state.error ? (
        <div className="inline-alert inline-alert--error" role="alert">
          {state.error}
        </div>
      ) : state.payments.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state__title">Belum ada pembayaran</p>
          <p className="empty-state__description">
            Invoice ini belum ada pembayaran yang tercatat.
          </p>
        </div>
      ) : (
        <div className="payment-history">
          <table className="table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Nominal</th>
                <th>Metode</th>
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              {state.payments.map((p) => (
                <tr key={p.id}>
                  <td>{formatDateId(p.payment_date)}</td>
                  <td className="table__cell--mono">{formatRupiah(p.amount)}</td>
                  <td>{p.payment_method}</td>
                  <td>{p.reference || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
};