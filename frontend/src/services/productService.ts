// Product service
import api from './api';
import { Product, ProductFilters, ProductListResponse, SortField, SortOrder } from '../types';

interface ProductCreateData {
  name: string;
  sku: string;
  price: number;
  inventory: number;
  status: string;
  ownerId: number;
  description?: string | null;
  image?: string | null;
}

interface GetAllProductsOptions {
  filters?: ProductFilters;
  page?: number;
  limit?: number;
  sortBy?: SortField;
  sortOrder?: SortOrder;
}

export const productService = {
  getAllProducts: async (options: GetAllProductsOptions = {}): Promise<ProductListResponse> => {
    const { filters = {}, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = options;
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.ownerId) params.append('ownerId', filters.ownerId);
    if (filters.search) params.append('search', filters.search);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    params.append('sortBy', sortBy);
    params.append('sortOrder', sortOrder);
    
    const response = await api.get<ProductListResponse>(`/products?${params.toString()}`);
    return response.data;
  },

  getProductById: async (id: string | number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (productData: ProductCreateData, imageFile: File | null = null): Promise<Product> => {
    const formData = new FormData();
    
    // Append all product data
    Object.keys(productData).forEach(key => {
      const value = (productData as any)[key];
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value.toString());
      }
    });

    // Append image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  updateProduct: async (id: string | number, productData: ProductCreateData, imageFile: File | null = null): Promise<Product> => {
    const formData = new FormData();
    
    // Append all product data
    Object.keys(productData).forEach(key => {
      const value = (productData as any)[key];
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value.toString());
      }
    });

    // Append image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await api.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  deleteProduct: async (id: string | number): Promise<void> => {
    await api.delete(`/products/${id}`);
  }
};
