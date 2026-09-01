import type { Company } from '../../types';
import { apiClient } from '../api/client';

export const getCompanies = async (): Promise<Company[]> => {
  return apiClient.get<Company[]>('/companies');
};

export const getCompanyById = async (id: string): Promise<Company | undefined> => {
  return apiClient.get<Company>(`/companies/${id}`);
};

export const getCompanyFromApi = async (id: string): Promise<Company> => {
  return apiClient.get<Company>(`/companies/${id}`);
};

export const createCompany = async (input: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Promise<Company> => {
  return apiClient.post<Company>('/companies', input);
};

export const updateCompany = async (id: string, input: Partial<Company>): Promise<Company | undefined> => {
  return apiClient.put<Company>(`/companies/${id}`, input);
};

export const deleteCompany = async (id: string): Promise<boolean> => {
  await apiClient.delete<{ id: string }>(`/companies/${id}`);
  return true;
};
