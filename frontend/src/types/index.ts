// Type definitions for frontend
export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  inventory: number;
  status: 'active' | 'inactive' | 'discontinued';
  image: string | null;
  description: string | null;
  ownerId: number;
  owner: {
    id: number;
    name: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductOwner {
  id: number;
  name: string;
  email: string;
  productCount: number;
}

export interface ProductFormData {
  name: string;
  sku: string;
  price: string;
  inventory: string;
  status: 'active' | 'inactive' | 'discontinued';
  ownerId: string;
  image: string;
  description: string;
}

export interface ProductFilters {
  status?: string;
  ownerId?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ProductListResponse {
  products: Product[];
  pagination: PaginationInfo;
}

export type SortField = 'name' | 'sku' | 'price' | 'inventory' | 'status' | 'createdAt' | 'updatedAt';
export type SortOrder = 'ASC' | 'DESC';
