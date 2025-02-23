import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3003/products',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    // Get all products
    getProducts: builder.query({
      query: () => '/',
      providesTags: ["Products"],
    }),

    // Get a single product by ID
    getProduct: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    // Create a new product
    createProduct: builder.mutation({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),

    // Update an existing product
    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Products", id }],
    }),

    // Delete a product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ["Products"],
    }),

    // Upload product images
    uploadProductImages: builder.mutation({
      query: ({ id, files }) => {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append('files', file);
        });

        return {
          url: `/upload/${id}`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Products", id }],
    }),

    // Search products
    searchProducts: builder.query({
      query: (query) => `/search/${query}`,
      providesTags: ["Products"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImagesMutation,
  useSearchProductsQuery,
} = productsApi;
