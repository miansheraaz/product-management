import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { productService } from '../services/productService';
import type { PaginationInfo, Product, ProductFilters, SortField, SortOrder } from '../types';

export type GetProductsArgs = {
  filters?: ProductFilters;
  page?: number;
  limit?: number;
  sortBy?: SortField;
  sortOrder?: SortOrder;
};

type ProductsState = {
  items: Product[];
  pagination: PaginationInfo | null;
  loading: boolean;
  error: string | null;
  lastArgs: GetProductsArgs | null;
};

const initialState: ProductsState = {
  items: [],
  pagination: null,
  loading: false,
  error: null,
  lastArgs: null
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (args: GetProductsArgs) => {
    const response = await productService.getAllProducts(args);
    return { products: response.products, pagination: response.pagination, args };
  }
);

export const deleteProductById = createAsyncThunk(
  'products/deleteProductById',
  async (id: number | string) => {
    await productService.deleteProduct(id);
    return id;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductsError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.lastArgs = action.meta.arg;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to load products. Please try again.';
      })
      .addCase(deleteProductById.fulfilled, (state, action) => {
        const deletedId = Number(action.payload);
        state.items = state.items.filter((p) => p.id !== deletedId);
      })
      .addCase(deleteProductById.rejected, (state) => {
        state.error = 'Failed to delete product. Please try again.';
      });
  }
});

export const { clearProductsError } = productsSlice.actions;
export default productsSlice.reducer;

