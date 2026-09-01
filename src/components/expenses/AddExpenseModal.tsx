import { useState } from 'react';
import type { FormEvent } from 'react';
import { createExpense } from '../../services/repositories/expenseRepository';
import type { Expense, ExpenseCategory } from '../../types';
import { validateExpense } from '../../utils/validation';
import { Button, Modal, useToast } from '../common';
import { ExpenseModalForm } from './ExpenseModalForm';

interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddExpenseModal = ({ open, onClose, onSuccess }: AddExpenseModalProps) => {
  const [formData, setFormData] = useState<Partial<Expense>>({});
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleChange = (field: keyof Expense, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const result = validateExpense(formData);
    if (!result.valid) {
      return;
    }

    setSubmitting(true);
    try {
      await createExpense({
        description: formData.description!,
        category: formData.category as ExpenseCategory,
        transaction_date: formData.transaction_date!,
        amount: formData.amount as number,
        notes: '',
      });

      showToast('Pengeluaran berhasil ditambahkan.', 'success');
      setFormData({});
      onSuccess();
      onClose();
    } catch {
      showToast('Data gagal disimpan.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const errorMap = (validateExpense(formData).issues || []).reduce(
    (acc, issue) => ({ ...acc, [issue.field]: issue.message }),
    {} as Record<string, string>,
  );

  return (
    <Modal
      open={open}
      title="Tambah Pengeluaran"
      hint="Masukkan detail pengeluaran baru."
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </>
      }
    >
      <ExpenseModalForm
        formData={formData}
        onChange={handleChange}
        errors={errorMap}
        onSubmit={handleSubmit}
        loading={submitting}
      />
    </Modal>
  );
};
