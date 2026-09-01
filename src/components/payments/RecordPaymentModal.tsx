import { useState } from 'react';
import type { FormEvent } from 'react';
import { recordPayment } from '../../application/payments/recordPayment';
import { formatRupiah } from '../../utils/currency';
import { Button, Modal, TextInput, useToast } from '../common';
import type { PaymentRow } from '../../application/payments/getPaymentRows';

interface RecordPaymentModalProps {
  open: boolean;
  row: PaymentRow | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const RecordPaymentModal = ({ open, row, onClose, onSuccess }: RecordPaymentModalProps) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [method, setMethod] = useState('Transfer');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [overpaymentConfirmed, setOverpaymentConfirmed] = useState(false);
  const { showToast } = useToast();

  if (!row) return null;

  const remaining = row.totalAmount - row.paidAmount;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const amountNum = Number(amount);

    if (isNaN(amountNum) || amountNum <= 0) {
      showToast('Nominal pembayaran harus lebih dari 0.', 'error');
      return;
    }

    if (amountNum > remaining && !overpaymentConfirmed) {
      setOverpaymentConfirmed(true);
      return;
    }

    setSubmitting(true);

    try {
      await recordPayment({
        invoice_id: row.invoiceId,
        amount: amountNum,
        payment_date: date,
        payment_method: method,
        notes,
        allowOverpayment: overpaymentConfirmed,
      });

      showToast('Pembayaran berhasil dicatat.', 'success');
      setAmount('');
      setOverpaymentConfirmed(false);
      onSuccess();
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Gagal mencatat pembayaran.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Catat Pembayaran"
      hint={`Mencatat pembayaran untuk ${row.companyName}`}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Batal
          </Button>
          <Button
            variant={overpaymentConfirmed ? 'danger' : 'primary'}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Memproses...' : overpaymentConfirmed ? 'Konfirmasi Lebih Bayar' : 'Simpan Pembayaran'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ padding: '12px', background: 'var(--panel-2)', borderRadius: '8px', fontSize: '12px' }}>
          <p style={{ margin: '0 0 4px', color: 'var(--ink-dim)' }}>Sisa Tagihan:</p>
          <p style={{ margin: 0, fontSize: '16px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
            {formatRupiah(remaining)}
          </p>
        </div>

        {overpaymentConfirmed && (
          <div className="inline-alert inline-alert--error">
            Nominal pembayaran ({formatRupiah(Number(amount))}) melebihi sisa tagihan. Klik konfirmasi jika ingin tetap melanjutkan (nominal akan dibatasi hingga pelunasan).
          </div>
        )}

        <TextInput
          label="Nominal Pembayaran (Rp)"
          inputType="number"
          placeholder="cth. 5000000"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setOverpaymentConfirmed(false);
          }}
          required
          autoFocus
        />

        <TextInput
          label="Tanggal Pembayaran"
          inputType="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <div className="field">
          <label className="field__label">Metode Pembayaran</label>
          <div className="field__select-wrapper">
            <select
              className="field__select"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="Transfer">Transfer Bank</option>
              <option value="Tunai">Tunai / Cash</option>
              <option value="Cek">Cek / Giro</option>
            </select>
          </div>
        </div>

        <TextInput
          label="Catatan (Opsional)"
          placeholder="cth. Pembayaran tahap 2"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </form>
    </Modal>
  );
};
