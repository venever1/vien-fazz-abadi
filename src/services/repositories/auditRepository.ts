import { apiClient } from '../api/client';

export interface AuditLog {
  id: string;
  user_id: string;
  username: string;
  action: string;
  entity: string;
  entity_id: string | null;
  details: string | null;
  created_at: string;
}

export const auditRepository = {
  getAuditLogs: async (): Promise<AuditLog[]> => {
    return apiClient.get<AuditLog[]>('/audit-logs');
  },
};
