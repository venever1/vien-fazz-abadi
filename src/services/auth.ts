import { apiClient } from './api/client';

export interface AuthUser {
  id: string;
  username: string;
  role: 'Admin/Owner' | 'Staff Keuangan';
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export const authApi = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const res = await fetch(`${apiClient.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Login gagal.' }));
      throw new Error(err.message || 'Login gagal.');
    }
    return res.json();
  },
  logout: async (): Promise<void> => {
    try {
      await apiClient.delete<{ message: string }>('/auth/logout');
    } catch {
      // token sudah tidak valid; abaikan, pembersihan lokal tetap berjalan
    }
  },
};
