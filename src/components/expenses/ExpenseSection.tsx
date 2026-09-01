import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Expense, ExpenseCategory } from '../../types';
import { filterExpenses } from '../../application/expenses/getExpenseRows';
import {
  deleteExpense,
  getExpenses,
} from '../../services/repositories/expenseRepository';
import { buildExpenseCsv, buildExpenseExcel, buildExpensePdf } from '../../utils/exportBuilders';
import { getMonthsRange } from '../../utils/date';
import { ConfirmModal, EmptyState, useToast } from '../common';
import { TableSkeleton } from '../common/Skeleton';
import { AddExpenseModal } from './AddExpenseModal';
import { EditExpenseModal } from './EditExpenseModal';
import { ExpenseFilters } from './ExpenseFilters';
import { ExpenseSummary } from './ExpenseSummary';
import { ExpenseTable } from './ExpenseTable';
import { useAuth } from '../auth/AuthContext';

interface ExpenseSectionProps {
  monthsBack: number;
}

const isInPeriod = (date: string, start: string | null, end: string | null): boolean => {
  if (!start || !end) return true;
  return date >= start && date <= end;
};

export const ExpenseSection = ({ monthsBack }: ExpenseSectionProps) => {
  const { isAdmin } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ExpenseCategory | 'Semua'>('Semua');
  const [month, setMonth] = useState('Semua');
  const [confirmDelete, setConfirmDelete] = useState<Expense | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch {
      showToast('Data pengeluaran gagal dimuat.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const { start, end } = useMemo(() => getMonthsRange(new Date(), monthsBack), [monthsBack]);

  const periodFiltered = useMemo(
    () =>
      expenses.filter((e) => {
        const matchesMonth = month === 'Semua' || e.transaction_date.startsWith(month);
        const matchesPeriod = isInPeriod(e.transaction_date, start, end);
        return matchesMonth && matchesPeriod;
      }),
    [expenses, month, start, end],
  );

  const filtered = filterExpenses(periodFiltered, {
    search,
    category,
  });

  const handleDeleteConfirm = useCallback(async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deleteExpense(confirmDelete.id);
      showToast('Pengeluaran berhasil dihapus.', 'success');
      setConfirmDelete(null);
      load();
    } catch {
      showToast('Gagal menghapus data.', 'error');
    } finally {
      setDeleting(false);
    }
  }, [confirmDelete, load, showToast]);

  return (
    <div className="dashboard__expense section-gap">
      <div className="dashboard__expense-table">
        <div className="panel">
          <div className="panel__header">
            <h2 className="panel__title">Pengeluaran</h2>
          </div>
          <ExpenseFilters
            search={search}
            category={category}
            month={month}
            onSearchChange={setSearch}
            onCategoryChange={setCategory}
            onMonthChange={setMonth}
          onAdd={isAdmin ? () => setIsAddModalOpen(true) : undefined}
            onExport={() => {
              buildExpenseCsv(filtered, 'pengeluaran');
              showToast('Data pengeluaran berhasil diexport.', 'success');
            }}
            onExportExcel={() => {
              buildExpenseExcel(filtered, 'pengeluaran');
              showToast('Data pengeluaran berhasil diexport ke Excel.', 'success');
            }}
            onExportPdf={() => {
              buildExpensePdf(filtered, 'pengeluaran');
            }}
          />
          {loading ? (
            <TableSkeleton rows={5} columns={5} />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="Belum ada pengeluaran."
              description={expenses.length === 0 ? 'Tambahkan pengeluaran baru.' : 'Tidak ada hasil filter.'}
              actionLabel={isAdmin ? "Tambah Pengeluaran" : undefined}
              onAction={isAdmin ? () => setIsAddModalOpen(true) : undefined}
            />
          ) : (
            <ExpenseTable
              expenses={filtered}
              onEdit={setEditExpense}
              onDelete={(e) => setConfirmDelete(e)}
            />
          )}
        </div>
      </div>

      <div className="dashboard__expense-summary">
        <div className="panel">
          <ExpenseSummary expenses={filtered} />
        </div>
      </div>

      <AddExpenseModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={load}
      />

      <EditExpenseModal
        open={!!editExpense}
        expense={editExpense}
        onClose={() => setEditExpense(null)}
        onSuccess={load}
      />

      <ConfirmModal
        open={!!confirmDelete}
        title="Hapus Pengeluaran"
        message={`Hapus "${confirmDelete?.description}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete(null)}
        loading={deleting}
        confirmLabel="Hapus"
      />
    </div>
  );
};
