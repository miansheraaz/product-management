// Type definitions
import { Request, Response, NextFunction } from 'express';

export interface ProductData {
  name: string;
  sku: string;
  price: number;
  inventory: number;
  status: 'active' | 'inactive' | 'discontinued';
  ownerId: number;
  image?: string | null;
  description?: string | null;
}

export interface ProductOwnerData {
  name: string;
  email: string;
}

export interface ProductFilters {
  status?: string;
  ownerId?: string;
  search?: string;
}

export interface FormattedProduct {
  id: number;
  name: string;
  sku: string;
  price: number;
  inventory: number;
  status: string;
  image: string | null;
  description: string | null;
  ownerId: number;
  owner: {
    id: number;
    name: string;
    email: string;
  } | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface FormattedProductOwner {
  id: number;
  name: string;
  email: string;
  productCount: number;
}

export interface CustomRequest extends Request {
  file?: Express.Multer.File;
}

export type ControllerMethod = (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
