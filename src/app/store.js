import { authApi } from '@/features/auth/authApi';
import { categoriesApi } from '@/features/categories/categoriesApi';
import { productsApi } from '@/features/products/productsApi';
import { userApi } from '@/features/user/userApi';
import { configureStore } from '@reduxjs/toolkit';
// import authReducer from '@/features/auth/authSlice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    // auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(userApi.middleware)
      .concat(categoriesApi.middleware)
      .concat(productsApi.middleware),
});