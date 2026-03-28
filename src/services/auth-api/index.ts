import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_DOMAIN } from '@utils/constants.ts';

import type {
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  LogoutRequest,
  LogoutResponse,
  PasswordResetResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  ResetPasswordRequest,
} from '@/types/auth.ts';
import type { UpdateUserRequest, UpdateUserResponse, User } from '@/types/user';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${API_DOMAIN}/` }),
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({
        url: 'auth/register',
        method: 'POST',
        body,
      }),
    }),
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: 'auth/login',
        method: 'POST',
        body,
      }),
    }),
    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenRequest>({
      query: (body) => ({
        url: 'auth/token',
        method: 'POST',
        body,
      }),
    }),
    logout: builder.mutation<LogoutResponse, LogoutRequest>({
      query: (body) => ({
        url: 'auth/logout',
        method: 'POST',
        body,
      }),
    }),
    forgotPassword: builder.mutation<PasswordResetResponse, ForgotPasswordRequest>({
      query: (body) => ({
        url: 'password-reset',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation<PasswordResetResponse, ResetPasswordRequest>({
      query: (body) => ({
        url: 'password-reset/reset',
        method: 'POST',
        body,
      }),
    }),
    getUser: builder.query<{ success: boolean; user: User }, string>({
      query: (token) => ({
        url: 'auth/user',
        method: 'GET',
        headers: {
          Authorization: token,
        },
      }),
    }),
    updateUser: builder.mutation<
      UpdateUserResponse,
      { body: UpdateUserRequest; accessToken: string }
    >({
      query: ({ body, accessToken }) => ({
        url: 'auth/user',
        method: 'PATCH',
        body,
        headers: {
          Authorization: accessToken,
        },
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetUserQuery,
  useUpdateUserMutation,
} = authApi;
