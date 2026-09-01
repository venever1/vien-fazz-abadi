import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PaymentRow } from '../../application/payments/getPaymentRows';
import {
  filterPaymentRows,
  getPaymentRows,
} from '../../application/payments/getPaymentRows';
import { deleteInvoice } from '../../services/repositories/invoiceRepository';
import { buildPaymentCsv, buildPaymentExcel, buildPaymentPdf } from '../../utils/exportBuilders';
import { Button, ConfirmModal, EmptyState, useToast } from '../common';
import { AddCompanyModal } from '../companies/AddCompanyModal';
import { RecordPaymentModal } from './RecordPaymentModal';
import { PaymentFilters } from './PaymentFilters';
import { PaymentTable } from './PaymentTable';
import { PaymentHistory } from './PaymentHistory';
import { CompanyDetailModal } from '../companies/CompanyDetailModal';
import { TableSkeleton } from '../common/Skeleton';
import { useAuth } from '../auth/AuthContext';

export const PaymentSection = () => {
  const { isAdmin } = useAuth();
  const [rows, setRows] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Belum Bayar' | 'Cicilan' | 'Lunas'>('Semua');
  const [confirmDelete, setConfirmDelete] = useState<PaymentRow | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [paymentRow, setPaymentRow] = useState<PaymentRow | null>(null);
  const [historyRow, setHistoryRow] = useState<PaymentRow | null>(null);
  const [detailRow, setDetailRow] = useState<PaymentRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPaymentRows();
      setRows(data);
    } catch (error) {
      showToast('Data gagal dimuat.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(
    () => filterPaymentRows(rows, search, statusFilter),
    [rows, search, statusFilter],
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deleteInvoice(confirmDelete.invoiceId);
      showToast('Perusahaan dihapus.', 'success');
      setConfirmDelete(null);
      load();
    } catch {
      showToast('Gagal menghapus data.', 'error');
    } finally {
      setDeleting(false);
    }
  }, [confirmDelete, load, showToast]);

  return (
    <div className="panel section-gap">
      <div className="panel__header">
        <h2 className="panel__title">Monitoring Pembayaran</h2>
        {isAdmin && (
          <Button variant="primary" size="sm" onClick={() => setIsAddModalOpen(true)}>
            + Tambah Perusahaan
          </Button>
        )}
      </div>
      <PaymentFilters
        search={search}
        statusFilter={statusFilter}
        onSearchChange={setSearch}
        onStatusFilterChange={setStatusFilter}
        onExport={() => {
          buildPaymentCsv(filtered, 'pembayaran-perusahaan');
          showToast('Data pembayaran berhasil diexport.', 'success');
        }}
        onExportExcel={() => {
          buildPaymentExcel(filtered, 'pembayaran-perusahaan');
          showToast('Data pembayaran berhasil diexport ke Excel.', 'success');
        }}
        onExportPdf={() => {
          buildPaymentPdf(filtered, 'pembayaran-perusahaan');
        }}
      />
      {loading ? (
        <TableSkeleton rows={5} columns={7} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Belum ada perusahaan."
          description={rows.length === 0 ? 'Tambahkan perusahaan untuk mulai memonitor pembayaran.' : 'Tidak ada perusahaan yang cocok dengan filter.'}
          actionLabel={isAdmin ? 'Tambah Perusahaan' : undefined}
          onAction={isAdmin ? () => setIsAddModalOpen(true) : undefined}
        />
      ) : (
        <PaymentTable
          rows={filtered}
          onMarkAsPaid={setPaymentRow}
          onDelete={(row) => setConfirmDelete(row)}
          onViewHistory={setHistoryRow}
          onViewDetail={setDetailRow}
          canDelete={isAdmin}
        />
      )}

      <AddCompanyModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={load}
      />

      <RecordPaymentModal
        open={!!paymentRow}
        row={paymentRow}
        onClose={() => setPaymentRow(null)}
        onSuccess={load}
      />

      <PaymentHistory
        open={!!historyRow}
        invoiceId={historyRow?.invoiceId ?? null}
        onClose={() => setHistoryRow(null)}
      />

      <CompanyDetailModal
        open={!!detailRow}
        companyId={detailRow?.companyId ?? null}
        companyName={detailRow?.companyName ?? null}
        onClose={() => setDetailRow(null)}
      />

      <ConfirmModal
        open={!!confirmDelete}
        title="Hapus Perusahaan"
        message={`Apakah Anda yakin ingin menghapus "${confirmDelete?.companyName}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete(null)}
        loading={deleting}
        confirmLabel="Hapus"
      />
    </div>
  );
};
