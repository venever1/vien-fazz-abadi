import { useEffect, useState } from 'react';
import type { Company, Invoice, Payment } from '../../types';
import { getCompanyFromApi } from '../../services/repositories/companyRepository';
import { getInvoicesByCompanyFromApi } from '../../services/repositories/invoiceRepository';
import { getPaymentsByInvoiceFromApi } from '../../services/repositories/paymentRepository';
import { formatRupiah } from '../../utils/currency';
import { formatDateId } from '../../utils/date';
import { Modal, ProgressBar, StatusBadge } from '../common';
import { TableSkeleton } from '../common/Skeleton';

interface CompanyDetailModalProps {
  open: boolean;
  companyId: string | null;
  companyName: string | null;
  onClose: () => void;
}

interface InvoiceRow extends Invoice {
  payments: Payment[];
}

interface DetailState {
  status: 'loading' | 'success' | 'error';
  company?: Company;
  invoices: InvoiceRow[];
  message?: string;
}

export const CompanyDetailModal = ({ open, companyId, companyName, onClose }: CompanyDetailModalProps) => {
  const [state, setState] = useState<DetailState>({ status: 'loading', invoices: [] });
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !companyId) return;

    let active = true;
    setState({ status: 'loading', invoices: [] });
    setExpanded(null);

    const load = async () => {
      try {
        const [company, invoices] = await Promise.all([
          getCompanyFromApi(companyId),
          getInvoicesByCompanyFromApi(companyId),
        ]);
        const invoicesWithPayments: InvoiceRow[] = await Promise.all(
          invoices.map(async (inv) => {
            const payments = await getPaymentsByInvoiceFromApi(inv.id);
            return { ...inv, payments };
          })
        );
        if (active) setState({ status: 'success', company, invoices: invoicesWithPayments });
      } catch {
        if (active) setState({ status: 'error', invoices: [], message: 'Gagal memuat detail transaksi.' });
      }
    };
    load();

    return () => { active = false; };
  }, [open, companyId]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  return (
    <Modal
      open={open}
      title={`Detail Transaksi — ${companyName ?? ''}`}
      onClose={onClose}
      hint="Daftar invoice dan pembayaran perusahaan ini"
      footer={
        <button className="btn btn--secondary" onClick={onClose}>
          Tutup
        </button>
      }
    >
      {state.status === 'loading' && <TableSkeleton rows={3} columns={4} />}

      {state.status === 'error' && (
        <div className="inline-alert inline-alert--error" role="alert">
          {state.message}
        </div>
      )}

      {state.status === 'success' && state.company && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            padding: '12px',
            background: 'var(--panel-2)',
            borderRadius: '8px',
            marginBottom: '16px',
          }}
        >
          <div>
            <p style={{ margin: '0 0 2px', fontSize: '11px', fontWeight: 600, color: 'var(--ink-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Jenis Usaha
            </p>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)' }}>
              {state.company.business_description || '-'}
            </p>
          </div>
          <div>
            <p style={{ margin: '0 0 2px', fontSize: '11px', fontWeight: 600, color: 'var(--ink-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Contact Person
            </p>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)' }}>
              {state.company.contact_person || '-'}
            </p>
          </div>
          <div>
            <p style={{ margin: '0 0 2px', fontSize: '11px', fontWeight: 600, color: 'var(--ink-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Telepon
            </p>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)' }}>
              {state.company.phone || '-'}
            </p>
          </div>
          <div>
            <p style={{ margin: '0 0 2px', fontSize: '11px', fontWeight: 600, color: 'var(--ink-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Alamat
            </p>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)' }}>
              {state.company.address || '-'}
            </p>
          </div>
        </div>
      )}

      {state.status === 'success' && state.invoices.length === 0 && (
        <div className="empty-state">
          <p className="empty-state__title">Belum ada invoice</p>
          <p className="empty-state__description">Perusahaan ini belum memiliki tagihan.</p>
        </div>
      )}

      {state.status === 'success' && state.invoices.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {state.invoices.map((inv) => (
            <div
              key={inv.id}
              className="panel"
              style={{ border: '1px solid var(--line)' }}
            >
              <div
                className="panel__header"
                style={{ cursor: 'pointer' }}
                onClick={() => toggleExpand(inv.id)}
                role="button"
                aria-expanded={expanded === inv.id}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleExpand(inv.id);
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <div>
                    <span className="table__cell--mono" style={{ fontSize: '13px', fontWeight: 600 }}>
                      {inv.invoice_number}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--ink-dim)', marginLeft: '12px' }}>
                      {formatDateId(inv.invoice_date)} — jatuh tempo {formatDateId(inv.due_date)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="table__cell--mono" style={{ fontSize: '13px' }}>
                      {formatRupiah(inv.paid_amount)} / {formatRupiah(inv.total_amount)}
                    </span>
                    <StatusBadge status={inv.status} />
                    <span style={{ fontSize: '11px', color: 'var(--ink-dim)' }}>
                      {expanded === inv.id ? '▾' : '▸'}
                    </span>
                  </div>
                </div>
              </div>

              {expanded === inv.id && (
                <div className="panel__body" style={{ borderTop: '1px solid var(--line)' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--ink-dim)' }}>Progress:</span>
                    <div style={{ width: '120px', marginTop: '4px' }}>
                      <ProgressBar progress={(inv.paid_amount / inv.total_amount) * 100} />
                    </div>
                  </div>

                  {inv.payments.length === 0 ? (
                    <p style={{ fontSize: '12px', color: 'var(--ink-dim)', margin: 0 }}>
                      Belum ada pembayaran untuk invoice ini.
                    </p>
                  ) : (
                    <table className="table" style={{ fontSize: '12px' }}>
                      <thead>
                        <tr>
                          <th>Tanggal</th>
                          <th>Nominal</th>
                          <th>Metode</th>
                          <th>Referensi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inv.payments.map((p) => (
                          <tr key={p.id}>
                            <td>{formatDateId(p.payment_date)}</td>
                            <td className="table__cell--mono">{formatRupiah(p.amount)}</td>
                            <td>{p.payment_method}</td>
                            <td>{p.reference || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};
