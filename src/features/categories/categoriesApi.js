import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const categoriesApi = createApi({
    reducerPath: 'categoriesApi',
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
    tagTypes: ['Category'],
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => '/categories',
        }),
        // addToCart: builder.mutation({
        //     query: (data) => ({
        //         url: '/users/cart',
        //         method: 'POST',
        //         body: data,
        //     }),
        //     invalidatesTags: ['Cart'],
        // }),
        // updateCartItem: builder.mutation({
        //     query: (data) => ({
        //         url: '/users/cart',
        //         method: 'PUT',
        //         body: data,
        //     }),
        //     invalidatesTags: ['Cart'],
        // }),
        // removeFromCart: builder.mutation({
        //     query: (productId) => ({
        //         url: `/users/cart/${productId}`,
        //         method: 'DELETE',
        //     }),
        //     invalidatesTags: ['Cart'],
        // })
    }),
});

export const {
    useGetCategoriesQuery,
    // useAddToCartMutation,
    // useUpdateCartItemMutation,
    // useRemoveFromCartMutation,
} = categoriesApi;