import { useEffect, useState } from 'react';
import { getDueReminders } from '../../application/dashboard/getDueReminders';
import type { DueReminderInfo } from '../../domain/finance';
import { formatRupiah } from '../../utils/currency';
import { formatDateId } from '../../utils/date';
import { buildWhatsAppLink } from '../../utils/whatsapp';
import { EmptyState } from '../common/EmptyState';

type ReminderState =
  | { status: 'loading' }
  | { status: 'success'; reminders: DueReminderInfo[] }
  | { status: 'error'; message: string };

const tierLabel: Record<DueReminderInfo['tier'], string> = {
  overdue: 'Terlambat',
  'due-soon': 'Segera Jatuh Tempo',
  upcoming: 'Akan Datang',
};

export const DueDateReminderSection = () => {
  const [state, setState] = useState<ReminderState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    getDueReminders()
      .then((reminders) => {
        if (active) setState({ status: 'success', reminders });
      })
      .catch(() => {
        if (active) setState({ status: 'error', message: 'Gagal memuat pengingat jatuh tempo.' });
      });
    return () => { active = false; };
  }, []);

  const overdueCount = state.status === 'success'
    ? state.reminders.filter((r) => r.tier === 'overdue').length
    : 0;

  let body: React.ReactNode;
  if (state.status === 'loading') {
    body = <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-dim)' }}>Memuat pengingat...</p>;
  } else if (state.status === 'error') {
    body = <div className="inline-alert inline-alert--error" role="alert">{state.message}</div>;
  } else if (state.reminders.length === 0) {
    body = <EmptyState title="Tidak ada tagihan mendekati jatuh tempo." description="Semua pembayaran terkini dalam periode aman." />;
  } else {
    body = (
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Perusahaan</th>
              <th>Jatuh Tempo</th>
              <th>Sisa Tagihan</th>
              <th>Status</th>
              <th>Notifikasi</th>
            </tr>
          </thead>
          <tbody>
            {state.reminders.map((r) => {
              const waLink = r.companyPhone
                ? buildWhatsAppLink(
                    r.companyPhone,
                    `Pengingat: Tagihan ${r.companyName} sebesar ${formatRupiah(r.remainingAmount)} jatuh tempo ${formatDateId(r.dueDate)}. Mohon segera ditindaklanjuti.`,
                  )
                : '';
              return (
                <tr key={r.invoiceId}>
                  <td>
                    <span className="table__cell--title">{r.companyName}</span>
                  </td>
                  <td>
                    {formatDateId(r.dueDate)}
                    <span
                      style={{ display: 'block', fontSize: '11px', color: r.daysUntilDue < 0 ? 'var(--danger)' : 'var(--ink-dim)' }}
                    >
                      {r.daysUntilDue < 0
                        ? `${Math.abs(r.daysUntilDue)} hari terlambat`
                        : r.daysUntilDue === 0
                          ? 'Hari ini'
                          : `${r.daysUntilDue} hari lagi`}
                    </span>
                  </td>
                  <td className="table__cell--mono">{formatRupiah(r.remainingAmount)}</td>
                  <td>
                    <span className={`badge badge--${r.tier === 'overdue' ? 'danger' : r.tier === 'due-soon' ? 'amber' : 'ok'}`}>
                      {tierLabel[r.tier]}
                    </span>
                  </td>
                  <td>
                    {waLink ? (
                      <a
                        className="btn btn--secondary btn--sm"
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Kirim WA
                      </a>
                    ) : (
                      <span style={{ fontSize: '11px', color: 'var(--ink-dim)' }}>-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="panel section-gap">
      <div className="panel__header">
        <h2 className="panel__title">Pengingat Jatuh Tempo</h2>
        {state.status === 'success' && overdueCount > 0 && (
          <span className="badge badge--danger">{overdueCount} terlambat</span>
        )}
      </div>
      <div className="panel__body">{body}</div>
    </div>
  );
};
