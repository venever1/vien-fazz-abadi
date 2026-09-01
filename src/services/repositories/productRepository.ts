import type { Product } from '../../types';
import { apiClient } from '../api/client';

export const getProducts = async (): Promise<Product[]> => {
  return apiClient.get<Product[]>('/products');
};
