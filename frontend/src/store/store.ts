import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import ownersReducer from './ownersSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    owners: ownersReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
