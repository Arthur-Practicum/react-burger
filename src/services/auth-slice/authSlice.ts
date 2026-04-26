import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { API_DOMAIN } from '@utils/constants.ts';

import type { User } from '@/types/user.ts';

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
};

export const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isInitialized: false,
  isLoading: false,
};

const clearAuthStorage = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

export const checkAuth = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/checkAuth',
  async (_, { dispatch, rejectWithValue }) => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken) {
      clearAuthStorage();
      return;
    }

    try {
      const response = await fetch(`${API_DOMAIN}/auth/user`, {
        method: 'GET',
        headers: {
          Authorization: accessToken,
        },
      });

      if (!response.ok) {
        clearAuthStorage();
        return rejectWithValue('Неверный токен');
      }

      const data = (await response.json()) as { success: boolean; user: User };

      if (data.success && data.user) {
        dispatch(setAuthTokens({ user: data.user, accessToken, refreshToken }));
      }
    } catch {
      clearAuthStorage();
      return rejectWithValue('Ошибка проверки пользователя');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthTokens: (
      state,
      action: PayloadAction<{ user: User; accessToken: string; refreshToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;

      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      localStorage.setItem('accessToken', action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      clearAuthStorage();
    },
    restoreAuth: (state) => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const userStr = localStorage.getItem('user');

      if (accessToken && refreshToken && userStr) {
        try {
          const user = JSON.parse(userStr) as User;
          state.user = user;
          state.accessToken = accessToken;
          state.refreshToken = refreshToken;
          state.isAuthenticated = true;
        } catch {
          clearAuthStorage();
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state) => {
        state.isInitialized = true;
        state.isLoading = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
        state.isLoading = false;
      });
  },
});

export const { setAuthTokens, logout, updateAccessToken, restoreAuth } =
  authSlice.actions;

export default authSlice.reducer;
