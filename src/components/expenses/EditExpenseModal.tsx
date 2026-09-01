import { useState } from 'react';
import type { FormEvent } from 'react';
import { updateExpense } from '../../services/repositories/expenseRepository';
import type { Expense } from '../../types';
import { validateExpense } from '../../utils/validation';
import { Button, Modal, useToast } from '../common';
import { ExpenseModalForm } from './ExpenseModalForm';

interface EditExpenseModalProps {
  open: boolean;
  expense: Expense | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditExpenseModal = ({ open, expense, onClose, onSuccess }: EditExpenseModalProps) => {
  const [draft, setDraft] = useState<Partial<Expense>>({});
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);
  const { showToast } = useToast();

  if (!expense) return null;

  if (!open && Object.keys(draft).length === 0) {
    return null;
  }

  const handleChange = (field: keyof Expense, value: string | number) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    setTouched(true);
  };

  const current = { ...expense, ...draft } as Expense;

  const errorMap = touched
    ? (validateExpense(current).issues || []).reduce(
        (acc, issue) => ({ ...acc, [issue.field]: issue.message }),
        {} as Record<string, string>,
      )
    : {};

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);

    const result = validateExpense(current);
    if (!result.valid) {
      return;
    }

    setSubmitting(true);
    try {
      await updateExpense(expense.id, {
        description: current.description,
        category: current.category,
        transaction_date: current.transaction_date,
        amount: Number(current.amount),
      });

      showToast('Pengeluaran berhasil diperbarui.', 'success');
      setDraft({});
      onSuccess();
      onClose();
    } catch {
      showToast('Data gagal disimpan.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Edit Pengeluaran"
      hint="Perbarui detail pengeluaran ini."
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </>
      }
    >
      <ExpenseModalForm
        formData={current}
        onChange={handleChange}
        errors={errorMap}
        onSubmit={handleSubmit}
        loading={submitting}
      />
    </Modal>
  );
};
