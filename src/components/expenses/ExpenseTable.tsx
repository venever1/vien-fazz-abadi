import type { Expense } from '../../types';
import { formatRupiah } from '../../utils/currency';
import { formatDateId } from '../../utils/date';
import { Button } from '../common';
import { ExpenseCategoryBadge } from './ExpenseCategoryBadge';

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (e: Expense) => void;
  onDelete: (e: Expense) => void;
}

export const ExpenseTable = ({ expenses, onEdit, onDelete }: ExpenseTableProps) => {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Keterangan</th>
            <th>Kategori</th>
            <th>Tanggal</th>
            <th>Jumlah</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp.id}>
              <td>
                <span className="table__cell--title">{exp.description}</span>
                {exp.notes && <span className="table__cell--subtitle">{exp.notes}</span>}
              </td>
              <td>
                <ExpenseCategoryBadge category={exp.category} />
              </td>
              <td>{formatDateId(exp.transaction_date)}</td>
              <td className="table__cell--mono">{formatRupiah(exp.amount)}</td>
              <td>
                <div className="toolbar__group">
                  <Button variant="secondary" size="sm" onClick={() => onEdit(exp)}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => onDelete(exp)}>Hapus</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
