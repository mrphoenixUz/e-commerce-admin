import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3003',
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    getProduct: builder.query({
      query: (id) => `/products/${id}`,
    }),
    deleteProduct: builder.mutation({
      query: (categoryId) => ({
        url: `/products/${categoryId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: "Products" }],
    }),
  }),
});

export const { useGetProductQuery, useDeleteProductMutation } = productsApi;