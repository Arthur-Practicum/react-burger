import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_DOMAIN } from '@utils/constants.ts';

import type { Ingredient } from '@/types/ingredient.ts';

export const ingredientsApi = createApi({
  reducerPath: 'ingredientsApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${API_DOMAIN}/` }),
  endpoints: (builder) => ({
    getIngredients: builder.query({
      query: () => 'ingredients',
      transformResponse: (response: { data: Ingredient[] }) => response.data,
    }),
  }),
});

export const { useGetIngredientsQuery } = ingredientsApi;
