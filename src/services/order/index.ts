import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_DOMAIN } from '@utils/constants.ts';

import type { OrderRequest, OrderResponse } from '@/types/order.ts';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${API_DOMAIN}/` }),
  endpoints: (builder) => ({
    createOrder: builder.mutation<OrderResponse, OrderRequest>({
      query: (body) => ({
        url: 'orders',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useCreateOrderMutation } = orderApi;
