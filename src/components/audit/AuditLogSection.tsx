import { useEffect, useState } from 'react';
import { auditRepository, type AuditLog } from '../../services/repositories/auditRepository';
import { formatDateId } from '../../utils/date';
import { Button, EmptyState, useToast } from '../common';
import { TableSkeleton } from '../common/Skeleton';

type AuditLogState =
  | { status: 'loading' }
  | { status: 'success'; logs: AuditLog[] }
  | { status: 'error'; message: string };

const actionLabels: Record<string, string> = {
  CREATE: 'Dibuat',
  UPDATE: 'Diubah',
  DELETE: 'Dihapus',
  STATUS_CHANGE: 'Status Diubah',
};

export const AuditLogSection = () => {
  const [state, setState] = useState<AuditLogState>({ status: 'loading' });
  const { showToast } = useToast();

  useEffect(() => {
    let active = true;
    setState({ status: 'loading' });

    auditRepository
      .getAuditLogs()
      .then((logs) => {
        if (active) setState({ status: 'success', logs });
      })
      .catch(() => {
        if (active) setState({ status: 'error', message: 'Gagal memuat log audit.' });
      });

    return () => {
      active = false;
    };
  }, []);

  const retry = () => {
    setState({ status: 'loading' });
    auditRepository
      .getAuditLogs()
      .then((logs) => {
        setState({ status: 'success', logs });
      })
      .catch(() => {
        setState({ status: 'error', message: 'Gagal memuat log audit.' });
        showToast('Gagal memuat log audit.', 'error');
      });
  };

  let body: React.ReactNode;
  if (state.status === 'loading') {
    body = <TableSkeleton rows={8} columns={6} />;
  } else if (state.status === 'error') {
    body = (
      <div className="inline-alert inline-alert--error" role="alert">
        {state.message}
        <div style={{ marginTop: '8px' }}>
          <Button variant="secondary" size="sm" onClick={retry}>
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  } else if (state.logs.length === 0) {
    body = (
      <EmptyState
        title="Belum ada log audit."
        description="Aktivitas pembuatan, perubahan, dan penghapusan data akan tercatat di sini."
      />
    );
  } else {
    body = (
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Pengguna</th>
              <th>Aksi</th>
              <th>Entitas</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {state.logs.map((log) => (
              <tr key={log.id}>
                <td>{formatDateId(log.created_at)}</td>
                <td>{log.username}</td>
                <td>
                  <span className={`badge badge--${log.action === 'DELETE' ? 'danger' : log.action === 'CREATE' ? 'ok' : 'amber'}`}>
                    {actionLabels[log.action] ?? log.action}
                  </span>
                </td>
                <td>{log.entity}</td>
                <td style={{ fontSize: '11px', color: 'var(--ink-dim)' }}>
                  {log.details ?? '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="panel section-gap">
      <div className="panel__header">
        <h2 className="panel__title">Log Aktivitas</h2>
      </div>
      <div className="panel__body">{body}</div>
    </div>
  );
};
