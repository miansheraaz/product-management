// ProductOwner service
import api from './api';
import { ProductOwner } from '../types';

export const productOwnerService = {
  getAllOwners: async (): Promise<ProductOwner[]> => {
    const response = await api.get('/product-owners');
    return response.data;
  },

  getOwnerById: async (id: string | number): Promise<ProductOwner> => {
    const response = await api.get(`/product-owners/${id}`);
    return response.data;
  },

  createOwner: async (ownerData: { name: string; email: string }): Promise<ProductOwner> => {
    const response = await api.post('/product-owners', ownerData);
    return response.data;
  }
};
