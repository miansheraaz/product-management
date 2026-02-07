import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { productOwnerService } from '../services/productOwnerService';
import type { ProductOwner } from '../types';

type OwnersState = {
  items: ProductOwner[];
  loading: boolean;
  error: string | null;
};

const initialState: OwnersState = {
  items: [],
  loading: false,
  error: null
};

export const fetchOwners = createAsyncThunk('owners/fetchOwners', async () => {
  const owners = await productOwnerService.getAllOwners();
  return owners;
});

const ownersSlice = createSlice({
  name: 'owners',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOwners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOwners.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOwners.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to load product owners. Please try again.';
      });
  }
});

export default ownersSlice.reducer;

